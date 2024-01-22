import { RentedObjectDto } from "../../apartment-edit/model/rented-object-dto"
import { MeterType } from "./meter-type"

export interface MeterDto {
    id?: number
    name?: string
    meterType: MeterType
    rentedObject?: RentedObjectDto
}