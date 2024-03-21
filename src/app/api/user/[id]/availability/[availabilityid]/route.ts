import { UserAvailability } from "@/models/userAvailability";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; availabilityid: string } }
) {
  try {
    const { id, availabilityid } = params;
    if (!id) {
      NextResponse.json(
        {
          message: "id is required",
        },
        { status: 400 }
      );
    }
    if (!availabilityid) {
      NextResponse.json(
        {
          message: "availability Id is required",
        },
        { status: 400 }
      );
    }
    const availability = await UserAvailability.findOne({
      where: { user_id: id, id: availabilityid },
    });
    if (!availability) {
      NextResponse.json(
        {
          message: "availability not found on this id",
        },
        { status: 400 }
      );
    }
    await UserAvailability.destroy({
        where: { user_id: id, id: availabilityid },
      });
  
      return NextResponse.json({
        message: 'Availability deleted successfully',
        type: "Success",
        code: 200,
      });
  } catch (e) {
    return NextResponse.json({
      message: typeof (e) === 'object' ? 'Unexpected Error Occurred' : e
  }, { status: 500 })
  }
}
