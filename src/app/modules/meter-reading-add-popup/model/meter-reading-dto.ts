import { MeterDto } from "../../meter-edit/model/meter-dto"

export interface MeterReadingDto {
    id?: number
    currentReading?: number
    readingDate?: Date
    consumption?: number
    meterDto?: MeterDto
    previousReading?: number
    previousReadingDate?: Date
    settled?: boolean
}