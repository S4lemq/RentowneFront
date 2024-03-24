import { AddressDto } from "../../apartment-edit/model/address-dto"
import { PreferedLanguage } from "../../login/model/prefered-language"
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
    preferredLanguage?: PreferedLanguage
    paymentCardDto?: PaymentCardDto
    addressDto?: AddressDto
}