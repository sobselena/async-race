const BASIC_URL = 'http://127.0.0.1:3000';
interface Car {
  name: string;
  color: string;
  id: number;
}
interface Engine {
  velocity: number;
  distance: number;
}
export class garageAPI {
  private readonly garageURL = `${BASIC_URL}/garage`;

  private readonly engineURL = `${BASIC_URL}/engine`;

  constructor() {}

  async sendRequest<T>(url: string, requestOpions?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, requestOpions);
      if (!response.ok) throw new Error(`Request Error: ${response.status}`);
      return (await response.json()) as T;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCars(page: number, limit: number): Promise<{ totalCount: number; data: Car[] }> {
    try {
      const response = await fetch(`${this.garageURL}?_page=${page}&_limit=${limit}`);
      if (!response.ok) throw new Error(`Request Error: ${response.status}`);
      const totalCount = Number(response.headers.get('X-Total-Count')) || 0;
      const data = (await response.json()) as Car[];
      return { totalCount, data };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getCar(id: number): Promise<Car> {
    return this.sendRequest<Car>(`${this.garageURL}/${id}`);
  }

  createCar(carParams: Car) {
    const body = JSON.stringify({
      name: carParams.name,
      color: carParams.color,
    });
    return this.sendRequest<Car>(`${this.garageURL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  }

  async deleteCar(id: number): Promise<void> {
    await fetch(`${this.garageURL}/${id}`, {
      method: 'DELETE',
    });
  }

  async updateCar(
    id: number,
    updatedCarParams: {
      name: string;
      color: string;
    }
  ): Promise<void> {
    const body = JSON.stringify(updatedCarParams);
    await fetch(`${this.garageURL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
  }

  changeEngineState(id: number, status: 'started' | 'stopped') {
    return this.sendRequest<Engine>(`${this.engineURL}/id=${id}/status=${status}`, {
      method: 'PATCH',
    });
  }

  async switchToDriveMode(id: number) {
    try {
      const response = await fetch(`${BASIC_URL}/engine?id=${id}&status=drive`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
