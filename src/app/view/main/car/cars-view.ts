import type { Car } from '../../../api/garageAPI';
import { Button } from '../../../components/button/button-creator';
import { Component } from '../../../utils/Component';
import './cars.scss';

export interface CarEvents {
  DELETE: (id: number) => Promise<void>;
  EDIT: () => void;
  START: () => void;
  STOP: () => void;
}
interface CarProperties {
  classes: string[];
  events: CarEvents;
}
export class CarsView extends Component {
  private events: CarEvents;

  private editId: number | null = null;

  private carsMap = new Map<
    number,
    {
      name: Component;
      track: Component;
    }
  >();

  constructor({ classes, events }: CarProperties) {
    super({ tag: 'div', classes });
    this.events = events;
  }

  createCar({ name, color, id }: Car) {
    const car = new Component({ tag: 'div', classes: ['car'] });

    const nameComponent = new Component({
      tag: 'h3',
      classes: ['car__name'],
      text: name,
    });

    const trackComponent = new Component({
      tag: 'div',
      classes: ['car__track'],
      text: color,
    });

    this.carsMap.set(id, {
      name: nameComponent,
      track: trackComponent,
    });

    car.appendChildren([
      this.createCarStateWrapper(id, nameComponent),
      this.createCarBody(trackComponent),
      this.createTrackRoad(),
    ]);

    this.appendChildren([car]);
  }

  createCarStateWrapper(id: number, carName: Component): Component {
    const stateWrapper = new Component({ tag: 'div', classes: ['car__state-wrapper'] });

    const editButton = new Button({
      classes: ['car__button', 'car__button_edit'],
      text: 'edit',
      onClick: () => {
        this.editId = id;
        this.events.EDIT();
      },
    });

    const deleteButton = new Button({
      classes: ['car__button', 'car__button_delete'],
      text: 'delete',
      onClick: () => {
        this.events.DELETE(id).catch(console.error);
      },
    });

    const state = new Component({
      tag: 'div',
      classes: ['car__state'],
      text: 'in garage',
    });

    stateWrapper.appendChildren([editButton, deleteButton, carName, state]);
    return stateWrapper;
  }

  createCarBody(track: Component): Component {
    const carBody = new Component({ tag: 'div', classes: ['car__body'] });
    carBody.appendChildren([this.createControlButtons(), track]);
    return carBody;
  }

  createControlButtons(): Component {
    const carControlButtons = new Component({ tag: 'div', classes: ['car__control-buttons'] });
    const startButton = new Button({ classes: ['car__start-button'], text: 'Start' });
    const stopButton = new Button({ classes: ['car__stop-button'], text: 'Stop' });
    carControlButtons.appendChildren([startButton, stopButton]);
    return carControlButtons;
  }

  createTrackRoad(): Component {
    const trackRoad = new Component({ tag: 'div', classes: ['car__road'] });
    return trackRoad;
  }

  getEditId() {
    return this.editId;
  }

  changeCarName(id: number, newName: string) {
    const car = this.carsMap.get(id);
    if (!car) return;

    car.name.setText(newName);
  }

  changeCarColor(id: number, newColor: string) {
    const car = this.carsMap.get(id);
    if (!car) return;

    car.track.setText(newColor);
  }

  clearCarsMap() {
    this.carsMap.clear();
  }

  resetEditId() {
    this.editId = null;
  }
}
