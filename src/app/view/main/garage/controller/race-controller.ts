import type { Car, GarageAPI } from '../../../../api/garageAPI';
import type { Button } from '../../../../components/button/button-creator';
import type { PaginationView } from '../../pagination/pagination-view';
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
  pagination: PaginationView;
}
export class RaceController {
  private api: GarageAPI;

  private store: CarsStore;

  private view: CarsListView;

  private updateForm: CarFormView;

  private startAllBtn: Button;

  private resetAllBtn: Button;

  private pagination: PaginationView;

  constructor({
    api,
    store,
    view,
    updateForm,
    startAllBtn,
    resetAllBtn,
    pagination,
  }: RaceControllerProperties) {
    this.api = api;
    this.store = store;
    this.view = view;
    this.updateForm = updateForm;
    this.startAllBtn = startAllBtn;
    this.resetAllBtn = resetAllBtn;
    this.pagination = pagination;
  }

  async start(id: number) {
    const car = this.store.get(id);
    if (!car || car.state !== carStates.IN_GARAGE) return;
    const currentTime: number = Date.now();
    this.store.setTimeId(id, currentTime);
    this.startAllBtn.setAttribute('disabled', '');
    this.resetAllBtn.removeAttribute('disabled');
    this.view.getCarsMap().forEach(carItem => {
      carItem.disableStateButtons(true);
    });
    this.pagination.toggleButtons(true);
    this.store.setState(id, carStates.STARTING);
    this.view.get(id)?.setState(carStates.STARTING);
    if (id === this.updateForm.getEditId()) {
      this.updateForm.toggleDisabled(true);
    }
    try {
      const { velocity, distance } = await this.api.changeEngineState(id, 'started');
      if (this.store.get(id)?.timeId !== currentTime) return;
      this.store.setState(id, carStates.MOVING);
      this.view.get(id)?.setState(carStates.MOVING);

      this.view.get(id)?.startMove(distance / velocity / 1000);
      this.api.switchToDriveMode(id).catch(() => {
        if (this.store.get(id)?.timeId !== currentTime) return;
        if (this.store.get(id)?.state === carStates.MOVING) {
          this.view.get(id)?.stopMove();
          this.store.setState(id, carStates.BROKEN);
          this.view.get(id)?.setState(carStates.BROKEN);
        }
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async stop(id: number) {
    const carView = this.view.get(id);
    if (!carView) return;
    const currentTime: number = Date.now();
    this.store.setTimeId(id, currentTime);
    this.store.setState(id, carStates.STOPPED);
    carView.setState(carStates.STOPPED);
    carView.stopMove();
    await this.api.changeEngineState(id, 'stopped');
    if (this.store.get(id)?.timeId !== currentTime) return;
    carView.resetPosition();

    this.store.setState(id, carStates.IN_GARAGE);
    carView.setState(carStates.IN_GARAGE);

    if (id === this.updateForm.getEditId()) {
      this.updateForm.toggleDisabled(false);
    }

    if (this.store.all().every(({ state }) => state === carStates.IN_GARAGE)) {
      this.resetAllBtn.setAttribute('disabled', '');
      this.startAllBtn.removeAttribute('disabled');
      this.pagination.toggleButtons(false);
      this.view.getCarsMap().forEach(carItem => {
        carItem.disableStateButtons(false);
      });
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
