import type { Car, GarageAPI } from '../../../../api/garageAPI';
import type { Button } from '../../../../components/button/button-creator';
import { carStates } from '../model/car-state';
import type { CarsStore } from '../model/car-store';
import type { CarsListView } from '../view/cars-list/cars-list-view';
import type { CarFormView } from '../view/form/car-form-view';

export interface RaceControllerProperties {
  api: GarageAPI;
  store: CarsStore;
  view: CarsListView;
  updateForm: CarFormView;
  startAllBtn: Button;
  resetAllBtn: Button;
}
export class RaceController {
  private api: GarageAPI;

  private store: CarsStore;

  private view: CarsListView;

  private updateForm: CarFormView;

  private startAllBtn: Button;

  private resetAllBtn: Button;

  constructor({
    api,
    store,
    view,
    updateForm,
    startAllBtn,
    resetAllBtn,
  }: RaceControllerProperties) {
    this.api = api;
    this.store = store;
    this.view = view;
    this.updateForm = updateForm;
    this.startAllBtn = startAllBtn;
    this.resetAllBtn = resetAllBtn;
  }

  async start(id: number) {
    const car = this.store.get(id);
    if (!car || car.state !== carStates.IN_GARAGE) return;
    this.startAllBtn.setAttribute('disabled', '');
    this.resetAllBtn.removeAttribute('disabled');

    this.store.setState(id, carStates.STARTING);
    this.view.get(id)?.setState(carStates.STARTING);
    if (id === this.updateForm.getEditId()) {
      this.updateForm.toggleDisabled(true);
    }
    try {
      const { velocity, distance } = await this.api.changeEngineState(id, 'started');
      this.store.setState(id, carStates.MOVING);
      this.view.get(id)?.setState(carStates.MOVING);

      this.view.get(id)?.startMove(distance / velocity / 1000);
    } catch {
      this.store.setState(id, carStates.BROKEN);
      this.view.get(id)?.setState(carStates.BROKEN);
    }
  }

  async stop(id: number) {
    const carView = this.view.get(id);
    if (!carView) return;

    this.store.setState(id, carStates.STOPPED);
    carView.setState(carStates.STOPPED);
    carView.stopMove();
    await this.api.changeEngineState(id, 'stopped');

    carView.resetPosition();

    this.store.setState(id, carStates.IN_GARAGE);
    carView.setState(carStates.IN_GARAGE);

    if (id === this.updateForm.getEditId()) {
      this.updateForm.toggleDisabled(false);
    }

    if (this.store.all().every(({ state }) => state === carStates.IN_GARAGE)) {
      this.resetAllBtn.setAttribute('disabled', '');
      this.startAllBtn.removeAttribute('disabled');
    }
  }

  async delete(id: number) {
    await this.api.deleteCar(id);
    this.store.remove(id);
    this.view.remove(id);
  }

  edit(id: number, car: Car) {
    this.updateForm.setEditId(id);
    this.updateForm.setCarValues(car);
    this.updateForm.toggleDisabled(false);
  }

  async startAll() {
    const cars = this.store.all();

    await Promise.all(
      cars.filter(car => car.state === carStates.IN_GARAGE).map(car => this.start(car.id))
    );
  }

  async stopAll() {
    const cars = this.store.all();

    await Promise.all(
      cars.filter(car => car.state !== carStates.IN_GARAGE).map(car => this.stop(car.id))
    );
  }
}
