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

	LightningCalendarTabs.weekTabs = function(pastCount, futureCount, otherDateTabEnabled) {
		LightningCalendarTabs.tabs.call(this, otherDateTabEnabled);
		this.periodType = LightningCalendarTabs.tabUtils.PERIOD_WEEK;

		this.pastWeeks = pastCount;
		this.futureWeeks = futureCount;
	};
	
	LightningCalendarTabs.weekTabs.prototype = Object.create(LightningCalendarTabs.tabs.prototype);
	LightningCalendarTabs.weekTabs.prototype.constructor = LightningCalendarTabs.weekTabs;

	LightningCalendarTabs.weekTabs.prototype.show = function(tabs) {
		LightningCalendarTabs.tabs.prototype.show.call(this);
		
		var date = LightningCalendarTabs.tabUtils.resetDateToWeekStart(new Date());

		for(var i = - this.pastWeeks; i <= this.futureWeeks; i++) {

			var dateStart = new Date(date);
			dateStart.setDate(date.getDate() + (i * 7));

			var tab = document.createElement("tab");
			this.makeTabLabel(tab, dateStart);

			LightningCalendarTabs.tabUtils.prepareTabVisual(tab, i, dateStart, this.periodType);

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

	LightningCalendarTabs.weekTabs.prototype.highlightCurrent = function(tabs) {
		var dateStart = currentView().rangeStartDate;
		if(dateStart) {
			var jsDateStart = LightningCalendarTabs.tabUtils.resetDateToWeekStart(new Date(Date.UTC(dateStart.year, dateStart.month, dateStart.day)));
			this.updateTabsState(tabs, jsDateStart);
		}
	};

	LightningCalendarTabs.weekTabs.prototype.selectWeek = function(date) {
		currentView().goToDay(LightningCalendarTabs.tabUtils.jsDateToDateTime(date));
	};

	LightningCalendarTabs.weekTabs.prototype.dateEqual = function(a, b) {
		if(a instanceof Date && b instanceof Date) {
			return a.getDate() == b.getDate() && a.getMonth() == b.getMonth() && a.getFullYear() == b.getFullYear();
		}
		return false;
	};
	
	LightningCalendarTabs.weekTabs.prototype.makeTabLabel = function(tab, date) {
		var dateEnd = new Date(date);
		dateEnd.setDate(dateEnd.getDate() + 6);
		var dateA = LightningCalendarTabs.tabUtils.jsDateToDateTime(date);
		var dateB = LightningCalendarTabs.tabUtils.jsDateToDateTime(dateEnd);
		dateA.isDate = true;
		dateB.isDate = true;
		var label = this.formatter.formatInterval(dateA, dateB);

		tab.setAttribute("label", label);
	};

})();