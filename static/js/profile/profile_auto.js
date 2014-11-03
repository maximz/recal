$(function() {
    createAuto();
});
function createAuto()
{
    $( "#class" ).autocomplete({
        minLength: 2,
        source: function( request, response ) {
            var term = request.term;
            CourseMan_pullAutoComplete(request, function(data){
                var ret = [];
                $.each(data, function(index){
                    ret.push({
                        id: this.course_id,
                        value: this.course_listings,
                        label: this.course_listings,
                        desc: this.course_title,
                    });
                });
                AR_reloadWithData(data, term);
                response(ret);
                /* data should be like 
                 * [{
                 * value: "jquery",
                 * label: "jQuery",
                 * desc: "the write less, do more, JavaScript library"
                 * },] */
            });
        },
        select: function( event, ui ) {
            var courseID = ui.item.id;
            CourseMan_enrollInCourseID(courseID);
            $('#class').val('');
            CL_selectID(courseID);
            return false;
        },
        autoFocus: true,
    });
}