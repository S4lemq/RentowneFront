import { BillingMethod } from "./billing-method"

export interface ProviderFieldDto {
    id?: number
    name?: string
    price?: number
    billingMethod?: BillingMethod
}