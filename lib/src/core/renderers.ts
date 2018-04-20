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

// export function addElement () {
//     let newDiv = document.createElement('rx-app');
//     let newContent = document.createTextNode('Hi there and greetings!'); 
//     newDiv.appendChild(newContent);  
  
//     let currentDiv = document.getElementById('div1'); 
//     document.body.insertBefore(newDiv, currentDiv);
// }

export function createChildComponent(parent: App|Component, child: Component) {
    return new Observable(observer => {
        let newTag = document.createElement(child.tag);
        newTag.innerHTML = child.templateFunction();
        // let tag = child.render();
        parent.element.appendChild(newTag);
        observer.next({tag: newTag, observer: observeNode(newTag)});
        observer.complete();
    });
}

export function createComponent(component: Component) {
    return new Observable(observer => {
        let newTag = document.createElement(component.tag);
        newTag.dataset.rxId = component.id;
        newTag.innerHTML = component.templateFunction();
        observer.next({element: newTag, observer: observeNode(newTag)});
        observer.complete();
    });
}

export function templateAsync(observable: Observable<string>) {
    console.log(this);
    observable.subscribe((result) => result);
}