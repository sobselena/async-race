import { NamePages } from './pages';

export interface Routes {
  path: string;
  callback: () => void;
}

export class Router {
  private routes: Routes[];

  constructor(routes: Routes[]) {
    this.routes = routes;

    document.addEventListener('DOMContentLoaded', () => {
      const path = this.getUrl();
      this.navigate(path);
    });
    window.addEventListener('popstate', this.urlChangeHandler.bind(this));
    window.addEventListener('hashchange', this.urlChangeHandler.bind(this));
  }

  navigate(url: string) {
    const request = this.parseUrl(url);

    const requestedPath =
      request.resource === '' ? request.path : `${request.path}/${request.resource}`;
    let route = this.routes.find(({ path }) => {
      return path === requestedPath;
    });
    if (!route) {
      route = this.routes.find(({ path }) => {
        return path === NamePages.GARAGE;
      });
    }
    return route?.callback();
  }

  parseUrl(url: string): {
    path: string;
    resource: string;
  } {
    const [path = '', resource = ''] = url.split('/');
    return {
      path,
      resource,
    };
  }

  urlChangeHandler() {
    const url = this.getUrl();
    console.log(url);
    this.navigate(url);
  }

  getUrl() {
    if (window.location.hash) {
      return window.location.hash.slice(1);
    }

    return window.location.pathname.slice(1);
  }
}
