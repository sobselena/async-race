import { BaseAPI } from './baseAPI';
import { BASIC_URL } from './garageAPI';

export interface Winner {
  id: number;
  wins: number;
  time: number;
}
export interface WinnersResponse {
  data: Winner[];
  totalCount: number;
}

export interface WinnersParams {
  page: number;
  limit: number;
  sort: 'id' | 'wins' | 'time';
  order: 'asc' | 'desc';
}
export class WinnersAPI extends BaseAPI {
  private readonly winnersURL = `${BASIC_URL}/winners`;

  private totalCount: number = 0;

  constructor() {
    super();
  }

  async getWinners({ page, limit, sort, order }: WinnersParams): Promise<WinnersResponse> {
    try {
      const response = await fetch(
        `${this.winnersURL}?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`
      );
      if (!response.ok) throw new Error(`Request Error: ${response.status}`);
      const totalCount = Number(response.headers.get('X-Total-Count')) || 0;
      const data = (await response.json()) as Winner[];
      this.totalCount = totalCount;
      return { totalCount, data };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getWinner(id: number): Promise<Winner> {
    return this.sendRequest<Winner>(`${this.winnersURL}/${id}`);
  }

  async createWinner(winnerParams: Winner) {
    const body = JSON.stringify({
      time: winnerParams.time,
      wins: winnerParams.wins,
      id: winnerParams.id,
    });
    const winnerData = await this.sendRequest<Winner>(`${this.winnersURL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    this.totalCount += 1;
    return winnerData;
  }

  async deleteWinner(id: number): Promise<void> {
    await this.sendRequest<void>(`${this.winnersURL}/${id}`, { method: 'DELETE' });
    this.totalCount -= 1;
  }

  async updateWinner({ wins, time, id }: Winner): Promise<void> {
    try {
      const body = JSON.stringify({ wins, time });
      const response = await fetch(`${this.winnersURL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      if (!response.ok) throw new Error(`Request Error: ${response.status}`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getTotalCount(): number {
    return this.totalCount;
  }
}
