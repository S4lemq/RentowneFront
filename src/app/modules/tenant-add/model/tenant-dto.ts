import { AddressDto } from "../../apartment-edit/model/address-dto"
import { ApartmentDto } from "../../apartment-edit/model/apartment-dto"
import { RentedObjectDto } from "../../apartment-edit/model/rented-object-dto"
import { LeaseAgreementDto } from "./lease-agreement-dto"

export interface TenantDto {
    id?: number
    firstname?: string
    lastname?: string
    email?: string
    accountNumber?: string
    phoneNumber?: string
    addressDto?: AddressDto
    leaseAgreementDto?: LeaseAgreementDto
    rentedObjectDto?: RentedObjectDto
    apartment?: ApartmentDto
}