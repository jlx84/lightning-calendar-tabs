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

	LightningCalendarTabs.monthTabs = function(pastCount, futureCount) {
		this.tabs = [];

		this.pastMonths = pastCount;
		this.futureMonths = futureCount;
	};

	LightningCalendarTabs.monthTabs.prototype.show = function(tabs) {
		var date = new Date();
		date.setDate(1);

		var formatter = getDateFormatter();

		for(var i = - this.pastMonths; i <= this.futureMonths; i++) {
			var tmpDate = new Date(date);
			tmpDate.setMonth(tmpDate.getMonth() + i);

			var tab = document.createElement("tab");

			var label = formatter.monthName(tmpDate.getMonth()) + " " + tmpDate.getFullYear();

			tab.setAttribute("label", label);
			LightningCalendarTabs.tabUtils.prepareTabVisual(tab, i, tmpDate, LightningCalendarTabs.tabUtils.PERIOD_MONTH);

			tab.addEventListener("click", (function(self, date) {
				return function() {
					self.selectMonth(date);
				};
			})(this, tmpDate), false);
			tabs.appendChild(tab);

			this.tabs.push({
				"tab" : tab,
				"date" : tmpDate
			});
		}
	};

	LightningCalendarTabs.monthTabs.prototype.update = function(tabs) {
		this.highlightCurrentMonth(tabs);
	};

	LightningCalendarTabs.monthTabs.prototype.highlightCurrentMonth = function(tabs) {
		var dateStart = currentView().rangeStartDate;
		if(dateStart) {
			this.updateTabsState(tabs, new Date(dateStart.year, dateStart.month, dateStart.day));
		}
	};

	LightningCalendarTabs.monthTabs.prototype.selectMonth = function(date) {
		var dateStart = currentView().rangeStartDate;
		if(dateStart) {
			var dy = date.getFullYear() - dateStart.year;
			var dm = date.getMonth() - dateStart.month;
			var d = (dy * 12) + dm;
			if(d != 0) {
				currentView().moveView(d);
			}
		}
	};

	LightningCalendarTabs.monthTabs.prototype.updateTabsState = function(tabs, date) {
		for(var i = 0; i < this.tabs.length; i++) {
			if(this.dateEqual(date, this.tabs[i].date)) {
				tabs.selectedIndex = i;
				return;
			}
		}
	};

	LightningCalendarTabs.monthTabs.prototype.dateEqual = function(a, b) {
		if(a instanceof Date && b instanceof Date) {
			return a.getMonth() == b.getMonth() && a.getFullYear() == b.getFullYear();
		}
		return false;
	};

})();