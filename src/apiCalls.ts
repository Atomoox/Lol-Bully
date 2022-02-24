import got, {Got} from 'got';
import { Account, UserStats, ApiResponse, FormattedStats, Events, MatchData, GameStats } from './types';

class ApiCalls {
    private httpClient: Got;

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
        });
    }

    public getUser(userName: string): Promise<ApiResponse> {
        return this.queryApi(`summoner/v4/summoners/by-name/${userName}`);
    }

    public getUserData(accountId: string): Promise<ApiResponse> {
        return this.queryApi(`league/v4/entries/by-summoner/${accountId}`);
    }

    public getUserHistory(puuid: string): Promise<ApiResponse> {
        return this.queryApi(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`)
    }

    public async getMatchData(matchId: string): Promise<ApiResponse> {
        return this.queryApi(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`)
    }

    private async queryApi(endpoint: string): Promise<ApiResponse> {
        let res: ApiResponse = { err: false };
        try {
            const { body } = await this.httpClient.get(endpoint, {
                prefixUrl: endpoint.startsWith('https') ? undefined : 'https://euw1.api.riotgames.com/lol/'
            });
            res.data = JSON.parse(body) as UserStats[];
        } catch(ex) {
            console.warn(ex.message);
            res.err = true;
        }
        return res;
    }
}

export { ApiCalls };