import { Component } from '../../utils/Component';
import './button.scss';

interface ButtonProperties {
  classes: string[];
  text?: string;
  onClick?: EventListener;
}
export class Button extends Component {
  private onClick?: EventListener;

  constructor({ classes, text, onClick }: ButtonProperties) {
    super({ tag: 'button', classes, text });

    if (onClick) {
      this.onClick = onClick;
      this.addListener('click', this.onClick);
    }
  }
}
