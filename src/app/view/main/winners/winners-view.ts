import { Component } from '../../../utils/Component';
import { PaginationView } from '../pagination/pagination-view';
import './winners.scss';

const WINNERS_PAGINATION_LIMIT = 10;
export class WinnersView extends Component {
  private pagination: PaginationView = new PaginationView({
    limit: WINNERS_PAGINATION_LIMIT,
    totalCount: 0,
    onPageChange: () => {},
  });

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

    winnersInfoWrapper.appendChildren([winnersTitle, this.pagination]);
    return winnersInfoWrapper;
  }
}
