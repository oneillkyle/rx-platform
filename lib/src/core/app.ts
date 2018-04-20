import { Component } from './component';
import { addAppElement, createChildComponent, createComponent } from './renderers';
import { eventBus } from './detection';

export class App {
    element: HTMLElement;
    entryComponent: Component;
    children: any[] = [];
    observers: MutationObserver[] = [];
    observer: MutationObserver;

    constructor(
        public config: { entryComponent: Component },
    ) {
        console.log(eventBus);
        eventBus.onEmit().subscribe(({type, payload}) => {
            console.log(type);
            if (type === 'rerender') this.rerender();
        });
        this.entryComponent = config.entryComponent;
        addAppElement().subscribe(({element, observer}) => {
            this.element = element;
            this.observer = observer;
            this.rerender();
        });
    }

    rerender() {
        this.element.innerHTML = '';        
        createComponent(this.entryComponent)
            .subscribe(({element, observer}) => {
                this.element.appendChild(element);
            });
    }
}