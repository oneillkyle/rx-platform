import { map, skip } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { App } from './app';
import {
    createComponent,
    refreshComponent,
    createComponentTag
} from './renderers';
import {
    observeNode,
    eventBus,
    EventBus,
    createComponentBus
} from './detection';
import { generateId } from './id';

interface ComponentConfig {
    template: () => string;
    tag: string;
    props: () => string[];
    data: () => {};
    methods: {
        [x: string]: () => any;
    };
}

export class Component {
    element: HTMLElement;
    template: string;
    templateFunction: () => string;
    tag: string;
    observer: MutationObserver;
    renderer: BehaviorSubject<any> = new BehaviorSubject(null);
    eventBus: EventBus;
    id: string;
    propFunction: () => {};
    props: string[];
    dataFunction: () => {};
    data: {};
    methods: {
        [x: string]: () => any;
    };
    inited = false;
    [key: string]: any;

    constructor(public config: ComponentConfig) {
        this.id = generateId();
        this.eventBus = eventBus;
        this.componentBus = createComponentBus();

        this.setConfig(config);

        this.renderer.pipe(skip(1)).subscribe(element => {
            this.element = element;
            console.log(element);
            console.log('renderer!');
            if (this.inited) refreshComponent(this.id, element);
        });

        this.eventBus.onDispatch().subscribe(({ type, payload }) => {
            if (type === 'initialRender') this.renderSubject();
        });
    }

    init() {}

    render(data?: {}) {
        this.data = { ...this.data, ...data };
        this.createDataProperties(this.data);
        return this.element ? this.element.outerHTML : this.renderTag();
    }

    renderTag() {
        return createComponentTag(this).outerHTML;
    }

    renderSubject() {
        createComponent(this)
            .pipe(
                map(({ element, observer }) => {
                    this.observer = observer;
                    return element;
                })
            )
            .subscribe((element: HTMLElement) => {
                // console.log(element);
                this.renderer.next(element);
            });
    }

    setConfig(config: ComponentConfig) {
        console.log(config);
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
        this.renderSubject();
        this.inited = true;
        this.init();
    }

    createDataProperties(props: { [x: string]: any }) {
        Object.keys(props).map((key: string) => {
            if (!this.hasOwnProperty(key)) {
                Object.defineProperty(this, key, {
                    get: function() {
                        return this.data[key];
                    },
                    set: function(y) {
                        if (this.data[key] !== y) {
                            this.data[key] = y;
                            console.log(`set key: ${key}, val: ${y}`);
                            if (this.inited) this.renderSubject();
                        }
                    }
                });
            }
        });
    }

    getMethods() {
        let methods: { [x: string]: any } = {};
        Object.keys(this.config.methods).map((key: string) => {
            methods[key] = this.config.methods[key];
        });
        return methods;
    }
}
