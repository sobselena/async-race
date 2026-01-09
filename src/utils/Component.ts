interface ComponentProperties {
  tag: keyof HTMLElementTagNameMap;
  text?: string;
  classes?: string[];
}

export class Component {
  private node: HTMLElement;

  private allChildren: Component[] = [];

  constructor({ tag, text = '', classes = [] }: ComponentProperties, ...children: Component[]) {
    this.node = document.createElement(tag);

    this.setText(text);

    if (classes.length > 0) {
      this.node.classList.add(...classes);
    }

    if (children.length > 0) {
      this.appendChildren(children);
    }
  }

  private appendChildren(children: Component[]): void {
    children.forEach(child => {
      this.node.append(child.getNode());
      this.allChildren.push(child);
    });
  }

  getNode(): HTMLElement {
    return this.node;
  }

  setText(text: string): void {
    this.node.textContent = text;
  }

  setAttribute(attribute: string, value: string) {
    this.node.setAttribute(attribute, value);
  }

  getAttribute(attribute: string): string | null {
    return this.node.getAttribute(attribute);
  }

  removeAttribute(attribute: string): void {
    this.node.removeAttribute(attribute);
  }

  getAllChildren() {
    return this.allChildren;
  }

  destroy() {
    this.node.remove();
    this.deleteChildren();
  }

  deleteChildren() {
    this.allChildren.forEach(child => {
      child.destroy();
    });
    this.allChildren = [];
  }
}
