import { Component, templateAsync } from '../lib/src/core';

export const SecondComponent = new Component({
    tag: 'second',
    template: () => {
        return `<div>test{{test}}</div>`
    },
    props: () => {
        return ['test'];
    },
    data: () => {
        return {}
    },
    methods: {}
});
