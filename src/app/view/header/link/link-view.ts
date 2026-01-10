import { Component } from '../../../utils/Component';
import './link.scss';

interface LinkProperties {
  classes: string[];
  text?: string;
  href?: string;
}
export class LinkView extends Component {
  constructor({ classes, text, href }: LinkProperties) {
    super({ tag: 'a', classes, text });

    if (href) {
      this.setHref(href);
    }
  }

  setHref(href: string): void {
    this.setAttribute('href', href);
  }
}
