export interface RegisterResponseDto {
    accessToken?: string;
    refreshToken?: string;
    mfaEnabled?: boolean;
    secretImageUri?: string;
    landlordAccess?: boolean;
}