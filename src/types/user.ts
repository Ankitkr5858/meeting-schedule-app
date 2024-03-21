export interface IUser {
    timeAvailabilityEnd: string | number,
    timeAvailabilityStart: string | number,
    dayAvailabilityEnd: number,
    dayAvailabilityStart: number,
    createdAt: string,
    email: string,
    id: number,
    name: string,
    password: string,
    updatedAt: string,
}
export interface IUserAvailability {
    user_id: string;
    buffer_time: number;
    available_day_start: number;
    available_day_end: number;
    available_time_start: string;
    available_time_end: string;
    max_meetings: number;
}
export interface IUserAvailabilityResponse {
    id: number;
    user_id: number;
    available_day_start: number;
    available_day_end: number;
    available_time_start: string;
    available_time_end: string;
    max_meetings: number;
    buffer_time: number;
    createdAt: string;
    updatedAt: string;
    name?:string
}
export interface IUserMeeting{
    id:number,
    target_user_id:number,
    source_user_id:number,
    meeting_id:number,
    createdAt:string,
    updatedAt:string
}