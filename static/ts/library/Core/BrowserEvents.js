define(["require", "exports"], function(require, exports) {
    var BrowserEvents = (function () {
        function BrowserEvents() {
        }
        BrowserEvents.blur = 'blur';
        BrowserEvents.click = 'click';
        BrowserEvents.focus = 'focus';
        BrowserEvents.focusIn = 'focusin';
        BrowserEvents.focusOut = 'focusout';
        BrowserEvents.mouseDown = 'mousedown';
        BrowserEvents.transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd';
        BrowserEvents.keyPress = 'keypress';
        BrowserEvents.keyDown = 'keydown';

        BrowserEvents.actionSheetDidSelectChoice = 'actionSheetDidSelectChoice';

        BrowserEvents.bootstrapPopoverHidden = 'hidden.bs.popover';
        BrowserEvents.bootstrapModalShow = 'show.bs.modal';
        BrowserEvents.bootstrapModalHide = 'hide.bs.modal';

        BrowserEvents.viewWasAppended = 'viewWasAppended';
        BrowserEvents.viewWasRemoved = 'viewWasRemoved';

        BrowserEvents.focusableViewDidFocus = 'focusableViewDidFocus';
        BrowserEvents.focusableViewDidBlur = 'focusableViewDidBlur';

        BrowserEvents.popUpWillDrag = 'popUpWillDrag';

        BrowserEvents.clickToEditComplete = 'clickToEditComplete';
        BrowserEvents.clickToEditShouldBegin = 'clickToEditShouldBegin';

        BrowserEvents.tableViewCellSelectionChanged = 'tableViewCellSelectionChanged';

        BrowserEvents.sidebarViewDidDrop = 'sidebarViewDidDrop';
        BrowserEvents.sidebarWillHide = 'sidebarWillHide';

        BrowserEvents.notificationShouldRemove = 'notificationShouldRemove';
        BrowserEvents.notificationShouldOpen = 'notificationShouldOpen';

        BrowserEvents.segmentedControlSelectionChange = 'segmentedControlSelectionChange';
        return BrowserEvents;
    })();
    
    return BrowserEvents;
});