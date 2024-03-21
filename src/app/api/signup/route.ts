import { Users } from '@/models/user';
import { ISignupPayload } from '@/types';
import { NextApiResponse } from 'next';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
export async function POST(request: Request, response: NextApiResponse) {
    try {
        if (request.method !== 'POST') {
            return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
        }
        const payload = await request.json() as ISignupPayload
        const keys = [' name', ' password', ' email', ' timeAvailabilityStart', ' timeAvailabilityEnd', ' bufferTime', ' dayAvailabilityStart', ' dayAvailabilityEnd']
        const emptyKeys = keys.filter(key => !(key.trim() in payload))
        if (emptyKeys.length > 0) {
            return NextResponse.json({ message: `The following keys are empty: ${emptyKeys}` }, { status: 400 })
        }
        const userPayload = { name: payload.name, email: payload.email, password: payload.password }
        const emailExisted = await Users.findOne({
            where: {
                email: payload.email
            }
        })
        if (emailExisted) {
            return NextResponse.json({
                message: "email already existed",
            }, { status: 400 })
        }
        const response = await Users.create(userPayload)
        cookies().set('token', response.dataValues.id.toString())
        return NextResponse.json({
            type: 'Success',
            message: "User Signed up successfully",
            payload,
        })
    } catch (e) {
        return NextResponse.json({
            message: typeof (e) === 'object' ? 'Unexpected Error Occurred' : e
        }, { status: 500 })
    }
}