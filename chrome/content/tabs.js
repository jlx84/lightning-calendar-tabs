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

(function () {

	LightningCalendarTabs.tabsController = function () {
		this.arrowScrollBox = null;
		this.tabBox = null;
		this.tabs = null;

		this.monthTabs = null;
		this.multiWeekTabs = null;
		this.weekTabs = null;
		this.dayTabs = null;

		this.prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);

		this.currentTabs = null;
		this.startupInProgress = false;

		this.visible = false;
	};

	/**
	 * attach events
	 *
	 * @returns {undefined}
	 */
	LightningCalendarTabs.tabsController.prototype.startup = function () {
		this.startupInProgress = true;
		var self = this;
		var viewTabs;
		viewTabs = LightningCalendarTabs.win.document.getElementById("viewToggle");
		if (viewTabs) {
			this.buttonMonth = LightningCalendarTabs.win.document.getElementById("calTabMonth");
			this.buttonWeek = LightningCalendarTabs.win.document.getElementById("calTabWeek");
			this.buttonDay = LightningCalendarTabs.win.document.getElementById("calTabDay");
			this.buttonMultiWeek = LightningCalendarTabs.win.document.getElementById("calTabMultiweek");

			// "viewloaded" hasn't existed since TB 102.
			// LightningCalendarTabs.win.getViewBox().addEventListener("viewloaded", function () {
			//   self.decideTabsVisibility();
			// }, false);
			LightningCalendarTabs.win.getViewBox().addEventListener("dayselect", function () {
				self.updateTabs();
			}, false);
			//attach to lightning's tabs select event to switch tab type
			viewTabs.addEventListener("click", function () {
				self.decideTabsVisibility();
			});
			this.initializeTabControllers();

			this.createTabBox();
			this.decideTabsVisibility();
		} else {
			// If the element is never found, this will run in an endless loop.
			LightningCalendarTabs.win.setTimeout(function () {
				self.startup();
			}, 1000);
		}
		this.startupInProgress = false;
	};

	LightningCalendarTabs.tabsController.prototype.shutdown = function () {
		var calendar = LightningCalendarTabs.win.document.getElementById("calendar-view-box");
		calendar.removeChild(this.arrowScrollBox);
	};

	LightningCalendarTabs.tabsController.prototype.initializeTabControllers = function () {
		this.monthsEnabled = this.prefs.getBoolPref("extensions.lightningcalendartabs.tabs.months.enabled");
		this.multiWeeksEnabled = this.prefs.getBoolPref("extensions.lightningcalendartabs.tabs.multiweeks.enabled");
		this.weeksEnabled = this.prefs.getBoolPref("extensions.lightningcalendartabs.tabs.weeks.enabled");
		this.daysEnabled = this.prefs.getBoolPref("extensions.lightningcalendartabs.tabs.days.enabled");
		this.otherDateTabEnabled = this.prefs.getBoolPref("extensions.lightningcalendartabs.tabs.show_other_tab");

		if (this.monthsEnabled) {
			this.pastMonths = Math.max(0, this.prefs.getIntPref("extensions.lightningcalendartabs.tabs.months.past"));
			this.futureMonths = Math.max(0, this.prefs.getIntPref("extensions.lightningcalendartabs.tabs.months.future"));

			this.monthTabs = new LightningCalendarTabs.monthTabs(this.pastMonths, this.futureMonths, this.otherDateTabEnabled);
		} else {
			this.monthTabs = null;
		}

		if (this.multiWeeksEnabled) {
			this.pastMultiWeeks = Math.max(0, this.prefs.getIntPref("extensions.lightningcalendartabs.tabs.multiweeks.past"));
			this.futureMultiWeeks = Math.max(0, this.prefs.getIntPref("extensions.lightningcalendartabs.tabs.multiweeks.future"));

			this.multiWeekTabs = new LightningCalendarTabs.multiWeekTabs(this.pastMultiWeeks, this.futureMultiWeeks, this.otherDateTabEnabled);
		} else {
			this.multiWeekTabs = null;
		}

		if (this.weeksEnabled) {
			this.pastWeeks = Math.max(0, this.prefs.getIntPref("extensions.lightningcalendartabs.tabs.weeks.past"));
			this.futureWeeks = Math.max(0, this.prefs.getIntPref("extensions.lightningcalendartabs.tabs.weeks.future"));

			this.weekTabs = new LightningCalendarTabs.weekTabs(this.pastWeeks, this.futureWeeks, this.otherDateTabEnabled);
		} else {
			this.weekTabs = null;
		}

		if (this.daysEnabled) {
			this.pastDays = Math.max(0, this.prefs.getIntPref("extensions.lightningcalendartabs.tabs.days.past"));
			this.futureDays = Math.max(0, this.prefs.getIntPref("extensions.lightningcalendartabs.tabs.days.future"));

			this.dayTabs = new LightningCalendarTabs.dayTabs(this.pastDays, this.futureDays, this.otherDateTabEnabled);
		} else {
			this.dayTabs = null;
		}
	};

	/**
	 * hide or show tabs depending on what user view user selected and if this tabs are enabled in options
	 *
	 * @returns {undefined}
	 */
	LightningCalendarTabs.tabsController.prototype.decideTabsVisibility = function () {
		this.selectCurrentController();
		if (this.currentTabs !== null) {
			this.showTabBox();
		} else {
			this.hideTabBox();
		}
	};

	/**
	 * select controller depending on user selection
	 *
	 * @returns {undefined}
	 */
	LightningCalendarTabs.tabsController.prototype.selectCurrentController = function () {
		var newTabs = null;

		if (this.buttonMonth.getAttribute("aria-selected") == "true") {
			newTabs = this.monthTabs;
		}
		if (this.buttonMultiWeek.getAttribute("aria-selected") == "true") {
			newTabs = this.multiWeekTabs;
		}
		if (this.buttonWeek.getAttribute("aria-selected") == "true") {
			newTabs = this.weekTabs;
		}
		if (this.buttonDay.getAttribute("aria-selected") == "true") {
			newTabs = this.dayTabs;
		}

		if (newTabs != this.currentTabs) {
			this.hideTabBox();
			this.currentTabs = newTabs;
		}
	};

	/**
	 * create tabs container in the area between calendar and view switching tabs
	 */
	LightningCalendarTabs.tabsController.prototype.createTabBox = function () {
		this.arrowScrollBox = LightningCalendarTabs.win.document.createXULElement("arrowscrollbox");
		this.arrowScrollBox.setAttribute("orient", "horizontal");
		this.arrowScrollBox.setAttribute("class", "lightning-calendar-tabs-tabs-container");

		this.tabBox = LightningCalendarTabs.win.document.createXULElement("tabbox");

		this.tabs = LightningCalendarTabs.win.document.createXULElement("tabs");
		//this somehow enables scrolling left and right using `arrowscrollbox` XUL element
		//stops preventing the tabs from shrinking the calendar view to narrower width than width of tabs
		this.tabs.style.minWidth = "1px";
		this.tabs.style.maxWidth = "500px";

		var calendar = LightningCalendarTabs.win.document.getElementById("calendar-view-box");
		var viewDeck = LightningCalendarTabs.win.document.getElementById("view-box");

		calendar.insertBefore(this.arrowScrollBox, viewDeck);

		this.arrowScrollBox.appendChild(this.tabBox);
		this.tabBox.appendChild(this.tabs);
	};

	LightningCalendarTabs.tabsController.prototype.showTabBox = function () {
		if (!this.visible && this.currentTabs !== null && this.tabBox && this.tabs) {
			this.currentTabs.show(this.tabs);
			this.currentTabs.update(this.tabs);
			this.visible = true;
			this.tabBox.style.display = "block";
		}
	};

	LightningCalendarTabs.tabsController.prototype.hideTabBox = function () {
		if (this.visible) {
			this.clearTabBoxContent();
			this.visible = false;
		}
	};

	LightningCalendarTabs.tabsController.prototype.clearTabBoxContent = function () {
		var elementsToRemove = this.tabs.getElementsByTagName('tab');
		while (elementsToRemove.length) {
			this.tabs.removeChild(elementsToRemove[0]);
		}
		this.tabBox.style.display = "none";
	};

	/**
	 * select actual tab on day selection in calendar
	 *
	 * @returns {undefined}
	 */
	LightningCalendarTabs.tabsController.prototype.updateTabs = function () {
		if (this.currentTabs !== null && this.tabs) {
			this.currentTabs.update(this.tabs);
		}
	};

	//--------------------------------------------------------------------------

	/**
	 * callback for options update
	 *
	 * @returns {undefined}
	 */
	LightningCalendarTabs.tabsController.prototype.updatePrefs = function () {
		if (this.startupInProgress)
			return;
		this.initializeTabControllers();
		this.hideTabBox();
		this.selectCurrentController();
		this.showTabBox();
	};

	//--------------------------------------------------------------------------

	LightningCalendarTabs.tabs = function (otherDateTabEnabled) {
		this.tabs = [];
		this.otherDateTabEnabled = otherDateTabEnabled;
		this.otherTab = null;
		this.formatter = LightningCalendarTabs.win.cal.dtz.formatter;
	};

	LightningCalendarTabs.tabs.prototype.show = function () {
		if (this.otherDateTabEnabled) {
			this.otherTab = LightningCalendarTabs.win.document.createXULElement('tab');
			this.otherTab.collapse = true;
		}
	};

	LightningCalendarTabs.tabs.prototype.update = function (tabs) {
		this.highlightCurrent(tabs);
	};

	LightningCalendarTabs.tabs.prototype.highlightCurrent = function (tabs) {
		var dateStart = LightningCalendarTabs.tabUtils.getCalendarStartDate();
		if (dateStart) {
			this.updateTabsState(tabs, dateStart);
		}
	};

	LightningCalendarTabs.tabs.prototype.updateTabsState = function (tabs, date) {
		for (var i = 0; i < this.tabs.length; i++) {
			if (this.dateEqual(date, this.tabs[i].date)) {
				this.hideOtherTab(tabs);
				tabs.selectedIndex = i;
				return;
			}
		}
		this.updateOtherTab(tabs, date);
	};

	LightningCalendarTabs.tabs.prototype.updateOtherTab = function (tabs, date) {
		if (this.otherDateTabEnabled && this.tabs.length > 0) {
			if (date.nativeTime < this.tabs[0].date.nativeTime) {
				tabs.insertBefore(this.otherTab, tabs.firstChild);
				tabs.selectedIndex = 0;
			} else {
				tabs.appendChild(this.otherTab);
				tabs.selectedIndex = tabs.itemCount - 1;
			}
			this.makeTabLabel(this.otherTab, date);
			this.otherTab.collapsed = false;
			LightningCalendarTabs.tabUtils.prepareTabVisual(this.otherTab, tabs.selectedIndex == 0 ? -1 : 1, date, this.periodType);
		}
	};

	LightningCalendarTabs.tabs.prototype.hideOtherTab = function (tabs) {
		if (this.otherDateTabEnabled && this.otherTab.parentNode) {
			tabs.removeChild(this.otherTab);
		}
	};

})();
