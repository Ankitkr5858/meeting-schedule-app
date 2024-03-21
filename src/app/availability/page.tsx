"use client";
import React, { useEffect, useMemo, useState } from "react";
import Button from "@/components/common/Button";
import {
  IDays,
  IGenericReponse,
  IToaster,
  IUserAvailabilityResponse,
} from "@/types";
import { makeApiCall } from "@/utils/makeApiCall";
import { useRouter } from "next/navigation";
import MultiSelect from "@/components/common/MultiSelect";
import { getCookies } from "cookies-next";
import InputField from "@/components/common/InputField";
import TimeRangePicker from "@/components/common/TimeRangePicker";
import { days } from "../signup/utils";
import { convertTimeToMinutes } from "@/utils/convertTimeToMinutes";
import { Toaster } from "@/components/common/Toaster";
import { convertMinutesToTime } from "@/utils/convertMinutesToTime";
import Loader from "@/components/common/Loader";

const Availability = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [cancelingRecord, setCancelingRecord] = useState<null | number>(null);
  const [isFetchingDateRecords, setIsFetchingDateRecords] = useState(false);
  const [availabilityRecords, setAvailabilityRecords] = useState<
    IUserAvailabilityResponse[]
  >([]);
  const [toaster, setToaster] = useState<IToaster>({
    message: "",
    isVisible: false,
    type: "positive",
  });
  const [userAvailability, setUserAvailability] = useState({
    bufferTime: 0,
    dayAvailabilityStart: null,
    dayAvailabilityEnd: null,
    timeAvailabilityStart: "00:00",
    timeAvailabilityEnd: "00:00",
    maximumMeetings: 0,
  });
  const loginUserId = getCookies().token as string;
  const router = useRouter();
  useEffect(() => {
    getUserAvailableDate();
  }, []);
  const isAvailableTimeValid = useMemo(() => {
    const startTime = convertTimeToMinutes(
      userAvailability.timeAvailabilityStart
    );
    const endTime = convertTimeToMinutes(userAvailability.timeAvailabilityEnd);
    if (endTime < startTime) {
      return false;
    }
    return true;
  }, [
    userAvailability.timeAvailabilityStart,
    userAvailability.timeAvailabilityEnd,
  ]);
  const isMeetingsExcessing = useMemo(() => {
    const startTime = convertTimeToMinutes(
      userAvailability.timeAvailabilityStart
    );
    const endTime = convertTimeToMinutes(userAvailability.timeAvailabilityEnd);
    if (
      endTime - startTime <
      userAvailability.maximumMeetings + userAvailability.bufferTime * 2
    ) {
      return true;
    }
    return false;
  }, [
    userAvailability.maximumMeetings,
    userAvailability.bufferTime,
    userAvailability.timeAvailabilityStart,
    userAvailability.timeAvailabilityEnd,
  ]);
  const bufferTimeValid = useMemo(() => {
    const startTime = convertTimeToMinutes(
      userAvailability.timeAvailabilityStart
    );
    const endTime = convertTimeToMinutes(userAvailability.timeAvailabilityEnd);
    if (endTime - startTime < userAvailability.bufferTime) {
      return false;
    }
    return true;
  }, [
    userAvailability.timeAvailabilityStart,
    userAvailability.timeAvailabilityEnd,
    userAvailability.bufferTime,
  ]);
  const handleDayChange = (event: IDays[], key: 'dayAvailabilityEnd' | 'dayAvailabilityStart') => {
    setUserAvailability((oldValue) => ({
      ...oldValue,
      [key]: event[0].id,
    }));
  };
  const handleAvailableTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: "timeAvailabilityEnd" | "timeAvailabilityStart"
  ) => {
    setUserAvailability((oldValue) => ({
      ...oldValue,
      [key]: event.target.value,
    }));
  };
  const handleTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: "bufferTime" | "maximumMeetings"
  ) => {
    const newValue = Number(event.target.value);
    if (newValue > 0) {
      setUserAvailability((oldValue) => ({
        ...oldValue,
        [key]: newValue,
      }));
    } else if (!newValue || newValue <= 0) {
      setUserAvailability((oldValue) => ({
        ...oldValue,
        [key]: 0,
      }));
    }
  };
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
      setToaster({message:e as string,type:'negative',isVisible:true})
    }
    setTimeout(()=>{
      setToaster({message:'',type:'positive',isVisible:false})
    },3000)
    setIsLoading(false);
  };
  const getUserAvailableDate = async () => {
    try {
      setIsFetchingDateRecords(true);
      const response = await makeApiCall<
        IGenericReponse<IUserAvailabilityResponse[]>
      >({
        endpoint: `user/${loginUserId}/availability`,
        method: "GET",
      });
      if (response.type === "Success") {
        setAvailabilityRecords(response.data);
      }
    } catch (e) {

      setToaster({ message: e as string, isVisible: true, type: "negative" });
    }
    setIsFetchingDateRecords(false);
    setTimeout(() => {
      setToaster({ message: "", isVisible: false, type: "positive" });
    }, 3000);
  };
  const handleAddAvailability = async () => {

    try {
      setIsAdding(true);

      const {
        bufferTime,
        dayAvailabilityStart,
        dayAvailabilityEnd,
        timeAvailabilityStart,
        timeAvailabilityEnd,
        maximumMeetings,
      } = userAvailability;

      const payload = {
        user_id: loginUserId,
        buffer_time: bufferTime,
        available_day_start: dayAvailabilityStart,
        available_day_end: dayAvailabilityEnd,
        available_time_start: convertTimeToMinutes(timeAvailabilityStart),
        available_time_end: convertTimeToMinutes(timeAvailabilityEnd),
        max_meetings: maximumMeetings,
      };
      const newStartDay = dayAvailabilityStart;
      const newEndDay = dayAvailabilityEnd;
      const newStartTime = convertTimeToMinutes(timeAvailabilityStart);
      const newEndTime = convertTimeToMinutes(timeAvailabilityEnd);

      const conflictExists = availabilityRecords.some((record) => {
        const existingStartDay = record.available_day_start;
        const existingEndDay = record.available_day_end;
        const existingStartTime = Number(record.available_time_start);
        const existingEndTime = Number(record.available_time_end);

        const daysConflict =
          (newStartDay && (newStartDay >= existingStartDay && newStartDay <= existingEndDay)) ||
          (newEndDay && (newEndDay >= existingStartDay && newEndDay <= existingEndDay)) ||
          ((newStartDay && newEndDay) && (existingStartDay >= newStartDay && existingEndDay <= newEndDay));

        const timeConflict =
          (newStartTime >= existingStartTime &&
            newStartTime < existingEndTime) ||
          (newEndTime > existingStartTime && newEndTime <= existingEndTime) ||
          (existingStartTime >= newStartTime && existingEndTime <= newEndTime);

        return daysConflict && timeConflict;
      });

      if (conflictExists) {
        setToaster({
          message: "New availability conflicts with existing records.",
          isVisible: true,
          type: "negative",
        });
      } else {
        const res = await makeApiCall<IGenericReponse<null>>({
          endpoint: `user/${payload.user_id}/availability`,
          method: "POST",
          data: payload,
        });

        if (res.type === "Success") {
          setToaster({
            message: "Availability added successfully.",
            isVisible: true,
            type: "positive",
          });
        }
        getUserAvailableDate()
      }
    } catch (e) {
      setToaster({ message: e as string, isVisible: true, type: "negative" });
    }

    setTimeout(() => {
      setToaster({ message: "", isVisible: false, type: "positive" });
    }, 3000);
    setIsAdding(false);
  };

  const handleCancelAvailability = async (selectedId: number) => {
    try {
      setCancelingRecord(selectedId)
      const res = await makeApiCall<IGenericReponse<null>>({
        endpoint: `user/${loginUserId}/availability/${selectedId}`,
        method: "DELETE",
      });
      if (res.type === "Success") {
        const selectedAvailabilityIndex = availabilityRecords.findIndex(
          (record) => record.id === selectedId
        );
        availabilityRecords.splice(selectedAvailabilityIndex, 1);
        setToaster({
          message: "Availability deleted successfully",
          isVisible: true,
          type: "positive",
        });
      }
    } catch (e) {
      setToaster({ message: e as string, isVisible: true, type: "negative" });
    }
    setTimeout(() => {
      setToaster({ message: "", isVisible: false, type: "positive" });
    }, 3000);
    setCancelingRecord(null)
  };
  const handleGoToMeetingPage = () => {
    router.push("/meeting");
  };

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
          onClick={handleGoToMeetingPage}
          label="Schedule a Meeting"
          variant="secondary"
          loading={isLoading}
        />
      </div>
      <div className="font-semibold text-center text-white text-3xl">
        <span>Select your Availability</span>
      </div>
      <div className="flex gap-10 min-h-[400px] max-w-[1100px] w-full justify-center">
        <div className="p-3 min-w-[305px] max-w-[520px] w-full bg-[#ced9dfab] rounded-lg">
          <div className="mb-2">
            <label
              htmlFor="availableTime"
              className="block mb-2 text-lg font-medium dark:text-white text-black"
            >
              Select Your Weekly Availability
            </label>
            <div className="flex items-center justify-between gap-[0.7rem]">
              <MultiSelect
                className="w-full"
                optionsWidth="max-w-20"
                label="From"
                singleSelect={true}
                options={days}
                onChange={(e) => handleDayChange(e, 'dayAvailabilityStart')}
              />
              <span>to</span>
              <MultiSelect
                className="w-full"
                optionsWidth="max-w-20"
                label="To"
                singleSelect={true}
                options={days}
                onChange={(e) => handleDayChange(e, 'dayAvailabilityEnd')}
              />
            </div>
          </div>
          <div className="mb-2">
            <label
              htmlFor="availableTime"
              className="block mb-2 text-lg font-medium dark:text-white text-black"
            >
              Select Your Time Availability
            </label>
            <TimeRangePicker
              id={"availableTime"}
              startTime={userAvailability.timeAvailabilityStart}
              onStartTimeChange={(e) =>
                handleAvailableTimeChange(e, "timeAvailabilityStart")
              }
              onEndTimeChange={(e) =>
                handleAvailableTimeChange(e, "timeAvailabilityEnd")
              }
              endTime={userAvailability.timeAvailabilityEnd}
            />
            <div className="text-red-900">
              {!isAvailableTimeValid &&
                "Start time cannot be greater than End time"}
            </div>
          </div>
          <div className="mb-2">
            <label
              htmlFor="availableTime"
              className="block mb-2 text-lg font-medium dark:text-white text-black"
            >
              Select Your Buffer Time(mins)
            </label>
            <InputField
              id={"bufferTime"}
              type="number"
              value={userAvailability.bufferTime}
              onChange={(e) => handleTimeChange(e, "bufferTime")}
            />
            <div className="text-red-900">
              {!bufferTimeValid &&
                "Buffer time cannot be greater than available time"}
            </div>
          </div>
          <div className="mb-2">
            <label
              htmlFor="availableTime"
              className="block mb-2 text-lg font-medium dark:text-white text-black"
            >
              Select Maximum no. of meetings
            </label>
            <InputField
              id={"bufferTime"}
              type="number"
              value={userAvailability.maximumMeetings}
              onChange={(e) => handleTimeChange(e, "maximumMeetings")}
            />
            <div className="text-red-900">
              {isMeetingsExcessing && "Maximum no. of meetings exceeded"}
            </div>
          </div>
        </div>
        <div className="min-w-[305px] max-w-[520px] h-full overflow-auto w-full bg-[#ced9dfab] rounded-lg p-3">
          <div className="text-lg text-center mb-1">
            <span>Availability</span>
          </div>
          {isFetchingDateRecords ? (
            <Loader color="secondary" />
          ) : availabilityRecords.length === 0 ? (
            <div className="text-center text-sm mt-12">
              <span>There are no Current Availability</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2 overflow-auto px-1">
              {availabilityRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex text-sm items-center justify-between bg-white text-black py-1 px-2 rounded-md"
                >
                  <div className="p-1">
                    <span>
                      {days[record.available_day_start].name}-
                      {days[record.available_day_end].name}
                    </span>
                  </div>
                  <div>
                    <span>
                      {convertMinutesToTime(
                        Number(record.available_time_start)
                      )}{" "}
                      -{" "}
                      {convertMinutesToTime(Number(record.available_time_end))}
                    </span>
                  </div>
                  <Button
                    label="Cancel"
                    className="p-0.5 w-16 text-xs"
                    loading={record.id === cancelingRecord}
                    onClick={() => handleCancelAvailability(record.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Button
        label="Add Availability"
        disabled={
          convertTimeToMinutes(userAvailability.timeAvailabilityEnd) === 0 ||
          !isAvailableTimeValid ||
          !bufferTimeValid ||
          isMeetingsExcessing
        }
        loading={isAdding}
        variant="secondary"
        className="w-36 border-2 border-transparent"
        onClick={handleAddAvailability}
      />
      {toaster.isVisible && (
        <Toaster message={toaster.message} type={toaster.type} />
      )}
    </div>
  );
};
export default Availability;
