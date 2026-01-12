const SAVED_INFO_KEY = 'app';

export class State {
  private savedInfo: Map<string, string> = new Map();

  setValue(name: string, value: string) {
    this.savedInfo.set(name, value);
  }

  getValue(name: string) {
    return this.savedInfo.get(name);
  }

  saveInfo() {
    localStorage.setItem(SAVED_INFO_KEY, JSON.stringify(Array.from(this.savedInfo.entries())));
  }

  getInfo(): Map<string, string> {
    const savedInfo = localStorage.getItem(SAVED_INFO_KEY);
    if (savedInfo) {
      return new Map(JSON.parse(savedInfo) as [string, string][]);
    }

    return new Map();
  }
}
