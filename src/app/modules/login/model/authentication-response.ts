export interface AuthenticationResponseDto {
    accessToken: string;
    refreshToken: string;
    mfaEnabled: boolean;
    secretImageUri?: string;
    landlordAccess: boolean;
}