define(["require", "exports", "../Core/BrowserEvents", '../Core/InvalidActionException', "../Core/InvalidArgumentException", '../DataStructures/Set'], function(require, exports, BrowserEvents, InvalidActionException, InvalidArgumentException, Set) {
    var View = (function () {
        /******************************************************************
        Methods
        ****************************************************************/
        /**
        * Initialize a new View object from the JQuery element.
        * Throws an error if the JQuery element already belongs to another
        * View object.
        */
        function View($element) {
            this._$el = null;
            this._parentView = null;
            this._children = new Set();
            if ($element === null) {
                throw new InvalidArgumentException('A JQuery element must be specified');
            }
            if ($element.data(View.JQUERY_DATA_KEY) instanceof View) {
                throw new InvalidActionException('View is already initialized.');
            }
            this._viewNumber = View._viewCount++;
            this._$el = $element;
            this._$el.data(View.JQUERY_DATA_KEY, this);
        }
        Object.defineProperty(View.prototype, "parentView", {
            /******************************************************************
            Properties
            ****************************************************************/
            /**
            * The parent view of the view, if exists. Null if no parent
            */
            get: function () {
                return this._parentView;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(View.prototype, "children", {
            /**
            * Immutable array of child views
            */
            get: function () {
                return this._children.toArray();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(View.prototype, "width", {
            /**
            * Physical width of the view
            */
            get: function () {
                return this._$el.width();
            },
            set: function (newValue) {
                this._$el.width(newValue);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(View.prototype, "height", {
            /**
            * Physical height of the view
            */
            get: function () {
                return this._$el.height();
            },
            set: function (newValue) {
                this._$el.height(newValue);
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Initialize a new View object from the JQuery element, or return
        * an existing one.
        */
        View.fromJQuery = function ($element) {
            if ($element.data(View.JQUERY_DATA_KEY) instanceof View) {
                return $element.data(View.JQUERY_DATA_KEY);
            }
            return new this($element);
        };

        /**
        * Append childView to this view. childView cannot already have a parent
        */
        View.prototype.append = function (childView) {
            if (this._children.contains(childView)) {
                throw new InvalidActionException('Cannot add a child view twice.');
            }
            if (childView._parentView != null) {
                throw new InvalidActionException('A view can only have one parent.');
            }
            this._$el.append(childView._$el);
            this._children.add(childView);
            childView._parentView = this;
        };

        /**
        * Remove this view from its parent. Cannot be called if this view
        * does not have a parent.
        */
        View.prototype.removeFromParent = function () {
            if (this._parentView !== null) {
                throw new InvalidActionException('Cannot call removeFromParent() on a view that does not have a parent.');
            }
            this._$el.detach();
            this._parentView._children.remove(this);
            this._parentView = null;
        };

        View.prototype.attachEventHandler = function (ev, argumentThree, handler) {
            var eventName = BrowserEvents.getEventName(ev);
            var $element = this._$el;
            if (typeof argumentThree === 'string' || argumentThree instanceof String || argumentThree.constructor === String) {
                if (handler === undefined) {
                    throw new InvalidArgumentException("No handler provided.");
                }
                $element.on(eventName, argumentThree, handler);
            } else if (typeof argumentThree === 'function') {
                $element.on(eventName, argumentThree);
            } else {
                throw new InvalidArgumentException("The second argument must either be a string or a function.");
            }
        };

        /**
        * Unique
        */
        View.prototype.toString = function () {
            return 'View no. ' + this._viewNumber;
        };
        View.JQUERY_DATA_KEY = 'view_object';
        View._viewCount = 0;
        return View;
    })();
    
    return View;
});
