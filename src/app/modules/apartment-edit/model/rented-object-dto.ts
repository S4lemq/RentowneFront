import { MeterDto } from "../../meter-edit/model/meter-dto"

export interface RentedObjectDto {
    id?: number
    rentedObjectName?: string
    meters?: Array<MeterDto>
}