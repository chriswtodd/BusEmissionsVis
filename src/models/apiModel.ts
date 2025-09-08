export interface IApiModel<T> {
    baseUrl: string,
    accessToken: string,
    tokenType: string,
    model: T
}