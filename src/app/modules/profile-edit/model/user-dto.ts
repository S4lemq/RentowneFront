import { AddressDto } from "../../apartment-edit/model/address-dto"
import { PaymentCardDto } from "./payment-card-dto"

export interface UserDto {
    id?: number
    firstname?: string
    lastname?: string
    email?: string
    oldPassword?: string
    password?: string
    repeatPassword?: string
    image: string
    phoneNumber?: string
    paymentCardDto?: PaymentCardDto
    addressDto?: AddressDto
}