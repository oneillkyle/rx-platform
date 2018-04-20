import { map } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { App } from './app';
import { createComponent } from './renderers';
import { observeNode, eventBus, EventBus } from './detection';
import { generateId } from './id';

export class Component {
    element: HTMLElement;
    template: string;
    templateFunction: () => string;
    tag: string;
    observer: MutationObserver;
    renderer: Subject<any> = new Subject();
    eventBus: EventBus;
    id: string;

    constructor(
        public config: { template: () => string, tag: string }
    ) {
        this.id = generateId();
        this.eventBus = eventBus;
        this.templateFunction = config.template.bind(this);
        this.tag = config.tag;
        this.renderer.subscribe(element => {
            this.element = element;
            this.eventBus.emit('rerender', {id: this.id});
        });
        this.renderSubject();
    }

    init() {
        console.log(this.observer);
    }

    render() {
        return this.element ? this.element.outerHTML : '';
    }

    renderSubject() {
        createComponent(this).pipe(
            map(({element, observer}) => {
                this.observer = observer;
                return element;
            })
        ).subscribe(((element: HTMLElement) => {
            this.renderer.next(element);
        }));
    }
}