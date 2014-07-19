/// <reference path="../../typings/tsd.d.ts" />
define(["require", "exports", 'jquery', '../DataStructures/Dictionary'], function(require, exports, $, Dictionary) {
    var ViewTemplateRetriever = (function () {
        function ViewTemplateRetriever() {
            this._cachedTemplates = new Dictionary();
        }
        ViewTemplateRetriever.instance = function () {
            return this._instance;
        };

        /**
        * Retrieve the template belonging to the container selector as a
        * jQuery object. Creates a new one every time.
        */
        ViewTemplateRetriever.prototype.retrieveTemplate = function (containerSelector) {
            var templateString = this._cachedTemplates.get(containerSelector);
            if (templateString === null) {
                templateString = $(containerSelector).html();
                this._cachedTemplates.set(containerSelector, templateString);
            }
            return $(templateString);
        };
        ViewTemplateRetriever._instance = new ViewTemplateRetriever();
        return ViewTemplateRetriever;
    })();
    
    return ViewTemplateRetriever;
});
