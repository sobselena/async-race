import { GarageAPI, type Car, type CarsResponse } from '../../../api/garageAPI';
import { Button } from '../../../components/button/button-creator';
import { Component } from '../../../utils/Component';
import { CarsView, type CarEvents } from '../car/cars-view';
import { CarFormView } from '../carForm/car-form-view';
import { PaginationView } from '../pagination/pagination-view';
import './garage.scss';

const GARAGE_PAGINATION_LIMIT = 7;
export class GarageView extends Component {
  private carsData: CarsResponse | null = null;

  private garageCars: CarsView = this.createGarageCars();

  private carsCount: Component = this.createCarsCount();

  private garageAPI: GarageAPI = new GarageAPI();

  private pagination: PaginationView = new PaginationView({
    limit: GARAGE_PAGINATION_LIMIT,
    totalCount: this.garageAPI.getTotalCount(),
    onPageChange: () => {
      this.updateGarage().catch(console.error);
    },
  });

  private updateForm: CarFormView = new CarFormView({
    onSubmit: (name: string, color: string) => {
      this.updateForm.toggleDisabled(true);
      const id = this.garageCars.getEditId();
      if (!id) return;
      this.updateCar({ name, color })
        .then(() => {
          this.garageCars.changeCarName(id, name);
          this.garageCars.changeCarColor(id, color);
          this.garageCars.resetEditId();
          this.updateForm.setDefaultValues();
        })
        .catch(console.error);
    },
    classes: ['garage__form', 'garage__form_update'],
    isDisabled: true,
    submitBtnText: 'Update',
  });

  constructor() {
    super({ tag: 'div', classes: ['garage'] });

    this.configureView().catch(console.error);
  }

  async configureView(): Promise<void> {
    super.appendChildren([this.createInfoWrapper(), this.createFormsWrapper(), this.garageCars]);
    await this.updateGarage();
  }

  async updateGarage(): Promise<void> {
    await this.loadCars();
    this.renderCars();
    this.updateCarsCount();
  }

  createGarageCars(): CarsView {
    return new CarsView({ classes: ['garage__cars'], events: this.createEvents() });
  }

  createCarsCount(): Component {
    return new Component({
      tag: 'span',
      classes: ['garage__cars-count'],
      text: '0',
    });
  }

  createInfoWrapper(): Component {
    const garageInfoWrapper = new Component({ tag: 'div', classes: ['garage__info-wrapper'] });
    const garageTitle = new Component(
      {
        tag: 'h2',
        classes: ['garage__title'],
        text: 'Garage ',
      },
      this.carsCount
    );

    garageInfoWrapper.appendChildren([garageTitle, this.createButtonsWrapper(), this.pagination]);

    return garageInfoWrapper;
  }

  createButtonsWrapper(): Component {
    const buttonsWrapper = new Component({ tag: 'div', classes: ['garage__buttons-wrapper'] });
    const generateButton = new Button({
      classes: ['garage__button', 'garage__button_generate'],
      text: 'Generate 100 Cars',
    });

    const startRaceButton = new Button({
      classes: ['garage__button', 'garage__button_start-race'],
      text: 'Start Race',
      onClick: () => {
        if (!this.carsData) return;
        this.garageCars.startAllRaces(this.carsData);
      },
    });

    const resetButton = new Button({
      classes: ['garage__button', 'garage__button_reset'],
      text: 'Reset Race',
      onClick: () => {
        if (!this.carsData) return;
        this.garageCars.stopAllRaces(this.carsData);
      },
    });
    buttonsWrapper.appendChildren([generateButton, startRaceButton, resetButton]);
    return buttonsWrapper;
  }

  createFormsWrapper() {
    const formsWrapper = new Component({ tag: 'div', classes: ['garage__forms-wrapper'] });
    const createForm = new CarFormView({
      onSubmit: (name, color) => {
        this.createCar(name, color).catch(console.error);
      },
      classes: ['garage__form', 'garage__form_create'],
      isDisabled: false,
      submitBtnText: 'Create',
    });

    formsWrapper.appendChildren([createForm, this.updateForm]);
    return formsWrapper;
  }

  async updateCar({ name, color }: Omit<Car, 'id'>) {
    const id = this.garageCars.getEditId();
    if (!id) {
      this.updateForm.toggleDisabled(true);
      return;
    }
    await this.garageAPI.updateCar({ name, color, id });
  }

  async createCar(name: string, color: string) {
    const newCarData = await this.garageAPI.createCar({ name, color });
    this.updateCurrentPage(newCarData);
    this.pagination.updateTotalCount(this.garageAPI.getTotalCount());
  }

  async deleteCar(id: number) {
    const isLastPage = this.isLastPage();
    if (id === this.garageCars.getEditId()) {
      this.garageCars.resetEditId();
      this.updateForm.toggleDisabled(true);
      this.updateForm.setDefaultValues();
    }
    await this.garageAPI.deleteCar(id);
    await this.updateGarage();
    if (this.garageAPI.getTotalCount() % GARAGE_PAGINATION_LIMIT === 0 && isLastPage) {
      this.pagination.decreaseCurrentPage();
    }
  }

  updateCurrentPage(newCarData: Car) {
    this.updateCarsCount();
    if (this.isLastPage()) {
      this.garageCars.createCar(newCarData);
    }
  }

  isLastPage(): boolean {
    return (
      (Math.ceil(this.garageAPI.getTotalCount() / GARAGE_PAGINATION_LIMIT) || 1) ===
      this.pagination.getCurrentPage()
    );
  }

  async loadCars() {
    const carsData = await this.garageAPI.getCars(
      this.pagination.getCurrentPage(),
      GARAGE_PAGINATION_LIMIT
    );
    this.carsData = carsData;
    this.pagination.updateTotalCount(this.garageAPI.getTotalCount());
  }

  renderCars() {
    this.garageCars.deleteChildren();
    this.garageCars.clearCarsMap();
    if (!this.carsData) return;
    this.carsData.data.forEach(carData => {
      this.garageCars.createCar(carData);
    });
  }

  updateCarsCount() {
    this.carsCount.setText(`${this.garageAPI.getTotalCount()}`);
  }

  async startRace(id: number) {
    const startEngineStateData = await this.garageAPI.changeEngineState(id, 'started');
    this.garageAPI.switchToDriveMode(id).catch(error => {
      this.garageCars.stopCar(id);
      console.error(error);
    });
    console.log(`id: ${id}`);
    console.log('startEngineStateData:', startEngineStateData);
    return startEngineStateData;
  }

  async stopRace(id: number) {
    const stopChangeEngineStateData = await this.garageAPI.changeEngineState(id, 'stopped');
    console.log(`id: ${id}`);
    console.log('startEngineStateData:', stopChangeEngineStateData);
  }

  createEvents(): CarEvents {
    return {
      DELETE: (id: number) => this.deleteCar(id),
      EDIT: () => {
        const id = this.garageCars.getEditId();
        if (!id) {
          this.updateForm.toggleDisabled(true);
          return;
        }
        this.updateForm.toggleDisabled(false);
        this.garageAPI
          .getCar(id)
          .then(data => {
            this.updateForm.setCarValues(data);
          })
          .catch(console.error);
      },
      START: (id: number, onStart: () => void) => {
        const car = this.garageCars.getCarsMap().get(id);
        if (!car) return;
        car.state = 'startPending';
        this.startRace(id)
          .then(({ velocity, distance }) => {
            if (car.state === 'stopPending') return;
            car.state = 'moving';

            onStart();
            console.log(id, velocity, distance);
            this.garageCars.moveCar(id, velocity, distance);
          })
          .catch(console.error);
      },
      STOP: (id: number, onStop: () => void) => {
        const car = this.garageCars.getCarsMap().get(id);
        if (!car || car.state === 'stopPending') return;
        if (car.state !== 'finished') {
          car.state = 'stopPending';
        }
        this.garageCars.stopCar(id);
        this.stopRace(id)
          .then(() => {
            onStop();
            car.state = 'in garage';
            this.garageCars.resetCarPosition(id);
          })
          .catch(console.error);
      },
    };
  }
}
