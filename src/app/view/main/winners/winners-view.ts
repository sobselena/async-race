import { Component } from '../../../utils/Component';
import './winners.scss';

export class WinnersView extends Component {
  constructor() {
    super({ tag: 'div', classes: ['winners'], text: 'winners' });
  }
}
