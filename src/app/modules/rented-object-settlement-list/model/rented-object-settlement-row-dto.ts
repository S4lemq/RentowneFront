export interface RentedObjectSettlementRowDto {
    rentedObjectId?: number
    settlementId?: number
    apartment?: string
    rentedObject?: string
    tenantName?: string
    tenantSurname?: string
    settlementDate?: Date
    settlementTotalCost?: number
}