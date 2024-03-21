"use client";
import React, { useEffect, useMemo, useState } from "react";
import MultiSelect from "@/components/common/MultiSelect";
import Button from "@/components/common/Button";
import { makeApiCall } from "@/utils/makeApiCall";
import { IDays, IGenericReponse, IToaster, IUser, IUserAvailabilityResponse } from "@/types";
import { IMeetingPayload, IMeetingRecords } from "@/types/meeting";
import { useRouter } from "next/navigation";
import { getCookies } from "cookies-next";
import { Toaster } from "@/components/common/Toaster";
import { days } from "../signup/utils";
import TimeRangePicker from "@/components/common/TimeRangePicker";
import { convertTimeToMinutes } from "@/utils/convertTimeToMinutes";
import Loader from "@/components/common/Loader";
import { convertMinutesToTime } from "@/utils/convertMinutesToTime";
const Meeting = () => {
  const router = useRouter();
  const loginToken = getCookies() as { token: string };
  const [userRecords, setUserRecords] = useState<IUser[]>([]);
  const [availableDays, setAvailableDays] = useState<IDays[]>([])
  const [scheduledMeetings, setScheduledMeetings] = useState<IMeetingRecords[]>([]);
  const [toaster, setToaster] = useState<IToaster>({
    message: "",
    isVisible: false,
    type: "positive",
  });
  const [newMeeting, setNewMeeting] = useState<IMeetingPayload>({
    source_user: parseInt(loginToken.token),
    target_user: null,
    startTime: 0,
    endTime: 0,
    day: null,
  });
  const [isFetchingUserRecords, setIsFetchingUserRecords] = useState(false);
  const [isFetchingUserMeetings, setIsFetchingUserMeetings] = useState(false);
  const [isAddingMeeting, setIsAddingMeeting] = useState(false);
  const [isFetchingDateRecords, setIsFetchingDateRecords] = useState(false);
  const [isCancellingMeeting, setIsCancellingMeeting] = useState<null | number>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [meetingTime, setMeetingTime] = useState({
    meetingTimeStart: "00:00",
    meetingTimeEnd: "00:00",
  })

  const handleSelectMeetingUser = (event: IUser[]) => {
    setNewMeeting((oldValue) => ({
      ...oldValue,
      target_user: event[0].id,
    }));
  };
  const handleDayChange = (event: IDays[]) => {
    setNewMeeting((oldValue) => ({
      ...oldValue,
      day: Number(event[0].id),
    }));
  }
  const handleAvailableTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: "meetingTimeEnd" | "meetingTimeStart"
  ) => {
    setMeetingTime((oldValue) => ({
      ...oldValue,
      [key]: event.target.value,
    }));
  };
  useEffect(() => {
    fetchUserRecords();
    fetchUserMeetings()
  }, []);
  useEffect(() => {
    if (newMeeting.target_user) {
      getUserAvailableDate(newMeeting.target_user);
    }
  }, [newMeeting.target_user]);
  const isAvailableTimeValid = useMemo(() => {
    const startTime = convertTimeToMinutes(
      meetingTime.meetingTimeStart
    );
    const endTime = convertTimeToMinutes(meetingTime.meetingTimeEnd);
    if (endTime < startTime) {
      return false;
    }
    return true;
  }, [
    meetingTime.meetingTimeStart,
    meetingTime.meetingTimeEnd,
  ]);
  const fetchUserRecords = async () => {
    try {
      setIsFetchingUserRecords(true);
      const response = await makeApiCall<IGenericReponse<IUser[]>>({
        endpoint: "user",
        method: "GET",
      });
      if (response.type === "Success") {
        const filteredRecords = response.data.filter(
          (record) => record.id !== Number(loginToken.token)
        );
        setUserRecords(filteredRecords);
      }
    } catch (e) {
      setToaster({ message: e as string, isVisible: true, type: 'negative' })
    }
    setTimeout(() => {
      setToaster({ message: '', isVisible: false, type: 'positive' })
    }, 3000)
    setIsFetchingUserRecords(false);
  };
  const fetchUserMeetings = async () => {
    try {
      setIsFetchingUserMeetings(true);
      const response = await makeApiCall<IGenericReponse<IMeetingRecords[]>>({
        endpoint: `user/${loginToken.token}/meeting`,
        method: "GET",
      });
      if (response.type === "Success") {
        setScheduledMeetings(response.data)
      }
    } catch (e) {
      setToaster({ message: e as string, type: 'negative', isVisible: true })
    }
    setIsFetchingUserMeetings(false);
    setTimeout(() => {
      setToaster({ message: '', type: 'positive', isVisible: false })
    }, 3000)
  };
  const getUserAvailableDate = async (id: number) => {
    try {
      setIsFetchingDateRecords(true);
      const response = await makeApiCall<IGenericReponse<IUserAvailabilityResponse[]>>({
        endpoint: `user/${id}/availability`,
        method: "GET",
      });
      if (response.type === "Success") {
        const userAvailability = (response.data.map(rec => ({ start: rec.available_day_start, end: rec.available_day_end })))
        const userAvailableDays = days.filter(day => {
          return userAvailability.some(range => day.id >= range.start && day.id <= range.end);
        });
        setAvailableDays(userAvailableDays)
      }
    } catch (e) {
      setToaster({ message: e as string, type: 'negative', isVisible: true })
    }
    setTimeout(() => {
      setToaster({ message: '', type: 'positive', isVisible: false })
    }, 3000)
    setIsFetchingDateRecords(false);
  };
  const addNewMeetings = async () => {
    setIsAddingMeeting(true)
    try {
      const availability = await makeApiCall<IGenericReponse<IUserAvailabilityResponse[]>>({
        endpoint: `user/${newMeeting.target_user!}/availability`,
        method: "GET",
      });
      const isEligible = isEligibleForMeeting(scheduledMeetings, availability.data, newMeeting.day!, convertTimeToMinutes(meetingTime.meetingTimeEnd) - convertTimeToMinutes(meetingTime.meetingTimeStart))
      const isSlotOverlapped = isSlotOverlapping(scheduledMeetings, newMeeting.day!, convertTimeToMinutes(meetingTime.meetingTimeStart), convertTimeToMinutes(meetingTime.meetingTimeEnd))
      if (isEligible) {
        if (!isSlotOverlapped) {
          const res = await makeApiCall<IGenericReponse<null>>({
            endpoint: `user/${loginToken.token}/meeting`,
            method: "POST",
            data: { ...newMeeting, startTime: convertTimeToMinutes(meetingTime.meetingTimeStart), endTime: convertTimeToMinutes(meetingTime.meetingTimeEnd) },
          });
          if (res.type === "Success") {
            setToaster({
              message: "Meeting added Successfully",
              isVisible: true,
              type: "positive",
            });
            fetchUserMeetings()
          }
        } else {
          setToaster({ message: 'Timeslot already Existed', isVisible: true, type: "negative" });
        }
      } else {
        setToaster({ message: 'Meetings already booked for selected Day', isVisible: true, type: "negative" });
      }
    } catch (e) {
      setToaster({ message: e as string, isVisible: true, type: "negative" });
    }
    setIsAddingMeeting(false)
    setTimeout(() => {
      setToaster({ message: "", isVisible: false, type: "positive" });
    }, 3000);
  }
  function isEligibleForMeeting(meetings: IMeetingRecords[], availabilities: IUserAvailabilityResponse[], day: number, slot: number): boolean {
    const scheduledTime = meetings
      .filter((meeting) => meeting.meeting_day === day)
      .reduce((acc, meeting) => {
        return acc + (meeting.meeting_end - meeting.meeting_start)
      }, 0);

    const availability = availabilities.find((availability) => day >= availability.available_day_start && day <= availability.available_day_end);
    if (!availability) {
      return false; // No availability for the given day
    }
    const selectedDayMeetings = meetings.filter(meeting => meeting.meeting_day === day)
    const availableTime = (parseInt(availability.available_time_end) - parseInt(availability.available_time_start)) - (availability.buffer_time * 2 * selectedDayMeetings.length);

    // Calculate remaining available time after considering scheduled meetings
    const remainingTime = availableTime - scheduledTime;

    // Check if the incoming slot is less than or equal to the remaining available time
    return slot <= remainingTime;
  }

  function isSlotOverlapping(meetings: IMeetingRecords[], day: number, slotStart: number, slotEnd: number): boolean {
    const dayMeetings = meetings.filter((meeting) => meeting.meeting_day === day);


    for (const meeting of dayMeetings) {
      if ((slotStart >= meeting.meeting_start && slotStart < meeting.meeting_end) ||
        (slotEnd > meeting.meeting_start && slotEnd <= meeting.meeting_end) ||
        (slotStart <= meeting.meeting_start && slotEnd >= meeting.meeting_end)) {
        return true; // Overlapping slot  
      }
    }
    return false; // Non-overlapping slot
  }


  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const res = await makeApiCall<IGenericReponse<null>>({
        endpoint: "logout",
        method: "POST",
      });
      if (res.type === "Success") {
        router.push("/login");
      }
    } catch (e) {
      setToaster({ message: e as string, type: 'negative', isVisible: true })
    }
    setIsLoading(false);
    setTimeout(() => {
      setToaster({ message: '', type: 'positive', isVisible: false })
    }, 3000)
  };
  const handleGoToAvailabilityPage = () => {
    router.push("/availability");
  };
  const handleCancelMeeting = async (meetingId: number) => {
    try {
      setIsCancellingMeeting(meetingId)
      const res = await makeApiCall<IGenericReponse<null>>({
        endpoint: `user/${loginToken.token}/meeting`,
        data: {
          id: meetingId
        },
        method: "DELETE",
      });
      if (res.type === 'Success') {
        const selectedMeetingIndex = scheduledMeetings.findIndex(meeting => meeting.meeting_id === meetingId)
        if (selectedMeetingIndex !== -1) {
          scheduledMeetings.splice(selectedMeetingIndex, 1)
          setToaster({ message: 'Meeting Cancelled', isVisible: true, type: 'positive' })
        }
      }
    } catch (e) {
      setToaster({ message: e as string, isVisible: true, type: 'negative' })
    }
    setTimeout(() => {
      setToaster({ message: '', isVisible: false, type: 'positive' })
    }, 3000)
    setIsCancellingMeeting(null)
  }
  return (
    <div className="h-screen p-2 min-w-[300px] flex flex-col items-center justify-center bg-black gap-10">
      <div className="w-full flex justify-between">
        <Button
          className="text-sm !w-20"
          onClick={handleLogout}
          label="Logout"
          variant="secondary"
          loading={isLoading}
        />
        <Button
          className="text-sm !w-40"
          onClick={handleGoToAvailabilityPage}
          label="Add new Availability"
          variant="secondary"
          loading={isLoading}
        />
      </div>
      <div className="font-semibold text-center text-white text-3xl">
        <span>Schedule a Meeting</span>
      </div>
      <div className="flex gap-10 h-[400px] max-w-[1100px] w-full justify-center">
        <div className="p-3 min-w-[305px] max-w-[520px] w-full bg-[#ced9dfab] rounded-lg">
          <div className="mb-2">
            <div className="text-lg mb-1">
              <span>Select a User for meeting</span>
            </div>
            <MultiSelect
              className={"w-full"}
              label="select user"
              isLoading={isFetchingUserRecords}
              singleSelect={true}
              onChange={handleSelectMeetingUser}
              options={userRecords}
            />
          </div>
          <div className="mb-2">
            <div className="text-lg mb-1">
              <span>Select Day for meeting</span>
            </div>
            <MultiSelect
              className="w-full"
              optionsWidth="max-w-20"
              label="Select Day"
              isLoading={isFetchingDateRecords}
              singleSelect={true}
              options={availableDays}
              onChange={handleDayChange}
            />
          </div>
          <div>
            <div className="text-lg mb-1">
              <span>Select Time for meeting</span>
            </div>
            <TimeRangePicker
              id={"availableTime"}
              startTime={meetingTime.meetingTimeStart}
              onStartTimeChange={(e) =>
                handleAvailableTimeChange(e, "meetingTimeStart")
              }
              onEndTimeChange={(e) =>
                handleAvailableTimeChange(e, "meetingTimeEnd")
              }
              endTime={meetingTime.meetingTimeEnd}
            />
            <div className="text-red-900">
              {!isAvailableTimeValid &&
                "Start time cannot be greater than End time"}
            </div>
          </div>
        </div>
        <div className="min-w-[305px] max-w-[520px] w-full bg-[#ced9dfab] rounded-lg p-3">
          <div className="text-lg text-center mb-1">
            <span>Scheduled Meetings</span>
          </div>
          {isFetchingUserMeetings ? <Loader color="secondary" /> :
            scheduledMeetings.length === 0 ? (
              <div className="text-center text-sm mt-12">
                <span>There are no Scheduled Meetings</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[340px] h-full overflow-auto px-1"

              >
                {scheduledMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex text-sm items-center justify-between bg-white text-black py-1 px-2 rounded-md">
                    <div className="p-1">
                      <span>{meeting.source_user_name} - {meeting.target_user_name}</span>
                    </div>
                    <div>
                      {days[meeting.meeting_day].name}
                    </div>
                    <div>
                      <span>
                        {convertMinutesToTime(meeting.meeting_start)} - {convertMinutesToTime(meeting.meeting_end)}
                      </span>
                    </div>
                    <Button label="Cancel" loading={isCancellingMeeting === meeting.meeting_id} className="p-0.5 w-16 text-xs" onClick={() => handleCancelMeeting(meeting.meeting_id)} />
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
      <Button
        label="Schedule"
        loading={isAddingMeeting}
        variant="secondary"
        disabled={!isAvailableTimeValid || newMeeting.source_user === null || newMeeting.day === null}
        className="border-2 border-transparent"
        onClick={addNewMeetings}
      />
      {toaster.isVisible && (
        <Toaster message={toaster.message} type={toaster.type} />
      )}
    </div>
  );
};
export default Meeting;
