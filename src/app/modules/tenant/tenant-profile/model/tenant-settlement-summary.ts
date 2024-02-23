import { Payment } from "./payment"
import { TenantSettlementStatus } from "./tenant-settlement-status"

export interface TenantSettlementSummary {
    id?: number
    placeDate?: Date
    status?: TenantSettlementStatus
    grossValue?: number
    payment: Payment
    redirectUrl: string
}