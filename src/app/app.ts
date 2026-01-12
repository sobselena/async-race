import { NamePages } from './router/pages';
import { Router, type Routes } from './router/router';
import type { Component } from './utils/Component';
import { HeaderView } from './view/header/header-view';
import { GarageView } from './view/main/garage/garage-view';
import { MainView } from './view/main/main-view';
import { WinnersView } from './view/main/winners/winners-view';

export class App {
  private router: Router;

  private routes: Routes[] = this.createRoutes();

  private header: HeaderView;

  private main: MainView;

  constructor() {
    this.router = new Router(this.routes);
    this.main = new MainView();
    this.header = new HeaderView(this.router);
  }

  render(root: HTMLElement) {
    root.append(this.header.getNode(), this.main.getNode());
  }

  createRoutes(): Routes[] {
    const garageView: GarageView = new GarageView();
    const winnersView: WinnersView = new WinnersView();
    return [
      {
        path: '',
        callback: () => {
          this.setContent(garageView, NamePages.GARAGE);
        },
      },
      {
        path: `${NamePages.GARAGE}`,
        callback: () => {
          this.setContent(garageView, NamePages.GARAGE);
        },
      },
      {
        path: `${NamePages.WINNERS}`,
        callback: () => {
          this.setContent(winnersView, NamePages.WINNERS);
        },
      },
    ];
  }

  setContent(viewComponent: Component, name: string) {
    window.history.pushState({ page: `${name}` }, '', `/${name}`);
    this.main.setContent(viewComponent);
    this.header.setSelectedItem(name);
  }
}
