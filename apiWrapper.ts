import got, { Got } from 'got';
import { parseUserData } from './dataParser';

import { Account, UserStats, ApiResponse, FormattedStats, Events } from './types';

const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const DELAY = 5000;

class ApiWrapper {
    private listeners: {
        [event: string]: Function[];
    };

    private httpClient: Got;

    private account: Account;

    private lastUpdatedUserData: FormattedStats;

    private userName: string;

    private shouldStop: boolean;

    constructor(API_KEY: string) {
        this.httpClient = got.extend({
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15",
                "Accept-Language": "fr-FR,fr;q=0.9",
                "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                "Origin": "https://developer.riotgames.com",
                "X-Riot-Token": API_KEY
            },
            throwHttpErrors: true,
            http2: false,
            prefixUrl: "https://euw1.api.riotgames.com/lol/"
        });
    }

    public async on(event: string, callback: Function) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    public async start(userName: string) {
        this.userName = userName;
        this.shouldStop = false;
    }

    public async stop() {
        this.shouldStop = true;
    }

    public async monitorFlow() {
        const userResponse = await this.getUser();
        if (userResponse.err) {
            console.warn('Failed to get user data, stopping');
            process.exit(1);
        }
        this.account = userResponse.data;

        while (!this.shouldStop) {
            const { err, data } = await this.getUserData();
            if (err) {
                console.warn('Failed to gather user data');
                await pause(DELAY);
                continue;
            }
            const parsedDatas = parseUserData(data);
            if (this.lastUpdatedUserData) {
                parsedDatas.losses > this.lastUpdatedUserData.losses ? this.emitEvent(Events.Loss, [parsedDatas]) : this.emitEvent(Events.Win, [parsedDatas]);
            }
            this.lastUpdatedUserData = parsedDatas;
            await pause(DELAY);
        }
    }

    private emitEvent(event: Events, args: any[]) {
        this.listeners[event].forEach((x: Function) => {
            x(...args);
        });
    }

    private getUser(): Promise<ApiResponse> {
        return this.queryApi(`summoner/v4/summoners/by-name/${this.userName}`);
    }

    private getUserData(): Promise<ApiResponse> {
        return this.queryApi(`league/v4/entries/by-summoner/${this.account.id}`);
    }

    private getUserHistory(): Promise<ApiResponse> {
        return this.queryApi(`match/v5/matches/by-puuid/${this.account.puuid}/ids?start=0&count=1`)
    }

    private async getMatchData(matchId: string): Promise<ApiResponse> {
        return this.queryApi(`match/v5/matches/${matchId}`)
    }

    private async queryApi(endpoint: string): Promise<ApiResponse> {
        let res: ApiResponse = { err: false };
        try {
            const { body } = await this.httpClient.get(endpoint);
            res.data = JSON.parse(body) as UserStats[];
        } catch(ex) {
            console.warn(ex.message);
            res.err = true;
        }
        return res;
    }
}

export { ApiWrapper };