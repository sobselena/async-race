import { Component } from '../../utils/Component';
import './header.scss';

export class HeaderView extends Component {
  constructor() {
    super({ tag: 'header', classes: ['header'] });
    this.createHeader();
  }

  createHeader(): void {
    const navEl = new Component({ tag: 'nav', classes: ['nav'] });
    this.appendChildren([navEl]);
  }
}
