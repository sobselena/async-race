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

  constructor(paginationProperties: PaginationProperties) {
    super({ tag: 'div', classes: ['pagination'] });
    this.limit = paginationProperties.limit;
    this.totalCount = paginationProperties.totalCount;

    this.pageNumEl = new Component({ tag: 'span', text: `${this.currentPage}` });

    this.maxPageEl = new Component({ tag: 'span', text: `${this.getMaxPage()}` });
    this.createPagination(paginationProperties);
  }

  createPagination(paginationProperties: PaginationProperties) {
    const prevButton = new Button({
      classes: ['pagination__button', 'pagination__button_prev'],
      text: 'Prev',
      onClick: () => {
        if (this.currentPage === 1) return;
        this.currentPage -= 1;
        this.updateLayout(this.pageNumEl, paginationProperties);
      },
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
    const nextButton = new Button({
      classes: ['pagination__button', 'pagination__button_next'],
      text: 'Next',
      onClick: () => {
        if (this.currentPage === this.getMaxPage()) return;
        this.currentPage += 1;
        this.updateLayout(this.pageNumEl, paginationProperties);
      },
    });

    super.appendChildren([prevButton, currentPageEl, nextButton]);
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
    this.maxPageEl.setText(`${this.getMaxPage()} `);
  }

  getMaxPage(): number {
    return Math.ceil(this.totalCount / this.limit) || 1;
  }
}
