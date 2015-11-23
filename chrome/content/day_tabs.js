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

	LightningCalendarTabs.dayTabs = function(pastCount, futureCount) {
		this.tabs = [];

		this.pastDays = pastCount;
		this.futureDays = futureCount;
	};

	LightningCalendarTabs.dayTabs.prototype.show = function(tabs) {
		var formatter = getDateFormatter();

		var date = new Date();

		for(var i = - this.pastDays; i <= this.futureDays; i++) {

			var dateStart = new Date(date);
			dateStart.setDate(date.getDate() + i);

			var tab = document.createElement("tab");

			var label = formatter.formatDate(LightningCalendarTabs.tabUtils.jsDateToDateTime(dateStart));

			tab.setAttribute("label", label);
			LightningCalendarTabs.tabUtils.prepareTabVisual(tab, i, dateStart, LightningCalendarTabs.tabUtils.PERIOD_DAY);

			tab.addEventListener("click", (function(self, date) {
				return function() {
					self.selectDay(date);
				};
			})(this, dateStart), false);
			tabs.appendChild(tab);

			this.tabs.push({
				"tab" : tab,
				"date" : dateStart
			});
		}
	};

	LightningCalendarTabs.dayTabs.prototype.update = function() {
		this.highlightCurrentWeek();
	};

	LightningCalendarTabs.dayTabs.prototype.highlightCurrentWeek = function() {
		var dateStart = currentView().rangeStartDate;
		if(dateStart) {
			var jsDateStart = new Date(dateStart.year, dateStart.month, dateStart.day);
			this.updateTabsState(jsDateStart);
		}
	};

	LightningCalendarTabs.dayTabs.prototype.selectDay = function(date) {
		currentView().goToDay(LightningCalendarTabs.tabUtils.jsDateToDateTime(date));
	};

	LightningCalendarTabs.dayTabs.prototype.updateTabsState = function(date) {
		for(var i in this.tabs) {
			if(this.dateEqual(date, this.tabs[i].date)) {
				this.tabs[i].tab.setAttribute("selected", true);
			} else {
				this.tabs[i].tab.setAttribute("selected", false);
			}
		}
	};

	LightningCalendarTabs.dayTabs.prototype.dateEqual = function(a, b) {
		if(a instanceof Date && b instanceof Date) {
			return a.getDate() == b.getDate() && a.getMonth() == b.getMonth() && a.getFullYear() == b.getFullYear();
		}
		return false;
	};

})();