import type { Car } from '../../../../../api/garageAPI';
import { Button } from '../../../../../components/button/button-creator';
import { InputField } from '../../../../../components/input-field/input-field-creator';
import { Component } from '../../../../../utils/Component';
import './car-form.scss';

export interface CarFormProperties {
  onSubmit: (name: string, color: string) => void;
  classes: string[];
  submitBtnText: string;
  isDisabled?: boolean;
  id?: number;
}
export class CarFormView extends Component {
  private readonly defaultColor = `#000000`;

  private textInput!: InputField;

  private colorInput!: InputField;

  private submitButton!: Button;

  private onSubmit: (name: string, color: string) => void;

  private editId?: number;

  constructor({ onSubmit, classes, isDisabled = false, submitBtnText, id }: CarFormProperties) {
    super({ tag: 'form', classes });
    this.onSubmit = onSubmit;
    this.editId = id;
    this.createFormLayout(submitBtnText);

    if (isDisabled) {
      this.toggleDisabled(isDisabled);
    }
  }

  createFormLayout(submitBtnText: string) {
    this.textInput = new InputField({ classes: ['garage__text-input'], type: 'text' });

    this.colorInput = new InputField({
      classes: ['garage__color-input'],
      type: 'color',
    });

    this.submitButton = new Button({
      classes: ['garage__submit-button'],
      text: submitBtnText,
    });
    this.addFormListener();
    this.appendChildren([this.textInput, this.colorInput, this.submitButton]);
  }

  addFormListener() {
    this.addListener('submit', (event: Event) => {
      event.preventDefault();
      const name = this.textInput.getValue().trim();
      this.onSubmit(name, this.colorInput.getValue());
      this.textInput.setDeffaultValue();
    });
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
    (this.textInput.getNode() as HTMLInputElement).value = carParams.name;
    (this.colorInput.getNode() as HTMLInputElement).value = carParams.color;
  }

  setDefaultValues() {
    (this.textInput.getNode() as HTMLInputElement).value = '';
    (this.colorInput.getNode() as HTMLInputElement).value = `${this.defaultColor}`;
  }

  setEditId(id: number) {
    this.editId = id;
  }

  getEditId() {
    return this.editId;
  }
}
