var __MYCPM = { "visitorId": "", "_callback": null, "_cookie_name": null, "_isCall": false, "getVisitorId": function (cookie_name, callback) { this._callback = callback; this._cookie_name = cookie_name; if (typeof(callback) !== "function") { return null; } this.visitorId = this.getCookie(cookie_name); if (this.visitorId) { callback(this.visitorId); return; } this.loadScript("http://acvatic.ru/cookie.js?callback=__MYCPM.onNewCookie") var self = this; setTimeout(function(){ if (!self._isCall){ self._isCall = true; self._callback(self.visitorId); } }, 500); }, "getCookie": function (name) { var value = "; " + document.cookie; var parts = value.split("; " + name + "="); if (parts.length >= 2) return parts.pop().split(";").shift(); return null; }, "loadScript": function (script_url) { var script = document.createElement("sc" + "r" + "ipt"); script.setAttribute("type", "text/java" + "sc" + "r" + "ipt"); var heads = document.getElementsByTagName("head"); if (heads.length){ heads[0].appendChild(script); script.setAttribute("src", script_url); } }, "onNewCookie": function (value) { this.visitorId = value; var date = new Date(new Date().getTime() + 10 * 365 * 24 * 60 * 60 * 1000); document.cookie = this._cookie_name + "=" + value + "; path=/; expires=" + date.toUTCString(); if (!this._isCall){ this._isCall = true; this._callback(value); } } };__MYCPM.getVisitorId("_mycpm_vid", function (visitor) { __MYCPM.loadScript("//mycpm.ru/core/?action=cs&stream_id=0&vid={VID}&title=".replace('{VID}', visitor)); });