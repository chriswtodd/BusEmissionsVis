export interface IAuthUserInfo
{
  name: string,
  email: string,
  givenName: string,
  surname: string
}

export interface IAuth
{
  userInfo: IAuthUserInfo
}

export interface IAuthGoogleUserInfo extends IAuthUserInfo
{
  nameIdentifier: string,
  emailVerified: boolean,
  picture: string,
}


export interface IAuthWho
{
  username: string,
  isAuthenticated: boolean
}