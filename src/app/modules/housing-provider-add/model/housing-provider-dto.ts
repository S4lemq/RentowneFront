import { DTRow } from "src/app/shared/data-table/DTRow"
import { ApartmentDto } from "../../apartment-edit/model/apartment-dto"
import { ProviderFieldDto } from "./provider-field-dto"
import { ProviderType } from "./provider-type"

export interface HousingProviderDto extends DTRow{
    name?: string
    type?: ProviderType
    tax?: number
    conversionRate?: number
    providerFieldDtos?: ProviderFieldDto[]
}