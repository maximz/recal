import IEventSource = require('../interfaces/IEventSource');
import IEventSources = require('../interfaces/IEventSources');
import ICourse = require('../interfaces/ICourse');
import IColorPalette = require('../interfaces/IColorPalette');
import SectionEventSource = require('./SectionEventSource');

class CourseEventSources implements IEventSources {
    private myCourse: ICourse;
    private myColors: IColorPalette;
    private allSections: IEventSource[];
    private mySections: IEventSource[];
    public isPreview: boolean;
    public id: number;

    constructor(course: ICourse, colors: IColorPalette, isPreview?: boolean) {
        this.myCourse = course;
        this.id = course.id;
        this.myColors = colors;
        this.initEventSources();
        this.isPreview = isPreview ? isPreview : false;
    }

    // create course event sources by looping over all sections
    // create a sectionEventSource using each section
    private initEventSources() {
        var sections = this.myCourse.sections;
        this.allSections = [];
        this.mySections = [];
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var eventSource: SectionEventSource = new SectionEventSource(section, this.myCourse, this.myColors);
            this.allSections.push(eventSource);
            this.mySections.push(eventSource);
        }
    }

    // public removeEventSourcesByType(type: string): void {
    //     this.mySections.filter((sectionEventSource) => {
    //         return sectionEventSource.section_type == type;
    //     });
    // }

    // public addEventSourceById(id: number): void {
    //     for (var i = 0; i < this.allSections.length; i++) {
    //         if (this.allSections[i].id == id) {
    //             this.mySections.push(this.allSections[i]);
    //         }
    //     }
    // }

    public getEventSources(): IEventSource[] {
        return this.mySections;
    }
}

export = CourseEventSources;
