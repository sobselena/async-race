import { carStates, type CarStatesValues } from './car-state';

export interface CarRuntimeData {
  id: number;
  state: CarStatesValues;
  timeId: number;
}

export class CarsStore {
  private cars = new Map<number, CarRuntimeData>();

  init(id: number) {
    this.cars.set(id, { id, state: carStates.IN_GARAGE, timeId: 0 });
  }

  setTimeId(id: number, timeId: number) {
    const car = this.cars.get(id);
    if (!car) return;
    car.timeId = timeId;
  }

  setState(id: number, state: CarStatesValues) {
    const car = this.cars.get(id);
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
  }
}
