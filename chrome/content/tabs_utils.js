"use strict";

/*
    This file is part of Lightning Calendar Tabs extension.

    Lightning Calendar Tabs is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Lightning Calendar Tabs is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Lightning Calendar Tabs.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
	Lightning Calendar Tabs

	a plugin to add tabs in calendar view into Lightning calendar plugin for Mozilla Thunderbird
	(c) 2012, Jiri Lysek

	jlx@seznam.cz
*/

var LightningCalendarTabs = LightningCalendarTabs || {};

(function() {

	Components.utils["import"]("resource://calendar/modules/calUtils.jsm");

	LightningCalendarTabs.tabUtils = LightningCalendarTabs.tabUtils || {};

	LightningCalendarTabs.tabUtils.PERIOD_WEEK = "week";
	LightningCalendarTabs.tabUtils.PERIOD_MULTIWEEK = "multiweek";
	LightningCalendarTabs.tabUtils.PERIOD_MONTH = "month";
	LightningCalendarTabs.tabUtils.PERIOD_DAY = "day";

	LightningCalendarTabs.tabUtils.prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	
	LightningCalendarTabs.tabUtils.application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);
	LightningCalendarTabs.tabUtils.log = function(value) {
		LightningCalendarTabs.tabUtils.application.console.log.apply(undefined, arguments);
	};

	LightningCalendarTabs.tabUtils.prepareTabVisual = function(tab, i, date, periodType) {
		var prefs = LightningCalendarTabs.tabUtils.prefs;
		var classNames = "";

		//color for the previous, current and past tab
		if(i == 0) {
			classNames = "current";
			tab.style.color = prefs.getCharPref("extensions.lightningcalendartabs.tabs.text_color_current");
		} else if(i < 0) {
			classNames = "past";
			tab.style.color = prefs.getCharPref("extensions.lightningcalendartabs.tabs.text_color_past");
		} else if(i > 0) {
			classNames = "future";
			tab.style.color = prefs.getCharPref("extensions.lightningcalendartabs.tabs.text_color_future");
		}

		//color for new period tab
		var newPeriodColor = prefs.getCharPref("extensions.lightningcalendartabs.tabs.text_color_new_period");
		var tmp = new Date(date);
		switch(periodType) {
			case this.PERIOD_WEEK: {
				//contains first day of month
				tmp.setDate(date.getDate() + 7);
				if(date.getMonth() != tmp.getMonth() || date.getDate() == 1) {
					tab.style.color = newPeriodColor;
				}
			} break;
			case this.PERIOD_MULTIWEEK: {
				//contains new year
				var weekCount = getPrefSafe("calendar.weeks.inview", 4);
				tmp.setDate(date.getDate() + ((weekCount - 1) * 7) + 6);
				if(date.getFullYear() != tmp.getFullYear() || (date.getMonth() == 0 && date.getDate() == 1)) {
					tab.style.color = newPeriodColor;
				}
			} break;
			case this.PERIOD_MONTH: {
				//first month of year
				if(date.getMonth() == 0) {
					tab.style.color = newPeriodColor;
				}
			} break;
			case this.PERIOD_DAY: {
				//first day of week
				var weekStartDay = getPrefSafe("calendar.week.start", 0);
				if(date.getDay() == weekStartDay) {
					tab.style.color = newPeriodColor;
				}
			} break;
		}

		tab.setAttribute("class", classNames);
	};

	LightningCalendarTabs.tabUtils.jsDateToDateTime = function(aDate) {
		var ret = cal.jsDateToDateTime(aDate);
		return ret;
	};

})();