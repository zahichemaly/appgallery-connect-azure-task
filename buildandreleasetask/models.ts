export interface Inputs {
    appId: string,
    clientId: string,
    clientSecret: string,
}

export interface LoginPayload {
    client_id: string,
    client_secret: string,
    grant_type: string,
}

export interface LoginResponse {
    access_token: string,
    expires_in: string,
}

export interface UploadUrlResponse {
    ret: {
        code: number,
        msg: string
    },
    uploadUrl: string,
    authCode: string,
}
