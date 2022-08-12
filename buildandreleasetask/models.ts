export interface Inputs {
    appId: string,
    clientId: string,
    clientSecret: string,
    filePath: string,
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

export interface BaseResponse {
    ret: {
        code: number,
        msg: string
    },
}

export interface UploadUrlResponse extends BaseResponse {
    uploadUrl: string,
    authCode: string,
}

export interface UploadFileResponse {
    result: {
        UploadFileRsp: {
            fileInfoList: Array<FileInfo>,
            ifSuccess: number
        },
        resultCode: string
    }
}

export interface FileInfo {
    disposableURL: string,
    fileDestUlr: string,
    size: number
}

export interface FileUploadPayload {
    lang: string,
    fileType: number,
    files: {
        fileName: string,
        fileDestUrl: string,
        size: string
    }
}
