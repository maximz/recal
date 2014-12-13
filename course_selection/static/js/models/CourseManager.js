/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports", './Course'], function(require, exports, Course) {
    var CourseManager = (function () {
        function CourseManager($rootScope, courseService, scheduleResource, localStorageService, colorManager, termCode) {
            this.$rootScope = $rootScope;
            this.courseService = courseService;
            this.scheduleResource = scheduleResource;
            this.localStorageService = localStorageService;
            this.colorManager = colorManager;
            this.termCode = termCode;
            this.data = {
                previewCourse: null,
                enrolledCourses: [],
                previewSection: null,
                enrolledSections: null,
                courses: []
            };
            this.preview = {
                course: null,
                section: null
            };
            this.init();
        }
        CourseManager.prototype.init = function () {
            this.initData();
            this.initWatches();
        };

        CourseManager.prototype.initData = function () {
            this.data.previewCourse = null;
            this.data.enrolledCourses = [];
            this.data.enrolledSections = {};
            this.loadCourses();
        };

        CourseManager.prototype.initWatches = function () {
            var _this = this;
            this.$rootScope.$watch(function () {
                return _this.data.enrolledSections;
            }, function (newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                // do stuff
            }, true);
        };

        ///////////////////////////////////////////////////////////
        // Initialization
        //////////////////////////////////////////////////////////
        // TODO: figure out how to make caching behave nicely
        // in particular, how often should i clear cache?
        // how often should i clear local storage?
        // do i even need local storage?
        CourseManager.prototype.loadCourses = function () {
            var _this = this;
            this.courseService.getBySemester(this.termCode).then(function (data) {
                _this.onLoaded(data);
            });
        };

        // TODO: verify that the transformresponse function works as intended
        CourseManager.prototype.onLoaded = function (courses) {
            this.data.courses = courses.map(function (course) {
                return new Course(course.title, course.description, course.course_listings, course.id, course.sections, course.semester);
            });
        };

        CourseManager.prototype.getData = function () {
            return this.data;
        };

        ///////////////////////////////////////////////////////////
        // Course Management
        //////////////////////////////////////////////////////////
        CourseManager.prototype.getCourseById = function (id) {
            return this.data.courses.filter(function (course) {
                return course.id == id;
            })[0];
        };

        ///////////////////////////////////////////////////////////
        // Course Enrollment Management
        //////////////////////////////////////////////////////////
        CourseManager.prototype.setPreviewCourse = function (course) {
            this.data.previewCourse = course;
        };

        CourseManager.prototype.clearPreviewCourse = function () {
            this.setPreviewCourse(null);
        };

        CourseManager.prototype.enrollCourse = function (course) {
            // remove from all courses
            var idx = this.courseIdxInList(course, this.data.courses);
            this.data.courses.splice(idx, 1);

            course.colors = this.colorManager.nextColor();

            this.data.enrolledCourses.push(course);

            // example--
            // enrolledSections:
            // {
            //      1: {
            //          LEC: null,
            //          PRE: null
            //      },
            //      2: {
            //          STU: 01,
            //          CLA: null
            //      }
            // }
            this.data.enrolledSections[course.id] = {};
            for (var i = 0; i < course.section_types.length; i++) {
                var section_type = course.section_types[i];
                this.data.enrolledSections[course.id][section_type] = null;
            }

            for (var i = 0; i < course.sections.length; i++) {
                if (!course.sections[i].has_meetings) {
                    this.enrollSection(course.sections[i]);
                }
            }
        };

        CourseManager.prototype.unenrollCourse = function (course) {
            // remove from enrolled courses
            this.removeFromList(course, this.data.enrolledCourses);

            // remove enrolled sections for this course
            this.data.enrolledSections[course.id] = null;

            // remove data set in the course object
            this.colorManager.addColor(course.colors);
            course.colors = null;

            // add to unenrolled courses
            this.data.courses.push(course);
        };

        CourseManager.prototype.removeFromList = function (course, list) {
            var idx = this.courseIdxInList(course, list);
            list.splice(idx, 1);
        };

        CourseManager.prototype.courseIdxInList = function (course, list) {
            for (var i = 0; i < list.length; i++) {
                if (course.id == list[i].id) {
                    return i;
                }
            }

            return CourseManager.NOT_FOUND;
        };

        CourseManager.prototype.isCourseEnrolled = function (course) {
            var idx = this.courseIdxInList(course, this.data.enrolledCourses);
            return idx != CourseManager.NOT_FOUND;
        };

        ///////////////////////////////////////////////////////////
        // Section Enrollment Management
        //////////////////////////////////////////////////////////
        CourseManager.prototype.setPreviewSection = function (section) {
        };

        CourseManager.prototype.clearPreviewSection = function (section) {
        };

        CourseManager.prototype.enrollSection = function (section) {
            this.data.enrolledSections[section.course_id][section.section_type] = section.id;
            // try posting data here
            //this.data.enrolledSections.$save();
        };

        CourseManager.prototype.isCourseAllSectionsEnrolled = function (course) {
            var allSectionsEnrolled = true;
            if (!this.isCourseEnrolled(course)) {
                return false;
            }

            var enrollments = this.data.enrolledSections[course.id];
            angular.forEach(enrollments, function (value, key) {
                // key is section_type, value is enrolled section id, if exists
                if (!value) {
                    allSectionsEnrolled = false;
                    return false;
                }
            });

            return allSectionsEnrolled;
        };

        CourseManager.prototype.unenrollSection = function (section) {
            this.data.enrolledSections[section.course_id][section.section_type] = null;
        };

        CourseManager.prototype.isSectionEnrolled = function (section) {
            var enrolledCourse = this.data.enrolledSections[section.course_id];
            return enrolledCourse != null && enrolledCourse[section.section_type] == section.id;
        };
        CourseManager.NOT_FOUND = -1;
        return CourseManager;
    })();

    
    return CourseManager;
});
