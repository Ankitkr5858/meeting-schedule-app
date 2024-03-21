import { NextResponse } from 'next/server';
import { NextApiResponse } from "next"
import { UserAvailability } from '@/models/userAvailability';
import { IUserAvailability } from '@/types';


export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const user_id = params.id
        if (!params.id) {
            NextResponse.json({
                message: 'id is required',
            }, { status: 400 })
        }
        const user = await UserAvailability.findAll({
            where: { user_id }
        })
        return NextResponse.json({
            data: user,
            type: 'Success',
            code: 200
        })
    } catch (e) {
        return NextResponse.json({
            message: typeof (e) === 'object' ? 'Unexpected Error Occurred' : e
        }, { status: 500 })
    }
}
export async function POST(req: Request, res: NextApiResponse) {
    try {
        const response = await req.json() as IUserAvailability
        if (!response.user_id) {
            return NextResponse.json({
                message: 'user_id is required',
            }, { status: 400 })
        }
        if (response.available_day_end < response.available_day_start) {
            return NextResponse.json({
                message: 'available_day_start cannot be greater than available_day_end',
            }, { status: 400 })
        }
        if (response.max_meetings <= 0) {
            return NextResponse.json({
                message: 'max_meeting atleast have to be 1',
            }, { status: 400 })
        }
        if (response.available_day_end < 0 || response.available_day_start < 0) {
            return NextResponse.json({
                message: 'weekly availability is required',
            }, { status: 400 })
        }
        const payload = {
            ...response,
            available_day_start: response.available_day_start,
            available_day_end: response.available_day_end,
        }
        await UserAvailability.create(payload)
        return NextResponse.json({
            message: 'Availability Added',
            code: 200,
            type: "Success",
        })
    } catch (e) {
        return NextResponse.json({
            message: typeof (e) === 'object' ? 'Unexpected Error Occurred' : e
        }, { status: 500 })
    }
}