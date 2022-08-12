import fetch from 'node-fetch';
import { stringify } from 'query-string';
import { LoginResponse, UploadUrlResponse, Inputs } from './models';

const baseUrl = "https://connect-api.cloud.huawei.com/api";

async function login(inputs: Inputs) {
    const url = baseUrl + "/oauth2/v1/token";
    const json = {
        "client_id": inputs.clientId,
        "client_secret": inputs.clientSecret,
        "grant_type": "client_credentials"
    }
    const data = { 
        method: 'POST', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    };

    return fetch(url, data)
    .then(res => res.json())
    .then(res => {
            console.log(res)
            return res as LoginResponse
    })
}

async function getUploadURL(inputs: Inputs, token: string) {
    const params = stringify({
        appId: 105302291,
        suffix: 'aab'
    })
    const url = baseUrl + `/publish/v2/upload-url?${params}`;

    const data = { 
        headers: {
            'Authorization': 'Bearer ' + token,
            "client_id": inputs.clientId
        }
    };

    return fetch(url, data)
    .then(res => res.json())
    .then(res => {
            console.log(res)
            return res as UploadUrlResponse
    })
}

export async function start(inputs: Inputs) {
    // Authenticate with Huawei
    console.log("Authenticating with Huawei Connect...")
    const loginResponse = await login(inputs);
    const token = loginResponse.access_token;

    // Get the Upload URL
    const uploadURLResponse = await getUploadURL(inputs, token);
    if (uploadURLResponse.ret.code == 0) {
        console.log("Upload URL success");
        const uploadURL = uploadURLResponse.uploadUrl;
        const authCode = uploadURLResponse.authCode;
    }
}
