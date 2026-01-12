import { Component } from '../../../utils/Component';
import { PaginationView } from '../pagination/pagination-view';
import './winners.scss';

export class WinnersView extends Component {
  constructor() {
    super({ tag: 'div', classes: ['winners'] });

    this.configureView();
  }

  configureView() {
    super.appendChildren([this.createInfoWrapper()]);
  }

  createInfoWrapper(): Component {
    const winnersInfoWrapper = new Component({ tag: 'div', classes: ['winners__info-wrapper'] });
    const winnersTitle = new Component({ tag: 'h2', text: 'Winners' });
    const paginationEl = new PaginationView();
    winnersInfoWrapper.appendChildren([winnersTitle, paginationEl]);
    return winnersInfoWrapper;
  }
}
