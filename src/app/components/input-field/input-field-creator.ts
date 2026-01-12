import { Component } from '../../utils/Component';
import './input-field.scss';

interface InputFieldProperties {
  classes: string[];
  placeholder?: string;
  value?: string;
  type?: string;
}
export class InputField extends Component {
  constructor({ classes, placeholder, value, type }: InputFieldProperties) {
    super({ tag: 'input', classes });
    if (placeholder) {
      this.setPlaceholder(placeholder);
    }
    if (type) {
      this.setType(type);
    }
    if (value) {
      this.setAttribute('value', value);
    }
  }

  setPlaceholder(placeholder: string) {
    this.setAttribute('placeholder', placeholder);
  }

  setKeyUpEvent(callback: EventListener) {
    this.addListener('keyup', (event: Event) => callback(event));
  }

  setType(type: string) {
    this.setAttribute('type', type);
  }
}
