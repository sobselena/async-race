import { GarageAPI, type CarsResponse } from '../../../api/garageAPI';
import { Button } from '../../../components/button/button-creator';
import { Form } from '../../../components/form/form-creator';
import { InputField } from '../../../components/input-field/input-field-creator';
import { Component } from '../../../utils/Component';
import { CarsView } from '../car/cars-view';
import { PaginationView } from '../pagination/pagination-view';
import './garage.scss';

export class GarageView extends Component {
  private garageAPI: GarageAPI = new GarageAPI();

  private currentPage: number = 1;

  private readonly limit: number = 7;

  private carsData: CarsResponse | null = null;

  private garageCars: CarsView = this.createGarageCars();

  private carsCount: Component = this.createCarsCount();

  constructor() {
    super({ tag: 'div', classes: ['garage'] });

    this.configureView().catch(console.error);
  }

  async configureView(): Promise<void> {
    super.appendChildren([this.createInfoWrapper(), this.garageCars]);
    await this.updateGarage();
  }

  async updateGarage(): Promise<void> {
    await this.loadCars();
    this.renderCars();
    this.updateCarsCount();
  }

  createGarageCars(): CarsView {
    return new CarsView({ classes: ['garage__cars'] });
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
    const paginationEl = new PaginationView();
    garageInfoWrapper.appendChildren([garageTitle, this.createButtonsWrapper(), paginationEl]);

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
    const formEl = new Form({ classes: ['garage__form', 'garage__form_creator'] });
    const textInput = new InputField({ classes: ['garage__text-input'], type: 'text' });
    const colorInput = new InputField({ classes: ['garage__color-input'], type: 'color' });
    const submitButton = new Button({ classes: ['garage__submit-button'], text: 'Create' });
    formEl.appendChildren([textInput, colorInput, submitButton]);

    return formEl;
  }

  async loadCars() {
    const carsData = await this.garageAPI.getCars(this.currentPage, this.limit);
    this.carsData = carsData;
  }

  renderCars() {
    this.garageCars.deleteChildren();
    if (!this.carsData) return;
    this.carsData.data.forEach(carData => {
      this.garageCars.createCar(carData.name, carData.color);
    });
  }

  updateCarsCount() {
    this.carsCount.setText(String(this.carsData?.totalCount || 0));
  }
}
