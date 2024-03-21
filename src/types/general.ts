export type IGenericReponse<T> ={
    type:string,
    message:string,
    data: T
}
export interface IToaster{
    message:string,
    type:'positive' | 'negative',
    isVisible:boolean
}
export interface IDays{
    name:string,
    id:number
}