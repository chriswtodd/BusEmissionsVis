export interface IResgisterCredentials
{
  email: string,
  password: string
}

export interface ILoginCredentials 
{
  email: string,
  password: string
}

export interface ILoggedInData
{
  tokenType: string,
  refreshToken: string,
  expiresIn: number,
  accessToken: string,
}