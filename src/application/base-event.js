import EventEmitter from 'node:events';

class BaseEvent extends EventEmitter {
    constructor(events) {
        super();
        this.events = Object.freeze(events);
    }

    on(event, listener) {
        if (this.events[event]) {
            return this.addListener(event, listener);
        }

        // TODO: Use a custom error class
        throw new Error(`Event "${event}" is not supported.`);
    }
}

export default BaseEvent;
