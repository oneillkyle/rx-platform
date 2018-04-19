import { Component } from './component';
import { addAppElement, createChildComponent } from './renderers';

export class App {
    element: any;
    children: any[] = [];
    observers = {};

    constructor(
        public config: { entryComponent: Component },
    ) {
        addAppElement().subscribe(({element, observer}) => {
            this.element = element;
            createChildComponent(this, this.config.entryComponent).subscribe(child => {
                this.children.push(child);
            });
        });
    }
}