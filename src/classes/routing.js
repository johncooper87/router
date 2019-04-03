import React from 'react';
import { Router } from "./Router";

// const route1 = '/home/users/12/asd';
// const route2 = '/home/users/';
// const route3 = '/home';

// const route = route2;

// const routing1 = '^/home/users/(?<id>\\w*)$';
// const routing2 = '/home/users/(?<id>\\w*)';
// const routing3 = '/home/users/(?<id>\\w+)';
// const routing4 = '/users/(?<id>\\w*)/asd';

// console.log((new RegExp(routing1)).exec(route));
// console.log((new RegExp(routing2)).exec(route));
// console.log((new RegExp(routing3)).exec(route));
// console.log((new RegExp(routing4)).exec(route));

const nonUndefined = value => value !== undefined;

function match(pathname) {
  const route = pathname.split('/');

  const endless = route[route.length - 1] === '*';
  if (!endless && route.length !== Router.currentRoute.length) return undefined;
  if (endless && route.length > Router.currentRoute.length + 1) return undefined;

  const props = { match: '' };
  for (const [index, entry] of Object.entries(route)) {

    if (entry === '*') break;
    const routerEntry = Router.currentRoute[index];
    if (entry[0] === ':') props[entry.substr(1)] = routerEntry;
    else if (entry !== routerEntry) return undefined;
    if (index > 0) props.match += '/' + routerEntry;
  }
  return props;
}

// function handleRoute([path, component], index) {
//   return match(path)
//   |> # && React.createElement(component, {
//     key: 'route-' + index,
//     ...#
//   });
// }

function handleRoute([path, component], index) {
  return match(path)
  |> # && React.createElement(component, {
    key: 'route-' + index,
    ...#
  });
}

export class Routing {

  constructor(forceUpdate, routes) {
    this.forceUpdate = forceUpdate;
    this.routes = routes;

    this.handleChange = this.handleChange.bind(this);
    this.unsubscribeFromEvents = this.unsubscribeFromEvents.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);
  }

  get routes() {
    return typeof this._routes === 'function' ? this._routes(this.match) : this._routes;
  }

  Route(routes) {
    const result = Object.entries(routes)
    .map(handleRoute)
    .filter(nonUndefined);
  }

  handleChange() {
    const routes = typeof this.routes === 'function' ? this.routes(this.match) : this.routes;
    const matches = Object.entries(this.routes)(path);
    this.forceUpdate();
  }

  subscribeToEvents() {
    this.changeSub = Router.changeEvent.subscribe(this.handleChange);
  }

  unsubscribeFromEvents() {
    this.changeSub.unsubscribe();
  }

  handleSubscriptions() {
    this.subscribeToEvents();
    return this.unsubscribeFromEvents;
  }
}