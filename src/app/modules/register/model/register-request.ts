export interface RegisterRequestDto {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    repeatPassword: string,
    mfaEnabled: boolean;
}