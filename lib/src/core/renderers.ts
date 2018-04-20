import { Observable } from 'rxjs/Observable';

import { Component } from './component';
import { App } from './app';
import { observeNode } from './detection';

export function addAppElement () {
    return new Observable(observer => {
        let newApp = document.createElement('rx-app');
        document.body.appendChild(newApp);
        observer.next({element: newApp, observer: observeNode(newApp)});
        observer.complete();
    });
}

export function createComponentTag(component: Component): HTMLElement {
    let newTag = document.createElement(component.tag);
    newTag.dataset.rxId = component.id;
    return newTag
}

export function createComponent(component: Component) {
    return new Observable(observer => {
        let newTag = createComponentTag(component);
        newTag.innerHTML = component.templateFunction();
        observer.next({element: newTag, observer: observeNode(newTag)});
        observer.complete();
    });
}

export function refreshComponent (id: string, element: HTMLElement) {
    let idTag = document.querySelector(`[data-rx-id="${id}"]`);
    console.log(id);
    console.log(idTag);
    if (!idTag) return;
    idTag.outerHTML = element.outerHTML;
    // idTag.appendChild(element);
    // document.body.insertBefore(element, idTag);
}

export function templateAsync(observable: Observable<string>) {
    console.log(this);
    observable.subscribe((result) => result);
}