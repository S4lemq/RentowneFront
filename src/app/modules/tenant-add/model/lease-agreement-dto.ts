export interface LeaseAgreementDto {
    id?: number
    startContractDate?: Date
    endContractDate?: Date
    deposit?: number
    depositPaid?: number
    paymentDueDayOfMonth?: number
    rentAmount?: number
    compensationAmount?: number
    internetFee?: number
    gasDeposit?: number
    includedWaterMeters?: number
    initialEnergyMeterReading?: number
    initialWaterMeterReading?: number
    initialGasMeterReading?: number
    depositReturnDate?: Date
    returnedDepositAmount?: number
    contractActive?: boolean
}