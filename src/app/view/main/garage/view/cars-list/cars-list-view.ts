import { Component } from '../../../../../utils/Component';
import type { CarItemView } from '../car-item/car-item-view';

export class CarsListView extends Component {
  private cars = new Map<number, CarItemView>();

  constructor() {
    super({ tag: 'div', classes: ['garage__cars'] });
  }

  add(car: CarItemView) {
    this.cars.set(car.getId(), car);
    this.appendChildren([car]);
  }

  get(id: number) {
    return this.cars.get(id);
  }

  remove(id: number) {
    const view = this.cars.get(id);
    if (!view) return;

    view.destroy();
    this.cars.delete(id);
  }

  clear() {
    this.cars.clear();
    this.deleteChildren();
  }

  getCarsMap() {
    return this.cars;
  }

  resetAllPositions() {
    this.cars.forEach(car => car.resetPosition());
  }

  toggleAllButtons(disabled: boolean) {
    this.cars.forEach(car => car.setButtonsDisabled(disabled));
  }
}
