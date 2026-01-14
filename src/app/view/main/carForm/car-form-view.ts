import type { Car } from '../../../api/garageAPI';
import { Button } from '../../../components/button/button-creator';
import { InputField } from '../../../components/input-field/input-field-creator';
import { Component } from '../../../utils/Component';
import './car-form.scss';

export interface CarFormProperties {
  onSubmit: (name: string, color: string, id?: number) => void;
  classes: string[];
  isDisabled?: boolean;
  submitBtnText: string;
}
export class CarFormView extends Component {
  private readonly defaultColor = `#000000`;

  private textInput: InputField = new InputField({ classes: ['garage__text-input'], type: 'text' });

  private colorInput: InputField = new InputField({
    classes: ['garage__color-input'],
    type: 'color',
  });

  private submitButton: Button;

  constructor({ onSubmit, classes, isDisabled = false, submitBtnText }: CarFormProperties) {
    super({ tag: 'form', classes });

    this.addListener('submit', (event: Event) => {
      event.preventDefault();
      const name = this.textInput.getValue().trim();
      if (!name) return;
      onSubmit(name, this.colorInput.getValue());
      this.textInput.setDeffaultValue();
    });
    this.submitButton = new Button({
      classes: ['garage__submit-button'],
      text: submitBtnText,
    });
    if (isDisabled) {
      this.toggleDisabled(isDisabled);
    }
    this.appendChildren([this.textInput, this.colorInput, this.submitButton]);
  }

  toggleDisabled(isDisabled: boolean) {
    if (isDisabled) {
      this.textInput.setAttribute('disabled', '');
      this.colorInput.setAttribute('disabled', '');
      this.submitButton.setAttribute('disabled', '');
    } else {
      this.textInput.removeAttribute('disabled');
      this.colorInput.removeAttribute('disabled');
      this.submitButton.removeAttribute('disabled');
    }
  }

  setCarValues(carParams: Car) {
    console.log(carParams);
    (this.textInput.getNode() as HTMLInputElement).value = carParams.name;
    (this.colorInput.getNode() as HTMLInputElement).value = carParams.color;
  }

  setDefaultValues() {
    (this.textInput.getNode() as HTMLInputElement).value = '';
    (this.colorInput.getNode() as HTMLInputElement).value = `${this.defaultColor}`;
  }
}
