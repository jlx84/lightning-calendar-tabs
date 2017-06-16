"use strict";
Components.utils.import("resource://gre/modules/Preferences.jsm");

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

	LightningCalendarTabs.weekTabs = function(pastCount, futureCount) {
		this.tabs = [];

		this.pastWeeks = pastCount;
		this.futureWeeks = futureCount;

		this.weekStartDay = Preferences.get("calendar.week.start", 0);
	};

	LightningCalendarTabs.weekTabs.prototype.show = function(tabs) {
		this.weekStartDay = Preferences.get("calendar.week.start", 0);

		var formatter = getDateFormatter();

		var date = this.resetDateToWeekStart(new Date());

		for(var i = - this.pastWeeks; i <= this.futureWeeks; i++) {

			var dateStart = new Date(date);
			dateStart.setDate(date.getDate() + (i * 7));

			var dateEnd = new Date(dateStart);
			dateEnd.setDate(dateEnd.getDate() + 6);

			var tab = document.createElement("tab");

			var dateA = LightningCalendarTabs.tabUtils.jsDateToDateTime(dateStart);
			var dateB = LightningCalendarTabs.tabUtils.jsDateToDateTime(dateEnd);
			dateA.isDate = true;
			dateB.isDate = true;
			var label = formatter.formatInterval(dateA, dateB);

			tab.setAttribute("label", label);
			LightningCalendarTabs.tabUtils.prepareTabVisual(tab, i, dateStart, LightningCalendarTabs.tabUtils.PERIOD_WEEK);

			tab.addEventListener("click", (function(self, date) {
				return function() {
					self.selectWeek(date);
				};
			})(this, dateStart), false);
			tabs.appendChild(tab);

			this.tabs.push({
				"tab" : tab,
				"date" : dateStart
			});
		}
	};

	LightningCalendarTabs.weekTabs.prototype.resetDateToWeekStart = function(date) {
		var tmp = new Date(date);
		while(tmp.getDay() != this.weekStartDay) {
			tmp.setDate(tmp.getDate() - 1);
		}
		return tmp;
	};

	LightningCalendarTabs.weekTabs.prototype.update = function(tabs) {
		this.highlightCurrentWeek(tabs);
	};

	LightningCalendarTabs.weekTabs.prototype.highlightCurrentWeek = function(tabs) {
		var dateStart = currentView().rangeStartDate;
		if(dateStart) {
			var jsDateStart = this.resetDateToWeekStart(new Date(dateStart.year, dateStart.month, dateStart.day));
			this.updateTabsState(tabs, jsDateStart);
		}
	};

	LightningCalendarTabs.weekTabs.prototype.selectWeek = function(date) {
		currentView().goToDay(LightningCalendarTabs.tabUtils.jsDateToDateTime(date));
	};

	LightningCalendarTabs.weekTabs.prototype.updateTabsState = function(tabs, date) {
		for(var i = 0; i < this.tabs.length; i++) {
			if(this.dateEqual(date, this.tabs[i].date)) {
				tabs.selectedIndex = i;
				return;
			}
		}
	};

	LightningCalendarTabs.weekTabs.prototype.dateEqual = function(a, b) {
		if(a instanceof Date && b instanceof Date) {
			return a.getDate() == b.getDate() && a.getMonth() == b.getMonth() && a.getFullYear() == b.getFullYear();
		}
		return false;
	};

})();