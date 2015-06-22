$(function() {
  var getJson = "./json/dojo_list.json";
  var json = getJson;
  $("div.dojos").html("");
  $.getJSON(json, function(data) {
    $(data.release).each(function() {
      $('<div class="dojo" id="'+this.userid+'"><a class="button-rounded button-flat-primary dojo-link" href="' + this.url + '" ' + this.target + '>'+
        '<ul>'+
        '<li class="level"><span>Level:</span>'+this.level+'</li>'+
        '<li class="label"><span class="' + this.id + '">' + this.username + '</span></li>'+
        //'<li>' + this.username + '</li>'+
        '</ul>'+
        '<i class="icon-link-ext"></i>'+
        '</a></div>').appendTo('div.dojos');
    });
  });
});
var Toast;
(function () {
    Toast = function (a, b) {
        this._toastElement = $(a);
        this._messageElement = $(b)
    };
    Toast.prototype = {
        _toastElement: null,
        _messageElement: null,
        _timerId: null,
        show: function (a, b, c) {
            var d = this;
            this._toastElement.is(":hidden") || null === this._timerId ? (this._messageElement.html(a), this._toastElement.removeAttr("class"), 1 < arguments.length && this._toastElement.addClass(b), this._toastElement.show(), 2 < arguments.length && "number" === typeof c && (this._timerId = setTimeout(function () {
                    d._toastElement.hide();
                    d._timerId = null
                },
                c))) : (this._toastElement.hide(), clearTimeout(this._timerId), this._timerId = setTimeout(function () {
                d.show(a, b, c)
            }, 300))
        },
        close: function () {
            this._toastElement.hide()
        }
    }
})();
var S2Storage;
(function () {
    S2Storage = function (a, b) {
        if ("undefined" === typeof localStorage) throw Error("Web Storage is not available");
        0 === arguments.length && (a = !0);
        if (2 > arguments.length || "string" !== typeof b) b = "";
        this._storage = a ? localStorage : sessionStorage;
        this._namespace = b + "_"
    };
    S2Storage.prototype = {
        _namespace: "",
        get: function (a, b, c) {
            1 == arguments.length && (b = null);
            var d = this._storage.getItem(this._namespace + a);
            return null !== d ? 2 < arguments.length && "function" === typeof c ? JSON.parse(d, c) : JSON.parse(d) : b
        },
        set: function (a, b) {
            var c =
                JSON.stringify(b);
            this._storage.setItem(this._namespace + a, c)
        },
        remove: function (a) {
            this._storage.removeItem(this._namespace + a)
        },
        getRawData: function (a) {
            return this._storage.getItem(this._namespace + a)
        },
        setRawData: function (a, b) {
            JSON.parse(b);
            this._storage.setItem(this._namespace + a, b)
        }
    }
})();
var Config;
(function () {
    Config = function (a, b, c, d) {
        if ("undefined" === typeof S2Storage) throw Error("S2Storage Class is not available");
        for (var e in this) this._initialKeys[e] = !0;
        1 <= arguments.length && (this._defaultValues = this._cloneObject(a), this._importValues(a));
        this._storage = new S2Storage(!0, b);
        3 <= arguments.length && (this.storageKey = c);
        4 <= arguments.length && (this._reviver = d)
    };
    Config.prototype = {
        _storage: null,
        _reviver: null,
        _initialKeys: {},
        _defaultValues: {},
        _copyConfigValues: function (a, b) {
            for (var c in a)
                if ("undefined" === typeof this._initialKeys[c])
                    if (a[c] instanceof Date) b[c] = new Date, b[c].setTime(a[c].getTime());
                    else if (a[c] instanceof Array) {
                b[c] = [];
                for (var d = 0; d < a[c].length; d++) b[c][d] = this._cloneObject(a[c][d])
            } else b[c] = a[c] && "object" === typeof a[c] ? this._cloneObject(a[c]) : a[c]
        },
        _importValues: function (a) {
            for (var b in this._initialKeys)
                if ("undefined" !== typeof a[b]) throw Error("The key name already exists : " + b);
            this._copyConfigValues(a, this)
        },
        _cloneObject: function (a) {
            var b = {},
                c;
            for (c in a)
                if (a[c] instanceof Date) b[c] = new Date, b[c].setTime(a[c].getTime());
                else if (a[c] instanceof Array) {
                b[c] = [];
                for (var d = 0; d < a[c].length; d++) b[c][d] = this._cloneObject(a[c][d])
            } else b[c] = a[c] && "object" === typeof a[c] ? this._cloneObject(a[c]) : a[c];
            return b
        },
        storageKey: "config",
        clear: function () {
            for (var a in this) this._initialKeys[a] || delete this[a]
        },
        reset: function () {
            this.clear();
            this._importValues(this._defaultValues)
        },
        save: function () {
            var a = {};
            this._copyConfigValues(this, a);
            this._storage.set(this.storageKey, a)
        },
        load: function (a) {
            var b = this._storage.get(this.storageKey, {}, this._reviver);
            a && this.clear();
            this._importValues(b)
        },
        getRawData: function () {
            return this._storage.getRawData(this.storageKey)
        },
        setRawData: function (a) {
            this._storage.setRawData(this.storageKey, a)
        }
    }
})();
(function (a) {
    a.fn.closeButton = function () {
        return this.each(function () {
            var b = a(this);
            b.click(function (c) {
                var d = b.data("target");
                d && (d = a(d), c && c.preventDefault(), d.trigger(c = a.Event("close")), c.isDefaultPrevented() || d.trigger("closed").hide())
            })
        })
    }
})(jQuery);
(function (a) {
    var b = function (a) {
        this._element = a;
        this._config = new Config({
            version: -1
        }, "VersionedInfo");
        this._config.load();
        if (this._enable()) {
            var b = this;
            a.bind("closed", function () {
                b._closed()
            })
        } else a.hide()
    };
    b.prototype = {
        _config: null,
        _element: null,
        _getVersion: function () {
            var a = this._element.data("version");
            return "undefined" === typeof a ? -1 : parseInt(a, 10)
        },
        _enable: function () {
            var a = this._getVersion();
            return 0 > a ? !0 : a !== this._config.version
        },
        _closed: function () {
            var a = this._getVersion();
            0 > a || (this._config.version =
                a, this._config.save())
        }
    };
    a.fn.versionedInfo = function () {
        return this.each(function () {
            new b(a(this))
        })
    }
})(jQuery);
$(function () {
    try {
        var a = new Toast("#toast", "#toastMessage"),
            b = new MobamasDojo(a);
        $("a.dojo-link").click(function () {
            b.onclickDojoLink($(this))
        });
        $("button.hide-dojo").click(function () {
            b.onclickHideDojo($(this))
        });
        $("#configOK").click(function () {
            b.onclickConfigOK($(this))
        });
        $("#configResetVisited").click(function () {
            b.onclickConfigResetVisited($(this))
        });
        $("#configResetHide").click(function () {
            b.onclickConfigResetHide($(this))
        });
        $("#configReset").click(function () {
            b.onclickConfigReset($(this))
        });
        $("#info").bind("closed",
            function () {
                b.onclosedInfo()
            });
        $("#birthday").bind("closed", function () {
            b.onclosedBirthday()
        });
        $("#openConfig").click(function () {
            b.onclickOpenConfig()
        });
        $("#config").bind("close", function (a) {
            b.oncloseConfig(a)
        });
        $("#dataInput").submit(function () {
            b.onsubmitDataInput();
            return !1
        });
        b.init();
        $("#versionedInfo").versionedInfo();
        $(".close").closeButton();
        $("#configCancel").closeButton();
        $("#buttons").show();
        $("#dojos").show()
    } catch (c) {
        var d = "<h3>" + c.message + "</h3>";
        c.stack && (d += "<p>" + c.stack + "</p>");
        a.show(d,
            "info error")
    }
});