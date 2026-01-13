import { GarageAPI, type CarsResponse } from '../../../api/garageAPI';
import { Button } from '../../../components/button/button-creator';
import { Form } from '../../../components/form/form-creator';
import { InputField } from '../../../components/input-field/input-field-creator';
import { Component } from '../../../utils/Component';
import { CarsView, type CarEvents } from '../car/cars-view';
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
    totalCount: this.carsData?.totalCount || 0,
    onPageChange: () => {
      this.updateGarage().catch(console.error);
    },
  });

  constructor() {
    super({ tag: 'div', classes: ['garage'] });

    this.configureView().catch(console.error);
  }

  async configureView(): Promise<void> {
    super.appendChildren([this.createInfoWrapper(), this.createFormWrapper(), this.garageCars]);
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
    });

    const resetButton = new Button({
      classes: ['garage__button', 'garage__button_reset'],
      text: 'Reset Race',
    });
    buttonsWrapper.appendChildren([generateButton, startRaceButton, resetButton]);
    return buttonsWrapper;
  }

  createFormWrapper(): Form {
    const textInput = new InputField({ classes: ['garage__text-input'], type: 'text' });
    const colorInput = new InputField({ classes: ['garage__color-input'], type: 'color' });
    const submitButton = new Button({ classes: ['garage__submit-button'], text: 'Create' });
    const formEl = new Form({
      classes: ['garage__form', 'garage__form_creator'],
      onSubmit: (event: Event) => {
        event.preventDefault();
        const carName = textInput.getValue();
        if (!carName) return;
        const carColor = colorInput.getValue();
        textInput.setDeffaultValue();
        this.createCar(carName, carColor).catch(console.error);
      },
    });
    formEl.appendChildren([textInput, colorInput, submitButton]);

    return formEl;
  }

  async createCar(name: string, color: string) {
    await this.garageAPI.createCar({ name, color });
    await this.updateCurrentPage();
  }

  async deleteCar(id: number) {
    await this.garageAPI.deleteCar(id);
    await this.updateGarage();
  }

  async updateCurrentPage() {
    await this.loadCars();
    this.updateCarsCount();
    if (
      (Math.ceil((this.carsData?.totalCount || 0) / GARAGE_PAGINATION_LIMIT) || 1) ===
      this.pagination.getCurrentPage()
    ) {
      console.log('render cars');
      this.renderCars();
    }
  }

  async loadCars() {
    const carsData = await this.garageAPI.getCars(
      this.pagination.getCurrentPage(),
      GARAGE_PAGINATION_LIMIT
    );
    this.carsData = carsData;
    this.pagination.updateTotalCount(this.carsData?.totalCount || 0);
  }

  renderCars() {
    this.garageCars.deleteChildren();
    if (!this.carsData) return;
    this.carsData.data.forEach(carData => {
      this.garageCars.createCar(carData);
    });
  }

  updateCarsCount() {
    this.carsCount.setText(String(this.carsData?.totalCount || 0));
  }

  createEvents(): CarEvents {
    return {
      DELETE: (id: number) => this.deleteCar(id),
      EDIT: () => {},
      START: () => {},
      STOP: () => {},
    };
  }
}
