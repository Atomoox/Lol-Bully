import got, { Got } from 'got';
import { parseUserData } from './dataParser';
import { ApiCalls } from './apiCalls';

import { Account, UserStats, ApiResponse, FormattedStats, Events, MatchData, GameStats } from './types';

const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const DELAY = 5000;

class ApiWrapper {
    private listeners: {
        [event: string]: Function[];
    } = {};

    private apiCaller: ApiCalls;

    private account!: Account;

    private lastUpdatedUserData!: FormattedStats;

    private userName!: string;

    private shouldStop!: boolean;

    constructor(API_KEY: string) {
        this.apiCaller = new ApiCalls(API_KEY);
    }

    public async on(event: string, callback: Function) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    public async start(userName: string) {
        this.userName = userName;
        this.shouldStop = false;
        await this.monitorFlow();
    }

    public async stop() {
        this.shouldStop = true;
    }

    public async monitorFlow() {
        const userResponse = await this.apiCaller.getUser(this.userName);
        if (userResponse.err) {
            console.warn('Failed to get user data, stopping');
            process.exit(1);
        }
        this.account = userResponse.data;
        console.log(this.account);

        while (!this.shouldStop) {
            const { err, data } = await this.apiCaller.getUserData(this.account.id);
            if (err) {
                console.warn('Failed to gather user data');
                await pause(DELAY);
                continue;
            }
            const parsedDatas = parseUserData(data as UserStats[]);
            if (!parsedDatas) {
                await pause(DELAY);
                continue;
            }
                
            if (this.lastUpdatedUserData && this.lastUpdatedUserData.losses + this.lastUpdatedUserData.wins !== parsedDatas.losses + parsedDatas.wins) {
                const matchData = await this.getLastGameData(parsedDatas);
                if (!matchData) {
                    await pause(DELAY);
                    continue;
                }
                parsedDatas.losses > this.lastUpdatedUserData.losses ? 
                    this.emitEvent(Events.Loss, [matchData, parsedDatas]) : 
                    this.emitEvent(Events.Win, [matchData, parsedDatas]);
                
            }
            this.lastUpdatedUserData = parsedDatas;
            await pause(DELAY);
        }
    }

    private async getLastGameData(data: FormattedStats): Promise<GameStats | null> {
        const historyData = await this.apiCaller.getUserHistory(this.account.puuid);
        if (historyData.err) {
            console.warn('Failed to get last match data');
            return null;
        }
        const history = historyData.data;
        const lastMatchId = history[0];
        const lastMatchData = await this.apiCaller.getMatchData(lastMatchId);
        const matchData =  lastMatchData.data as MatchData;
        const userMatchData = matchData.info.participants.find(x => x.puuid === this.account.puuid);
        return {
            champion: userMatchData?.championName as string,
            damages: userMatchData?.totalDamageDealtToChampions as number,
            kda: `${userMatchData?.kills}/${userMatchData?.deaths}/${userMatchData?.assists}`,
            wins: data.wins,
            losses: data.losses,
            justwon:  !(data.losses > this.lastUpdatedUserData.losses),
            userName: this.account.name,
            profileIcon: `http://ddragon.leagueoflegends.com/cdn/12.4.1/img/profileicon/${this.account.profileIconId}.png`,
        }
    }

    private emitEvent(event: Events, args: any[]) {
        this.listeners[event].forEach((x: Function) => {
            x(...args);
        });
    }
}

export { ApiWrapper };