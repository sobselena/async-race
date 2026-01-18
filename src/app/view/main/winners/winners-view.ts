import { GarageAPI } from '../../../api/garageAPI';
import { WinnersAPI, type Winner, type WinnersParams } from '../../../api/winnersAPI';
import { Button } from '../../../components/button/button-creator';
import { Component } from '../../../utils/Component';
import { paginationStore } from '../pagination/pagination-store';
import { PaginationView } from '../pagination/pagination-view';
import './winners.scss';

const WINNERS_PAGINATION_LIMIT = 10;
interface TableProperties {
  number: string;
  preview: Component | string;
  name: string;
  wins: Button | string;
  time: Button | string;
}
export class WinnersView extends Component {
  private pagination: PaginationView;

  private winnersAPI = new WinnersAPI();

  private garageAPI = new GarageAPI();

  private totalCount!: Component;

  private tbody!: Component;

  private winsBtn!: Button;

  private timeBtn!: Button;

  private sort: WinnersParams['sort'] = 'time';

  private order: WinnersParams['order'] = 'asc';

  constructor() {
    super({ tag: 'div', classes: ['winners'] });
    this.pagination = this.createPagination();
    this.configureView();

    this.loadWinners().catch(console.error);
  }

  configureView() {
    super.appendChildren([this.createInfoWrapper(), this.createWinnersTable()]);
  }

  createInfoWrapper(): Component {
    const winnersInfoWrapper = new Component({ tag: 'div', classes: ['winners__info-wrapper'] });
    this.totalCount = new Component({
      tag: 'span',
      classes: ['winners__total-count'],
      text: `(${this.winnersAPI.getTotalCount()})`,
    });
    const winnersTitle = new Component({ tag: 'h2', text: 'Winners ' }, this.totalCount);

    winnersInfoWrapper.appendChildren([winnersTitle, this.pagination]);
    return winnersInfoWrapper;
  }

  createSortBtns() {
    this.winsBtn = new Button({
      classes: ['winners__time'],
      text: `Wins`,
      onClick: () => {
        this.toggleSort('wins');
      },
    });
    this.timeBtn = new Button({
      classes: ['winners__time'],
      text: `Time ↑`,
      onClick: () => {
        this.toggleSort('time');
      },
    });
  }

  private toggleSort(sortField: WinnersParams['sort']) {
    if (this.sort === sortField) {
      this.order = this.order === 'asc' ? 'desc' : 'asc';
    } else {
      this.sort = sortField;
      this.order = 'asc';
    }

    this.updateSortButtons();
    this.loadWinners(this.sort, this.order).catch(console.error);
  }

  private updateSortButtons() {
    this.winsBtn.setText(
      this.sort === 'wins' ? `Wins ${this.order === 'asc' ? '↑' : '↓'}` : 'Wins'
    );

    this.timeBtn.setText(
      this.sort === 'time' ? `Time ${this.order === 'asc' ? '↑' : '↓'}` : 'Time'
    );
  }

  createWinnersTable(): Component {
    const table = new Component({ tag: 'table', classes: ['winners__table'] });
    const thead = new Component({ tag: 'thead' });
    this.createSortBtns();
    this.createRow({
      tableEl: thead,
      tag: 'th',
      tableParams: {
        number: '№',
        preview: 'Car Preview',
        name: 'Car Name',
        wins: this.winsBtn,
        time: this.timeBtn,
      },
    });
    this.tbody = new Component({ tag: 'tbody' });

    table.appendChildren([thead, this.tbody]);

    return table;
  }

  createRow({
    tableEl,
    tag,
    tableParams,
  }: {
    tableEl: Component;
    tag: keyof HTMLElementTagNameMap;
    tableParams: TableProperties;
  }) {
    const row = new Component({ tag: 'tr' });

    Object.values(tableParams).forEach(tableParam => {
      const rowParamEl = new Component({ tag });
      if (tableParam instanceof Component) {
        rowParamEl.appendChildren([tableParam]);
      } else if (typeof tableParam === 'string') {
        rowParamEl.setText(tableParam);
      }
      row.appendChildren([rowParamEl]);
    });
    tableEl.appendChildren([row]);
  }

  createPagination(): PaginationView {
    const pagination = new PaginationView({
      limit: WINNERS_PAGINATION_LIMIT,
      totalCount: this.winnersAPI.getTotalCount(),
      onPageChange: () => {
        paginationStore.winnersPage = pagination.getCurrentPage();
        this.loadWinners().catch(console.error);
      },
    });

    pagination.setCurrentPage(paginationStore.winnersPage);

    return pagination;
  }

  async loadWinners(sort: WinnersParams['sort'] = 'time', order: WinnersParams['order'] = 'asc') {
    const page = this.pagination.getCurrentPage();
    const winners = await this.winnersAPI.getWinners({
      page,
      limit: WINNERS_PAGINATION_LIMIT,
      sort,
      order,
    });
    this.tbody.deleteChildren();
    this.updateTotalCount();
    this.pagination.updateTotalCount(this.winnersAPI.getTotalCount());

    const rows = await Promise.all(winners.data.map(winner => this.getWinnerParams(winner)));

    rows.forEach((rowParams, index) => {
      this.createRow({
        tableEl: this.tbody,
        tag: 'td',
        tableParams: {
          number: `${index + 1}`,
          ...rowParams,
        },
      });
    });
  }

  async getWinnerParams(winnerParams: Winner): Promise<Omit<TableProperties, 'number'>> {
    const carData = await this.garageAPI.getCar(winnerParams.id);

    return {
      preview: this.createPreview(carData.color),
      name: carData.name,
      wins: `${winnerParams.wins}`,
      time: `${Math.round(winnerParams.time * 100) / 100}s`,
    };
  }

  createPreview(color: string): Component {
    const imgWrapper = new Component({ tag: 'div', classes: ['winners__preview'] });
    imgWrapper.getNode().style.backgroundColor = color;
    return imgWrapper;
  }

  updateTotalCount() {
    this.totalCount.setText(`(${this.winnersAPI.getTotalCount()})`);
  }
}
