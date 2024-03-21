import React, { useState } from 'react';
interface ITimeRangePicker {
    id: string,
    isSingle?: boolean,
    startTime: string,
    onStartTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    endTime?: string,
    onEndTimeChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
}
const TimeRangePicker: React.FC<ITimeRangePicker> = ({
    id,
    startTime,
    isSingle = false,
    onStartTimeChange,
    endTime,
    onEndTimeChange,
}) => {

    return (
        <div className="flex items-center justify-between">
            <div className="relative w-[45%]">
                <input
                    id={id}
                    type="time"
                    value={startTime}
                    max={endTime}
                    onChange={onStartTimeChange}
                    className="block w-full px-4 py-2 text-black rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            {!isSingle &&
                (<><span className="text-white">to</span>
                    <div className="relative w-[45%]">
                        <input
                            type="time"
                            value={endTime}
                            min={startTime}
                            onChange={onEndTimeChange}
                            className="block w-full px-4 text-black py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div></>)}
        </div>
    );
};

export default TimeRangePicker;
