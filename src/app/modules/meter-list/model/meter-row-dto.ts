import { MeterType } from "../../meter-edit/model/meter-type"

export interface MeterRowDto {
    id?: number
    apartment?: string
    rentedObject?: string
    meterName?: string
    meterType?: MeterType
    meterNumber?: string
    initialMeterReading?: number
    installationDate?: Date
}