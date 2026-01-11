import { NamePages } from './pages';

export interface Routes {
  path: string;
  callback: () => void;
}

export class Router {
  private routes: Routes[];

  constructor(routes: Routes[]) {
    this.routes = routes;
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

  parseUrl(url: string) {
    const result: {
      path: string;
      resource: string;
    } = {
      path: '',
      resource: '',
    };

    const path = url.split('/');
    [result.path = '', result.resource = ''] = path;
    return result;
  }
}
