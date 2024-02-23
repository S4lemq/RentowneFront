import { Payment } from "./payment"

export interface BasicSettlementDto {
    totalAmount?: number
    settlementDate?: Date
    payment: Array<Payment>
}