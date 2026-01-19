import { NamePages } from '../../router/pages';
import type { Router } from '../../router/router';
import { Component } from '../../utils/Component';
import './header.scss';
import { LinkView } from './link/link-view';

export interface Page {
  name: string;
  callback: () => void;
}

export class HeaderView extends Component {
  private headerLinks: Map<string, LinkView> = new Map();

  constructor(router: Router) {
    super({ tag: 'header', classes: ['header'] });
    this.createHeader(router);
  }

  createHeader(router: Router): void {
    const h1El = new Component({ tag: 'h1', text: 'Async Race', classes: ['header__title'] });
    const navEl = new Component({ tag: 'nav', classes: ['header__nav'] });

    Object.values(NamePages).forEach(pageName => {
      const linkParams = {
        name: pageName,
        callback: () => {
          if (pageName !== router.parseUrl(router.getUrl()).path) {
            router.navigate(pageName);
          }
        },
      };

      const linkEl = new LinkView(
        { classes: ['header__link'], text: linkParams.name },
        this.headerLinks
      );
      linkEl.addListener('click', () => {
        linkParams.callback();
        this.setSelectedItem(pageName);
      });

      navEl.appendChildren([linkEl]);

      this.headerLinks.set(pageName, linkEl);
    });

    this.appendChildren([h1El, navEl]);
  }

  setSelectedItem(pageName: string) {
    const linkComponent = this.headerLinks.get(pageName);

    if (linkComponent instanceof LinkView) {
      linkComponent.setActive('header__link_active');
    }
  }

  setDisabledItems(isDisabled: boolean) {
    Object.values(NamePages).forEach(pageName => {
      const linkComponent = this.headerLinks.get(pageName);

      if (linkComponent instanceof LinkView) {
        if (isDisabled) {
          linkComponent.getNode().classList.add('header__link_disabled');
        } else {
          linkComponent.getNode().classList.remove('header__link_disabled');
        }
      }
    });
  }
}
