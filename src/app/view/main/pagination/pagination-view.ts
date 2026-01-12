import { Button } from '../../../components/button/button-creator';
import { Component } from '../../../utils/Component';
import './pagination.scss';

export class PaginationView extends Component {
  constructor() {
    super({ tag: 'div', classes: ['pagination'] });

    this.createPagination();
  }

  createPagination() {
    const prevButton = new Button({
      classes: ['pagination__button', 'pagination__button_prev'],
      text: 'Prev',
    });
    const currentPageEl = new Component({
      tag: 'div',
      classes: ['paggination__current-page'],
      text: 'Page 1',
    });
    const nextButton = new Button({
      classes: ['pagination__button', 'pagination__button_next'],
      text: 'Next',
    });

    super.appendChildren([prevButton, currentPageEl, nextButton]);
  }
}
