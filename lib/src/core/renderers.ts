import { Observable } from 'rxjs/Observable';

import { Component } from './component';
import { App } from './app';

export function addAppElement () {
    return new Observable(observer => {
        let newApp = document.createElement('rx-app');
        document.body.appendChild(newApp);
        observer.next({element: newApp, observer: null});
        observer.complete();
    });
}

export function addElement () {
    let newDiv = document.createElement('rx-app');
    let newContent = document.createTextNode('Hi there and greetings!'); 
    newDiv.appendChild(newContent);  
  
    let currentDiv = document.getElementById('div1'); 
    document.body.insertBefore(newDiv, currentDiv);
}

export function createChildComponent(parent: App|Component, child: Component) {
    return new Observable(observer => {
        let newTag = document.createElement(child.config.tag);
        newTag.innerHTML = child.config.template;
        parent.element.appendChild(newTag);
        observer.next({element: newTag, observer: null});
        observer.complete();
    });
}