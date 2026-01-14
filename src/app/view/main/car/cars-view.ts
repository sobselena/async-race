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

  constructor({ classes, events }: CarProperties) {
    super({ tag: 'div', classes });
    this.events = events;
  }

  createCar({ name, color, id }: Car) {
    const car = new Component({ tag: 'div', classes: ['car'] });

    car.appendChildren([
      this.createCarStateWrapper(name, id),
      this.createCarBody(color),
      this.createTrackRoad(),
    ]);

    super.appendChildren([car]);
  }

  createCarStateWrapper(name: string, id: number): Component {
    const carStateWrapper = new Component({ tag: 'div', classes: ['car__state-wrapper'] });
    const editButton = new Button({
      classes: ['car__button', 'car__button_edit'],
      text: 'edit',
      onClick: this.events.EDIT,
    });
    const deleteButton = new Button({
      classes: ['car__button', 'car__button_delete'],
      text: 'delete',
      onClick: () => {
        this.events.DELETE(id).catch(console.error);
      },
    });
    const carName = new Component({ tag: 'h3', classes: ['car__name'], text: `${name}` });
    const carState = new Component({ tag: 'div', classes: ['car__state'], text: 'in garage' });

    carStateWrapper.appendChildren([editButton, deleteButton, carName, carState]);
    return carStateWrapper;
  }

  createCarBody(color: string): Component {
    const carBody = new Component({ tag: 'div', classes: ['car__body'] });
    carBody.appendChildren([this.createControlButtons(), this.createCarTrack(color)]);
    return carBody;
  }

  createControlButtons(): Component {
    const carControlButtons = new Component({ tag: 'div', classes: ['car__control-buttons'] });
    const startButton = new Button({ classes: ['car__start-button'], text: 'Start' });
    const stopButton = new Button({ classes: ['car__stop-button'], text: 'Stop' });
    carControlButtons.appendChildren([startButton, stopButton]);
    return carControlButtons;
  }

  createCarTrack(color: string): Component {
    const carTrack = new Component({ tag: 'div', classes: ['car__track'], text: color });

    return carTrack;
  }

  createTrackRoad(): Component {
    const trackRoad = new Component({ tag: 'div', classes: ['car__road'] });
    return trackRoad;
  }
}
