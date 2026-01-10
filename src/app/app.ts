import { HeaderView } from './view/header/header-view';
import { MainView } from './view/main/main-view';

export class App {
  private header: HeaderView;

  private main: MainView;

  constructor() {
    this.header = new HeaderView();
    this.main = new MainView();
  }

  render(root: HTMLElement) {
    root.append(this.header.getNode(), this.main.getNode());
  }
}
