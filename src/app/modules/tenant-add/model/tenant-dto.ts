import { AddressDto } from "../../apartment-edit/model/address-dto"
import { LeaseAgreementDto } from "../../lease-agreement-add/model/lease-agreement-dto"

export interface TenantDto {
    id?: number
    firstname?: string
    lastname?: string
    email?: string
    accountNumber?: string
    phoneNumber?: string
    addressDto?: AddressDto
    leaseAgreementDto?: LeaseAgreementDto
}