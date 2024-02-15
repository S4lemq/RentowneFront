export interface LeaseAgreementRowDto {
    tenantId?: number
    apartment?: string
    rentedObject?: string
    compensationAmount?: number
    rentAmount?: number
    internetFee?: number
    gasDeposit?: number
    includedWaterMeters?: number
    startContractDate?: Date
    endContractDate?: Date
    deposit?: number
}