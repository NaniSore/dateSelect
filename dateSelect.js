/* 
date-select.ls
@author: hersonHN
@version: 0.1
@licence: UNLICENSED
*/
function dateSelect(element, par) {
	"use strict";
	if (!element) {
		return false;
	}
	par = par || {};
	var T = {},
		priv = {},
		foo,
		selects,
		n,
		x,
		y;
	T.months = par.months || ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	T.beforeChange = par.beforeChange || function (T) {};
	T.afterChange = par.afterChange || function (T) {};
	T.separator = par.separator || '-';
	priv.element = element;
	priv.parenElement = par.parenElement || "span";
	if (T.minYMD > T.maxYMD) {
		T.maxY = par.minY + 20;
	}
	priv.fillWithZeros = function (num, length) {
		num += "";
		var zeros = "0000".substr(0, length),
			lnum = num.length;
		return ((lnum > length) ? num : (zeros + num).substr(lnum));
	};
	priv.nDays = function (year, month) {
		return [31, (year % 4 === 0 && year % 400 !== 0) ? 29 : 28,
			31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
	};
	priv.fixDayCount = function () {
		var nMaxDay = priv.nDays(T.year, T.month);
		for (n = 1; n <= 31; n = n + 1) {
			foo = T.dElement.options[n - 1];
			foo.disabled = (n > nMaxDay);
			foo.style.visibility = (n > nMaxDay) ? "hidden" : "";
			foo.style.display = (n > nMaxDay) ? "none" : "";
		}
	};
	T.today = function () {
		var date = new Date();
		T.year = date.getFullYear().toString();
		T.month = priv.fillWithZeros(date.getMonth() + 1, 2);
		T.day = priv.fillWithZeros(date.getDate(), 2);
		return [T.year, T.month, T.day].join(T.separator);
	};
	T.setYear = function (year) {
		T.year = priv.fillWithZeros(year, 4);
		var n;
		for (n = 0; n < T.yElement.options.length; n = n + 1) {
			foo = T.yElement.options[n];
			foo.selected = (foo.value === year);
		}
	};
	T.setMonth = function (month) {
		T.month = priv.fillWithZeros(month, 2);
		var n, nMaxDay;
		for (n = 0; n < T.mElement.options.length; n = n + 1) {
			foo = T.mElement.options[n];
			foo.selected = (foo.value === month);
		}
		priv.fixDayCount();
	};
	T.setDay = function (day) {
		T.day = priv.fillWithZeros(day, 2);
		var n;
		for (n = 1; n <= 31; n = n + 1) {
			foo = T.dElement.options[n - 1];
			foo.selected = (foo.value === day);
		}
	};
	T.setDate = function (date) {
		date = date || T.date;
		var year, month, day,
			tokens = date.split(T.separator);
		year = tokens[0];
		month = tokens[1] || 1;
		day = tokens[2] || 1;
		month = priv.fillWithZeros(month, 2);
		day = priv.fillWithZeros(day, 2);
		T.setYear(year);
		T.setMonth(month);
		T.setDay(day);
	};
	priv.yElementUpdate = function () {
		T.beforeChange(T);
		T.year = T.yElement.value;
		priv.update();
		priv.fixDayCount();
		T.afterChange(T);
	};
	priv.mElementUpdate = function () {
		T.beforeChange(T);
		T.month = T.mElement.value;
		priv.update();
		priv.fixDayCount();
		T.afterChange(T);
	};
	priv.dElementUpdate = function () {
		T.beforeChange(T);
		T.day = T.dElement.value;
		priv.update();
		T.afterChange(T);
	};
	priv.update = function () {
		var date = [T.year, T.month, T.day].join(T.separator);
		T.date = date;
		priv.element.value = date;
	};
	if (element.value) {
		T.date = element.value;
		T.year = T.date.split(T.separator)[0];
		T.month = T.date.split(T.separator)[1] || 1;
		T.day = T.date.split(T.separator)[2] || 1;
		T.year = parseInt(T.year, 10);
	} else {
		T.date = T.today();
	}
	T.minY = par.minY || (parseInt(T.year, 10) - 10);
	T.maxY = par.maxY || (parseInt(T.year, 10) + 10);
	priv.containr = document.createElement(priv.parenElement);
	selects = ["yElement", "mElement", "dElement"];
	for (x in selects) {
		if (selects.hasOwnProperty(x)) {
			foo = selects[x] + "Attrs";
			T[selects[x]] = document.createElement("select");
			priv.containr.appendChild(T[selects[x]]);
			priv[foo] = par.selectsAttrs || {};
			par[foo] = par[foo] || {};
			for (y in par[foo]) {
				if (par[foo].hasOwnProperty(y)) {
					priv[foo][y] = par[foo][y];
				}
			}
			for (y in priv[foo]) {
				if (priv[foo].hasOwnProperty(y)) {
					T[selects[x]].setAttribute(y, priv[foo][y]);
				}
			}
		}
	}
	for (n = T.minY; n <= T.maxY; n = n + 1) {
		foo = document.createElement("option");
		foo.innerHTML = priv.fillWithZeros(n, 4);
		foo.value = priv.fillWithZeros(n, 4);
		T.yElement.appendChild(foo);
	}
	for (n = 1; n <= 12; n = n + 1) {
		foo = document.createElement("option");
		foo.innerHTML = T.months[n - 1];
		foo.value = priv.fillWithZeros(n, 2);
		T.mElement.appendChild(foo);
	}
	for (n = 1; n <= 31; n = n + 1) {
		foo = document.createElement("option");
		foo.innerHTML = priv.fillWithZeros(n, 2);
		foo.value = priv.fillWithZeros(n, 2);
		T.dElement.appendChild(foo);
	}
	T.setDate(T.date);
	priv.update();
	T.dElement.onchange = priv.dElementUpdate;
	T.mElement.onchange = priv.mElementUpdate;
	T.yElement.onchange = priv.yElementUpdate;
	element.style.display = "none";
	element.style.visibility = "hidden";
	element.parentNode.insertBefore(priv.containr, element);

	selects = n = x = y = null;
	return T;
}
