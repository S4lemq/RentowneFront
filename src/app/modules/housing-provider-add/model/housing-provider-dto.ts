import { ApartmentDto } from "../../apartment-edit/model/apartment-dto"
import { ProviderFieldDto } from "./provider-field-dto"
import { ProviderType } from "./provider-type"

export interface HousingProviderDto {
    id?: number
    name?: string
    type?: ProviderType
    tax?: number
    providerFieldDtos?: ProviderFieldDto[]
}