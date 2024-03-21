import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { Users } from "@/models/user";

export async function POST(request: Request, response: NextApiResponse) {
  try {
    const { email, password } = await request.json();
    if (!email || email.trim() === '') {
      return NextResponse.json({
        message: "Email is required",
      }, {
        status:
          400
      });
    }
    const myUser = await Users.findOne({
      where: {
        email: email,
        password: password,
      },
    });
    if (!myUser) {
      return NextResponse.json({
        message: "User with given email and password not found",
      }, {
        status:
          400
      });
    }
    cookies().set("token", myUser.dataValues.id.toString())
    return NextResponse.json({
      data: myUser.dataValues,
      type: "Success",
      code: 200,
    });
  } catch (e) {
    return NextResponse.json({
      message: typeof (e) === 'object' ? 'Unexpected Error Occurred' : e
  }, { status: 500 })
  }
}
