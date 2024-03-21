export interface IMeetingPayload {
    source_user: number | null,
    target_user: number | null,
    startTime: number,
    endTime: number,
    day: number | null,
}
export interface IMeetingRecords {
    id: number,
    meeting_start: number,
    meeting_end: number,
    meeting_day: number,
    source_user_name: string,
    meeting_id:number,
    source_user_id: number,
    target_user_name: string,
    target_user_id: number,
    createdAt: string,
    updatedAt: string,
}