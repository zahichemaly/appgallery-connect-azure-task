import tl = require('azure-pipelines-task-lib/task');
import * as api from './api';
import { Inputs } from './models';


async function run() {
    try {
        const appId: string | undefined = tl.getInput('appId', true);
        const clientId: string | undefined = tl.getInput('clientId', true);
        const clientSecret: string | undefined = tl.getInput('clientSecret', true);
        const filePath: string | undefined = tl.getInput('filePath', true);

        if (appId == 'bad' || clientId == 'bad' || clientSecret == 'bad' || filePath == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }
        console.log('Starting connection to app ID', appId);
        let inputs: Inputs = {
            appId: appId ?? "",
            clientId: clientId ?? "",
            clientSecret: clientSecret ?? "",
            filePath: filePath ?? ""
        }
        await api.start(inputs);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
