import { BaseAPI } from './baseAPI';

export const BASIC_URL = 'http://127.0.0.1:3000';
export interface Car {
  name: string;
  color: string;
  id: number;
}
export interface Engine {
  velocity: number;
  distance: number;
}
export interface CarsResponse {
  data: Car[];
  totalCount: number;
}
export class GarageAPI extends BaseAPI {
  private readonly garageURL = `${BASIC_URL}/garage`;

  private readonly engineURL = `${BASIC_URL}/engine`;

  private totalCount: number = 0;

  constructor() {
    super();
  }

  async getCars(page: number, limit: number): Promise<CarsResponse> {
    try {
      const response = await fetch(`${this.garageURL}?_page=${page}&_limit=${limit}`);
      if (!response.ok) throw new Error(`Request Error: ${response.status}`);
      const totalCount = Number(response.headers.get('X-Total-Count')) || 0;
      const data = (await response.json()) as Car[];
      this.totalCount = totalCount;
      return { totalCount, data };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getCar(id: number): Promise<Car> {
    return this.sendRequest<Car>(`${this.garageURL}/${id}`);
  }

  async createCar(carParams: Omit<Car, 'id'>) {
    const carData = await this.sendRequest<Car>(this.garageURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carParams),
    });

    this.totalCount += 1;
    return carData;
  }

  async deleteCar(id: number): Promise<void> {
    await this.sendRequest<void>(`${this.garageURL}/${id}`, { method: 'DELETE' });
    this.totalCount -= 1;
  }

  async updateCar({ name, color, id }: Car): Promise<void> {
    try {
      const body = JSON.stringify({ name, color });
      const response = await fetch(`${this.garageURL}/${id}`, {
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

  changeEngineState(id: number, status: 'started' | 'stopped'): Promise<Engine> {
    return this.sendRequest<Engine>(`${this.engineURL}?id=${id}&status=${status}`, {
      method: 'PATCH',
    });
  }

  async switchToDriveMode(id: number): Promise<{
    success: boolean;
  }> {
    try {
      const response = await fetch(`${this.engineURL}?id=${id}&status=drive`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      return response.json() as Promise<{
        success: boolean;
      }>;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getTotalCount(): number {
    return this.totalCount;
  }
}
