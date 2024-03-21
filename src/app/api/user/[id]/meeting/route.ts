import { days } from "@/app/signup/utils"
import { UserMeeting } from "@/models/meetingUserRelationship"
import { Meetings } from "@/models/meetings"
import { Users } from "@/models/user"
import { UserAvailability } from "@/models/userAvailability"
import { IMeetingPayload } from "@/types/meeting"
import { convertMinutesToTime } from "@/utils/convertMinutesToTime"
import { NextApiResponse } from "next"
import { NextResponse } from "next/server"
import { Op } from "sequelize"
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        if (!id) {
            return NextResponse.json({
                message: 'id is required'
            }, { status: 400 })
        }
        const meetingRecords = await Meetings.findAll();

        const userScheduledMeetings = await UserMeeting.findAll({
            where: {
                [Op.or]: [
                    { source_user_id: id },
                    { target_user_id: id }
                ]
            }
        });
        const AvailableUsers = await Users.findAll({
            attributes: ['name', 'id']
        })
        const userScheduledMeetingIds = userScheduledMeetings.map(meeting => meeting.dataValues.meeting_id)
        const selectedUserMeetings = meetingRecords.filter(records => userScheduledMeetingIds.includes(records.dataValues.id))
        const selectedUserScheduledMeetings = userScheduledMeetings.map(userMeeting => {
            const meeting = selectedUserMeetings.find(scheduleduserMeeting => scheduleduserMeeting.dataValues.id === userMeeting.dataValues.meeting_id)
            return { ...userMeeting.dataValues, meeting_day: meeting?.dataValues.meeting_day, meeting_start: meeting?.dataValues.meeting_start, meeting_end: meeting?.dataValues.meeting_end }
        })

        const selectedUserScheduledMeetingsWithUserNames = selectedUserScheduledMeetings.map(meeting => {
            const source_user = AvailableUsers.find(user => user.dataValues.id === meeting.source_user_id);
            const target_user = AvailableUsers.find(user => user.dataValues.id === meeting.target_user_id);
            return {
                ...meeting,
                source_user_name: source_user ? source_user.dataValues.name : 'Unknown',
                target_user_name: target_user ? target_user.dataValues.name : 'Unknown'
            };
        });
        return NextResponse.json({
            data: selectedUserScheduledMeetingsWithUserNames,
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
        const payload = await req.json() as IMeetingPayload
        if (payload.target_user === null) {
            return NextResponse.json({
                message: 'target_user is required'
            }, { status: 400 })
        }
        if (payload.day === null) {
            return NextResponse.json({
                message: 'day is required'
            }, { status: 400 })
        }
        if (!payload.source_user) {
            return NextResponse.json({
                message: 'source_user is required'
            }, { status: 400 })
        }
        if (payload.startTime === null || payload.startTime < 0) {
            return NextResponse.json({
                message: 'startTime is required'
            }, { status: 400 })
        }
        if (payload.endTime === null || payload.endTime < 0) {
            return NextResponse.json({
                message: 'endTime is required'
            }, { status: 400 })
        }
        if (payload.startTime > payload.endTime) {
            return NextResponse.json({
                message: 'startTime cannot be greater than endTime'
            }, { status: 400 })
        }
        const isSourceUserAvailable = await UserAvailability.findAll({
            where: {
                user_id: payload.source_user
            }
        })
        if (isSourceUserAvailable.length === 0) {
            return NextResponse.json({
                message: 'Please Select your availability.',
            }, { status: 400 })
        }
        if (!(isSourceUserAvailable.some(data => payload.day! <= data.dataValues.available_day_end && payload.day! >= data.dataValues.available_day_start))) {
            return NextResponse.json({
                message: `You are not available on ${days[payload.day].name}`,
            }, { status: 400 })
        }
        const isTargetUserAvailable = await UserAvailability.findAll({
            where: {
                user_id: payload.target_user
            }
        })
        const isDayInRange = (day: number, start: number, end: number) => {
            if (start <= end) {
                return day >= start && day <= end;
            } else {
                return day >= start || day <= end;
            }
        };
        const isTimeInRange = (starttime: number, endtime: number, start: number, end: number) => {
            return starttime >= start && endtime <= end;
        };
        let isAvailableTime = { isAvailable: false, startTime: 0, endTime: 0, max_meetings: 0 };
        for (let i = 0; i < isTargetUserAvailable.length; i++) {
            const avail = isTargetUserAvailable[i];
            if (isDayInRange(payload.day, avail.dataValues.available_day_start, avail.dataValues.available_day_end)) {
                if (isTimeInRange(payload.startTime, payload.endTime, Number(avail.dataValues.available_time_start), Number(avail.dataValues.available_time_end))) {
                    isAvailableTime = { isAvailable: true, endTime: Number(avail.dataValues.available_time_end), startTime: Number(avail.dataValues.available_time_start), max_meetings: avail.dataValues.max_meetings }
                    break;
                }
                isAvailableTime = { isAvailable: false, endTime: Number(avail.dataValues.available_time_end), startTime: Number(avail.dataValues.available_time_start), max_meetings: avail.dataValues.max_meetings }

            }
        }
        const targetUserName = await Users.findOne({
            where: {
                id: payload.target_user
            },
            attributes: ['name']
        })
        if (isAvailableTime.isAvailable) {
            const targetUserScheduledMeetings = await UserMeeting.findAndCountAll({
                where: {
                    [Op.or]: [
                        { source_user_id: payload.target_user },
                        { target_user_id: payload.target_user }
                    ],
                }
            })
            if (targetUserScheduledMeetings.count >= isAvailableTime.max_meetings) {
                return NextResponse.json({
                    message: 'Meeting limit exceeded',
                }, { status: 400 })
            }
            const newMeeting = {
                meeting_start: payload.startTime,
                meeting_end: payload.endTime,
                meeting_day: payload.day
            }

            const response =
                await Meetings.create(newMeeting)
            const userMeetingPayload = {
                target_user_id: payload.target_user,
                source_user_id: payload.source_user,
                meeting_id: response.dataValues.id
            }
            await UserMeeting.create(userMeetingPayload)
            return NextResponse.json({
                data: isTargetUserAvailable,
                message: 'Meeting Added',
                code: 201,
                type: "Success",
            })

        } else {
            return NextResponse.json({
                message: `${targetUserName?.dataValues.name} is Available from ${convertMinutesToTime(isAvailableTime.startTime)} to ${convertMinutesToTime(isAvailableTime.endTime)}`,
            }, { status: 400 })

        }
    } catch (e) {
        return NextResponse.json({
            message: typeof (e) === 'object' ? 'Unexpected Error Occurred' : e
        }, { status: 500 })
    }
}
export async function DELETE(request: Request, response: NextApiResponse) {
    try {
        const body = await request.json()
        if (!body?.id) {
            return NextResponse.json({
                message: 'id is required'
            }, { status: 400 })
        }
        await UserMeeting.destroy({
            where: {
                meeting_id: body.id
            }
        })
        await Meetings.destroy({
            where: {
                id: body.id
            }
        });
        return NextResponse.json({
            message: 'Meeting Deleted',
            type: 'Success',
            code: 200
        })
    } catch (e) {
        return NextResponse.json({
            message: typeof (e) === 'object' ? 'Unexpected Error Occurred' : e
        }, { status: 500 })
    }
}