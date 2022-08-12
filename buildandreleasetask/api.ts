import tl = require('azure-pipelines-task-lib/task');
import fetch from 'node-fetch'
const FormData = require('form-data');
import { stringify } from 'query-string';
import { LoginResponse, UploadUrlResponse, Inputs, UploadFileResponse, FileUploadPayload, LoginPayload, BaseResponse } from './models';

const baseUrl = "https://connect-api.cloud.huawei.com/api";

async function login(inputs: Inputs) {
    const url = `${baseUrl}/oauth2/v1/token`;

    const payload: LoginPayload =  {
        client_id: inputs.clientId,
        client_secret: inputs.clientSecret,
        grant_type: "client_credentials"
    };

    const data = { 
        method: 'POST', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
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
        appId: inputs.appId,
        suffix: 'aab'
    });
    const url = `${baseUrl}/publish/v2/upload-url?${params}`;

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

async function uploadFile(url: string, authCode: string, inputs: Inputs) {
    const formData = new FormData();
    formData.append('authCode', authCode);
    formData.append('file', inputs.filePath);
    formData.append('fileCount', 1);

    const data = { 
        method: 'POST', 
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        body: formData
    }

    return fetch(url, data)
    .then(res => res.json())
    .then(res => {
        console.log(res)
        return res as UploadFileResponse
    })
}

async function uploadFileInfo(inputs: Inputs, token: string) {
    const params = stringify({
        appId: inputs.appId,
    });
    const url = `${baseUrl}/api/publish/v2/app-file-info?${params}`;

    const payload: FileUploadPayload = {
        lang: "en-US",
        fileType: 5,
        files: {
            fileName: "string",
            fileDestUrl: "string",
            size: "tring"
        }
    };
    
    const data = { 
        method: 'PUT', 
        headers: {
            'Authorization': 'Bearer ' + token,
            "client_id": inputs.clientId,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };

    return fetch(url, data)
    .then(res => res.json())
    .then(res => {
        console.log(res)
        return res as BaseResponse
    })
}

async function submit(inputs: Inputs, token: string) {
    const params = stringify({
        appId: inputs.appId,
    });

    const url = `${baseUrl}/publish/v2/app-submit?${params}`;

    const data = { 
        method: 'POST', 
        headers: {
            'Authorization': 'Bearer ' + token,
            "client_id": inputs.clientId
        }
    };

    return fetch(url, data)
    .then(res => res.json())
    .then(res => {
            console.log(res)
            return res as BaseResponse
    })
}

export async function start(inputs: Inputs) {
    // Authenticate with Huawei
    const loginResponse = await login(inputs);
    const token = loginResponse.access_token;

    // Get the Upload URL
    const uploadURLResponse = await getUploadURL(inputs, token);

    if (uploadURLResponse.ret.code != 0) {
        tl.setResult(tl.TaskResult.Failed, `Get upload URL failed with code ${uploadURLResponse.ret.code}`);
        return;
    }

    // Upload the file based on the uploaded URL that we got
    const uploadFileResponse = await uploadFile(uploadURLResponse.uploadUrl, uploadURLResponse.authCode, inputs);
    if (uploadFileResponse.result.resultCode !== "0") {
        tl.setResult(tl.TaskResult.Failed, `Upload file failed with result code ${uploadFileResponse.result.resultCode}`);
        return;
    }

    // Upload the file info
    const fileInfoResponse = await uploadFileInfo(inputs, token);
    if (fileInfoResponse.ret.code != 0) {
        tl.setResult(tl.TaskResult.Failed, `Upload file info failed with code ${fileInfoResponse.ret.code }`);
        return;
    }

    // Submit the app
    const submitResponse = await submit(inputs, token);
    if (submitResponse.ret.code != 0) {
        tl.setResult(tl.TaskResult.Failed, `Submit app failed with code ${submitResponse.ret.code}`);
        return;
    }
    
    tl.setResult(tl.TaskResult.Succeeded, "Finished");
}
