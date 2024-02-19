import { DTRow } from "src/app/shared/data-table/DTRow"

export interface Apartment extends DTRow {
    id: number
    apartmentName: string
    leasesNumber: number
    isRented: boolean
    cityName: string
    streetName: string
    buildingNumber: string
    apartmentNumber: string
    image: string
    pinned?: boolean
}