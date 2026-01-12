import { Component } from '../../utils/Component';

import './form.scss';

interface FormProperties {
  classes: string[];
}
export class Form extends Component {
  constructor({ classes }: FormProperties) {
    super({ tag: 'form', classes });
  }
}
