import { Component } from '../../utils/Component';

import './form.scss';

interface FormProperties {
  classes: string[];
  onSubmit?: (event: Event) => void;
}
export class Form extends Component {
  private onSubmit?: (event: Event) => void;

  constructor({ classes, onSubmit }: FormProperties) {
    super({ tag: 'form', classes });

    if (onSubmit) {
      this.onSubmit = onSubmit;
      this.addListener('submit', onSubmit);
    }
  }
}
