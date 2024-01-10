import { AddressDto } from "./address-dto"

export interface ApartmentEditDto {
    id: number
    apartmentName: string
    leasesNumber: number
    area: number
    addressDto: AddressDto
}