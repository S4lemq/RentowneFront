import { DTRow } from "src/app/shared/data-table/DTRow"

export interface Apartment extends DTRow {
    id: number,
    apartmentName: string,
    leasesNumber: number
    isRented: boolean
}