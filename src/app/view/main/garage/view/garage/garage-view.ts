import { GarageAPI } from '../../../../../api/garageAPI';
import { Button } from '../../../../../components/button/button-creator';
import { Component } from '../../../../../utils/Component';
import { PaginationView } from '../../../pagination/pagination-view';
import { RaceController } from '../../controller/race-controller';
import { CarsStore } from '../../model/car-store';
import { CarItemView } from '../car-item/car-item-view';
import { CarsListView } from '../cars-list/cars-list-view';
import { CarFormView } from '../form/car-form-view';

const GARAGE_PAGINATION_LIMIT = 7;

export class GarageView extends Component {
  private api = new GarageAPI();

  private store = new CarsStore();

  private carsView = new CarsListView();

  private pagination: PaginationView;

  private controller: RaceController;

  private createForm!: CarFormView;

  private updateForm!: CarFormView;

  private startRaceBtn!: Button;

  private resetRaceBtn!: Button;

  constructor() {
    super({ tag: 'div', classes: ['garage'] });

    this.pagination = this.createPagination();
    const formWrapper = this.createGarageFormWrapper();
    this.controller = new RaceController({
      api: this.api,
      store: this.store,
      view: this.carsView,
      updateForm: this.updateForm,
      startAllBtn: this.startRaceBtn,
      resetAllBtn: this.resetRaceBtn,
      pagination: this.pagination,
    });
    this.appendChildren([formWrapper, this.carsView, this.pagination]);

    this.loadCars().catch(console.error);
  }

  createGarageFormWrapper(): Component {
    const garageFormWrapper = new Component({ tag: 'div', classes: ['garage__forms-wrapper'] });
    this.createForm = new CarFormView({
      classes: ['garage__form', 'garage__form_create'],
      submitBtnText: 'Create',
      onSubmit: (name, color) => {
        this.createCar(name, color).catch(console.error);
      },
    });

    this.updateForm = new CarFormView({
      classes: ['garage__form', 'garage__form_update'],
      submitBtnText: 'Update',
      isDisabled: true,
      onSubmit: (name, color) => {
        this.updateCar(name, color).catch(console.error);
      },
    });
    garageFormWrapper.appendChildren([this.createForm, this.createRaceButtons(), this.updateForm]);
    return garageFormWrapper;
  }

  createPagination(): PaginationView {
    return new PaginationView({
      limit: GARAGE_PAGINATION_LIMIT,
      totalCount: this.api.getTotalCount(),
      onPageChange: () => {
        this.loadCars().catch(console.error);
      },
    });
  }

  createRaceButtons(): Component {
    const wrapper = new Component({ tag: 'div', classes: ['garage__buttons-wrapper'] });

    this.startRaceBtn = new Button({
      classes: ['garage__button'],
      text: 'Start All Races',
      onClick: () => {
        this.startRaceBtn.setAttribute('disabled', '');
        this.controller.startAll().catch(console.error);
      },
    });

    this.resetRaceBtn = new Button({
      classes: ['garage__button'],
      text: 'Reset All Races',
      onClick: () => {
        this.resetRaceBtn.setAttribute('disabled', '');
        this.controller.stopAll().catch(console.error);
      },
    });

    this.resetRaceBtn.setAttribute('disabled', '');

    wrapper.appendChildren([this.startRaceBtn, this.resetRaceBtn]);
    return wrapper;
  }

  async loadCars() {
    const page = this.pagination.getCurrentPage();

    const cars = await this.api.getCars(page, GARAGE_PAGINATION_LIMIT);

    this.pagination.updateTotalCount(this.api.getTotalCount());

    this.carsView.clear();
    this.store.clear();
    cars.data.forEach(car => {
      this.store.init(car.id);

      const view = new CarItemView(car.id, car.name, car.color, {
        onStart: id => {
          return this.controller.start(id);
        },
        onStop: id => {
          return this.controller.stop(id);
        },
        onDelete: id => this.deleteCar(id),
        onEdit: id => this.controller.edit(id, car),
      });

      this.carsView.add(view);
    });
  }

  async createCar(name: string, color: string) {
    await this.api.createCar({ name, color });
    this.pagination.updateTotalCount(this.api.getTotalCount());
    await this.loadCars();
  }

  async updateCar(name: string, color: string) {
    const id = this.updateForm.getEditId();
    if (!id) return;

    await this.api.updateCar({ id, name, color });

    this.updateForm.setDefaultValues();
    this.updateForm.toggleDisabled(true);

    await this.loadCars();
  }

  async deleteCar(id: number) {
    await this.controller.delete(id);
    if (this.store.all().length === 0) {
      this.pagination.decreaseCurrentPage();
      this.pagination.updateTotalCount(this.api.getTotalCount());
    }
    await this.loadCars();
  }
}
