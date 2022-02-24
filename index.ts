import { ApiWrapper } from './apiWrapper';
import { DiscordWrapper } from './discordWrappper';
import { Events } from './types';

class Application {
    public static async run(API_KEY: string, userName: string, webhook: string) {
        const apiWrapper = new ApiWrapper(API_KEY);
        const discordWrapper = new DiscordWrapper(webhook);

        apiWrapper.on(Events.Loss, (matchData: any, parsedDatas: any) => {
            discordWrapper.submitWebhook(matchData);
           console.log(matchData);
           console.log(parsedDatas);
        })
        apiWrapper.on(Events.Win, (matchData: any, parsedDatas: any) => {
            discordWrapper.submitWebhook(matchData);
            console.log(matchData);
            console.log(parsedDatas);
         })

        await apiWrapper.start(userName);
    }
};
/*
(async () => {
    Application.run("", "", "");
})();
*/ 