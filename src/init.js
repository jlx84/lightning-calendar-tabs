"use strict";

console.log('TEST');

//Components.utils.import("resource://gre/modules/Preferences.jsm");

(function () {

    browser.windows.getAll({
        populate: true,
    }).then((windows) => {
        console.log('all windows', windows);
        windows.forEach(w => {
            console.log('tabs', w.tabs);
        });
    });

    browser.tabs.onActivated.addListener((tab) => {
        console.log(tab);
    });

    var lightningPresent = false;

    //var { Services } = ChromeUtils.import('resource://gre/modules/Services.jsm');
    //Services.console.logStringMessage("LCT: start");

    try {
        var { cal } = ChromeUtils.import("resource://calendar/modules/calUtils.jsm");
        lightningPresent = true;
    } catch (error) {
        //no Lightning, will not do anything
    }

    if (lightningPresent) {
        console.log('lightnin present');
        /**
         * init
         */
        window.addEventListener("load", function (e) {
            var lct = new LightningCalendarTabs.tabsController();
            lct.startup();

            var prefListener = new LightningCalendarTabs.prefObserver("extensions.lightningcalendartabs.tabs.",
                function (branch, name) {
                    lct.updatePrefs();
                }
            );
            prefListener.register();
            var prefListenerWeekStart = new LightningCalendarTabs.prefObserver("calendar.week.start",
                function (branch, name) {
                    lct.updatePrefs();
                }
            );
            prefListenerWeekStart.register();
        }, false);
    }


})();