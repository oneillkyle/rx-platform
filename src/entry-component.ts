import { Component, templateAsync } from '../lib/src/core';

import { SecondComponent } from './second-component';

export const EntryComponent = new Component({
    tag: 'entry',
    template() {
        console.log(this);
        return `
        <div>
            ${SecondComponent.render(
                {test: 'foo', 'te': this.test}
            )}
        </div>
        <p>${this.test}${this.myMethod()}</p>`
    },
    props() {
        return [];
    },
    data() {
        return {
            test: 'foo 2'
        }
    },
    methods: {
        myMethod() {
            this.test = 4;
            return this.otherMethod();
        },
        otherMethod() {
            return 2;
        },
        init() {
            setTimeout(() => {
                this.test = 'Test 3'}, 1000);
        }
    }
});
