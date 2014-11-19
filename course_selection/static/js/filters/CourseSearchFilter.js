/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Filter'], function(require, exports, Filter) {
    var CourseSearchFilter = (function (_super) {
        __extends(CourseSearchFilter, _super);
        function CourseSearchFilter() {
            _super.call(this);
        }
        CourseSearchFilter.prototype.filter = function (courses, input) {
            if (!input) {
                return [];
            }

            var breakedQueries = CourseSearchFilter.breakQuery(input);
            var queries = breakedQueries.split(' ');
            var results = courses;
            for (var i = 0; i < queries.length; i++) {
                var query = queries[i].toUpperCase();
                if (query == '') {
                    continue;
                }

                // is department
                if (query.length <= 3 && CourseSearchFilter.isAlpha(query)) {
                    results = results.filter(function (course) {
                        return CourseSearchFilter.isListed(course, 'course_listings', 'dept', query);
                    });
                } else if (query.length <= 4 && CourseSearchFilter.isNumber(query)) {
                    results = results.filter(function (course) {
                        return CourseSearchFilter.isListed(course, 'course_listings', 'number', query);
                    });
                } else {
                    results = results.filter(function (course) {
                        return CourseSearchFilter.regexTest(course, query);
                    });
                }
            }

            return results;
        };

        CourseSearchFilter.breakQuery = function (input) {
            var output;
            output = input.replace(/\D\d+\D/g, function (text) {
                return text.charAt(0) + ' ' + text.substring(1, text.length - 1) + ' ' + text.slice(-1);
            });
            output = output.replace(/\D\d+/g, function (text) {
                return text.charAt(0) + ' ' + text.substring(1);
            });
            output = output.replace(/\d+\D/g, function (text) {
                return text.substring(0, text.length - 1) + ' ' + text.slice(-1);
            });

            return output;
        };

        CourseSearchFilter.regexTest = function (course, regexStr) {
            var re = new RegExp(regexStr, "i");
            if (re.test(course.title)) {
                return true;
            }

            return false;
        };

        CourseSearchFilter.isListed = function (course, first_arg, second_arg, target) {
            if (!course[first_arg]) {
                return false;
            }

            // listings = course_listings
            var listings = course[first_arg];
            for (var i = 0; i < listings.length; i++) {
                var listing = listings[i];
                if (CourseSearchFilter.startsWith(listing[second_arg], target)) {
                    return true;
                }
            }

            return false;
        };

        CourseSearchFilter.startsWith = function (s, t) {
            return s.substring(0, t.length) === t;
        };

        CourseSearchFilter.isDepartment = function (input) {
        };

        CourseSearchFilter.isAlpha = function (s) {
            return s.search(/[^A-Za-z\s]/) == -1;
        };

        CourseSearchFilter.isNumber = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(parseFloat(n));
        };

        CourseSearchFilter.arrayContains = function (xs, x) {
            return xs.indexOf(x) != -1;
        };
        CourseSearchFilter.dists = ['LA', 'SA', 'HA', 'EM', 'QR', 'STL', 'STN'];

        CourseSearchFilter.$inject = [];
        return CourseSearchFilter;
    })(Filter);

    
    return CourseSearchFilter;
});
