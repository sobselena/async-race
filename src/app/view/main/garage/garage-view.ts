import { Component } from '../../../utils/Component';
import './garage.scss';

export class GarageView extends Component {
  constructor() {
    super({ tag: 'div', classes: ['garage'], text: 'garage' });
  }
}
