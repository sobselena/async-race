import { Button } from '../../../components/button/button-creator';
import { Component } from '../../../utils/Component';
import './cars.scss';

interface CarProperties {
  classes: string[];
}
export class CarsView extends Component {
  constructor({ classes }: CarProperties) {
    super({ tag: 'div', classes });
  }

  createCar(name: string, color: string) {
    const car = new Component({ tag: 'div', classes: ['car'] });

    car.appendChildren([
      this.createCarStateWrapper(name),
      this.createCarBody(color),
      this.createTrackRoad(),
    ]);

    super.appendChildren([car]);
  }

  createCarStateWrapper(name: string): Component {
    const carStateWrapper = new Component({ tag: 'div', classes: ['car__state-wrapper'] });
    const editButton = new Button({ classes: ['car__button', 'car__button_edit'] });
    const deleteButton = new Button({ classes: ['car__button', 'car__button_delete'] });
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
