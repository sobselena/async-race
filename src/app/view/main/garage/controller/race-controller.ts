import type { Car, GarageAPI } from '../../../../api/garageAPI';
import type { WinnersAPI } from '../../../../api/winnersAPI';
import type { Button } from '../../../../components/button/button-creator';
import type { PaginationView } from '../../pagination/pagination-view';
import { carStates } from '../model/car-state';
import type { CarsStore } from '../model/car-store';
import type { CarsListView } from '../view/cars-list/cars-list-view';
import type { CarFormView } from '../view/form/car-form-view';

export interface RaceControllerProperties {
  garageAPI: GarageAPI;
  winnerAPI: WinnersAPI;
  store: CarsStore;
  view: CarsListView;
  updateForm: CarFormView;
  startAllBtn: Button;
  resetAllBtn: Button;
  pagination: PaginationView;
}
export class RaceController {
  private garageAPI: GarageAPI;

  private winnerAPI: WinnersAPI;

  private store: CarsStore;

  private view: CarsListView;

  private updateForm: CarFormView;

  private startAllBtn: Button;

  private resetAllBtn: Button;

  private pagination: PaginationView;

  constructor({
    garageAPI,
    winnerAPI,
    store,
    view,
    updateForm,
    startAllBtn,
    resetAllBtn,
    pagination,
  }: RaceControllerProperties) {
    this.garageAPI = garageAPI;
    this.store = store;
    this.view = view;
    this.updateForm = updateForm;
    this.startAllBtn = startAllBtn;
    this.resetAllBtn = resetAllBtn;
    this.pagination = pagination;
    this.winnerAPI = winnerAPI;
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
      const { velocity, distance } = await this.garageAPI.changeEngineState(id, 'started');
      if (this.store.get(id)?.timeId !== currentTime) return;
      this.store.setState(id, carStates.MOVING);
      this.view.get(id)?.setState(carStates.MOVING);

      this.view.get(id)?.startMove(distance / velocity / 1000);
      this.garageAPI.switchToDriveMode(id).catch(() => {
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
    await this.garageAPI.changeEngineState(id, 'stopped');
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
    await this.garageAPI.deleteCar(id);
    this.store.remove(id);
    this.view.remove(id);
  }

  edit(id: number, car: Car) {
    this.updateForm.setEditId(id);
    this.updateForm.setCarValues(car);
    this.updateForm.toggleDisabled(false);
  }

  async startAll() {
    this.store.resetWinner();
    this.store.setIsAllStarted(true);
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
    this.store.setIsAllStarted(false);
  }

  async finish(id: number, currentTime: number) {
    const isWinner = this.store.setWinner(id);
    const carView = this.view.get(id);
    if (!isWinner) {
      carView?.setState(
        carStates.FINISHED,
        `${carStates.FINISHED}(${Math.round(currentTime * 100) / 100}s)`
      );
      return;
    }

    carView?.setState(
      carStates.WINNER,
      `${carStates.WINNER}(${Math.round(currentTime * 100) / 100}s)`
    );
    let winner;
    try {
      winner = await this.winnerAPI.getWinner(id);
    } catch {
      winner = null;
    }

    if (winner) {
      await this.winnerAPI.updateWinner({
        id,
        wins: winner.wins + 1,
        time: Math.min(winner.time, currentTime),
      });
    } else {
      await this.winnerAPI.createWinner({ id, wins: 1, time: currentTime });
    }
  }
}
