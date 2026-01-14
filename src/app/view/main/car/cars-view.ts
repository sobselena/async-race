import type { Car } from '../../../api/garageAPI';
import { Button } from '../../../components/button/button-creator';
import { Component } from '../../../utils/Component';
import './cars.scss';

export interface CarEvents {
  DELETE: (id: number) => Promise<void>;
  EDIT: () => void;
  START: (id: number, onStart: () => void) => void;
  STOP: (id: number, onStop: () => void) => void;
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
      carImgWrapper: Component;
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
    });
    const carImgWrapper = new Component({ tag: 'div', classes: ['car__image-wrapper'] });
    const carImg = new Component({ tag: 'div', classes: ['car__image'] });
    carImg.getNode().style.backgroundColor = `${color}`;
    carImgWrapper.appendChildren([carImg]);
    trackComponent.appendChildren([carImgWrapper]);
    this.carsMap.set(id, {
      name: nameComponent,
      carImgWrapper,
      track: trackComponent,
    });

    car.appendChildren([
      this.createCarStateWrapper(id, nameComponent),
      this.createCarBody(id, trackComponent),
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

  createCarBody(id: number, track: Component): Component {
    const carBody = new Component({ tag: 'div', classes: ['car__body'] });
    carBody.appendChildren([this.createControlButtons(id), track]);
    return carBody;
  }

  createControlButtons(id: number): Component {
    const carControlButtons = new Component({ tag: 'div', classes: ['car__control-buttons'] });
    const startButton = new Button({
      classes: ['car__start-button'],
      text: 'Start',
      onClick: () => {
        this.events.START(id, () => {
          stopButton.removeAttribute('disabled');
        });
        startButton.setAttribute('disabled', '');
      },
    });
    const stopButton = new Button({
      classes: ['car__stop-button'],
      text: 'Stop',
      onClick: () => {
        this.events.STOP(id, () => {
          startButton.removeAttribute('disabled');
        });
        stopButton.setAttribute('disabled', '');
      },
    });
    carControlButtons.appendChildren([startButton, stopButton]);
    return carControlButtons;
  }

  moveCar(id: number, velocity: number, distance: number) {
    const time = distance / velocity / 1000;
    const car = this.carsMap.get(id);
    if (!car) return;
    const trackWidth = car.track.getNode().clientWidth;
    const carWidth = car.carImgWrapper.getNode().clientWidth;
    const carImgWrapper = car.carImgWrapper.getNode();
    console.log('move', carImgWrapper);
    carImgWrapper.style.transition = `transform ${time}s linear`;
    carImgWrapper.style.transform = `translateX(${trackWidth - carWidth}px)`;
  }

  stopCar(id: number) {
    const car = this.carsMap.get(id);
    if (!car) return;

    const carImg = car.carImgWrapper.getNode();

    carImg.style.transition = '';
    carImg.style.transform = `translateX(0)`;
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

    car.carImgWrapper.getAllChildren()[0].getNode().style.backgroundColor = `${newColor}`;
  }

  clearCarsMap() {
    this.carsMap.clear();
  }

  resetEditId() {
    this.editId = null;
  }
}
