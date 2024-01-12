import { AddressDto } from "./address-dto"
import { RentedObjectDto } from "./rented-object-dto"

export interface ApartmentDto {
    id: number
    apartmentName: string
    leasesNumber: number
    area: number
    image: string
    addressDto: AddressDto
    rentedObjectDtos: RentedObjectDto[]
}