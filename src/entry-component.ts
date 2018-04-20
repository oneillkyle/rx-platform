import { Component, templateAsync } from '../lib/src/core';

import { SecondComponent } from './second-component';

export const EntryComponent = new Component({
    tag: 'entry',
    template: () => {
        return `<div>${SecondComponent.render()}</div>`
    }
});
