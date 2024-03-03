import { SettlementStatus } from "./settlement-status";

export interface TenantSettlementRowDto {
    id: number,
    settlementDate: Date,
    totalAmount: number,
    settlementStatus: SettlementStatus
}