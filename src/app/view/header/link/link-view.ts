import { Component } from '../../../utils/Component';
import './link.scss';

interface LinkProperties {
  classes: string[];
  text: string;
}
export class LinkView extends Component {
  private links: LinkView[];

  constructor({ classes, text }: LinkProperties, links: LinkView[]) {
    super({ tag: 'a', classes, text });

    this.links = links;
  }

  setActive(activeClass: string) {
    this.links.forEach(link => {
      link.setDisabled(activeClass);
    });

    this.getNode().classList.add(activeClass);
  }

  setDisabled(activeClass: string) {
    this.getNode().classList.remove(activeClass);
  }
}
