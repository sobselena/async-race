import { carStates, type CarStatesValues } from './car-state';

export interface CarRuntimeData {
  id: number;
  state: CarStatesValues;
  timeId: number;
  startTime: number;
}

export class CarsStore {
  private cars = new Map<number, CarRuntimeData>();

  private winnerId: number | null = null;

  private isAllStarted: boolean = false;

  setWinner(id: number) {
    if (!this.isAllStarted) return false;
    if (this.winnerId !== null) return false;
    this.winnerId = id;

    return true;
  }

  getIsAllStarted() {
    return this.isAllStarted;
  }

  setIsAllStarted(isAllStarted: boolean) {
    this.isAllStarted = isAllStarted;
  }

  getWinner() {
    return this.winnerId;
  }

  resetWinner() {
    this.winnerId = null;
  }

  init(id: number) {
    this.cars.set(id, { id, state: carStates.IN_GARAGE, timeId: 0, startTime: 0 });
  }

  setStartTime(id: number, newTime: number) {
    const car = this.get(id);
    if (!car) return;
    car.startTime = newTime;
  }

  getStartTime(id: number) {
    return this.get(id)?.startTime || 0;
  }

  setTimeId(id: number, timeId: number) {
    const car = this.get(id);
    if (!car) return;
    car.timeId = timeId;
  }

  setState(id: number, state: CarStatesValues) {
    const car = this.get(id);
    if (!car) return;
    car.state = state;
  }

  get(id: number) {
    return this.cars.get(id);
  }

  all() {
    return Array.from(this.cars.values());
  }

  remove(id: number) {
    this.cars.delete(id);
  }

  clear() {
    this.cars.clear();
    this.resetWinner();
    this.isAllStarted = false;
  }
}
