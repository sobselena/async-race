import { Button } from '../../../../../components/button/button-creator';
import { Component } from '../../../../../utils/Component';
import { carStates, type CarStatesValues } from '../../model/car-state';

import './car-item.scss';

interface CarItemEvents {
  onStart(id: number): Promise<void>;
  onStop(id: number): Promise<void>;
  onEdit(id: number): void;
  onDelete(id: number): Promise<void>;
  onFinish(id: number): Promise<void>;
}

export class CarItemView extends Component {
  private stateContainer!: Component;

  private startBtn!: Button;

  private stopBtn!: Button;

  private editBtn!: Button;

  private deleteBtn!: Button;

  private imgWrapper!: Component;

  private track!: Component;

  private id: number;

  private events: CarItemEvents;

  constructor(id: number, name: string, color: string, events: CarItemEvents) {
    super({ tag: 'div', classes: ['car'] });
    this.id = id;
    this.events = events;
    this.render(name, color);
  }

  private render(name: string, color: string) {
    this.stateContainer = this.createStateContainer();
    this.startBtn = this.createStartButton();
    this.stopBtn = this.createStopButton();
    this.stopBtn.setAttribute('disabled', '');
    this.track = this.createTrackLayout(color);
    this.editBtn = this.createEditButton();
    this.deleteBtn = this.createDeleteButton();

    const carName = new Component({ tag: 'h3', text: name });
    this.appendChildren([
      this.createCarStateWrapper(carName),
      this.startBtn,
      this.stopBtn,
      this.track,
    ]);
  }

  createTrackLayout(color: string) {
    const track = new Component({ tag: 'div', classes: ['car__track'] });

    this.imgWrapper = this.createCarImage(color);
    track.appendChildren([this.startBtn, this.stopBtn, this.imgWrapper]);
    return track;
  }

  getTrackDistance(): number {
    const trackWidth = this.track.getNode().clientWidth;
    const carWidth = this.imgWrapper.getNode().clientWidth;

    return trackWidth - carWidth;
  }

  private createStateContainer(): Component {
    return new Component({
      tag: 'div',
      classes: ['car__state'],
      text: carStates.IN_GARAGE,
    });
  }

  private createStartButton(): Button {
    return new Button({
      classes: ['car__button', 'car__button_start'],
      text: 'Start',
      onClick: () => {
        this.events.onStart(this.id).catch(console.error);
      },
    });
  }

  private createStopButton(): Button {
    return new Button({
      classes: ['car__button', 'car__button_stop'],
      text: 'Stop',
      onClick: () => {
        this.events.onStop(this.id).catch(console.error);
      },
    });
  }

  private createEditButton(): Button {
    return new Button({
      classes: ['car__button', 'car__button_edit'],
      text: 'Edit',
      onClick: () => {
        this.events.onEdit(this.id);
      },
    });
  }

  private createDeleteButton(): Button {
    return new Button({
      classes: ['car__button', 'car__button_delete'],
      text: 'Delete',
      onClick: () => {
        this.events.onDelete(this.id).catch(console.error);
      },
    });
  }

  private createCarImage(color: string): Component {
    const imageWrapper = new Component({ tag: 'div', classes: ['car__image-wrapper'] });
    const img = new Component({ tag: 'div', classes: ['car__image'] });
    imageWrapper.appendChildren([img]);
    img.getNode().style.backgroundColor = color;

    return imageWrapper;
  }

  private createCarStateWrapper(carName: Component): Component {
    const stateWrapper = new Component({ tag: 'div', classes: ['car__state-wrapper'] });
    stateWrapper.appendChildren([this.editBtn, this.deleteBtn, carName, this.stateContainer]);
    return stateWrapper;
  }

  setState(state: CarStatesValues, text?: string) {
    this.stateContainer.setText(text || state);
    switch (state) {
      case carStates.IN_GARAGE:
        this.startBtn.removeAttribute('disabled');
        this.stopBtn.setAttribute('disabled', '');
        break;

      case carStates.MOVING:
      case carStates.FINISHED:
      case carStates.WINNER:
      case carStates.BROKEN:
        this.startBtn.setAttribute('disabled', '');
        this.stopBtn.removeAttribute('disabled');

        break;
      case carStates.STARTING:
      case carStates.STOPPED:
        this.startBtn.setAttribute('disabled', '');
        this.stopBtn.setAttribute('disabled', '');
        break;
      default:
        this.startBtn.removeAttribute('disabled');
        this.stopBtn.setAttribute('disabled', '');
    }
  }

  startMove(time: number) {
    const imgNode = this.imgWrapper.getAllChildren()[0].getNode();
    imgNode.style.transition = `transform ${time}s linear`;
    imgNode.style.transform = `translateX(${this.getTrackDistance()}px)`;
    const transitionEndCallback = () => {
      imgNode.removeEventListener('transitionend', transitionEndCallback);

      this.events.onFinish(this.id).catch(console.error);
    };
    imgNode.addEventListener('transitionend', transitionEndCallback);
  }

  stopMove() {
    const imgNode = this.imgWrapper.getAllChildren()[0].getNode();
    const matrix = new DOMMatrixReadOnly(getComputedStyle(imgNode).transform);
    imgNode.style.transition = '';
    imgNode.style.transform = `translateX(${matrix.m41}px)`;
  }

  resetPosition() {
    const imgNode = this.imgWrapper.getAllChildren()[0].getNode();
    imgNode.style.transition = '';
    imgNode.style.transform = 'translateX(0)';
  }

  getId() {
    return this.id;
  }

  disableStateButtons(isDisabled: boolean) {
    if (isDisabled) {
      this.editBtn.setAttribute('disabled', '');
      this.deleteBtn.setAttribute('disabled', '');
    } else {
      this.editBtn.removeAttribute('disabled');
      this.deleteBtn.removeAttribute('disabled');
    }
  }

  setButtonsDisabled(disabled: boolean) {
    if (disabled) {
      this.startBtn.setAttribute('disabled', '');
      this.stopBtn.setAttribute('disabled', '');
      this.editBtn.setAttribute('disabled', '');
      this.deleteBtn.setAttribute('disabled', '');
    } else {
      this.startBtn.removeAttribute('disabled');
      this.stopBtn.removeAttribute('disabled');
      this.editBtn.removeAttribute('disabled');
      this.deleteBtn.removeAttribute('disabled');
    }
  }
}
