// Safe Observer
class SafeObserver {
    constructor(destination) {
        this.destination = destination;
    }
    next(value) {
        if (!this.isUnsubscribed && this.destination.next) {
            try {
                this.destination.next(value);
            } catch (err) {
                this.unsubscribe();
                throw err;
            }
        }
    }

    error(err) {
        if(!this.isUnsubscribed && this.destination.error) {
            try {
                this.destination.error(err);
            } catch (e2) {
                this.unsubscribe();
                throw e2;
            }
            this.unsubscribe();
        }
    }

    complete() {
        if(!this.isUnsubscribed && this.destination.complete) {
            try {
                this.destination.complete();
            } catch (err) {
                this.unsubscribe();
                throw err;
            }
            this.unsubscribe();
        }
    }

    unsubscribe() {
        this.isUnsubscribed = true;
        if (this.unsub) {
            this.unsub();
        }
    }
}

/**
 * Observable basic implementation
 */
class Observable {
    constructor(_subscribe) {
        this._subscribe = _subscribe;
    }
    subscribe(observer) {
        const safeObserver = new SafeObserver(observer);
        return this._subscribe(safeObserver);
    }

    /**
     * more complicated operators
     */
    map (mapper) {
        return new Observable((observer) => {
            const mapObserver = {
                next: (x) => observer.next(mapper(x)),
                error: (err) => observer.error(err),
                complete: () => observer.complete()
            };
            return this.subscribe(mapObserver);
        })
    }

    filter (predicate) {
        return new Observable((observer) => {
            const filterObserver = {
                next: (x) => predicate(x) && observer.next(x),
                error: (err) => observer.error(err),
                complete: () => observer.complete()
            };
            return this.subscribe(filterObserver);
        })
    }

    static fromEvent(element, eventType) {
        return new Observable((observer) => {
            const ds = new DOMElementEventSource(element, eventType, (e) => {
                observer.next(e);
            });

            return ds.destroy.bind(ds);
        })
    }
}

class DOMElementEventSource {
    constructor(element, eventType, onEvent) {
        this.element = element;
        this.etype = eventType;
        this.onEvent = onEvent;
        element.addEventListener(eventType, this.onEvent);
    }

    destroy() {
        this.element.removeEventListener(this.etype, this.onEvent);
    }
}
