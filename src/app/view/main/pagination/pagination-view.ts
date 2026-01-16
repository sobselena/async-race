import { Button } from '../../../components/button/button-creator';
import { Component } from '../../../utils/Component';
import './pagination.scss';

interface PaginationProperties {
  limit: number;
  totalCount: number;
  onPageChange: () => void;
}
export class PaginationView extends Component {
  private limit: number;

  private currentPage: number = 1;

  private totalCount: number = 0;

  private pageNumEl: Component;

  private maxPageEl: Component;

  private paginationProperties: PaginationProperties;

  private nextButton: Component | null = null;

  private prevButton: Component | null = null;

  constructor(paginationProperties: PaginationProperties) {
    super({ tag: 'div', classes: ['pagination'] });
    this.paginationProperties = paginationProperties;

    this.limit = paginationProperties.limit;
    this.totalCount = paginationProperties.totalCount;

    this.pageNumEl = new Component({ tag: 'span', text: `${this.currentPage}` });

    this.maxPageEl = new Component({ tag: 'span', text: `${this.getMaxPage()}` });
    this.createPagination();
  }

  createPagination() {
    this.prevButton = new Button({
      classes: ['pagination__button', 'pagination__button_prev'],
      text: 'Prev',
      onClick: this.decreaseCurrentPage.bind(this),
    });
    const currentPageEl = new Component(
      {
        tag: 'div',
        classes: ['pagination__current-page'],
        text: 'Page ',
      },
      this.pageNumEl,
      new Component({ tag: 'span', text: '/' }),
      this.maxPageEl
    );
    this.nextButton = new Button({
      classes: ['pagination__button', 'pagination__button_next'],
      text: 'Next',
      onClick: this.increaseCurrentPage.bind(this),
    });

    super.appendChildren([this.prevButton, currentPageEl, this.nextButton]);
  }

  decreaseCurrentPage() {
    if (this.currentPage === 1) return;
    this.currentPage -= 1;
    this.updateLayout(this.pageNumEl, this.paginationProperties);
  }

  increaseCurrentPage() {
    if (this.currentPage === this.getMaxPage()) return;
    this.currentPage += 1;
    this.updateLayout(this.pageNumEl, this.paginationProperties);
  }

  updateLayout(pageNum: Component, paginationProperties: PaginationProperties) {
    pageNum.setText(`${this.currentPage}`);
    paginationProperties.onPageChange();
  }

  getCurrentPage() {
    return this.currentPage;
  }

  updateTotalCount(newTotalCount: number) {
    this.totalCount = newTotalCount;
    const newMaxPage = `${this.getMaxPage()}`;
    if (this.maxPageEl.getNode().textContent !== newMaxPage) {
      this.maxPageEl.setText(newMaxPage);
    }
  }

  getMaxPage(): number {
    return Math.ceil(this.totalCount / this.limit) || 1;
  }

  toggleButtons(isDisabled: boolean) {
    if (isDisabled) {
      this.nextButton?.setAttribute('disabled', '');
      this.prevButton?.setAttribute('disabled', '');
    } else {
      this.nextButton?.removeAttribute('disabled');
      this.prevButton?.removeAttribute('disabled');
    }
  }
}
