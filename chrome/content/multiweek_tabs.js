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

	LightningCalendarTabs.multiWeekTabs = function(pastCount, futureCount) {
		this.tabs = [];

		this.pastTabs = pastCount;
		this.futureTabs = futureCount;

		this.weekStartDay = getPrefSafe("calendar.week.start", 0);
		this.weekCount = getPrefSafe("calendar.weeks.inview", 4);
		this.weekPrev = getPrefSafe("calendar.previousweeks.inview", 1);
	};

	LightningCalendarTabs.multiWeekTabs.prototype.show = function(tabs) {
		this.weekStartDay = getPrefSafe("calendar.week.start", 0);
		this.weekCount = getPrefSafe("calendar.weeks.inview", 4);
		this.weekPrev = getPrefSafe("calendar.previousweeks.inview", 1);

		var formatter = getDateFormatter();

		var date = this.resetDateToWeekStart(new Date());
		date.setDate(date.getDate() - (this.weekPrev * 7));

		for(var i = - this.pastTabs; i <= this.futureTabs; i++) {

			var dateStart = new Date(date);
			dateStart.setDate(date.getDate() + (i * 7));

			var dateRealStart = new Date(dateStart);
			dateRealStart.setDate(dateRealStart.getDate() + (this.weekPrev * 7));

			var dateEnd = new Date(dateStart);
			dateEnd.setDate(dateEnd.getDate() + ((this.weekCount - 1) * 7) + 6);

			var tab = document.createElement("tab");

			var dateA = LightningCalendarTabs.tabUtils.jsDateToDateTime(dateStart);
			var dateB = LightningCalendarTabs.tabUtils.jsDateToDateTime(dateEnd);
			dateA.isDate = true;
			dateB.isDate = true;
			var label = formatter.formatInterval(dateA, dateB);

			tab.setAttribute("label", label);
			LightningCalendarTabs.tabUtils.prepareTabVisual(tab, i, dateStart, LightningCalendarTabs.tabUtils.PERIOD_MULTIWEEK);

			tab.addEventListener("click", (function(self, date) {
				return function() {
					self.selectWeeks(date);
				};
			})(this, dateRealStart), false);
			tabs.appendChild(tab);

			this.tabs.push({
				"tab" : tab,
				"date" : dateStart
			});
		}
	};

	LightningCalendarTabs.multiWeekTabs.prototype.resetDateToWeekStart = function(date) {
		var tmp = new Date(date);
		while(tmp.getDay() != this.weekStartDay) {
			tmp.setDate(tmp.getDate() - 1);
		}
		return tmp;
	};

	LightningCalendarTabs.multiWeekTabs.prototype.update = function() {
		this.highlightCurrentWeek();
	};

	LightningCalendarTabs.multiWeekTabs.prototype.highlightCurrentWeek = function() {
		var dateStart = currentView().rangeStartDate;
		if(dateStart) {
			var jsDateStart = this.resetDateToWeekStart(new Date(dateStart.year, dateStart.month, dateStart.day));
			this.updateTabsState(jsDateStart);
		}
	};

	LightningCalendarTabs.multiWeekTabs.prototype.selectWeeks = function(date) {
		currentView().goToDay(LightningCalendarTabs.tabUtils.jsDateToDateTime(date));
	};

	LightningCalendarTabs.multiWeekTabs.prototype.updateTabsState = function(date) {
		for(var i in this.tabs) {
			if(this.dateEqual(date, this.tabs[i].date)) {
				this.tabs[i].tab.setAttribute("selected", true);
			} else {
				this.tabs[i].tab.setAttribute("selected", false);
			}
		}
	};

	LightningCalendarTabs.multiWeekTabs.prototype.dateEqual = function(a, b) {
		if(a instanceof Date && b instanceof Date) {
			return a.getDate() == b.getDate() && a.getMonth() == b.getMonth() && a.getFullYear() == b.getFullYear();
		}
		return false;
	};

})();