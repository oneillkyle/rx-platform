import { map } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { App } from './app';
import { createComponent, refreshComponent, createComponentTag } from './renderers';
import { observeNode, eventBus, EventBus, createComponentBus } from './detection';
import { generateId } from './id';

interface ComponentConfig {
    template: () => string;
    tag: string;
    props: () => string[];
    data: () => {};
    methods: {
        [x: string]: () => {}
    }
}

export class Component {
    element: HTMLElement;
    template: string;
    templateFunction: () => string;
    tag: string;
    observer: MutationObserver;
    renderer: Subject<any> = new Subject();
    eventBus: EventBus;
    id: string;
    propFunction: () => {};
    props: string[];
    dataFunction: () => {};
    data: {};
    methods: {
        [x: string]: () => any
    };
    [key: string]: any;

    constructor(public config: ComponentConfig) {
        this.id = generateId();
        this.eventBus = eventBus;
        this.componentBus = createComponentBus();

        this.setConfig(config);
        
        this.renderer.subscribe(element => {
            this.element = element;
            console.log(element);
            refreshComponent(this.id, element);
            // this.eventBus.emit('rerender', { id: this.id });
        });
        // this.renderSubject();
    }

    init() {
        // console.log(this.observer);
    }

    render(data?: {}) {
        // console.log(data);
        return this.element ? this.element.outerHTML : this.renderTag();
    }

    renderTag() {
        return createComponentTag(this).outerHTML;
    }

    renderSubject() {
        createComponent(this).pipe(
            map(({ element, observer }) => {
                this.observer = observer;
                return element;
            })
        ).subscribe(((element: HTMLElement) => {
            this.renderer.next(element);
        }));
    }

    setConfig(config: ComponentConfig) {
        this.tag = config.tag;
        this.propFunction = config.props;
        this.props = config.props();
        this.dataFunction = config.data;
        this.data = config.data();
        this.methods = config.methods;
        this.templateFunction = config.template;
        Object.keys(config.methods).map((key: string) => {
            this[key] = config.methods[key];
        });
        this.createDataProperties(this.data);
    }

    createDataProperties(props: {[x:string]: any}) {
        Object.keys(props).map((key: string) => {
            Object.defineProperty(this, key, {
                get: function() { return this.data[key]; },
                set: function(y) {
                    if (this.data[key] !== y) {
                        this.data[key] = y;
                        console.log(`set key: ${key}, val: ${y}`);
                        this.renderSubject();
                    }
                    // this.eventBus.emit('rerender', { id: this.id });            
                    // this.fireChangeDetection();
                }
            });
        });
    }

    getMethods() {
        let methods: {[x: string]: any} = {};
        Object.keys(this.config.methods).map((key: string) => {
            methods[key] = this.config.methods[key];
        });
        return methods;
    }
}