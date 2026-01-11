import { Component } from '../../utils/Component';
import { GarageView } from '../main/garage/garage-view';
import type { MainView } from '../main/main-view';
import { WinnersView } from '../main/winners/winners-view';
import './header.scss';
import { LinkView } from './link/link-view';

export interface Page {
  name: string;
  callback: () => void;
}

const NamePages: Record<string, string> = {
  GARAGE: 'garage',
  WINNERS: 'winners',
};

const START_PAGE_INDEX: number = 0;

export class HeaderView extends Component {
  private headerLinks: LinkView[] = [];

  constructor(mainView: MainView) {
    super({ tag: 'header', classes: ['header'] });
    this.createHeader(mainView);
  }

  createHeader(mainView: MainView): void {
    const h1El = new Component({ tag: 'h1', text: 'Async Race' });
    const navEl = new Component({ tag: 'nav', classes: ['header__nav'] });

    const pages = this.getPages(mainView);
    pages.forEach((page, index) => {
      const linkEl = new LinkView({ classes: ['header__link'], text: page.name }, this.headerLinks);
      linkEl.addListener('click', () => {
        this.setHeaderActive(page, linkEl);
      });

      navEl.appendChildren([linkEl]);

      if (index === START_PAGE_INDEX) {
        this.setHeaderActive(page, linkEl);
      }

      this.headerLinks.push(linkEl);
    });

    this.appendChildren([h1El, navEl]);
  }

  setHeaderActive(page: Page, linkEl: LinkView) {
    page.callback();
    linkEl.setActive('header__link_active');
  }

  getPages(mainView: MainView): Page[] {
    const garageView: GarageView = new GarageView({
      tag: 'div',
      classes: ['garage'],
      text: 'Garage',
    });
    const winnerView: WinnersView = new WinnersView({
      tag: 'div',
      classes: ['garage'],
      text: 'Winners',
    });

    const pages: Page[] = [
      {
        name: NamePages.GARAGE,
        callback: () => {
          mainView.setContent(garageView);
        },
      },
      {
        name: NamePages.WINNERS,
        callback: () => {
          mainView.setContent(winnerView);
        },
      },
    ];

    return pages;
  }
}
