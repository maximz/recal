/// <reference path="../../typings/tsd.d.ts" />
/// <amd-dependency path="bootstrap" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', '../Core/BrowserEvents', '../Core/GlobalCssClass', './View', "bootstrap"], function(require, exports, $, BrowserEvents, GlobalCssClass, View) {
    var FocusableView = (function (_super) {
        __extends(FocusableView, _super);
        function FocusableView($element, cssClass) {
            var _this = this;
            _super.call(this, $element, cssClass);
            this._hasFocus = false;
            this._$el.attr('tabindex', 0);
            this._$el.removeClass(GlobalCssClass.invisibleFocus);
            this._$el.find('*').each(function (index, child) {
                var $child = $(child);
                if ($child.attr('tabindex') === undefined || $child.attr('tabindex') === null) {
                    $child.attr('tabindex', -1); // this allows the child to be focused but not be in the tab order
                    $child.addClass(GlobalCssClass.invisibleFocus);
                    // TODO add to css: { outline-color: transparent; outline-style: none; }
                }
            });
            this.attachEventHandler(BrowserEvents.focusIn, function (ev) {
                if (_this.containsJQueryElement($(document.activeElement))) {
                    _this.didFocus();
                }
            });
            this.attachEventHandler(BrowserEvents.focusOut, function (ev) {
                if (!_this.containsJQueryElement($(document.activeElement))) {
                    _this.didBlur();
                }
            });
        }
        Object.defineProperty(FocusableView, "cssClass", {
            /**
            * The unique css class for this class.
            */
            get: function () {
                return View.cssClass + ' focusableView';
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(FocusableView.prototype, "hasFocus", {
            get: function () {
                return this._hasFocus;
            },
            enumerable: true,
            configurable: true
        });

        FocusableView.prototype.didFocus = function () {
            this._hasFocus = true;
        };
        FocusableView.prototype.didBlur = function () {
            this._hasFocus = false;
        };

        /**
        * Shows a view as popover originating from this view
        */
        FocusableView.prototype.showViewInPopover = function (childView, placement) {
            if (typeof placement === "undefined") { placement = 'auto'; }
            var childViewCasted = childView;
            this._$el.popover('destroy');
            this._$el.popover({
                template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
                placement: placement,
                html: true,
                content: childViewCasted._$el[0],
                trigger: 'focus'
            });
            this._$el.focus();
        };
        return FocusableView;
    })(View);
    
    return FocusableView;
});
