/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
import IEvent = require('../interfaces/IEvent');
import IEventSource = require('../interfaces/IEventSource');
import ICourse = require('../interfaces/ICourse');
import ISection = require('../interfaces/ISection');
import IColorPalette = require('../interfaces/IColorPalette');

class SectionEventSource implements IEventSource {

    public static DAYS = {
        'M' : 1,
        'T': 2,
        'W' : 3,
        'Th': 4,
        'F' : 5
    };

    public id: number;
    public events: IEvent[];
    public color: string;
    public section_type: string;

    constructor(section: ISection, course: ICourse, color: string) {
        this.id = section.id;
        this.color = color;
        this.section_type = section.section_type;

        var inputTimeFormat = "hh:mm a";
        var outputTimeFormat = "HH:mm:ss";
        this.events = [];
        for (var j = 0; j < section.meetings.length; j++) {
            var meeting = section.meetings[j];
            var days = meeting.days.split(' ');

            // ignore last element of the result of split, which is 
            // empty string due to the format of the input
            for (var k = 0; k < days.length - 1; k++) {
                var day = days[k];
                var date = this.getAgendaDate(day);
                var startTime = moment(meeting.start_time, inputTimeFormat).format(outputTimeFormat);
                var endTime = moment(meeting.end_time, inputTimeFormat).format(outputTimeFormat);
                var start = date + 'T' + startTime;
                var end = date + 'T' + endTime;
                this.events.push({
                    title: course.primary_listing + " " + section.name,
                    start: start,
                    end: end,
                    location: meeting.location,
                });
            }
        }
    }

    /**
     * gets the date of the day in the current week
     */
    private getAgendaDate(day: string): string {
        var todayOffset = moment().isoWeekday();
        var dayOffset = SectionEventSource.DAYS[day];
        var diff: number = +(dayOffset - todayOffset);
        var date = moment().add('days', diff).format('YYYY-MM-DD');
        return date;
    }
}

export = SectionEventSource;