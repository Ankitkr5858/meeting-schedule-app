export interface ILoginCredential{
    email:string,
    password:string
}
export interface ISignupCredential{
    name:string,
    email:string,
    password:string,
    bufferTime:number,
    timeAvailabilityStart:string,
    dayAvailabilityStart:string,
    dayAvailabilityEnd:string,
    timeAvailabilityEnd:string,
}
export interface ISignupPayload{
    name:string,
    email:string,
    password:string,
    bufferTime:number,
    timeAvailabilityStart:number,
    dayAvailabilityStart:{name:string,id:number},
    dayAvailabilityEnd:{name:string,id:number},
    timeAvailabilityEnd:number,
}