import { GarageAPI } from '../../../../../api/garageAPI';
import { WinnersAPI } from '../../../../../api/winnersAPI';
import { Button } from '../../../../../components/button/button-creator';
import { Component } from '../../../../../utils/Component';
import type { HeaderView } from '../../../../header/header-view';
import { paginationStore } from '../../../pagination/pagination-store';
import { PaginationView } from '../../../pagination/pagination-view';
import { RaceController } from '../../controller/race-controller';
import { CarsStore } from '../../model/car-store';
import { CarItemView } from '../car-item/car-item-view';
import { CarsListView } from '../cars-list/cars-list-view';
import { CarFormView } from '../form/car-form-view';
import './garage.scss';

const GARAGE_PAGINATION_LIMIT = 7;

export class GarageView extends Component {
  private garageAPI = new GarageAPI();

  private winnerAPI = new WinnersAPI();

  private store = new CarsStore();

  private carsView = new CarsListView();

  private pagination: PaginationView;

  private controller: RaceController;

  private createForm!: CarFormView;

  private updateForm!: CarFormView;

  private startRaceBtn!: Button;

  private resetRaceBtn!: Button;

  private totalCount!: Component;

  private header: HeaderView;

  private generateCarsBtn!: Button;

  constructor(header: HeaderView) {
    super({ tag: 'div', classes: ['garage'] });
    this.header = header;
    this.pagination = this.createPagination();
    const formWrapper = this.createGarageFormWrapper();
    this.controller = new RaceController({
      garageAPI: this.garageAPI,
      winnerAPI: this.winnerAPI,
      header: this.header,
      store: this.store,
      view: this.carsView,
      createForm: this.createForm,
      updateForm: this.updateForm,
      startAllBtn: this.startRaceBtn,
      resetAllBtn: this.resetRaceBtn,
      generateCarsBtn: this.generateCarsBtn,
      pagination: this.pagination,
    });
    this.appendChildren([this.createGarageInfoWrapper(), formWrapper, this.carsView]);

    this.loadCars().catch(console.error);
  }

  createGarageInfoWrapper(): Component {
    this.totalCount = new Component({
      tag: 'span',
      classes: ['garage__total-count'],
      text: `(${this.garageAPI.getTotalCount()})`,
    });
    const garageInfoWrapper = new Component({ tag: 'div', classes: ['garage__info-wrapper'] });
    const garageTitle = new Component({ tag: 'h2', text: 'Garage ' }, this.totalCount);

    garageInfoWrapper.appendChildren([garageTitle, this.pagination]);
    return garageInfoWrapper;
  }

  updateTotalCount() {
    this.totalCount.setText(`(${this.garageAPI.getTotalCount()})`);
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
    const pagination = new PaginationView({
      limit: GARAGE_PAGINATION_LIMIT,
      totalCount: this.garageAPI.getTotalCount(),
      onPageChange: () => {
        paginationStore.garagePage = pagination.getCurrentPage();
        this.loadCars().catch(console.error);
      },
    });
    pagination.setCurrentPage(paginationStore.garagePage);
    return pagination;
  }

  createRaceButtons(): Component {
    const wrapper = new Component({ tag: 'div', classes: ['garage__buttons-wrapper'] });

    this.generateCarsBtn = new Button({
      classes: ['garage__button'],
      text: 'Generate 100 cars',
    });
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

    wrapper.appendChildren([this.generateCarsBtn, this.startRaceBtn, this.resetRaceBtn]);
    return wrapper;
  }

  async loadCars() {
    const page = this.pagination.getCurrentPage();

    const cars = await this.garageAPI.getCars(page, GARAGE_PAGINATION_LIMIT);
    this.updateTotalCount();
    this.pagination.updateTotalCount(this.garageAPI.getTotalCount());

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
        onFinish: id => {
          return this.controller.finish(id);
        },
      });

      this.carsView.add(view);
    });
  }

  async createCar(name: string, color: string) {
    await this.garageAPI.createCar({ name, color });
    this.pagination.updateTotalCount(this.garageAPI.getTotalCount());
    await this.loadCars();
  }

  async updateCar(name: string, color: string) {
    const id = this.updateForm.getEditId();
    if (!id) return;

    await this.garageAPI.updateCar({ id, name, color });
    this.updateForm.setDefaultValues();
    this.updateForm.toggleDisabled(true);

    await this.loadCars();
    this.updateTotalCount();
  }

  async deleteCar(id: number) {
    await this.controller.delete(id);
    if (this.store.all().length === 0) {
      this.pagination.decreaseCurrentPage();
      this.pagination.updateTotalCount(this.garageAPI.getTotalCount());
    }
    await this.loadCars();
    this.updateTotalCount();
  }
}
