import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class EventBus {
    dispatch: (type: string, payload: {}) => void;
    onDispatch: () => Observable<{type: string, payload: {}}>;
    emit: (type: string, payload: {}) => void;
    onEmit: () => Observable<{type: string, payload: {}}>;
}

export const eventBus = (function createEventBus() {
    let emitSub = new Subject();
    let dispatchSub = new Subject();
    return {
        dispatch: (type: string, payload: {}) => {
            dispatchSub.next({type, payload});
        },
        onDispatch: () => {
            return dispatchSub.asObservable();            
        },
        emit: (type: string, payload: {}) => {
            emitSub.next({type, payload});
        },
        onEmit: () => {
            return emitSub.asObservable();
        },
    } as EventBus;
})();

export function observeNode(targetNode: HTMLElement) {
    // Options for the observer (which mutations to observe)
    var config = { attributes: true, childList: true };
    
    // Callback function to execute when mutations are observed
    var callback = function(mutationsList: any) {
        for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                console.log('A child node has been added or removed.');
            }
            else if (mutation.type == 'attributes') {
                console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    };
    
    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);
    
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
    return observer;
    
    // Later, you can stop observing
    // observer.disconnect();
}