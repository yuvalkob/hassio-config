var token = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
var twoDigitsOptional = "[1-9]\\d?";
var twoDigits = "\\d\\d";
var threeDigits = "\\d{3}";
var fourDigits = "\\d{4}";
var word = "[^\\s]+";
var literal = /\[([^]*?)\]/gm;
function shorten(arr, sLen) {
    var newArr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        newArr.push(arr[i].substr(0, sLen));
    }
    return newArr;
}
var monthUpdate = function (arrName) { return function (v, i18n) {
    var lowerCaseArr = i18n[arrName].map(function (v) { return v.toLowerCase(); });
    var index = lowerCaseArr.indexOf(v.toLowerCase());
    if (index > -1) {
        return index;
    }
    return null;
}; };
function assign(origObj) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var obj = args_1[_a];
        for (var key in obj) {
            // @ts-ignore ex
            origObj[key] = obj[key];
        }
    }
    return origObj;
}
var dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];
var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
var monthNamesShort = shorten(monthNames, 3);
var dayNamesShort = shorten(dayNames, 3);
var defaultI18n = {
    dayNamesShort: dayNamesShort,
    dayNames: dayNames,
    monthNamesShort: monthNamesShort,
    monthNames: monthNames,
    amPm: ["am", "pm"],
    DoFn: function (dayOfMonth) {
        return (dayOfMonth +
            ["th", "st", "nd", "rd"][dayOfMonth % 10 > 3
                ? 0
                : ((dayOfMonth - (dayOfMonth % 10) !== 10 ? 1 : 0) * dayOfMonth) % 10]);
    }
};
var globalI18n = assign({}, defaultI18n);
var setGlobalDateI18n = function (i18n) {
    return (globalI18n = assign(globalI18n, i18n));
};
var regexEscape = function (str) {
    return str.replace(/[|\\{()[^$+*?.-]/g, "\\$&");
};
var pad = function (val, len) {
    if (len === void 0) { len = 2; }
    val = String(val);
    while (val.length < len) {
        val = "0" + val;
    }
    return val;
};
var formatFlags = {
    D: function (dateObj) { return String(dateObj.getDate()); },
    DD: function (dateObj) { return pad(dateObj.getDate()); },
    Do: function (dateObj, i18n) {
        return i18n.DoFn(dateObj.getDate());
    },
    d: function (dateObj) { return String(dateObj.getDay()); },
    dd: function (dateObj) { return pad(dateObj.getDay()); },
    ddd: function (dateObj, i18n) {
        return i18n.dayNamesShort[dateObj.getDay()];
    },
    dddd: function (dateObj, i18n) {
        return i18n.dayNames[dateObj.getDay()];
    },
    M: function (dateObj) { return String(dateObj.getMonth() + 1); },
    MM: function (dateObj) { return pad(dateObj.getMonth() + 1); },
    MMM: function (dateObj, i18n) {
        return i18n.monthNamesShort[dateObj.getMonth()];
    },
    MMMM: function (dateObj, i18n) {
        return i18n.monthNames[dateObj.getMonth()];
    },
    YY: function (dateObj) {
        return pad(String(dateObj.getFullYear()), 4).substr(2);
    },
    YYYY: function (dateObj) { return pad(dateObj.getFullYear(), 4); },
    h: function (dateObj) { return String(dateObj.getHours() % 12 || 12); },
    hh: function (dateObj) { return pad(dateObj.getHours() % 12 || 12); },
    H: function (dateObj) { return String(dateObj.getHours()); },
    HH: function (dateObj) { return pad(dateObj.getHours()); },
    m: function (dateObj) { return String(dateObj.getMinutes()); },
    mm: function (dateObj) { return pad(dateObj.getMinutes()); },
    s: function (dateObj) { return String(dateObj.getSeconds()); },
    ss: function (dateObj) { return pad(dateObj.getSeconds()); },
    S: function (dateObj) {
        return String(Math.round(dateObj.getMilliseconds() / 100));
    },
    SS: function (dateObj) {
        return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
    },
    SSS: function (dateObj) { return pad(dateObj.getMilliseconds(), 3); },
    a: function (dateObj, i18n) {
        return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
    },
    A: function (dateObj, i18n) {
        return dateObj.getHours() < 12
            ? i18n.amPm[0].toUpperCase()
            : i18n.amPm[1].toUpperCase();
    },
    ZZ: function (dateObj) {
        var offset = dateObj.getTimezoneOffset();
        return ((offset > 0 ? "-" : "+") +
            pad(Math.floor(Math.abs(offset) / 60) * 100 + (Math.abs(offset) % 60), 4));
    },
    Z: function (dateObj) {
        var offset = dateObj.getTimezoneOffset();
        return ((offset > 0 ? "-" : "+") +
            pad(Math.floor(Math.abs(offset) / 60), 2) +
            ":" +
            pad(Math.abs(offset) % 60, 2));
    }
};
var monthParse = function (v) { return +v - 1; };
var emptyDigits = [null, twoDigitsOptional];
var emptyWord = [null, word];
var amPm = [
    "isPm",
    word,
    function (v, i18n) {
        var val = v.toLowerCase();
        if (val === i18n.amPm[0]) {
            return 0;
        }
        else if (val === i18n.amPm[1]) {
            return 1;
        }
        return null;
    }
];
var timezoneOffset = [
    "timezoneOffset",
    "[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",
    function (v) {
        var parts = (v + "").match(/([+-]|\d\d)/gi);
        if (parts) {
            var minutes = +parts[1] * 60 + parseInt(parts[2], 10);
            return parts[0] === "+" ? minutes : -minutes;
        }
        return 0;
    }
];
var parseFlags = {
    D: ["day", twoDigitsOptional],
    DD: ["day", twoDigits],
    Do: ["day", twoDigitsOptional + word, function (v) { return parseInt(v, 10); }],
    M: ["month", twoDigitsOptional, monthParse],
    MM: ["month", twoDigits, monthParse],
    YY: [
        "year",
        twoDigits,
        function (v) {
            var now = new Date();
            var cent = +("" + now.getFullYear()).substr(0, 2);
            return +("" + (+v > 68 ? cent - 1 : cent) + v);
        }
    ],
    h: ["hour", twoDigitsOptional, undefined, "isPm"],
    hh: ["hour", twoDigits, undefined, "isPm"],
    H: ["hour", twoDigitsOptional],
    HH: ["hour", twoDigits],
    m: ["minute", twoDigitsOptional],
    mm: ["minute", twoDigits],
    s: ["second", twoDigitsOptional],
    ss: ["second", twoDigits],
    YYYY: ["year", fourDigits],
    S: ["millisecond", "\\d", function (v) { return +v * 100; }],
    SS: ["millisecond", twoDigits, function (v) { return +v * 10; }],
    SSS: ["millisecond", threeDigits],
    d: emptyDigits,
    dd: emptyDigits,
    ddd: emptyWord,
    dddd: emptyWord,
    MMM: ["month", word, monthUpdate("monthNamesShort")],
    MMMM: ["month", word, monthUpdate("monthNames")],
    a: amPm,
    A: amPm,
    ZZ: timezoneOffset,
    Z: timezoneOffset
};
// Some common format strings
var globalMasks = {
    default: "ddd MMM DD YYYY HH:mm:ss",
    shortDate: "M/D/YY",
    mediumDate: "MMM D, YYYY",
    longDate: "MMMM D, YYYY",
    fullDate: "dddd, MMMM D, YYYY",
    isoDate: "YYYY-MM-DD",
    isoDateTime: "YYYY-MM-DDTHH:mm:ssZ",
    shortTime: "HH:mm",
    mediumTime: "HH:mm:ss",
    longTime: "HH:mm:ss.SSS"
};
var setGlobalDateMasks = function (masks) { return assign(globalMasks, masks); };
/***
 * Format a date
 * @method format
 * @param {Date|number} dateObj
 * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
 * @returns {string} Formatted date string
 */
var format = function (dateObj, mask, i18n) {
    if (mask === void 0) { mask = globalMasks["default"]; }
    if (i18n === void 0) { i18n = {}; }
    if (typeof dateObj === "number") {
        dateObj = new Date(dateObj);
    }
    if (Object.prototype.toString.call(dateObj) !== "[object Date]" ||
        isNaN(dateObj.getTime())) {
        throw new Error("Invalid Date pass to format");
    }
    mask = globalMasks[mask] || mask;
    var literals = [];
    // Make literals inactive by replacing them with @@@
    mask = mask.replace(literal, function ($0, $1) {
        literals.push($1);
        return "@@@";
    });
    var combinedI18nSettings = assign(assign({}, globalI18n), i18n);
    // Apply formatting rules
    mask = mask.replace(token, function ($0) {
        return formatFlags[$0](dateObj, combinedI18nSettings);
    });
    // Inline literal values back into the formatted value
    return mask.replace(/@@@/g, function () { return literals.shift(); });
};
/**
 * Parse a date string into a Javascript Date object /
 * @method parse
 * @param {string} dateStr Date string
 * @param {string} format Date parse format
 * @param {i18n} I18nSettingsOptional Full or subset of I18N settings
 * @returns {Date|null} Returns Date object. Returns null what date string is invalid or doesn't match format
 */
function parse(dateStr, format, i18n) {
    if (i18n === void 0) { i18n = {}; }
    if (typeof format !== "string") {
        throw new Error("Invalid format in fecha parse");
    }
    // Check to see if the format is actually a mask
    format = globalMasks[format] || format;
    // Avoid regular expression denial of service, fail early for really long strings
    // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
    if (dateStr.length > 1000) {
        return null;
    }
    // Default to the beginning of the year.
    var today = new Date();
    var dateInfo = {
        year: today.getFullYear(),
        month: 0,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        isPm: null,
        timezoneOffset: null
    };
    var parseInfo = [];
    var literals = [];
    // Replace all the literals with @@@. Hopefully a string that won't exist in the format
    var newFormat = format.replace(literal, function ($0, $1) {
        literals.push(regexEscape($1));
        return "@@@";
    });
    var specifiedFields = {};
    var requiredFields = {};
    // Change every token that we find into the correct regex
    newFormat = regexEscape(newFormat).replace(token, function ($0) {
        var info = parseFlags[$0];
        var field = info[0], regex = info[1], requiredField = info[3];
        // Check if the person has specified the same field twice. This will lead to confusing results.
        if (specifiedFields[field]) {
            throw new Error("Invalid format. " + field + " specified twice in format");
        }
        specifiedFields[field] = true;
        // Check if there are any required fields. For instance, 12 hour time requires AM/PM specified
        if (requiredField) {
            requiredFields[requiredField] = true;
        }
        parseInfo.push(info);
        return "(" + regex + ")";
    });
    // Check all the required fields are present
    Object.keys(requiredFields).forEach(function (field) {
        if (!specifiedFields[field]) {
            throw new Error("Invalid format. " + field + " is required in specified format");
        }
    });
    // Add back all the literals after
    newFormat = newFormat.replace(/@@@/g, function () { return literals.shift(); });
    // Check if the date string matches the format. If it doesn't return null
    var matches = dateStr.match(new RegExp(newFormat, "i"));
    if (!matches) {
        return null;
    }
    var combinedI18nSettings = assign(assign({}, globalI18n), i18n);
    // For each match, call the parser function for that date part
    for (var i = 1; i < matches.length; i++) {
        var _a = parseInfo[i - 1], field = _a[0], parser = _a[2];
        var value = parser
            ? parser(matches[i], combinedI18nSettings)
            : +matches[i];
        // If the parser can't make sense of the value, return null
        if (value == null) {
            return null;
        }
        dateInfo[field] = value;
    }
    if (dateInfo.isPm === 1 && dateInfo.hour != null && +dateInfo.hour !== 12) {
        dateInfo.hour = +dateInfo.hour + 12;
    }
    else if (dateInfo.isPm === 0 && +dateInfo.hour === 12) {
        dateInfo.hour = 0;
    }
    var dateWithoutTZ = new Date(dateInfo.year, dateInfo.month, dateInfo.day, dateInfo.hour, dateInfo.minute, dateInfo.second, dateInfo.millisecond);
    var validateFields = [
        ["month", "getMonth"],
        ["day", "getDate"],
        ["hour", "getHours"],
        ["minute", "getMinutes"],
        ["second", "getSeconds"]
    ];
    for (var i = 0, len = validateFields.length; i < len; i++) {
        // Check to make sure the date field is within the allowed range. Javascript dates allows values
        // outside the allowed range. If the values don't match the value was invalid
        if (specifiedFields[validateFields[i][0]] &&
            dateInfo[validateFields[i][0]] !== dateWithoutTZ[validateFields[i][1]]()) {
            return null;
        }
    }
    if (dateInfo.timezoneOffset == null) {
        return dateWithoutTZ;
    }
    return new Date(Date.UTC(dateInfo.year, dateInfo.month, dateInfo.day, dateInfo.hour, dateInfo.minute - dateInfo.timezoneOffset, dateInfo.second, dateInfo.millisecond));
}
var fecha = {
    format: format,
    parse: parse,
    defaultI18n: defaultI18n,
    setGlobalDateI18n: setGlobalDateI18n,
    setGlobalDateMasks: setGlobalDateMasks
};
//# sourceMappingURL=fecha.js.map

var a=function(){try{(new Date).toLocaleDateString("i");}catch(e){return "RangeError"===e.name}return !1}()?function(e,t){return e.toLocaleDateString(t,{year:"numeric",month:"long",day:"numeric"})}:function(t){return fecha.format(t,"mediumDate")},r=function(){try{(new Date).toLocaleString("i");}catch(e){return "RangeError"===e.name}return !1}()?function(e,t){return e.toLocaleString(t,{year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"2-digit"})}:function(t){return fecha.format(t,"haDateTime")},n=function(){try{(new Date).toLocaleTimeString("i");}catch(e){return "RangeError"===e.name}return !1}()?function(e,t){return e.toLocaleTimeString(t,{hour:"numeric",minute:"2-digit"})}:function(t){return fecha.format(t,"shortTime")};function d(e){return e.substr(0,e.indexOf("."))}function v(e){return d(e.entity_id)}function b(e,t,s){if("unknown"===t.state||"unavailable"===t.state)return e("state.default."+t.state);if(t.attributes.unit_of_measurement)return t.state+" "+t.attributes.unit_of_measurement;var i=v(t);if("input_datetime"===i){var o;if(!t.attributes.has_time)return o=new Date(t.attributes.year,t.attributes.month-1,t.attributes.day),a(o,s);if(!t.attributes.has_date){var c=new Date;return o=new Date(c.getFullYear(),c.getMonth(),c.getDay(),t.attributes.hour,t.attributes.minute),n(o,s)}return o=new Date(t.attributes.year,t.attributes.month-1,t.attributes.day,t.attributes.hour,t.attributes.minute),r(o,s)}return t.attributes.device_class&&e("component."+i+".state."+t.attributes.device_class+"."+t.state)||e("component."+i+".state._."+t.state)||t.state}var _="hass:bookmark",D=["closed","locked","off"],C=function(e,t,a,r){r=r||{},a=null==a?{}:a;var n=new Event(t,{bubbles:void 0===r.bubbles||r.bubbles,cancelable:Boolean(r.cancelable),composed:void 0===r.composed||r.composed});return n.detail=a,e.dispatchEvent(n),n},N={alert:"hass:alert",automation:"hass:playlist-play",calendar:"hass:calendar",camera:"hass:video",climate:"hass:thermostat",configurator:"hass:settings",conversation:"hass:text-to-speech",device_tracker:"hass:account",fan:"hass:fan",group:"hass:google-circles-communities",history_graph:"hass:chart-line",homeassistant:"hass:home-assistant",homekit:"hass:home-automation",image_processing:"hass:image-filter-frames",input_boolean:"hass:drawing",input_datetime:"hass:calendar-clock",input_number:"hass:ray-vertex",input_select:"hass:format-list-bulleted",input_text:"hass:textbox",light:"hass:lightbulb",mailbox:"hass:mailbox",notify:"hass:comment-alert",person:"hass:account",plant:"hass:flower",proximity:"hass:apple-safari",remote:"hass:remote",scene:"hass:google-pages",script:"hass:file-document",sensor:"hass:eye",simple_alarm:"hass:bell",sun:"hass:white-balance-sunny",switch:"hass:flash",timer:"hass:timer",updater:"hass:cloud-upload",vacuum:"hass:robot-vacuum",water_heater:"hass:thermometer",weblink:"hass:open-in-new"};function O(e,t){if(e in N)return N[e];switch(e){case"alarm_control_panel":switch(t){case"armed_home":return "hass:bell-plus";case"armed_night":return "hass:bell-sleep";case"disarmed":return "hass:bell-outline";case"triggered":return "hass:bell-ring";default:return "hass:bell"}case"binary_sensor":return t&&"off"===t?"hass:radiobox-blank":"hass:checkbox-marked-circle";case"cover":return "closed"===t?"hass:window-closed":"hass:window-open";case"lock":return t&&"unlocked"===t?"hass:lock-open":"hass:lock";case"media_player":return t&&"off"!==t&&"idle"!==t?"hass:cast-connected":"hass:cast";case"zwave":switch(t){case"dead":return "hass:emoticon-dead";case"sleeping":return "hass:sleep";case"initializing":return "hass:timer-sand";default:return "hass:z-wave"}default:return console.warn("Unable to find icon for domain "+e+" ("+t+")"),_}}var z=function(e){C(window,"haptic",e);},F=function(e,t,a){void 0===a&&(a=!1),a?history.replaceState(null,"",t):history.pushState(null,"",t),C(window,"location-changed",{replace:a});},I=function(e,t,a){void 0===a&&(a=!0);var r,n=d(t),s="group"===n?"homeassistant":n;switch(n){case"lock":r=a?"unlock":"lock";break;case"cover":r=a?"open_cover":"close_cover";break;default:r=a?"turn_on":"turn_off";}return e.callService(s,r,{entity_id:t})},B=function(e,t){var a=D.includes(e.states[t].state);return I(e,t,a)};//# sourceMappingURL=index.m.js.map

function bound01(n, max) {
    if (isOnePointZero(n)) {
        n = '100%';
    }
    var processPercent = isPercentage(n);
    n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
    if (processPercent) {
        n = parseInt(String(n * max), 10) / 100;
    }
    if (Math.abs(n - max) < 0.000001) {
        return 1;
    }
    if (max === 360) {
        n = (n < 0 ? (n % max) + max : n % max) / parseFloat(String(max));
    }
    else {
        n = (n % max) / parseFloat(String(max));
    }
    return n;
}
function clamp01(val) {
    return Math.min(1, Math.max(0, val));
}
function isOnePointZero(n) {
    return typeof n === 'string' && n.includes('.') && parseFloat(n) === 1;
}
function isPercentage(n) {
    return typeof n === 'string' && n.includes('%');
}
function boundAlpha(a) {
    a = parseFloat(a);
    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }
    return a;
}
function convertToPercentage(n) {
    if (n <= 1) {
        return Number(n) * 100 + "%";
    }
    return n;
}
function pad2(c) {
    return c.length === 1 ? '0' + c : String(c);
}

function rgbToRgb(r, g, b) {
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255,
    };
}
function rgbToHsl(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var s = 0;
    var l = (max + min) / 2;
    if (max === min) {
        s = 0;
        h = 0;
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = ((g - b) / d) + (g < b ? 6 : 0);
                break;
            case g:
                h = ((b - r) / d) + 2;
                break;
            case b:
                h = ((r - g) / d) + 4;
                break;
        }
        h /= 6;
    }
    return { h: h, s: s, l: l };
}
function hue2rgb(p, q, t) {
    if (t < 0) {
        t += 1;
    }
    if (t > 1) {
        t -= 1;
    }
    if (t < 1 / 6) {
        return p + ((q - p) * (6 * t));
    }
    if (t < 1 / 2) {
        return q;
    }
    if (t < 2 / 3) {
        return p + ((q - p) * ((2 / 3) - t) * 6);
    }
    return p;
}
function hslToRgb(h, s, l) {
    var r;
    var g;
    var b;
    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);
    if (s === 0) {
        g = l;
        b = l;
        r = l;
    }
    else {
        var q = l < 0.5 ? (l * (1 + s)) : (l + s - (l * s));
        var p = (2 * l) - q;
        r = hue2rgb(p, q, h + (1 / 3));
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - (1 / 3));
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
}
function rgbToHsv(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var v = max;
    var d = max - min;
    var s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0;
    }
    else {
        switch (max) {
            case r:
                h = ((g - b) / d) + (g < b ? 6 : 0);
                break;
            case g:
                h = ((b - r) / d) + 2;
                break;
            case b:
                h = ((r - g) / d) + 4;
                break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}
function hsvToRgb(h, s, v) {
    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);
    var i = Math.floor(h);
    var f = h - i;
    var p = v * (1 - s);
    var q = v * (1 - (f * s));
    var t = v * (1 - ((1 - f) * s));
    var mod = i % 6;
    var r = [v, q, p, p, t, v][mod];
    var g = [t, v, v, q, p, p][mod];
    var b = [p, p, t, v, v, q][mod];
    return { r: r * 255, g: g * 255, b: b * 255 };
}
function rgbToHex(r, g, b, allow3Char) {
    var hex = [
        pad2(Math.round(r).toString(16)),
        pad2(Math.round(g).toString(16)),
        pad2(Math.round(b).toString(16)),
    ];
    if (allow3Char &&
        hex[0].startsWith(hex[0].charAt(1)) &&
        hex[1].startsWith(hex[1].charAt(1)) &&
        hex[2].startsWith(hex[2].charAt(1))) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }
    return hex.join('');
}
function rgbaToHex(r, g, b, a, allow4Char) {
    var hex = [
        pad2(Math.round(r).toString(16)),
        pad2(Math.round(g).toString(16)),
        pad2(Math.round(b).toString(16)),
        pad2(convertDecimalToHex(a)),
    ];
    if (allow4Char &&
        hex[0].startsWith(hex[0].charAt(1)) &&
        hex[1].startsWith(hex[1].charAt(1)) &&
        hex[2].startsWith(hex[2].charAt(1)) &&
        hex[3].startsWith(hex[3].charAt(1))) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }
    return hex.join('');
}
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
function convertHexToDecimal(h) {
    return parseIntFromHex(h) / 255;
}
function parseIntFromHex(val) {
    return parseInt(val, 16);
}

var names = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkgrey: '#a9a9a9',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    grey: '#808080',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32',
};

function inputToRGB(color) {
    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;
    if (typeof color === 'string') {
        color = stringInputToObject(color);
    }
    if (typeof color === 'object') {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === '%' ? 'prgb' : 'rgb';
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = 'hsv';
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = 'hsl';
        }
        if (Object.prototype.hasOwnProperty.call(color, 'a')) {
            a = color.a;
        }
    }
    a = boundAlpha(a);
    return {
        ok: ok,
        format: color.format || format,
        r: Math.min(255, Math.max(rgb.r, 0)),
        g: Math.min(255, Math.max(rgb.g, 0)),
        b: Math.min(255, Math.max(rgb.b, 0)),
        a: a,
    };
}
var CSS_INTEGER = '[-\\+]?\\d+%?';
var CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
var matchers = {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp('rgb' + PERMISSIVE_MATCH3),
    rgba: new RegExp('rgba' + PERMISSIVE_MATCH4),
    hsl: new RegExp('hsl' + PERMISSIVE_MATCH3),
    hsla: new RegExp('hsla' + PERMISSIVE_MATCH4),
    hsv: new RegExp('hsv' + PERMISSIVE_MATCH3),
    hsva: new RegExp('hsva' + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
};
function stringInputToObject(color) {
    color = color.trim().toLowerCase();
    if (color.length === 0) {
        return false;
    }
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color === 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: 'name' };
    }
    var match = matchers.rgb.exec(color);
    if (match) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    match = matchers.rgba.exec(color);
    if (match) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    match = matchers.hsl.exec(color);
    if (match) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    match = matchers.hsla.exec(color);
    if (match) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    match = matchers.hsv.exec(color);
    if (match) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    match = matchers.hsva.exec(color);
    if (match) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    match = matchers.hex8.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? 'name' : 'hex8',
        };
    }
    match = matchers.hex6.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? 'name' : 'hex',
        };
    }
    match = matchers.hex4.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1] + match[1]),
            g: parseIntFromHex(match[2] + match[2]),
            b: parseIntFromHex(match[3] + match[3]),
            a: convertHexToDecimal(match[4] + match[4]),
            format: named ? 'name' : 'hex8',
        };
    }
    match = matchers.hex3.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1] + match[1]),
            g: parseIntFromHex(match[2] + match[2]),
            b: parseIntFromHex(match[3] + match[3]),
            format: named ? 'name' : 'hex',
        };
    }
    return false;
}
function isValidCSSUnit(color) {
    return Boolean(matchers.CSS_UNIT.exec(String(color)));
}

var TinyColor = (function () {
    function TinyColor(color, opts) {
        if (color === void 0) { color = ''; }
        if (opts === void 0) { opts = {}; }
        var _a;
        if (color instanceof TinyColor) {
            return color;
        }
        this.originalInput = color;
        var rgb = inputToRGB(color);
        this.originalInput = color;
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
        this.a = rgb.a;
        this.roundA = Math.round(100 * this.a) / 100;
        this.format = (_a = opts.format, (_a !== null && _a !== void 0 ? _a : rgb.format));
        this.gradientType = opts.gradientType;
        if (this.r < 1) {
            this.r = Math.round(this.r);
        }
        if (this.g < 1) {
            this.g = Math.round(this.g);
        }
        if (this.b < 1) {
            this.b = Math.round(this.b);
        }
        this.isValid = rgb.ok;
    }
    TinyColor.prototype.isDark = function () {
        return this.getBrightness() < 128;
    };
    TinyColor.prototype.isLight = function () {
        return !this.isDark();
    };
    TinyColor.prototype.getBrightness = function () {
        var rgb = this.toRgb();
        return ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
    };
    TinyColor.prototype.getLuminance = function () {
        var rgb = this.toRgb();
        var R;
        var G;
        var B;
        var RsRGB = rgb.r / 255;
        var GsRGB = rgb.g / 255;
        var BsRGB = rgb.b / 255;
        if (RsRGB <= 0.03928) {
            R = RsRGB / 12.92;
        }
        else {
            R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
        }
        if (GsRGB <= 0.03928) {
            G = GsRGB / 12.92;
        }
        else {
            G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
        }
        if (BsRGB <= 0.03928) {
            B = BsRGB / 12.92;
        }
        else {
            B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
        }
        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    };
    TinyColor.prototype.getAlpha = function () {
        return this.a;
    };
    TinyColor.prototype.setAlpha = function (alpha) {
        this.a = boundAlpha(alpha);
        this.roundA = Math.round(100 * this.a) / 100;
        return this;
    };
    TinyColor.prototype.toHsv = function () {
        var hsv = rgbToHsv(this.r, this.g, this.b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
    };
    TinyColor.prototype.toHsvString = function () {
        var hsv = rgbToHsv(this.r, this.g, this.b);
        var h = Math.round(hsv.h * 360);
        var s = Math.round(hsv.s * 100);
        var v = Math.round(hsv.v * 100);
        return this.a === 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this.roundA + ")";
    };
    TinyColor.prototype.toHsl = function () {
        var hsl = rgbToHsl(this.r, this.g, this.b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
    };
    TinyColor.prototype.toHslString = function () {
        var hsl = rgbToHsl(this.r, this.g, this.b);
        var h = Math.round(hsl.h * 360);
        var s = Math.round(hsl.s * 100);
        var l = Math.round(hsl.l * 100);
        return this.a === 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this.roundA + ")";
    };
    TinyColor.prototype.toHex = function (allow3Char) {
        if (allow3Char === void 0) { allow3Char = false; }
        return rgbToHex(this.r, this.g, this.b, allow3Char);
    };
    TinyColor.prototype.toHexString = function (allow3Char) {
        if (allow3Char === void 0) { allow3Char = false; }
        return '#' + this.toHex(allow3Char);
    };
    TinyColor.prototype.toHex8 = function (allow4Char) {
        if (allow4Char === void 0) { allow4Char = false; }
        return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
    };
    TinyColor.prototype.toHex8String = function (allow4Char) {
        if (allow4Char === void 0) { allow4Char = false; }
        return '#' + this.toHex8(allow4Char);
    };
    TinyColor.prototype.toRgb = function () {
        return {
            r: Math.round(this.r),
            g: Math.round(this.g),
            b: Math.round(this.b),
            a: this.a,
        };
    };
    TinyColor.prototype.toRgbString = function () {
        var r = Math.round(this.r);
        var g = Math.round(this.g);
        var b = Math.round(this.b);
        return this.a === 1 ? "rgb(" + r + ", " + g + ", " + b + ")" : "rgba(" + r + ", " + g + ", " + b + ", " + this.roundA + ")";
    };
    TinyColor.prototype.toPercentageRgb = function () {
        var fmt = function (x) { return Math.round(bound01(x, 255) * 100) + "%"; };
        return {
            r: fmt(this.r),
            g: fmt(this.g),
            b: fmt(this.b),
            a: this.a,
        };
    };
    TinyColor.prototype.toPercentageRgbString = function () {
        var rnd = function (x) { return Math.round(bound01(x, 255) * 100); };
        return this.a === 1 ?
            "rgb(" + rnd(this.r) + "%, " + rnd(this.g) + "%, " + rnd(this.b) + "%)" :
            "rgba(" + rnd(this.r) + "%, " + rnd(this.g) + "%, " + rnd(this.b) + "%, " + this.roundA + ")";
    };
    TinyColor.prototype.toName = function () {
        if (this.a === 0) {
            return 'transparent';
        }
        if (this.a < 1) {
            return false;
        }
        var hex = '#' + rgbToHex(this.r, this.g, this.b, false);
        for (var _i = 0, _a = Object.keys(names); _i < _a.length; _i++) {
            var key = _a[_i];
            if (names[key] === hex) {
                return key;
            }
        }
        return false;
    };
    TinyColor.prototype.toString = function (format) {
        var formatSet = Boolean(format);
        format = (format !== null && format !== void 0 ? format : this.format);
        var formattedString = false;
        var hasAlpha = this.a < 1 && this.a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith('hex') || format === 'name');
        if (needsAlphaFormat) {
            if (format === 'name' && this.a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === 'rgb') {
            formattedString = this.toRgbString();
        }
        if (format === 'prgb') {
            formattedString = this.toPercentageRgbString();
        }
        if (format === 'hex' || format === 'hex6') {
            formattedString = this.toHexString();
        }
        if (format === 'hex3') {
            formattedString = this.toHexString(true);
        }
        if (format === 'hex4') {
            formattedString = this.toHex8String(true);
        }
        if (format === 'hex8') {
            formattedString = this.toHex8String();
        }
        if (format === 'name') {
            formattedString = this.toName();
        }
        if (format === 'hsl') {
            formattedString = this.toHslString();
        }
        if (format === 'hsv') {
            formattedString = this.toHsvString();
        }
        return formattedString || this.toHexString();
    };
    TinyColor.prototype.clone = function () {
        return new TinyColor(this.toString());
    };
    TinyColor.prototype.lighten = function (amount) {
        if (amount === void 0) { amount = 10; }
        var hsl = this.toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return new TinyColor(hsl);
    };
    TinyColor.prototype.brighten = function (amount) {
        if (amount === void 0) { amount = 10; }
        var rgb = this.toRgb();
        rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
        rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
        rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
        return new TinyColor(rgb);
    };
    TinyColor.prototype.darken = function (amount) {
        if (amount === void 0) { amount = 10; }
        var hsl = this.toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return new TinyColor(hsl);
    };
    TinyColor.prototype.tint = function (amount) {
        if (amount === void 0) { amount = 10; }
        return this.mix('white', amount);
    };
    TinyColor.prototype.shade = function (amount) {
        if (amount === void 0) { amount = 10; }
        return this.mix('black', amount);
    };
    TinyColor.prototype.desaturate = function (amount) {
        if (amount === void 0) { amount = 10; }
        var hsl = this.toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return new TinyColor(hsl);
    };
    TinyColor.prototype.saturate = function (amount) {
        if (amount === void 0) { amount = 10; }
        var hsl = this.toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return new TinyColor(hsl);
    };
    TinyColor.prototype.greyscale = function () {
        return this.desaturate(100);
    };
    TinyColor.prototype.spin = function (amount) {
        var hsl = this.toHsl();
        var hue = (hsl.h + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return new TinyColor(hsl);
    };
    TinyColor.prototype.mix = function (color, amount) {
        if (amount === void 0) { amount = 50; }
        var rgb1 = this.toRgb();
        var rgb2 = new TinyColor(color).toRgb();
        var p = amount / 100;
        var rgba = {
            r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
            g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
            b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
            a: ((rgb2.a - rgb1.a) * p) + rgb1.a,
        };
        return new TinyColor(rgba);
    };
    TinyColor.prototype.analogous = function (results, slices) {
        if (results === void 0) { results = 6; }
        if (slices === void 0) { slices = 30; }
        var hsl = this.toHsl();
        var part = 360 / slices;
        var ret = [this];
        for (hsl.h = (hsl.h - ((part * results) >> 1) + 720) % 360; --results;) {
            hsl.h = (hsl.h + part) % 360;
            ret.push(new TinyColor(hsl));
        }
        return ret;
    };
    TinyColor.prototype.complement = function () {
        var hsl = this.toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return new TinyColor(hsl);
    };
    TinyColor.prototype.monochromatic = function (results) {
        if (results === void 0) { results = 6; }
        var hsv = this.toHsv();
        var h = hsv.h;
        var s = hsv.s;
        var v = hsv.v;
        var res = [];
        var modification = 1 / results;
        while (results--) {
            res.push(new TinyColor({ h: h, s: s, v: v }));
            v = (v + modification) % 1;
        }
        return res;
    };
    TinyColor.prototype.splitcomplement = function () {
        var hsl = this.toHsl();
        var h = hsl.h;
        return [
            this,
            new TinyColor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
            new TinyColor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l }),
        ];
    };
    TinyColor.prototype.triad = function () {
        return this.polyad(3);
    };
    TinyColor.prototype.tetrad = function () {
        return this.polyad(4);
    };
    TinyColor.prototype.polyad = function (n) {
        var hsl = this.toHsl();
        var h = hsl.h;
        var result = [this];
        var increment = 360 / n;
        for (var i = 1; i < n; i++) {
            result.push(new TinyColor({ h: (h + (i * increment)) % 360, s: hsl.s, l: hsl.l }));
        }
        return result;
    };
    TinyColor.prototype.equals = function (color) {
        return this.toRgbString() === new TinyColor(color).toRgbString();
    };
    return TinyColor;
}());
function tinycolor(color, opts) {
    if (color === void 0) { color = ''; }
    if (opts === void 0) { opts = {}; }
    return new TinyColor(color, opts);
}

const LitElement = customElements.get('home-assistant-main')
  ? Object.getPrototypeOf(customElements.get('home-assistant-main'))
  : Object.getPrototypeOf(customElements.get('hui-view'));

const html = LitElement.prototype.html;

const css = LitElement.prototype.css;

function hass() {
  if(document.querySelector('hc-main'))
    return document.querySelector('hc-main').hass;

  if(document.querySelector('home-assistant'))
    return document.querySelector('home-assistant').hass;

  return undefined;
}
function provideHass(element) {
  if(document.querySelector('hc-main'))
    return document.querySelector('hc-main').provideHass(element);

  if(document.querySelector('home-assistant'))
    return document.querySelector("home-assistant").provideHass(element);

  return undefined;
}
function lovelace_view() {
  var root = document.querySelector("hc-main");
  if(root) {
    root = root && root.shadowRoot;
    root = root && root.querySelector("hc-lovelace");
    root = root && root.shadowRoot;
    root = root && root.querySelector("hui-view") || root.querySelector("hui-panel-view");
    return root;
  }

  root = document.querySelector("home-assistant");
  root = root && root.shadowRoot;
  root = root && root.querySelector("home-assistant-main");
  root = root && root.shadowRoot;
  root = root && root.querySelector("app-drawer-layout partial-panel-resolver");
  root = root && root.shadowRoot || root;
  root = root && root.querySelector("ha-panel-lovelace");
  root = root && root.shadowRoot;
  root = root && root.querySelector("hui-root");
  root = root && root.shadowRoot;
  root = root && root.querySelector("ha-app-layout");
  root = root && root.querySelector("#view");
  root = root && root.firstElementChild;
  return root;
}

async function load_lovelace() {
  if(customElements.get("hui-view")) return true;

  await customElements.whenDefined("partial-panel-resolver");
  const ppr = document.createElement("partial-panel-resolver");
  ppr.hass = {panels: [{
    url_path: "tmp",
    "component_name": "lovelace",
  }]};
  ppr._updateRoutes();
  await ppr.routerOptions.routes.tmp.load();
  if(!customElements.get("ha-panel-lovelace")) return false;
  const p = document.createElement("ha-panel-lovelace");
  p.hass = hass();
  if(p.hass === undefined) {
    await new Promise(resolve => {
      window.addEventListener('connection-status', (ev) => {
        console.log(ev);
        resolve();
      }, {once: true});
    });
    p.hass = hass();
  }
  p.panel = {config: {mode: null}};
  p._fetchConfig();
  return true;
}

function fireEvent(ev, detail, entity=null) {
  ev = new Event(ev, {
    bubbles: true,
    cancelable: false,
    composed: true,
  });
  ev.detail = detail || {};
  if(entity) {
    entity.dispatchEvent(ev);
  } else {
    var root = lovelace_view();
    if (root) root.dispatchEvent(ev);
  }
}

function moreInfo(entity, large=false) {
  const root = document.querySelector("hc-main") || document.querySelector("home-assistant");
  fireEvent("hass-more-info", {entityId: entity}, root);
  const el = root._moreInfoEl;
  el.large = large;
  return el;
}

function _deviceID() {
  const ID_STORAGE_KEY = 'lovelace-player-device-id';
  if(window['fully'] && typeof fully.getDeviceId === "function")
    return fully.getDeviceId();
  if(!localStorage[ID_STORAGE_KEY])
  {
    const s4 = () => {
      return Math.floor((1+Math.random())*100000).toString(16).substring(1);
    };
    localStorage[ID_STORAGE_KEY] = `${s4()}${s4()}-${s4()}${s4()}`;
  }
  return localStorage[ID_STORAGE_KEY];
}
let deviceID = _deviceID();

async function parseTemplate(hass, str, specialData = {}) {
  if (!hass) hass = hass();
  if (typeof(specialData === "string")) specialData = {};
    specialData = Object.assign({
      user: hass.user.name,
      browser: deviceID,
      hash: location.hash.substr(1) || ' ',
    },
    specialData);

    for (var k in specialData) {
      var re = new RegExp(`\\{${k}\\}`, "g");
      str = str.replace(re, specialData[k]);
    }

    return hass.callApi("POST", "template", {template: str});
}

const CUSTOM_TYPE_PREFIX = "custom:";

let helpers = window.cardHelpers;
const helperPromise = new Promise(async (resolve, reject) => {
  if(helpers) resolve();

  const updateHelpers = async () => {
    helpers = await window.loadCardHelpers();
    window.cardHelpers = helpers;
    resolve();
  };

  if(window.loadCardHelpers) {
    updateHelpers();
  } else {
    // If loadCardHelpers didn't exist, force load lovelace and try once more.
    window.addEventListener("load", async () => {
      load_lovelace();
      if(window.loadCardHelpers) {
        updateHelpers();
      }
    });
  }
});

function errorElement(error, origConfig) {
  const cfg = {
    type: "error",
    error,
    origConfig,
  };
  const el = document.createElement("hui-error-card");
  customElements.whenDefined("hui-error-card").then(() => {
    const newel = document.createElement("hui-error-card");
    newel.setConfig(cfg);
    if(el.parentElement)
      el.parentElement.replaceChild(newel, el);
  });
  helperPromise.then(() => {
    fireEvent("ll-rebuild", {}, el);
  });
  return el;
}

function _createElement(tag, config) {
  let el = document.createElement(tag);
  try {
    el.setConfig(JSON.parse(JSON.stringify(config)));
  } catch (err) {
    el = errorElement(err, config);
  }
  helperPromise.then(() => {
    fireEvent("ll-rebuild", {}, el);
  });
  return el;
}

function createLovelaceElement(thing, config) {
  if(!config || typeof config !== "object" || !config.type)
    return errorElement(`No ${thing} type configured`, config);

  let tag = config.type;
  if(tag.startsWith(CUSTOM_TYPE_PREFIX))
    tag = tag.substr(CUSTOM_TYPE_PREFIX.length);
  else
    tag = `hui-${tag}-${thing}`;

  if(customElements.get(tag))
    return _createElement(tag, config);

  const el = errorElement(`Custom element doesn't exist: ${tag}.`, config);
  el.style.display = "None";

  const timer = setTimeout(() => {
    el.style.display = "";
  }, 2000);

  customElements.whenDefined(tag).then(() => {
    clearTimeout(timer);
    fireEvent("ll-rebuild", {}, el);
  });

  return el;
}

function createCard(config) {
  if(helpers) return helpers.createCardElement(config);
  return createLovelaceElement('card', config);
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var hammer = createCommonjsModule(function (module) {
/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined$1) {

var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined$1) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * wrap a method with a deprecation warning and stack trace
 * @param {Function} method
 * @param {String} name
 * @param {String} message
 * @returns {Function} A new function wrapping the supplied method.
 */
function deprecate(method, name, message) {
    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
    return function() {
        var e = new Error('get-stack-trace');
        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

        var log = window.console && (window.console.warn || window.console.log);
        if (log) {
            log.call(window.console, deprecationMessage, stack);
        }
        return method.apply(this, arguments);
    };
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} target
 * @param {...Object} objects_to_assign
 * @returns {Object} target
 */
var assign;
if (typeof Object.assign !== 'function') {
    assign = function assign(target) {
        if (target === undefined$1 || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined$1 && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };
} else {
    assign = Object.assign;
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge=false]
 * @returns {Object} dest
 */
var extend = deprecate(function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined$1)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}, 'extend', 'Use `assign`.');

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
var merge = deprecate(function merge(dest, src) {
    return extend(dest, src, true);
}, 'merge', 'Use `assign`.');

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        assign(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined$1 : undefined$1, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined$1) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined$1;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined$1;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined$1)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down
        if (!this.pressed) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent && !window.PointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */

var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;

function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);

    this.primaryTouch = null;
    this.lastTouches = [];
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
        }

        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
        if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
    }
}

function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];

    if (touch.identifier === this.primaryTouch) {
        var lastTouch = {x: touch.clientX, y: touch.clientY};
        this.lastTouches.push(lastTouch);
        var lts = this.lastTouches;
        var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
                lts.splice(i, 1);
            }
        };
        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    }
}

function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
    for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
        }
    }
    return false;
}

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined$1;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';
var TOUCH_ACTION_MAP = getTouchActionProps();

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

        if (hasNone) {
            //do not prevent defaults if this is a tap gesture

            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;

            if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
            }
        }

        if (hasPanX && hasPanY) {
            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
            return;
        }

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // if both pan-x and pan-y are set (different recognizers
    // for different directions, e.g. horizontal pan but vertical swipe?)
    // we need none (as otherwise with pan-x pan-y combined none of these
    // recognizers will work, since the browser would handle all panning
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
        return false;
    }
    var touchMap = {};
    var cssSupports = window.CSS && window.CSS.supports;
    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

        // If css.supports is not supported but there is native touch-action assume it supports
        // all values. This is the case for IE 10 and 11.
        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
    });
    return touchMap;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        assign(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(event) {
            self.manager.emit(event, input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }

        emit(self.options.event); // simple 'eventName' events

        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
            emit(input.additionalEvent);
        }

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = assign({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {

        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);

        if (direction) {
            input.additionalEvent = this.options.event + direction;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            input.additionalEvent = this.options.event + inOut;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 251, // minimal time of the pointer to be pressed
        threshold: 9 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.3,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.offsetDirection &&
            input.distance > this.options.threshold &&
            input.maxPointers == this.options.pointers &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.offsetDirection);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 9, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create a manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.7';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, {enable: false}],
        [PinchRecognizer, {enable: false}, ['rotate']],
        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});

    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(this.options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        assign(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        recognizer = this.get(recognizer);

        // let's make sure this recognizer exists
        if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);

            if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
            }
        }

        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        if (events === undefined$1) {
            return;
        }
        if (handler === undefined$1) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        if (events === undefined$1) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    if (!element.style) {
        return;
    }
    var prop;
    each(manager.options.cssProps, function(value, name) {
        prop = prefixed(element.style, name);
        if (add) {
            manager.oldCssProps[prop] = element.style[prop];
            element.style[prop] = value;
        } else {
            element.style[prop] = manager.oldCssProps[prop] || '';
        }
    });
    if (!add) {
        manager.oldCssProps = {};
    }
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

assign(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    assign: assign,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

// this prevents errors when Hammer is loaded in the presence of an AMD
//  style loader but by script tag, not by the loader.
var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
freeGlobal.Hammer = Hammer;

if (typeof undefined$1 === 'function' && undefined$1.amd) {
    undefined$1(function() {
        return Hammer;
    });
} else if ( module.exports) {
    module.exports = Hammer;
} else {
    window[exportName] = Hammer;
}

})(window, document, 'Hammer');
});

class HomeKitCard extends LitElement {
    constructor() {
        super(...arguments);
        this.renderedRules = [];
        this.doubleTapped = false;
        this.tileHoldAnimation = false;
        this.useTemperature = false;
        this.useBrightness = false;
        this.CUSTOM_TYPE_PREFIX = "custom:";
    }
    static get properties() {
        return {
            hass: {},
            config: {}
        };
    }
    setConfig(config) {
        if (!config.entities && !config.rows) {
            throw new Error("You need to define entities: or rows:");
        }
        if (!config.entities && config.rows && !config.enableColumns) {
            throw new Error("If you use rows and columns you need to set enableColumns: true");
        }
        this.config = config;
        this.useTemperature = "useTemperature" in this.config ? this.config.useTemperature : false;
        this.useBrightness = "useBrightness" in this.config ? this.config.useBrightness : true;
        this.rowTitleColor = this.config.titleColor ? this.config.titleColor : false;
        this.horizontalScroll = "horizontalScroll" in this.config ? this.config.fullscreen : false;
        this.enableColumns = "enableColumns" in this.config ? this.config.enableColumns : false;
        this.statePositionTop = "statePositionTop" in this.config ? this.config.statePositionTop : false;
        this.tileHoldAnimation = "tileHoldAnimation" in this.config ? this.config.tileHoldAnimation : false;
        this.rulesColor = this.config.rulesColor ? this.config.rulesColor : false;
    }
    addHammer(el) {
        var hammer = new Hammer(el, {});
        var $this = this;
        hammer.on("tap doubletap pressup press panmove", function (ev) {
            ev.preventDefault();
            var dataset = ev.target.dataset;
            var ent = JSON.parse(dataset.ent);
            var row = JSON.parse(dataset.row);
            $this.doubleTapped = false;
            if (ev.type == 'tap') {
                $this.doubleTapped = false;
                var timeoutTime = 200;
                if (!ent.double_tap_action) {
                    timeoutTime = 0;
                }
                setTimeout(function () {
                    if ($this.doubleTapped === false) {
                        ev.target.classList.remove('longpress');
                        $this._handleClick(ev.type, ent, dataset.type, row);
                    }
                }, timeoutTime);
            }
            else {
                if (ev.type == 'doubletap') {
                    $this.doubleTapped = true;
                }
                var dataset = ev.target.dataset;
                if (ev.type == 'press') {
                    ev.target.classList.add('longpress');
                }
                else if (ev.type == 'panmove') {
                    ev.target.classList.remove('longpress');
                }
                else {
                    ev.target.classList.remove('longpress');
                    $this._handleClick(ev.type, ent, dataset.type, row);
                }
            }
        });
    }
    render() {
        return html `
      ${this.config.style ? html `
        <style>
          ${this.config.style}
        </style>
      ` : html ``}
      <div class="container${this.enableColumns ? ' rows' : ''}" >
        ${this.config.home ? html `
            <div class="header">
                ${this.config.title ? html `<h1 style="${this.rowTitleColor ? 'color:' + this.rowTitleColor : ''}">${this.config.title}</h1>` : html ``}
                <ul style="${this.rulesColor ? 'color:' + this.rulesColor : ''}">
                  ${this.renderedRules.map(rule => {
            return html `<li>${rule}</li>`;
        })}
                </ul>
            </div>
        ` : html ``}
       
        ${this.enableColumns ? this._renderRows() : this._renderEntities(this.config.entities)}
      </div>
    `;
    }
    firstUpdated() {
        var myNodelist = this.shadowRoot.querySelectorAll('homekit-button.event');
        for (var i = 0; i < myNodelist.length; i++) {
            this.addHammer(myNodelist[i]);
        }
        this.shadowRoot.querySelectorAll(".card-tile").forEach(customCard => {
            var card = {
                type: customCard.dataset.card
            };
            card = Object.assign({}, card, JSON.parse(customCard.dataset.options));
            const cardElement = createCard(card);
            customCard.appendChild(cardElement);
            provideHass(cardElement);
            let style = "";
            if (customCard.dataset.style) {
                style = customCard.dataset.style;
            }
            else if (customCard.dataset.card == 'custom:mini-graph-card') {
                style = ":host { height: 100%; } ha-card { background: transparent; color: #000; padding: 0!important; box-shadow: none; } .header { padding: 10px 10px 0 10px; } .header .name, .header .name .ellipsis { font-size: 13px!important; font-weight: 500; color: #000; opacity: 1; } .header icon { color: #f7d959; } .states { padding: 0 10px; } .states .state .state__value { font-size: 13px; } .states .state .state__uom { font-size: 13px; margin-top: 0; line-height: normal; } .header .icon { color: #f7d959; }";
            }
            if (style != "") {
                let itterations = 0;
                let interval = setInterval(function () {
                    if (cardElement && cardElement.shadowRoot) {
                        window.clearInterval(interval);
                        var styleElement = document.createElement('style');
                        styleElement.innerHTML = style;
                        cardElement.shadowRoot.appendChild(styleElement);
                    }
                    else if (++itterations === 10) {
                        window.clearInterval(interval);
                    }
                }, 100);
            }
        });
    }
    updated() {
        this._renderRules();
    }
    _renderRows() {
        return html `
      ${this.config.rows.map(row => {
            return html `
          <div class="row">
            ${row.columns.map(column => {
                return html `
                <div class="col${column.tileOnRow ? ' fixed' : ''}" style="${column.tileOnRow ? '--tile-on-row:' + column.tileOnRow : ''}">
                  ${this._renderEntities(column.entities)}
                </div>
              `;
            })}
          </div>
        `;
        })}
    `;
    }
    _renderState(ent, stateObj, offStates, type) {
        if (type == 'light' && (stateObj.attributes.brightness || ent.state)) {
            if (this.statePositionTop) {
                return this._renderCircleState(ent, stateObj, type);
            }
            else {
                return html `
          <span class=" ${offStates.includes(stateObj.state) ? 'value' : 'value on'}">${this._renderStateValue(ent, stateObj, type)}</span>
        `;
            }
        }
        else if ((type == "sensor" || type == "binary_sensor") && (stateObj.last_changed || ent.state)) {
            if (this.statePositionTop) {
                return this._renderCircleState(ent, stateObj, type);
            }
            else {
                return html `
          <span class="previous">${this._renderStateValue(ent, stateObj, type)}</span>
        `;
            }
        }
        else if ((type == "switch" || type == "input_boolean") && ent.state) {
            if (this.statePositionTop) {
                return this._renderCircleState(ent, stateObj, type);
            }
            else {
                return html `
          <span class="value on">${this._renderStateValue(ent, stateObj, type)}</span>
        `;
            }
        }
        else if (type == "climate" && stateObj.attributes.temperature) {
            if (this.statePositionTop) {
                return this._renderCircleState(ent, stateObj, type);
            }
            else {
                return html `
          <span class=" ${offStates.includes(stateObj.state) ? 'value' : 'value on'}">${this._renderStateValue(ent, stateObj, type)}</span>
        `;
            }
        }
        else {
            if (ent.state) {
                if (this.statePositionTop) {
                    return this._renderCircleState(ent, stateObj, type);
                }
                else {
                    return html `
            <span class="value on">${this._renderStateValue(ent, stateObj, type)}</span>
          `;
                }
            }
        }
    }
    _renderCircleState(ent, stateObj, type) {
        return html `
      <svg class="circle-state" viewbox="0 0 100 100" style="${stateObj.attributes.brightness && !ent.state ? '--percentage:' + (stateObj.attributes.brightness / 2.55)
            : ''}">
        <path id="progress" stroke-width="3" stroke="#aaabad" fill="none"
              d="M50 10
                a 40 40 0 0 1 0 80
                a 40 40 0 0 1 0 -80">
        </path>
        <text id="count" x="50" y="50" fill="#7d7e80" text-anchor="middle" dy="7" font-size="20">${this._renderStateValue(ent, stateObj, type)}</text>
      </svg>
    `;
    }
    _renderStateValue(ent, stateObj, type) {
        if (type == 'light') {
            return html `
        ${stateObj.attributes.brightness && !ent.state ? html `${Math.round(stateObj.attributes.brightness / 2.55)}%` : html ``}
        ${ent.state ? html `${b(this.hass.localize, this.hass.states[ent.state], this.hass.language)}` : html ``}
      `;
        }
        else if (type == "sensor" || type == "binary_sensor") {
            return html `
        ${stateObj.last_changed && !ent.state ? html `${this._calculateTime(stateObj.last_changed)}` : html ``}
        ${ent.state ? html `${b(this.hass.localize, this.hass.states[ent.state], this.hass.language)}` : html ``}
      `;
        }
        else if (type == "switch" || type == "input_boolean") {
            return html `
        ${ent.state ? html `${b(this.hass.localize, this.hass.states[ent.state], this.hass.language)}` : html ``}
      `;
        }
        else if (type == "climate") {
            return html `
        ${stateObj.attributes.temperature ? html `${stateObj.attributes.temperature}&#176;` : html ``}
      `;
        }
        else {
            return html `
      ${ent.state ? html `${b(this.hass.localize, this.hass.states[ent.state], this.hass.language)}` : html ``}
      `;
        }
    }
    _evalTemplate(state, func) {
        /* eslint no-new-func: 0 */
        try {
            return new Function('states', 'entity', 'user', 'hass', 'variables', 'html', `'use strict'; ${func}`).call(this, this.hass.states, state, this.hass.user, this.hass, html);
        }
        catch (e) {
            const funcTrimmed = func.length <= 100 ? func.trim() : `${func.trim().substring(0, 98)}...`;
            e.message = `${e.name}: ${e.message} in '${funcTrimmed}'`;
            e.name = 'ButtonCardJSTemplateError';
            throw e;
        }
    }
    _getTemplate(state, value) {
        const trimmed = value.trim();
        if (trimmed.substring(0, 3) === '[[[' && trimmed.slice(-3) === ']]]') {
            return this._evalTemplate(state, trimmed.slice(3, -3));
        }
    }
    _renderEntities(entities) {
        return html `
      ${entities.map(row => {
            var entityCount = 0;
            return html `
            <div class="card-title" style="${this.rowTitleColor ? 'color:' + this.rowTitleColor : ''}">${row.title}</div>
                <div class="homekit-card${this.horizontalScroll === true ? ' scroll' : ''}">
                    ${row.entities.map(ent => {
                if (!ent.card && !ent.custom) {
                    var offStates = ['off', 'unavailable'];
                    if (ent.offStates) {
                        offStates = ent.offStates;
                    }
                    const stateObj = this.hass.states[ent.entity];
                    var color = '#f7d959';
                    if (entityCount == 3) {
                        entityCount = 0;
                    }
                    if (entityCount == 4) {
                        entityCount = 2;
                    }
                    if (ent.color) {
                        color = ent.color;
                    }
                    else {
                        color = this._getColorForLightEntity(stateObj, this.useTemperature, this.useBrightness);
                    }
                    var type = ent.entity.split('.')[0];
                    if (type == "light") {
                        entityCount++;
                        if (!ent.slider) {
                            return stateObj ? html `
                                <homekit-button class="event ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ' size-2' : ''}${ent.higher ? ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                    <div class="button-inner${this.statePositionTop ? ' state-top' : ''}">
                                      <span class="icon${ent.spin === true && !offStates.includes(stateObj.state) ? ' spin' : ''}${ent.image ? ' image' : ''}" style="${!offStates.includes(stateObj.state) ? 'color:' + color + ';' : ''}">

                                        ${ent.image ? html `
                                          <img src="${ent.offImage ? offStates.includes(stateObj.state) ? ent.offImage : ent.image : ent.image}" />
                                        ` : html `
                                          <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || O(d(stateObj.entity_id), stateObj.state)}" class=" ${ent.spin && stateObj.state === "on" ? 'spin' : ""}"/>
                                        `}
                                      </span>
                                      <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                      <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                        ${b(this.hass.localize, stateObj, this.hass.language)}
                                        ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                      </span>
                                      ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </div>
                                </homekit-button>
                              ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                              `
                                : this._notFound(ent);
                        }
                        else {
                            return stateObj ? html `
                                <homekit-button class="event slider ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ' size-2' : ''}${ent.higher ? ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                    <div class="button-inner${this.statePositionTop ? ' state-top' : ''}">
                                      <span class="icon${ent.spin === true && !offStates.includes(stateObj.state) ? ' spin' : ''}${ent.image ? ' image' : ''}" style="${!offStates.includes(stateObj.state) ? 'color:' + color + ';' : ''}">
          
                                        ${ent.image ? html `
                                          <img src="${ent.offImage ? offStates.includes(stateObj.state) ? ent.offImage : ent.image : ent.image}" />
                                        ` : html `
                                          <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || O(d(stateObj.entity_id), stateObj.state)}" class=" ${ent.spin && stateObj.state === "on" ? 'spin' : ""}"/>
                                        `}
                                        
                                      </span>
                                      <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                      <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                        ${b(this.hass.localize, stateObj, this.hass.language)}
                                        ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                      </span>
                                      ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </div>
                                    ${offStates.includes(stateObj.state) ? html `` : html `<input type="range" .value="${stateObj.attributes.brightness / 2.55}" @change=${e => this._setBrightness(stateObj, e.target.value)}>`}
                                </homekit-button>
                              ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                              `
                                : this._notFound(ent);
                        }
                    }
                    else if (type == "sensor" || type == "binary_sensor") {
                        entityCount++;
                        return stateObj ? html `
                              <homekit-button class="event ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ' size-2' : ''}${ent.higher ? ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                  <div class="button-inner${this.statePositionTop ? ' state-top' : ''}">
                                    <span class="${offStates.includes(stateObj.state) ? 'icon' : 'icon on'}${ent.spin === true && !offStates.includes(stateObj.state) ? ' spin' : ''}${ent.image ? ' image' : ''}">
                                      ${ent.image ? html `
                                        <img src="${ent.offImage ? offStates.includes(stateObj.state) ? ent.offImage : ent.image : ent.image}" />
                                      ` : html `
                                        <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || O(d(stateObj.entity_id), stateObj.state)}" />
                                      `}
                                    </span>
                                    <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                      ${b(this.hass.localize, stateObj, this.hass.language)}
                                      ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </span>
                                    ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                          `
                            : this._notFound(ent);
                    }
                    else if (type == "switch" || type == "input_boolean") {
                        entityCount++;
                        return stateObj ? html `
                              <homekit-button class="event ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ' size-2' : ''}${ent.higher ? ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                  <div class="button-inner">
                                    <span class="${offStates.includes(stateObj.state) ? 'icon' : 'icon on'}${ent.spin === true && !offStates.includes(stateObj.state) ? ' spin' : ''}${ent.image ? ' image' : ''}">
                                      ${ent.image ? html `
                                        <img src="${ent.offImage ? offStates.includes(stateObj.state) ? ent.offImage : ent.image : ent.image}" />
                                      ` : html `
                                        <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || O(d(stateObj.entity_id), stateObj.state)}" />
                                      `}
                                    </span>
                                    <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                      ${b(this.hass.localize, stateObj, this.hass.language)}
                                      ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </span>
                                    ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                          `
                            : this._notFound(ent);
                    }
                    else if (type == "weather") {
                        entityCount = entityCount + 2;
                        return stateObj ? html `
                            ${entityCount == 4 ? html `<div class="break"></div>` : html ``}
                              <homekit-button class="event button size-2 on${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                  <div class="button-inner">
                                    <span class="icon on">
                                      <ha-icon icon="${ent.icon || stateObj.attributes.icon || "mdi:weather-" + stateObj.state}" />
                                    </span>
                                    <span class="name on">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="state on">${b(this.hass.localize, stateObj, this.hass.language)}
                                      ${stateObj.attributes.forecast[0] && stateObj.attributes.forecast[0].precipitation ? html `
                                          <span class="value on">${stateObj.attributes.forecast[0].precipitation} ${this._getUnit("precipitation")}</span>
                                      ` : html ``}
                                    </span>
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                          `
                            : this._notFound(ent);
                    }
                    else if (type == "climate") {
                        entityCount++;
                        var modes = {
                            auto: "hass:calendar-repeat",
                            heat_cool: "hass:autorenew",
                            heat: "hass:fire",
                            cool: "hass:snowflake",
                            off: "hass:power",
                            fan_only: "hass:fan",
                            dry: "hass:water-percent",
                        };
                        var mode = '';
                        if (stateObj.state == 'off') {
                            mode = 'off';
                        }
                        else if (stateObj.attributes.hvac_action == 'heating') {
                            mode = 'heat';
                        }
                        else if (stateObj.attributes.hvac_action == 'idle') {
                            mode = 'idle';
                        }
                        else {
                            mode = stateObj.state in modes ? stateObj.state : "unknown-mode";
                        }
                        return stateObj ? html `
                              <homekit-button class="event ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ' size-2' : ''}${ent.higher ? ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                  <div class="button-inner">
                                    <span class="${offStates.includes(stateObj.state) ? 'icon climate ' + mode : 'icon climate on ' + mode}">
                                      ${ent.state ? Math.round(this.hass.states[ent.state].state) : Math.round(stateObj.attributes.current_temperature)}&#176;
                                    </span>
                                    <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                      ${b(this.hass.localize, stateObj, this.hass.language)}
                                      ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </span>
                                    ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                          `
                            : this._notFound(ent);
                    }
                    else {
                        entityCount++;
                        return stateObj ? html `
                              <homekit-button class="event ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ' size-2' : ''}${ent.higher ? ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                  <div class="button-inner">
                                    <span class="${offStates.includes(stateObj.state) ? 'icon' : 'icon on'}${ent.spin === true && !offStates.includes(stateObj.state) ? ' spin' : ''}${ent.image ? ' image' : ''}">
                                      ${ent.image ? html `
                                        <img src="${ent.offImage ? offStates.includes(stateObj.state) ? ent.offImage : ent.image : ent.image}" />
                                      ` : html `
                                        <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || O(d(stateObj.entity_id), stateObj.state)}" />
                                      `}
                                    </span>
                                    <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                      ${b(this.hass.localize, stateObj, this.hass.language)}
                                      ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </span>
                                    ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                          `
                            : this._notFound(ent);
                    }
                }
                else if (ent.card && !ent.custom) {
                    entityCount++;
                    var stateObj = { state: '' };
                    offStates = ['off', 'unavailable'];
                    if (ent.entity) {
                        if (ent.offStates) {
                            offStates = ent.offStates;
                        }
                        stateObj = this.hass.states[ent.entity];
                    }
                    if (ent.tap_action) {
                        return html `
                            <homekit-button class="${ent.entity ? stateObj.state != '' && offStates.includes(stateObj.state) ? 'button' : ' button on' : 'button on'} event${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ' size-2' : ''}${ent.higher ? ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}" data-ent="${JSON.stringify(ent)}" data-type="'card'" data-row="${JSON.stringify(row)}">
                                <div class="button-inner card-tile" data-card="${ent.card}" data-options="${JSON.stringify(ent.cardOptions)}" data-style="${ent.cardStyle ? ent.cardStyle : ''}">
                                </div>
                            </homekit-button>
                          ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                        `;
                    }
                    else {
                        return html `
                              <homekit-button class="${ent.entity ? stateObj.state != '' && offStates.includes(stateObj.state) ? 'button' : ' button on' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ' size-2' : ''}${ent.higher ? ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}">
                                  <div class="button-inner card-tile" data-card="${ent.card}" data-options="${JSON.stringify(ent.cardOptions)}" data-style="${ent.cardStyle ? ent.cardStyle : ''}">
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                          `;
                    }
                }
                else if (ent.custom) {
                    entityCount++;
                    var stateObj = { state: '' };
                    offStates = ['off', 'unavailable'];
                    if (ent.entity) {
                        if (ent.offStates) {
                            offStates = ent.offStates;
                        }
                        stateObj = this.hass.states[ent.entity];
                    }
                    return html `
                          <homekit-button class="${ent.entity ? stateObj.state != '' && offStates.includes(stateObj.state) ? 'button' : ' button on' : 'button on'} event${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ' size-2' : ''}${ent.higher ? ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}" data-ent="${JSON.stringify(ent)}" data-type="'custom'" data-row="${JSON.stringify(row)}">
                              <div class="button-inner">
                                <span class="icon on${ent.spin === true ? ' spin' : ''}${ent.image ? ' image' : ''}">
                                  ${ent.image ? html `
                                    <img src="${ent.image}" />
                                  ` : html `
                                    <ha-icon icon="${ent.icon}" />
                                  `}
                                </span>
                                <span class="name on">${ent.name}</span>
                                ${ent.state ? html `<span class="state">${b(this.hass.localize, this.hass.states[ent.state], this.hass.language)}</span>` : html ``}
                              </div>
                          </homekit-button>
                        ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                        `;
                }
            })}
                </div>
            </div>
        `;
        })}
    `;
    }
    _setBrightness(state, value) {
        this.hass.callService("homeassistant", "turn_on", {
            entity_id: state.entity_id,
            brightness: value * 2.55
        });
    }
    _renderRules() {
        if (this.config.home === true && this.config.rules) {
            parseTemplate(this.hass, this.config.rules).then((c) => {
                if (c) {
                    var result = c.match(/<li>([^]*?)<\/li>/g).map(function (val) {
                        return val.replace(/<\/?li>/g, '');
                    });
                    this.renderedRules = result;
                }
            });
        }
    }
    _calculateTime(lastUpdated) {
        const currentDate = new Date();
        const lastDate = new Date(lastUpdated);
        const diffMs = currentDate.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffMs / 86400000); // days
        const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        const diffSecs = Math.round((((diffMs % 86400000) % 3600000) % 60000) / 1000);
        if (diffDays > 0) {
            return this.statePositionTop ? diffDays + 'd' : diffDays + ' days ago';
        }
        else if (diffHrs > 0) {
            return this.statePositionTop ? diffHrs + 'h' : diffHrs + ' hours ago';
        }
        else if (diffMins > 0) {
            return this.statePositionTop ? diffMins + 'm' : diffMins + ' minutes ago';
        }
        else {
            return this.statePositionTop ? diffSecs + 's' : diffSecs + ' seconds ago';
        }
    }
    _handleClick(action, entity, type, row) {
        var state = null;
        if (entity.entity) {
            state = this.hass.states[entity.entity];
        }
        if ((action == "tap" || action == "doubletap")) {
            if (action == "doubletap" && entity.double_tap_action) {
                this._customAction(entity.double_tap_action, entity, row);
            }
            else if (entity.tap_action) {
                this._customAction(entity.tap_action, entity, row);
            }
            else if (type === "light" || type === "switch" || type === "input_boolean") {
                this._toggle(state, entity.service);
            }
        }
        else if (action == "pressup") {
            if (entity.hold_action) {
                this._customAction(entity.hold_action, entity, row);
            }
            else {
                this._hold(state, entity, row);
            }
        }
    }
    _customAction(tapAction, entity, row) {
        if (tapAction.confirmation) {
            z("warning");
            if (!confirm(tapAction.confirmation.text ||
                `Are you sure you want to ${tapAction.action}?`)) {
                return;
            }
        }
        switch (tapAction.action) {
            case "popup":
                this._createPopup((tapAction.entity || entity.entity), entity, row);
                break;
            case "more-info":
                if (tapAction.entity || tapAction.camera_image) {
                    moreInfo(tapAction.entity ? tapAction.entity : tapAction.camera_image);
                }
                break;
            case "navigate":
                if (tapAction.navigation_path) {
                    F(window, tapAction.navigation_path);
                }
                break;
            case "url":
                if (tapAction.url_path) {
                    window.open(tapAction.url_path);
                }
                break;
            case "toggle":
                if (tapAction.entity) {
                    B(this.hass, tapAction.entity);
                    z("success");
                }
                break;
            case "call-service": {
                if (!tapAction.service) {
                    z("failure");
                    return;
                }
                const [domain, service] = tapAction.service.split(".", 2);
                this.hass.callService(domain, service, tapAction.service_data);
                z("success");
            }
        }
    }
    getCardSize() {
        return 1;
    }
    async _createPopup(entity_id, entity, row) {
        if ((row && row.popup) || entity.popup) {
            if (row.popup) {
                var popUpCard = Object.assign({}, row.popup, { entity: entity_id });
                if (entity.popupExtend) {
                    var popUpCard = Object.assign({}, popUpCard, entity.popupExtend);
                }
            }
            else {
                var popUpCard = Object.assign({}, entity.popup, { entity: entity_id });
            }
            var popUpStyle = {
                '$': ".mdc-dialog .mdc-dialog__container { width: 100%; } .mdc-dialog .mdc-dialog__container .mdc-dialog__surface { width:100%; box-shadow:none; }",
                '.': ":host { --mdc-theme-surface: rgba(0,0,0,0); --secondary-background-color: rgba(0,0,0,0); --ha-card-background: rgba(0,0,0,0); --mdc-dialog-scrim-color: rgba(0,0,0,0.8); --mdc-dialog-min-height: 100%; --mdc-dialog-min-width: 100%; --mdc-dialog-max-width: 100%; } mwc-icon-button { color: #FFF; }"
            };
            var service_data = {
                title: " ",
                style: popUpStyle,
                card: popUpCard,
                deviceID: ['this']
            };
            var result = await this.hass.callService("browser_mod", "popup", service_data);
        }
        else {
            moreInfo(entity_id);
        }
    }
    _toggle(state, service) {
        this.hass.callService("homeassistant", service || "toggle", {
            entity_id: state.entity_id
        });
    }
    _hold(stateObj, entity, row) {
        this._createPopup(stateObj.entity_id, entity, row);
    }
    _getUnit(measure) {
        const lengthUnit = this.hass.config.unit_system.length;
        switch (measure) {
            case "air_pressure":
                return lengthUnit === "km" ? "hPa" : "inHg";
            case "length":
                return lengthUnit;
            case "precipitation":
                return lengthUnit === "km" ? "mm" : "in";
            default:
                return this.hass.config.unit_system[measure] || "";
        }
    }
    _notFound(ent) {
        return html `
        <homekit-button class="not-found">
          <div class="button-inner">
            <span class="name">${ent.entity}</span>
            <span class="state">Not found</span>
          </div>
        </homekit-button>
    `;
    }
    _getColorForLightEntity(stateObj, useTemperature, useBrightness) {
        var color = this.config.default_color ? this.config.default_color : undefined;
        if (stateObj) {
            if (stateObj.attributes.rgb_color) {
                color = `rgb(${stateObj.attributes.rgb_color.join(',')})`;
                if (useBrightness && stateObj.attributes.brightness) {
                    color = this._applyBrightnessToColor(color, (stateObj.attributes.brightness + 245) / 5);
                }
            }
            else if (useTemperature && stateObj.attributes.color_temp && stateObj.attributes.min_mireds && stateObj.attributes.max_mireds) {
                color = this._getLightColorBasedOnTemperature(stateObj.attributes.color_temp, stateObj.attributes.min_mireds, stateObj.attributes.max_mireds);
                if (useBrightness && stateObj.attributes.brightness) {
                    color = this._applyBrightnessToColor(color, (stateObj.attributes.brightness + 245) / 5);
                }
            }
            else if (useBrightness && stateObj.attributes.brightness) {
                color = this._applyBrightnessToColor(this._getDefaultColorForState(), (stateObj.attributes.brightness + 245) / 5);
            }
            else {
                color = this._getDefaultColorForState();
            }
        }
        return color;
    }
    _applyBrightnessToColor(color, brightness) {
        const colorObj = new TinyColor(this._getColorFromVariable(color));
        if (colorObj.isValid) {
            const validColor = colorObj.mix('black', 100 - brightness).toString();
            if (validColor)
                return validColor;
        }
        return color;
    }
    _getLightColorBasedOnTemperature(current, min, max) {
        const high = new TinyColor('rgb(255, 160, 0)'); // orange-ish
        const low = new TinyColor('rgb(166, 209, 255)'); // blue-ish
        const middle = new TinyColor('white');
        const mixAmount = (current - min) / (max - min) * 100;
        if (mixAmount < 50) {
            return tinycolor(low).mix(middle, mixAmount * 2).toRgbString();
        }
        else {
            return tinycolor(middle).mix(high, (mixAmount - 50) * 2).toRgbString();
        }
    }
    _getDefaultColorForState() {
        return this.config.color_on ? this.config.color_on : '#f7d959';
    }
    _getColorFromVariable(color) {
        if (typeof color !== "undefined" && color.substring(0, 3) === 'var') {
            return window.getComputedStyle(document.documentElement).getPropertyValue(color.substring(4).slice(0, -1)).trim();
        }
        return color;
    }
    static get styles() {
        return css `
      :host {
        --auto-color: #EE7600;
        --eco-color: springgreen;
        --cool-color: #2b9af9;
        --heat-color: #EE7600;
        --manual-color: #44739e;
        --off-color: lightgrey;
        --fan_only-color: #8a8a8a;
        --dry-color: #efbd07;
        --idle-color: #00CC66;
        --unknown-color: #bac;
      }
      .card-title {
          margin-bottom:-10px;
          padding-left: 4px;
          font-size: 18px;
          padding-top:18px;
          padding-bottom:10px;
      }

      .row {
        display: flex;
        flex-wrap: wrap;
        flex-direction:row;
        padding-top:50px;
      }
      .row:first-child {
        padding-top:0;
      }

      .row .col {
        padding:0 25px;
      }
      .row .col.fixed {
        min-width: calc(var(--tile-on-row) * calc(var(--tile-width, 100px) + 29px));
        width: calc(var(--tile-on-row) * calc(var(--tile-width, 100px) + 29px));
      }
      
      .homekit-card {
        white-space: initial;
      }
      .homekit-card.scroll {
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
      }

      .container {
          float: left;
          clear: left;
          margin-top: 10px;
          padding: 5px 0 5px 15px;
          white-space: nowrap;
          width: 100%;
          box-sizing: border-box;
      }
      .container.rows {
        padding: 5px 0;
      }
      .container.rows .header {
        padding: 0 25px;
      }
      .header {
          min-height: var(--min-header-height, 150px);
          margin-bottom: 30px;
      }
      .header h1 {
          margin-bottom: 30px;
          margin-left: 4px;
          font-size: 32px;
          font-weight: 300;
      }

      .header ul {
        margin:0 0 30px 4px;
        padding: 0 16px 0 0;
        list-style:none;
      }
      
      .header ul li {
        display:block;
        color:inherit;
        font-size:20px;
        font-weight:300;
        white-space: normal;
      }

      homekit-button {
        transform-origin: center center;
      }

      .button {
        vertical-align: top;
        cursor: pointer;
        display:inline-block;
        width: var(--tile-width, 100px);
        height: var(--tile-height, 100px);
        padding:10px;
        background-color: var(--tile-background, rgba(255, 255, 255, 0.8));
        border-radius: var(--tile-border-radius, 12px);
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
        margin: 3px;
        position: relative;
        overflow:hidden;
        font-weight:300;
        touch-action: auto!important;
      }
      .button.size-2 {
        width: calc(var(--tile-width, 100px) * 2.3);
      }
      .button.height-2 {
        height:calc(var(--tile-height, 100px) * 2.3);
      }
      .button.height-half {
        height:calc(var(--tile-height, 100px) * 0.5);
      }
      .button.no-padding {
        padding: 0;
        width: calc(var(--tile-width, 100px) * 1.2);
        height: 120px;
      }
      .button.no-padding.size-2 {
        width: calc(var(--tile-width, 100px) * 2.5);
      }
      .button.no-padding.height-2 {
        height:calc(var(--tile-height, 100px) * 2.5);
      }
      .button.no-padding.height-half {
        height:calc(var(--tile-height, 100px) * 0.6);
      }

      .button input[type="range"] {
        pointer-events: none;
        outline: 0;
        border: 0;
        border-radius: 8px;
        width: var(--slider-width, 120px);
        margin: 0;
        transition: box-shadow 0.2s ease-in-out;
        overflow: hidden;
        height: var(--slider-height, 120px);
        -webkit-appearance: none;
        background-color: var(--tile-background);
        position: absolute;
        top: calc(50% - (var(--slider-height, 120px) / 2));
        right: calc(50% - (var(--slider-width, 120px) / 2));
      }
      .button input[type="range"]::-webkit-slider-runnable-track {
        height: var(--slider-height, 120px);
        -webkit-appearance: none;
        color: var(--tile-background);
        margin-top: -1px;
        transition: box-shadow 0.2s ease-in-out;
      }
      .button input[type="range"]::-webkit-slider-thumb {
        pointer-events:auto;
        width: 25px;
        border-right:10px solid var(--tile-on-background);
        border-left:10px solid var(--tile-on-background);
        border-top:20px solid var(--tile-on-background);
        border-bottom:20px solid var(--tile-on-background);
        -webkit-appearance: none;
        height: 80px;
        cursor: ew-resize;
        background: var(--tile-on-background);
        box-shadow: -350px 0 0 350px var(--tile-on-background), inset 0 0 0 80px var(--tile-background);
        border-radius: 0;
        transition: box-shadow 0.2s ease-in-out;
        position: relative;
        top: calc((var(--slider-height, 120px) - 80px) / 2);
      }

      .button.size-2 input[type="range"] {
        width: calc(var(--slider-width, 120px) * 2.3);
        right: calc(50% - ((var(--slider-width, 120px) * 2.3) / 2));
      }

      .button.height-2 input[type="range"] {
        height: calc(var(--slider-height, 120px) * 2.3);
        top: calc(50% - ((var(--slider-height, 120px) * 2.3) / 2));
      }
      .button.height-2 input[type="range"]::-webkit-slider-runnable-track {
        height: calc(var(--slider-height, 120px) * 2.3);
      }
      .button.height-2 input[type="range"]::-webkit-slider-thumb {
        top: calc(((var(--slider-height, 120px) * 2.3) - 80px) / 2);
      }

      .button.height-half input[type="range"] {
        height: calc(var(--slider-height, 120px) * 0.58333333333);
        top: calc(50% - ((var(--slider-height, 120px) * 0.58333333333) / 2));
      }
      .button.height-half input[type="range"]::-webkit-slider-runnable-track {
        height: calc(var(--slider-height, 120px) * 0.58333333333);
      }
      .button.height-half input[type="range"]::-webkit-slider-thumb {
        top: calc(((var(--slider-height, 120px) * 0.58333333333) - 80px) / 2);
      }
      

      :host:last-child .button {
        margin-right:13px;
      }
      
      .button.on {
        background-color: var(--tile-on-background, rgba(255, 255, 255, 1));
      }
      
      .button .button-inner {
        display:flex;
        flex-direction:column;
        height:100%;
      }
      .button.event .button-inner {
        pointer-events: none;
      }
      .button.slider .button-inner {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
        z-index: 1;
        display: flex;
        flex-direction: column;
        pointer-events: none;
        height: auto;
      }

      .button.height-half .button-inner {
        flex-direction:row;
        align-items: center;
      }
      .button.height-half .button-inner .name {
        margin-top:0;
        margin-left:10px;
      }

      .button.height-half .button-inner .icon ha-icon {
        display: block;
        line-height: 35px;
        height: 35px;
      }

      homekit-button.hide {
        display:none;
      }
      
      homekit-button .name {
        display:block;
        font-size: 14px;
        line-height: 14px;
        font-weight: 500;
        color: var(--tile-name-text-color, rgba(0, 0, 0, 0.4));
        width: 100%;
        margin-top: auto;
        margin-bottom: -5px;
        padding-bottom: 5px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-wrap:break-word;
        overflow: hidden;
        white-space: normal;
        pointer-events: none;
      }
      
      homekit-button .name.on {
        color: var(--tile-on-name-text-color, rgba(0, 0, 0, 1));
      }
      
      homekit-button .state {
        position: relative;
        font-size: 14px;
        color: var(--tile-state-text-color, rgba(0, 0, 0, 0.4));
        text-transform: capitalize;
        float: left;
        white-space: nowrap;
        pointer-events: none;
      }

      homekit-button .state .previous {
        position: relative;
        margin-left: 5px;
        font-size: 9px;
        color: var(--tile-state-changed-text-color, rgb(134, 134, 134));
        text-transform: lowercase;
        pointer-events: none;
      }
      
      homekit-button .value {
        visibility: hidden;
        pointer-events: none;
      }
      
      homekit-button .value.on {
        visibility: visible;
        position: relative;
        margin-left: 5px;
        font-size: 11px;
        color: var(--tile-value-text-color, rgba(255, 0, 0, 1));
        text-transform: lowercase;
      }
      
      .button .button-inner .circle-state {
        stroke-dasharray: calc((251.2 / 100) * var(--percentage)), 251.2;
        position:absolute;
        margin:0;
        top:10px;
        right:10px;
        width: 40px;
        height: 40px;
        pointer-events: none;
      }

      homekit-button .state.on {
        color: var(--tile-on-state-text-color, rgba(0, 0, 0, 1));
      }
      homekit-button .state.unavailable {
        color: var(--tile-unavailable-state-text-color, rgba(255, 0, 0, 1));
      }
      
      homekit-button .icon {
        display:block;
        height: calc(var(--tile-icon-size, 30px) + 10px);
        width: calc(var(--tile-icon-size, 30px) + 10px);
        color: var(--tile-icon-color, rgba(0, 0, 0, 0.3));
        font-size: var(--tile-icon-size, 30px);
        --mdc-icon-size: var(--tile-icon-size, 30px);
        transform-origin: 50% 50%;
        line-height: calc(var(--tile-icon-size, 30px) + 10px);
        text-align: center;
        pointer-events: none;
      }

      homekit-button .icon.image img {
        width:100%;
        border-radius: var(--tile-image-radius, 100%)
      }

      homekit-button .icon ha-icon {
        width:30px;
        height:30px;
        pointer-events: none;
      }
                
      homekit-button .icon.on {
        color: var(--tile-on-icon-color, #f7d959);
      }

      homekit-button .icon.climate {
        color:#FFF;
        background-color: rgba(0,255,0, 1);
        font-size: 16px;
        font-weight: 400;
        text-align: center;
        line-height: 45px;
        padding: 0;
        border-radius: 100%;
        height: 45px;
        width: 45px;
      }
      homekit-button .icon.climate.temp.heat_cool {
        background-color: var(--auto-color);
      }
      homekit-button .icon.climate.temp.cool {
        background-color: var(--cool-color);
      }
      homekit-button .icon.climate.temp.heat {
        background-color: var(--heat-color);
      }
      homekit-button .icon.climate.temp.manual {
        background-color: var(--manual-color);
      }
      homekit-button .icon.climate.temp.off {
        background-color: var(--off-color);
      }
      homekit-button .icon.climate.temp.fan_only {
        background-color: var(--fan_only-color);
      }
      homekit-button .icon.climate.temp.eco {
        background-color: var(--eco-color);
      }
      homekit-button .icon.climate.temp.dry {
        background-color: var(--dry-color);
      }
      homekit-button .icon.climate.temp.idle {
        background-color: var(--idle-color);
      }
      homekit-button .icon.climate.temp.unknown-mode {
        background-color: var(--unknown-color);
      }
      
      homekit-button .circle {
        position: absolute;
        top: 17px;
        left: 10px;
        height: 35px;
        width: 35px;
        background-color: rgba(0, 255, 0, 1);
        border-radius: 20px;
        pointer-events: none;
      }
      
      homekit-button .temp {
        position: absolute;
        top: 26px;
        left: 19px;
        font-family: Arial;
        font-size: 14px;
        font-weight: bold;
        color: white;
        pointer-events: none;
      }
      
      .not-found {
        cursor: pointer;
        display:inline-block;
        width: 110px;
        height: 110px;
        padding:5px;
        background-color: rgba(255, 0, 0, 0.8);
        border-radius: 12px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
        margin: 3px;
        position: relative;
        overflow:hidden;
        font-weight:300;
        touch-action: auto!important;
      }

      .break {
        display:none;
      }
      @media only screen and (max-width: 768px) {
        .button {
          width:var(--tile-width-mobile, 90px);
          height:var(--tile-height-mobile, 90px);
        }
        .button.size-2 {
          width: calc(var(--tile-width-mobile, 90px) * 2.33);
        }
        .button.height-2 {
          height: calc(var(--tile-height-mobile, 90px) * 2.33);
        }
        .button.height-half {
          height: calc(var(--tile-height-mobile, 90px) * 0.5);
        }
        .button.no-padding {
          width: calc(var(--tile-width-mobile, 90px) * 1.22);
          height: calc(var(--tile-height-mobile, 90px) * 1.22);
        }
        .button.no-padding.size-2 {
          width: calc(var(--tile-width-mobile, 90px) * 2.55555555556);
        }
        .button.no-padding.height-2 {
          height: calc(var(--tile-height-mobile, 90px) * 2.55555555556);
        }
        .button.no-padding.height-half {
          height: calc(var(--tile-height-mobile, 90px) * 0.6);
        }
        .container {
          padding-left:0;
        }
        .header h1 {
          margin-left: 0;
        }
        .header ul {
          margin:0 0 30px 0;
        }
        .header, .card-title, .homekit-card {
          width: 358px;
          text-align: left;
          padding:0!important;
          margin: 0 auto;
        }
        .card-title {
          padding-bottom:0;
        }
        homekit-button .name {
          font-size:13px;
          line-height:13px;
        }
        homekit-button .state {
          font-size:13px;
        }
        homekit-button .value.on {
          font-size:10px;
        }
        .row {
          padding:0;
          flex-direction:column;
        }
        .row .col, .row .col.fixed {
          width: auto;
          min-width: auto;
          padding: 0;
        }
      }

      .spin {      
        animation-name: spin;
        animation-duration: 1000ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear; 
      }

      @keyframes spin {
        from {
            transform:rotate(0deg);
        }
        to {
            transform:rotate(360deg);
        }
      }

      .longpress.animate {
        animation-fill-mode: forwards; 
        -webkit-animation: 0.5s longpress forwards;
        animation: 0.5s longpress forwards;
      }
      
      @-webkit-keyframes longpress {
          0%, 20% { transform: scale(1); }
          100% { transform: scale(1.2); }
      }
      
      @keyframes longpress {
          0%, 20% { transform: scale(1); }
          100% { transform: scale(1.2); }
      }
    `;
    }
}
customElements.define("homekit-card", HomeKitCard);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZWtpdC1wYW5lbC1jYXJkLmpzIiwic291cmNlcyI6WyIuLi9ub2RlX21vZHVsZXMvZmVjaGEvbGliL2ZlY2hhLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2N1c3RvbS1jYXJkLWhlbHBlcnMvZGlzdC9pbmRleC5tLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BjdHJsL3Rpbnljb2xvci9kaXN0L2VzL3V0aWwuanMiLCIuLi9ub2RlX21vZHVsZXMvQGN0cmwvdGlueWNvbG9yL2Rpc3QvZXMvY29udmVyc2lvbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9AY3RybC90aW55Y29sb3IvZGlzdC9lcy9jc3MtY29sb3ItbmFtZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvQGN0cmwvdGlueWNvbG9yL2Rpc3QvZXMvZm9ybWF0LWlucHV0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BjdHJsL3Rpbnljb2xvci9kaXN0L2VzL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NhcmQtdG9vbHMvc3JjL2xpdC1lbGVtZW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NhcmQtdG9vbHMvc3JjL2hhc3MuanMiLCIuLi9ub2RlX21vZHVsZXMvY2FyZC10b29scy9zcmMvZXZlbnQuanMiLCIuLi9ub2RlX21vZHVsZXMvY2FyZC10b29scy9zcmMvbW9yZS1pbmZvLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NhcmQtdG9vbHMvc3JjL2RldmljZUlELmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NhcmQtdG9vbHMvc3JjL3RlbXBsYXRlcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jYXJkLXRvb2xzL3NyYy9sb3ZlbGFjZS1lbGVtZW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2hhbW1lcmpzL2hhbW1lci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdG9rZW4gPSAvZHsxLDR9fE17MSw0fXxZWSg/OllZKT98U3sxLDN9fERvfFpafFp8KFtIaE1zRG1dKVxcMT98W2FBXXxcIlteXCJdKlwifCdbXiddKicvZztcbnZhciB0d29EaWdpdHNPcHRpb25hbCA9IFwiWzEtOV1cXFxcZD9cIjtcbnZhciB0d29EaWdpdHMgPSBcIlxcXFxkXFxcXGRcIjtcbnZhciB0aHJlZURpZ2l0cyA9IFwiXFxcXGR7M31cIjtcbnZhciBmb3VyRGlnaXRzID0gXCJcXFxcZHs0fVwiO1xudmFyIHdvcmQgPSBcIlteXFxcXHNdK1wiO1xudmFyIGxpdGVyYWwgPSAvXFxbKFteXSo/KVxcXS9nbTtcbmZ1bmN0aW9uIHNob3J0ZW4oYXJyLCBzTGVuKSB7XG4gICAgdmFyIG5ld0FyciA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbmV3QXJyLnB1c2goYXJyW2ldLnN1YnN0cigwLCBzTGVuKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdBcnI7XG59XG52YXIgbW9udGhVcGRhdGUgPSBmdW5jdGlvbiAoYXJyTmFtZSkgeyByZXR1cm4gZnVuY3Rpb24gKHYsIGkxOG4pIHtcbiAgICB2YXIgbG93ZXJDYXNlQXJyID0gaTE4blthcnJOYW1lXS5tYXAoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHYudG9Mb3dlckNhc2UoKTsgfSk7XG4gICAgdmFyIGluZGV4ID0gbG93ZXJDYXNlQXJyLmluZGV4T2Yodi50b0xvd2VyQ2FzZSgpKTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufTsgfTtcbmZ1bmN0aW9uIGFzc2lnbihvcmlnT2JqKSB7XG4gICAgdmFyIGFyZ3MgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBhcmdzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xuICAgIH1cbiAgICBmb3IgKHZhciBfYSA9IDAsIGFyZ3NfMSA9IGFyZ3M7IF9hIDwgYXJnc18xLmxlbmd0aDsgX2ErKykge1xuICAgICAgICB2YXIgb2JqID0gYXJnc18xW19hXTtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSBleFxuICAgICAgICAgICAgb3JpZ09ialtrZXldID0gb2JqW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9yaWdPYmo7XG59XG52YXIgZGF5TmFtZXMgPSBbXG4gICAgXCJTdW5kYXlcIixcbiAgICBcIk1vbmRheVwiLFxuICAgIFwiVHVlc2RheVwiLFxuICAgIFwiV2VkbmVzZGF5XCIsXG4gICAgXCJUaHVyc2RheVwiLFxuICAgIFwiRnJpZGF5XCIsXG4gICAgXCJTYXR1cmRheVwiXG5dO1xudmFyIG1vbnRoTmFtZXMgPSBbXG4gICAgXCJKYW51YXJ5XCIsXG4gICAgXCJGZWJydWFyeVwiLFxuICAgIFwiTWFyY2hcIixcbiAgICBcIkFwcmlsXCIsXG4gICAgXCJNYXlcIixcbiAgICBcIkp1bmVcIixcbiAgICBcIkp1bHlcIixcbiAgICBcIkF1Z3VzdFwiLFxuICAgIFwiU2VwdGVtYmVyXCIsXG4gICAgXCJPY3RvYmVyXCIsXG4gICAgXCJOb3ZlbWJlclwiLFxuICAgIFwiRGVjZW1iZXJcIlxuXTtcbnZhciBtb250aE5hbWVzU2hvcnQgPSBzaG9ydGVuKG1vbnRoTmFtZXMsIDMpO1xudmFyIGRheU5hbWVzU2hvcnQgPSBzaG9ydGVuKGRheU5hbWVzLCAzKTtcbnZhciBkZWZhdWx0STE4biA9IHtcbiAgICBkYXlOYW1lc1Nob3J0OiBkYXlOYW1lc1Nob3J0LFxuICAgIGRheU5hbWVzOiBkYXlOYW1lcyxcbiAgICBtb250aE5hbWVzU2hvcnQ6IG1vbnRoTmFtZXNTaG9ydCxcbiAgICBtb250aE5hbWVzOiBtb250aE5hbWVzLFxuICAgIGFtUG06IFtcImFtXCIsIFwicG1cIl0sXG4gICAgRG9GbjogZnVuY3Rpb24gKGRheU9mTW9udGgpIHtcbiAgICAgICAgcmV0dXJuIChkYXlPZk1vbnRoICtcbiAgICAgICAgICAgIFtcInRoXCIsIFwic3RcIiwgXCJuZFwiLCBcInJkXCJdW2RheU9mTW9udGggJSAxMCA+IDNcbiAgICAgICAgICAgICAgICA/IDBcbiAgICAgICAgICAgICAgICA6ICgoZGF5T2ZNb250aCAtIChkYXlPZk1vbnRoICUgMTApICE9PSAxMCA/IDEgOiAwKSAqIGRheU9mTW9udGgpICUgMTBdKTtcbiAgICB9XG59O1xudmFyIGdsb2JhbEkxOG4gPSBhc3NpZ24oe30sIGRlZmF1bHRJMThuKTtcbnZhciBzZXRHbG9iYWxEYXRlSTE4biA9IGZ1bmN0aW9uIChpMThuKSB7XG4gICAgcmV0dXJuIChnbG9iYWxJMThuID0gYXNzaWduKGdsb2JhbEkxOG4sIGkxOG4pKTtcbn07XG52YXIgcmVnZXhFc2NhcGUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bfFxcXFx7KClbXiQrKj8uLV0vZywgXCJcXFxcJCZcIik7XG59O1xudmFyIHBhZCA9IGZ1bmN0aW9uICh2YWwsIGxlbikge1xuICAgIGlmIChsZW4gPT09IHZvaWQgMCkgeyBsZW4gPSAyOyB9XG4gICAgdmFsID0gU3RyaW5nKHZhbCk7XG4gICAgd2hpbGUgKHZhbC5sZW5ndGggPCBsZW4pIHtcbiAgICAgICAgdmFsID0gXCIwXCIgKyB2YWw7XG4gICAgfVxuICAgIHJldHVybiB2YWw7XG59O1xudmFyIGZvcm1hdEZsYWdzID0ge1xuICAgIEQ6IGZ1bmN0aW9uIChkYXRlT2JqKSB7IHJldHVybiBTdHJpbmcoZGF0ZU9iai5nZXREYXRlKCkpOyB9LFxuICAgIEREOiBmdW5jdGlvbiAoZGF0ZU9iaikgeyByZXR1cm4gcGFkKGRhdGVPYmouZ2V0RGF0ZSgpKTsgfSxcbiAgICBEbzogZnVuY3Rpb24gKGRhdGVPYmosIGkxOG4pIHtcbiAgICAgICAgcmV0dXJuIGkxOG4uRG9GbihkYXRlT2JqLmdldERhdGUoKSk7XG4gICAgfSxcbiAgICBkOiBmdW5jdGlvbiAoZGF0ZU9iaikgeyByZXR1cm4gU3RyaW5nKGRhdGVPYmouZ2V0RGF5KCkpOyB9LFxuICAgIGRkOiBmdW5jdGlvbiAoZGF0ZU9iaikgeyByZXR1cm4gcGFkKGRhdGVPYmouZ2V0RGF5KCkpOyB9LFxuICAgIGRkZDogZnVuY3Rpb24gKGRhdGVPYmosIGkxOG4pIHtcbiAgICAgICAgcmV0dXJuIGkxOG4uZGF5TmFtZXNTaG9ydFtkYXRlT2JqLmdldERheSgpXTtcbiAgICB9LFxuICAgIGRkZGQ6IGZ1bmN0aW9uIChkYXRlT2JqLCBpMThuKSB7XG4gICAgICAgIHJldHVybiBpMThuLmRheU5hbWVzW2RhdGVPYmouZ2V0RGF5KCldO1xuICAgIH0sXG4gICAgTTogZnVuY3Rpb24gKGRhdGVPYmopIHsgcmV0dXJuIFN0cmluZyhkYXRlT2JqLmdldE1vbnRoKCkgKyAxKTsgfSxcbiAgICBNTTogZnVuY3Rpb24gKGRhdGVPYmopIHsgcmV0dXJuIHBhZChkYXRlT2JqLmdldE1vbnRoKCkgKyAxKTsgfSxcbiAgICBNTU06IGZ1bmN0aW9uIChkYXRlT2JqLCBpMThuKSB7XG4gICAgICAgIHJldHVybiBpMThuLm1vbnRoTmFtZXNTaG9ydFtkYXRlT2JqLmdldE1vbnRoKCldO1xuICAgIH0sXG4gICAgTU1NTTogZnVuY3Rpb24gKGRhdGVPYmosIGkxOG4pIHtcbiAgICAgICAgcmV0dXJuIGkxOG4ubW9udGhOYW1lc1tkYXRlT2JqLmdldE1vbnRoKCldO1xuICAgIH0sXG4gICAgWVk6IGZ1bmN0aW9uIChkYXRlT2JqKSB7XG4gICAgICAgIHJldHVybiBwYWQoU3RyaW5nKGRhdGVPYmouZ2V0RnVsbFllYXIoKSksIDQpLnN1YnN0cigyKTtcbiAgICB9LFxuICAgIFlZWVk6IGZ1bmN0aW9uIChkYXRlT2JqKSB7IHJldHVybiBwYWQoZGF0ZU9iai5nZXRGdWxsWWVhcigpLCA0KTsgfSxcbiAgICBoOiBmdW5jdGlvbiAoZGF0ZU9iaikgeyByZXR1cm4gU3RyaW5nKGRhdGVPYmouZ2V0SG91cnMoKSAlIDEyIHx8IDEyKTsgfSxcbiAgICBoaDogZnVuY3Rpb24gKGRhdGVPYmopIHsgcmV0dXJuIHBhZChkYXRlT2JqLmdldEhvdXJzKCkgJSAxMiB8fCAxMik7IH0sXG4gICAgSDogZnVuY3Rpb24gKGRhdGVPYmopIHsgcmV0dXJuIFN0cmluZyhkYXRlT2JqLmdldEhvdXJzKCkpOyB9LFxuICAgIEhIOiBmdW5jdGlvbiAoZGF0ZU9iaikgeyByZXR1cm4gcGFkKGRhdGVPYmouZ2V0SG91cnMoKSk7IH0sXG4gICAgbTogZnVuY3Rpb24gKGRhdGVPYmopIHsgcmV0dXJuIFN0cmluZyhkYXRlT2JqLmdldE1pbnV0ZXMoKSk7IH0sXG4gICAgbW06IGZ1bmN0aW9uIChkYXRlT2JqKSB7IHJldHVybiBwYWQoZGF0ZU9iai5nZXRNaW51dGVzKCkpOyB9LFxuICAgIHM6IGZ1bmN0aW9uIChkYXRlT2JqKSB7IHJldHVybiBTdHJpbmcoZGF0ZU9iai5nZXRTZWNvbmRzKCkpOyB9LFxuICAgIHNzOiBmdW5jdGlvbiAoZGF0ZU9iaikgeyByZXR1cm4gcGFkKGRhdGVPYmouZ2V0U2Vjb25kcygpKTsgfSxcbiAgICBTOiBmdW5jdGlvbiAoZGF0ZU9iaikge1xuICAgICAgICByZXR1cm4gU3RyaW5nKE1hdGgucm91bmQoZGF0ZU9iai5nZXRNaWxsaXNlY29uZHMoKSAvIDEwMCkpO1xuICAgIH0sXG4gICAgU1M6IGZ1bmN0aW9uIChkYXRlT2JqKSB7XG4gICAgICAgIHJldHVybiBwYWQoTWF0aC5yb3VuZChkYXRlT2JqLmdldE1pbGxpc2Vjb25kcygpIC8gMTApLCAyKTtcbiAgICB9LFxuICAgIFNTUzogZnVuY3Rpb24gKGRhdGVPYmopIHsgcmV0dXJuIHBhZChkYXRlT2JqLmdldE1pbGxpc2Vjb25kcygpLCAzKTsgfSxcbiAgICBhOiBmdW5jdGlvbiAoZGF0ZU9iaiwgaTE4bikge1xuICAgICAgICByZXR1cm4gZGF0ZU9iai5nZXRIb3VycygpIDwgMTIgPyBpMThuLmFtUG1bMF0gOiBpMThuLmFtUG1bMV07XG4gICAgfSxcbiAgICBBOiBmdW5jdGlvbiAoZGF0ZU9iaiwgaTE4bikge1xuICAgICAgICByZXR1cm4gZGF0ZU9iai5nZXRIb3VycygpIDwgMTJcbiAgICAgICAgICAgID8gaTE4bi5hbVBtWzBdLnRvVXBwZXJDYXNlKClcbiAgICAgICAgICAgIDogaTE4bi5hbVBtWzFdLnRvVXBwZXJDYXNlKCk7XG4gICAgfSxcbiAgICBaWjogZnVuY3Rpb24gKGRhdGVPYmopIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IGRhdGVPYmouZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgICAgICAgcmV0dXJuICgob2Zmc2V0ID4gMCA/IFwiLVwiIDogXCIrXCIpICtcbiAgICAgICAgICAgIHBhZChNYXRoLmZsb29yKE1hdGguYWJzKG9mZnNldCkgLyA2MCkgKiAxMDAgKyAoTWF0aC5hYnMob2Zmc2V0KSAlIDYwKSwgNCkpO1xuICAgIH0sXG4gICAgWjogZnVuY3Rpb24gKGRhdGVPYmopIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IGRhdGVPYmouZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgICAgICAgcmV0dXJuICgob2Zmc2V0ID4gMCA/IFwiLVwiIDogXCIrXCIpICtcbiAgICAgICAgICAgIHBhZChNYXRoLmZsb29yKE1hdGguYWJzKG9mZnNldCkgLyA2MCksIDIpICtcbiAgICAgICAgICAgIFwiOlwiICtcbiAgICAgICAgICAgIHBhZChNYXRoLmFicyhvZmZzZXQpICUgNjAsIDIpKTtcbiAgICB9XG59O1xudmFyIG1vbnRoUGFyc2UgPSBmdW5jdGlvbiAodikgeyByZXR1cm4gK3YgLSAxOyB9O1xudmFyIGVtcHR5RGlnaXRzID0gW251bGwsIHR3b0RpZ2l0c09wdGlvbmFsXTtcbnZhciBlbXB0eVdvcmQgPSBbbnVsbCwgd29yZF07XG52YXIgYW1QbSA9IFtcbiAgICBcImlzUG1cIixcbiAgICB3b3JkLFxuICAgIGZ1bmN0aW9uICh2LCBpMThuKSB7XG4gICAgICAgIHZhciB2YWwgPSB2LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmICh2YWwgPT09IGkxOG4uYW1QbVswXSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodmFsID09PSBpMThuLmFtUG1bMV0pIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbl07XG52YXIgdGltZXpvbmVPZmZzZXQgPSBbXG4gICAgXCJ0aW1lem9uZU9mZnNldFwiLFxuICAgIFwiW15cXFxcc10qP1tcXFxcK1xcXFwtXVxcXFxkXFxcXGQ6P1xcXFxkXFxcXGR8W15cXFxcc10qP1o/XCIsXG4gICAgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgdmFyIHBhcnRzID0gKHYgKyBcIlwiKS5tYXRjaCgvKFsrLV18XFxkXFxkKS9naSk7XG4gICAgICAgIGlmIChwYXJ0cykge1xuICAgICAgICAgICAgdmFyIG1pbnV0ZXMgPSArcGFydHNbMV0gKiA2MCArIHBhcnNlSW50KHBhcnRzWzJdLCAxMCk7XG4gICAgICAgICAgICByZXR1cm4gcGFydHNbMF0gPT09IFwiK1wiID8gbWludXRlcyA6IC1taW51dGVzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbl07XG52YXIgcGFyc2VGbGFncyA9IHtcbiAgICBEOiBbXCJkYXlcIiwgdHdvRGlnaXRzT3B0aW9uYWxdLFxuICAgIEREOiBbXCJkYXlcIiwgdHdvRGlnaXRzXSxcbiAgICBEbzogW1wiZGF5XCIsIHR3b0RpZ2l0c09wdGlvbmFsICsgd29yZCwgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHBhcnNlSW50KHYsIDEwKTsgfV0sXG4gICAgTTogW1wibW9udGhcIiwgdHdvRGlnaXRzT3B0aW9uYWwsIG1vbnRoUGFyc2VdLFxuICAgIE1NOiBbXCJtb250aFwiLCB0d29EaWdpdHMsIG1vbnRoUGFyc2VdLFxuICAgIFlZOiBbXG4gICAgICAgIFwieWVhclwiLFxuICAgICAgICB0d29EaWdpdHMsXG4gICAgICAgIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciBjZW50ID0gKyhcIlwiICsgbm93LmdldEZ1bGxZZWFyKCkpLnN1YnN0cigwLCAyKTtcbiAgICAgICAgICAgIHJldHVybiArKFwiXCIgKyAoK3YgPiA2OCA/IGNlbnQgLSAxIDogY2VudCkgKyB2KTtcbiAgICAgICAgfVxuICAgIF0sXG4gICAgaDogW1wiaG91clwiLCB0d29EaWdpdHNPcHRpb25hbCwgdW5kZWZpbmVkLCBcImlzUG1cIl0sXG4gICAgaGg6IFtcImhvdXJcIiwgdHdvRGlnaXRzLCB1bmRlZmluZWQsIFwiaXNQbVwiXSxcbiAgICBIOiBbXCJob3VyXCIsIHR3b0RpZ2l0c09wdGlvbmFsXSxcbiAgICBISDogW1wiaG91clwiLCB0d29EaWdpdHNdLFxuICAgIG06IFtcIm1pbnV0ZVwiLCB0d29EaWdpdHNPcHRpb25hbF0sXG4gICAgbW06IFtcIm1pbnV0ZVwiLCB0d29EaWdpdHNdLFxuICAgIHM6IFtcInNlY29uZFwiLCB0d29EaWdpdHNPcHRpb25hbF0sXG4gICAgc3M6IFtcInNlY29uZFwiLCB0d29EaWdpdHNdLFxuICAgIFlZWVk6IFtcInllYXJcIiwgZm91ckRpZ2l0c10sXG4gICAgUzogW1wibWlsbGlzZWNvbmRcIiwgXCJcXFxcZFwiLCBmdW5jdGlvbiAodikgeyByZXR1cm4gK3YgKiAxMDA7IH1dLFxuICAgIFNTOiBbXCJtaWxsaXNlY29uZFwiLCB0d29EaWdpdHMsIGZ1bmN0aW9uICh2KSB7IHJldHVybiArdiAqIDEwOyB9XSxcbiAgICBTU1M6IFtcIm1pbGxpc2Vjb25kXCIsIHRocmVlRGlnaXRzXSxcbiAgICBkOiBlbXB0eURpZ2l0cyxcbiAgICBkZDogZW1wdHlEaWdpdHMsXG4gICAgZGRkOiBlbXB0eVdvcmQsXG4gICAgZGRkZDogZW1wdHlXb3JkLFxuICAgIE1NTTogW1wibW9udGhcIiwgd29yZCwgbW9udGhVcGRhdGUoXCJtb250aE5hbWVzU2hvcnRcIildLFxuICAgIE1NTU06IFtcIm1vbnRoXCIsIHdvcmQsIG1vbnRoVXBkYXRlKFwibW9udGhOYW1lc1wiKV0sXG4gICAgYTogYW1QbSxcbiAgICBBOiBhbVBtLFxuICAgIFpaOiB0aW1lem9uZU9mZnNldCxcbiAgICBaOiB0aW1lem9uZU9mZnNldFxufTtcbi8vIFNvbWUgY29tbW9uIGZvcm1hdCBzdHJpbmdzXG52YXIgZ2xvYmFsTWFza3MgPSB7XG4gICAgZGVmYXVsdDogXCJkZGQgTU1NIEREIFlZWVkgSEg6bW06c3NcIixcbiAgICBzaG9ydERhdGU6IFwiTS9EL1lZXCIsXG4gICAgbWVkaXVtRGF0ZTogXCJNTU0gRCwgWVlZWVwiLFxuICAgIGxvbmdEYXRlOiBcIk1NTU0gRCwgWVlZWVwiLFxuICAgIGZ1bGxEYXRlOiBcImRkZGQsIE1NTU0gRCwgWVlZWVwiLFxuICAgIGlzb0RhdGU6IFwiWVlZWS1NTS1ERFwiLFxuICAgIGlzb0RhdGVUaW1lOiBcIllZWVktTU0tRERUSEg6bW06c3NaXCIsXG4gICAgc2hvcnRUaW1lOiBcIkhIOm1tXCIsXG4gICAgbWVkaXVtVGltZTogXCJISDptbTpzc1wiLFxuICAgIGxvbmdUaW1lOiBcIkhIOm1tOnNzLlNTU1wiXG59O1xudmFyIHNldEdsb2JhbERhdGVNYXNrcyA9IGZ1bmN0aW9uIChtYXNrcykgeyByZXR1cm4gYXNzaWduKGdsb2JhbE1hc2tzLCBtYXNrcyk7IH07XG4vKioqXG4gKiBGb3JtYXQgYSBkYXRlXG4gKiBAbWV0aG9kIGZvcm1hdFxuICogQHBhcmFtIHtEYXRlfG51bWJlcn0gZGF0ZU9ialxuICogQHBhcmFtIHtzdHJpbmd9IG1hc2sgRm9ybWF0IG9mIHRoZSBkYXRlLCBpLmUuICdtbS1kZC15eScgb3IgJ3Nob3J0RGF0ZSdcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEZvcm1hdHRlZCBkYXRlIHN0cmluZ1xuICovXG52YXIgZm9ybWF0ID0gZnVuY3Rpb24gKGRhdGVPYmosIG1hc2ssIGkxOG4pIHtcbiAgICBpZiAobWFzayA9PT0gdm9pZCAwKSB7IG1hc2sgPSBnbG9iYWxNYXNrc1tcImRlZmF1bHRcIl07IH1cbiAgICBpZiAoaTE4biA9PT0gdm9pZCAwKSB7IGkxOG4gPSB7fTsgfVxuICAgIGlmICh0eXBlb2YgZGF0ZU9iaiA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBkYXRlT2JqID0gbmV3IERhdGUoZGF0ZU9iaik7XG4gICAgfVxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0ZU9iaikgIT09IFwiW29iamVjdCBEYXRlXVwiIHx8XG4gICAgICAgIGlzTmFOKGRhdGVPYmouZ2V0VGltZSgpKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIERhdGUgcGFzcyB0byBmb3JtYXRcIik7XG4gICAgfVxuICAgIG1hc2sgPSBnbG9iYWxNYXNrc1ttYXNrXSB8fCBtYXNrO1xuICAgIHZhciBsaXRlcmFscyA9IFtdO1xuICAgIC8vIE1ha2UgbGl0ZXJhbHMgaW5hY3RpdmUgYnkgcmVwbGFjaW5nIHRoZW0gd2l0aCBAQEBcbiAgICBtYXNrID0gbWFzay5yZXBsYWNlKGxpdGVyYWwsIGZ1bmN0aW9uICgkMCwgJDEpIHtcbiAgICAgICAgbGl0ZXJhbHMucHVzaCgkMSk7XG4gICAgICAgIHJldHVybiBcIkBAQFwiO1xuICAgIH0pO1xuICAgIHZhciBjb21iaW5lZEkxOG5TZXR0aW5ncyA9IGFzc2lnbihhc3NpZ24oe30sIGdsb2JhbEkxOG4pLCBpMThuKTtcbiAgICAvLyBBcHBseSBmb3JtYXR0aW5nIHJ1bGVzXG4gICAgbWFzayA9IG1hc2sucmVwbGFjZSh0b2tlbiwgZnVuY3Rpb24gKCQwKSB7XG4gICAgICAgIHJldHVybiBmb3JtYXRGbGFnc1skMF0oZGF0ZU9iaiwgY29tYmluZWRJMThuU2V0dGluZ3MpO1xuICAgIH0pO1xuICAgIC8vIElubGluZSBsaXRlcmFsIHZhbHVlcyBiYWNrIGludG8gdGhlIGZvcm1hdHRlZCB2YWx1ZVxuICAgIHJldHVybiBtYXNrLnJlcGxhY2UoL0BAQC9nLCBmdW5jdGlvbiAoKSB7IHJldHVybiBsaXRlcmFscy5zaGlmdCgpOyB9KTtcbn07XG4vKipcbiAqIFBhcnNlIGEgZGF0ZSBzdHJpbmcgaW50byBhIEphdmFzY3JpcHQgRGF0ZSBvYmplY3QgL1xuICogQG1ldGhvZCBwYXJzZVxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGVTdHIgRGF0ZSBzdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXQgRGF0ZSBwYXJzZSBmb3JtYXRcbiAqIEBwYXJhbSB7aTE4bn0gSTE4blNldHRpbmdzT3B0aW9uYWwgRnVsbCBvciBzdWJzZXQgb2YgSTE4TiBzZXR0aW5nc1xuICogQHJldHVybnMge0RhdGV8bnVsbH0gUmV0dXJucyBEYXRlIG9iamVjdC4gUmV0dXJucyBudWxsIHdoYXQgZGF0ZSBzdHJpbmcgaXMgaW52YWxpZCBvciBkb2Vzbid0IG1hdGNoIGZvcm1hdFxuICovXG5mdW5jdGlvbiBwYXJzZShkYXRlU3RyLCBmb3JtYXQsIGkxOG4pIHtcbiAgICBpZiAoaTE4biA9PT0gdm9pZCAwKSB7IGkxOG4gPSB7fTsgfVxuICAgIGlmICh0eXBlb2YgZm9ybWF0ICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgZm9ybWF0IGluIGZlY2hhIHBhcnNlXCIpO1xuICAgIH1cbiAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGZvcm1hdCBpcyBhY3R1YWxseSBhIG1hc2tcbiAgICBmb3JtYXQgPSBnbG9iYWxNYXNrc1tmb3JtYXRdIHx8IGZvcm1hdDtcbiAgICAvLyBBdm9pZCByZWd1bGFyIGV4cHJlc3Npb24gZGVuaWFsIG9mIHNlcnZpY2UsIGZhaWwgZWFybHkgZm9yIHJlYWxseSBsb25nIHN0cmluZ3NcbiAgICAvLyBodHRwczovL3d3dy5vd2FzcC5vcmcvaW5kZXgucGhwL1JlZ3VsYXJfZXhwcmVzc2lvbl9EZW5pYWxfb2ZfU2VydmljZV8tX1JlRG9TXG4gICAgaWYgKGRhdGVTdHIubGVuZ3RoID4gMTAwMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLy8gRGVmYXVsdCB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSB5ZWFyLlxuICAgIHZhciB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIGRhdGVJbmZvID0ge1xuICAgICAgICB5ZWFyOiB0b2RheS5nZXRGdWxsWWVhcigpLFxuICAgICAgICBtb250aDogMCxcbiAgICAgICAgZGF5OiAxLFxuICAgICAgICBob3VyOiAwLFxuICAgICAgICBtaW51dGU6IDAsXG4gICAgICAgIHNlY29uZDogMCxcbiAgICAgICAgbWlsbGlzZWNvbmQ6IDAsXG4gICAgICAgIGlzUG06IG51bGwsXG4gICAgICAgIHRpbWV6b25lT2Zmc2V0OiBudWxsXG4gICAgfTtcbiAgICB2YXIgcGFyc2VJbmZvID0gW107XG4gICAgdmFyIGxpdGVyYWxzID0gW107XG4gICAgLy8gUmVwbGFjZSBhbGwgdGhlIGxpdGVyYWxzIHdpdGggQEBALiBIb3BlZnVsbHkgYSBzdHJpbmcgdGhhdCB3b24ndCBleGlzdCBpbiB0aGUgZm9ybWF0XG4gICAgdmFyIG5ld0Zvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKGxpdGVyYWwsIGZ1bmN0aW9uICgkMCwgJDEpIHtcbiAgICAgICAgbGl0ZXJhbHMucHVzaChyZWdleEVzY2FwZSgkMSkpO1xuICAgICAgICByZXR1cm4gXCJAQEBcIjtcbiAgICB9KTtcbiAgICB2YXIgc3BlY2lmaWVkRmllbGRzID0ge307XG4gICAgdmFyIHJlcXVpcmVkRmllbGRzID0ge307XG4gICAgLy8gQ2hhbmdlIGV2ZXJ5IHRva2VuIHRoYXQgd2UgZmluZCBpbnRvIHRoZSBjb3JyZWN0IHJlZ2V4XG4gICAgbmV3Rm9ybWF0ID0gcmVnZXhFc2NhcGUobmV3Rm9ybWF0KS5yZXBsYWNlKHRva2VuLCBmdW5jdGlvbiAoJDApIHtcbiAgICAgICAgdmFyIGluZm8gPSBwYXJzZUZsYWdzWyQwXTtcbiAgICAgICAgdmFyIGZpZWxkID0gaW5mb1swXSwgcmVnZXggPSBpbmZvWzFdLCByZXF1aXJlZEZpZWxkID0gaW5mb1szXTtcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBlcnNvbiBoYXMgc3BlY2lmaWVkIHRoZSBzYW1lIGZpZWxkIHR3aWNlLiBUaGlzIHdpbGwgbGVhZCB0byBjb25mdXNpbmcgcmVzdWx0cy5cbiAgICAgICAgaWYgKHNwZWNpZmllZEZpZWxkc1tmaWVsZF0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgZm9ybWF0LiBcIiArIGZpZWxkICsgXCIgc3BlY2lmaWVkIHR3aWNlIGluIGZvcm1hdFwiKTtcbiAgICAgICAgfVxuICAgICAgICBzcGVjaWZpZWRGaWVsZHNbZmllbGRdID0gdHJ1ZTtcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlcmUgYXJlIGFueSByZXF1aXJlZCBmaWVsZHMuIEZvciBpbnN0YW5jZSwgMTIgaG91ciB0aW1lIHJlcXVpcmVzIEFNL1BNIHNwZWNpZmllZFxuICAgICAgICBpZiAocmVxdWlyZWRGaWVsZCkge1xuICAgICAgICAgICAgcmVxdWlyZWRGaWVsZHNbcmVxdWlyZWRGaWVsZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHBhcnNlSW5mby5wdXNoKGluZm8pO1xuICAgICAgICByZXR1cm4gXCIoXCIgKyByZWdleCArIFwiKVwiO1xuICAgIH0pO1xuICAgIC8vIENoZWNrIGFsbCB0aGUgcmVxdWlyZWQgZmllbGRzIGFyZSBwcmVzZW50XG4gICAgT2JqZWN0LmtleXMocmVxdWlyZWRGaWVsZHMpLmZvckVhY2goZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgICAgIGlmICghc3BlY2lmaWVkRmllbGRzW2ZpZWxkXSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBmb3JtYXQuIFwiICsgZmllbGQgKyBcIiBpcyByZXF1aXJlZCBpbiBzcGVjaWZpZWQgZm9ybWF0XCIpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgLy8gQWRkIGJhY2sgYWxsIHRoZSBsaXRlcmFscyBhZnRlclxuICAgIG5ld0Zvcm1hdCA9IG5ld0Zvcm1hdC5yZXBsYWNlKC9AQEAvZywgZnVuY3Rpb24gKCkgeyByZXR1cm4gbGl0ZXJhbHMuc2hpZnQoKTsgfSk7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIGRhdGUgc3RyaW5nIG1hdGNoZXMgdGhlIGZvcm1hdC4gSWYgaXQgZG9lc24ndCByZXR1cm4gbnVsbFxuICAgIHZhciBtYXRjaGVzID0gZGF0ZVN0ci5tYXRjaChuZXcgUmVnRXhwKG5ld0Zvcm1hdCwgXCJpXCIpKTtcbiAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciBjb21iaW5lZEkxOG5TZXR0aW5ncyA9IGFzc2lnbihhc3NpZ24oe30sIGdsb2JhbEkxOG4pLCBpMThuKTtcbiAgICAvLyBGb3IgZWFjaCBtYXRjaCwgY2FsbCB0aGUgcGFyc2VyIGZ1bmN0aW9uIGZvciB0aGF0IGRhdGUgcGFydFxuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgX2EgPSBwYXJzZUluZm9baSAtIDFdLCBmaWVsZCA9IF9hWzBdLCBwYXJzZXIgPSBfYVsyXTtcbiAgICAgICAgdmFyIHZhbHVlID0gcGFyc2VyXG4gICAgICAgICAgICA/IHBhcnNlcihtYXRjaGVzW2ldLCBjb21iaW5lZEkxOG5TZXR0aW5ncylcbiAgICAgICAgICAgIDogK21hdGNoZXNbaV07XG4gICAgICAgIC8vIElmIHRoZSBwYXJzZXIgY2FuJ3QgbWFrZSBzZW5zZSBvZiB0aGUgdmFsdWUsIHJldHVybiBudWxsXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBkYXRlSW5mb1tmaWVsZF0gPSB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKGRhdGVJbmZvLmlzUG0gPT09IDEgJiYgZGF0ZUluZm8uaG91ciAhPSBudWxsICYmICtkYXRlSW5mby5ob3VyICE9PSAxMikge1xuICAgICAgICBkYXRlSW5mby5ob3VyID0gK2RhdGVJbmZvLmhvdXIgKyAxMjtcbiAgICB9XG4gICAgZWxzZSBpZiAoZGF0ZUluZm8uaXNQbSA9PT0gMCAmJiArZGF0ZUluZm8uaG91ciA9PT0gMTIpIHtcbiAgICAgICAgZGF0ZUluZm8uaG91ciA9IDA7XG4gICAgfVxuICAgIHZhciBkYXRlV2l0aG91dFRaID0gbmV3IERhdGUoZGF0ZUluZm8ueWVhciwgZGF0ZUluZm8ubW9udGgsIGRhdGVJbmZvLmRheSwgZGF0ZUluZm8uaG91ciwgZGF0ZUluZm8ubWludXRlLCBkYXRlSW5mby5zZWNvbmQsIGRhdGVJbmZvLm1pbGxpc2Vjb25kKTtcbiAgICB2YXIgdmFsaWRhdGVGaWVsZHMgPSBbXG4gICAgICAgIFtcIm1vbnRoXCIsIFwiZ2V0TW9udGhcIl0sXG4gICAgICAgIFtcImRheVwiLCBcImdldERhdGVcIl0sXG4gICAgICAgIFtcImhvdXJcIiwgXCJnZXRIb3Vyc1wiXSxcbiAgICAgICAgW1wibWludXRlXCIsIFwiZ2V0TWludXRlc1wiXSxcbiAgICAgICAgW1wic2Vjb25kXCIsIFwiZ2V0U2Vjb25kc1wiXVxuICAgIF07XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZhbGlkYXRlRmllbGRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGUgZGF0ZSBmaWVsZCBpcyB3aXRoaW4gdGhlIGFsbG93ZWQgcmFuZ2UuIEphdmFzY3JpcHQgZGF0ZXMgYWxsb3dzIHZhbHVlc1xuICAgICAgICAvLyBvdXRzaWRlIHRoZSBhbGxvd2VkIHJhbmdlLiBJZiB0aGUgdmFsdWVzIGRvbid0IG1hdGNoIHRoZSB2YWx1ZSB3YXMgaW52YWxpZFxuICAgICAgICBpZiAoc3BlY2lmaWVkRmllbGRzW3ZhbGlkYXRlRmllbGRzW2ldWzBdXSAmJlxuICAgICAgICAgICAgZGF0ZUluZm9bdmFsaWRhdGVGaWVsZHNbaV1bMF1dICE9PSBkYXRlV2l0aG91dFRaW3ZhbGlkYXRlRmllbGRzW2ldWzFdXSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZGF0ZUluZm8udGltZXpvbmVPZmZzZXQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZGF0ZVdpdGhvdXRUWjtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKGRhdGVJbmZvLnllYXIsIGRhdGVJbmZvLm1vbnRoLCBkYXRlSW5mby5kYXksIGRhdGVJbmZvLmhvdXIsIGRhdGVJbmZvLm1pbnV0ZSAtIGRhdGVJbmZvLnRpbWV6b25lT2Zmc2V0LCBkYXRlSW5mby5zZWNvbmQsIGRhdGVJbmZvLm1pbGxpc2Vjb25kKSk7XG59XG52YXIgZmVjaGEgPSB7XG4gICAgZm9ybWF0OiBmb3JtYXQsXG4gICAgcGFyc2U6IHBhcnNlLFxuICAgIGRlZmF1bHRJMThuOiBkZWZhdWx0STE4bixcbiAgICBzZXRHbG9iYWxEYXRlSTE4bjogc2V0R2xvYmFsRGF0ZUkxOG4sXG4gICAgc2V0R2xvYmFsRGF0ZU1hc2tzOiBzZXRHbG9iYWxEYXRlTWFza3Ncbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZlY2hhO1xuZXhwb3J0IHsgYXNzaWduLCBmb3JtYXQsIHBhcnNlLCBkZWZhdWx0STE4biwgc2V0R2xvYmFsRGF0ZUkxOG4sIHNldEdsb2JhbERhdGVNYXNrcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmVjaGEuanMubWFwXG4iLCJpbXBvcnQgZSBmcm9tXCJmZWNoYVwiO2Z1bmN0aW9uIHQoZSl7dmFyIHQ9ZS5zcGxpdChcIjpcIikubWFwKE51bWJlcik7cmV0dXJuIDM2MDAqdFswXSs2MCp0WzFdK3RbMl19dmFyIGE9ZnVuY3Rpb24oKXt0cnl7KG5ldyBEYXRlKS50b0xvY2FsZURhdGVTdHJpbmcoXCJpXCIpfWNhdGNoKGUpe3JldHVyblwiUmFuZ2VFcnJvclwiPT09ZS5uYW1lfXJldHVybiExfSgpP2Z1bmN0aW9uKGUsdCl7cmV0dXJuIGUudG9Mb2NhbGVEYXRlU3RyaW5nKHQse3llYXI6XCJudW1lcmljXCIsbW9udGg6XCJsb25nXCIsZGF5OlwibnVtZXJpY1wifSl9OmZ1bmN0aW9uKHQpe3JldHVybiBlLmZvcm1hdCh0LFwibWVkaXVtRGF0ZVwiKX0scj1mdW5jdGlvbigpe3RyeXsobmV3IERhdGUpLnRvTG9jYWxlU3RyaW5nKFwiaVwiKX1jYXRjaChlKXtyZXR1cm5cIlJhbmdlRXJyb3JcIj09PWUubmFtZX1yZXR1cm4hMX0oKT9mdW5jdGlvbihlLHQpe3JldHVybiBlLnRvTG9jYWxlU3RyaW5nKHQse3llYXI6XCJudW1lcmljXCIsbW9udGg6XCJsb25nXCIsZGF5OlwibnVtZXJpY1wiLGhvdXI6XCJudW1lcmljXCIsbWludXRlOlwiMi1kaWdpdFwifSl9OmZ1bmN0aW9uKHQpe3JldHVybiBlLmZvcm1hdCh0LFwiaGFEYXRlVGltZVwiKX0sbj1mdW5jdGlvbigpe3RyeXsobmV3IERhdGUpLnRvTG9jYWxlVGltZVN0cmluZyhcImlcIil9Y2F0Y2goZSl7cmV0dXJuXCJSYW5nZUVycm9yXCI9PT1lLm5hbWV9cmV0dXJuITF9KCk/ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS50b0xvY2FsZVRpbWVTdHJpbmcodCx7aG91cjpcIm51bWVyaWNcIixtaW51dGU6XCIyLWRpZ2l0XCJ9KX06ZnVuY3Rpb24odCl7cmV0dXJuIGUuZm9ybWF0KHQsXCJzaG9ydFRpbWVcIil9LHM9WzYwLDYwLDI0LDddLGk9W1wic2Vjb25kXCIsXCJtaW51dGVcIixcImhvdXJcIixcImRheVwiXTtmdW5jdGlvbiBvKGUsdCxhKXt2b2lkIDA9PT1hJiYoYT17fSk7dmFyIHIsbj0oKGEuY29tcGFyZVRpbWV8fG5ldyBEYXRlKS5nZXRUaW1lKCktZS5nZXRUaW1lKCkpLzFlMyxvPW4+PTA/XCJwYXN0XCI6XCJmdXR1cmVcIjtuPU1hdGguYWJzKG4pO2Zvcih2YXIgYz0wO2M8cy5sZW5ndGg7YysrKXtpZihuPHNbY10pe249TWF0aC5mbG9vcihuKSxyPXQoXCJ1aS5jb21wb25lbnRzLnJlbGF0aXZlX3RpbWUuZHVyYXRpb24uXCIraVtjXSxcImNvdW50XCIsbik7YnJlYWt9bi89c1tjXX1yZXR1cm4gdm9pZCAwPT09ciYmKHI9dChcInVpLmNvbXBvbmVudHMucmVsYXRpdmVfdGltZS5kdXJhdGlvbi53ZWVrXCIsXCJjb3VudFwiLG49TWF0aC5mbG9vcihuKSkpLCExPT09YS5pbmNsdWRlVGVuc2U/cjp0KFwidWkuY29tcG9uZW50cy5yZWxhdGl2ZV90aW1lLlwiK28sXCJ0aW1lXCIscil9dmFyIGM9ZnVuY3Rpb24oZSl7cmV0dXJuIGU8MTA/XCIwXCIrZTplfTtmdW5jdGlvbiB1KGUpe3ZhciB0PU1hdGguZmxvb3IoZS8zNjAwKSxhPU1hdGguZmxvb3IoZSUzNjAwLzYwKSxyPU1hdGguZmxvb3IoZSUzNjAwJTYwKTtyZXR1cm4gdD4wP3QrXCI6XCIrYyhhKStcIjpcIitjKHIpOmE+MD9hK1wiOlwiK2Mocik6cj4wP1wiXCIrcjpudWxsfWZ1bmN0aW9uIGwoZSl7dmFyIGE9dChlLmF0dHJpYnV0ZXMucmVtYWluaW5nKTtpZihcImFjdGl2ZVwiPT09ZS5zdGF0ZSl7dmFyIHI9KG5ldyBEYXRlKS5nZXRUaW1lKCksbj1uZXcgRGF0ZShlLmxhc3RfY2hhbmdlZCkuZ2V0VGltZSgpO2E9TWF0aC5tYXgoYS0oci1uKS8xZTMsMCl9cmV0dXJuIGF9dmFyIGg9ZnVuY3Rpb24oZSx0LGEscil7dm9pZCAwPT09ciYmKHI9ITEpLGUuX3RoZW1lc3x8KGUuX3RoZW1lcz17fSk7dmFyIG49dC5kZWZhdWx0X3RoZW1lOyhcImRlZmF1bHRcIj09PWF8fGEmJnQudGhlbWVzW2FdKSYmKG49YSk7dmFyIHM9T2JqZWN0LmFzc2lnbih7fSxlLl90aGVtZXMpO2lmKFwiZGVmYXVsdFwiIT09bil7dmFyIGk9dC50aGVtZXNbbl07T2JqZWN0LmtleXMoaSkuZm9yRWFjaChmdW5jdGlvbih0KXt2YXIgYT1cIi0tXCIrdDtlLl90aGVtZXNbYV09XCJcIixzW2FdPWlbdF19KX1pZihlLnVwZGF0ZVN0eWxlcz9lLnVwZGF0ZVN0eWxlcyhzKTp3aW5kb3cuU2hhZHlDU1MmJndpbmRvdy5TaGFkeUNTUy5zdHlsZVN1YnRyZWUoZSxzKSxyKXt2YXIgbz1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWV0YVtuYW1lPXRoZW1lLWNvbG9yXVwiKTtpZihvKXtvLmhhc0F0dHJpYnV0ZShcImRlZmF1bHQtY29udGVudFwiKXx8by5zZXRBdHRyaWJ1dGUoXCJkZWZhdWx0LWNvbnRlbnRcIixvLmdldEF0dHJpYnV0ZShcImNvbnRlbnRcIikpO3ZhciBjPXNbXCItLXByaW1hcnktY29sb3JcIl18fG8uZ2V0QXR0cmlidXRlKFwiZGVmYXVsdC1jb250ZW50XCIpO28uc2V0QXR0cmlidXRlKFwiY29udGVudFwiLGMpfX19LG09ZnVuY3Rpb24oZSl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgZS5nZXRDYXJkU2l6ZT9lLmdldENhcmRTaXplKCk6NH07ZnVuY3Rpb24gZChlKXtyZXR1cm4gZS5zdWJzdHIoMCxlLmluZGV4T2YoXCIuXCIpKX1mdW5jdGlvbiBmKGUpe3JldHVybiBlLnN1YnN0cihlLmluZGV4T2YoXCIuXCIpKzEpfWZ1bmN0aW9uIHAoZSl7dmFyIHQ9ZS5sYW5ndWFnZXx8XCJlblwiO3JldHVybiBlLnRyYW5zbGF0aW9uTWV0YWRhdGEudHJhbnNsYXRpb25zW3RdJiZlLnRyYW5zbGF0aW9uTWV0YWRhdGEudHJhbnNsYXRpb25zW3RdLmlzUlRMfHwhMX1mdW5jdGlvbiBnKGUpe3JldHVybiBwKGUpP1wicnRsXCI6XCJsdHJcIn1mdW5jdGlvbiB2KGUpe3JldHVybiBkKGUuZW50aXR5X2lkKX1mdW5jdGlvbiBiKGUsdCxzKXtpZihcInVua25vd25cIj09PXQuc3RhdGV8fFwidW5hdmFpbGFibGVcIj09PXQuc3RhdGUpcmV0dXJuIGUoXCJzdGF0ZS5kZWZhdWx0LlwiK3Quc3RhdGUpO2lmKHQuYXR0cmlidXRlcy51bml0X29mX21lYXN1cmVtZW50KXJldHVybiB0LnN0YXRlK1wiIFwiK3QuYXR0cmlidXRlcy51bml0X29mX21lYXN1cmVtZW50O3ZhciBpPXYodCk7aWYoXCJpbnB1dF9kYXRldGltZVwiPT09aSl7dmFyIG87aWYoIXQuYXR0cmlidXRlcy5oYXNfdGltZSlyZXR1cm4gbz1uZXcgRGF0ZSh0LmF0dHJpYnV0ZXMueWVhcix0LmF0dHJpYnV0ZXMubW9udGgtMSx0LmF0dHJpYnV0ZXMuZGF5KSxhKG8scyk7aWYoIXQuYXR0cmlidXRlcy5oYXNfZGF0ZSl7dmFyIGM9bmV3IERhdGU7cmV0dXJuIG89bmV3IERhdGUoYy5nZXRGdWxsWWVhcigpLGMuZ2V0TW9udGgoKSxjLmdldERheSgpLHQuYXR0cmlidXRlcy5ob3VyLHQuYXR0cmlidXRlcy5taW51dGUpLG4obyxzKX1yZXR1cm4gbz1uZXcgRGF0ZSh0LmF0dHJpYnV0ZXMueWVhcix0LmF0dHJpYnV0ZXMubW9udGgtMSx0LmF0dHJpYnV0ZXMuZGF5LHQuYXR0cmlidXRlcy5ob3VyLHQuYXR0cmlidXRlcy5taW51dGUpLHIobyxzKX1yZXR1cm4gdC5hdHRyaWJ1dGVzLmRldmljZV9jbGFzcyYmZShcImNvbXBvbmVudC5cIitpK1wiLnN0YXRlLlwiK3QuYXR0cmlidXRlcy5kZXZpY2VfY2xhc3MrXCIuXCIrdC5zdGF0ZSl8fGUoXCJjb21wb25lbnQuXCIraStcIi5zdGF0ZS5fLlwiK3Quc3RhdGUpfHx0LnN0YXRlfXZhciBfPVwiaGFzczpib29rbWFya1wiLHc9XCJsb3ZlbGFjZVwiLHk9W1wiY2xpbWF0ZVwiLFwiY292ZXJcIixcImNvbmZpZ3VyYXRvclwiLFwiaW5wdXRfc2VsZWN0XCIsXCJpbnB1dF9udW1iZXJcIixcImlucHV0X3RleHRcIixcImxvY2tcIixcIm1lZGlhX3BsYXllclwiLFwic2NlbmVcIixcInNjcmlwdFwiLFwidGltZXJcIixcInZhY3V1bVwiLFwid2F0ZXJfaGVhdGVyXCIsXCJ3ZWJsaW5rXCJdLGs9W1wiYWxhcm1fY29udHJvbF9wYW5lbFwiLFwiYXV0b21hdGlvblwiLFwiY2FtZXJhXCIsXCJjbGltYXRlXCIsXCJjb25maWd1cmF0b3JcIixcImNvdmVyXCIsXCJmYW5cIixcImdyb3VwXCIsXCJoaXN0b3J5X2dyYXBoXCIsXCJpbnB1dF9kYXRldGltZVwiLFwibGlnaHRcIixcImxvY2tcIixcIm1lZGlhX3BsYXllclwiLFwic2NyaXB0XCIsXCJzdW5cIixcInVwZGF0ZXJcIixcInZhY3V1bVwiLFwid2F0ZXJfaGVhdGVyXCIsXCJ3ZWF0aGVyXCJdLFM9W1wiaW5wdXRfbnVtYmVyXCIsXCJpbnB1dF9zZWxlY3RcIixcImlucHV0X3RleHRcIixcInNjZW5lXCIsXCJ3ZWJsaW5rXCJdLHg9W1wiY2FtZXJhXCIsXCJjb25maWd1cmF0b3JcIixcImhpc3RvcnlfZ3JhcGhcIixcInNjZW5lXCJdLEQ9W1wiY2xvc2VkXCIsXCJsb2NrZWRcIixcIm9mZlwiXSxUPW5ldyBTZXQoW1wiZmFuXCIsXCJpbnB1dF9ib29sZWFuXCIsXCJsaWdodFwiLFwic3dpdGNoXCIsXCJncm91cFwiLFwiYXV0b21hdGlvblwiXSksRT1cIsKwQ1wiLE09XCLCsEZcIixxPVwiZ3JvdXAuZGVmYXVsdF92aWV3XCIsQz1mdW5jdGlvbihlLHQsYSxyKXtyPXJ8fHt9LGE9bnVsbD09YT97fTphO3ZhciBuPW5ldyBFdmVudCh0LHtidWJibGVzOnZvaWQgMD09PXIuYnViYmxlc3x8ci5idWJibGVzLGNhbmNlbGFibGU6Qm9vbGVhbihyLmNhbmNlbGFibGUpLGNvbXBvc2VkOnZvaWQgMD09PXIuY29tcG9zZWR8fHIuY29tcG9zZWR9KTtyZXR1cm4gbi5kZXRhaWw9YSxlLmRpc3BhdGNoRXZlbnQobiksbn0sUj1uZXcgU2V0KFtcImNhbGwtc2VydmljZVwiLFwiZGl2aWRlclwiLFwic2VjdGlvblwiLFwid2VibGlua1wiLFwiY2FzdFwiLFwic2VsZWN0XCJdKSxBPXthbGVydDpcInRvZ2dsZVwiLGF1dG9tYXRpb246XCJ0b2dnbGVcIixjbGltYXRlOlwiY2xpbWF0ZVwiLGNvdmVyOlwiY292ZXJcIixmYW46XCJ0b2dnbGVcIixncm91cDpcImdyb3VwXCIsaW5wdXRfYm9vbGVhbjpcInRvZ2dsZVwiLGlucHV0X251bWJlcjpcImlucHV0LW51bWJlclwiLGlucHV0X3NlbGVjdDpcImlucHV0LXNlbGVjdFwiLGlucHV0X3RleHQ6XCJpbnB1dC10ZXh0XCIsbGlnaHQ6XCJ0b2dnbGVcIixsb2NrOlwibG9ja1wiLG1lZGlhX3BsYXllcjpcIm1lZGlhLXBsYXllclwiLHJlbW90ZTpcInRvZ2dsZVwiLHNjZW5lOlwic2NlbmVcIixzY3JpcHQ6XCJzY3JpcHRcIixzZW5zb3I6XCJzZW5zb3JcIix0aW1lcjpcInRpbWVyXCIsc3dpdGNoOlwidG9nZ2xlXCIsdmFjdXVtOlwidG9nZ2xlXCIsd2F0ZXJfaGVhdGVyOlwiY2xpbWF0ZVwiLGlucHV0X2RhdGV0aW1lOlwiaW5wdXQtZGF0ZXRpbWVcIn0sTD1mdW5jdGlvbihlLHQpe3ZvaWQgMD09PXQmJih0PSExKTt2YXIgYT1mdW5jdGlvbihlLHQpe3JldHVybiByKFwiaHVpLWVycm9yLWNhcmRcIix7dHlwZTpcImVycm9yXCIsZXJyb3I6ZSxjb25maWc6dH0pfSxyPWZ1bmN0aW9uKGUsdCl7dmFyIHI9d2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZSk7dHJ5e3Iuc2V0Q29uZmlnKHQpfWNhdGNoKHIpe3JldHVybiBjb25zb2xlLmVycm9yKGUsciksYShyLm1lc3NhZ2UsdCl9cmV0dXJuIHJ9O2lmKCFlfHxcIm9iamVjdFwiIT10eXBlb2YgZXx8IXQmJiFlLnR5cGUpcmV0dXJuIGEoXCJObyB0eXBlIGRlZmluZWRcIixlKTt2YXIgbj1lLnR5cGU7aWYobiYmbi5zdGFydHNXaXRoKFwiY3VzdG9tOlwiKSluPW4uc3Vic3RyKFwiY3VzdG9tOlwiLmxlbmd0aCk7ZWxzZSBpZih0KWlmKFIuaGFzKG4pKW49XCJodWktXCIrbitcIi1yb3dcIjtlbHNle2lmKCFlLmVudGl0eSlyZXR1cm4gYShcIkludmFsaWQgY29uZmlnIGdpdmVuLlwiLGUpO3ZhciBzPWUuZW50aXR5LnNwbGl0KFwiLlwiLDEpWzBdO249XCJodWktXCIrKEFbc118fFwidGV4dFwiKStcIi1lbnRpdHktcm93XCJ9ZWxzZSBuPVwiaHVpLVwiK24rXCItY2FyZFwiO2lmKGN1c3RvbUVsZW1lbnRzLmdldChuKSlyZXR1cm4gcihuLGUpO3ZhciBpPWEoXCJDdXN0b20gZWxlbWVudCBkb2Vzbid0IGV4aXN0OiBcIitlLnR5cGUrXCIuXCIsZSk7aS5zdHlsZS5kaXNwbGF5PVwiTm9uZVwiO3ZhciBvPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtpLnN0eWxlLmRpc3BsYXk9XCJcIn0sMmUzKTtyZXR1cm4gY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoZS50eXBlKS50aGVuKGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KG8pLEMoaSxcImxsLXJlYnVpbGRcIix7fSxpKX0pLGl9LE49e2FsZXJ0OlwiaGFzczphbGVydFwiLGF1dG9tYXRpb246XCJoYXNzOnBsYXlsaXN0LXBsYXlcIixjYWxlbmRhcjpcImhhc3M6Y2FsZW5kYXJcIixjYW1lcmE6XCJoYXNzOnZpZGVvXCIsY2xpbWF0ZTpcImhhc3M6dGhlcm1vc3RhdFwiLGNvbmZpZ3VyYXRvcjpcImhhc3M6c2V0dGluZ3NcIixjb252ZXJzYXRpb246XCJoYXNzOnRleHQtdG8tc3BlZWNoXCIsZGV2aWNlX3RyYWNrZXI6XCJoYXNzOmFjY291bnRcIixmYW46XCJoYXNzOmZhblwiLGdyb3VwOlwiaGFzczpnb29nbGUtY2lyY2xlcy1jb21tdW5pdGllc1wiLGhpc3RvcnlfZ3JhcGg6XCJoYXNzOmNoYXJ0LWxpbmVcIixob21lYXNzaXN0YW50OlwiaGFzczpob21lLWFzc2lzdGFudFwiLGhvbWVraXQ6XCJoYXNzOmhvbWUtYXV0b21hdGlvblwiLGltYWdlX3Byb2Nlc3Npbmc6XCJoYXNzOmltYWdlLWZpbHRlci1mcmFtZXNcIixpbnB1dF9ib29sZWFuOlwiaGFzczpkcmF3aW5nXCIsaW5wdXRfZGF0ZXRpbWU6XCJoYXNzOmNhbGVuZGFyLWNsb2NrXCIsaW5wdXRfbnVtYmVyOlwiaGFzczpyYXktdmVydGV4XCIsaW5wdXRfc2VsZWN0OlwiaGFzczpmb3JtYXQtbGlzdC1idWxsZXRlZFwiLGlucHV0X3RleHQ6XCJoYXNzOnRleHRib3hcIixsaWdodDpcImhhc3M6bGlnaHRidWxiXCIsbWFpbGJveDpcImhhc3M6bWFpbGJveFwiLG5vdGlmeTpcImhhc3M6Y29tbWVudC1hbGVydFwiLHBlcnNvbjpcImhhc3M6YWNjb3VudFwiLHBsYW50OlwiaGFzczpmbG93ZXJcIixwcm94aW1pdHk6XCJoYXNzOmFwcGxlLXNhZmFyaVwiLHJlbW90ZTpcImhhc3M6cmVtb3RlXCIsc2NlbmU6XCJoYXNzOmdvb2dsZS1wYWdlc1wiLHNjcmlwdDpcImhhc3M6ZmlsZS1kb2N1bWVudFwiLHNlbnNvcjpcImhhc3M6ZXllXCIsc2ltcGxlX2FsYXJtOlwiaGFzczpiZWxsXCIsc3VuOlwiaGFzczp3aGl0ZS1iYWxhbmNlLXN1bm55XCIsc3dpdGNoOlwiaGFzczpmbGFzaFwiLHRpbWVyOlwiaGFzczp0aW1lclwiLHVwZGF0ZXI6XCJoYXNzOmNsb3VkLXVwbG9hZFwiLHZhY3V1bTpcImhhc3M6cm9ib3QtdmFjdXVtXCIsd2F0ZXJfaGVhdGVyOlwiaGFzczp0aGVybW9tZXRlclwiLHdlYmxpbms6XCJoYXNzOm9wZW4taW4tbmV3XCJ9O2Z1bmN0aW9uIE8oZSx0KXtpZihlIGluIE4pcmV0dXJuIE5bZV07c3dpdGNoKGUpe2Nhc2VcImFsYXJtX2NvbnRyb2xfcGFuZWxcIjpzd2l0Y2godCl7Y2FzZVwiYXJtZWRfaG9tZVwiOnJldHVyblwiaGFzczpiZWxsLXBsdXNcIjtjYXNlXCJhcm1lZF9uaWdodFwiOnJldHVyblwiaGFzczpiZWxsLXNsZWVwXCI7Y2FzZVwiZGlzYXJtZWRcIjpyZXR1cm5cImhhc3M6YmVsbC1vdXRsaW5lXCI7Y2FzZVwidHJpZ2dlcmVkXCI6cmV0dXJuXCJoYXNzOmJlbGwtcmluZ1wiO2RlZmF1bHQ6cmV0dXJuXCJoYXNzOmJlbGxcIn1jYXNlXCJiaW5hcnlfc2Vuc29yXCI6cmV0dXJuIHQmJlwib2ZmXCI9PT10P1wiaGFzczpyYWRpb2JveC1ibGFua1wiOlwiaGFzczpjaGVja2JveC1tYXJrZWQtY2lyY2xlXCI7Y2FzZVwiY292ZXJcIjpyZXR1cm5cImNsb3NlZFwiPT09dD9cImhhc3M6d2luZG93LWNsb3NlZFwiOlwiaGFzczp3aW5kb3ctb3BlblwiO2Nhc2VcImxvY2tcIjpyZXR1cm4gdCYmXCJ1bmxvY2tlZFwiPT09dD9cImhhc3M6bG9jay1vcGVuXCI6XCJoYXNzOmxvY2tcIjtjYXNlXCJtZWRpYV9wbGF5ZXJcIjpyZXR1cm4gdCYmXCJvZmZcIiE9PXQmJlwiaWRsZVwiIT09dD9cImhhc3M6Y2FzdC1jb25uZWN0ZWRcIjpcImhhc3M6Y2FzdFwiO2Nhc2VcInp3YXZlXCI6c3dpdGNoKHQpe2Nhc2VcImRlYWRcIjpyZXR1cm5cImhhc3M6ZW1vdGljb24tZGVhZFwiO2Nhc2VcInNsZWVwaW5nXCI6cmV0dXJuXCJoYXNzOnNsZWVwXCI7Y2FzZVwiaW5pdGlhbGl6aW5nXCI6cmV0dXJuXCJoYXNzOnRpbWVyLXNhbmRcIjtkZWZhdWx0OnJldHVyblwiaGFzczp6LXdhdmVcIn1kZWZhdWx0OnJldHVybiBjb25zb2xlLndhcm4oXCJVbmFibGUgdG8gZmluZCBpY29uIGZvciBkb21haW4gXCIrZStcIiAoXCIrdCtcIilcIiksX319dmFyIGo9ZnVuY3Rpb24oZSx0KXt2YXIgYT10LnZhbHVlfHx0LHI9dC5hdHRyaWJ1dGU/ZS5hdHRyaWJ1dGVzW3QuYXR0cmlidXRlXTplLnN0YXRlO3N3aXRjaCh0Lm9wZXJhdG9yfHxcIj09XCIpe2Nhc2VcIj09XCI6cmV0dXJuIHI9PT1hO2Nhc2VcIjw9XCI6cmV0dXJuIHI8PWE7Y2FzZVwiPFwiOnJldHVybiByPGE7Y2FzZVwiPj1cIjpyZXR1cm4gcj49YTtjYXNlXCI+XCI6cmV0dXJuIHI+YTtjYXNlXCIhPVwiOnJldHVybiByIT09YTtjYXNlXCJyZWdleFwiOnJldHVybiByLm1hdGNoKGEpO2RlZmF1bHQ6cmV0dXJuITF9fSx6PWZ1bmN0aW9uKGUpe0Mod2luZG93LFwiaGFwdGljXCIsZSl9LEY9ZnVuY3Rpb24oZSx0LGEpe3ZvaWQgMD09PWEmJihhPSExKSxhP2hpc3RvcnkucmVwbGFjZVN0YXRlKG51bGwsXCJcIix0KTpoaXN0b3J5LnB1c2hTdGF0ZShudWxsLFwiXCIsdCksQyh3aW5kb3csXCJsb2NhdGlvbi1jaGFuZ2VkXCIse3JlcGxhY2U6YX0pfSxJPWZ1bmN0aW9uKGUsdCxhKXt2b2lkIDA9PT1hJiYoYT0hMCk7dmFyIHIsbj1kKHQpLHM9XCJncm91cFwiPT09bj9cImhvbWVhc3Npc3RhbnRcIjpuO3N3aXRjaChuKXtjYXNlXCJsb2NrXCI6cj1hP1widW5sb2NrXCI6XCJsb2NrXCI7YnJlYWs7Y2FzZVwiY292ZXJcIjpyPWE/XCJvcGVuX2NvdmVyXCI6XCJjbG9zZV9jb3ZlclwiO2JyZWFrO2RlZmF1bHQ6cj1hP1widHVybl9vblwiOlwidHVybl9vZmZcIn1yZXR1cm4gZS5jYWxsU2VydmljZShzLHIse2VudGl0eV9pZDp0fSl9LEI9ZnVuY3Rpb24oZSx0KXt2YXIgYT1ELmluY2x1ZGVzKGUuc3RhdGVzW3RdLnN0YXRlKTtyZXR1cm4gSShlLHQsYSl9LFU9ZnVuY3Rpb24oZSx0LGEscil7dmFyIG47aWYoXCJkb3VibGVfdGFwXCI9PT1yJiZhLmRvdWJsZV90YXBfYWN0aW9uP249YS5kb3VibGVfdGFwX2FjdGlvbjpcImhvbGRcIj09PXImJmEuaG9sZF9hY3Rpb24/bj1hLmhvbGRfYWN0aW9uOlwidGFwXCI9PT1yJiZhLnRhcF9hY3Rpb24mJihuPWEudGFwX2FjdGlvbiksbnx8KG49e2FjdGlvbjpcIm1vcmUtaW5mb1wifSksIW4uY29uZmlybWF0aW9ufHxuLmNvbmZpcm1hdGlvbi5leGVtcHRpb25zJiZuLmNvbmZpcm1hdGlvbi5leGVtcHRpb25zLnNvbWUoZnVuY3Rpb24oZSl7cmV0dXJuIGUudXNlcj09PXQudXNlci5pZH0pfHwoeihcIndhcm5pbmdcIiksY29uZmlybShuLmNvbmZpcm1hdGlvbi50ZXh0fHxcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBcIituLmFjdGlvbitcIj9cIikpKXN3aXRjaChuLmFjdGlvbil7Y2FzZVwibW9yZS1pbmZvXCI6KGEuZW50aXR5fHxhLmNhbWVyYV9pbWFnZSkmJkMoZSxcImhhc3MtbW9yZS1pbmZvXCIse2VudGl0eUlkOmEuZW50aXR5P2EuZW50aXR5OmEuY2FtZXJhX2ltYWdlfSk7YnJlYWs7Y2FzZVwibmF2aWdhdGVcIjpuLm5hdmlnYXRpb25fcGF0aCYmRigwLG4ubmF2aWdhdGlvbl9wYXRoKTticmVhaztjYXNlXCJ1cmxcIjpuLnVybF9wYXRoJiZ3aW5kb3cub3BlbihuLnVybF9wYXRoKTticmVhaztjYXNlXCJ0b2dnbGVcIjphLmVudGl0eSYmKEIodCxhLmVudGl0eSkseihcInN1Y2Nlc3NcIikpO2JyZWFrO2Nhc2VcImNhbGwtc2VydmljZVwiOmlmKCFuLnNlcnZpY2UpcmV0dXJuIHZvaWQgeihcImZhaWx1cmVcIik7dmFyIHM9bi5zZXJ2aWNlLnNwbGl0KFwiLlwiLDIpO3QuY2FsbFNlcnZpY2Uoc1swXSxzWzFdLG4uc2VydmljZV9kYXRhKSx6KFwic3VjY2Vzc1wiKX19LFY9ZnVuY3Rpb24oZSx0LGEscixuKXt2YXIgcztpZihuJiZhLmRvdWJsZV90YXBfYWN0aW9uP3M9YS5kb3VibGVfdGFwX2FjdGlvbjpyJiZhLmhvbGRfYWN0aW9uP3M9YS5ob2xkX2FjdGlvbjohciYmYS50YXBfYWN0aW9uJiYocz1hLnRhcF9hY3Rpb24pLHN8fChzPXthY3Rpb246XCJtb3JlLWluZm9cIn0pLCFzLmNvbmZpcm1hdGlvbnx8cy5jb25maXJtYXRpb24uZXhlbXB0aW9ucyYmcy5jb25maXJtYXRpb24uZXhlbXB0aW9ucy5zb21lKGZ1bmN0aW9uKGUpe3JldHVybiBlLnVzZXI9PT10LnVzZXIuaWR9KXx8Y29uZmlybShzLmNvbmZpcm1hdGlvbi50ZXh0fHxcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBcIitzLmFjdGlvbitcIj9cIikpc3dpdGNoKHMuYWN0aW9uKXtjYXNlXCJtb3JlLWluZm9cIjoocy5lbnRpdHl8fGEuZW50aXR5fHxhLmNhbWVyYV9pbWFnZSkmJihDKGUsXCJoYXNzLW1vcmUtaW5mb1wiLHtlbnRpdHlJZDpzLmVudGl0eT9zLmVudGl0eTphLmVudGl0eT9hLmVudGl0eTphLmNhbWVyYV9pbWFnZX0pLHMuaGFwdGljJiZ6KHMuaGFwdGljKSk7YnJlYWs7Y2FzZVwibmF2aWdhdGVcIjpzLm5hdmlnYXRpb25fcGF0aCYmKEYoMCxzLm5hdmlnYXRpb25fcGF0aCkscy5oYXB0aWMmJnoocy5oYXB0aWMpKTticmVhaztjYXNlXCJ1cmxcIjpzLnVybF9wYXRoJiZ3aW5kb3cub3BlbihzLnVybF9wYXRoKSxzLmhhcHRpYyYmeihzLmhhcHRpYyk7YnJlYWs7Y2FzZVwidG9nZ2xlXCI6YS5lbnRpdHkmJihCKHQsYS5lbnRpdHkpLHMuaGFwdGljJiZ6KHMuaGFwdGljKSk7YnJlYWs7Y2FzZVwiY2FsbC1zZXJ2aWNlXCI6aWYoIXMuc2VydmljZSlyZXR1cm47dmFyIGk9cy5zZXJ2aWNlLnNwbGl0KFwiLlwiLDIpLG89aVswXSxjPWlbMV0sdT1PYmplY3QuYXNzaWduKHt9LHMuc2VydmljZV9kYXRhKTtcImVudGl0eVwiPT09dS5lbnRpdHlfaWQmJih1LmVudGl0eV9pZD1hLmVudGl0eSksdC5jYWxsU2VydmljZShvLGMsdSkscy5oYXB0aWMmJnoocy5oYXB0aWMpfX07ZnVuY3Rpb24gVyhlKXtyZXR1cm4gdm9pZCAwIT09ZSYmXCJub25lXCIhPT1lLmFjdGlvbn1mdW5jdGlvbiBZKGUsdCxhKXtpZih0LmhhcyhcImNvbmZpZ1wiKXx8YSlyZXR1cm4hMDtpZihlLmNvbmZpZy5lbnRpdHkpe3ZhciByPXQuZ2V0KFwiaGFzc1wiKTtyZXR1cm4hcnx8ci5zdGF0ZXNbZS5jb25maWcuZW50aXR5XSE9PWUuaGFzcy5zdGF0ZXNbZS5jb25maWcuZW50aXR5XX1yZXR1cm4hMX1mdW5jdGlvbiBHKGUpe3JldHVybiB2b2lkIDAhPT1lJiZcIm5vbmVcIiE9PWUuYWN0aW9ufXZhciBIPWZ1bmN0aW9uKGUsdCxhKXt2b2lkIDA9PT1hJiYoYT0hMCk7dmFyIHI9e307dC5mb3JFYWNoKGZ1bmN0aW9uKHQpe2lmKEQuaW5jbHVkZXMoZS5zdGF0ZXNbdF0uc3RhdGUpPT09YSl7dmFyIG49ZCh0KSxzPVtcImNvdmVyXCIsXCJsb2NrXCJdLmluY2x1ZGVzKG4pP246XCJob21lYXNzaXN0YW50XCI7cyBpbiByfHwocltzXT1bXSkscltzXS5wdXNoKHQpfX0pLE9iamVjdC5rZXlzKHIpLmZvckVhY2goZnVuY3Rpb24odCl7dmFyIG47c3dpdGNoKHQpe2Nhc2VcImxvY2tcIjpuPWE/XCJ1bmxvY2tcIjpcImxvY2tcIjticmVhaztjYXNlXCJjb3ZlclwiOm49YT9cIm9wZW5fY292ZXJcIjpcImNsb3NlX2NvdmVyXCI7YnJlYWs7ZGVmYXVsdDpuPWE/XCJ0dXJuX29uXCI6XCJ0dXJuX29mZlwifWUuY2FsbFNlcnZpY2UodCxuLHtlbnRpdHlfaWQ6clt0XX0pfSl9LEo9ZnVuY3Rpb24oKXt2YXIgZT1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaG9tZS1hc3Npc3RhbnRcIik7aWYoZT0oZT0oZT0oZT0oZT0oZT0oZT0oZT1lJiZlLnNoYWRvd1Jvb3QpJiZlLnF1ZXJ5U2VsZWN0b3IoXCJob21lLWFzc2lzdGFudC1tYWluXCIpKSYmZS5zaGFkb3dSb290KSYmZS5xdWVyeVNlbGVjdG9yKFwiYXBwLWRyYXdlci1sYXlvdXQgcGFydGlhbC1wYW5lbC1yZXNvbHZlclwiKSkmJmUuc2hhZG93Um9vdHx8ZSkmJmUucXVlcnlTZWxlY3RvcihcImhhLXBhbmVsLWxvdmVsYWNlXCIpKSYmZS5zaGFkb3dSb290KSYmZS5xdWVyeVNlbGVjdG9yKFwiaHVpLXJvb3RcIikpe3ZhciB0PWUubG92ZWxhY2U7cmV0dXJuIHQuY3VycmVudF92aWV3PWUuX19fY3VyVmlldyx0fXJldHVybiBudWxsfSxLPXtodW1pZGl0eTpcImhhc3M6d2F0ZXItcGVyY2VudFwiLGlsbHVtaW5hbmNlOlwiaGFzczpicmlnaHRuZXNzLTVcIix0ZW1wZXJhdHVyZTpcImhhc3M6dGhlcm1vbWV0ZXJcIixwcmVzc3VyZTpcImhhc3M6Z2F1Z2VcIixwb3dlcjpcImhhc3M6Zmxhc2hcIixzaWduYWxfc3RyZW5ndGg6XCJoYXNzOndpZmlcIn0sUD17YmluYXJ5X3NlbnNvcjpmdW5jdGlvbihlKXt2YXIgdD1lLnN0YXRlJiZcIm9mZlwiPT09ZS5zdGF0ZTtzd2l0Y2goZS5hdHRyaWJ1dGVzLmRldmljZV9jbGFzcyl7Y2FzZVwiYmF0dGVyeVwiOnJldHVybiB0P1wiaGFzczpiYXR0ZXJ5XCI6XCJoYXNzOmJhdHRlcnktb3V0bGluZVwiO2Nhc2VcImNvbGRcIjpyZXR1cm4gdD9cImhhc3M6dGhlcm1vbWV0ZXJcIjpcImhhc3M6c25vd2ZsYWtlXCI7Y2FzZVwiY29ubmVjdGl2aXR5XCI6cmV0dXJuIHQ/XCJoYXNzOnNlcnZlci1uZXR3b3JrLW9mZlwiOlwiaGFzczpzZXJ2ZXItbmV0d29ya1wiO2Nhc2VcImRvb3JcIjpyZXR1cm4gdD9cImhhc3M6ZG9vci1jbG9zZWRcIjpcImhhc3M6ZG9vci1vcGVuXCI7Y2FzZVwiZ2FyYWdlX2Rvb3JcIjpyZXR1cm4gdD9cImhhc3M6Z2FyYWdlXCI6XCJoYXNzOmdhcmFnZS1vcGVuXCI7Y2FzZVwiZ2FzXCI6Y2FzZVwicG93ZXJcIjpjYXNlXCJwcm9ibGVtXCI6Y2FzZVwic2FmZXR5XCI6Y2FzZVwic21va2VcIjpyZXR1cm4gdD9cImhhc3M6c2hpZWxkLWNoZWNrXCI6XCJoYXNzOmFsZXJ0XCI7Y2FzZVwiaGVhdFwiOnJldHVybiB0P1wiaGFzczp0aGVybW9tZXRlclwiOlwiaGFzczpmaXJlXCI7Y2FzZVwibGlnaHRcIjpyZXR1cm4gdD9cImhhc3M6YnJpZ2h0bmVzcy01XCI6XCJoYXNzOmJyaWdodG5lc3MtN1wiO2Nhc2VcImxvY2tcIjpyZXR1cm4gdD9cImhhc3M6bG9ja1wiOlwiaGFzczpsb2NrLW9wZW5cIjtjYXNlXCJtb2lzdHVyZVwiOnJldHVybiB0P1wiaGFzczp3YXRlci1vZmZcIjpcImhhc3M6d2F0ZXJcIjtjYXNlXCJtb3Rpb25cIjpyZXR1cm4gdD9cImhhc3M6d2Fsa1wiOlwiaGFzczpydW5cIjtjYXNlXCJvY2N1cGFuY3lcIjpyZXR1cm4gdD9cImhhc3M6aG9tZS1vdXRsaW5lXCI6XCJoYXNzOmhvbWVcIjtjYXNlXCJvcGVuaW5nXCI6cmV0dXJuIHQ/XCJoYXNzOnNxdWFyZVwiOlwiaGFzczpzcXVhcmUtb3V0bGluZVwiO2Nhc2VcInBsdWdcIjpyZXR1cm4gdD9cImhhc3M6cG93ZXItcGx1Zy1vZmZcIjpcImhhc3M6cG93ZXItcGx1Z1wiO2Nhc2VcInByZXNlbmNlXCI6cmV0dXJuIHQ/XCJoYXNzOmhvbWUtb3V0bGluZVwiOlwiaGFzczpob21lXCI7Y2FzZVwic291bmRcIjpyZXR1cm4gdD9cImhhc3M6bXVzaWMtbm90ZS1vZmZcIjpcImhhc3M6bXVzaWMtbm90ZVwiO2Nhc2VcInZpYnJhdGlvblwiOnJldHVybiB0P1wiaGFzczpjcm9wLXBvcnRyYWl0XCI6XCJoYXNzOnZpYnJhdGVcIjtjYXNlXCJ3aW5kb3dcIjpyZXR1cm4gdD9cImhhc3M6d2luZG93LWNsb3NlZFwiOlwiaGFzczp3aW5kb3ctb3BlblwiO2RlZmF1bHQ6cmV0dXJuIHQ/XCJoYXNzOnJhZGlvYm94LWJsYW5rXCI6XCJoYXNzOmNoZWNrYm94LW1hcmtlZC1jaXJjbGVcIn19LGNvdmVyOmZ1bmN0aW9uKGUpe3ZhciB0PVwiY2xvc2VkXCIhPT1lLnN0YXRlO3N3aXRjaChlLmF0dHJpYnV0ZXMuZGV2aWNlX2NsYXNzKXtjYXNlXCJnYXJhZ2VcIjpyZXR1cm4gdD9cImhhc3M6Z2FyYWdlLW9wZW5cIjpcImhhc3M6Z2FyYWdlXCI7Y2FzZVwiZG9vclwiOnJldHVybiB0P1wiaGFzczpkb29yLW9wZW5cIjpcImhhc3M6ZG9vci1jbG9zZWRcIjtjYXNlXCJzaHV0dGVyXCI6cmV0dXJuIHQ/XCJoYXNzOndpbmRvdy1zaHV0dGVyLW9wZW5cIjpcImhhc3M6d2luZG93LXNodXR0ZXJcIjtjYXNlXCJibGluZFwiOnJldHVybiB0P1wiaGFzczpibGluZHMtb3BlblwiOlwiaGFzczpibGluZHNcIjtjYXNlXCJ3aW5kb3dcIjpyZXR1cm4gdD9cImhhc3M6d2luZG93LW9wZW5cIjpcImhhc3M6d2luZG93LWNsb3NlZFwiO2RlZmF1bHQ6cmV0dXJuIE8oXCJjb3ZlclwiLGUuc3RhdGUpfX0sc2Vuc29yOmZ1bmN0aW9uKGUpe3ZhciB0PWUuYXR0cmlidXRlcy5kZXZpY2VfY2xhc3M7aWYodCYmdCBpbiBLKXJldHVybiBLW3RdO2lmKFwiYmF0dGVyeVwiPT09dCl7dmFyIGE9TnVtYmVyKGUuc3RhdGUpO2lmKGlzTmFOKGEpKXJldHVyblwiaGFzczpiYXR0ZXJ5LXVua25vd25cIjt2YXIgcj0xMCpNYXRoLnJvdW5kKGEvMTApO3JldHVybiByPj0xMDA/XCJoYXNzOmJhdHRlcnlcIjpyPD0wP1wiaGFzczpiYXR0ZXJ5LWFsZXJ0XCI6XCJoYXNzOmJhdHRlcnktXCIrcn12YXIgbj1lLmF0dHJpYnV0ZXMudW5pdF9vZl9tZWFzdXJlbWVudDtyZXR1cm5cIsKwQ1wiPT09bnx8XCLCsEZcIj09PW4/XCJoYXNzOnRoZXJtb21ldGVyXCI6TyhcInNlbnNvclwiKX0saW5wdXRfZGF0ZXRpbWU6ZnVuY3Rpb24oZSl7cmV0dXJuIGUuYXR0cmlidXRlcy5oYXNfZGF0ZT9lLmF0dHJpYnV0ZXMuaGFzX3RpbWU/TyhcImlucHV0X2RhdGV0aW1lXCIpOlwiaGFzczpjYWxlbmRhclwiOlwiaGFzczpjbG9ja1wifX0sUT1mdW5jdGlvbihlKXtpZighZSlyZXR1cm4gXztpZihlLmF0dHJpYnV0ZXMuaWNvbilyZXR1cm4gZS5hdHRyaWJ1dGVzLmljb247dmFyIHQ9ZChlLmVudGl0eV9pZCk7cmV0dXJuIHQgaW4gUD9QW3RdKGUpOk8odCxlLnN0YXRlKX07ZXhwb3J0e3QgYXMgZHVyYXRpb25Ub1NlY29uZHMsYSBhcyBmb3JtYXREYXRlLHIgYXMgZm9ybWF0RGF0ZVRpbWUsbiBhcyBmb3JtYXRUaW1lLG8gYXMgcmVsYXRpdmVUaW1lLHUgYXMgc2Vjb25kc1RvRHVyYXRpb24sbCBhcyB0aW1lclRpbWVSZW1haW5pbmcsaCBhcyBhcHBseVRoZW1lc09uRWxlbWVudCxtIGFzIGNvbXB1dGVDYXJkU2l6ZSxkIGFzIGNvbXB1dGVEb21haW4sZiBhcyBjb21wdXRlRW50aXR5LHAgYXMgY29tcHV0ZVJUTCxnIGFzIGNvbXB1dGVSVExEaXJlY3Rpb24sYiBhcyBjb21wdXRlU3RhdGVEaXNwbGF5LHYgYXMgY29tcHV0ZVN0YXRlRG9tYWluLF8gYXMgREVGQVVMVF9ET01BSU5fSUNPTix3IGFzIERFRkFVTFRfUEFORUwseSBhcyBET01BSU5TX1dJVEhfQ0FSRCxrIGFzIERPTUFJTlNfV0lUSF9NT1JFX0lORk8sUyBhcyBET01BSU5TX0hJREVfTU9SRV9JTkZPLHggYXMgRE9NQUlOU19NT1JFX0lORk9fTk9fSElTVE9SWSxEIGFzIFNUQVRFU19PRkYsVCBhcyBET01BSU5TX1RPR0dMRSxFIGFzIFVOSVRfQyxNIGFzIFVOSVRfRixxIGFzIERFRkFVTFRfVklFV19FTlRJVFlfSUQsTCBhcyBjcmVhdGVUaGluZyxOIGFzIGZpeGVkSWNvbnMsTyBhcyBkb21haW5JY29uLGogYXMgZXZhbHVhdGVGaWx0ZXIsQyBhcyBmaXJlRXZlbnQsVSBhcyBoYW5kbGVBY3Rpb24sViBhcyBoYW5kbGVDbGljayx6IGFzIGZvcndhcmRIYXB0aWMsVyBhcyBoYXNBY3Rpb24sWSBhcyBoYXNDb25maWdPckVudGl0eUNoYW5nZWQsRyBhcyBoYXNEb3VibGVDbGljayxGIGFzIG5hdmlnYXRlLEIgYXMgdG9nZ2xlRW50aXR5LEggYXMgdHVybk9uT2ZmRW50aXRpZXMsSSBhcyB0dXJuT25PZmZFbnRpdHksSiBhcyBnZXRMb3ZlbGFjZSxRIGFzIHN0YXRlSWNvbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5tLmpzLm1hcFxuIiwiZXhwb3J0IGZ1bmN0aW9uIGJvdW5kMDEobiwgbWF4KSB7XG4gICAgaWYgKGlzT25lUG9pbnRaZXJvKG4pKSB7XG4gICAgICAgIG4gPSAnMTAwJSc7XG4gICAgfVxuICAgIHZhciBwcm9jZXNzUGVyY2VudCA9IGlzUGVyY2VudGFnZShuKTtcbiAgICBuID0gbWF4ID09PSAzNjAgPyBuIDogTWF0aC5taW4obWF4LCBNYXRoLm1heCgwLCBwYXJzZUZsb2F0KG4pKSk7XG4gICAgaWYgKHByb2Nlc3NQZXJjZW50KSB7XG4gICAgICAgIG4gPSBwYXJzZUludChTdHJpbmcobiAqIG1heCksIDEwKSAvIDEwMDtcbiAgICB9XG4gICAgaWYgKE1hdGguYWJzKG4gLSBtYXgpIDwgMC4wMDAwMDEpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIGlmIChtYXggPT09IDM2MCkge1xuICAgICAgICBuID0gKG4gPCAwID8gKG4gJSBtYXgpICsgbWF4IDogbiAlIG1heCkgLyBwYXJzZUZsb2F0KFN0cmluZyhtYXgpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG4gPSAobiAlIG1heCkgLyBwYXJzZUZsb2F0KFN0cmluZyhtYXgpKTtcbiAgICB9XG4gICAgcmV0dXJuIG47XG59XG5leHBvcnQgZnVuY3Rpb24gY2xhbXAwMSh2YWwpIHtcbiAgICByZXR1cm4gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgdmFsKSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNPbmVQb2ludFplcm8obikge1xuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ3N0cmluZycgJiYgbi5pbmNsdWRlcygnLicpICYmIHBhcnNlRmxvYXQobikgPT09IDE7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNQZXJjZW50YWdlKG4pIHtcbiAgICByZXR1cm4gdHlwZW9mIG4gPT09ICdzdHJpbmcnICYmIG4uaW5jbHVkZXMoJyUnKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBib3VuZEFscGhhKGEpIHtcbiAgICBhID0gcGFyc2VGbG9hdChhKTtcbiAgICBpZiAoaXNOYU4oYSkgfHwgYSA8IDAgfHwgYSA+IDEpIHtcbiAgICAgICAgYSA9IDE7XG4gICAgfVxuICAgIHJldHVybiBhO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUb1BlcmNlbnRhZ2Uobikge1xuICAgIGlmIChuIDw9IDEpIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcihuKSAqIDEwMCArIFwiJVwiO1xuICAgIH1cbiAgICByZXR1cm4gbjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwYWQyKGMpIHtcbiAgICByZXR1cm4gYy5sZW5ndGggPT09IDEgPyAnMCcgKyBjIDogU3RyaW5nKGMpO1xufVxuIiwiaW1wb3J0IHsgYm91bmQwMSwgcGFkMiB9IGZyb20gJy4vdXRpbCc7XG5leHBvcnQgZnVuY3Rpb24gcmdiVG9SZ2IociwgZywgYikge1xuICAgIHJldHVybiB7XG4gICAgICAgIHI6IGJvdW5kMDEociwgMjU1KSAqIDI1NSxcbiAgICAgICAgZzogYm91bmQwMShnLCAyNTUpICogMjU1LFxuICAgICAgICBiOiBib3VuZDAxKGIsIDI1NSkgKiAyNTUsXG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZ2JUb0hzbChyLCBnLCBiKSB7XG4gICAgciA9IGJvdW5kMDEociwgMjU1KTtcbiAgICBnID0gYm91bmQwMShnLCAyNTUpO1xuICAgIGIgPSBib3VuZDAxKGIsIDI1NSk7XG4gICAgdmFyIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpO1xuICAgIHZhciBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKTtcbiAgICB2YXIgaCA9IDA7XG4gICAgdmFyIHMgPSAwO1xuICAgIHZhciBsID0gKG1heCArIG1pbikgLyAyO1xuICAgIGlmIChtYXggPT09IG1pbikge1xuICAgICAgICBzID0gMDtcbiAgICAgICAgaCA9IDA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgZCA9IG1heCAtIG1pbjtcbiAgICAgICAgcyA9IGwgPiAwLjUgPyBkIC8gKDIgLSBtYXggLSBtaW4pIDogZCAvIChtYXggKyBtaW4pO1xuICAgICAgICBzd2l0Y2ggKG1heCkge1xuICAgICAgICAgICAgY2FzZSByOlxuICAgICAgICAgICAgICAgIGggPSAoKGcgLSBiKSAvIGQpICsgKGcgPCBiID8gNiA6IDApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBnOlxuICAgICAgICAgICAgICAgIGggPSAoKGIgLSByKSAvIGQpICsgMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgYjpcbiAgICAgICAgICAgICAgICBoID0gKChyIC0gZykgLyBkKSArIDQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGggLz0gNjtcbiAgICB9XG4gICAgcmV0dXJuIHsgaDogaCwgczogcywgbDogbCB9O1xufVxuZnVuY3Rpb24gaHVlMnJnYihwLCBxLCB0KSB7XG4gICAgaWYgKHQgPCAwKSB7XG4gICAgICAgIHQgKz0gMTtcbiAgICB9XG4gICAgaWYgKHQgPiAxKSB7XG4gICAgICAgIHQgLT0gMTtcbiAgICB9XG4gICAgaWYgKHQgPCAxIC8gNikge1xuICAgICAgICByZXR1cm4gcCArICgocSAtIHApICogKDYgKiB0KSk7XG4gICAgfVxuICAgIGlmICh0IDwgMSAvIDIpIHtcbiAgICAgICAgcmV0dXJuIHE7XG4gICAgfVxuICAgIGlmICh0IDwgMiAvIDMpIHtcbiAgICAgICAgcmV0dXJuIHAgKyAoKHEgLSBwKSAqICgoMiAvIDMpIC0gdCkgKiA2KTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG59XG5leHBvcnQgZnVuY3Rpb24gaHNsVG9SZ2IoaCwgcywgbCkge1xuICAgIHZhciByO1xuICAgIHZhciBnO1xuICAgIHZhciBiO1xuICAgIGggPSBib3VuZDAxKGgsIDM2MCk7XG4gICAgcyA9IGJvdW5kMDEocywgMTAwKTtcbiAgICBsID0gYm91bmQwMShsLCAxMDApO1xuICAgIGlmIChzID09PSAwKSB7XG4gICAgICAgIGcgPSBsO1xuICAgICAgICBiID0gbDtcbiAgICAgICAgciA9IGw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgcSA9IGwgPCAwLjUgPyAobCAqICgxICsgcykpIDogKGwgKyBzIC0gKGwgKiBzKSk7XG4gICAgICAgIHZhciBwID0gKDIgKiBsKSAtIHE7XG4gICAgICAgIHIgPSBodWUycmdiKHAsIHEsIGggKyAoMSAvIDMpKTtcbiAgICAgICAgZyA9IGh1ZTJyZ2IocCwgcSwgaCk7XG4gICAgICAgIGIgPSBodWUycmdiKHAsIHEsIGggLSAoMSAvIDMpKTtcbiAgICB9XG4gICAgcmV0dXJuIHsgcjogciAqIDI1NSwgZzogZyAqIDI1NSwgYjogYiAqIDI1NSB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJnYlRvSHN2KHIsIGcsIGIpIHtcbiAgICByID0gYm91bmQwMShyLCAyNTUpO1xuICAgIGcgPSBib3VuZDAxKGcsIDI1NSk7XG4gICAgYiA9IGJvdW5kMDEoYiwgMjU1KTtcbiAgICB2YXIgbWF4ID0gTWF0aC5tYXgociwgZywgYik7XG4gICAgdmFyIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpO1xuICAgIHZhciBoID0gMDtcbiAgICB2YXIgdiA9IG1heDtcbiAgICB2YXIgZCA9IG1heCAtIG1pbjtcbiAgICB2YXIgcyA9IG1heCA9PT0gMCA/IDAgOiBkIC8gbWF4O1xuICAgIGlmIChtYXggPT09IG1pbikge1xuICAgICAgICBoID0gMDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHN3aXRjaCAobWF4KSB7XG4gICAgICAgICAgICBjYXNlIHI6XG4gICAgICAgICAgICAgICAgaCA9ICgoZyAtIGIpIC8gZCkgKyAoZyA8IGIgPyA2IDogMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGc6XG4gICAgICAgICAgICAgICAgaCA9ICgoYiAtIHIpIC8gZCkgKyAyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBiOlxuICAgICAgICAgICAgICAgIGggPSAoKHIgLSBnKSAvIGQpICsgNDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaCAvPSA2O1xuICAgIH1cbiAgICByZXR1cm4geyBoOiBoLCBzOiBzLCB2OiB2IH07XG59XG5leHBvcnQgZnVuY3Rpb24gaHN2VG9SZ2IoaCwgcywgdikge1xuICAgIGggPSBib3VuZDAxKGgsIDM2MCkgKiA2O1xuICAgIHMgPSBib3VuZDAxKHMsIDEwMCk7XG4gICAgdiA9IGJvdW5kMDEodiwgMTAwKTtcbiAgICB2YXIgaSA9IE1hdGguZmxvb3IoaCk7XG4gICAgdmFyIGYgPSBoIC0gaTtcbiAgICB2YXIgcCA9IHYgKiAoMSAtIHMpO1xuICAgIHZhciBxID0gdiAqICgxIC0gKGYgKiBzKSk7XG4gICAgdmFyIHQgPSB2ICogKDEgLSAoKDEgLSBmKSAqIHMpKTtcbiAgICB2YXIgbW9kID0gaSAlIDY7XG4gICAgdmFyIHIgPSBbdiwgcSwgcCwgcCwgdCwgdl1bbW9kXTtcbiAgICB2YXIgZyA9IFt0LCB2LCB2LCBxLCBwLCBwXVttb2RdO1xuICAgIHZhciBiID0gW3AsIHAsIHQsIHYsIHYsIHFdW21vZF07XG4gICAgcmV0dXJuIHsgcjogciAqIDI1NSwgZzogZyAqIDI1NSwgYjogYiAqIDI1NSB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJnYlRvSGV4KHIsIGcsIGIsIGFsbG93M0NoYXIpIHtcbiAgICB2YXIgaGV4ID0gW1xuICAgICAgICBwYWQyKE1hdGgucm91bmQocikudG9TdHJpbmcoMTYpKSxcbiAgICAgICAgcGFkMihNYXRoLnJvdW5kKGcpLnRvU3RyaW5nKDE2KSksXG4gICAgICAgIHBhZDIoTWF0aC5yb3VuZChiKS50b1N0cmluZygxNikpLFxuICAgIF07XG4gICAgaWYgKGFsbG93M0NoYXIgJiZcbiAgICAgICAgaGV4WzBdLnN0YXJ0c1dpdGgoaGV4WzBdLmNoYXJBdCgxKSkgJiZcbiAgICAgICAgaGV4WzFdLnN0YXJ0c1dpdGgoaGV4WzFdLmNoYXJBdCgxKSkgJiZcbiAgICAgICAgaGV4WzJdLnN0YXJ0c1dpdGgoaGV4WzJdLmNoYXJBdCgxKSkpIHtcbiAgICAgICAgcmV0dXJuIGhleFswXS5jaGFyQXQoMCkgKyBoZXhbMV0uY2hhckF0KDApICsgaGV4WzJdLmNoYXJBdCgwKTtcbiAgICB9XG4gICAgcmV0dXJuIGhleC5qb2luKCcnKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZ2JhVG9IZXgociwgZywgYiwgYSwgYWxsb3c0Q2hhcikge1xuICAgIHZhciBoZXggPSBbXG4gICAgICAgIHBhZDIoTWF0aC5yb3VuZChyKS50b1N0cmluZygxNikpLFxuICAgICAgICBwYWQyKE1hdGgucm91bmQoZykudG9TdHJpbmcoMTYpKSxcbiAgICAgICAgcGFkMihNYXRoLnJvdW5kKGIpLnRvU3RyaW5nKDE2KSksXG4gICAgICAgIHBhZDIoY29udmVydERlY2ltYWxUb0hleChhKSksXG4gICAgXTtcbiAgICBpZiAoYWxsb3c0Q2hhciAmJlxuICAgICAgICBoZXhbMF0uc3RhcnRzV2l0aChoZXhbMF0uY2hhckF0KDEpKSAmJlxuICAgICAgICBoZXhbMV0uc3RhcnRzV2l0aChoZXhbMV0uY2hhckF0KDEpKSAmJlxuICAgICAgICBoZXhbMl0uc3RhcnRzV2l0aChoZXhbMl0uY2hhckF0KDEpKSAmJlxuICAgICAgICBoZXhbM10uc3RhcnRzV2l0aChoZXhbM10uY2hhckF0KDEpKSkge1xuICAgICAgICByZXR1cm4gaGV4WzBdLmNoYXJBdCgwKSArIGhleFsxXS5jaGFyQXQoMCkgKyBoZXhbMl0uY2hhckF0KDApICsgaGV4WzNdLmNoYXJBdCgwKTtcbiAgICB9XG4gICAgcmV0dXJuIGhleC5qb2luKCcnKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZ2JhVG9BcmdiSGV4KHIsIGcsIGIsIGEpIHtcbiAgICB2YXIgaGV4ID0gW1xuICAgICAgICBwYWQyKGNvbnZlcnREZWNpbWFsVG9IZXgoYSkpLFxuICAgICAgICBwYWQyKE1hdGgucm91bmQocikudG9TdHJpbmcoMTYpKSxcbiAgICAgICAgcGFkMihNYXRoLnJvdW5kKGcpLnRvU3RyaW5nKDE2KSksXG4gICAgICAgIHBhZDIoTWF0aC5yb3VuZChiKS50b1N0cmluZygxNikpLFxuICAgIF07XG4gICAgcmV0dXJuIGhleC5qb2luKCcnKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0RGVjaW1hbFRvSGV4KGQpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChwYXJzZUZsb2F0KGQpICogMjU1KS50b1N0cmluZygxNik7XG59XG5leHBvcnQgZnVuY3Rpb24gY29udmVydEhleFRvRGVjaW1hbChoKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50RnJvbUhleChoKSAvIDI1NTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUludEZyb21IZXgodmFsKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KHZhbCwgMTYpO1xufVxuIiwiZXhwb3J0IHZhciBuYW1lcyA9IHtcbiAgICBhbGljZWJsdWU6ICcjZjBmOGZmJyxcbiAgICBhbnRpcXVld2hpdGU6ICcjZmFlYmQ3JyxcbiAgICBhcXVhOiAnIzAwZmZmZicsXG4gICAgYXF1YW1hcmluZTogJyM3ZmZmZDQnLFxuICAgIGF6dXJlOiAnI2YwZmZmZicsXG4gICAgYmVpZ2U6ICcjZjVmNWRjJyxcbiAgICBiaXNxdWU6ICcjZmZlNGM0JyxcbiAgICBibGFjazogJyMwMDAwMDAnLFxuICAgIGJsYW5jaGVkYWxtb25kOiAnI2ZmZWJjZCcsXG4gICAgYmx1ZTogJyMwMDAwZmYnLFxuICAgIGJsdWV2aW9sZXQ6ICcjOGEyYmUyJyxcbiAgICBicm93bjogJyNhNTJhMmEnLFxuICAgIGJ1cmx5d29vZDogJyNkZWI4ODcnLFxuICAgIGNhZGV0Ymx1ZTogJyM1ZjllYTAnLFxuICAgIGNoYXJ0cmV1c2U6ICcjN2ZmZjAwJyxcbiAgICBjaG9jb2xhdGU6ICcjZDI2OTFlJyxcbiAgICBjb3JhbDogJyNmZjdmNTAnLFxuICAgIGNvcm5mbG93ZXJibHVlOiAnIzY0OTVlZCcsXG4gICAgY29ybnNpbGs6ICcjZmZmOGRjJyxcbiAgICBjcmltc29uOiAnI2RjMTQzYycsXG4gICAgY3lhbjogJyMwMGZmZmYnLFxuICAgIGRhcmtibHVlOiAnIzAwMDA4YicsXG4gICAgZGFya2N5YW46ICcjMDA4YjhiJyxcbiAgICBkYXJrZ29sZGVucm9kOiAnI2I4ODYwYicsXG4gICAgZGFya2dyYXk6ICcjYTlhOWE5JyxcbiAgICBkYXJrZ3JlZW46ICcjMDA2NDAwJyxcbiAgICBkYXJrZ3JleTogJyNhOWE5YTknLFxuICAgIGRhcmtraGFraTogJyNiZGI3NmInLFxuICAgIGRhcmttYWdlbnRhOiAnIzhiMDA4YicsXG4gICAgZGFya29saXZlZ3JlZW46ICcjNTU2YjJmJyxcbiAgICBkYXJrb3JhbmdlOiAnI2ZmOGMwMCcsXG4gICAgZGFya29yY2hpZDogJyM5OTMyY2MnLFxuICAgIGRhcmtyZWQ6ICcjOGIwMDAwJyxcbiAgICBkYXJrc2FsbW9uOiAnI2U5OTY3YScsXG4gICAgZGFya3NlYWdyZWVuOiAnIzhmYmM4ZicsXG4gICAgZGFya3NsYXRlYmx1ZTogJyM0ODNkOGInLFxuICAgIGRhcmtzbGF0ZWdyYXk6ICcjMmY0ZjRmJyxcbiAgICBkYXJrc2xhdGVncmV5OiAnIzJmNGY0ZicsXG4gICAgZGFya3R1cnF1b2lzZTogJyMwMGNlZDEnLFxuICAgIGRhcmt2aW9sZXQ6ICcjOTQwMGQzJyxcbiAgICBkZWVwcGluazogJyNmZjE0OTMnLFxuICAgIGRlZXBza3libHVlOiAnIzAwYmZmZicsXG4gICAgZGltZ3JheTogJyM2OTY5NjknLFxuICAgIGRpbWdyZXk6ICcjNjk2OTY5JyxcbiAgICBkb2RnZXJibHVlOiAnIzFlOTBmZicsXG4gICAgZmlyZWJyaWNrOiAnI2IyMjIyMicsXG4gICAgZmxvcmFsd2hpdGU6ICcjZmZmYWYwJyxcbiAgICBmb3Jlc3RncmVlbjogJyMyMjhiMjInLFxuICAgIGZ1Y2hzaWE6ICcjZmYwMGZmJyxcbiAgICBnYWluc2Jvcm86ICcjZGNkY2RjJyxcbiAgICBnaG9zdHdoaXRlOiAnI2Y4ZjhmZicsXG4gICAgZ29sZDogJyNmZmQ3MDAnLFxuICAgIGdvbGRlbnJvZDogJyNkYWE1MjAnLFxuICAgIGdyYXk6ICcjODA4MDgwJyxcbiAgICBncmVlbjogJyMwMDgwMDAnLFxuICAgIGdyZWVueWVsbG93OiAnI2FkZmYyZicsXG4gICAgZ3JleTogJyM4MDgwODAnLFxuICAgIGhvbmV5ZGV3OiAnI2YwZmZmMCcsXG4gICAgaG90cGluazogJyNmZjY5YjQnLFxuICAgIGluZGlhbnJlZDogJyNjZDVjNWMnLFxuICAgIGluZGlnbzogJyM0YjAwODInLFxuICAgIGl2b3J5OiAnI2ZmZmZmMCcsXG4gICAga2hha2k6ICcjZjBlNjhjJyxcbiAgICBsYXZlbmRlcjogJyNlNmU2ZmEnLFxuICAgIGxhdmVuZGVyYmx1c2g6ICcjZmZmMGY1JyxcbiAgICBsYXduZ3JlZW46ICcjN2NmYzAwJyxcbiAgICBsZW1vbmNoaWZmb246ICcjZmZmYWNkJyxcbiAgICBsaWdodGJsdWU6ICcjYWRkOGU2JyxcbiAgICBsaWdodGNvcmFsOiAnI2YwODA4MCcsXG4gICAgbGlnaHRjeWFuOiAnI2UwZmZmZicsXG4gICAgbGlnaHRnb2xkZW5yb2R5ZWxsb3c6ICcjZmFmYWQyJyxcbiAgICBsaWdodGdyYXk6ICcjZDNkM2QzJyxcbiAgICBsaWdodGdyZWVuOiAnIzkwZWU5MCcsXG4gICAgbGlnaHRncmV5OiAnI2QzZDNkMycsXG4gICAgbGlnaHRwaW5rOiAnI2ZmYjZjMScsXG4gICAgbGlnaHRzYWxtb246ICcjZmZhMDdhJyxcbiAgICBsaWdodHNlYWdyZWVuOiAnIzIwYjJhYScsXG4gICAgbGlnaHRza3libHVlOiAnIzg3Y2VmYScsXG4gICAgbGlnaHRzbGF0ZWdyYXk6ICcjNzc4ODk5JyxcbiAgICBsaWdodHNsYXRlZ3JleTogJyM3Nzg4OTknLFxuICAgIGxpZ2h0c3RlZWxibHVlOiAnI2IwYzRkZScsXG4gICAgbGlnaHR5ZWxsb3c6ICcjZmZmZmUwJyxcbiAgICBsaW1lOiAnIzAwZmYwMCcsXG4gICAgbGltZWdyZWVuOiAnIzMyY2QzMicsXG4gICAgbGluZW46ICcjZmFmMGU2JyxcbiAgICBtYWdlbnRhOiAnI2ZmMDBmZicsXG4gICAgbWFyb29uOiAnIzgwMDAwMCcsXG4gICAgbWVkaXVtYXF1YW1hcmluZTogJyM2NmNkYWEnLFxuICAgIG1lZGl1bWJsdWU6ICcjMDAwMGNkJyxcbiAgICBtZWRpdW1vcmNoaWQ6ICcjYmE1NWQzJyxcbiAgICBtZWRpdW1wdXJwbGU6ICcjOTM3MGRiJyxcbiAgICBtZWRpdW1zZWFncmVlbjogJyMzY2IzNzEnLFxuICAgIG1lZGl1bXNsYXRlYmx1ZTogJyM3YjY4ZWUnLFxuICAgIG1lZGl1bXNwcmluZ2dyZWVuOiAnIzAwZmE5YScsXG4gICAgbWVkaXVtdHVycXVvaXNlOiAnIzQ4ZDFjYycsXG4gICAgbWVkaXVtdmlvbGV0cmVkOiAnI2M3MTU4NScsXG4gICAgbWlkbmlnaHRibHVlOiAnIzE5MTk3MCcsXG4gICAgbWludGNyZWFtOiAnI2Y1ZmZmYScsXG4gICAgbWlzdHlyb3NlOiAnI2ZmZTRlMScsXG4gICAgbW9jY2FzaW46ICcjZmZlNGI1JyxcbiAgICBuYXZham93aGl0ZTogJyNmZmRlYWQnLFxuICAgIG5hdnk6ICcjMDAwMDgwJyxcbiAgICBvbGRsYWNlOiAnI2ZkZjVlNicsXG4gICAgb2xpdmU6ICcjODA4MDAwJyxcbiAgICBvbGl2ZWRyYWI6ICcjNmI4ZTIzJyxcbiAgICBvcmFuZ2U6ICcjZmZhNTAwJyxcbiAgICBvcmFuZ2VyZWQ6ICcjZmY0NTAwJyxcbiAgICBvcmNoaWQ6ICcjZGE3MGQ2JyxcbiAgICBwYWxlZ29sZGVucm9kOiAnI2VlZThhYScsXG4gICAgcGFsZWdyZWVuOiAnIzk4ZmI5OCcsXG4gICAgcGFsZXR1cnF1b2lzZTogJyNhZmVlZWUnLFxuICAgIHBhbGV2aW9sZXRyZWQ6ICcjZGI3MDkzJyxcbiAgICBwYXBheWF3aGlwOiAnI2ZmZWZkNScsXG4gICAgcGVhY2hwdWZmOiAnI2ZmZGFiOScsXG4gICAgcGVydTogJyNjZDg1M2YnLFxuICAgIHBpbms6ICcjZmZjMGNiJyxcbiAgICBwbHVtOiAnI2RkYTBkZCcsXG4gICAgcG93ZGVyYmx1ZTogJyNiMGUwZTYnLFxuICAgIHB1cnBsZTogJyM4MDAwODAnLFxuICAgIHJlYmVjY2FwdXJwbGU6ICcjNjYzMzk5JyxcbiAgICByZWQ6ICcjZmYwMDAwJyxcbiAgICByb3N5YnJvd246ICcjYmM4ZjhmJyxcbiAgICByb3lhbGJsdWU6ICcjNDE2OWUxJyxcbiAgICBzYWRkbGVicm93bjogJyM4YjQ1MTMnLFxuICAgIHNhbG1vbjogJyNmYTgwNzInLFxuICAgIHNhbmR5YnJvd246ICcjZjRhNDYwJyxcbiAgICBzZWFncmVlbjogJyMyZThiNTcnLFxuICAgIHNlYXNoZWxsOiAnI2ZmZjVlZScsXG4gICAgc2llbm5hOiAnI2EwNTIyZCcsXG4gICAgc2lsdmVyOiAnI2MwYzBjMCcsXG4gICAgc2t5Ymx1ZTogJyM4N2NlZWInLFxuICAgIHNsYXRlYmx1ZTogJyM2YTVhY2QnLFxuICAgIHNsYXRlZ3JheTogJyM3MDgwOTAnLFxuICAgIHNsYXRlZ3JleTogJyM3MDgwOTAnLFxuICAgIHNub3c6ICcjZmZmYWZhJyxcbiAgICBzcHJpbmdncmVlbjogJyMwMGZmN2YnLFxuICAgIHN0ZWVsYmx1ZTogJyM0NjgyYjQnLFxuICAgIHRhbjogJyNkMmI0OGMnLFxuICAgIHRlYWw6ICcjMDA4MDgwJyxcbiAgICB0aGlzdGxlOiAnI2Q4YmZkOCcsXG4gICAgdG9tYXRvOiAnI2ZmNjM0NycsXG4gICAgdHVycXVvaXNlOiAnIzQwZTBkMCcsXG4gICAgdmlvbGV0OiAnI2VlODJlZScsXG4gICAgd2hlYXQ6ICcjZjVkZWIzJyxcbiAgICB3aGl0ZTogJyNmZmZmZmYnLFxuICAgIHdoaXRlc21va2U6ICcjZjVmNWY1JyxcbiAgICB5ZWxsb3c6ICcjZmZmZjAwJyxcbiAgICB5ZWxsb3dncmVlbjogJyM5YWNkMzInLFxufTtcbiIsImltcG9ydCB7IGNvbnZlcnRIZXhUb0RlY2ltYWwsIGhzbFRvUmdiLCBoc3ZUb1JnYiwgcGFyc2VJbnRGcm9tSGV4LCByZ2JUb1JnYiB9IGZyb20gJy4vY29udmVyc2lvbic7XG5pbXBvcnQgeyBuYW1lcyB9IGZyb20gJy4vY3NzLWNvbG9yLW5hbWVzJztcbmltcG9ydCB7IGJvdW5kQWxwaGEsIGNvbnZlcnRUb1BlcmNlbnRhZ2UgfSBmcm9tICcuL3V0aWwnO1xuZXhwb3J0IGZ1bmN0aW9uIGlucHV0VG9SR0IoY29sb3IpIHtcbiAgICB2YXIgcmdiID0geyByOiAwLCBnOiAwLCBiOiAwIH07XG4gICAgdmFyIGEgPSAxO1xuICAgIHZhciBzID0gbnVsbDtcbiAgICB2YXIgdiA9IG51bGw7XG4gICAgdmFyIGwgPSBudWxsO1xuICAgIHZhciBvayA9IGZhbHNlO1xuICAgIHZhciBmb3JtYXQgPSBmYWxzZTtcbiAgICBpZiAodHlwZW9mIGNvbG9yID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb2xvciA9IHN0cmluZ0lucHV0VG9PYmplY3QoY29sb3IpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGNvbG9yID09PSAnb2JqZWN0Jykge1xuICAgICAgICBpZiAoaXNWYWxpZENTU1VuaXQoY29sb3IucikgJiYgaXNWYWxpZENTU1VuaXQoY29sb3IuZykgJiYgaXNWYWxpZENTU1VuaXQoY29sb3IuYikpIHtcbiAgICAgICAgICAgIHJnYiA9IHJnYlRvUmdiKGNvbG9yLnIsIGNvbG9yLmcsIGNvbG9yLmIpO1xuICAgICAgICAgICAgb2sgPSB0cnVlO1xuICAgICAgICAgICAgZm9ybWF0ID0gU3RyaW5nKGNvbG9yLnIpLnN1YnN0cigtMSkgPT09ICclJyA/ICdwcmdiJyA6ICdyZ2InO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzVmFsaWRDU1NVbml0KGNvbG9yLmgpICYmIGlzVmFsaWRDU1NVbml0KGNvbG9yLnMpICYmIGlzVmFsaWRDU1NVbml0KGNvbG9yLnYpKSB7XG4gICAgICAgICAgICBzID0gY29udmVydFRvUGVyY2VudGFnZShjb2xvci5zKTtcbiAgICAgICAgICAgIHYgPSBjb252ZXJ0VG9QZXJjZW50YWdlKGNvbG9yLnYpO1xuICAgICAgICAgICAgcmdiID0gaHN2VG9SZ2IoY29sb3IuaCwgcywgdik7XG4gICAgICAgICAgICBvayA9IHRydWU7XG4gICAgICAgICAgICBmb3JtYXQgPSAnaHN2JztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc1ZhbGlkQ1NTVW5pdChjb2xvci5oKSAmJiBpc1ZhbGlkQ1NTVW5pdChjb2xvci5zKSAmJiBpc1ZhbGlkQ1NTVW5pdChjb2xvci5sKSkge1xuICAgICAgICAgICAgcyA9IGNvbnZlcnRUb1BlcmNlbnRhZ2UoY29sb3Iucyk7XG4gICAgICAgICAgICBsID0gY29udmVydFRvUGVyY2VudGFnZShjb2xvci5sKTtcbiAgICAgICAgICAgIHJnYiA9IGhzbFRvUmdiKGNvbG9yLmgsIHMsIGwpO1xuICAgICAgICAgICAgb2sgPSB0cnVlO1xuICAgICAgICAgICAgZm9ybWF0ID0gJ2hzbCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjb2xvciwgJ2EnKSkge1xuICAgICAgICAgICAgYSA9IGNvbG9yLmE7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYSA9IGJvdW5kQWxwaGEoYSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgb2s6IG9rLFxuICAgICAgICBmb3JtYXQ6IGNvbG9yLmZvcm1hdCB8fCBmb3JtYXQsXG4gICAgICAgIHI6IE1hdGgubWluKDI1NSwgTWF0aC5tYXgocmdiLnIsIDApKSxcbiAgICAgICAgZzogTWF0aC5taW4oMjU1LCBNYXRoLm1heChyZ2IuZywgMCkpLFxuICAgICAgICBiOiBNYXRoLm1pbigyNTUsIE1hdGgubWF4KHJnYi5iLCAwKSksXG4gICAgICAgIGE6IGEsXG4gICAgfTtcbn1cbnZhciBDU1NfSU5URUdFUiA9ICdbLVxcXFwrXT9cXFxcZCslPyc7XG52YXIgQ1NTX05VTUJFUiA9ICdbLVxcXFwrXT9cXFxcZCpcXFxcLlxcXFxkKyU/JztcbnZhciBDU1NfVU5JVCA9IFwiKD86XCIgKyBDU1NfTlVNQkVSICsgXCIpfCg/OlwiICsgQ1NTX0lOVEVHRVIgKyBcIilcIjtcbnZhciBQRVJNSVNTSVZFX01BVENIMyA9IFwiW1xcXFxzfFxcXFwoXSsoXCIgKyBDU1NfVU5JVCArIFwiKVssfFxcXFxzXSsoXCIgKyBDU1NfVU5JVCArIFwiKVssfFxcXFxzXSsoXCIgKyBDU1NfVU5JVCArIFwiKVxcXFxzKlxcXFwpP1wiO1xudmFyIFBFUk1JU1NJVkVfTUFUQ0g0ID0gXCJbXFxcXHN8XFxcXChdKyhcIiArIENTU19VTklUICsgXCIpWyx8XFxcXHNdKyhcIiArIENTU19VTklUICsgXCIpWyx8XFxcXHNdKyhcIiArIENTU19VTklUICsgXCIpWyx8XFxcXHNdKyhcIiArIENTU19VTklUICsgXCIpXFxcXHMqXFxcXCk/XCI7XG52YXIgbWF0Y2hlcnMgPSB7XG4gICAgQ1NTX1VOSVQ6IG5ldyBSZWdFeHAoQ1NTX1VOSVQpLFxuICAgIHJnYjogbmV3IFJlZ0V4cCgncmdiJyArIFBFUk1JU1NJVkVfTUFUQ0gzKSxcbiAgICByZ2JhOiBuZXcgUmVnRXhwKCdyZ2JhJyArIFBFUk1JU1NJVkVfTUFUQ0g0KSxcbiAgICBoc2w6IG5ldyBSZWdFeHAoJ2hzbCcgKyBQRVJNSVNTSVZFX01BVENIMyksXG4gICAgaHNsYTogbmV3IFJlZ0V4cCgnaHNsYScgKyBQRVJNSVNTSVZFX01BVENINCksXG4gICAgaHN2OiBuZXcgUmVnRXhwKCdoc3YnICsgUEVSTUlTU0lWRV9NQVRDSDMpLFxuICAgIGhzdmE6IG5ldyBSZWdFeHAoJ2hzdmEnICsgUEVSTUlTU0lWRV9NQVRDSDQpLFxuICAgIGhleDM6IC9eIz8oWzAtOWEtZkEtRl17MX0pKFswLTlhLWZBLUZdezF9KShbMC05YS1mQS1GXXsxfSkkLyxcbiAgICBoZXg2OiAvXiM/KFswLTlhLWZBLUZdezJ9KShbMC05YS1mQS1GXXsyfSkoWzAtOWEtZkEtRl17Mn0pJC8sXG4gICAgaGV4NDogL14jPyhbMC05YS1mQS1GXXsxfSkoWzAtOWEtZkEtRl17MX0pKFswLTlhLWZBLUZdezF9KShbMC05YS1mQS1GXXsxfSkkLyxcbiAgICBoZXg4OiAvXiM/KFswLTlhLWZBLUZdezJ9KShbMC05YS1mQS1GXXsyfSkoWzAtOWEtZkEtRl17Mn0pKFswLTlhLWZBLUZdezJ9KSQvLFxufTtcbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdJbnB1dFRvT2JqZWN0KGNvbG9yKSB7XG4gICAgY29sb3IgPSBjb2xvci50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoY29sb3IubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIG5hbWVkID0gZmFsc2U7XG4gICAgaWYgKG5hbWVzW2NvbG9yXSkge1xuICAgICAgICBjb2xvciA9IG5hbWVzW2NvbG9yXTtcbiAgICAgICAgbmFtZWQgPSB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmIChjb2xvciA9PT0gJ3RyYW5zcGFyZW50Jykge1xuICAgICAgICByZXR1cm4geyByOiAwLCBnOiAwLCBiOiAwLCBhOiAwLCBmb3JtYXQ6ICduYW1lJyB9O1xuICAgIH1cbiAgICB2YXIgbWF0Y2ggPSBtYXRjaGVycy5yZ2IuZXhlYyhjb2xvcik7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiB7IHI6IG1hdGNoWzFdLCBnOiBtYXRjaFsyXSwgYjogbWF0Y2hbM10gfTtcbiAgICB9XG4gICAgbWF0Y2ggPSBtYXRjaGVycy5yZ2JhLmV4ZWMoY29sb3IpO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgICByZXR1cm4geyByOiBtYXRjaFsxXSwgZzogbWF0Y2hbMl0sIGI6IG1hdGNoWzNdLCBhOiBtYXRjaFs0XSB9O1xuICAgIH1cbiAgICBtYXRjaCA9IG1hdGNoZXJzLmhzbC5leGVjKGNvbG9yKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIHsgaDogbWF0Y2hbMV0sIHM6IG1hdGNoWzJdLCBsOiBtYXRjaFszXSB9O1xuICAgIH1cbiAgICBtYXRjaCA9IG1hdGNoZXJzLmhzbGEuZXhlYyhjb2xvcik7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiB7IGg6IG1hdGNoWzFdLCBzOiBtYXRjaFsyXSwgbDogbWF0Y2hbM10sIGE6IG1hdGNoWzRdIH07XG4gICAgfVxuICAgIG1hdGNoID0gbWF0Y2hlcnMuaHN2LmV4ZWMoY29sb3IpO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgICByZXR1cm4geyBoOiBtYXRjaFsxXSwgczogbWF0Y2hbMl0sIHY6IG1hdGNoWzNdIH07XG4gICAgfVxuICAgIG1hdGNoID0gbWF0Y2hlcnMuaHN2YS5leGVjKGNvbG9yKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIHsgaDogbWF0Y2hbMV0sIHM6IG1hdGNoWzJdLCB2OiBtYXRjaFszXSwgYTogbWF0Y2hbNF0gfTtcbiAgICB9XG4gICAgbWF0Y2ggPSBtYXRjaGVycy5oZXg4LmV4ZWMoY29sb3IpO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzFdKSxcbiAgICAgICAgICAgIGc6IHBhcnNlSW50RnJvbUhleChtYXRjaFsyXSksXG4gICAgICAgICAgICBiOiBwYXJzZUludEZyb21IZXgobWF0Y2hbM10pLFxuICAgICAgICAgICAgYTogY29udmVydEhleFRvRGVjaW1hbChtYXRjaFs0XSksXG4gICAgICAgICAgICBmb3JtYXQ6IG5hbWVkID8gJ25hbWUnIDogJ2hleDgnLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBtYXRjaCA9IG1hdGNoZXJzLmhleDYuZXhlYyhjb2xvcik7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMV0pLFxuICAgICAgICAgICAgZzogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzJdKSxcbiAgICAgICAgICAgIGI6IHBhcnNlSW50RnJvbUhleChtYXRjaFszXSksXG4gICAgICAgICAgICBmb3JtYXQ6IG5hbWVkID8gJ25hbWUnIDogJ2hleCcsXG4gICAgICAgIH07XG4gICAgfVxuICAgIG1hdGNoID0gbWF0Y2hlcnMuaGV4NC5leGVjKGNvbG9yKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHI6IHBhcnNlSW50RnJvbUhleChtYXRjaFsxXSArIG1hdGNoWzFdKSxcbiAgICAgICAgICAgIGc6IHBhcnNlSW50RnJvbUhleChtYXRjaFsyXSArIG1hdGNoWzJdKSxcbiAgICAgICAgICAgIGI6IHBhcnNlSW50RnJvbUhleChtYXRjaFszXSArIG1hdGNoWzNdKSxcbiAgICAgICAgICAgIGE6IGNvbnZlcnRIZXhUb0RlY2ltYWwobWF0Y2hbNF0gKyBtYXRjaFs0XSksXG4gICAgICAgICAgICBmb3JtYXQ6IG5hbWVkID8gJ25hbWUnIDogJ2hleDgnLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBtYXRjaCA9IG1hdGNoZXJzLmhleDMuZXhlYyhjb2xvcik7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMV0gKyBtYXRjaFsxXSksXG4gICAgICAgICAgICBnOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMl0gKyBtYXRjaFsyXSksXG4gICAgICAgICAgICBiOiBwYXJzZUludEZyb21IZXgobWF0Y2hbM10gKyBtYXRjaFszXSksXG4gICAgICAgICAgICBmb3JtYXQ6IG5hbWVkID8gJ25hbWUnIDogJ2hleCcsXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkQ1NTVW5pdChjb2xvcikge1xuICAgIHJldHVybiBCb29sZWFuKG1hdGNoZXJzLkNTU19VTklULmV4ZWMoU3RyaW5nKGNvbG9yKSkpO1xufVxuIiwiaW1wb3J0IHsgcmdiYVRvSGV4LCByZ2JUb0hleCwgcmdiVG9Ic2wsIHJnYlRvSHN2IH0gZnJvbSAnLi9jb252ZXJzaW9uJztcbmltcG9ydCB7IG5hbWVzIH0gZnJvbSAnLi9jc3MtY29sb3ItbmFtZXMnO1xuaW1wb3J0IHsgaW5wdXRUb1JHQiB9IGZyb20gJy4vZm9ybWF0LWlucHV0JztcbmltcG9ydCB7IGJvdW5kMDEsIGJvdW5kQWxwaGEsIGNsYW1wMDEgfSBmcm9tICcuL3V0aWwnO1xudmFyIFRpbnlDb2xvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVGlueUNvbG9yKGNvbG9yLCBvcHRzKSB7XG4gICAgICAgIGlmIChjb2xvciA9PT0gdm9pZCAwKSB7IGNvbG9yID0gJyc7IH1cbiAgICAgICAgaWYgKG9wdHMgPT09IHZvaWQgMCkgeyBvcHRzID0ge307IH1cbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoY29sb3IgaW5zdGFuY2VvZiBUaW55Q29sb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBjb2xvcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9yaWdpbmFsSW5wdXQgPSBjb2xvcjtcbiAgICAgICAgdmFyIHJnYiA9IGlucHV0VG9SR0IoY29sb3IpO1xuICAgICAgICB0aGlzLm9yaWdpbmFsSW5wdXQgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5yID0gcmdiLnI7XG4gICAgICAgIHRoaXMuZyA9IHJnYi5nO1xuICAgICAgICB0aGlzLmIgPSByZ2IuYjtcbiAgICAgICAgdGhpcy5hID0gcmdiLmE7XG4gICAgICAgIHRoaXMucm91bmRBID0gTWF0aC5yb3VuZCgxMDAgKiB0aGlzLmEpIC8gMTAwO1xuICAgICAgICB0aGlzLmZvcm1hdCA9IChfYSA9IG9wdHMuZm9ybWF0LCAoX2EgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogcmdiLmZvcm1hdCkpO1xuICAgICAgICB0aGlzLmdyYWRpZW50VHlwZSA9IG9wdHMuZ3JhZGllbnRUeXBlO1xuICAgICAgICBpZiAodGhpcy5yIDwgMSkge1xuICAgICAgICAgICAgdGhpcy5yID0gTWF0aC5yb3VuZCh0aGlzLnIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmcgPCAxKSB7XG4gICAgICAgICAgICB0aGlzLmcgPSBNYXRoLnJvdW5kKHRoaXMuZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuYiA8IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYiA9IE1hdGgucm91bmQodGhpcy5iKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlzVmFsaWQgPSByZ2Iub2s7XG4gICAgfVxuICAgIFRpbnlDb2xvci5wcm90b3R5cGUuaXNEYXJrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRCcmlnaHRuZXNzKCkgPCAxMjg7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLmlzTGlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5pc0RhcmsoKTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUuZ2V0QnJpZ2h0bmVzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJnYiA9IHRoaXMudG9SZ2IoKTtcbiAgICAgICAgcmV0dXJuICgocmdiLnIgKiAyOTkpICsgKHJnYi5nICogNTg3KSArIChyZ2IuYiAqIDExNCkpIC8gMTAwMDtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUuZ2V0THVtaW5hbmNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmdiID0gdGhpcy50b1JnYigpO1xuICAgICAgICB2YXIgUjtcbiAgICAgICAgdmFyIEc7XG4gICAgICAgIHZhciBCO1xuICAgICAgICB2YXIgUnNSR0IgPSByZ2IuciAvIDI1NTtcbiAgICAgICAgdmFyIEdzUkdCID0gcmdiLmcgLyAyNTU7XG4gICAgICAgIHZhciBCc1JHQiA9IHJnYi5iIC8gMjU1O1xuICAgICAgICBpZiAoUnNSR0IgPD0gMC4wMzkyOCkge1xuICAgICAgICAgICAgUiA9IFJzUkdCIC8gMTIuOTI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBSID0gTWF0aC5wb3coKFJzUkdCICsgMC4wNTUpIC8gMS4wNTUsIDIuNCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEdzUkdCIDw9IDAuMDM5MjgpIHtcbiAgICAgICAgICAgIEcgPSBHc1JHQiAvIDEyLjkyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgRyA9IE1hdGgucG93KChHc1JHQiArIDAuMDU1KSAvIDEuMDU1LCAyLjQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChCc1JHQiA8PSAwLjAzOTI4KSB7XG4gICAgICAgICAgICBCID0gQnNSR0IgLyAxMi45MjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIEIgPSBNYXRoLnBvdygoQnNSR0IgKyAwLjA1NSkgLyAxLjA1NSwgMi40KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKDAuMjEyNiAqIFIpICsgKDAuNzE1MiAqIEcpICsgKDAuMDcyMiAqIEIpO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS5nZXRBbHBoYSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUuc2V0QWxwaGEgPSBmdW5jdGlvbiAoYWxwaGEpIHtcbiAgICAgICAgdGhpcy5hID0gYm91bmRBbHBoYShhbHBoYSk7XG4gICAgICAgIHRoaXMucm91bmRBID0gTWF0aC5yb3VuZCgxMDAgKiB0aGlzLmEpIC8gMTAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUudG9Ic3YgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBoc3YgPSByZ2JUb0hzdih0aGlzLnIsIHRoaXMuZywgdGhpcy5iKTtcbiAgICAgICAgcmV0dXJuIHsgaDogaHN2LmggKiAzNjAsIHM6IGhzdi5zLCB2OiBoc3YudiwgYTogdGhpcy5hIH07XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLnRvSHN2U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaHN2ID0gcmdiVG9Ic3YodGhpcy5yLCB0aGlzLmcsIHRoaXMuYik7XG4gICAgICAgIHZhciBoID0gTWF0aC5yb3VuZChoc3YuaCAqIDM2MCk7XG4gICAgICAgIHZhciBzID0gTWF0aC5yb3VuZChoc3YucyAqIDEwMCk7XG4gICAgICAgIHZhciB2ID0gTWF0aC5yb3VuZChoc3YudiAqIDEwMCk7XG4gICAgICAgIHJldHVybiB0aGlzLmEgPT09IDEgPyBcImhzdihcIiArIGggKyBcIiwgXCIgKyBzICsgXCIlLCBcIiArIHYgKyBcIiUpXCIgOiBcImhzdmEoXCIgKyBoICsgXCIsIFwiICsgcyArIFwiJSwgXCIgKyB2ICsgXCIlLCBcIiArIHRoaXMucm91bmRBICsgXCIpXCI7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLnRvSHNsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaHNsID0gcmdiVG9Ic2wodGhpcy5yLCB0aGlzLmcsIHRoaXMuYik7XG4gICAgICAgIHJldHVybiB7IGg6IGhzbC5oICogMzYwLCBzOiBoc2wucywgbDogaHNsLmwsIGE6IHRoaXMuYSB9O1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS50b0hzbFN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGhzbCA9IHJnYlRvSHNsKHRoaXMuciwgdGhpcy5nLCB0aGlzLmIpO1xuICAgICAgICB2YXIgaCA9IE1hdGgucm91bmQoaHNsLmggKiAzNjApO1xuICAgICAgICB2YXIgcyA9IE1hdGgucm91bmQoaHNsLnMgKiAxMDApO1xuICAgICAgICB2YXIgbCA9IE1hdGgucm91bmQoaHNsLmwgKiAxMDApO1xuICAgICAgICByZXR1cm4gdGhpcy5hID09PSAxID8gXCJoc2woXCIgKyBoICsgXCIsIFwiICsgcyArIFwiJSwgXCIgKyBsICsgXCIlKVwiIDogXCJoc2xhKFwiICsgaCArIFwiLCBcIiArIHMgKyBcIiUsIFwiICsgbCArIFwiJSwgXCIgKyB0aGlzLnJvdW5kQSArIFwiKVwiO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS50b0hleCA9IGZ1bmN0aW9uIChhbGxvdzNDaGFyKSB7XG4gICAgICAgIGlmIChhbGxvdzNDaGFyID09PSB2b2lkIDApIHsgYWxsb3czQ2hhciA9IGZhbHNlOyB9XG4gICAgICAgIHJldHVybiByZ2JUb0hleCh0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCBhbGxvdzNDaGFyKTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUudG9IZXhTdHJpbmcgPSBmdW5jdGlvbiAoYWxsb3czQ2hhcikge1xuICAgICAgICBpZiAoYWxsb3czQ2hhciA9PT0gdm9pZCAwKSB7IGFsbG93M0NoYXIgPSBmYWxzZTsgfVxuICAgICAgICByZXR1cm4gJyMnICsgdGhpcy50b0hleChhbGxvdzNDaGFyKTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUudG9IZXg4ID0gZnVuY3Rpb24gKGFsbG93NENoYXIpIHtcbiAgICAgICAgaWYgKGFsbG93NENoYXIgPT09IHZvaWQgMCkgeyBhbGxvdzRDaGFyID0gZmFsc2U7IH1cbiAgICAgICAgcmV0dXJuIHJnYmFUb0hleCh0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCB0aGlzLmEsIGFsbG93NENoYXIpO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS50b0hleDhTdHJpbmcgPSBmdW5jdGlvbiAoYWxsb3c0Q2hhcikge1xuICAgICAgICBpZiAoYWxsb3c0Q2hhciA9PT0gdm9pZCAwKSB7IGFsbG93NENoYXIgPSBmYWxzZTsgfVxuICAgICAgICByZXR1cm4gJyMnICsgdGhpcy50b0hleDgoYWxsb3c0Q2hhcik7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLnRvUmdiID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcjogTWF0aC5yb3VuZCh0aGlzLnIpLFxuICAgICAgICAgICAgZzogTWF0aC5yb3VuZCh0aGlzLmcpLFxuICAgICAgICAgICAgYjogTWF0aC5yb3VuZCh0aGlzLmIpLFxuICAgICAgICAgICAgYTogdGhpcy5hLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS50b1JnYlN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHIgPSBNYXRoLnJvdW5kKHRoaXMucik7XG4gICAgICAgIHZhciBnID0gTWF0aC5yb3VuZCh0aGlzLmcpO1xuICAgICAgICB2YXIgYiA9IE1hdGgucm91bmQodGhpcy5iKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYSA9PT0gMSA/IFwicmdiKFwiICsgciArIFwiLCBcIiArIGcgKyBcIiwgXCIgKyBiICsgXCIpXCIgOiBcInJnYmEoXCIgKyByICsgXCIsIFwiICsgZyArIFwiLCBcIiArIGIgKyBcIiwgXCIgKyB0aGlzLnJvdW5kQSArIFwiKVwiO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS50b1BlcmNlbnRhZ2VSZ2IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmbXQgPSBmdW5jdGlvbiAoeCkgeyByZXR1cm4gTWF0aC5yb3VuZChib3VuZDAxKHgsIDI1NSkgKiAxMDApICsgXCIlXCI7IH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByOiBmbXQodGhpcy5yKSxcbiAgICAgICAgICAgIGc6IGZtdCh0aGlzLmcpLFxuICAgICAgICAgICAgYjogZm10KHRoaXMuYiksXG4gICAgICAgICAgICBhOiB0aGlzLmEsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLnRvUGVyY2VudGFnZVJnYlN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJuZCA9IGZ1bmN0aW9uICh4KSB7IHJldHVybiBNYXRoLnJvdW5kKGJvdW5kMDEoeCwgMjU1KSAqIDEwMCk7IH07XG4gICAgICAgIHJldHVybiB0aGlzLmEgPT09IDEgP1xuICAgICAgICAgICAgXCJyZ2IoXCIgKyBybmQodGhpcy5yKSArIFwiJSwgXCIgKyBybmQodGhpcy5nKSArIFwiJSwgXCIgKyBybmQodGhpcy5iKSArIFwiJSlcIiA6XG4gICAgICAgICAgICBcInJnYmEoXCIgKyBybmQodGhpcy5yKSArIFwiJSwgXCIgKyBybmQodGhpcy5nKSArIFwiJSwgXCIgKyBybmQodGhpcy5iKSArIFwiJSwgXCIgKyB0aGlzLnJvdW5kQSArIFwiKVwiO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS50b05hbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmEgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAndHJhbnNwYXJlbnQnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmEgPCAxKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGhleCA9ICcjJyArIHJnYlRvSGV4KHRoaXMuciwgdGhpcy5nLCB0aGlzLmIsIGZhbHNlKTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IE9iamVjdC5rZXlzKG5hbWVzKTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBfYVtfaV07XG4gICAgICAgICAgICBpZiAobmFtZXNba2V5XSA9PT0gaGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICB2YXIgZm9ybWF0U2V0ID0gQm9vbGVhbihmb3JtYXQpO1xuICAgICAgICBmb3JtYXQgPSAoZm9ybWF0ICE9PSBudWxsICYmIGZvcm1hdCAhPT0gdm9pZCAwID8gZm9ybWF0IDogdGhpcy5mb3JtYXQpO1xuICAgICAgICB2YXIgZm9ybWF0dGVkU3RyaW5nID0gZmFsc2U7XG4gICAgICAgIHZhciBoYXNBbHBoYSA9IHRoaXMuYSA8IDEgJiYgdGhpcy5hID49IDA7XG4gICAgICAgIHZhciBuZWVkc0FscGhhRm9ybWF0ID0gIWZvcm1hdFNldCAmJiBoYXNBbHBoYSAmJiAoZm9ybWF0LnN0YXJ0c1dpdGgoJ2hleCcpIHx8IGZvcm1hdCA9PT0gJ25hbWUnKTtcbiAgICAgICAgaWYgKG5lZWRzQWxwaGFGb3JtYXQpIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXQgPT09ICduYW1lJyAmJiB0aGlzLmEgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b05hbWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRvUmdiU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ3JnYicpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9SZ2JTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSAncHJnYicpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9QZXJjZW50YWdlUmdiU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ2hleCcgfHwgZm9ybWF0ID09PSAnaGV4NicpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9IZXhTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSAnaGV4MycpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9IZXhTdHJpbmcodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ2hleDQnKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvSGV4OFN0cmluZyh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSAnaGV4OCcpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9IZXg4U3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ25hbWUnKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvTmFtZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09ICdoc2wnKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvSHNsU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ2hzdicpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9Ic3ZTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZm9ybWF0dGVkU3RyaW5nIHx8IHRoaXMudG9IZXhTdHJpbmcoKTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVGlueUNvbG9yKHRoaXMudG9TdHJpbmcoKSk7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLmxpZ2h0ZW4gPSBmdW5jdGlvbiAoYW1vdW50KSB7XG4gICAgICAgIGlmIChhbW91bnQgPT09IHZvaWQgMCkgeyBhbW91bnQgPSAxMDsgfVxuICAgICAgICB2YXIgaHNsID0gdGhpcy50b0hzbCgpO1xuICAgICAgICBoc2wubCArPSBhbW91bnQgLyAxMDA7XG4gICAgICAgIGhzbC5sID0gY2xhbXAwMShoc2wubCk7XG4gICAgICAgIHJldHVybiBuZXcgVGlueUNvbG9yKGhzbCk7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLmJyaWdodGVuID0gZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgICBpZiAoYW1vdW50ID09PSB2b2lkIDApIHsgYW1vdW50ID0gMTA7IH1cbiAgICAgICAgdmFyIHJnYiA9IHRoaXMudG9SZ2IoKTtcbiAgICAgICAgcmdiLnIgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIHJnYi5yIC0gTWF0aC5yb3VuZCgyNTUgKiAtKGFtb3VudCAvIDEwMCkpKSk7XG4gICAgICAgIHJnYi5nID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCByZ2IuZyAtIE1hdGgucm91bmQoMjU1ICogLShhbW91bnQgLyAxMDApKSkpO1xuICAgICAgICByZ2IuYiA9IE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgcmdiLmIgLSBNYXRoLnJvdW5kKDI1NSAqIC0oYW1vdW50IC8gMTAwKSkpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW55Q29sb3IocmdiKTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUuZGFya2VuID0gZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgICBpZiAoYW1vdW50ID09PSB2b2lkIDApIHsgYW1vdW50ID0gMTA7IH1cbiAgICAgICAgdmFyIGhzbCA9IHRoaXMudG9Ic2woKTtcbiAgICAgICAgaHNsLmwgLT0gYW1vdW50IC8gMTAwO1xuICAgICAgICBoc2wubCA9IGNsYW1wMDEoaHNsLmwpO1xuICAgICAgICByZXR1cm4gbmV3IFRpbnlDb2xvcihoc2wpO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS50aW50ID0gZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgICBpZiAoYW1vdW50ID09PSB2b2lkIDApIHsgYW1vdW50ID0gMTA7IH1cbiAgICAgICAgcmV0dXJuIHRoaXMubWl4KCd3aGl0ZScsIGFtb3VudCk7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLnNoYWRlID0gZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgICBpZiAoYW1vdW50ID09PSB2b2lkIDApIHsgYW1vdW50ID0gMTA7IH1cbiAgICAgICAgcmV0dXJuIHRoaXMubWl4KCdibGFjaycsIGFtb3VudCk7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLmRlc2F0dXJhdGUgPSBmdW5jdGlvbiAoYW1vdW50KSB7XG4gICAgICAgIGlmIChhbW91bnQgPT09IHZvaWQgMCkgeyBhbW91bnQgPSAxMDsgfVxuICAgICAgICB2YXIgaHNsID0gdGhpcy50b0hzbCgpO1xuICAgICAgICBoc2wucyAtPSBhbW91bnQgLyAxMDA7XG4gICAgICAgIGhzbC5zID0gY2xhbXAwMShoc2wucyk7XG4gICAgICAgIHJldHVybiBuZXcgVGlueUNvbG9yKGhzbCk7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLnNhdHVyYXRlID0gZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgICBpZiAoYW1vdW50ID09PSB2b2lkIDApIHsgYW1vdW50ID0gMTA7IH1cbiAgICAgICAgdmFyIGhzbCA9IHRoaXMudG9Ic2woKTtcbiAgICAgICAgaHNsLnMgKz0gYW1vdW50IC8gMTAwO1xuICAgICAgICBoc2wucyA9IGNsYW1wMDEoaHNsLnMpO1xuICAgICAgICByZXR1cm4gbmV3IFRpbnlDb2xvcihoc2wpO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS5ncmV5c2NhbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlc2F0dXJhdGUoMTAwKTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUuc3BpbiA9IGZ1bmN0aW9uIChhbW91bnQpIHtcbiAgICAgICAgdmFyIGhzbCA9IHRoaXMudG9Ic2woKTtcbiAgICAgICAgdmFyIGh1ZSA9IChoc2wuaCArIGFtb3VudCkgJSAzNjA7XG4gICAgICAgIGhzbC5oID0gaHVlIDwgMCA/IDM2MCArIGh1ZSA6IGh1ZTtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW55Q29sb3IoaHNsKTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUubWl4ID0gZnVuY3Rpb24gKGNvbG9yLCBhbW91bnQpIHtcbiAgICAgICAgaWYgKGFtb3VudCA9PT0gdm9pZCAwKSB7IGFtb3VudCA9IDUwOyB9XG4gICAgICAgIHZhciByZ2IxID0gdGhpcy50b1JnYigpO1xuICAgICAgICB2YXIgcmdiMiA9IG5ldyBUaW55Q29sb3IoY29sb3IpLnRvUmdiKCk7XG4gICAgICAgIHZhciBwID0gYW1vdW50IC8gMTAwO1xuICAgICAgICB2YXIgcmdiYSA9IHtcbiAgICAgICAgICAgIHI6ICgocmdiMi5yIC0gcmdiMS5yKSAqIHApICsgcmdiMS5yLFxuICAgICAgICAgICAgZzogKChyZ2IyLmcgLSByZ2IxLmcpICogcCkgKyByZ2IxLmcsXG4gICAgICAgICAgICBiOiAoKHJnYjIuYiAtIHJnYjEuYikgKiBwKSArIHJnYjEuYixcbiAgICAgICAgICAgIGE6ICgocmdiMi5hIC0gcmdiMS5hKSAqIHApICsgcmdiMS5hLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gbmV3IFRpbnlDb2xvcihyZ2JhKTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUuYW5hbG9nb3VzID0gZnVuY3Rpb24gKHJlc3VsdHMsIHNsaWNlcykge1xuICAgICAgICBpZiAocmVzdWx0cyA9PT0gdm9pZCAwKSB7IHJlc3VsdHMgPSA2OyB9XG4gICAgICAgIGlmIChzbGljZXMgPT09IHZvaWQgMCkgeyBzbGljZXMgPSAzMDsgfVxuICAgICAgICB2YXIgaHNsID0gdGhpcy50b0hzbCgpO1xuICAgICAgICB2YXIgcGFydCA9IDM2MCAvIHNsaWNlcztcbiAgICAgICAgdmFyIHJldCA9IFt0aGlzXTtcbiAgICAgICAgZm9yIChoc2wuaCA9IChoc2wuaCAtICgocGFydCAqIHJlc3VsdHMpID4+IDEpICsgNzIwKSAlIDM2MDsgLS1yZXN1bHRzOykge1xuICAgICAgICAgICAgaHNsLmggPSAoaHNsLmggKyBwYXJ0KSAlIDM2MDtcbiAgICAgICAgICAgIHJldC5wdXNoKG5ldyBUaW55Q29sb3IoaHNsKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUuY29tcGxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGhzbCA9IHRoaXMudG9Ic2woKTtcbiAgICAgICAgaHNsLmggPSAoaHNsLmggKyAxODApICUgMzYwO1xuICAgICAgICByZXR1cm4gbmV3IFRpbnlDb2xvcihoc2wpO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS5tb25vY2hyb21hdGljID0gZnVuY3Rpb24gKHJlc3VsdHMpIHtcbiAgICAgICAgaWYgKHJlc3VsdHMgPT09IHZvaWQgMCkgeyByZXN1bHRzID0gNjsgfVxuICAgICAgICB2YXIgaHN2ID0gdGhpcy50b0hzdigpO1xuICAgICAgICB2YXIgaCA9IGhzdi5oO1xuICAgICAgICB2YXIgcyA9IGhzdi5zO1xuICAgICAgICB2YXIgdiA9IGhzdi52O1xuICAgICAgICB2YXIgcmVzID0gW107XG4gICAgICAgIHZhciBtb2RpZmljYXRpb24gPSAxIC8gcmVzdWx0cztcbiAgICAgICAgd2hpbGUgKHJlc3VsdHMtLSkge1xuICAgICAgICAgICAgcmVzLnB1c2gobmV3IFRpbnlDb2xvcih7IGg6IGgsIHM6IHMsIHY6IHYgfSkpO1xuICAgICAgICAgICAgdiA9ICh2ICsgbW9kaWZpY2F0aW9uKSAlIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUuc3BsaXRjb21wbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaHNsID0gdGhpcy50b0hzbCgpO1xuICAgICAgICB2YXIgaCA9IGhzbC5oO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIG5ldyBUaW55Q29sb3IoeyBoOiAoaCArIDcyKSAlIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sIH0pLFxuICAgICAgICAgICAgbmV3IFRpbnlDb2xvcih7IGg6IChoICsgMjE2KSAlIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sIH0pLFxuICAgICAgICBdO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS50cmlhZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9seWFkKDMpO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS50ZXRyYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvbHlhZCg0KTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUucG9seWFkID0gZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgdmFyIGhzbCA9IHRoaXMudG9Ic2woKTtcbiAgICAgICAgdmFyIGggPSBoc2wuaDtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFt0aGlzXTtcbiAgICAgICAgdmFyIGluY3JlbWVudCA9IDM2MCAvIG47XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChuZXcgVGlueUNvbG9yKHsgaDogKGggKyAoaSAqIGluY3JlbWVudCkpICUgMzYwLCBzOiBoc2wucywgbDogaHNsLmwgfSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIChjb2xvcikge1xuICAgICAgICByZXR1cm4gdGhpcy50b1JnYlN0cmluZygpID09PSBuZXcgVGlueUNvbG9yKGNvbG9yKS50b1JnYlN0cmluZygpO1xuICAgIH07XG4gICAgcmV0dXJuIFRpbnlDb2xvcjtcbn0oKSk7XG5leHBvcnQgeyBUaW55Q29sb3IgfTtcbmV4cG9ydCBmdW5jdGlvbiB0aW55Y29sb3IoY29sb3IsIG9wdHMpIHtcbiAgICBpZiAoY29sb3IgPT09IHZvaWQgMCkgeyBjb2xvciA9ICcnOyB9XG4gICAgaWYgKG9wdHMgPT09IHZvaWQgMCkgeyBvcHRzID0ge307IH1cbiAgICByZXR1cm4gbmV3IFRpbnlDb2xvcihjb2xvciwgb3B0cyk7XG59XG4iLCJleHBvcnQgY29uc3QgTGl0RWxlbWVudCA9IGN1c3RvbUVsZW1lbnRzLmdldCgnaG9tZS1hc3Npc3RhbnQtbWFpbicpXHJcbiAgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY3VzdG9tRWxlbWVudHMuZ2V0KCdob21lLWFzc2lzdGFudC1tYWluJykpXHJcbiAgOiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY3VzdG9tRWxlbWVudHMuZ2V0KCdodWktdmlldycpKTtcclxuXHJcbmV4cG9ydCBjb25zdCBodG1sID0gTGl0RWxlbWVudC5wcm90b3R5cGUuaHRtbDtcclxuXHJcbmV4cG9ydCBjb25zdCBjc3MgPSBMaXRFbGVtZW50LnByb3RvdHlwZS5jc3M7XHJcbiIsImV4cG9ydCBmdW5jdGlvbiBoYXNzKCkge1xyXG4gIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hjLW1haW4nKSlcclxuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoYy1tYWluJykuaGFzcztcclxuXHJcbiAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaG9tZS1hc3Npc3RhbnQnKSlcclxuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdob21lLWFzc2lzdGFudCcpLmhhc3M7XHJcblxyXG4gIHJldHVybiB1bmRlZmluZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZUhhc3MoZWxlbWVudCkge1xyXG4gIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hjLW1haW4nKSlcclxuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoYy1tYWluJykucHJvdmlkZUhhc3MoZWxlbWVudCk7XHJcblxyXG4gIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hvbWUtYXNzaXN0YW50JykpXHJcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImhvbWUtYXNzaXN0YW50XCIpLnByb3ZpZGVIYXNzKGVsZW1lbnQpO1xyXG5cclxuICByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG92ZWxhY2UoKSB7XHJcbiAgdmFyIHJvb3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaGMtbWFpblwiKTtcclxuICBpZihyb290KSB7XHJcbiAgICB2YXIgbGwgPSByb290Ll9sb3ZlbGFjZUNvbmZpZztcclxuICAgIGxsLmN1cnJlbnRfdmlldyA9IHJvb3QuX2xvdmVsYWNlUGF0aDtcclxuICAgIHJldHVybiBsbDtcclxuICB9XHJcblxyXG4gIHJvb3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaG9tZS1hc3Npc3RhbnRcIik7XHJcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5zaGFkb3dSb290O1xyXG4gIHJvb3QgPSByb290ICYmIHJvb3QucXVlcnlTZWxlY3RvcihcImhvbWUtYXNzaXN0YW50LW1haW5cIik7XHJcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5zaGFkb3dSb290O1xyXG4gIHJvb3QgPSByb290ICYmIHJvb3QucXVlcnlTZWxlY3RvcihcImFwcC1kcmF3ZXItbGF5b3V0IHBhcnRpYWwtcGFuZWwtcmVzb2x2ZXJcIik7XHJcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5zaGFkb3dSb290IHx8IHJvb3Q7XHJcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiaGEtcGFuZWwtbG92ZWxhY2VcIilcclxuICByb290ID0gcm9vdCAmJiByb290LnNoYWRvd1Jvb3Q7XHJcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiaHVpLXJvb3RcIilcclxuICBpZiAocm9vdCkge1xyXG4gICAgdmFyIGxsID0gIHJvb3QubG92ZWxhY2VcclxuICAgIGxsLmN1cnJlbnRfdmlldyA9IHJvb3QuX19fY3VyVmlldztcclxuICAgIHJldHVybiBsbDtcclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBhd2FpdF9lbChlbCkge1xyXG4gIGlmKCFlbCkgcmV0dXJuO1xyXG4gIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKGVsLmxvY2FsTmFtZSk7XHJcbiAgaWYoZWwudXBkYXRlQ29tcGxldGUpXHJcbiAgICBhd2FpdCBlbC51cGRhdGVDb21wbGV0ZTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFzeW5jX2xvdmVsYWNlX3ZpZXcoKSB7XHJcbiAgdmFyIHJvb3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaGMtbWFpblwiKTtcclxuICBpZihyb290KSB7XHJcbiAgICByb290ID0gcm9vdCAmJiByb290LnNoYWRvd1Jvb3Q7XHJcbiAgICByb290ID0gcm9vdCAmJiByb290LnF1ZXJ5U2VsZWN0b3IoXCJoYy1sb3ZlbGFjZVwiKTtcclxuICAgIGF3YWl0X2VsKHJvb3QpO1xyXG4gICAgcm9vdCA9IHJvb3QgJiYgcm9vdC5zaGFkb3dSb290O1xyXG4gICAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiaHVpLXZpZXdcIikgfHwgcm9vdC5xdWVyeVNlbGVjdG9yKFwiaHVpLXBhbmVsLXZpZXdcIik7XHJcbiAgICBhd2FpdF9lbChyb290KTtcclxuICAgIHJldHVybiByb290O1xyXG4gIH1cclxuXHJcbiAgcm9vdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJob21lLWFzc2lzdGFudFwiKTtcclxuICBhd2FpdF9lbChyb290KTtcclxuICByb290ID0gcm9vdCAmJiByb290LnNoYWRvd1Jvb3Q7XHJcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiaG9tZS1hc3Npc3RhbnQtbWFpblwiKTtcclxuICBhd2FpdF9lbChyb290KTtcclxuICByb290ID0gcm9vdCAmJiByb290LnNoYWRvd1Jvb3Q7XHJcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiYXBwLWRyYXdlci1sYXlvdXQgcGFydGlhbC1wYW5lbC1yZXNvbHZlclwiKTtcclxuICBhd2FpdF9lbChyb290KTtcclxuICByb290ID0gcm9vdCAmJiByb290LnNoYWRvd1Jvb3QgfHwgcm9vdDtcclxuICByb290ID0gcm9vdCAmJiByb290LnF1ZXJ5U2VsZWN0b3IoXCJoYS1wYW5lbC1sb3ZlbGFjZVwiKTtcclxuICBhd2FpdF9lbChyb290KTtcclxuICByb290ID0gcm9vdCAmJiByb290LnNoYWRvd1Jvb3Q7XHJcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiaHVpLXJvb3RcIik7XHJcbiAgYXdhaXRfZWwocm9vdCk7XHJcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5zaGFkb3dSb290O1xyXG4gIHJvb3QgPSByb290ICYmIHJvb3QucXVlcnlTZWxlY3RvcihcImhhLWFwcC1sYXlvdXRcIilcclxuICBhd2FpdF9lbChyb290KTtcclxuICByb290ID0gcm9vdCAmJiByb290LnF1ZXJ5U2VsZWN0b3IoXCIjdmlld1wiKTtcclxuICByb290ID0gcm9vdCAmJiByb290LmZpcnN0RWxlbWVudENoaWxkO1xyXG4gIGF3YWl0X2VsKHJvb3QpO1xyXG4gIHJldHVybiByb290O1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBsb3ZlbGFjZV92aWV3KCkge1xyXG4gIHZhciByb290ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImhjLW1haW5cIik7XHJcbiAgaWYocm9vdCkge1xyXG4gICAgcm9vdCA9IHJvb3QgJiYgcm9vdC5zaGFkb3dSb290O1xyXG4gICAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiaGMtbG92ZWxhY2VcIik7XHJcbiAgICByb290ID0gcm9vdCAmJiByb290LnNoYWRvd1Jvb3Q7XHJcbiAgICByb290ID0gcm9vdCAmJiByb290LnF1ZXJ5U2VsZWN0b3IoXCJodWktdmlld1wiKSB8fCByb290LnF1ZXJ5U2VsZWN0b3IoXCJodWktcGFuZWwtdmlld1wiKTtcclxuICAgIHJldHVybiByb290O1xyXG4gIH1cclxuXHJcbiAgcm9vdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJob21lLWFzc2lzdGFudFwiKTtcclxuICByb290ID0gcm9vdCAmJiByb290LnNoYWRvd1Jvb3Q7XHJcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiaG9tZS1hc3Npc3RhbnQtbWFpblwiKTtcclxuICByb290ID0gcm9vdCAmJiByb290LnNoYWRvd1Jvb3Q7XHJcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiYXBwLWRyYXdlci1sYXlvdXQgcGFydGlhbC1wYW5lbC1yZXNvbHZlclwiKTtcclxuICByb290ID0gcm9vdCAmJiByb290LnNoYWRvd1Jvb3QgfHwgcm9vdDtcclxuICByb290ID0gcm9vdCAmJiByb290LnF1ZXJ5U2VsZWN0b3IoXCJoYS1wYW5lbC1sb3ZlbGFjZVwiKTtcclxuICByb290ID0gcm9vdCAmJiByb290LnNoYWRvd1Jvb3Q7XHJcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiaHVpLXJvb3RcIik7XHJcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5zaGFkb3dSb290O1xyXG4gIHJvb3QgPSByb290ICYmIHJvb3QucXVlcnlTZWxlY3RvcihcImhhLWFwcC1sYXlvdXRcIilcclxuICByb290ID0gcm9vdCAmJiByb290LnF1ZXJ5U2VsZWN0b3IoXCIjdmlld1wiKTtcclxuICByb290ID0gcm9vdCAmJiByb290LmZpcnN0RWxlbWVudENoaWxkO1xyXG4gIHJldHVybiByb290O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZF9sb3ZlbGFjZSgpIHtcclxuICBpZihjdXN0b21FbGVtZW50cy5nZXQoXCJodWktdmlld1wiKSkgcmV0dXJuIHRydWU7XHJcblxyXG4gIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKFwicGFydGlhbC1wYW5lbC1yZXNvbHZlclwiKTtcclxuICBjb25zdCBwcHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicGFydGlhbC1wYW5lbC1yZXNvbHZlclwiKTtcclxuICBwcHIuaGFzcyA9IHtwYW5lbHM6IFt7XHJcbiAgICB1cmxfcGF0aDogXCJ0bXBcIixcclxuICAgIFwiY29tcG9uZW50X25hbWVcIjogXCJsb3ZlbGFjZVwiLFxyXG4gIH1dfTtcclxuICBwcHIuX3VwZGF0ZVJvdXRlcygpO1xyXG4gIGF3YWl0IHBwci5yb3V0ZXJPcHRpb25zLnJvdXRlcy50bXAubG9hZCgpO1xyXG4gIGlmKCFjdXN0b21FbGVtZW50cy5nZXQoXCJoYS1wYW5lbC1sb3ZlbGFjZVwiKSkgcmV0dXJuIGZhbHNlO1xyXG4gIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaGEtcGFuZWwtbG92ZWxhY2VcIik7XHJcbiAgcC5oYXNzID0gaGFzcygpO1xyXG4gIGlmKHAuaGFzcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Nvbm5lY3Rpb24tc3RhdHVzJywgKGV2KSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXYpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSwge29uY2U6IHRydWV9KTtcclxuICAgIH0pO1xyXG4gICAgcC5oYXNzID0gaGFzcygpO1xyXG4gIH1cclxuICBwLnBhbmVsID0ge2NvbmZpZzoge21vZGU6IG51bGx9fTtcclxuICBwLl9mZXRjaENvbmZpZygpO1xyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcbiIsImltcG9ydCB7bG92ZWxhY2Vfdmlld30gZnJvbSBcIi4vaGFzc1wiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpcmVFdmVudChldiwgZGV0YWlsLCBlbnRpdHk9bnVsbCkge1xyXG4gIGV2ID0gbmV3IEV2ZW50KGV2LCB7XHJcbiAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgY2FuY2VsYWJsZTogZmFsc2UsXHJcbiAgICBjb21wb3NlZDogdHJ1ZSxcclxuICB9KTtcclxuICBldi5kZXRhaWwgPSBkZXRhaWwgfHwge307XHJcbiAgaWYoZW50aXR5KSB7XHJcbiAgICBlbnRpdHkuZGlzcGF0Y2hFdmVudChldik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciByb290ID0gbG92ZWxhY2VfdmlldygpO1xyXG4gICAgaWYgKHJvb3QpIHJvb3QuZGlzcGF0Y2hFdmVudChldik7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGZpcmVFdmVudCB9IGZyb20gXCIuL2V2ZW50XCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbW9yZUluZm8oZW50aXR5LCBsYXJnZT1mYWxzZSkge1xyXG4gIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaGMtbWFpblwiKSB8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaG9tZS1hc3Npc3RhbnRcIik7XHJcbiAgZmlyZUV2ZW50KFwiaGFzcy1tb3JlLWluZm9cIiwge2VudGl0eUlkOiBlbnRpdHl9LCByb290KTtcclxuICBjb25zdCBlbCA9IHJvb3QuX21vcmVJbmZvRWw7XHJcbiAgZWwubGFyZ2UgPSBsYXJnZTtcclxuICByZXR1cm4gZWw7XHJcbn1cclxuIiwiZnVuY3Rpb24gX2RldmljZUlEKCkge1xyXG4gIGNvbnN0IElEX1NUT1JBR0VfS0VZID0gJ2xvdmVsYWNlLXBsYXllci1kZXZpY2UtaWQnO1xyXG4gIGlmKHdpbmRvd1snZnVsbHknXSAmJiB0eXBlb2YgZnVsbHkuZ2V0RGV2aWNlSWQgPT09IFwiZnVuY3Rpb25cIilcclxuICAgIHJldHVybiBmdWxseS5nZXREZXZpY2VJZCgpO1xyXG4gIGlmKCFsb2NhbFN0b3JhZ2VbSURfU1RPUkFHRV9LRVldKVxyXG4gIHtcclxuICAgIGNvbnN0IHM0ID0gKCkgPT4ge1xyXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcigoMStNYXRoLnJhbmRvbSgpKSoxMDAwMDApLnRvU3RyaW5nKDE2KS5zdWJzdHJpbmcoMSk7XHJcbiAgICB9XHJcbiAgICBsb2NhbFN0b3JhZ2VbSURfU1RPUkFHRV9LRVldID0gYCR7czQoKX0ke3M0KCl9LSR7czQoKX0ke3M0KCl9YDtcclxuICB9XHJcbiAgcmV0dXJuIGxvY2FsU3RvcmFnZVtJRF9TVE9SQUdFX0tFWV07XHJcbn07XHJcblxyXG5leHBvcnQgbGV0IGRldmljZUlEID0gX2RldmljZUlEKCk7XHJcbiIsImltcG9ydCB7aGFzc30gZnJvbSAnLi9oYXNzLmpzJztcclxuaW1wb3J0IHtkZXZpY2VJRH0gZnJvbSAnLi9kZXZpY2VJRC5qcyc7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGFyc2VUZW1wbGF0ZShoYXNzLCBzdHIsIHNwZWNpYWxEYXRhID0ge30pIHtcclxuICBpZiAoIWhhc3MpIGhhc3MgPSBoYXNzKCk7XHJcbiAgaWYgKHR5cGVvZihzcGVjaWFsRGF0YSA9PT0gXCJzdHJpbmdcIikpIHNwZWNpYWxEYXRhID0ge307XHJcbiAgICBzcGVjaWFsRGF0YSA9IE9iamVjdC5hc3NpZ24oe1xyXG4gICAgICB1c2VyOiBoYXNzLnVzZXIubmFtZSxcclxuICAgICAgYnJvd3NlcjogZGV2aWNlSUQsXHJcbiAgICAgIGhhc2g6IGxvY2F0aW9uLmhhc2guc3Vic3RyKDEpIHx8ICcgJyxcclxuICAgIH0sXHJcbiAgICBzcGVjaWFsRGF0YSk7XHJcblxyXG4gICAgZm9yICh2YXIgayBpbiBzcGVjaWFsRGF0YSkge1xyXG4gICAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKGBcXFxceyR7a31cXFxcfWAsIFwiZ1wiKTtcclxuICAgICAgc3RyID0gc3RyLnJlcGxhY2UocmUsIHNwZWNpYWxEYXRhW2tdKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaGFzcy5jYWxsQXBpKFwiUE9TVFwiLCBcInRlbXBsYXRlXCIsIHt0ZW1wbGF0ZTogc3RyfSk7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaGFzVGVtcGxhdGUoc3RyKSB7XHJcbiAgaWYoU3RyaW5nKHN0cikuaW5jbHVkZXMoXCJ7JVwiKSlcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIGlmKFN0cmluZyhzdHIpLmluY2x1ZGVzKFwie3tcIikpXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN1YnNjcmliZVJlbmRlclRlbXBsYXRlKGNvbm4sIG9uQ2hhbmdlLCBwYXJhbXMpIHtcclxuICAvLyBwYXJhbXMgPSB7dGVtcGxhdGUsIGVudGl0eV9pZHMsIHZhcmlhYmxlc31cclxuICBpZighY29ubilcclxuICAgIGNvbm4gPSBoYXNzKCkuY29ubmVjdGlvbjtcclxuICBsZXQgdmFyaWFibGVzID0ge1xyXG4gICAgdXNlcjogaGFzcygpLnVzZXIubmFtZSxcclxuICAgIGJyb3dzZXI6IGRldmljZUlELFxyXG4gICAgaGFzaDogbG9jYXRpb24uaGFzaC5zdWJzdHIoMSkgfHwgJyAnLFxyXG4gICAgLi4ucGFyYW1zLnZhcmlhYmxlcyxcclxuICB9O1xyXG4gIGxldCB0ZW1wbGF0ZSA9IHBhcmFtcy50ZW1wbGF0ZTtcclxuICBsZXQgZW50aXR5X2lkcyA9IHBhcmFtcy5lbnRpdHlfaWRzO1xyXG5cclxuICByZXR1cm4gY29ubi5zdWJzY3JpYmVNZXNzYWdlKFxyXG4gICAgKG1zZykgPT4ge1xyXG4gICAgICBsZXQgcmVzID0gbXNnLnJlc3VsdDtcclxuICAgICAgLy8gTG9jYWxpemUgXCJfKGtleSlcIiBpZiBmb3VuZCBpbiB0ZW1wbGF0ZSByZXN1bHRzXHJcbiAgICAgIGNvbnN0IGxvY2FsaXplX2Z1bmN0aW9uID0gL19cXChbXildKlxcKS9nO1xyXG4gICAgICByZXMgPSByZXMucmVwbGFjZShsb2NhbGl6ZV9mdW5jdGlvbiwgKGtleSkgPT4gaGFzcygpLmxvY2FsaXplKGtleS5zdWJzdHJpbmcoMiwga2V5Lmxlbmd0aC0xKSkgfHwga2V5KTtcclxuICAgICAgb25DaGFuZ2UocmVzKVxyXG4gICAgfSxcclxuICAgIHsgdHlwZTogXCJyZW5kZXJfdGVtcGxhdGVcIixcclxuICAgICAgdGVtcGxhdGUsXHJcbiAgICAgIHZhcmlhYmxlcyxcclxuICAgICAgZW50aXR5X2lkcyxcclxuICAgIH1cclxuICApO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBmaXJlRXZlbnQgfSBmcm9tIFwiLi9ldmVudFwiO1xyXG5pbXBvcnQgeyBsb2FkX2xvdmVsYWNlIH0gZnJvbSBcIi4vaGFzc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IENVU1RPTV9UWVBFX1BSRUZJWCA9IFwiY3VzdG9tOlwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IERPTUFJTlNfSElERV9NT1JFX0lORk8gPSBbXHJcbiAgXCJpbnB1dF9udW1iZXJcIixcclxuICBcImlucHV0X3NlbGVjdFwiLFxyXG4gIFwiaW5wdXRfdGV4dFwiLFxyXG4gIFwic2NlbmVcIixcclxuICBcIndlYmxpbmtcIixcclxuXTtcclxuXHJcbmxldCBoZWxwZXJzID0gd2luZG93LmNhcmRIZWxwZXJzO1xyXG5jb25zdCBoZWxwZXJQcm9taXNlID0gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gIGlmKGhlbHBlcnMpIHJlc29sdmUoKTtcclxuXHJcbiAgY29uc3QgdXBkYXRlSGVscGVycyA9IGFzeW5jICgpID0+IHtcclxuICAgIGhlbHBlcnMgPSBhd2FpdCB3aW5kb3cubG9hZENhcmRIZWxwZXJzKCk7XHJcbiAgICB3aW5kb3cuY2FyZEhlbHBlcnMgPSBoZWxwZXJzO1xyXG4gICAgcmVzb2x2ZSgpO1xyXG4gIH1cclxuXHJcbiAgaWYod2luZG93LmxvYWRDYXJkSGVscGVycykge1xyXG4gICAgdXBkYXRlSGVscGVycygpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBJZiBsb2FkQ2FyZEhlbHBlcnMgZGlkbid0IGV4aXN0LCBmb3JjZSBsb2FkIGxvdmVsYWNlIGFuZCB0cnkgb25jZSBtb3JlLlxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGFzeW5jICgpID0+IHtcclxuICAgICAgbG9hZF9sb3ZlbGFjZSgpO1xyXG4gICAgICBpZih3aW5kb3cubG9hZENhcmRIZWxwZXJzKSB7XHJcbiAgICAgICAgdXBkYXRlSGVscGVycygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZXJyb3JFbGVtZW50KGVycm9yLCBvcmlnQ29uZmlnKSB7XHJcbiAgY29uc3QgY2ZnID0ge1xyXG4gICAgdHlwZTogXCJlcnJvclwiLFxyXG4gICAgZXJyb3IsXHJcbiAgICBvcmlnQ29uZmlnLFxyXG4gIH07XHJcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHVpLWVycm9yLWNhcmRcIik7XHJcbiAgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoXCJodWktZXJyb3ItY2FyZFwiKS50aGVuKCgpID0+IHtcclxuICAgIGNvbnN0IG5ld2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImh1aS1lcnJvci1jYXJkXCIpO1xyXG4gICAgbmV3ZWwuc2V0Q29uZmlnKGNmZyk7XHJcbiAgICBpZihlbC5wYXJlbnRFbGVtZW50KVxyXG4gICAgICBlbC5wYXJlbnRFbGVtZW50LnJlcGxhY2VDaGlsZChuZXdlbCwgZWwpO1xyXG4gIH0pO1xyXG4gIGhlbHBlclByb21pc2UudGhlbigoKSA9PiB7XHJcbiAgICBmaXJlRXZlbnQoXCJsbC1yZWJ1aWxkXCIsIHt9LCBlbCk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGVsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBfY3JlYXRlRWxlbWVudCh0YWcsIGNvbmZpZykge1xyXG4gIGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcclxuICB0cnkge1xyXG4gICAgZWwuc2V0Q29uZmlnKEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoY29uZmlnKSkpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgZWwgPSBlcnJvckVsZW1lbnQoZXJyLCBjb25maWcpO1xyXG4gIH1cclxuICBoZWxwZXJQcm9taXNlLnRoZW4oKCkgPT4ge1xyXG4gICAgZmlyZUV2ZW50KFwibGwtcmVidWlsZFwiLCB7fSwgZWwpO1xyXG4gIH0pO1xyXG4gIHJldHVybiBlbDtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTG92ZWxhY2VFbGVtZW50KHRoaW5nLCBjb25maWcpIHtcclxuICBpZighY29uZmlnIHx8IHR5cGVvZiBjb25maWcgIT09IFwib2JqZWN0XCIgfHwgIWNvbmZpZy50eXBlKVxyXG4gICAgcmV0dXJuIGVycm9yRWxlbWVudChgTm8gJHt0aGluZ30gdHlwZSBjb25maWd1cmVkYCwgY29uZmlnKTtcclxuXHJcbiAgbGV0IHRhZyA9IGNvbmZpZy50eXBlO1xyXG4gIGlmKHRhZy5zdGFydHNXaXRoKENVU1RPTV9UWVBFX1BSRUZJWCkpXHJcbiAgICB0YWcgPSB0YWcuc3Vic3RyKENVU1RPTV9UWVBFX1BSRUZJWC5sZW5ndGgpO1xyXG4gIGVsc2VcclxuICAgIHRhZyA9IGBodWktJHt0YWd9LSR7dGhpbmd9YDtcclxuXHJcbiAgaWYoY3VzdG9tRWxlbWVudHMuZ2V0KHRhZykpXHJcbiAgICByZXR1cm4gX2NyZWF0ZUVsZW1lbnQodGFnLCBjb25maWcpO1xyXG5cclxuICBjb25zdCBlbCA9IGVycm9yRWxlbWVudChgQ3VzdG9tIGVsZW1lbnQgZG9lc24ndCBleGlzdDogJHt0YWd9LmAsIGNvbmZpZyk7XHJcbiAgZWwuc3R5bGUuZGlzcGxheSA9IFwiTm9uZVwiO1xyXG5cclxuICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgZWwuc3R5bGUuZGlzcGxheSA9IFwiXCI7XHJcbiAgfSwgMjAwMCk7XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKHRhZykudGhlbigoKSA9PiB7XHJcbiAgICBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgZmlyZUV2ZW50KFwibGwtcmVidWlsZFwiLCB7fSwgZWwpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gZWw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDYXJkKGNvbmZpZykge1xyXG4gIGlmKGhlbHBlcnMpIHJldHVybiBoZWxwZXJzLmNyZWF0ZUNhcmRFbGVtZW50KGNvbmZpZyk7XHJcbiAgcmV0dXJuIGNyZWF0ZUxvdmVsYWNlRWxlbWVudCgnY2FyZCcsIGNvbmZpZyk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQoY29uZmlnKSB7XHJcbiAgaWYoaGVscGVycykgcmV0dXJuIGhlbHBlcnMuY3JlYXRlSHVpRWxlbWVudChjb25maWcpO1xyXG4gIHJldHVybiBjcmVhdGVMb3ZlbGFjZUVsZW1lbnQoJ2VsZW1lbnQnLCBjb25maWcpO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbnRpdHlSb3coY29uZmlnKSB7XHJcbiAgaWYoaGVscGVycykgcmV0dXJuIGhlbHBlcnMuY3JlYXRlUm93RWxlbWVudChjb25maWcpO1xyXG4gIGNvbnN0IFNQRUNJQUxfVFlQRVMgPSBuZXcgU2V0KFtcclxuICAgIFwiY2FsbC1zZXJ2aWNlXCIsXHJcbiAgICBcImNhc3RcIixcclxuICAgIFwiY29uZGl0aW9uYWxcIixcclxuICAgIFwiZGl2aWRlclwiLFxyXG4gICAgXCJzZWN0aW9uXCIsXHJcbiAgICBcInNlbGVjdFwiLFxyXG4gICAgXCJ3ZWJsaW5rXCIsXHJcbiAgXSk7XHJcbiAgY29uc3QgREVGQVVMVF9ST1dTID0ge1xyXG4gICAgYWxlcnQ6IFwidG9nZ2xlXCIsXHJcbiAgICBhdXRvbWF0aW9uOiBcInRvZ2dsZVwiLFxyXG4gICAgY2xpbWF0ZTogXCJjbGltYXRlXCIsXHJcbiAgICBjb3ZlcjogXCJjb3ZlclwiLFxyXG4gICAgZmFuOiBcInRvZ2dsZVwiLFxyXG4gICAgZ3JvdXA6IFwiZ3JvdXBcIixcclxuICAgIGlucHV0X2Jvb2xlYW46IFwidG9nZ2xlXCIsXHJcbiAgICBpbnB1dF9udW1iZXI6IFwiaW5wdXQtbnVtYmVyXCIsXHJcbiAgICBpbnB1dF9zZWxlY3Q6IFwiaW5wdXQtc2VsZWN0XCIsXHJcbiAgICBpbnB1dF90ZXh0OiBcImlucHV0LXRleHRcIixcclxuICAgIGxpZ2h0OiBcInRvZ2dsZVwiLFxyXG4gICAgbG9jazogXCJsb2NrXCIsXHJcbiAgICBtZWRpYV9wbGF5ZXI6IFwibWVkaWEtcGxheWVyXCIsXHJcbiAgICByZW1vdGU6IFwidG9nZ2xlXCIsXHJcbiAgICBzY2VuZTogXCJzY2VuZVwiLFxyXG4gICAgc2NyaXB0OiBcInNjcmlwdFwiLFxyXG4gICAgc2Vuc29yOiBcInNlbnNvclwiLFxyXG4gICAgdGltZXI6IFwidGltZXJcIixcclxuICAgIHN3aXRjaDogXCJ0b2dnbGVcIixcclxuICAgIHZhY3V1bTogXCJ0b2dnbGVcIixcclxuICAgIHdhdGVyX2hlYXRlcjogXCJjbGltYXRlXCIsXHJcbiAgICBpbnB1dF9kYXRldGltZTogXCJpbnB1dC1kYXRldGltZVwiLFxyXG4gICAgbm9uZTogdW5kZWZpbmVkLFxyXG4gIH07XHJcblxyXG4gIGlmKCFjb25maWcpXHJcbiAgICByZXR1cm4gZXJyb3JFbGVtZW50KFwiSW52YWxpZCBjb25maWd1cmF0aW9uIGdpdmVuLlwiLCBjb25maWcpO1xyXG4gIGlmKHR5cGVvZiBjb25maWcgPT09IFwic3RyaW5nXCIpXHJcbiAgICBjb25maWcgPSB7ZW50aXR5OiBjb25maWd9O1xyXG4gIGlmKHR5cGVvZiBjb25maWcgIT09IFwib2JqZWN0XCIgfHwgKCFjb25maWcuZW50aXR5ICYmICFjb25maWcudHlwZSkpXHJcbiAgICByZXR1cm4gZXJyb3JFbGVtZW50KFwiSW52YWxpZCBjb25maWd1cmF0aW9uIGdpdmVuLlwiLCBjb25maWcpO1xyXG5cclxuICBjb25zdCB0eXBlID0gY29uZmlnLnR5cGUgfHwgXCJkZWZhdWx0XCI7XHJcbiAgaWYoU1BFQ0lBTF9UWVBFUy5oYXModHlwZSkgfHwgdHlwZS5zdGFydHNXaXRoKENVU1RPTV9UWVBFX1BSRUZJWCkpXHJcbiAgICByZXR1cm4gY3JlYXRlTG92ZWxhY2VFbGVtZW50KCdyb3cnLCBjb25maWcpO1xyXG5cclxuICBjb25zdCBkb21haW4gPSBjb25maWcuZW50aXR5ID8gY29uZmlnLmVudGl0eS5zcGxpdChcIi5cIiwgMSlbMF06IFwibm9uZVwiO1xyXG4gIHJldHVybiBjcmVhdGVMb3ZlbGFjZUVsZW1lbnQoJ2VudGl0eS1yb3cnLCB7XHJcbiAgICB0eXBlOiBERUZBVUxUX1JPV1NbZG9tYWluXSB8fCBcInRleHRcIixcclxuICAgIC4uLmNvbmZpZyxcclxuICAgIH0pO1xyXG59XHJcbiIsIi8qISBIYW1tZXIuSlMgLSB2Mi4wLjcgLSAyMDE2LTA0LTIyXG4gKiBodHRwOi8vaGFtbWVyanMuZ2l0aHViLmlvL1xuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNiBKb3JpayBUYW5nZWxkZXI7XG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKi9cbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCBleHBvcnROYW1lLCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG52YXIgVkVORE9SX1BSRUZJWEVTID0gWycnLCAnd2Via2l0JywgJ01veicsICdNUycsICdtcycsICdvJ107XG52YXIgVEVTVF9FTEVNRU5UID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbnZhciBUWVBFX0ZVTkNUSU9OID0gJ2Z1bmN0aW9uJztcblxudmFyIHJvdW5kID0gTWF0aC5yb3VuZDtcbnZhciBhYnMgPSBNYXRoLmFicztcbnZhciBub3cgPSBEYXRlLm5vdztcblxuLyoqXG4gKiBzZXQgYSB0aW1lb3V0IHdpdGggYSBnaXZlbiBzY29wZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0XG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gc2V0VGltZW91dENvbnRleHQoZm4sIHRpbWVvdXQsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gc2V0VGltZW91dChiaW5kRm4oZm4sIGNvbnRleHQpLCB0aW1lb3V0KTtcbn1cblxuLyoqXG4gKiBpZiB0aGUgYXJndW1lbnQgaXMgYW4gYXJyYXksIHdlIHdhbnQgdG8gZXhlY3V0ZSB0aGUgZm4gb24gZWFjaCBlbnRyeVxuICogaWYgaXQgYWludCBhbiBhcnJheSB3ZSBkb24ndCB3YW50IHRvIGRvIGEgdGhpbmcuXG4gKiB0aGlzIGlzIHVzZWQgYnkgYWxsIHRoZSBtZXRob2RzIHRoYXQgYWNjZXB0IGEgc2luZ2xlIGFuZCBhcnJheSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7KnxBcnJheX0gYXJnXG4gKiBAcGFyYW0ge1N0cmluZ30gZm5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF1cbiAqIEByZXR1cm5zIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpbnZva2VBcnJheUFyZyhhcmcsIGZuLCBjb250ZXh0KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuICAgICAgICBlYWNoKGFyZywgY29udGV4dFtmbl0sIGNvbnRleHQpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIHdhbGsgb2JqZWN0cyBhbmQgYXJyYXlzXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRvclxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHRcbiAqL1xuZnVuY3Rpb24gZWFjaChvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIGk7XG5cbiAgICBpZiAoIW9iaikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9iai5mb3JFYWNoKSB7XG4gICAgICAgIG9iai5mb3JFYWNoKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKG9iai5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBvYmoubGVuZ3RoKSB7XG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaSBpbiBvYmopIHtcbiAgICAgICAgICAgIG9iai5oYXNPd25Qcm9wZXJ0eShpKSAmJiBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiB3cmFwIGEgbWV0aG9kIHdpdGggYSBkZXByZWNhdGlvbiB3YXJuaW5nIGFuZCBzdGFjayB0cmFjZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBuZXcgZnVuY3Rpb24gd3JhcHBpbmcgdGhlIHN1cHBsaWVkIG1ldGhvZC5cbiAqL1xuZnVuY3Rpb24gZGVwcmVjYXRlKG1ldGhvZCwgbmFtZSwgbWVzc2FnZSkge1xuICAgIHZhciBkZXByZWNhdGlvbk1lc3NhZ2UgPSAnREVQUkVDQVRFRCBNRVRIT0Q6ICcgKyBuYW1lICsgJ1xcbicgKyBtZXNzYWdlICsgJyBBVCBcXG4nO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoJ2dldC1zdGFjay10cmFjZScpO1xuICAgICAgICB2YXIgc3RhY2sgPSBlICYmIGUuc3RhY2sgPyBlLnN0YWNrLnJlcGxhY2UoL15bXlxcKF0rP1tcXG4kXS9nbSwgJycpXG4gICAgICAgICAgICAucmVwbGFjZSgvXlxccythdFxccysvZ20sICcnKVxuICAgICAgICAgICAgLnJlcGxhY2UoL15PYmplY3QuPGFub255bW91cz5cXHMqXFwoL2dtLCAne2Fub255bW91c30oKUAnKSA6ICdVbmtub3duIFN0YWNrIFRyYWNlJztcblxuICAgICAgICB2YXIgbG9nID0gd2luZG93LmNvbnNvbGUgJiYgKHdpbmRvdy5jb25zb2xlLndhcm4gfHwgd2luZG93LmNvbnNvbGUubG9nKTtcbiAgICAgICAgaWYgKGxvZykge1xuICAgICAgICAgICAgbG9nLmNhbGwod2luZG93LmNvbnNvbGUsIGRlcHJlY2F0aW9uTWVzc2FnZSwgc3RhY2spO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xufVxuXG4vKipcbiAqIGV4dGVuZCBvYmplY3QuXG4gKiBtZWFucyB0aGF0IHByb3BlcnRpZXMgaW4gZGVzdCB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IHRoZSBvbmVzIGluIHNyYy5cbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBvYmplY3RzX3RvX2Fzc2lnblxuICogQHJldHVybnMge09iamVjdH0gdGFyZ2V0XG4gKi9cbnZhciBhc3NpZ247XG5pZiAodHlwZW9mIE9iamVjdC5hc3NpZ24gIT09ICdmdW5jdGlvbicpIHtcbiAgICBhc3NpZ24gPSBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0KSB7XG4gICAgICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG91dHB1dCA9IE9iamVjdCh0YXJnZXQpO1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpbmRleF07XG4gICAgICAgICAgICBpZiAoc291cmNlICE9PSB1bmRlZmluZWQgJiYgc291cmNlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbmV4dEtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShuZXh0S2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0W25leHRLZXldID0gc291cmNlW25leHRLZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbn0gZWxzZSB7XG4gICAgYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcbn1cblxuLyoqXG4gKiBleHRlbmQgb2JqZWN0LlxuICogbWVhbnMgdGhhdCBwcm9wZXJ0aWVzIGluIGRlc3Qgd2lsbCBiZSBvdmVyd3JpdHRlbiBieSB0aGUgb25lcyBpbiBzcmMuXG4gKiBAcGFyYW0ge09iamVjdH0gZGVzdFxuICogQHBhcmFtIHtPYmplY3R9IHNyY1xuICogQHBhcmFtIHtCb29sZWFufSBbbWVyZ2U9ZmFsc2VdXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBkZXN0XG4gKi9cbnZhciBleHRlbmQgPSBkZXByZWNhdGUoZnVuY3Rpb24gZXh0ZW5kKGRlc3QsIHNyYywgbWVyZ2UpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHNyYyk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwga2V5cy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCFtZXJnZSB8fCAobWVyZ2UgJiYgZGVzdFtrZXlzW2ldXSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgZGVzdFtrZXlzW2ldXSA9IHNyY1trZXlzW2ldXTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBkZXN0O1xufSwgJ2V4dGVuZCcsICdVc2UgYGFzc2lnbmAuJyk7XG5cbi8qKlxuICogbWVyZ2UgdGhlIHZhbHVlcyBmcm9tIHNyYyBpbiB0aGUgZGVzdC5cbiAqIG1lYW5zIHRoYXQgcHJvcGVydGllcyB0aGF0IGV4aXN0IGluIGRlc3Qgd2lsbCBub3QgYmUgb3ZlcndyaXR0ZW4gYnkgc3JjXG4gKiBAcGFyYW0ge09iamVjdH0gZGVzdFxuICogQHBhcmFtIHtPYmplY3R9IHNyY1xuICogQHJldHVybnMge09iamVjdH0gZGVzdFxuICovXG52YXIgbWVyZ2UgPSBkZXByZWNhdGUoZnVuY3Rpb24gbWVyZ2UoZGVzdCwgc3JjKSB7XG4gICAgcmV0dXJuIGV4dGVuZChkZXN0LCBzcmMsIHRydWUpO1xufSwgJ21lcmdlJywgJ1VzZSBgYXNzaWduYC4nKTtcblxuLyoqXG4gKiBzaW1wbGUgY2xhc3MgaW5oZXJpdGFuY2VcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNoaWxkXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBiYXNlXG4gKiBAcGFyYW0ge09iamVjdH0gW3Byb3BlcnRpZXNdXG4gKi9cbmZ1bmN0aW9uIGluaGVyaXQoY2hpbGQsIGJhc2UsIHByb3BlcnRpZXMpIHtcbiAgICB2YXIgYmFzZVAgPSBiYXNlLnByb3RvdHlwZSxcbiAgICAgICAgY2hpbGRQO1xuXG4gICAgY2hpbGRQID0gY2hpbGQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShiYXNlUCk7XG4gICAgY2hpbGRQLmNvbnN0cnVjdG9yID0gY2hpbGQ7XG4gICAgY2hpbGRQLl9zdXBlciA9IGJhc2VQO1xuXG4gICAgaWYgKHByb3BlcnRpZXMpIHtcbiAgICAgICAgYXNzaWduKGNoaWxkUCwgcHJvcGVydGllcyk7XG4gICAgfVxufVxuXG4vKipcbiAqIHNpbXBsZSBmdW5jdGlvbiBiaW5kXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHRcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gYmluZEZuKGZuLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGJvdW5kRm4oKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5cbi8qKlxuICogbGV0IGEgYm9vbGVhbiB2YWx1ZSBhbHNvIGJlIGEgZnVuY3Rpb24gdGhhdCBtdXN0IHJldHVybiBhIGJvb2xlYW5cbiAqIHRoaXMgZmlyc3QgaXRlbSBpbiBhcmdzIHdpbGwgYmUgdXNlZCBhcyB0aGUgY29udGV4dFxuICogQHBhcmFtIHtCb29sZWFufEZ1bmN0aW9ufSB2YWxcbiAqIEBwYXJhbSB7QXJyYXl9IFthcmdzXVxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGJvb2xPckZuKHZhbCwgYXJncykge1xuICAgIGlmICh0eXBlb2YgdmFsID09IFRZUEVfRlVOQ1RJT04pIHtcbiAgICAgICAgcmV0dXJuIHZhbC5hcHBseShhcmdzID8gYXJnc1swXSB8fCB1bmRlZmluZWQgOiB1bmRlZmluZWQsIGFyZ3MpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xufVxuXG4vKipcbiAqIHVzZSB0aGUgdmFsMiB3aGVuIHZhbDEgaXMgdW5kZWZpbmVkXG4gKiBAcGFyYW0geyp9IHZhbDFcbiAqIEBwYXJhbSB7Kn0gdmFsMlxuICogQHJldHVybnMgeyp9XG4gKi9cbmZ1bmN0aW9uIGlmVW5kZWZpbmVkKHZhbDEsIHZhbDIpIHtcbiAgICByZXR1cm4gKHZhbDEgPT09IHVuZGVmaW5lZCkgPyB2YWwyIDogdmFsMTtcbn1cblxuLyoqXG4gKiBhZGRFdmVudExpc3RlbmVyIHdpdGggbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2VcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IHRhcmdldFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXG4gKi9cbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJzKHRhcmdldCwgdHlwZXMsIGhhbmRsZXIpIHtcbiAgICBlYWNoKHNwbGl0U3RyKHR5cGVzKSwgZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogcmVtb3ZlRXZlbnRMaXN0ZW5lciB3aXRoIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fSB0YXJnZXRcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlclxuICovXG5mdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycyh0YXJnZXQsIHR5cGVzLCBoYW5kbGVyKSB7XG4gICAgZWFjaChzcGxpdFN0cih0eXBlcyksIGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgZmFsc2UpO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGZpbmQgaWYgYSBub2RlIGlzIGluIHRoZSBnaXZlbiBwYXJlbnRcbiAqIEBtZXRob2QgaGFzUGFyZW50XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYXJlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGZvdW5kXG4gKi9cbmZ1bmN0aW9uIGhhc1BhcmVudChub2RlLCBwYXJlbnQpIHtcbiAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICBpZiAobm9kZSA9PSBwYXJlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBzbWFsbCBpbmRleE9mIHdyYXBwZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaW5kXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gZm91bmRcbiAqL1xuZnVuY3Rpb24gaW5TdHIoc3RyLCBmaW5kKSB7XG4gICAgcmV0dXJuIHN0ci5pbmRleE9mKGZpbmQpID4gLTE7XG59XG5cbi8qKlxuICogc3BsaXQgc3RyaW5nIG9uIHdoaXRlc3BhY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtBcnJheX0gd29yZHNcbiAqL1xuZnVuY3Rpb24gc3BsaXRTdHIoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50cmltKCkuc3BsaXQoL1xccysvZyk7XG59XG5cbi8qKlxuICogZmluZCBpZiBhIGFycmF5IGNvbnRhaW5zIHRoZSBvYmplY3QgdXNpbmcgaW5kZXhPZiBvciBhIHNpbXBsZSBwb2x5RmlsbFxuICogQHBhcmFtIHtBcnJheX0gc3JjXG4gKiBAcGFyYW0ge1N0cmluZ30gZmluZFxuICogQHBhcmFtIHtTdHJpbmd9IFtmaW5kQnlLZXldXG4gKiBAcmV0dXJuIHtCb29sZWFufE51bWJlcn0gZmFsc2Ugd2hlbiBub3QgZm91bmQsIG9yIHRoZSBpbmRleFxuICovXG5mdW5jdGlvbiBpbkFycmF5KHNyYywgZmluZCwgZmluZEJ5S2V5KSB7XG4gICAgaWYgKHNyYy5pbmRleE9mICYmICFmaW5kQnlLZXkpIHtcbiAgICAgICAgcmV0dXJuIHNyYy5pbmRleE9mKGZpbmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBzcmMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoKGZpbmRCeUtleSAmJiBzcmNbaV1bZmluZEJ5S2V5XSA9PSBmaW5kKSB8fCAoIWZpbmRCeUtleSAmJiBzcmNbaV0gPT09IGZpbmQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbn1cblxuLyoqXG4gKiBjb252ZXJ0IGFycmF5LWxpa2Ugb2JqZWN0cyB0byByZWFsIGFycmF5c1xuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybnMge0FycmF5fVxuICovXG5mdW5jdGlvbiB0b0FycmF5KG9iaikge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChvYmosIDApO1xufVxuXG4vKipcbiAqIHVuaXF1ZSBhcnJheSB3aXRoIG9iamVjdHMgYmFzZWQgb24gYSBrZXkgKGxpa2UgJ2lkJykgb3IganVzdCBieSB0aGUgYXJyYXkncyB2YWx1ZVxuICogQHBhcmFtIHtBcnJheX0gc3JjIFt7aWQ6MX0se2lkOjJ9LHtpZDoxfV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBba2V5XVxuICogQHBhcmFtIHtCb29sZWFufSBbc29ydD1GYWxzZV1cbiAqIEByZXR1cm5zIHtBcnJheX0gW3tpZDoxfSx7aWQ6Mn1dXG4gKi9cbmZ1bmN0aW9uIHVuaXF1ZUFycmF5KHNyYywga2V5LCBzb3J0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICB2YXIgdmFsdWVzID0gW107XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgd2hpbGUgKGkgPCBzcmMubGVuZ3RoKSB7XG4gICAgICAgIHZhciB2YWwgPSBrZXkgPyBzcmNbaV1ba2V5XSA6IHNyY1tpXTtcbiAgICAgICAgaWYgKGluQXJyYXkodmFsdWVzLCB2YWwpIDwgMCkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHNyY1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWVzW2ldID0gdmFsO1xuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgaWYgKHNvcnQpIHtcbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLnNvcnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLnNvcnQoZnVuY3Rpb24gc29ydFVuaXF1ZUFycmF5KGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYVtrZXldID4gYltrZXldO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbn1cblxuLyoqXG4gKiBnZXQgdGhlIHByZWZpeGVkIHByb3BlcnR5XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlcbiAqIEByZXR1cm5zIHtTdHJpbmd8VW5kZWZpbmVkfSBwcmVmaXhlZFxuICovXG5mdW5jdGlvbiBwcmVmaXhlZChvYmosIHByb3BlcnR5KSB7XG4gICAgdmFyIHByZWZpeCwgcHJvcDtcbiAgICB2YXIgY2FtZWxQcm9wID0gcHJvcGVydHlbMF0udG9VcHBlckNhc2UoKSArIHByb3BlcnR5LnNsaWNlKDEpO1xuXG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgVkVORE9SX1BSRUZJWEVTLmxlbmd0aCkge1xuICAgICAgICBwcmVmaXggPSBWRU5ET1JfUFJFRklYRVNbaV07XG4gICAgICAgIHByb3AgPSAocHJlZml4KSA/IHByZWZpeCArIGNhbWVsUHJvcCA6IHByb3BlcnR5O1xuXG4gICAgICAgIGlmIChwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIHByb3A7XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIGdldCBhIHVuaXF1ZSBpZFxuICogQHJldHVybnMge251bWJlcn0gdW5pcXVlSWRcbiAqL1xudmFyIF91bmlxdWVJZCA9IDE7XG5mdW5jdGlvbiB1bmlxdWVJZCgpIHtcbiAgICByZXR1cm4gX3VuaXF1ZUlkKys7XG59XG5cbi8qKlxuICogZ2V0IHRoZSB3aW5kb3cgb2JqZWN0IG9mIGFuIGVsZW1lbnRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEByZXR1cm5zIHtEb2N1bWVudFZpZXd8V2luZG93fVxuICovXG5mdW5jdGlvbiBnZXRXaW5kb3dGb3JFbGVtZW50KGVsZW1lbnQpIHtcbiAgICB2YXIgZG9jID0gZWxlbWVudC5vd25lckRvY3VtZW50IHx8IGVsZW1lbnQ7XG4gICAgcmV0dXJuIChkb2MuZGVmYXVsdFZpZXcgfHwgZG9jLnBhcmVudFdpbmRvdyB8fCB3aW5kb3cpO1xufVxuXG52YXIgTU9CSUxFX1JFR0VYID0gL21vYmlsZXx0YWJsZXR8aXAoYWR8aG9uZXxvZCl8YW5kcm9pZC9pO1xuXG52YXIgU1VQUE9SVF9UT1VDSCA9ICgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpO1xudmFyIFNVUFBPUlRfUE9JTlRFUl9FVkVOVFMgPSBwcmVmaXhlZCh3aW5kb3csICdQb2ludGVyRXZlbnQnKSAhPT0gdW5kZWZpbmVkO1xudmFyIFNVUFBPUlRfT05MWV9UT1VDSCA9IFNVUFBPUlRfVE9VQ0ggJiYgTU9CSUxFX1JFR0VYLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cbnZhciBJTlBVVF9UWVBFX1RPVUNIID0gJ3RvdWNoJztcbnZhciBJTlBVVF9UWVBFX1BFTiA9ICdwZW4nO1xudmFyIElOUFVUX1RZUEVfTU9VU0UgPSAnbW91c2UnO1xudmFyIElOUFVUX1RZUEVfS0lORUNUID0gJ2tpbmVjdCc7XG5cbnZhciBDT01QVVRFX0lOVEVSVkFMID0gMjU7XG5cbnZhciBJTlBVVF9TVEFSVCA9IDE7XG52YXIgSU5QVVRfTU9WRSA9IDI7XG52YXIgSU5QVVRfRU5EID0gNDtcbnZhciBJTlBVVF9DQU5DRUwgPSA4O1xuXG52YXIgRElSRUNUSU9OX05PTkUgPSAxO1xudmFyIERJUkVDVElPTl9MRUZUID0gMjtcbnZhciBESVJFQ1RJT05fUklHSFQgPSA0O1xudmFyIERJUkVDVElPTl9VUCA9IDg7XG52YXIgRElSRUNUSU9OX0RPV04gPSAxNjtcblxudmFyIERJUkVDVElPTl9IT1JJWk9OVEFMID0gRElSRUNUSU9OX0xFRlQgfCBESVJFQ1RJT05fUklHSFQ7XG52YXIgRElSRUNUSU9OX1ZFUlRJQ0FMID0gRElSRUNUSU9OX1VQIHwgRElSRUNUSU9OX0RPV047XG52YXIgRElSRUNUSU9OX0FMTCA9IERJUkVDVElPTl9IT1JJWk9OVEFMIHwgRElSRUNUSU9OX1ZFUlRJQ0FMO1xuXG52YXIgUFJPUFNfWFkgPSBbJ3gnLCAneSddO1xudmFyIFBST1BTX0NMSUVOVF9YWSA9IFsnY2xpZW50WCcsICdjbGllbnRZJ107XG5cbi8qKlxuICogY3JlYXRlIG5ldyBpbnB1dCB0eXBlIG1hbmFnZXJcbiAqIEBwYXJhbSB7TWFuYWdlcn0gbWFuYWdlclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm5zIHtJbnB1dH1cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBJbnB1dChtYW5hZ2VyLCBjYWxsYmFjaykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB0aGlzLmVsZW1lbnQgPSBtYW5hZ2VyLmVsZW1lbnQ7XG4gICAgdGhpcy50YXJnZXQgPSBtYW5hZ2VyLm9wdGlvbnMuaW5wdXRUYXJnZXQ7XG5cbiAgICAvLyBzbWFsbGVyIHdyYXBwZXIgYXJvdW5kIHRoZSBoYW5kbGVyLCBmb3IgdGhlIHNjb3BlIGFuZCB0aGUgZW5hYmxlZCBzdGF0ZSBvZiB0aGUgbWFuYWdlcixcbiAgICAvLyBzbyB3aGVuIGRpc2FibGVkIHRoZSBpbnB1dCBldmVudHMgYXJlIGNvbXBsZXRlbHkgYnlwYXNzZWQuXG4gICAgdGhpcy5kb21IYW5kbGVyID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgaWYgKGJvb2xPckZuKG1hbmFnZXIub3B0aW9ucy5lbmFibGUsIFttYW5hZ2VyXSkpIHtcbiAgICAgICAgICAgIHNlbGYuaGFuZGxlcihldik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5pbml0KCk7XG5cbn1cblxuSW5wdXQucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIHNob3VsZCBoYW5kbGUgdGhlIGlucHV0RXZlbnQgZGF0YSBhbmQgdHJpZ2dlciB0aGUgY2FsbGJhY2tcbiAgICAgKiBAdmlydHVhbFxuICAgICAqL1xuICAgIGhhbmRsZXI6IGZ1bmN0aW9uKCkgeyB9LFxuXG4gICAgLyoqXG4gICAgICogYmluZCB0aGUgZXZlbnRzXG4gICAgICovXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZXZFbCAmJiBhZGRFdmVudExpc3RlbmVycyh0aGlzLmVsZW1lbnQsIHRoaXMuZXZFbCwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5ldlRhcmdldCAmJiBhZGRFdmVudExpc3RlbmVycyh0aGlzLnRhcmdldCwgdGhpcy5ldlRhcmdldCwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5ldldpbiAmJiBhZGRFdmVudExpc3RlbmVycyhnZXRXaW5kb3dGb3JFbGVtZW50KHRoaXMuZWxlbWVudCksIHRoaXMuZXZXaW4sIHRoaXMuZG9tSGFuZGxlcik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHVuYmluZCB0aGUgZXZlbnRzXG4gICAgICovXG4gICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZXZFbCAmJiByZW1vdmVFdmVudExpc3RlbmVycyh0aGlzLmVsZW1lbnQsIHRoaXMuZXZFbCwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5ldlRhcmdldCAmJiByZW1vdmVFdmVudExpc3RlbmVycyh0aGlzLnRhcmdldCwgdGhpcy5ldlRhcmdldCwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5ldldpbiAmJiByZW1vdmVFdmVudExpc3RlbmVycyhnZXRXaW5kb3dGb3JFbGVtZW50KHRoaXMuZWxlbWVudCksIHRoaXMuZXZXaW4sIHRoaXMuZG9tSGFuZGxlcik7XG4gICAgfVxufTtcblxuLyoqXG4gKiBjcmVhdGUgbmV3IGlucHV0IHR5cGUgbWFuYWdlclxuICogY2FsbGVkIGJ5IHRoZSBNYW5hZ2VyIGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0hhbW1lcn0gbWFuYWdlclxuICogQHJldHVybnMge0lucHV0fVxuICovXG5mdW5jdGlvbiBjcmVhdGVJbnB1dEluc3RhbmNlKG1hbmFnZXIpIHtcbiAgICB2YXIgVHlwZTtcbiAgICB2YXIgaW5wdXRDbGFzcyA9IG1hbmFnZXIub3B0aW9ucy5pbnB1dENsYXNzO1xuXG4gICAgaWYgKGlucHV0Q2xhc3MpIHtcbiAgICAgICAgVHlwZSA9IGlucHV0Q2xhc3M7XG4gICAgfSBlbHNlIGlmIChTVVBQT1JUX1BPSU5URVJfRVZFTlRTKSB7XG4gICAgICAgIFR5cGUgPSBQb2ludGVyRXZlbnRJbnB1dDtcbiAgICB9IGVsc2UgaWYgKFNVUFBPUlRfT05MWV9UT1VDSCkge1xuICAgICAgICBUeXBlID0gVG91Y2hJbnB1dDtcbiAgICB9IGVsc2UgaWYgKCFTVVBQT1JUX1RPVUNIKSB7XG4gICAgICAgIFR5cGUgPSBNb3VzZUlucHV0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIFR5cGUgPSBUb3VjaE1vdXNlSW5wdXQ7XG4gICAgfVxuICAgIHJldHVybiBuZXcgKFR5cGUpKG1hbmFnZXIsIGlucHV0SGFuZGxlcik7XG59XG5cbi8qKlxuICogaGFuZGxlIGlucHV0IGV2ZW50c1xuICogQHBhcmFtIHtNYW5hZ2VyfSBtYW5hZ2VyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRUeXBlXG4gKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAqL1xuZnVuY3Rpb24gaW5wdXRIYW5kbGVyKG1hbmFnZXIsIGV2ZW50VHlwZSwgaW5wdXQpIHtcbiAgICB2YXIgcG9pbnRlcnNMZW4gPSBpbnB1dC5wb2ludGVycy5sZW5ndGg7XG4gICAgdmFyIGNoYW5nZWRQb2ludGVyc0xlbiA9IGlucHV0LmNoYW5nZWRQb2ludGVycy5sZW5ndGg7XG4gICAgdmFyIGlzRmlyc3QgPSAoZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQgJiYgKHBvaW50ZXJzTGVuIC0gY2hhbmdlZFBvaW50ZXJzTGVuID09PSAwKSk7XG4gICAgdmFyIGlzRmluYWwgPSAoZXZlbnRUeXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkgJiYgKHBvaW50ZXJzTGVuIC0gY2hhbmdlZFBvaW50ZXJzTGVuID09PSAwKSk7XG5cbiAgICBpbnB1dC5pc0ZpcnN0ID0gISFpc0ZpcnN0O1xuICAgIGlucHV0LmlzRmluYWwgPSAhIWlzRmluYWw7XG5cbiAgICBpZiAoaXNGaXJzdCkge1xuICAgICAgICBtYW5hZ2VyLnNlc3Npb24gPSB7fTtcbiAgICB9XG5cbiAgICAvLyBzb3VyY2UgZXZlbnQgaXMgdGhlIG5vcm1hbGl6ZWQgdmFsdWUgb2YgdGhlIGRvbUV2ZW50c1xuICAgIC8vIGxpa2UgJ3RvdWNoc3RhcnQsIG1vdXNldXAsIHBvaW50ZXJkb3duJ1xuICAgIGlucHV0LmV2ZW50VHlwZSA9IGV2ZW50VHlwZTtcblxuICAgIC8vIGNvbXB1dGUgc2NhbGUsIHJvdGF0aW9uIGV0Y1xuICAgIGNvbXB1dGVJbnB1dERhdGEobWFuYWdlciwgaW5wdXQpO1xuXG4gICAgLy8gZW1pdCBzZWNyZXQgZXZlbnRcbiAgICBtYW5hZ2VyLmVtaXQoJ2hhbW1lci5pbnB1dCcsIGlucHV0KTtcblxuICAgIG1hbmFnZXIucmVjb2duaXplKGlucHV0KTtcbiAgICBtYW5hZ2VyLnNlc3Npb24ucHJldklucHV0ID0gaW5wdXQ7XG59XG5cbi8qKlxuICogZXh0ZW5kIHRoZSBkYXRhIHdpdGggc29tZSB1c2FibGUgcHJvcGVydGllcyBsaWtlIHNjYWxlLCByb3RhdGUsIHZlbG9jaXR5IGV0Y1xuICogQHBhcmFtIHtPYmplY3R9IG1hbmFnZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICovXG5mdW5jdGlvbiBjb21wdXRlSW5wdXREYXRhKG1hbmFnZXIsIGlucHV0KSB7XG4gICAgdmFyIHNlc3Npb24gPSBtYW5hZ2VyLnNlc3Npb247XG4gICAgdmFyIHBvaW50ZXJzID0gaW5wdXQucG9pbnRlcnM7XG4gICAgdmFyIHBvaW50ZXJzTGVuZ3RoID0gcG9pbnRlcnMubGVuZ3RoO1xuXG4gICAgLy8gc3RvcmUgdGhlIGZpcnN0IGlucHV0IHRvIGNhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgYW5kIGRpcmVjdGlvblxuICAgIGlmICghc2Vzc2lvbi5maXJzdElucHV0KSB7XG4gICAgICAgIHNlc3Npb24uZmlyc3RJbnB1dCA9IHNpbXBsZUNsb25lSW5wdXREYXRhKGlucHV0KTtcbiAgICB9XG5cbiAgICAvLyB0byBjb21wdXRlIHNjYWxlIGFuZCByb3RhdGlvbiB3ZSBuZWVkIHRvIHN0b3JlIHRoZSBtdWx0aXBsZSB0b3VjaGVzXG4gICAgaWYgKHBvaW50ZXJzTGVuZ3RoID4gMSAmJiAhc2Vzc2lvbi5maXJzdE11bHRpcGxlKSB7XG4gICAgICAgIHNlc3Npb24uZmlyc3RNdWx0aXBsZSA9IHNpbXBsZUNsb25lSW5wdXREYXRhKGlucHV0KTtcbiAgICB9IGVsc2UgaWYgKHBvaW50ZXJzTGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHNlc3Npb24uZmlyc3RNdWx0aXBsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBmaXJzdElucHV0ID0gc2Vzc2lvbi5maXJzdElucHV0O1xuICAgIHZhciBmaXJzdE11bHRpcGxlID0gc2Vzc2lvbi5maXJzdE11bHRpcGxlO1xuICAgIHZhciBvZmZzZXRDZW50ZXIgPSBmaXJzdE11bHRpcGxlID8gZmlyc3RNdWx0aXBsZS5jZW50ZXIgOiBmaXJzdElucHV0LmNlbnRlcjtcblxuICAgIHZhciBjZW50ZXIgPSBpbnB1dC5jZW50ZXIgPSBnZXRDZW50ZXIocG9pbnRlcnMpO1xuICAgIGlucHV0LnRpbWVTdGFtcCA9IG5vdygpO1xuICAgIGlucHV0LmRlbHRhVGltZSA9IGlucHV0LnRpbWVTdGFtcCAtIGZpcnN0SW5wdXQudGltZVN0YW1wO1xuXG4gICAgaW5wdXQuYW5nbGUgPSBnZXRBbmdsZShvZmZzZXRDZW50ZXIsIGNlbnRlcik7XG4gICAgaW5wdXQuZGlzdGFuY2UgPSBnZXREaXN0YW5jZShvZmZzZXRDZW50ZXIsIGNlbnRlcik7XG5cbiAgICBjb21wdXRlRGVsdGFYWShzZXNzaW9uLCBpbnB1dCk7XG4gICAgaW5wdXQub2Zmc2V0RGlyZWN0aW9uID0gZ2V0RGlyZWN0aW9uKGlucHV0LmRlbHRhWCwgaW5wdXQuZGVsdGFZKTtcblxuICAgIHZhciBvdmVyYWxsVmVsb2NpdHkgPSBnZXRWZWxvY2l0eShpbnB1dC5kZWx0YVRpbWUsIGlucHV0LmRlbHRhWCwgaW5wdXQuZGVsdGFZKTtcbiAgICBpbnB1dC5vdmVyYWxsVmVsb2NpdHlYID0gb3ZlcmFsbFZlbG9jaXR5Lng7XG4gICAgaW5wdXQub3ZlcmFsbFZlbG9jaXR5WSA9IG92ZXJhbGxWZWxvY2l0eS55O1xuICAgIGlucHV0Lm92ZXJhbGxWZWxvY2l0eSA9IChhYnMob3ZlcmFsbFZlbG9jaXR5LngpID4gYWJzKG92ZXJhbGxWZWxvY2l0eS55KSkgPyBvdmVyYWxsVmVsb2NpdHkueCA6IG92ZXJhbGxWZWxvY2l0eS55O1xuXG4gICAgaW5wdXQuc2NhbGUgPSBmaXJzdE11bHRpcGxlID8gZ2V0U2NhbGUoZmlyc3RNdWx0aXBsZS5wb2ludGVycywgcG9pbnRlcnMpIDogMTtcbiAgICBpbnB1dC5yb3RhdGlvbiA9IGZpcnN0TXVsdGlwbGUgPyBnZXRSb3RhdGlvbihmaXJzdE11bHRpcGxlLnBvaW50ZXJzLCBwb2ludGVycykgOiAwO1xuXG4gICAgaW5wdXQubWF4UG9pbnRlcnMgPSAhc2Vzc2lvbi5wcmV2SW5wdXQgPyBpbnB1dC5wb2ludGVycy5sZW5ndGggOiAoKGlucHV0LnBvaW50ZXJzLmxlbmd0aCA+XG4gICAgICAgIHNlc3Npb24ucHJldklucHV0Lm1heFBvaW50ZXJzKSA/IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA6IHNlc3Npb24ucHJldklucHV0Lm1heFBvaW50ZXJzKTtcblxuICAgIGNvbXB1dGVJbnRlcnZhbElucHV0RGF0YShzZXNzaW9uLCBpbnB1dCk7XG5cbiAgICAvLyBmaW5kIHRoZSBjb3JyZWN0IHRhcmdldFxuICAgIHZhciB0YXJnZXQgPSBtYW5hZ2VyLmVsZW1lbnQ7XG4gICAgaWYgKGhhc1BhcmVudChpbnB1dC5zcmNFdmVudC50YXJnZXQsIHRhcmdldCkpIHtcbiAgICAgICAgdGFyZ2V0ID0gaW5wdXQuc3JjRXZlbnQudGFyZ2V0O1xuICAgIH1cbiAgICBpbnB1dC50YXJnZXQgPSB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVEZWx0YVhZKHNlc3Npb24sIGlucHV0KSB7XG4gICAgdmFyIGNlbnRlciA9IGlucHV0LmNlbnRlcjtcbiAgICB2YXIgb2Zmc2V0ID0gc2Vzc2lvbi5vZmZzZXREZWx0YSB8fCB7fTtcbiAgICB2YXIgcHJldkRlbHRhID0gc2Vzc2lvbi5wcmV2RGVsdGEgfHwge307XG4gICAgdmFyIHByZXZJbnB1dCA9IHNlc3Npb24ucHJldklucHV0IHx8IHt9O1xuXG4gICAgaWYgKGlucHV0LmV2ZW50VHlwZSA9PT0gSU5QVVRfU1RBUlQgfHwgcHJldklucHV0LmV2ZW50VHlwZSA9PT0gSU5QVVRfRU5EKSB7XG4gICAgICAgIHByZXZEZWx0YSA9IHNlc3Npb24ucHJldkRlbHRhID0ge1xuICAgICAgICAgICAgeDogcHJldklucHV0LmRlbHRhWCB8fCAwLFxuICAgICAgICAgICAgeTogcHJldklucHV0LmRlbHRhWSB8fCAwXG4gICAgICAgIH07XG5cbiAgICAgICAgb2Zmc2V0ID0gc2Vzc2lvbi5vZmZzZXREZWx0YSA9IHtcbiAgICAgICAgICAgIHg6IGNlbnRlci54LFxuICAgICAgICAgICAgeTogY2VudGVyLnlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBpbnB1dC5kZWx0YVggPSBwcmV2RGVsdGEueCArIChjZW50ZXIueCAtIG9mZnNldC54KTtcbiAgICBpbnB1dC5kZWx0YVkgPSBwcmV2RGVsdGEueSArIChjZW50ZXIueSAtIG9mZnNldC55KTtcbn1cblxuLyoqXG4gKiB2ZWxvY2l0eSBpcyBjYWxjdWxhdGVkIGV2ZXJ5IHggbXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXNzaW9uXG4gKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAqL1xuZnVuY3Rpb24gY29tcHV0ZUludGVydmFsSW5wdXREYXRhKHNlc3Npb24sIGlucHV0KSB7XG4gICAgdmFyIGxhc3QgPSBzZXNzaW9uLmxhc3RJbnRlcnZhbCB8fCBpbnB1dCxcbiAgICAgICAgZGVsdGFUaW1lID0gaW5wdXQudGltZVN0YW1wIC0gbGFzdC50aW1lU3RhbXAsXG4gICAgICAgIHZlbG9jaXR5LCB2ZWxvY2l0eVgsIHZlbG9jaXR5WSwgZGlyZWN0aW9uO1xuXG4gICAgaWYgKGlucHV0LmV2ZW50VHlwZSAhPSBJTlBVVF9DQU5DRUwgJiYgKGRlbHRhVGltZSA+IENPTVBVVEVfSU5URVJWQUwgfHwgbGFzdC52ZWxvY2l0eSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICB2YXIgZGVsdGFYID0gaW5wdXQuZGVsdGFYIC0gbGFzdC5kZWx0YVg7XG4gICAgICAgIHZhciBkZWx0YVkgPSBpbnB1dC5kZWx0YVkgLSBsYXN0LmRlbHRhWTtcblxuICAgICAgICB2YXIgdiA9IGdldFZlbG9jaXR5KGRlbHRhVGltZSwgZGVsdGFYLCBkZWx0YVkpO1xuICAgICAgICB2ZWxvY2l0eVggPSB2Lng7XG4gICAgICAgIHZlbG9jaXR5WSA9IHYueTtcbiAgICAgICAgdmVsb2NpdHkgPSAoYWJzKHYueCkgPiBhYnModi55KSkgPyB2LnggOiB2Lnk7XG4gICAgICAgIGRpcmVjdGlvbiA9IGdldERpcmVjdGlvbihkZWx0YVgsIGRlbHRhWSk7XG5cbiAgICAgICAgc2Vzc2lvbi5sYXN0SW50ZXJ2YWwgPSBpbnB1dDtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyB1c2UgbGF0ZXN0IHZlbG9jaXR5IGluZm8gaWYgaXQgZG9lc24ndCBvdmVydGFrZSBhIG1pbmltdW0gcGVyaW9kXG4gICAgICAgIHZlbG9jaXR5ID0gbGFzdC52ZWxvY2l0eTtcbiAgICAgICAgdmVsb2NpdHlYID0gbGFzdC52ZWxvY2l0eVg7XG4gICAgICAgIHZlbG9jaXR5WSA9IGxhc3QudmVsb2NpdHlZO1xuICAgICAgICBkaXJlY3Rpb24gPSBsYXN0LmRpcmVjdGlvbjtcbiAgICB9XG5cbiAgICBpbnB1dC52ZWxvY2l0eSA9IHZlbG9jaXR5O1xuICAgIGlucHV0LnZlbG9jaXR5WCA9IHZlbG9jaXR5WDtcbiAgICBpbnB1dC52ZWxvY2l0eVkgPSB2ZWxvY2l0eVk7XG4gICAgaW5wdXQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xufVxuXG4vKipcbiAqIGNyZWF0ZSBhIHNpbXBsZSBjbG9uZSBmcm9tIHRoZSBpbnB1dCB1c2VkIGZvciBzdG9yYWdlIG9mIGZpcnN0SW5wdXQgYW5kIGZpcnN0TXVsdGlwbGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICogQHJldHVybnMge09iamVjdH0gY2xvbmVkSW5wdXREYXRhXG4gKi9cbmZ1bmN0aW9uIHNpbXBsZUNsb25lSW5wdXREYXRhKGlucHV0KSB7XG4gICAgLy8gbWFrZSBhIHNpbXBsZSBjb3B5IG9mIHRoZSBwb2ludGVycyBiZWNhdXNlIHdlIHdpbGwgZ2V0IGEgcmVmZXJlbmNlIGlmIHdlIGRvbid0XG4gICAgLy8gd2Ugb25seSBuZWVkIGNsaWVudFhZIGZvciB0aGUgY2FsY3VsYXRpb25zXG4gICAgdmFyIHBvaW50ZXJzID0gW107XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgaW5wdXQucG9pbnRlcnMubGVuZ3RoKSB7XG4gICAgICAgIHBvaW50ZXJzW2ldID0ge1xuICAgICAgICAgICAgY2xpZW50WDogcm91bmQoaW5wdXQucG9pbnRlcnNbaV0uY2xpZW50WCksXG4gICAgICAgICAgICBjbGllbnRZOiByb3VuZChpbnB1dC5wb2ludGVyc1tpXS5jbGllbnRZKVxuICAgICAgICB9O1xuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGltZVN0YW1wOiBub3coKSxcbiAgICAgICAgcG9pbnRlcnM6IHBvaW50ZXJzLFxuICAgICAgICBjZW50ZXI6IGdldENlbnRlcihwb2ludGVycyksXG4gICAgICAgIGRlbHRhWDogaW5wdXQuZGVsdGFYLFxuICAgICAgICBkZWx0YVk6IGlucHV0LmRlbHRhWVxuICAgIH07XG59XG5cbi8qKlxuICogZ2V0IHRoZSBjZW50ZXIgb2YgYWxsIHRoZSBwb2ludGVyc1xuICogQHBhcmFtIHtBcnJheX0gcG9pbnRlcnNcbiAqIEByZXR1cm4ge09iamVjdH0gY2VudGVyIGNvbnRhaW5zIGB4YCBhbmQgYHlgIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gZ2V0Q2VudGVyKHBvaW50ZXJzKSB7XG4gICAgdmFyIHBvaW50ZXJzTGVuZ3RoID0gcG9pbnRlcnMubGVuZ3RoO1xuXG4gICAgLy8gbm8gbmVlZCB0byBsb29wIHdoZW4gb25seSBvbmUgdG91Y2hcbiAgICBpZiAocG9pbnRlcnNMZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHJvdW5kKHBvaW50ZXJzWzBdLmNsaWVudFgpLFxuICAgICAgICAgICAgeTogcm91bmQocG9pbnRlcnNbMF0uY2xpZW50WSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgeCA9IDAsIHkgPSAwLCBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHBvaW50ZXJzTGVuZ3RoKSB7XG4gICAgICAgIHggKz0gcG9pbnRlcnNbaV0uY2xpZW50WDtcbiAgICAgICAgeSArPSBwb2ludGVyc1tpXS5jbGllbnRZO1xuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgeDogcm91bmQoeCAvIHBvaW50ZXJzTGVuZ3RoKSxcbiAgICAgICAgeTogcm91bmQoeSAvIHBvaW50ZXJzTGVuZ3RoKVxuICAgIH07XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIHRoZSB2ZWxvY2l0eSBiZXR3ZWVuIHR3byBwb2ludHMuIHVuaXQgaXMgaW4gcHggcGVyIG1zLlxuICogQHBhcmFtIHtOdW1iZXJ9IGRlbHRhVGltZVxuICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gKiBAcmV0dXJuIHtPYmplY3R9IHZlbG9jaXR5IGB4YCBhbmQgYHlgXG4gKi9cbmZ1bmN0aW9uIGdldFZlbG9jaXR5KGRlbHRhVGltZSwgeCwgeSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHg6IHggLyBkZWx0YVRpbWUgfHwgMCxcbiAgICAgICAgeTogeSAvIGRlbHRhVGltZSB8fCAwXG4gICAgfTtcbn1cblxuLyoqXG4gKiBnZXQgdGhlIGRpcmVjdGlvbiBiZXR3ZWVuIHR3byBwb2ludHNcbiAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gKiBAcGFyYW0ge051bWJlcn0geVxuICogQHJldHVybiB7TnVtYmVyfSBkaXJlY3Rpb25cbiAqL1xuZnVuY3Rpb24gZ2V0RGlyZWN0aW9uKHgsIHkpIHtcbiAgICBpZiAoeCA9PT0geSkge1xuICAgICAgICByZXR1cm4gRElSRUNUSU9OX05PTkU7XG4gICAgfVxuXG4gICAgaWYgKGFicyh4KSA+PSBhYnMoeSkpIHtcbiAgICAgICAgcmV0dXJuIHggPCAwID8gRElSRUNUSU9OX0xFRlQgOiBESVJFQ1RJT05fUklHSFQ7XG4gICAgfVxuICAgIHJldHVybiB5IDwgMCA/IERJUkVDVElPTl9VUCA6IERJUkVDVElPTl9ET1dOO1xufVxuXG4vKipcbiAqIGNhbGN1bGF0ZSB0aGUgYWJzb2x1dGUgZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzXG4gKiBAcGFyYW0ge09iamVjdH0gcDEge3gsIHl9XG4gKiBAcGFyYW0ge09iamVjdH0gcDIge3gsIHl9XG4gKiBAcGFyYW0ge0FycmF5fSBbcHJvcHNdIGNvbnRhaW5pbmcgeCBhbmQgeSBrZXlzXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IGRpc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIGdldERpc3RhbmNlKHAxLCBwMiwgcHJvcHMpIHtcbiAgICBpZiAoIXByb3BzKSB7XG4gICAgICAgIHByb3BzID0gUFJPUFNfWFk7XG4gICAgfVxuICAgIHZhciB4ID0gcDJbcHJvcHNbMF1dIC0gcDFbcHJvcHNbMF1dLFxuICAgICAgICB5ID0gcDJbcHJvcHNbMV1dIC0gcDFbcHJvcHNbMV1dO1xuXG4gICAgcmV0dXJuIE1hdGguc3FydCgoeCAqIHgpICsgKHkgKiB5KSk7XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIHRoZSBhbmdsZSBiZXR3ZWVuIHR3byBjb29yZGluYXRlc1xuICogQHBhcmFtIHtPYmplY3R9IHAxXG4gKiBAcGFyYW0ge09iamVjdH0gcDJcbiAqIEBwYXJhbSB7QXJyYXl9IFtwcm9wc10gY29udGFpbmluZyB4IGFuZCB5IGtleXNcbiAqIEByZXR1cm4ge051bWJlcn0gYW5nbGVcbiAqL1xuZnVuY3Rpb24gZ2V0QW5nbGUocDEsIHAyLCBwcm9wcykge1xuICAgIGlmICghcHJvcHMpIHtcbiAgICAgICAgcHJvcHMgPSBQUk9QU19YWTtcbiAgICB9XG4gICAgdmFyIHggPSBwMltwcm9wc1swXV0gLSBwMVtwcm9wc1swXV0sXG4gICAgICAgIHkgPSBwMltwcm9wc1sxXV0gLSBwMVtwcm9wc1sxXV07XG4gICAgcmV0dXJuIE1hdGguYXRhbjIoeSwgeCkgKiAxODAgLyBNYXRoLlBJO1xufVxuXG4vKipcbiAqIGNhbGN1bGF0ZSB0aGUgcm90YXRpb24gZGVncmVlcyBiZXR3ZWVuIHR3byBwb2ludGVyc2V0c1xuICogQHBhcmFtIHtBcnJheX0gc3RhcnQgYXJyYXkgb2YgcG9pbnRlcnNcbiAqIEBwYXJhbSB7QXJyYXl9IGVuZCBhcnJheSBvZiBwb2ludGVyc1xuICogQHJldHVybiB7TnVtYmVyfSByb3RhdGlvblxuICovXG5mdW5jdGlvbiBnZXRSb3RhdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGdldEFuZ2xlKGVuZFsxXSwgZW5kWzBdLCBQUk9QU19DTElFTlRfWFkpICsgZ2V0QW5nbGUoc3RhcnRbMV0sIHN0YXJ0WzBdLCBQUk9QU19DTElFTlRfWFkpO1xufVxuXG4vKipcbiAqIGNhbGN1bGF0ZSB0aGUgc2NhbGUgZmFjdG9yIGJldHdlZW4gdHdvIHBvaW50ZXJzZXRzXG4gKiBubyBzY2FsZSBpcyAxLCBhbmQgZ29lcyBkb3duIHRvIDAgd2hlbiBwaW5jaGVkIHRvZ2V0aGVyLCBhbmQgYmlnZ2VyIHdoZW4gcGluY2hlZCBvdXRcbiAqIEBwYXJhbSB7QXJyYXl9IHN0YXJ0IGFycmF5IG9mIHBvaW50ZXJzXG4gKiBAcGFyYW0ge0FycmF5fSBlbmQgYXJyYXkgb2YgcG9pbnRlcnNcbiAqIEByZXR1cm4ge051bWJlcn0gc2NhbGVcbiAqL1xuZnVuY3Rpb24gZ2V0U2NhbGUoc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBnZXREaXN0YW5jZShlbmRbMF0sIGVuZFsxXSwgUFJPUFNfQ0xJRU5UX1hZKSAvIGdldERpc3RhbmNlKHN0YXJ0WzBdLCBzdGFydFsxXSwgUFJPUFNfQ0xJRU5UX1hZKTtcbn1cblxudmFyIE1PVVNFX0lOUFVUX01BUCA9IHtcbiAgICBtb3VzZWRvd246IElOUFVUX1NUQVJULFxuICAgIG1vdXNlbW92ZTogSU5QVVRfTU9WRSxcbiAgICBtb3VzZXVwOiBJTlBVVF9FTkRcbn07XG5cbnZhciBNT1VTRV9FTEVNRU5UX0VWRU5UUyA9ICdtb3VzZWRvd24nO1xudmFyIE1PVVNFX1dJTkRPV19FVkVOVFMgPSAnbW91c2Vtb3ZlIG1vdXNldXAnO1xuXG4vKipcbiAqIE1vdXNlIGV2ZW50cyBpbnB1dFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5mdW5jdGlvbiBNb3VzZUlucHV0KCkge1xuICAgIHRoaXMuZXZFbCA9IE1PVVNFX0VMRU1FTlRfRVZFTlRTO1xuICAgIHRoaXMuZXZXaW4gPSBNT1VTRV9XSU5ET1dfRVZFTlRTO1xuXG4gICAgdGhpcy5wcmVzc2VkID0gZmFsc2U7IC8vIG1vdXNlZG93biBzdGF0ZVxuXG4gICAgSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuaW5oZXJpdChNb3VzZUlucHV0LCBJbnB1dCwge1xuICAgIC8qKlxuICAgICAqIGhhbmRsZSBtb3VzZSBldmVudHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZcbiAgICAgKi9cbiAgICBoYW5kbGVyOiBmdW5jdGlvbiBNRWhhbmRsZXIoZXYpIHtcbiAgICAgICAgdmFyIGV2ZW50VHlwZSA9IE1PVVNFX0lOUFVUX01BUFtldi50eXBlXTtcblxuICAgICAgICAvLyBvbiBzdGFydCB3ZSB3YW50IHRvIGhhdmUgdGhlIGxlZnQgbW91c2UgYnV0dG9uIGRvd25cbiAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX1NUQVJUICYmIGV2LmJ1dHRvbiA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5wcmVzc2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9NT1ZFICYmIGV2LndoaWNoICE9PSAxKSB7XG4gICAgICAgICAgICBldmVudFR5cGUgPSBJTlBVVF9FTkQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtb3VzZSBtdXN0IGJlIGRvd25cbiAgICAgICAgaWYgKCF0aGlzLnByZXNzZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9FTkQpIHtcbiAgICAgICAgICAgIHRoaXMucHJlc3NlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsIGV2ZW50VHlwZSwge1xuICAgICAgICAgICAgcG9pbnRlcnM6IFtldl0sXG4gICAgICAgICAgICBjaGFuZ2VkUG9pbnRlcnM6IFtldl0sXG4gICAgICAgICAgICBwb2ludGVyVHlwZTogSU5QVVRfVFlQRV9NT1VTRSxcbiAgICAgICAgICAgIHNyY0V2ZW50OiBldlxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxudmFyIFBPSU5URVJfSU5QVVRfTUFQID0ge1xuICAgIHBvaW50ZXJkb3duOiBJTlBVVF9TVEFSVCxcbiAgICBwb2ludGVybW92ZTogSU5QVVRfTU9WRSxcbiAgICBwb2ludGVydXA6IElOUFVUX0VORCxcbiAgICBwb2ludGVyY2FuY2VsOiBJTlBVVF9DQU5DRUwsXG4gICAgcG9pbnRlcm91dDogSU5QVVRfQ0FOQ0VMXG59O1xuXG4vLyBpbiBJRTEwIHRoZSBwb2ludGVyIHR5cGVzIGlzIGRlZmluZWQgYXMgYW4gZW51bVxudmFyIElFMTBfUE9JTlRFUl9UWVBFX0VOVU0gPSB7XG4gICAgMjogSU5QVVRfVFlQRV9UT1VDSCxcbiAgICAzOiBJTlBVVF9UWVBFX1BFTixcbiAgICA0OiBJTlBVVF9UWVBFX01PVVNFLFxuICAgIDU6IElOUFVUX1RZUEVfS0lORUNUIC8vIHNlZSBodHRwczovL3R3aXR0ZXIuY29tL2phY29icm9zc2kvc3RhdHVzLzQ4MDU5NjQzODQ4OTg5MDgxNlxufTtcblxudmFyIFBPSU5URVJfRUxFTUVOVF9FVkVOVFMgPSAncG9pbnRlcmRvd24nO1xudmFyIFBPSU5URVJfV0lORE9XX0VWRU5UUyA9ICdwb2ludGVybW92ZSBwb2ludGVydXAgcG9pbnRlcmNhbmNlbCc7XG5cbi8vIElFMTAgaGFzIHByZWZpeGVkIHN1cHBvcnQsIGFuZCBjYXNlLXNlbnNpdGl2ZVxuaWYgKHdpbmRvdy5NU1BvaW50ZXJFdmVudCAmJiAhd2luZG93LlBvaW50ZXJFdmVudCkge1xuICAgIFBPSU5URVJfRUxFTUVOVF9FVkVOVFMgPSAnTVNQb2ludGVyRG93bic7XG4gICAgUE9JTlRFUl9XSU5ET1dfRVZFTlRTID0gJ01TUG9pbnRlck1vdmUgTVNQb2ludGVyVXAgTVNQb2ludGVyQ2FuY2VsJztcbn1cblxuLyoqXG4gKiBQb2ludGVyIGV2ZW50cyBpbnB1dFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5mdW5jdGlvbiBQb2ludGVyRXZlbnRJbnB1dCgpIHtcbiAgICB0aGlzLmV2RWwgPSBQT0lOVEVSX0VMRU1FTlRfRVZFTlRTO1xuICAgIHRoaXMuZXZXaW4gPSBQT0lOVEVSX1dJTkRPV19FVkVOVFM7XG5cbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdGhpcy5zdG9yZSA9ICh0aGlzLm1hbmFnZXIuc2Vzc2lvbi5wb2ludGVyRXZlbnRzID0gW10pO1xufVxuXG5pbmhlcml0KFBvaW50ZXJFdmVudElucHV0LCBJbnB1dCwge1xuICAgIC8qKlxuICAgICAqIGhhbmRsZSBtb3VzZSBldmVudHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZcbiAgICAgKi9cbiAgICBoYW5kbGVyOiBmdW5jdGlvbiBQRWhhbmRsZXIoZXYpIHtcbiAgICAgICAgdmFyIHN0b3JlID0gdGhpcy5zdG9yZTtcbiAgICAgICAgdmFyIHJlbW92ZVBvaW50ZXIgPSBmYWxzZTtcblxuICAgICAgICB2YXIgZXZlbnRUeXBlTm9ybWFsaXplZCA9IGV2LnR5cGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCdtcycsICcnKTtcbiAgICAgICAgdmFyIGV2ZW50VHlwZSA9IFBPSU5URVJfSU5QVVRfTUFQW2V2ZW50VHlwZU5vcm1hbGl6ZWRdO1xuICAgICAgICB2YXIgcG9pbnRlclR5cGUgPSBJRTEwX1BPSU5URVJfVFlQRV9FTlVNW2V2LnBvaW50ZXJUeXBlXSB8fCBldi5wb2ludGVyVHlwZTtcblxuICAgICAgICB2YXIgaXNUb3VjaCA9IChwb2ludGVyVHlwZSA9PSBJTlBVVF9UWVBFX1RPVUNIKTtcblxuICAgICAgICAvLyBnZXQgaW5kZXggb2YgdGhlIGV2ZW50IGluIHRoZSBzdG9yZVxuICAgICAgICB2YXIgc3RvcmVJbmRleCA9IGluQXJyYXkoc3RvcmUsIGV2LnBvaW50ZXJJZCwgJ3BvaW50ZXJJZCcpO1xuXG4gICAgICAgIC8vIHN0YXJ0IGFuZCBtb3VzZSBtdXN0IGJlIGRvd25cbiAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX1NUQVJUICYmIChldi5idXR0b24gPT09IDAgfHwgaXNUb3VjaCkpIHtcbiAgICAgICAgICAgIGlmIChzdG9yZUluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIHN0b3JlLnB1c2goZXYpO1xuICAgICAgICAgICAgICAgIHN0b3JlSW5kZXggPSBzdG9yZS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50VHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpKSB7XG4gICAgICAgICAgICByZW1vdmVQb2ludGVyID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGl0IG5vdCBmb3VuZCwgc28gdGhlIHBvaW50ZXIgaGFzbid0IGJlZW4gZG93biAoc28gaXQncyBwcm9iYWJseSBhIGhvdmVyKVxuICAgICAgICBpZiAoc3RvcmVJbmRleCA8IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgZXZlbnQgaW4gdGhlIHN0b3JlXG4gICAgICAgIHN0b3JlW3N0b3JlSW5kZXhdID0gZXY7XG5cbiAgICAgICAgdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsIGV2ZW50VHlwZSwge1xuICAgICAgICAgICAgcG9pbnRlcnM6IHN0b3JlLFxuICAgICAgICAgICAgY2hhbmdlZFBvaW50ZXJzOiBbZXZdLFxuICAgICAgICAgICAgcG9pbnRlclR5cGU6IHBvaW50ZXJUeXBlLFxuICAgICAgICAgICAgc3JjRXZlbnQ6IGV2XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyZW1vdmVQb2ludGVyKSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgZnJvbSB0aGUgc3RvcmVcbiAgICAgICAgICAgIHN0b3JlLnNwbGljZShzdG9yZUluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG52YXIgU0lOR0xFX1RPVUNIX0lOUFVUX01BUCA9IHtcbiAgICB0b3VjaHN0YXJ0OiBJTlBVVF9TVEFSVCxcbiAgICB0b3VjaG1vdmU6IElOUFVUX01PVkUsXG4gICAgdG91Y2hlbmQ6IElOUFVUX0VORCxcbiAgICB0b3VjaGNhbmNlbDogSU5QVVRfQ0FOQ0VMXG59O1xuXG52YXIgU0lOR0xFX1RPVUNIX1RBUkdFVF9FVkVOVFMgPSAndG91Y2hzdGFydCc7XG52YXIgU0lOR0xFX1RPVUNIX1dJTkRPV19FVkVOVFMgPSAndG91Y2hzdGFydCB0b3VjaG1vdmUgdG91Y2hlbmQgdG91Y2hjYW5jZWwnO1xuXG4vKipcbiAqIFRvdWNoIGV2ZW50cyBpbnB1dFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5mdW5jdGlvbiBTaW5nbGVUb3VjaElucHV0KCkge1xuICAgIHRoaXMuZXZUYXJnZXQgPSBTSU5HTEVfVE9VQ0hfVEFSR0VUX0VWRU5UUztcbiAgICB0aGlzLmV2V2luID0gU0lOR0xFX1RPVUNIX1dJTkRPV19FVkVOVFM7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG5cbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFNpbmdsZVRvdWNoSW5wdXQsIElucHV0LCB7XG4gICAgaGFuZGxlcjogZnVuY3Rpb24gVEVoYW5kbGVyKGV2KSB7XG4gICAgICAgIHZhciB0eXBlID0gU0lOR0xFX1RPVUNIX0lOUFVUX01BUFtldi50eXBlXTtcblxuICAgICAgICAvLyBzaG91bGQgd2UgaGFuZGxlIHRoZSB0b3VjaCBldmVudHM/XG4gICAgICAgIGlmICh0eXBlID09PSBJTlBVVF9TVEFSVCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5zdGFydGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdG91Y2hlcyA9IG5vcm1hbGl6ZVNpbmdsZVRvdWNoZXMuY2FsbCh0aGlzLCBldiwgdHlwZSk7XG5cbiAgICAgICAgLy8gd2hlbiBkb25lLCByZXNldCB0aGUgc3RhcnRlZCBzdGF0ZVxuICAgICAgICBpZiAodHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpICYmIHRvdWNoZXNbMF0ubGVuZ3RoIC0gdG91Y2hlc1sxXS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsIHR5cGUsIHtcbiAgICAgICAgICAgIHBvaW50ZXJzOiB0b3VjaGVzWzBdLFxuICAgICAgICAgICAgY2hhbmdlZFBvaW50ZXJzOiB0b3VjaGVzWzFdLFxuICAgICAgICAgICAgcG9pbnRlclR5cGU6IElOUFVUX1RZUEVfVE9VQ0gsXG4gICAgICAgICAgICBzcmNFdmVudDogZXZcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogQHRoaXMge1RvdWNoSW5wdXR9XG4gKiBAcGFyYW0ge09iamVjdH0gZXZcbiAqIEBwYXJhbSB7TnVtYmVyfSB0eXBlIGZsYWdcbiAqIEByZXR1cm5zIHt1bmRlZmluZWR8QXJyYXl9IFthbGwsIGNoYW5nZWRdXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZVNpbmdsZVRvdWNoZXMoZXYsIHR5cGUpIHtcbiAgICB2YXIgYWxsID0gdG9BcnJheShldi50b3VjaGVzKTtcbiAgICB2YXIgY2hhbmdlZCA9IHRvQXJyYXkoZXYuY2hhbmdlZFRvdWNoZXMpO1xuXG4gICAgaWYgKHR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSkge1xuICAgICAgICBhbGwgPSB1bmlxdWVBcnJheShhbGwuY29uY2F0KGNoYW5nZWQpLCAnaWRlbnRpZmllcicsIHRydWUpO1xuICAgIH1cblxuICAgIHJldHVybiBbYWxsLCBjaGFuZ2VkXTtcbn1cblxudmFyIFRPVUNIX0lOUFVUX01BUCA9IHtcbiAgICB0b3VjaHN0YXJ0OiBJTlBVVF9TVEFSVCxcbiAgICB0b3VjaG1vdmU6IElOUFVUX01PVkUsXG4gICAgdG91Y2hlbmQ6IElOUFVUX0VORCxcbiAgICB0b3VjaGNhbmNlbDogSU5QVVRfQ0FOQ0VMXG59O1xuXG52YXIgVE9VQ0hfVEFSR0VUX0VWRU5UUyA9ICd0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbCc7XG5cbi8qKlxuICogTXVsdGktdXNlciB0b3VjaCBldmVudHMgaW5wdXRcbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgSW5wdXRcbiAqL1xuZnVuY3Rpb24gVG91Y2hJbnB1dCgpIHtcbiAgICB0aGlzLmV2VGFyZ2V0ID0gVE9VQ0hfVEFSR0VUX0VWRU5UUztcbiAgICB0aGlzLnRhcmdldElkcyA9IHt9O1xuXG4gICAgSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuaW5oZXJpdChUb3VjaElucHV0LCBJbnB1dCwge1xuICAgIGhhbmRsZXI6IGZ1bmN0aW9uIE1URWhhbmRsZXIoZXYpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBUT1VDSF9JTlBVVF9NQVBbZXYudHlwZV07XG4gICAgICAgIHZhciB0b3VjaGVzID0gZ2V0VG91Y2hlcy5jYWxsKHRoaXMsIGV2LCB0eXBlKTtcbiAgICAgICAgaWYgKCF0b3VjaGVzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgdHlwZSwge1xuICAgICAgICAgICAgcG9pbnRlcnM6IHRvdWNoZXNbMF0sXG4gICAgICAgICAgICBjaGFuZ2VkUG9pbnRlcnM6IHRvdWNoZXNbMV0sXG4gICAgICAgICAgICBwb2ludGVyVHlwZTogSU5QVVRfVFlQRV9UT1VDSCxcbiAgICAgICAgICAgIHNyY0V2ZW50OiBldlxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBAdGhpcyB7VG91Y2hJbnB1dH1cbiAqIEBwYXJhbSB7T2JqZWN0fSBldlxuICogQHBhcmFtIHtOdW1iZXJ9IHR5cGUgZmxhZ1xuICogQHJldHVybnMge3VuZGVmaW5lZHxBcnJheX0gW2FsbCwgY2hhbmdlZF1cbiAqL1xuZnVuY3Rpb24gZ2V0VG91Y2hlcyhldiwgdHlwZSkge1xuICAgIHZhciBhbGxUb3VjaGVzID0gdG9BcnJheShldi50b3VjaGVzKTtcbiAgICB2YXIgdGFyZ2V0SWRzID0gdGhpcy50YXJnZXRJZHM7XG5cbiAgICAvLyB3aGVuIHRoZXJlIGlzIG9ubHkgb25lIHRvdWNoLCB0aGUgcHJvY2VzcyBjYW4gYmUgc2ltcGxpZmllZFxuICAgIGlmICh0eXBlICYgKElOUFVUX1NUQVJUIHwgSU5QVVRfTU9WRSkgJiYgYWxsVG91Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGFyZ2V0SWRzW2FsbFRvdWNoZXNbMF0uaWRlbnRpZmllcl0gPSB0cnVlO1xuICAgICAgICByZXR1cm4gW2FsbFRvdWNoZXMsIGFsbFRvdWNoZXNdO1xuICAgIH1cblxuICAgIHZhciBpLFxuICAgICAgICB0YXJnZXRUb3VjaGVzLFxuICAgICAgICBjaGFuZ2VkVG91Y2hlcyA9IHRvQXJyYXkoZXYuY2hhbmdlZFRvdWNoZXMpLFxuICAgICAgICBjaGFuZ2VkVGFyZ2V0VG91Y2hlcyA9IFtdLFxuICAgICAgICB0YXJnZXQgPSB0aGlzLnRhcmdldDtcblxuICAgIC8vIGdldCB0YXJnZXQgdG91Y2hlcyBmcm9tIHRvdWNoZXNcbiAgICB0YXJnZXRUb3VjaGVzID0gYWxsVG91Y2hlcy5maWx0ZXIoZnVuY3Rpb24odG91Y2gpIHtcbiAgICAgICAgcmV0dXJuIGhhc1BhcmVudCh0b3VjaC50YXJnZXQsIHRhcmdldCk7XG4gICAgfSk7XG5cbiAgICAvLyBjb2xsZWN0IHRvdWNoZXNcbiAgICBpZiAodHlwZSA9PT0gSU5QVVRfU1RBUlQpIHtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgdGFyZ2V0VG91Y2hlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRhcmdldElkc1t0YXJnZXRUb3VjaGVzW2ldLmlkZW50aWZpZXJdID0gdHJ1ZTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZpbHRlciBjaGFuZ2VkIHRvdWNoZXMgdG8gb25seSBjb250YWluIHRvdWNoZXMgdGhhdCBleGlzdCBpbiB0aGUgY29sbGVjdGVkIHRhcmdldCBpZHNcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IGNoYW5nZWRUb3VjaGVzLmxlbmd0aCkge1xuICAgICAgICBpZiAodGFyZ2V0SWRzW2NoYW5nZWRUb3VjaGVzW2ldLmlkZW50aWZpZXJdKSB7XG4gICAgICAgICAgICBjaGFuZ2VkVGFyZ2V0VG91Y2hlcy5wdXNoKGNoYW5nZWRUb3VjaGVzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNsZWFudXAgcmVtb3ZlZCB0b3VjaGVzXG4gICAgICAgIGlmICh0eXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0YXJnZXRJZHNbY2hhbmdlZFRvdWNoZXNbaV0uaWRlbnRpZmllcl07XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgIH1cblxuICAgIGlmICghY2hhbmdlZFRhcmdldFRvdWNoZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gW1xuICAgICAgICAvLyBtZXJnZSB0YXJnZXRUb3VjaGVzIHdpdGggY2hhbmdlZFRhcmdldFRvdWNoZXMgc28gaXQgY29udGFpbnMgQUxMIHRvdWNoZXMsIGluY2x1ZGluZyAnZW5kJyBhbmQgJ2NhbmNlbCdcbiAgICAgICAgdW5pcXVlQXJyYXkodGFyZ2V0VG91Y2hlcy5jb25jYXQoY2hhbmdlZFRhcmdldFRvdWNoZXMpLCAnaWRlbnRpZmllcicsIHRydWUpLFxuICAgICAgICBjaGFuZ2VkVGFyZ2V0VG91Y2hlc1xuICAgIF07XG59XG5cbi8qKlxuICogQ29tYmluZWQgdG91Y2ggYW5kIG1vdXNlIGlucHV0XG4gKlxuICogVG91Y2ggaGFzIGEgaGlnaGVyIHByaW9yaXR5IHRoZW4gbW91c2UsIGFuZCB3aGlsZSB0b3VjaGluZyBubyBtb3VzZSBldmVudHMgYXJlIGFsbG93ZWQuXG4gKiBUaGlzIGJlY2F1c2UgdG91Y2ggZGV2aWNlcyBhbHNvIGVtaXQgbW91c2UgZXZlbnRzIHdoaWxlIGRvaW5nIGEgdG91Y2guXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5cbnZhciBERURVUF9USU1FT1VUID0gMjUwMDtcbnZhciBERURVUF9ESVNUQU5DRSA9IDI1O1xuXG5mdW5jdGlvbiBUb3VjaE1vdXNlSW5wdXQoKSB7XG4gICAgSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHZhciBoYW5kbGVyID0gYmluZEZuKHRoaXMuaGFuZGxlciwgdGhpcyk7XG4gICAgdGhpcy50b3VjaCA9IG5ldyBUb3VjaElucHV0KHRoaXMubWFuYWdlciwgaGFuZGxlcik7XG4gICAgdGhpcy5tb3VzZSA9IG5ldyBNb3VzZUlucHV0KHRoaXMubWFuYWdlciwgaGFuZGxlcik7XG5cbiAgICB0aGlzLnByaW1hcnlUb3VjaCA9IG51bGw7XG4gICAgdGhpcy5sYXN0VG91Y2hlcyA9IFtdO1xufVxuXG5pbmhlcml0KFRvdWNoTW91c2VJbnB1dCwgSW5wdXQsIHtcbiAgICAvKipcbiAgICAgKiBoYW5kbGUgbW91c2UgYW5kIHRvdWNoIGV2ZW50c1xuICAgICAqIEBwYXJhbSB7SGFtbWVyfSBtYW5hZ2VyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGlucHV0RXZlbnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW5wdXREYXRhXG4gICAgICovXG4gICAgaGFuZGxlcjogZnVuY3Rpb24gVE1FaGFuZGxlcihtYW5hZ2VyLCBpbnB1dEV2ZW50LCBpbnB1dERhdGEpIHtcbiAgICAgICAgdmFyIGlzVG91Y2ggPSAoaW5wdXREYXRhLnBvaW50ZXJUeXBlID09IElOUFVUX1RZUEVfVE9VQ0gpLFxuICAgICAgICAgICAgaXNNb3VzZSA9IChpbnB1dERhdGEucG9pbnRlclR5cGUgPT0gSU5QVVRfVFlQRV9NT1VTRSk7XG5cbiAgICAgICAgaWYgKGlzTW91c2UgJiYgaW5wdXREYXRhLnNvdXJjZUNhcGFiaWxpdGllcyAmJiBpbnB1dERhdGEuc291cmNlQ2FwYWJpbGl0aWVzLmZpcmVzVG91Y2hFdmVudHMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdoZW4gd2UncmUgaW4gYSB0b3VjaCBldmVudCwgcmVjb3JkIHRvdWNoZXMgdG8gIGRlLWR1cGUgc3ludGhldGljIG1vdXNlIGV2ZW50XG4gICAgICAgIGlmIChpc1RvdWNoKSB7XG4gICAgICAgICAgICByZWNvcmRUb3VjaGVzLmNhbGwodGhpcywgaW5wdXRFdmVudCwgaW5wdXREYXRhKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc01vdXNlICYmIGlzU3ludGhldGljRXZlbnQuY2FsbCh0aGlzLCBpbnB1dERhdGEpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGxiYWNrKG1hbmFnZXIsIGlucHV0RXZlbnQsIGlucHV0RGF0YSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJlbW92ZSB0aGUgZXZlbnQgbGlzdGVuZXJzXG4gICAgICovXG4gICAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy50b3VjaC5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMubW91c2UuZGVzdHJveSgpO1xuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiByZWNvcmRUb3VjaGVzKGV2ZW50VHlwZSwgZXZlbnREYXRhKSB7XG4gICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX1NUQVJUKSB7XG4gICAgICAgIHRoaXMucHJpbWFyeVRvdWNoID0gZXZlbnREYXRhLmNoYW5nZWRQb2ludGVyc1swXS5pZGVudGlmaWVyO1xuICAgICAgICBzZXRMYXN0VG91Y2guY2FsbCh0aGlzLCBldmVudERhdGEpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnRUeXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkpIHtcbiAgICAgICAgc2V0TGFzdFRvdWNoLmNhbGwodGhpcywgZXZlbnREYXRhKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNldExhc3RUb3VjaChldmVudERhdGEpIHtcbiAgICB2YXIgdG91Y2ggPSBldmVudERhdGEuY2hhbmdlZFBvaW50ZXJzWzBdO1xuXG4gICAgaWYgKHRvdWNoLmlkZW50aWZpZXIgPT09IHRoaXMucHJpbWFyeVRvdWNoKSB7XG4gICAgICAgIHZhciBsYXN0VG91Y2ggPSB7eDogdG91Y2guY2xpZW50WCwgeTogdG91Y2guY2xpZW50WX07XG4gICAgICAgIHRoaXMubGFzdFRvdWNoZXMucHVzaChsYXN0VG91Y2gpO1xuICAgICAgICB2YXIgbHRzID0gdGhpcy5sYXN0VG91Y2hlcztcbiAgICAgICAgdmFyIHJlbW92ZUxhc3RUb3VjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGkgPSBsdHMuaW5kZXhPZihsYXN0VG91Y2gpO1xuICAgICAgICAgICAgaWYgKGkgPiAtMSkge1xuICAgICAgICAgICAgICAgIGx0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHNldFRpbWVvdXQocmVtb3ZlTGFzdFRvdWNoLCBERURVUF9USU1FT1VUKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzU3ludGhldGljRXZlbnQoZXZlbnREYXRhKSB7XG4gICAgdmFyIHggPSBldmVudERhdGEuc3JjRXZlbnQuY2xpZW50WCwgeSA9IGV2ZW50RGF0YS5zcmNFdmVudC5jbGllbnRZO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sYXN0VG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdCA9IHRoaXMubGFzdFRvdWNoZXNbaV07XG4gICAgICAgIHZhciBkeCA9IE1hdGguYWJzKHggLSB0LngpLCBkeSA9IE1hdGguYWJzKHkgLSB0LnkpO1xuICAgICAgICBpZiAoZHggPD0gREVEVVBfRElTVEFOQ0UgJiYgZHkgPD0gREVEVVBfRElTVEFOQ0UpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxudmFyIFBSRUZJWEVEX1RPVUNIX0FDVElPTiA9IHByZWZpeGVkKFRFU1RfRUxFTUVOVC5zdHlsZSwgJ3RvdWNoQWN0aW9uJyk7XG52YXIgTkFUSVZFX1RPVUNIX0FDVElPTiA9IFBSRUZJWEVEX1RPVUNIX0FDVElPTiAhPT0gdW5kZWZpbmVkO1xuXG4vLyBtYWdpY2FsIHRvdWNoQWN0aW9uIHZhbHVlXG52YXIgVE9VQ0hfQUNUSU9OX0NPTVBVVEUgPSAnY29tcHV0ZSc7XG52YXIgVE9VQ0hfQUNUSU9OX0FVVE8gPSAnYXV0byc7XG52YXIgVE9VQ0hfQUNUSU9OX01BTklQVUxBVElPTiA9ICdtYW5pcHVsYXRpb24nOyAvLyBub3QgaW1wbGVtZW50ZWRcbnZhciBUT1VDSF9BQ1RJT05fTk9ORSA9ICdub25lJztcbnZhciBUT1VDSF9BQ1RJT05fUEFOX1ggPSAncGFuLXgnO1xudmFyIFRPVUNIX0FDVElPTl9QQU5fWSA9ICdwYW4teSc7XG52YXIgVE9VQ0hfQUNUSU9OX01BUCA9IGdldFRvdWNoQWN0aW9uUHJvcHMoKTtcblxuLyoqXG4gKiBUb3VjaCBBY3Rpb25cbiAqIHNldHMgdGhlIHRvdWNoQWN0aW9uIHByb3BlcnR5IG9yIHVzZXMgdGhlIGpzIGFsdGVybmF0aXZlXG4gKiBAcGFyYW0ge01hbmFnZXJ9IG1hbmFnZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFRvdWNoQWN0aW9uKG1hbmFnZXIsIHZhbHVlKSB7XG4gICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICB0aGlzLnNldCh2YWx1ZSk7XG59XG5cblRvdWNoQWN0aW9uLnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBzZXQgdGhlIHRvdWNoQWN0aW9uIHZhbHVlIG9uIHRoZSBlbGVtZW50IG9yIGVuYWJsZSB0aGUgcG9seWZpbGxcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAgICAgKi9cbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIC8vIGZpbmQgb3V0IHRoZSB0b3VjaC1hY3Rpb24gYnkgdGhlIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgIGlmICh2YWx1ZSA9PSBUT1VDSF9BQ1RJT05fQ09NUFVURSkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmNvbXB1dGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChOQVRJVkVfVE9VQ0hfQUNUSU9OICYmIHRoaXMubWFuYWdlci5lbGVtZW50LnN0eWxlICYmIFRPVUNIX0FDVElPTl9NQVBbdmFsdWVdKSB7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZWxlbWVudC5zdHlsZVtQUkVGSVhFRF9UT1VDSF9BQ1RJT05dID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hY3Rpb25zID0gdmFsdWUudG9Mb3dlckNhc2UoKS50cmltKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGp1c3QgcmUtc2V0IHRoZSB0b3VjaEFjdGlvbiB2YWx1ZVxuICAgICAqL1xuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2V0KHRoaXMubWFuYWdlci5vcHRpb25zLnRvdWNoQWN0aW9uKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogY29tcHV0ZSB0aGUgdmFsdWUgZm9yIHRoZSB0b3VjaEFjdGlvbiBwcm9wZXJ0eSBiYXNlZCBvbiB0aGUgcmVjb2duaXplcidzIHNldHRpbmdzXG4gICAgICogQHJldHVybnMge1N0cmluZ30gdmFsdWVcbiAgICAgKi9cbiAgICBjb21wdXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICAgICAgZWFjaCh0aGlzLm1hbmFnZXIucmVjb2duaXplcnMsIGZ1bmN0aW9uKHJlY29nbml6ZXIpIHtcbiAgICAgICAgICAgIGlmIChib29sT3JGbihyZWNvZ25pemVyLm9wdGlvbnMuZW5hYmxlLCBbcmVjb2duaXplcl0pKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9ucyA9IGFjdGlvbnMuY29uY2F0KHJlY29nbml6ZXIuZ2V0VG91Y2hBY3Rpb24oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY2xlYW5Ub3VjaEFjdGlvbnMoYWN0aW9ucy5qb2luKCcgJykpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgb24gZWFjaCBpbnB1dCBjeWNsZSBhbmQgcHJvdmlkZXMgdGhlIHByZXZlbnRpbmcgb2YgdGhlIGJyb3dzZXIgYmVoYXZpb3JcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAgICAgKi9cbiAgICBwcmV2ZW50RGVmYXVsdHM6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBzcmNFdmVudCA9IGlucHV0LnNyY0V2ZW50O1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gaW5wdXQub2Zmc2V0RGlyZWN0aW9uO1xuXG4gICAgICAgIC8vIGlmIHRoZSB0b3VjaCBhY3Rpb24gZGlkIHByZXZlbnRlZCBvbmNlIHRoaXMgc2Vzc2lvblxuICAgICAgICBpZiAodGhpcy5tYW5hZ2VyLnNlc3Npb24ucHJldmVudGVkKSB7XG4gICAgICAgICAgICBzcmNFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFjdGlvbnMgPSB0aGlzLmFjdGlvbnM7XG4gICAgICAgIHZhciBoYXNOb25lID0gaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX05PTkUpICYmICFUT1VDSF9BQ1RJT05fTUFQW1RPVUNIX0FDVElPTl9OT05FXTtcbiAgICAgICAgdmFyIGhhc1BhblkgPSBpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fUEFOX1kpICYmICFUT1VDSF9BQ1RJT05fTUFQW1RPVUNIX0FDVElPTl9QQU5fWV07XG4gICAgICAgIHZhciBoYXNQYW5YID0gaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX1BBTl9YKSAmJiAhVE9VQ0hfQUNUSU9OX01BUFtUT1VDSF9BQ1RJT05fUEFOX1hdO1xuXG4gICAgICAgIGlmIChoYXNOb25lKSB7XG4gICAgICAgICAgICAvL2RvIG5vdCBwcmV2ZW50IGRlZmF1bHRzIGlmIHRoaXMgaXMgYSB0YXAgZ2VzdHVyZVxuXG4gICAgICAgICAgICB2YXIgaXNUYXBQb2ludGVyID0gaW5wdXQucG9pbnRlcnMubGVuZ3RoID09PSAxO1xuICAgICAgICAgICAgdmFyIGlzVGFwTW92ZW1lbnQgPSBpbnB1dC5kaXN0YW5jZSA8IDI7XG4gICAgICAgICAgICB2YXIgaXNUYXBUb3VjaFRpbWUgPSBpbnB1dC5kZWx0YVRpbWUgPCAyNTA7XG5cbiAgICAgICAgICAgIGlmIChpc1RhcFBvaW50ZXIgJiYgaXNUYXBNb3ZlbWVudCAmJiBpc1RhcFRvdWNoVGltZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNQYW5YICYmIGhhc1BhblkpIHtcbiAgICAgICAgICAgIC8vIGBwYW4teCBwYW4teWAgbWVhbnMgYnJvd3NlciBoYW5kbGVzIGFsbCBzY3JvbGxpbmcvcGFubmluZywgZG8gbm90IHByZXZlbnRcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNOb25lIHx8XG4gICAgICAgICAgICAoaGFzUGFuWSAmJiBkaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkgfHxcbiAgICAgICAgICAgIChoYXNQYW5YICYmIGRpcmVjdGlvbiAmIERJUkVDVElPTl9WRVJUSUNBTCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXZlbnRTcmMoc3JjRXZlbnQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGNhbGwgcHJldmVudERlZmF1bHQgdG8gcHJldmVudCB0aGUgYnJvd3NlcidzIGRlZmF1bHQgYmVoYXZpb3IgKHNjcm9sbGluZyBpbiBtb3N0IGNhc2VzKVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcmNFdmVudFxuICAgICAqL1xuICAgIHByZXZlbnRTcmM6IGZ1bmN0aW9uKHNyY0V2ZW50KSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5zZXNzaW9uLnByZXZlbnRlZCA9IHRydWU7XG4gICAgICAgIHNyY0V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxufTtcblxuLyoqXG4gKiB3aGVuIHRoZSB0b3VjaEFjdGlvbnMgYXJlIGNvbGxlY3RlZCB0aGV5IGFyZSBub3QgYSB2YWxpZCB2YWx1ZSwgc28gd2UgbmVlZCB0byBjbGVhbiB0aGluZ3MgdXAuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhY3Rpb25zXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZnVuY3Rpb24gY2xlYW5Ub3VjaEFjdGlvbnMoYWN0aW9ucykge1xuICAgIC8vIG5vbmVcbiAgICBpZiAoaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX05PTkUpKSB7XG4gICAgICAgIHJldHVybiBUT1VDSF9BQ1RJT05fTk9ORTtcbiAgICB9XG5cbiAgICB2YXIgaGFzUGFuWCA9IGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9QQU5fWCk7XG4gICAgdmFyIGhhc1BhblkgPSBpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fUEFOX1kpO1xuXG4gICAgLy8gaWYgYm90aCBwYW4teCBhbmQgcGFuLXkgYXJlIHNldCAoZGlmZmVyZW50IHJlY29nbml6ZXJzXG4gICAgLy8gZm9yIGRpZmZlcmVudCBkaXJlY3Rpb25zLCBlLmcuIGhvcml6b250YWwgcGFuIGJ1dCB2ZXJ0aWNhbCBzd2lwZT8pXG4gICAgLy8gd2UgbmVlZCBub25lIChhcyBvdGhlcndpc2Ugd2l0aCBwYW4teCBwYW4teSBjb21iaW5lZCBub25lIG9mIHRoZXNlXG4gICAgLy8gcmVjb2duaXplcnMgd2lsbCB3b3JrLCBzaW5jZSB0aGUgYnJvd3NlciB3b3VsZCBoYW5kbGUgYWxsIHBhbm5pbmdcbiAgICBpZiAoaGFzUGFuWCAmJiBoYXNQYW5ZKSB7XG4gICAgICAgIHJldHVybiBUT1VDSF9BQ1RJT05fTk9ORTtcbiAgICB9XG5cbiAgICAvLyBwYW4teCBPUiBwYW4teVxuICAgIGlmIChoYXNQYW5YIHx8IGhhc1BhblkpIHtcbiAgICAgICAgcmV0dXJuIGhhc1BhblggPyBUT1VDSF9BQ1RJT05fUEFOX1ggOiBUT1VDSF9BQ1RJT05fUEFOX1k7XG4gICAgfVxuXG4gICAgLy8gbWFuaXB1bGF0aW9uXG4gICAgaWYgKGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9NQU5JUFVMQVRJT04pKSB7XG4gICAgICAgIHJldHVybiBUT1VDSF9BQ1RJT05fTUFOSVBVTEFUSU9OO1xuICAgIH1cblxuICAgIHJldHVybiBUT1VDSF9BQ1RJT05fQVVUTztcbn1cblxuZnVuY3Rpb24gZ2V0VG91Y2hBY3Rpb25Qcm9wcygpIHtcbiAgICBpZiAoIU5BVElWRV9UT1VDSF9BQ1RJT04pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgdG91Y2hNYXAgPSB7fTtcbiAgICB2YXIgY3NzU3VwcG9ydHMgPSB3aW5kb3cuQ1NTICYmIHdpbmRvdy5DU1Muc3VwcG9ydHM7XG4gICAgWydhdXRvJywgJ21hbmlwdWxhdGlvbicsICdwYW4teScsICdwYW4teCcsICdwYW4teCBwYW4teScsICdub25lJ10uZm9yRWFjaChmdW5jdGlvbih2YWwpIHtcblxuICAgICAgICAvLyBJZiBjc3Muc3VwcG9ydHMgaXMgbm90IHN1cHBvcnRlZCBidXQgdGhlcmUgaXMgbmF0aXZlIHRvdWNoLWFjdGlvbiBhc3N1bWUgaXQgc3VwcG9ydHNcbiAgICAgICAgLy8gYWxsIHZhbHVlcy4gVGhpcyBpcyB0aGUgY2FzZSBmb3IgSUUgMTAgYW5kIDExLlxuICAgICAgICB0b3VjaE1hcFt2YWxdID0gY3NzU3VwcG9ydHMgPyB3aW5kb3cuQ1NTLnN1cHBvcnRzKCd0b3VjaC1hY3Rpb24nLCB2YWwpIDogdHJ1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gdG91Y2hNYXA7XG59XG5cbi8qKlxuICogUmVjb2duaXplciBmbG93IGV4cGxhaW5lZDsgKlxuICogQWxsIHJlY29nbml6ZXJzIGhhdmUgdGhlIGluaXRpYWwgc3RhdGUgb2YgUE9TU0lCTEUgd2hlbiBhIGlucHV0IHNlc3Npb24gc3RhcnRzLlxuICogVGhlIGRlZmluaXRpb24gb2YgYSBpbnB1dCBzZXNzaW9uIGlzIGZyb20gdGhlIGZpcnN0IGlucHV0IHVudGlsIHRoZSBsYXN0IGlucHV0LCB3aXRoIGFsbCBpdCdzIG1vdmVtZW50IGluIGl0LiAqXG4gKiBFeGFtcGxlIHNlc3Npb24gZm9yIG1vdXNlLWlucHV0OiBtb3VzZWRvd24gLT4gbW91c2Vtb3ZlIC0+IG1vdXNldXBcbiAqXG4gKiBPbiBlYWNoIHJlY29nbml6aW5nIGN5Y2xlIChzZWUgTWFuYWdlci5yZWNvZ25pemUpIHRoZSAucmVjb2duaXplKCkgbWV0aG9kIGlzIGV4ZWN1dGVkXG4gKiB3aGljaCBkZXRlcm1pbmVzIHdpdGggc3RhdGUgaXQgc2hvdWxkIGJlLlxuICpcbiAqIElmIHRoZSByZWNvZ25pemVyIGhhcyB0aGUgc3RhdGUgRkFJTEVELCBDQU5DRUxMRUQgb3IgUkVDT0dOSVpFRCAoZXF1YWxzIEVOREVEKSwgaXQgaXMgcmVzZXQgdG9cbiAqIFBPU1NJQkxFIHRvIGdpdmUgaXQgYW5vdGhlciBjaGFuZ2Ugb24gdGhlIG5leHQgY3ljbGUuXG4gKlxuICogICAgICAgICAgICAgICBQb3NzaWJsZVxuICogICAgICAgICAgICAgICAgICB8XG4gKiAgICAgICAgICAgICstLS0tLSstLS0tLS0tLS0tLS0tLS0rXG4gKiAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICB8XG4gKiAgICAgICstLS0tLSstLS0tLSsgICAgICAgICAgICAgICB8XG4gKiAgICAgIHwgICAgICAgICAgIHwgICAgICAgICAgICAgICB8XG4gKiAgIEZhaWxlZCAgICAgIENhbmNlbGxlZCAgICAgICAgICB8XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgKy0tLS0tLS0rLS0tLS0tK1xuICogICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgIFJlY29nbml6ZWQgICAgICAgQmVnYW5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhbmdlZFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVuZGVkL1JlY29nbml6ZWRcbiAqL1xudmFyIFNUQVRFX1BPU1NJQkxFID0gMTtcbnZhciBTVEFURV9CRUdBTiA9IDI7XG52YXIgU1RBVEVfQ0hBTkdFRCA9IDQ7XG52YXIgU1RBVEVfRU5ERUQgPSA4O1xudmFyIFNUQVRFX1JFQ09HTklaRUQgPSBTVEFURV9FTkRFRDtcbnZhciBTVEFURV9DQU5DRUxMRUQgPSAxNjtcbnZhciBTVEFURV9GQUlMRUQgPSAzMjtcblxuLyoqXG4gKiBSZWNvZ25pemVyXG4gKiBFdmVyeSByZWNvZ25pemVyIG5lZWRzIHRvIGV4dGVuZCBmcm9tIHRoaXMgY2xhc3MuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKi9cbmZ1bmN0aW9uIFJlY29nbml6ZXIob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IGFzc2lnbih7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICB0aGlzLmlkID0gdW5pcXVlSWQoKTtcblxuICAgIHRoaXMubWFuYWdlciA9IG51bGw7XG5cbiAgICAvLyBkZWZhdWx0IGlzIGVuYWJsZSB0cnVlXG4gICAgdGhpcy5vcHRpb25zLmVuYWJsZSA9IGlmVW5kZWZpbmVkKHRoaXMub3B0aW9ucy5lbmFibGUsIHRydWUpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFX1BPU1NJQkxFO1xuXG4gICAgdGhpcy5zaW11bHRhbmVvdXMgPSB7fTtcbiAgICB0aGlzLnJlcXVpcmVGYWlsID0gW107XG59XG5cblJlY29nbml6ZXIucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIEB2aXJ0dWFsXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBkZWZhdWx0czoge30sXG5cbiAgICAvKipcbiAgICAgKiBzZXQgb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICogQHJldHVybiB7UmVjb2duaXplcn1cbiAgICAgKi9cbiAgICBzZXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgICAgLy8gYWxzbyB1cGRhdGUgdGhlIHRvdWNoQWN0aW9uLCBpbiBjYXNlIHNvbWV0aGluZyBjaGFuZ2VkIGFib3V0IHRoZSBkaXJlY3Rpb25zL2VuYWJsZWQgc3RhdGVcbiAgICAgICAgdGhpcy5tYW5hZ2VyICYmIHRoaXMubWFuYWdlci50b3VjaEFjdGlvbi51cGRhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJlY29nbml6ZSBzaW11bHRhbmVvdXMgd2l0aCBhbiBvdGhlciByZWNvZ25pemVyLlxuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcn0gb3RoZXJSZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ9IHRoaXNcbiAgICAgKi9cbiAgICByZWNvZ25pemVXaXRoOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ3JlY29nbml6ZVdpdGgnLCB0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2ltdWx0YW5lb3VzID0gdGhpcy5zaW11bHRhbmVvdXM7XG4gICAgICAgIG90aGVyUmVjb2duaXplciA9IGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCB0aGlzKTtcbiAgICAgICAgaWYgKCFzaW11bHRhbmVvdXNbb3RoZXJSZWNvZ25pemVyLmlkXSkge1xuICAgICAgICAgICAgc2ltdWx0YW5lb3VzW290aGVyUmVjb2duaXplci5pZF0gPSBvdGhlclJlY29nbml6ZXI7XG4gICAgICAgICAgICBvdGhlclJlY29nbml6ZXIucmVjb2duaXplV2l0aCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZHJvcCB0aGUgc2ltdWx0YW5lb3VzIGxpbmsuIGl0IGRvZXNudCByZW1vdmUgdGhlIGxpbmsgb24gdGhlIG90aGVyIHJlY29nbml6ZXIuXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7UmVjb2duaXplcn0gdGhpc1xuICAgICAqL1xuICAgIGRyb3BSZWNvZ25pemVXaXRoOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ2Ryb3BSZWNvZ25pemVXaXRoJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb3RoZXJSZWNvZ25pemVyID0gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHRoaXMpO1xuICAgICAgICBkZWxldGUgdGhpcy5zaW11bHRhbmVvdXNbb3RoZXJSZWNvZ25pemVyLmlkXTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJlY29nbml6ZXIgY2FuIG9ubHkgcnVuIHdoZW4gYW4gb3RoZXIgaXMgZmFpbGluZ1xuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcn0gb3RoZXJSZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ9IHRoaXNcbiAgICAgKi9cbiAgICByZXF1aXJlRmFpbHVyZTogZnVuY3Rpb24ob3RoZXJSZWNvZ25pemVyKSB7XG4gICAgICAgIGlmIChpbnZva2VBcnJheUFyZyhvdGhlclJlY29nbml6ZXIsICdyZXF1aXJlRmFpbHVyZScsIHRoaXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXF1aXJlRmFpbCA9IHRoaXMucmVxdWlyZUZhaWw7XG4gICAgICAgIG90aGVyUmVjb2duaXplciA9IGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCB0aGlzKTtcbiAgICAgICAgaWYgKGluQXJyYXkocmVxdWlyZUZhaWwsIG90aGVyUmVjb2duaXplcikgPT09IC0xKSB7XG4gICAgICAgICAgICByZXF1aXJlRmFpbC5wdXNoKG90aGVyUmVjb2duaXplcik7XG4gICAgICAgICAgICBvdGhlclJlY29nbml6ZXIucmVxdWlyZUZhaWx1cmUodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGRyb3AgdGhlIHJlcXVpcmVGYWlsdXJlIGxpbmsuIGl0IGRvZXMgbm90IHJlbW92ZSB0aGUgbGluayBvbiB0aGUgb3RoZXIgcmVjb2duaXplci5cbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ9IG90aGVyUmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfSB0aGlzXG4gICAgICovXG4gICAgZHJvcFJlcXVpcmVGYWlsdXJlOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ2Ryb3BSZXF1aXJlRmFpbHVyZScsIHRoaXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG90aGVyUmVjb2duaXplciA9IGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCB0aGlzKTtcbiAgICAgICAgdmFyIGluZGV4ID0gaW5BcnJheSh0aGlzLnJlcXVpcmVGYWlsLCBvdGhlclJlY29nbml6ZXIpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5yZXF1aXJlRmFpbC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBoYXMgcmVxdWlyZSBmYWlsdXJlcyBib29sZWFuXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzUmVxdWlyZUZhaWx1cmVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWlyZUZhaWwubGVuZ3RoID4gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogaWYgdGhlIHJlY29nbml6ZXIgY2FuIHJlY29nbml6ZSBzaW11bHRhbmVvdXMgd2l0aCBhbiBvdGhlciByZWNvZ25pemVyXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBjYW5SZWNvZ25pemVXaXRoOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5zaW11bHRhbmVvdXNbb3RoZXJSZWNvZ25pemVyLmlkXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogWW91IHNob3VsZCB1c2UgYHRyeUVtaXRgIGluc3RlYWQgb2YgYGVtaXRgIGRpcmVjdGx5IHRvIGNoZWNrXG4gICAgICogdGhhdCBhbGwgdGhlIG5lZWRlZCByZWNvZ25pemVycyBoYXMgZmFpbGVkIGJlZm9yZSBlbWl0dGluZy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAgICAgKi9cbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGU7XG5cbiAgICAgICAgZnVuY3Rpb24gZW1pdChldmVudCkge1xuICAgICAgICAgICAgc2VsZi5tYW5hZ2VyLmVtaXQoZXZlbnQsIGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vICdwYW5zdGFydCcgYW5kICdwYW5tb3ZlJ1xuICAgICAgICBpZiAoc3RhdGUgPCBTVEFURV9FTkRFRCkge1xuICAgICAgICAgICAgZW1pdChzZWxmLm9wdGlvbnMuZXZlbnQgKyBzdGF0ZVN0cihzdGF0ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZW1pdChzZWxmLm9wdGlvbnMuZXZlbnQpOyAvLyBzaW1wbGUgJ2V2ZW50TmFtZScgZXZlbnRzXG5cbiAgICAgICAgaWYgKGlucHV0LmFkZGl0aW9uYWxFdmVudCkgeyAvLyBhZGRpdGlvbmFsIGV2ZW50KHBhbmxlZnQsIHBhbnJpZ2h0LCBwaW5jaGluLCBwaW5jaG91dC4uLilcbiAgICAgICAgICAgIGVtaXQoaW5wdXQuYWRkaXRpb25hbEV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHBhbmVuZCBhbmQgcGFuY2FuY2VsXG4gICAgICAgIGlmIChzdGF0ZSA+PSBTVEFURV9FTkRFRCkge1xuICAgICAgICAgICAgZW1pdChzZWxmLm9wdGlvbnMuZXZlbnQgKyBzdGF0ZVN0cihzdGF0ZSkpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoZWNrIHRoYXQgYWxsIHRoZSByZXF1aXJlIGZhaWx1cmUgcmVjb2duaXplcnMgaGFzIGZhaWxlZCxcbiAgICAgKiBpZiB0cnVlLCBpdCBlbWl0cyBhIGdlc3R1cmUgZXZlbnQsXG4gICAgICogb3RoZXJ3aXNlLCBzZXR1cCB0aGUgc3RhdGUgdG8gRkFJTEVELlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqL1xuICAgIHRyeUVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIGlmICh0aGlzLmNhbkVtaXQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW1pdChpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaXQncyBmYWlsaW5nIGFueXdheVxuICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfRkFJTEVEO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBjYW4gd2UgZW1pdD9cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBjYW5FbWl0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IHRoaXMucmVxdWlyZUZhaWwubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoISh0aGlzLnJlcXVpcmVGYWlsW2ldLnN0YXRlICYgKFNUQVRFX0ZBSUxFRCB8IFNUQVRFX1BPU1NJQkxFKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHVwZGF0ZSB0aGUgcmVjb2duaXplclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcbiAgICAgKi9cbiAgICByZWNvZ25pemU6IGZ1bmN0aW9uKGlucHV0RGF0YSkge1xuICAgICAgICAvLyBtYWtlIGEgbmV3IGNvcHkgb2YgdGhlIGlucHV0RGF0YVxuICAgICAgICAvLyBzbyB3ZSBjYW4gY2hhbmdlIHRoZSBpbnB1dERhdGEgd2l0aG91dCBtZXNzaW5nIHVwIHRoZSBvdGhlciByZWNvZ25pemVyc1xuICAgICAgICB2YXIgaW5wdXREYXRhQ2xvbmUgPSBhc3NpZ24oe30sIGlucHV0RGF0YSk7XG5cbiAgICAgICAgLy8gaXMgaXMgZW5hYmxlZCBhbmQgYWxsb3cgcmVjb2duaXppbmc/XG4gICAgICAgIGlmICghYm9vbE9yRm4odGhpcy5vcHRpb25zLmVuYWJsZSwgW3RoaXMsIGlucHV0RGF0YUNsb25lXSkpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9GQUlMRUQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXNldCB3aGVuIHdlJ3ZlIHJlYWNoZWQgdGhlIGVuZFxuICAgICAgICBpZiAodGhpcy5zdGF0ZSAmIChTVEFURV9SRUNPR05JWkVEIHwgU1RBVEVfQ0FOQ0VMTEVEIHwgU1RBVEVfRkFJTEVEKSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFX1BPU1NJQkxFO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMucHJvY2VzcyhpbnB1dERhdGFDbG9uZSk7XG5cbiAgICAgICAgLy8gdGhlIHJlY29nbml6ZXIgaGFzIHJlY29nbml6ZWQgYSBnZXN0dXJlXG4gICAgICAgIC8vIHNvIHRyaWdnZXIgYW4gZXZlbnRcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgJiAoU1RBVEVfQkVHQU4gfCBTVEFURV9DSEFOR0VEIHwgU1RBVEVfRU5ERUQgfCBTVEFURV9DQU5DRUxMRUQpKSB7XG4gICAgICAgICAgICB0aGlzLnRyeUVtaXQoaW5wdXREYXRhQ2xvbmUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJldHVybiB0aGUgc3RhdGUgb2YgdGhlIHJlY29nbml6ZXJcbiAgICAgKiB0aGUgYWN0dWFsIHJlY29nbml6aW5nIGhhcHBlbnMgaW4gdGhpcyBtZXRob2RcbiAgICAgKiBAdmlydHVhbFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcbiAgICAgKiBAcmV0dXJucyB7Q29uc3R9IFNUQVRFXG4gICAgICovXG4gICAgcHJvY2VzczogZnVuY3Rpb24oaW5wdXREYXRhKSB7IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHRoZSBwcmVmZXJyZWQgdG91Y2gtYWN0aW9uXG4gICAgICogQHZpcnR1YWxcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkgeyB9LFxuXG4gICAgLyoqXG4gICAgICogY2FsbGVkIHdoZW4gdGhlIGdlc3R1cmUgaXNuJ3QgYWxsb3dlZCB0byByZWNvZ25pemVcbiAgICAgKiBsaWtlIHdoZW4gYW5vdGhlciBpcyBiZWluZyByZWNvZ25pemVkIG9yIGl0IGlzIGRpc2FibGVkXG4gICAgICogQHZpcnR1YWxcbiAgICAgKi9cbiAgICByZXNldDogZnVuY3Rpb24oKSB7IH1cbn07XG5cbi8qKlxuICogZ2V0IGEgdXNhYmxlIHN0cmluZywgdXNlZCBhcyBldmVudCBwb3N0Zml4XG4gKiBAcGFyYW0ge0NvbnN0fSBzdGF0ZVxuICogQHJldHVybnMge1N0cmluZ30gc3RhdGVcbiAqL1xuZnVuY3Rpb24gc3RhdGVTdHIoc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgJiBTVEFURV9DQU5DRUxMRUQpIHtcbiAgICAgICAgcmV0dXJuICdjYW5jZWwnO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUgJiBTVEFURV9FTkRFRCkge1xuICAgICAgICByZXR1cm4gJ2VuZCc7XG4gICAgfSBlbHNlIGlmIChzdGF0ZSAmIFNUQVRFX0NIQU5HRUQpIHtcbiAgICAgICAgcmV0dXJuICdtb3ZlJztcbiAgICB9IGVsc2UgaWYgKHN0YXRlICYgU1RBVEVfQkVHQU4pIHtcbiAgICAgICAgcmV0dXJuICdzdGFydCc7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBkaXJlY3Rpb24gY29ucyB0byBzdHJpbmdcbiAqIEBwYXJhbSB7Q29uc3R9IGRpcmVjdGlvblxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZGlyZWN0aW9uU3RyKGRpcmVjdGlvbikge1xuICAgIGlmIChkaXJlY3Rpb24gPT0gRElSRUNUSU9OX0RPV04pIHtcbiAgICAgICAgcmV0dXJuICdkb3duJztcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PSBESVJFQ1RJT05fVVApIHtcbiAgICAgICAgcmV0dXJuICd1cCc7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT0gRElSRUNUSU9OX0xFRlQpIHtcbiAgICAgICAgcmV0dXJuICdsZWZ0JztcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PSBESVJFQ1RJT05fUklHSFQpIHtcbiAgICAgICAgcmV0dXJuICdyaWdodCc7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBnZXQgYSByZWNvZ25pemVyIGJ5IG5hbWUgaWYgaXQgaXMgYm91bmQgdG8gYSBtYW5hZ2VyXG4gKiBAcGFyYW0ge1JlY29nbml6ZXJ8U3RyaW5nfSBvdGhlclJlY29nbml6ZXJcbiAqIEBwYXJhbSB7UmVjb2duaXplcn0gcmVjb2duaXplclxuICogQHJldHVybnMge1JlY29nbml6ZXJ9XG4gKi9cbmZ1bmN0aW9uIGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCByZWNvZ25pemVyKSB7XG4gICAgdmFyIG1hbmFnZXIgPSByZWNvZ25pemVyLm1hbmFnZXI7XG4gICAgaWYgKG1hbmFnZXIpIHtcbiAgICAgICAgcmV0dXJuIG1hbmFnZXIuZ2V0KG90aGVyUmVjb2duaXplcik7XG4gICAgfVxuICAgIHJldHVybiBvdGhlclJlY29nbml6ZXI7XG59XG5cbi8qKlxuICogVGhpcyByZWNvZ25pemVyIGlzIGp1c3QgdXNlZCBhcyBhIGJhc2UgZm9yIHRoZSBzaW1wbGUgYXR0cmlidXRlIHJlY29nbml6ZXJzLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIEF0dHJSZWNvZ25pemVyKCkge1xuICAgIFJlY29nbml6ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuaW5oZXJpdChBdHRyUmVjb2duaXplciwgUmVjb2duaXplciwge1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgQXR0clJlY29nbml6ZXJcbiAgICAgKi9cbiAgICBkZWZhdWx0czoge1xuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMVxuICAgICAgICAgKi9cbiAgICAgICAgcG9pbnRlcnM6IDFcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVXNlZCB0byBjaGVjayBpZiBpdCB0aGUgcmVjb2duaXplciByZWNlaXZlcyB2YWxpZCBpbnB1dCwgbGlrZSBpbnB1dC5kaXN0YW5jZSA+IDEwLlxuICAgICAqIEBtZW1iZXJvZiBBdHRyUmVjb2duaXplclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufSByZWNvZ25pemVkXG4gICAgICovXG4gICAgYXR0clRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBvcHRpb25Qb2ludGVycyA9IHRoaXMub3B0aW9ucy5wb2ludGVycztcbiAgICAgICAgcmV0dXJuIG9wdGlvblBvaW50ZXJzID09PSAwIHx8IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA9PT0gb3B0aW9uUG9pbnRlcnM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFByb2Nlc3MgdGhlIGlucHV0IGFuZCByZXR1cm4gdGhlIHN0YXRlIGZvciB0aGUgcmVjb2duaXplclxuICAgICAqIEBtZW1iZXJvZiBBdHRyUmVjb2duaXplclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqIEByZXR1cm5zIHsqfSBTdGF0ZVxuICAgICAqL1xuICAgIHByb2Nlc3M6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIHZhciBldmVudFR5cGUgPSBpbnB1dC5ldmVudFR5cGU7XG5cbiAgICAgICAgdmFyIGlzUmVjb2duaXplZCA9IHN0YXRlICYgKFNUQVRFX0JFR0FOIHwgU1RBVEVfQ0hBTkdFRCk7XG4gICAgICAgIHZhciBpc1ZhbGlkID0gdGhpcy5hdHRyVGVzdChpbnB1dCk7XG5cbiAgICAgICAgLy8gb24gY2FuY2VsIGlucHV0IGFuZCB3ZSd2ZSByZWNvZ25pemVkIGJlZm9yZSwgcmV0dXJuIFNUQVRFX0NBTkNFTExFRFxuICAgICAgICBpZiAoaXNSZWNvZ25pemVkICYmIChldmVudFR5cGUgJiBJTlBVVF9DQU5DRUwgfHwgIWlzVmFsaWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUgfCBTVEFURV9DQU5DRUxMRUQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNSZWNvZ25pemVkIHx8IGlzVmFsaWQpIHtcbiAgICAgICAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9FTkQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUgfCBTVEFURV9FTkRFRDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIShzdGF0ZSAmIFNUQVRFX0JFR0FOKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTVEFURV9CRUdBTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZSB8IFNUQVRFX0NIQU5HRUQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFNUQVRFX0ZBSUxFRDtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBQYW5cbiAqIFJlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBkb3duIGFuZCBtb3ZlZCBpbiB0aGUgYWxsb3dlZCBkaXJlY3Rpb24uXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIEF0dHJSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFBhblJlY29nbml6ZXIoKSB7XG4gICAgQXR0clJlY29nbml6ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHRoaXMucFggPSBudWxsO1xuICAgIHRoaXMucFkgPSBudWxsO1xufVxuXG5pbmhlcml0KFBhblJlY29nbml6ZXIsIEF0dHJSZWNvZ25pemVyLCB7XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZVxuICAgICAqIEBtZW1iZXJvZiBQYW5SZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdwYW4nLFxuICAgICAgICB0aHJlc2hvbGQ6IDEwLFxuICAgICAgICBwb2ludGVyczogMSxcbiAgICAgICAgZGlyZWN0aW9uOiBESVJFQ1RJT05fQUxMXG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IHRoaXMub3B0aW9ucy5kaXJlY3Rpb247XG4gICAgICAgIHZhciBhY3Rpb25zID0gW107XG4gICAgICAgIGlmIChkaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKFRPVUNIX0FDVElPTl9QQU5fWSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpcmVjdGlvbiAmIERJUkVDVElPTl9WRVJUSUNBTCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKFRPVUNIX0FDVElPTl9QQU5fWCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjdGlvbnM7XG4gICAgfSxcblxuICAgIGRpcmVjdGlvblRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgICB2YXIgaGFzTW92ZWQgPSB0cnVlO1xuICAgICAgICB2YXIgZGlzdGFuY2UgPSBpbnB1dC5kaXN0YW5jZTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGlucHV0LmRpcmVjdGlvbjtcbiAgICAgICAgdmFyIHggPSBpbnB1dC5kZWx0YVg7XG4gICAgICAgIHZhciB5ID0gaW5wdXQuZGVsdGFZO1xuXG4gICAgICAgIC8vIGxvY2sgdG8gYXhpcz9cbiAgICAgICAgaWYgKCEoZGlyZWN0aW9uICYgb3B0aW9ucy5kaXJlY3Rpb24pKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkge1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9ICh4ID09PSAwKSA/IERJUkVDVElPTl9OT05FIDogKHggPCAwKSA/IERJUkVDVElPTl9MRUZUIDogRElSRUNUSU9OX1JJR0hUO1xuICAgICAgICAgICAgICAgIGhhc01vdmVkID0geCAhPSB0aGlzLnBYO1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gTWF0aC5hYnMoaW5wdXQuZGVsdGFYKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gKHkgPT09IDApID8gRElSRUNUSU9OX05PTkUgOiAoeSA8IDApID8gRElSRUNUSU9OX1VQIDogRElSRUNUSU9OX0RPV047XG4gICAgICAgICAgICAgICAgaGFzTW92ZWQgPSB5ICE9IHRoaXMucFk7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBNYXRoLmFicyhpbnB1dC5kZWx0YVkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlucHV0LmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICAgICAgcmV0dXJuIGhhc01vdmVkICYmIGRpc3RhbmNlID4gb3B0aW9ucy50aHJlc2hvbGQgJiYgZGlyZWN0aW9uICYgb3B0aW9ucy5kaXJlY3Rpb247XG4gICAgfSxcblxuICAgIGF0dHJUZXN0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICByZXR1cm4gQXR0clJlY29nbml6ZXIucHJvdG90eXBlLmF0dHJUZXN0LmNhbGwodGhpcywgaW5wdXQpICYmXG4gICAgICAgICAgICAodGhpcy5zdGF0ZSAmIFNUQVRFX0JFR0FOIHx8ICghKHRoaXMuc3RhdGUgJiBTVEFURV9CRUdBTikgJiYgdGhpcy5kaXJlY3Rpb25UZXN0KGlucHV0KSkpO1xuICAgIH0sXG5cbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xuXG4gICAgICAgIHRoaXMucFggPSBpbnB1dC5kZWx0YVg7XG4gICAgICAgIHRoaXMucFkgPSBpbnB1dC5kZWx0YVk7XG5cbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGRpcmVjdGlvblN0cihpbnB1dC5kaXJlY3Rpb24pO1xuXG4gICAgICAgIGlmIChkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIGlucHV0LmFkZGl0aW9uYWxFdmVudCA9IHRoaXMub3B0aW9ucy5ldmVudCArIGRpcmVjdGlvbjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdXBlci5lbWl0LmNhbGwodGhpcywgaW5wdXQpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIFBpbmNoXG4gKiBSZWNvZ25pemVkIHdoZW4gdHdvIG9yIG1vcmUgcG9pbnRlcnMgYXJlIG1vdmluZyB0b3dhcmQgKHpvb20taW4pIG9yIGF3YXkgZnJvbSBlYWNoIG90aGVyICh6b29tLW91dCkuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIEF0dHJSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFBpbmNoUmVjb2duaXplcigpIHtcbiAgICBBdHRyUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFBpbmNoUmVjb2duaXplciwgQXR0clJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFBpbmNoUmVjb2duaXplclxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGV2ZW50OiAncGluY2gnLFxuICAgICAgICB0aHJlc2hvbGQ6IDAsXG4gICAgICAgIHBvaW50ZXJzOiAyXG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtUT1VDSF9BQ1RJT05fTk9ORV07XG4gICAgfSxcblxuICAgIGF0dHJUZXN0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3VwZXIuYXR0clRlc3QuY2FsbCh0aGlzLCBpbnB1dCkgJiZcbiAgICAgICAgICAgIChNYXRoLmFicyhpbnB1dC5zY2FsZSAtIDEpID4gdGhpcy5vcHRpb25zLnRocmVzaG9sZCB8fCB0aGlzLnN0YXRlICYgU1RBVEVfQkVHQU4pO1xuICAgIH0sXG5cbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICBpZiAoaW5wdXQuc2NhbGUgIT09IDEpIHtcbiAgICAgICAgICAgIHZhciBpbk91dCA9IGlucHV0LnNjYWxlIDwgMSA/ICdpbicgOiAnb3V0JztcbiAgICAgICAgICAgIGlucHV0LmFkZGl0aW9uYWxFdmVudCA9IHRoaXMub3B0aW9ucy5ldmVudCArIGluT3V0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N1cGVyLmVtaXQuY2FsbCh0aGlzLCBpbnB1dCk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogUHJlc3NcbiAqIFJlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBkb3duIGZvciB4IG1zIHdpdGhvdXQgYW55IG1vdmVtZW50LlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFByZXNzUmVjb2duaXplcigpIHtcbiAgICBSZWNvZ25pemVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB0aGlzLl90aW1lciA9IG51bGw7XG4gICAgdGhpcy5faW5wdXQgPSBudWxsO1xufVxuXG5pbmhlcml0KFByZXNzUmVjb2duaXplciwgUmVjb2duaXplciwge1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgUHJlc3NSZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdwcmVzcycsXG4gICAgICAgIHBvaW50ZXJzOiAxLFxuICAgICAgICB0aW1lOiAyNTEsIC8vIG1pbmltYWwgdGltZSBvZiB0aGUgcG9pbnRlciB0byBiZSBwcmVzc2VkXG4gICAgICAgIHRocmVzaG9sZDogOSAvLyBhIG1pbmltYWwgbW92ZW1lbnQgaXMgb2ssIGJ1dCBrZWVwIGl0IGxvd1xuICAgIH0sXG5cbiAgICBnZXRUb3VjaEFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBbVE9VQ0hfQUNUSU9OX0FVVE9dO1xuICAgIH0sXG5cbiAgICBwcm9jZXNzOiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgdmFyIHZhbGlkUG9pbnRlcnMgPSBpbnB1dC5wb2ludGVycy5sZW5ndGggPT09IG9wdGlvbnMucG9pbnRlcnM7XG4gICAgICAgIHZhciB2YWxpZE1vdmVtZW50ID0gaW5wdXQuZGlzdGFuY2UgPCBvcHRpb25zLnRocmVzaG9sZDtcbiAgICAgICAgdmFyIHZhbGlkVGltZSA9IGlucHV0LmRlbHRhVGltZSA+IG9wdGlvbnMudGltZTtcblxuICAgICAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuXG4gICAgICAgIC8vIHdlIG9ubHkgYWxsb3cgbGl0dGxlIG1vdmVtZW50XG4gICAgICAgIC8vIGFuZCB3ZSd2ZSByZWFjaGVkIGFuIGVuZCBldmVudCwgc28gYSB0YXAgaXMgcG9zc2libGVcbiAgICAgICAgaWYgKCF2YWxpZE1vdmVtZW50IHx8ICF2YWxpZFBvaW50ZXJzIHx8IChpbnB1dC5ldmVudFR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSAmJiAhdmFsaWRUaW1lKSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmV2ZW50VHlwZSAmIElOUFVUX1NUQVJUKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXRDb250ZXh0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9SRUNPR05JWkVEO1xuICAgICAgICAgICAgICAgIHRoaXMudHJ5RW1pdCgpO1xuICAgICAgICAgICAgfSwgb3B0aW9ucy50aW1lLCB0aGlzKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5ldmVudFR5cGUgJiBJTlBVVF9FTkQpIHtcbiAgICAgICAgICAgIHJldHVybiBTVEFURV9SRUNPR05JWkVEO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTVEFURV9GQUlMRUQ7XG4gICAgfSxcblxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgICB9LFxuXG4gICAgZW1pdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IFNUQVRFX1JFQ09HTklaRUQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbnB1dCAmJiAoaW5wdXQuZXZlbnRUeXBlICYgSU5QVVRfRU5EKSkge1xuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmVtaXQodGhpcy5vcHRpb25zLmV2ZW50ICsgJ3VwJywgaW5wdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faW5wdXQudGltZVN0YW1wID0gbm93KCk7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsIHRoaXMuX2lucHV0KTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vKipcbiAqIFJvdGF0ZVxuICogUmVjb2duaXplZCB3aGVuIHR3byBvciBtb3JlIHBvaW50ZXIgYXJlIG1vdmluZyBpbiBhIGNpcmN1bGFyIG1vdGlvbi5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgQXR0clJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gUm90YXRlUmVjb2duaXplcigpIHtcbiAgICBBdHRyUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFJvdGF0ZVJlY29nbml6ZXIsIEF0dHJSZWNvZ25pemVyLCB7XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZVxuICAgICAqIEBtZW1iZXJvZiBSb3RhdGVSZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdyb3RhdGUnLFxuICAgICAgICB0aHJlc2hvbGQ6IDAsXG4gICAgICAgIHBvaW50ZXJzOiAyXG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtUT1VDSF9BQ1RJT05fTk9ORV07XG4gICAgfSxcblxuICAgIGF0dHJUZXN0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3VwZXIuYXR0clRlc3QuY2FsbCh0aGlzLCBpbnB1dCkgJiZcbiAgICAgICAgICAgIChNYXRoLmFicyhpbnB1dC5yb3RhdGlvbikgPiB0aGlzLm9wdGlvbnMudGhyZXNob2xkIHx8IHRoaXMuc3RhdGUgJiBTVEFURV9CRUdBTik7XG4gICAgfVxufSk7XG5cbi8qKlxuICogU3dpcGVcbiAqIFJlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBtb3ZpbmcgZmFzdCAodmVsb2NpdHkpLCB3aXRoIGVub3VnaCBkaXN0YW5jZSBpbiB0aGUgYWxsb3dlZCBkaXJlY3Rpb24uXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIEF0dHJSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFN3aXBlUmVjb2duaXplcigpIHtcbiAgICBBdHRyUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFN3aXBlUmVjb2duaXplciwgQXR0clJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFN3aXBlUmVjb2duaXplclxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGV2ZW50OiAnc3dpcGUnLFxuICAgICAgICB0aHJlc2hvbGQ6IDEwLFxuICAgICAgICB2ZWxvY2l0eTogMC4zLFxuICAgICAgICBkaXJlY3Rpb246IERJUkVDVElPTl9IT1JJWk9OVEFMIHwgRElSRUNUSU9OX1ZFUlRJQ0FMLFxuICAgICAgICBwb2ludGVyczogMVxuICAgIH0sXG5cbiAgICBnZXRUb3VjaEFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBQYW5SZWNvZ25pemVyLnByb3RvdHlwZS5nZXRUb3VjaEFjdGlvbi5jYWxsKHRoaXMpO1xuICAgIH0sXG5cbiAgICBhdHRyVGVzdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IHRoaXMub3B0aW9ucy5kaXJlY3Rpb247XG4gICAgICAgIHZhciB2ZWxvY2l0eTtcblxuICAgICAgICBpZiAoZGlyZWN0aW9uICYgKERJUkVDVElPTl9IT1JJWk9OVEFMIHwgRElSRUNUSU9OX1ZFUlRJQ0FMKSkge1xuICAgICAgICAgICAgdmVsb2NpdHkgPSBpbnB1dC5vdmVyYWxsVmVsb2NpdHk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uICYgRElSRUNUSU9OX0hPUklaT05UQUwpIHtcbiAgICAgICAgICAgIHZlbG9jaXR5ID0gaW5wdXQub3ZlcmFsbFZlbG9jaXR5WDtcbiAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gJiBESVJFQ1RJT05fVkVSVElDQUwpIHtcbiAgICAgICAgICAgIHZlbG9jaXR5ID0gaW5wdXQub3ZlcmFsbFZlbG9jaXR5WTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsIGlucHV0KSAmJlxuICAgICAgICAgICAgZGlyZWN0aW9uICYgaW5wdXQub2Zmc2V0RGlyZWN0aW9uICYmXG4gICAgICAgICAgICBpbnB1dC5kaXN0YW5jZSA+IHRoaXMub3B0aW9ucy50aHJlc2hvbGQgJiZcbiAgICAgICAgICAgIGlucHV0Lm1heFBvaW50ZXJzID09IHRoaXMub3B0aW9ucy5wb2ludGVycyAmJlxuICAgICAgICAgICAgYWJzKHZlbG9jaXR5KSA+IHRoaXMub3B0aW9ucy52ZWxvY2l0eSAmJiBpbnB1dC5ldmVudFR5cGUgJiBJTlBVVF9FTkQ7XG4gICAgfSxcblxuICAgIGVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSBkaXJlY3Rpb25TdHIoaW5wdXQub2Zmc2V0RGlyZWN0aW9uKTtcbiAgICAgICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmVtaXQodGhpcy5vcHRpb25zLmV2ZW50ICsgZGlyZWN0aW9uLCBpbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsIGlucHV0KTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBBIHRhcCBpcyBlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBkb2luZyBhIHNtYWxsIHRhcC9jbGljay4gTXVsdGlwbGUgdGFwcyBhcmUgcmVjb2duaXplZCBpZiB0aGV5IG9jY3VyXG4gKiBiZXR3ZWVuIHRoZSBnaXZlbiBpbnRlcnZhbCBhbmQgcG9zaXRpb24uIFRoZSBkZWxheSBvcHRpb24gY2FuIGJlIHVzZWQgdG8gcmVjb2duaXplIG11bHRpLXRhcHMgd2l0aG91dCBmaXJpbmdcbiAqIGEgc2luZ2xlIHRhcC5cbiAqXG4gKiBUaGUgZXZlbnREYXRhIGZyb20gdGhlIGVtaXR0ZWQgZXZlbnQgY29udGFpbnMgdGhlIHByb3BlcnR5IGB0YXBDb3VudGAsIHdoaWNoIGNvbnRhaW5zIHRoZSBhbW91bnQgb2ZcbiAqIG11bHRpLXRhcHMgYmVpbmcgcmVjb2duaXplZC5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgUmVjb2duaXplclxuICovXG5mdW5jdGlvbiBUYXBSZWNvZ25pemVyKCkge1xuICAgIFJlY29nbml6ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIC8vIHByZXZpb3VzIHRpbWUgYW5kIGNlbnRlcixcbiAgICAvLyB1c2VkIGZvciB0YXAgY291bnRpbmdcbiAgICB0aGlzLnBUaW1lID0gZmFsc2U7XG4gICAgdGhpcy5wQ2VudGVyID0gZmFsc2U7XG5cbiAgICB0aGlzLl90aW1lciA9IG51bGw7XG4gICAgdGhpcy5faW5wdXQgPSBudWxsO1xuICAgIHRoaXMuY291bnQgPSAwO1xufVxuXG5pbmhlcml0KFRhcFJlY29nbml6ZXIsIFJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFBpbmNoUmVjb2duaXplclxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGV2ZW50OiAndGFwJyxcbiAgICAgICAgcG9pbnRlcnM6IDEsXG4gICAgICAgIHRhcHM6IDEsXG4gICAgICAgIGludGVydmFsOiAzMDAsIC8vIG1heCB0aW1lIGJldHdlZW4gdGhlIG11bHRpLXRhcCB0YXBzXG4gICAgICAgIHRpbWU6IDI1MCwgLy8gbWF4IHRpbWUgb2YgdGhlIHBvaW50ZXIgdG8gYmUgZG93biAobGlrZSBmaW5nZXIgb24gdGhlIHNjcmVlbilcbiAgICAgICAgdGhyZXNob2xkOiA5LCAvLyBhIG1pbmltYWwgbW92ZW1lbnQgaXMgb2ssIGJ1dCBrZWVwIGl0IGxvd1xuICAgICAgICBwb3NUaHJlc2hvbGQ6IDEwIC8vIGEgbXVsdGktdGFwIGNhbiBiZSBhIGJpdCBvZmYgdGhlIGluaXRpYWwgcG9zaXRpb25cbiAgICB9LFxuXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1RPVUNIX0FDVElPTl9NQU5JUFVMQVRJT05dO1xuICAgIH0sXG5cbiAgICBwcm9jZXNzOiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgICB2YXIgdmFsaWRQb2ludGVycyA9IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA9PT0gb3B0aW9ucy5wb2ludGVycztcbiAgICAgICAgdmFyIHZhbGlkTW92ZW1lbnQgPSBpbnB1dC5kaXN0YW5jZSA8IG9wdGlvbnMudGhyZXNob2xkO1xuICAgICAgICB2YXIgdmFsaWRUb3VjaFRpbWUgPSBpbnB1dC5kZWx0YVRpbWUgPCBvcHRpb25zLnRpbWU7XG5cbiAgICAgICAgdGhpcy5yZXNldCgpO1xuXG4gICAgICAgIGlmICgoaW5wdXQuZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQpICYmICh0aGlzLmNvdW50ID09PSAwKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmFpbFRpbWVvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdlIG9ubHkgYWxsb3cgbGl0dGxlIG1vdmVtZW50XG4gICAgICAgIC8vIGFuZCB3ZSd2ZSByZWFjaGVkIGFuIGVuZCBldmVudCwgc28gYSB0YXAgaXMgcG9zc2libGVcbiAgICAgICAgaWYgKHZhbGlkTW92ZW1lbnQgJiYgdmFsaWRUb3VjaFRpbWUgJiYgdmFsaWRQb2ludGVycykge1xuICAgICAgICAgICAgaWYgKGlucHV0LmV2ZW50VHlwZSAhPSBJTlBVVF9FTkQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mYWlsVGltZW91dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdmFsaWRJbnRlcnZhbCA9IHRoaXMucFRpbWUgPyAoaW5wdXQudGltZVN0YW1wIC0gdGhpcy5wVGltZSA8IG9wdGlvbnMuaW50ZXJ2YWwpIDogdHJ1ZTtcbiAgICAgICAgICAgIHZhciB2YWxpZE11bHRpVGFwID0gIXRoaXMucENlbnRlciB8fCBnZXREaXN0YW5jZSh0aGlzLnBDZW50ZXIsIGlucHV0LmNlbnRlcikgPCBvcHRpb25zLnBvc1RocmVzaG9sZDtcblxuICAgICAgICAgICAgdGhpcy5wVGltZSA9IGlucHV0LnRpbWVTdGFtcDtcbiAgICAgICAgICAgIHRoaXMucENlbnRlciA9IGlucHV0LmNlbnRlcjtcblxuICAgICAgICAgICAgaWYgKCF2YWxpZE11bHRpVGFwIHx8ICF2YWxpZEludGVydmFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudCA9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY291bnQgKz0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5faW5wdXQgPSBpbnB1dDtcblxuICAgICAgICAgICAgLy8gaWYgdGFwIGNvdW50IG1hdGNoZXMgd2UgaGF2ZSByZWNvZ25pemVkIGl0LFxuICAgICAgICAgICAgLy8gZWxzZSBpdCBoYXMgYmVnYW4gcmVjb2duaXppbmcuLi5cbiAgICAgICAgICAgIHZhciB0YXBDb3VudCA9IHRoaXMuY291bnQgJSBvcHRpb25zLnRhcHM7XG4gICAgICAgICAgICBpZiAodGFwQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBubyBmYWlsaW5nIHJlcXVpcmVtZW50cywgaW1tZWRpYXRlbHkgdHJpZ2dlciB0aGUgdGFwIGV2ZW50XG4gICAgICAgICAgICAgICAgLy8gb3Igd2FpdCBhcyBsb25nIGFzIHRoZSBtdWx0aXRhcCBpbnRlcnZhbCB0byB0cmlnZ2VyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmhhc1JlcXVpcmVGYWlsdXJlcygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTVEFURV9SRUNPR05JWkVEO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dENvbnRleHQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfUkVDT0dOSVpFRDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJ5RW1pdCgpO1xuICAgICAgICAgICAgICAgICAgICB9LCBvcHRpb25zLmludGVydmFsLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNUQVRFX0JFR0FOO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU1RBVEVfRkFJTEVEO1xuICAgIH0sXG5cbiAgICBmYWlsVGltZW91dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dENvbnRleHQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfRkFJTEVEO1xuICAgICAgICB9LCB0aGlzLm9wdGlvbnMuaW50ZXJ2YWwsIHRoaXMpO1xuICAgICAgICByZXR1cm4gU1RBVEVfRkFJTEVEO1xuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gICAgfSxcblxuICAgIGVtaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PSBTVEFURV9SRUNPR05JWkVEKSB7XG4gICAgICAgICAgICB0aGlzLl9pbnB1dC50YXBDb3VudCA9IHRoaXMuY291bnQ7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsIHRoaXMuX2lucHV0KTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vKipcbiAqIFNpbXBsZSB3YXkgdG8gY3JlYXRlIGEgbWFuYWdlciB3aXRoIGEgZGVmYXVsdCBzZXQgb2YgcmVjb2duaXplcnMuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gSGFtbWVyKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBvcHRpb25zLnJlY29nbml6ZXJzID0gaWZVbmRlZmluZWQob3B0aW9ucy5yZWNvZ25pemVycywgSGFtbWVyLmRlZmF1bHRzLnByZXNldCk7XG4gICAgcmV0dXJuIG5ldyBNYW5hZ2VyKGVsZW1lbnQsIG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIEBjb25zdCB7c3RyaW5nfVxuICovXG5IYW1tZXIuVkVSU0lPTiA9ICcyLjAuNyc7XG5cbi8qKlxuICogZGVmYXVsdCBzZXR0aW5nc1xuICogQG5hbWVzcGFjZVxuICovXG5IYW1tZXIuZGVmYXVsdHMgPSB7XG4gICAgLyoqXG4gICAgICogc2V0IGlmIERPTSBldmVudHMgYXJlIGJlaW5nIHRyaWdnZXJlZC5cbiAgICAgKiBCdXQgdGhpcyBpcyBzbG93ZXIgYW5kIHVudXNlZCBieSBzaW1wbGUgaW1wbGVtZW50YXRpb25zLCBzbyBkaXNhYmxlZCBieSBkZWZhdWx0LlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgZG9tRXZlbnRzOiBmYWxzZSxcblxuICAgIC8qKlxuICAgICAqIFRoZSB2YWx1ZSBmb3IgdGhlIHRvdWNoQWN0aW9uIHByb3BlcnR5L2ZhbGxiYWNrLlxuICAgICAqIFdoZW4gc2V0IHRvIGBjb21wdXRlYCBpdCB3aWxsIG1hZ2ljYWxseSBzZXQgdGhlIGNvcnJlY3QgdmFsdWUgYmFzZWQgb24gdGhlIGFkZGVkIHJlY29nbml6ZXJzLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgY29tcHV0ZVxuICAgICAqL1xuICAgIHRvdWNoQWN0aW9uOiBUT1VDSF9BQ1RJT05fQ09NUFVURSxcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICBlbmFibGU6IHRydWUsXG5cbiAgICAvKipcbiAgICAgKiBFWFBFUklNRU5UQUwgRkVBVFVSRSAtLSBjYW4gYmUgcmVtb3ZlZC9jaGFuZ2VkXG4gICAgICogQ2hhbmdlIHRoZSBwYXJlbnQgaW5wdXQgdGFyZ2V0IGVsZW1lbnQuXG4gICAgICogSWYgTnVsbCwgdGhlbiBpdCBpcyBiZWluZyBzZXQgdGhlIHRvIG1haW4gZWxlbWVudC5cbiAgICAgKiBAdHlwZSB7TnVsbHxFdmVudFRhcmdldH1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICovXG4gICAgaW5wdXRUYXJnZXQ6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBmb3JjZSBhbiBpbnB1dCBjbGFzc1xuICAgICAqIEB0eXBlIHtOdWxsfEZ1bmN0aW9ufVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKi9cbiAgICBpbnB1dENsYXNzOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogRGVmYXVsdCByZWNvZ25pemVyIHNldHVwIHdoZW4gY2FsbGluZyBgSGFtbWVyKClgXG4gICAgICogV2hlbiBjcmVhdGluZyBhIG5ldyBNYW5hZ2VyIHRoZXNlIHdpbGwgYmUgc2tpcHBlZC5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgcHJlc2V0OiBbXG4gICAgICAgIC8vIFJlY29nbml6ZXJDbGFzcywgb3B0aW9ucywgW3JlY29nbml6ZVdpdGgsIC4uLl0sIFtyZXF1aXJlRmFpbHVyZSwgLi4uXVxuICAgICAgICBbUm90YXRlUmVjb2duaXplciwge2VuYWJsZTogZmFsc2V9XSxcbiAgICAgICAgW1BpbmNoUmVjb2duaXplciwge2VuYWJsZTogZmFsc2V9LCBbJ3JvdGF0ZSddXSxcbiAgICAgICAgW1N3aXBlUmVjb2duaXplciwge2RpcmVjdGlvbjogRElSRUNUSU9OX0hPUklaT05UQUx9XSxcbiAgICAgICAgW1BhblJlY29nbml6ZXIsIHtkaXJlY3Rpb246IERJUkVDVElPTl9IT1JJWk9OVEFMfSwgWydzd2lwZSddXSxcbiAgICAgICAgW1RhcFJlY29nbml6ZXJdLFxuICAgICAgICBbVGFwUmVjb2duaXplciwge2V2ZW50OiAnZG91YmxldGFwJywgdGFwczogMn0sIFsndGFwJ11dLFxuICAgICAgICBbUHJlc3NSZWNvZ25pemVyXVxuICAgIF0sXG5cbiAgICAvKipcbiAgICAgKiBTb21lIENTUyBwcm9wZXJ0aWVzIGNhbiBiZSB1c2VkIHRvIGltcHJvdmUgdGhlIHdvcmtpbmcgb2YgSGFtbWVyLlxuICAgICAqIEFkZCB0aGVtIHRvIHRoaXMgbWV0aG9kIGFuZCB0aGV5IHdpbGwgYmUgc2V0IHdoZW4gY3JlYXRpbmcgYSBuZXcgTWFuYWdlci5cbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICovXG4gICAgY3NzUHJvcHM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc2FibGVzIHRleHQgc2VsZWN0aW9uIHRvIGltcHJvdmUgdGhlIGRyYWdnaW5nIGdlc3R1cmUuIE1haW5seSBmb3IgZGVza3RvcCBicm93c2Vycy5cbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICogQGRlZmF1bHQgJ25vbmUnXG4gICAgICAgICAqL1xuICAgICAgICB1c2VyU2VsZWN0OiAnbm9uZScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc2FibGUgdGhlIFdpbmRvd3MgUGhvbmUgZ3JpcHBlcnMgd2hlbiBwcmVzc2luZyBhbiBlbGVtZW50LlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAnbm9uZSdcbiAgICAgICAgICovXG4gICAgICAgIHRvdWNoU2VsZWN0OiAnbm9uZScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc2FibGVzIHRoZSBkZWZhdWx0IGNhbGxvdXQgc2hvd24gd2hlbiB5b3UgdG91Y2ggYW5kIGhvbGQgYSB0b3VjaCB0YXJnZXQuXG4gICAgICAgICAqIE9uIGlPUywgd2hlbiB5b3UgdG91Y2ggYW5kIGhvbGQgYSB0b3VjaCB0YXJnZXQgc3VjaCBhcyBhIGxpbmssIFNhZmFyaSBkaXNwbGF5c1xuICAgICAgICAgKiBhIGNhbGxvdXQgY29udGFpbmluZyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgbGluay4gVGhpcyBwcm9wZXJ0eSBhbGxvd3MgeW91IHRvIGRpc2FibGUgdGhhdCBjYWxsb3V0LlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAnbm9uZSdcbiAgICAgICAgICovXG4gICAgICAgIHRvdWNoQ2FsbG91dDogJ25vbmUnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTcGVjaWZpZXMgd2hldGhlciB6b29taW5nIGlzIGVuYWJsZWQuIFVzZWQgYnkgSUUxMD5cbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICogQGRlZmF1bHQgJ25vbmUnXG4gICAgICAgICAqL1xuICAgICAgICBjb250ZW50Wm9vbWluZzogJ25vbmUnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTcGVjaWZpZXMgdGhhdCBhbiBlbnRpcmUgZWxlbWVudCBzaG91bGQgYmUgZHJhZ2dhYmxlIGluc3RlYWQgb2YgaXRzIGNvbnRlbnRzLiBNYWlubHkgZm9yIGRlc2t0b3AgYnJvd3NlcnMuXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBkZWZhdWx0ICdub25lJ1xuICAgICAgICAgKi9cbiAgICAgICAgdXNlckRyYWc6ICdub25lJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3ZlcnJpZGVzIHRoZSBoaWdobGlnaHQgY29sb3Igc2hvd24gd2hlbiB0aGUgdXNlciB0YXBzIGEgbGluayBvciBhIEphdmFTY3JpcHRcbiAgICAgICAgICogY2xpY2thYmxlIGVsZW1lbnQgaW4gaU9TLiBUaGlzIHByb3BlcnR5IG9iZXlzIHRoZSBhbHBoYSB2YWx1ZSwgaWYgc3BlY2lmaWVkLlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAncmdiYSgwLDAsMCwwKSdcbiAgICAgICAgICovXG4gICAgICAgIHRhcEhpZ2hsaWdodENvbG9yOiAncmdiYSgwLDAsMCwwKSdcbiAgICB9XG59O1xuXG52YXIgU1RPUCA9IDE7XG52YXIgRk9SQ0VEX1NUT1AgPSAyO1xuXG4vKipcbiAqIE1hbmFnZXJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBNYW5hZ2VyKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBhc3NpZ24oe30sIEhhbW1lci5kZWZhdWx0cywgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICB0aGlzLm9wdGlvbnMuaW5wdXRUYXJnZXQgPSB0aGlzLm9wdGlvbnMuaW5wdXRUYXJnZXQgfHwgZWxlbWVudDtcblxuICAgIHRoaXMuaGFuZGxlcnMgPSB7fTtcbiAgICB0aGlzLnNlc3Npb24gPSB7fTtcbiAgICB0aGlzLnJlY29nbml6ZXJzID0gW107XG4gICAgdGhpcy5vbGRDc3NQcm9wcyA9IHt9O1xuXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLmlucHV0ID0gY3JlYXRlSW5wdXRJbnN0YW5jZSh0aGlzKTtcbiAgICB0aGlzLnRvdWNoQWN0aW9uID0gbmV3IFRvdWNoQWN0aW9uKHRoaXMsIHRoaXMub3B0aW9ucy50b3VjaEFjdGlvbik7XG5cbiAgICB0b2dnbGVDc3NQcm9wcyh0aGlzLCB0cnVlKTtcblxuICAgIGVhY2godGhpcy5vcHRpb25zLnJlY29nbml6ZXJzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHZhciByZWNvZ25pemVyID0gdGhpcy5hZGQobmV3IChpdGVtWzBdKShpdGVtWzFdKSk7XG4gICAgICAgIGl0ZW1bMl0gJiYgcmVjb2duaXplci5yZWNvZ25pemVXaXRoKGl0ZW1bMl0pO1xuICAgICAgICBpdGVtWzNdICYmIHJlY29nbml6ZXIucmVxdWlyZUZhaWx1cmUoaXRlbVszXSk7XG4gICAgfSwgdGhpcyk7XG59XG5cbk1hbmFnZXIucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIHNldCBvcHRpb25zXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgKiBAcmV0dXJucyB7TWFuYWdlcn1cbiAgICAgKi9cbiAgICBzZXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgICAgLy8gT3B0aW9ucyB0aGF0IG5lZWQgYSBsaXR0bGUgbW9yZSBzZXR1cFxuICAgICAgICBpZiAob3B0aW9ucy50b3VjaEFjdGlvbikge1xuICAgICAgICAgICAgdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5pbnB1dFRhcmdldCkge1xuICAgICAgICAgICAgLy8gQ2xlYW4gdXAgZXhpc3RpbmcgZXZlbnQgbGlzdGVuZXJzIGFuZCByZWluaXRpYWxpemVcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dC50YXJnZXQgPSBvcHRpb25zLmlucHV0VGFyZ2V0O1xuICAgICAgICAgICAgdGhpcy5pbnB1dC5pbml0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHN0b3AgcmVjb2duaXppbmcgZm9yIHRoaXMgc2Vzc2lvbi5cbiAgICAgKiBUaGlzIHNlc3Npb24gd2lsbCBiZSBkaXNjYXJkZWQsIHdoZW4gYSBuZXcgW2lucHV0XXN0YXJ0IGV2ZW50IGlzIGZpcmVkLlxuICAgICAqIFdoZW4gZm9yY2VkLCB0aGUgcmVjb2duaXplciBjeWNsZSBpcyBzdG9wcGVkIGltbWVkaWF0ZWx5LlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2ZvcmNlXVxuICAgICAqL1xuICAgIHN0b3A6IGZ1bmN0aW9uKGZvcmNlKSB7XG4gICAgICAgIHRoaXMuc2Vzc2lvbi5zdG9wcGVkID0gZm9yY2UgPyBGT1JDRURfU1RPUCA6IFNUT1A7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJ1biB0aGUgcmVjb2duaXplcnMhXG4gICAgICogY2FsbGVkIGJ5IHRoZSBpbnB1dEhhbmRsZXIgZnVuY3Rpb24gb24gZXZlcnkgbW92ZW1lbnQgb2YgdGhlIHBvaW50ZXJzICh0b3VjaGVzKVxuICAgICAqIGl0IHdhbGtzIHRocm91Z2ggYWxsIHRoZSByZWNvZ25pemVycyBhbmQgdHJpZXMgdG8gZGV0ZWN0IHRoZSBnZXN0dXJlIHRoYXQgaXMgYmVpbmcgbWFkZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcbiAgICAgKi9cbiAgICByZWNvZ25pemU6IGZ1bmN0aW9uKGlucHV0RGF0YSkge1xuICAgICAgICB2YXIgc2Vzc2lvbiA9IHRoaXMuc2Vzc2lvbjtcbiAgICAgICAgaWYgKHNlc3Npb24uc3RvcHBlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcnVuIHRoZSB0b3VjaC1hY3Rpb24gcG9seWZpbGxcbiAgICAgICAgdGhpcy50b3VjaEFjdGlvbi5wcmV2ZW50RGVmYXVsdHMoaW5wdXREYXRhKTtcblxuICAgICAgICB2YXIgcmVjb2duaXplcjtcbiAgICAgICAgdmFyIHJlY29nbml6ZXJzID0gdGhpcy5yZWNvZ25pemVycztcblxuICAgICAgICAvLyB0aGlzIGhvbGRzIHRoZSByZWNvZ25pemVyIHRoYXQgaXMgYmVpbmcgcmVjb2duaXplZC5cbiAgICAgICAgLy8gc28gdGhlIHJlY29nbml6ZXIncyBzdGF0ZSBuZWVkcyB0byBiZSBCRUdBTiwgQ0hBTkdFRCwgRU5ERUQgb3IgUkVDT0dOSVpFRFxuICAgICAgICAvLyBpZiBubyByZWNvZ25pemVyIGlzIGRldGVjdGluZyBhIHRoaW5nLCBpdCBpcyBzZXQgdG8gYG51bGxgXG4gICAgICAgIHZhciBjdXJSZWNvZ25pemVyID0gc2Vzc2lvbi5jdXJSZWNvZ25pemVyO1xuXG4gICAgICAgIC8vIHJlc2V0IHdoZW4gdGhlIGxhc3QgcmVjb2duaXplciBpcyByZWNvZ25pemVkXG4gICAgICAgIC8vIG9yIHdoZW4gd2UncmUgaW4gYSBuZXcgc2Vzc2lvblxuICAgICAgICBpZiAoIWN1clJlY29nbml6ZXIgfHwgKGN1clJlY29nbml6ZXIgJiYgY3VyUmVjb2duaXplci5zdGF0ZSAmIFNUQVRFX1JFQ09HTklaRUQpKSB7XG4gICAgICAgICAgICBjdXJSZWNvZ25pemVyID0gc2Vzc2lvbi5jdXJSZWNvZ25pemVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCByZWNvZ25pemVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlY29nbml6ZXIgPSByZWNvZ25pemVyc1tpXTtcblxuICAgICAgICAgICAgLy8gZmluZCBvdXQgaWYgd2UgYXJlIGFsbG93ZWQgdHJ5IHRvIHJlY29nbml6ZSB0aGUgaW5wdXQgZm9yIHRoaXMgb25lLlxuICAgICAgICAgICAgLy8gMS4gICBhbGxvdyBpZiB0aGUgc2Vzc2lvbiBpcyBOT1QgZm9yY2VkIHN0b3BwZWQgKHNlZSB0aGUgLnN0b3AoKSBtZXRob2QpXG4gICAgICAgICAgICAvLyAyLiAgIGFsbG93IGlmIHdlIHN0aWxsIGhhdmVuJ3QgcmVjb2duaXplZCBhIGdlc3R1cmUgaW4gdGhpcyBzZXNzaW9uLCBvciB0aGUgdGhpcyByZWNvZ25pemVyIGlzIHRoZSBvbmVcbiAgICAgICAgICAgIC8vICAgICAgdGhhdCBpcyBiZWluZyByZWNvZ25pemVkLlxuICAgICAgICAgICAgLy8gMy4gICBhbGxvdyBpZiB0aGUgcmVjb2duaXplciBpcyBhbGxvd2VkIHRvIHJ1biBzaW11bHRhbmVvdXMgd2l0aCB0aGUgY3VycmVudCByZWNvZ25pemVkIHJlY29nbml6ZXIuXG4gICAgICAgICAgICAvLyAgICAgIHRoaXMgY2FuIGJlIHNldHVwIHdpdGggdGhlIGByZWNvZ25pemVXaXRoKClgIG1ldGhvZCBvbiB0aGUgcmVjb2duaXplci5cbiAgICAgICAgICAgIGlmIChzZXNzaW9uLnN0b3BwZWQgIT09IEZPUkNFRF9TVE9QICYmICggLy8gMVxuICAgICAgICAgICAgICAgICAgICAhY3VyUmVjb2duaXplciB8fCByZWNvZ25pemVyID09IGN1clJlY29nbml6ZXIgfHwgLy8gMlxuICAgICAgICAgICAgICAgICAgICByZWNvZ25pemVyLmNhblJlY29nbml6ZVdpdGgoY3VyUmVjb2duaXplcikpKSB7IC8vIDNcbiAgICAgICAgICAgICAgICByZWNvZ25pemVyLnJlY29nbml6ZShpbnB1dERhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWNvZ25pemVyLnJlc2V0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZSByZWNvZ25pemVyIGhhcyBiZWVuIHJlY29nbml6aW5nIHRoZSBpbnB1dCBhcyBhIHZhbGlkIGdlc3R1cmUsIHdlIHdhbnQgdG8gc3RvcmUgdGhpcyBvbmUgYXMgdGhlXG4gICAgICAgICAgICAvLyBjdXJyZW50IGFjdGl2ZSByZWNvZ25pemVyLiBidXQgb25seSBpZiB3ZSBkb24ndCBhbHJlYWR5IGhhdmUgYW4gYWN0aXZlIHJlY29nbml6ZXJcbiAgICAgICAgICAgIGlmICghY3VyUmVjb2duaXplciAmJiByZWNvZ25pemVyLnN0YXRlICYgKFNUQVRFX0JFR0FOIHwgU1RBVEVfQ0hBTkdFRCB8IFNUQVRFX0VOREVEKSkge1xuICAgICAgICAgICAgICAgIGN1clJlY29nbml6ZXIgPSBzZXNzaW9uLmN1clJlY29nbml6ZXIgPSByZWNvZ25pemVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGdldCBhIHJlY29nbml6ZXIgYnkgaXRzIGV2ZW50IG5hbWUuXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfFN0cmluZ30gcmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfE51bGx9XG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbihyZWNvZ25pemVyKSB7XG4gICAgICAgIGlmIChyZWNvZ25pemVyIGluc3RhbmNlb2YgUmVjb2duaXplcikge1xuICAgICAgICAgICAgcmV0dXJuIHJlY29nbml6ZXI7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVjb2duaXplcnMgPSB0aGlzLnJlY29nbml6ZXJzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlY29nbml6ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmVjb2duaXplcnNbaV0ub3B0aW9ucy5ldmVudCA9PSByZWNvZ25pemVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlY29nbml6ZXJzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBhZGQgYSByZWNvZ25pemVyIHRvIHRoZSBtYW5hZ2VyXG4gICAgICogZXhpc3RpbmcgcmVjb2duaXplcnMgd2l0aCB0aGUgc2FtZSBldmVudCBuYW1lIHdpbGwgYmUgcmVtb3ZlZFxuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcn0gcmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfE1hbmFnZXJ9XG4gICAgICovXG4gICAgYWRkOiBmdW5jdGlvbihyZWNvZ25pemVyKSB7XG4gICAgICAgIGlmIChpbnZva2VBcnJheUFyZyhyZWNvZ25pemVyLCAnYWRkJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGV4aXN0aW5nXG4gICAgICAgIHZhciBleGlzdGluZyA9IHRoaXMuZ2V0KHJlY29nbml6ZXIub3B0aW9ucy5ldmVudCk7XG4gICAgICAgIGlmIChleGlzdGluZykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUoZXhpc3RpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWNvZ25pemVycy5wdXNoKHJlY29nbml6ZXIpO1xuICAgICAgICByZWNvZ25pemVyLm1hbmFnZXIgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMudG91Y2hBY3Rpb24udXBkYXRlKCk7XG4gICAgICAgIHJldHVybiByZWNvZ25pemVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiByZW1vdmUgYSByZWNvZ25pemVyIGJ5IG5hbWUgb3IgaW5zdGFuY2VcbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ8U3RyaW5nfSByZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge01hbmFnZXJ9XG4gICAgICovXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihyZWNvZ25pemVyKSB7XG4gICAgICAgIGlmIChpbnZva2VBcnJheUFyZyhyZWNvZ25pemVyLCAncmVtb3ZlJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVjb2duaXplciA9IHRoaXMuZ2V0KHJlY29nbml6ZXIpO1xuXG4gICAgICAgIC8vIGxldCdzIG1ha2Ugc3VyZSB0aGlzIHJlY29nbml6ZXIgZXhpc3RzXG4gICAgICAgIGlmIChyZWNvZ25pemVyKSB7XG4gICAgICAgICAgICB2YXIgcmVjb2duaXplcnMgPSB0aGlzLnJlY29nbml6ZXJzO1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gaW5BcnJheShyZWNvZ25pemVycywgcmVjb2duaXplcik7XG5cbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZWNvZ25pemVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMudG91Y2hBY3Rpb24udXBkYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogYmluZCBldmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudHNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXG4gICAgICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gdGhpc1xuICAgICAqL1xuICAgIG9uOiBmdW5jdGlvbihldmVudHMsIGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhbmRsZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5oYW5kbGVycztcbiAgICAgICAgZWFjaChzcGxpdFN0cihldmVudHMpLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaGFuZGxlcnNbZXZlbnRdID0gaGFuZGxlcnNbZXZlbnRdIHx8IFtdO1xuICAgICAgICAgICAgaGFuZGxlcnNbZXZlbnRdLnB1c2goaGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogdW5iaW5kIGV2ZW50LCBsZWF2ZSBlbWl0IGJsYW5rIHRvIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRzXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2hhbmRsZXJdXG4gICAgICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gdGhpc1xuICAgICAqL1xuICAgIG9mZjogZnVuY3Rpb24oZXZlbnRzLCBoYW5kbGVyKSB7XG4gICAgICAgIGlmIChldmVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5oYW5kbGVycztcbiAgICAgICAgZWFjaChzcGxpdFN0cihldmVudHMpLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKCFoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGhhbmRsZXJzW2V2ZW50XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcnNbZXZlbnRdICYmIGhhbmRsZXJzW2V2ZW50XS5zcGxpY2UoaW5BcnJheShoYW5kbGVyc1tldmVudF0sIGhhbmRsZXIpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBlbWl0IGV2ZW50IHRvIHRoZSBsaXN0ZW5lcnNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqL1xuICAgIGVtaXQ6IGZ1bmN0aW9uKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIC8vIHdlIGFsc28gd2FudCB0byB0cmlnZ2VyIGRvbSBldmVudHNcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kb21FdmVudHMpIHtcbiAgICAgICAgICAgIHRyaWdnZXJEb21FdmVudChldmVudCwgZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBubyBoYW5kbGVycywgc28gc2tpcCBpdCBhbGxcbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5oYW5kbGVyc1tldmVudF0gJiYgdGhpcy5oYW5kbGVyc1tldmVudF0uc2xpY2UoKTtcbiAgICAgICAgaWYgKCFoYW5kbGVycyB8fCAhaGFuZGxlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBkYXRhLnR5cGUgPSBldmVudDtcbiAgICAgICAgZGF0YS5wcmV2ZW50RGVmYXVsdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZGF0YS5zcmNFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBoYW5kbGVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGhhbmRsZXJzW2ldKGRhdGEpO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGRlc3Ryb3kgdGhlIG1hbmFnZXIgYW5kIHVuYmluZHMgYWxsIGV2ZW50c1xuICAgICAqIGl0IGRvZXNuJ3QgdW5iaW5kIGRvbSBldmVudHMsIHRoYXQgaXMgdGhlIHVzZXIgb3duIHJlc3BvbnNpYmlsaXR5XG4gICAgICovXG4gICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCAmJiB0b2dnbGVDc3NQcm9wcyh0aGlzLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IHt9O1xuICAgICAgICB0aGlzLnNlc3Npb24gPSB7fTtcbiAgICAgICAgdGhpcy5pbnB1dC5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XG4gICAgfVxufTtcblxuLyoqXG4gKiBhZGQvcmVtb3ZlIHRoZSBjc3MgcHJvcGVydGllcyBhcyBkZWZpbmVkIGluIG1hbmFnZXIub3B0aW9ucy5jc3NQcm9wc1xuICogQHBhcmFtIHtNYW5hZ2VyfSBtYW5hZ2VyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGFkZFxuICovXG5mdW5jdGlvbiB0b2dnbGVDc3NQcm9wcyhtYW5hZ2VyLCBhZGQpIHtcbiAgICB2YXIgZWxlbWVudCA9IG1hbmFnZXIuZWxlbWVudDtcbiAgICBpZiAoIWVsZW1lbnQuc3R5bGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcHJvcDtcbiAgICBlYWNoKG1hbmFnZXIub3B0aW9ucy5jc3NQcm9wcywgZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgcHJvcCA9IHByZWZpeGVkKGVsZW1lbnQuc3R5bGUsIG5hbWUpO1xuICAgICAgICBpZiAoYWRkKSB7XG4gICAgICAgICAgICBtYW5hZ2VyLm9sZENzc1Byb3BzW3Byb3BdID0gZWxlbWVudC5zdHlsZVtwcm9wXTtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSBtYW5hZ2VyLm9sZENzc1Byb3BzW3Byb3BdIHx8ICcnO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFhZGQpIHtcbiAgICAgICAgbWFuYWdlci5vbGRDc3NQcm9wcyA9IHt9O1xuICAgIH1cbn1cblxuLyoqXG4gKiB0cmlnZ2VyIGRvbSBldmVudFxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICovXG5mdW5jdGlvbiB0cmlnZ2VyRG9tRXZlbnQoZXZlbnQsIGRhdGEpIHtcbiAgICB2YXIgZ2VzdHVyZUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgZ2VzdHVyZUV2ZW50LmluaXRFdmVudChldmVudCwgdHJ1ZSwgdHJ1ZSk7XG4gICAgZ2VzdHVyZUV2ZW50Lmdlc3R1cmUgPSBkYXRhO1xuICAgIGRhdGEudGFyZ2V0LmRpc3BhdGNoRXZlbnQoZ2VzdHVyZUV2ZW50KTtcbn1cblxuYXNzaWduKEhhbW1lciwge1xuICAgIElOUFVUX1NUQVJUOiBJTlBVVF9TVEFSVCxcbiAgICBJTlBVVF9NT1ZFOiBJTlBVVF9NT1ZFLFxuICAgIElOUFVUX0VORDogSU5QVVRfRU5ELFxuICAgIElOUFVUX0NBTkNFTDogSU5QVVRfQ0FOQ0VMLFxuXG4gICAgU1RBVEVfUE9TU0lCTEU6IFNUQVRFX1BPU1NJQkxFLFxuICAgIFNUQVRFX0JFR0FOOiBTVEFURV9CRUdBTixcbiAgICBTVEFURV9DSEFOR0VEOiBTVEFURV9DSEFOR0VELFxuICAgIFNUQVRFX0VOREVEOiBTVEFURV9FTkRFRCxcbiAgICBTVEFURV9SRUNPR05JWkVEOiBTVEFURV9SRUNPR05JWkVELFxuICAgIFNUQVRFX0NBTkNFTExFRDogU1RBVEVfQ0FOQ0VMTEVELFxuICAgIFNUQVRFX0ZBSUxFRDogU1RBVEVfRkFJTEVELFxuXG4gICAgRElSRUNUSU9OX05PTkU6IERJUkVDVElPTl9OT05FLFxuICAgIERJUkVDVElPTl9MRUZUOiBESVJFQ1RJT05fTEVGVCxcbiAgICBESVJFQ1RJT05fUklHSFQ6IERJUkVDVElPTl9SSUdIVCxcbiAgICBESVJFQ1RJT05fVVA6IERJUkVDVElPTl9VUCxcbiAgICBESVJFQ1RJT05fRE9XTjogRElSRUNUSU9OX0RPV04sXG4gICAgRElSRUNUSU9OX0hPUklaT05UQUw6IERJUkVDVElPTl9IT1JJWk9OVEFMLFxuICAgIERJUkVDVElPTl9WRVJUSUNBTDogRElSRUNUSU9OX1ZFUlRJQ0FMLFxuICAgIERJUkVDVElPTl9BTEw6IERJUkVDVElPTl9BTEwsXG5cbiAgICBNYW5hZ2VyOiBNYW5hZ2VyLFxuICAgIElucHV0OiBJbnB1dCxcbiAgICBUb3VjaEFjdGlvbjogVG91Y2hBY3Rpb24sXG5cbiAgICBUb3VjaElucHV0OiBUb3VjaElucHV0LFxuICAgIE1vdXNlSW5wdXQ6IE1vdXNlSW5wdXQsXG4gICAgUG9pbnRlckV2ZW50SW5wdXQ6IFBvaW50ZXJFdmVudElucHV0LFxuICAgIFRvdWNoTW91c2VJbnB1dDogVG91Y2hNb3VzZUlucHV0LFxuICAgIFNpbmdsZVRvdWNoSW5wdXQ6IFNpbmdsZVRvdWNoSW5wdXQsXG5cbiAgICBSZWNvZ25pemVyOiBSZWNvZ25pemVyLFxuICAgIEF0dHJSZWNvZ25pemVyOiBBdHRyUmVjb2duaXplcixcbiAgICBUYXA6IFRhcFJlY29nbml6ZXIsXG4gICAgUGFuOiBQYW5SZWNvZ25pemVyLFxuICAgIFN3aXBlOiBTd2lwZVJlY29nbml6ZXIsXG4gICAgUGluY2g6IFBpbmNoUmVjb2duaXplcixcbiAgICBSb3RhdGU6IFJvdGF0ZVJlY29nbml6ZXIsXG4gICAgUHJlc3M6IFByZXNzUmVjb2duaXplcixcblxuICAgIG9uOiBhZGRFdmVudExpc3RlbmVycyxcbiAgICBvZmY6IHJlbW92ZUV2ZW50TGlzdGVuZXJzLFxuICAgIGVhY2g6IGVhY2gsXG4gICAgbWVyZ2U6IG1lcmdlLFxuICAgIGV4dGVuZDogZXh0ZW5kLFxuICAgIGFzc2lnbjogYXNzaWduLFxuICAgIGluaGVyaXQ6IGluaGVyaXQsXG4gICAgYmluZEZuOiBiaW5kRm4sXG4gICAgcHJlZml4ZWQ6IHByZWZpeGVkXG59KTtcblxuLy8gdGhpcyBwcmV2ZW50cyBlcnJvcnMgd2hlbiBIYW1tZXIgaXMgbG9hZGVkIGluIHRoZSBwcmVzZW5jZSBvZiBhbiBBTURcbi8vICBzdHlsZSBsb2FkZXIgYnV0IGJ5IHNjcmlwdCB0YWcsIG5vdCBieSB0aGUgbG9hZGVyLlxudmFyIGZyZWVHbG9iYWwgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHt9KSk7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuZnJlZUdsb2JhbC5IYW1tZXIgPSBIYW1tZXI7XG5cbmlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBIYW1tZXI7XG4gICAgfSk7XG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEhhbW1lcjtcbn0gZWxzZSB7XG4gICAgd2luZG93W2V4cG9ydE5hbWVdID0gSGFtbWVyO1xufVxuXG59KSh3aW5kb3csIGRvY3VtZW50LCAnSGFtbWVyJyk7XG4iXSwibmFtZXMiOlsiZSIsInVuZGVmaW5lZCIsImRlZmluZSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxLQUFLLEdBQUcsNEVBQTRFLENBQUM7QUFDekYsSUFBSSxpQkFBaUIsR0FBRyxXQUFXLENBQUM7QUFDcEMsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQztBQUMzQixJQUFJLFVBQVUsR0FBRyxRQUFR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Q0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxrQkFBa0IsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPQSxLQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsY0FBYyxDQUFDLEdBQUcsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBT0EsS0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLGtCQUFrQixDQUFDLEdBQUcsRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPQSxLQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUE4K0MsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQUFBeU4sU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxhQUFhLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxBQUFHLElBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBNmYsQ0FBQyxDQUFDLENB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LENBQUMsQ0FBQztBQUN4QixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQyxJQUFJLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2xELENBQUM7QUFDRCxBQUFPLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRTtBQUM5QyxJQUFJLElBQUksR0FBRyxHQUFHO0FBQ2QsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDeEMsS0FBSyxDQUFDO0FBQ04sSUFBSSxJQUFJLFVBQVU7QUFDbEIsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0MsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0MsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM3QyxRQUFRLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEUsS0FBSztBQUNMLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFDRCxBQUFPLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUU7QUFDbEQsSUFBSSxJQUFJLEdBQUcsR0FBRztBQUNkLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLFFBQVEsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLEtBQUssQ0FBQztBQUNOLElBQUksSUFBSSxVQUFVO0FBQ2xCLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDN0MsUUFBUSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekYsS0FBSztBQUNMLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFDRCxBQVNPLFNB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Q0FBQyxDQUFDLEVBQUUsQ0FBQztBQUN6RCxLQUFLO0FBQ0wsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEMsSUFBSSxJQUFJLEtBQUssRUFBRTtBQUNmLFFBQVEsT0FBTyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUN0RSxLQUFLO0FBQ0wsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckMsSUFBSSxJQUFJLEtBQUssRUFBRTtBQUNmLFFBQVEsT0FBTyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDekQsS0FBSztBQUNMLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RDLElBQUksSUFBSSxLQUFLLEVBQUU7QUFDZixRQUFRLE9BQU8sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDdEUsS0FBSztBQUNMLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JDLElBQUksSUFBSSxLQUFLLEVBQUU7QUFDZixRQUFRLE9BQU8sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3pELEtBQUs7QUFDTCxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QyxJQUFJLElBQUksS0FBSyxFQUFFO0FBQ2YsUUFBUSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3RFLEtBQUs7QUFDTCxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QyxJQUFJLElBQUksS0FBSyxFQUFFO0FBQ2YsUUFBUSxPQUFPO0FBQ2YsWUFBWSxDQUFDLEVBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QyxZQUFZLENBQUMsRUFBRSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLFlBQVksQ0FBQyxFQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEMsWUFBWSxDQUFDLEVBQUUsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVDLFlBQVksTUFBTSxFQUFFLEtBQUssR0FBRyxNQUFNLEdBQUcsTUFBTTtBQUMzQyxTQUFTLENBQUM7QUFDVixLQUFLO0FBQ0wsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEMsSUFBSSxJQUFJLEtBQUssRUFBRTtBQUNmLFFBQVEsT0FBTztBQUNmLFlBQVksQ0FBQyxFQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEMsWUFBWSxDQUFDLEVBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QyxZQUFZLENBQUMsRUFBRSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLFlBQVksTUFBTSxFQUFFLEtBQUssR0FBRyxNQUFNLEdBQUcsS0FBSztBQUMxQyxTQUFTLENBQUM7QUFDVixLQUFLO0FBQ0wsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEMsSUFBSSxJQUFJLEtBQUssRUFBRTtBQUNmLFFBQVEsT0FBTztBQUNmLFlBQVksQ0FBQyxFQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25ELFlBQVksQ0FBQyxFQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25ELFlBQVksQ0FBQyxFQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25ELFlBQVksQ0FBQyxFQUFFLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkQsWUFBWSxNQUFNLEVBQUUsS0FBSyxHQUFHLE1BQU0sR0FBRyxNQUFNO0FBQzNDLFNBQVMsQ0FBQztBQUNWLEtBQUs7QUFDTCxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QyxJQUFJLElBQUksS0FBSyxFQUFFO0FBQ2YsUUFBUSxPQUFPO0FBQ2YsWUFBWSxDQUFDLEVBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkQsWUFBWSxDQUFDLEVBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkQsWUFBWSxDQUFDLEVBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkQsWUFBWSxNQUFNLEVBQUUsS0FBSyxHQUFHLE1BQU0sR0FBRyxLQUFLO0FBQzFDLFNBQVMsQ0FBQztBQUNWLEtBQUs7QUFDTCxJQUFJLE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFDRCxBQUFPLFNBQVMsY0FBYyxDQUFDLEtBQUssRUFBRTtBQUN0QyxJQUFJLE9BQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUQsQ0FBQzs7QUM3SUQsSUFBSSxTQUFTLElBQUksWUFBWTtBQUM3QixJQUFJLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDcEMsUUFBUSxJQUFJLEtBQUssS0FBSyxLQUFLLENBQUMsRUFBRSxFQUFFLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRTtBQUM3QyxRQUFRLElBQUksSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFFO0FBQzNDLFFBQVEsSUFBSSxFQUFFLENBQUM7QUFDZixRQUFRLElBQUksS0FBSyxZQUFZLFNBQVMsRUFBRTtBQUN4QyxZQUFZLE9BQU8sS0FBSyxDQUFDO0FBQ3pCLFNBQVM7QUFDVCxRQUFRLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO0FBQ25DLFFBQVEsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BDLFFBQVEsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDbkMsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdkIsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdkIsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdkIsUUFBUSxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdkIsUUFBUSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDckQsUUFBUSxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsS0FBSyxJQUFJLElBQUksRUFBRSxLQUFLLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUMzRixRQUFRLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztBQUM5QyxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDeEIsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLFNBQVM7QUFDVCxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDeEIsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLFNBQVM7QUFDVCxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDeEIsWUFBWSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLFNBQVM7QUFDVCxRQUFRLElBQUksQ0FBQyxP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LENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDckQsUUFBUSxPQUFPLElBQUksQ0FBQztBQUNwQixLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFlBQVk7QUFDNUMsUUFBUSxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRCxRQUFRLE9BQU8sRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNqRSxLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFlBQVk7QUFDbEQsUUFBUSxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRCxRQUFRLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUN4QyxRQUFRLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUN4QyxRQUFRLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUN4QyxRQUFRLE9BQU8sSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztBQUN4SSxLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFlBQVk7QUFDNUMsUUFBUSxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRCxRQUFRLE9BQU8sRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNqRSxLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFlBQVk7QUFDbEQsUUFBUSxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRCxRQUFRLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUN4QyxRQUFRLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUN4QyxRQUFRLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUN4QyxRQUFRLE9BQU8sSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztBQUN4SSxLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFVBQVUsVUFBVSxFQUFFO0FBQ3RELFFBQVEsSUFBSSxVQUFVLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxVQUFVLEdBQUcsS0FBSyxDQUFDLEVBQUU7QUFDMUQsUUFBUSxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM1RCxLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFVBQVUsVUFBVSxFQUFFO0FBQzVELFFBQVEsSUFBSSxVQUFVLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxVQUFVLEdBQUcsS0FBSyxDQUFDLEVBQUU7QUFDMUQsUUFBUSxPQUFPLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzVDLEtBQUssQ0FBQztBQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxVQUFVLEVBQUU7QUFDdkQsUUFBUSxJQUFJLFVBQVUsS0FBSyxLQUFLLENBQUMsRUFBRSxFQUFFLFVBQVUsR0FBRyxLQUFLLENBQUMsRUFBRTtBQUMxRCxRQUFRLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDckUsS0FBSyxDQUFDO0FBQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxVQUFVLFVBQVUsRUFBRTtBQUM3RCxRQUFRLElBQUksVUFBVSxLQUFLLEtBQUssQ0FBQyxFQUFFLEVBQUUsVUFBVSxHQUFHLEtBQUssQ0FBQyxFQUFFO0FBQzFELFFBQVEsT0FBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3QyxLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFlBQVk7QUFDNUMsUUFBUSxPQUFPO0FBQ2YsWUFBWSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2pDLFlBQVksQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNqQyxZQUFZLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDakMsWUFBWSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDckIsU0FBUyxDQUFDO0FBQ1YsS0FBSyxDQUFDO0FBQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxZQUFZO0FBQ2xELFFBQVEsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkMsUUFBUSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQyxRQUFRLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DLFFBQVEsT0FBTyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ3BJLEtBQUssQ0FBQztBQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxlQUFlLEdBQUcsWUFBWTtBQUN0RCxRQUFRLElBQUksR0FBRyxHQUFHLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNuRixRQUFRLE9BQU87QUFDZixZQUFZLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMxQixZQUFZLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMxQixZQUFZLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMxQixZQUFZLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyQixTQUFTLENBQUM7QUFDVixLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMscUJBQXFCLEdBQUcsWUFBWTtBQUM1RCxRQUFRLElBQUksR0FBRyxHQUFHLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzdFLFFBQVEsT0FBTyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDM0IsWUFBWSxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJO0FBQ25GLFlBQVksT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQzFHLEtBQUssQ0FBQztBQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsWUFBWTtBQUM3QyxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDMUIsWUFBWSxPQUFPLGFBQWEsQ0FBQztBQUNqQyxTQUFTO0FBQ1QsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3hCLFlBQVksT0FBTyxLQUFLLENBQUM7QUFDekIsU0FBUztBQUNULFFBQVEsSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNoRSxRQUFRLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ3hFLFlBQVksSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdCLFlBQVksSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFO0FBQ3BDLGdCQUFnQixPQUFPLEdBQUcsQ0FBQztBQUMzQixhQUFhO0FBQ2IsU0FBUztBQUNULFFBQVEsT0FBTyxLQUFLLENBQUM7QUFDckIsS0FBSyxDQUFDO0FBQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxVQUFVLE1BQU0sRUFBRTtBQUNyRCxRQUFRLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN4QyxRQUFRLE1BQU0sSUFBSSxNQUFNLEtBQUssSUFBSSxJQUFJLE1BQU0sS0FBSyxLQUFLLENBQUMsR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9FLFFBQVEsSUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFDO0FBQ3BDLFFBQVEsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakQsUUFBUSxJQUFJLGdCQUFnQixHQUFHLENBQUMsU0FBUyxJQUFJLFFBQVEsS0FBSyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sS0FBSyxNQUFNLENBQUMsQ0FBQztBQUN6RyxRQUFRLElBQUksZ0JBQWdCLEVBQUU7QUFDOUIsWUFBWSxJQUFJLE1BQU0sS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDbkQsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3JDLGFBQWE7QUFDYixZQUFZLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3RDLFNBQVM7QUFDVCxRQUFRLElBQUksTUFBTSxLQUFLLEtBQUssRUFBRTtBQUM5QixZQUFZLGVBQWUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDakQsU0FBUztBQUNULFFBQVEsSUFBSSxNQUFNLEtBQUssTUFBTSxFQUFFO0FBQy9CLFlBQVksZUFBZSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzNELFNBQVM7QUFDVCxRQUFRLElBQUksTUFBTSxLQUFLLEtBQUssSUFBSSxNQUFNLEtBQUssTUFBTSxFQUFFO0FBQ25ELFlBQVksZUFBZSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNqRCxTQUFTO0FBQ1QsUUFBUSxJQUFJLE1BQU0sS0FBSyxNQUFNLEVBQUU7QUFDL0IsWUFBWSxlQUFlLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyRCxTQUFTO0FBQ1QsUUFBUSxJQUFJLE1BQU0sS0FBSyxNQUFNLEVBQUU7QUFDL0IsWUFBWSxlQUFlLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0RCxTQUFTO0FBQ1QsUUFBUSxJQUFJLE1BQU0sS0FBSyxNQUFNLEVBQUU7QUFDL0IsWUFBWSxlQUFlLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ2xELFNBQVM7QUFDVCxRQUFRLElBQUksTUFBTSxLQUFLLE1BQU0sRUFBRTtBQUMvQixZQUFZLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDNUMsU0FBUztBQUNULFFBQVEsSUFBSSxNQUFNLEtBQUssS0FBSyxFQUFFO0FBQzlCLFlBQVksZUFBZSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNqRCxTQUFTO0FBQ1QsUUFBUSxJQUFJLE1BQU0sS0FBSyxLQUFLLEVBQUU7QUFDOUIsWUFBWSxlQUFlLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ2pELFNBQVM7QUFDVCxRQUFRLE9BQU8sZUFBZSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNyRCxLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFlBQVk7QUFDNUMsUUFBUSxPQUFPLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQzlDLEtBQUssQ0FBQztBQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxNQUFNLEVBQUU7QUFDcEQsUUFBUSxJQUFJLE1BQU0sS0FBSyxLQUFLLENBQUMsRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRTtBQUMvQyxRQUFRLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMvQixRQUFRLEdBQUcsQ0FBQyxDQUFDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQztBQUM5QixRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLE9BQU8sSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEMsS0FBSyxDQUFDO0FBQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxVQUFVLE1BQU0sRUFBRTtBQUNyRCxRQUFRLElBQUksTUFBTSxLQUFLLEtBQUssQ0FBQyxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFO0FBQy9DLFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQy9CLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEVBQUUsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RGLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEVBQUUsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RGLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEVBQUUsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RGLFFBQVEsT0FBTyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQVUsTUFBTSxFQUFFO0FBQ25ELFFBQVEsSUFBSSxNQUFNLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUU7QUFDL0MsUUFBUSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDL0IsUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDOUIsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxPQUFPLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLEtBQUssQ0FBQztBQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsVUFBVSxNQUFNLEVBQUU7QUFDakQsUUFBUSxJQUFJLE1BQU0sS0FBSyxLQUFLLENBQUMsRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRTtBQUMvQyxRQUFRLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDekMsS0FBSyxDQUFDO0FBQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxVQUFVLE1BQU0sRUFBRTtBQUNsRCxRQUFRLElBQUksTUFBTSxLQUFLLEtBQUssQ0FBQyxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFO0FBQy9DLFFBQVEsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN6QyxLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFVBQVUsTUFBTSxFQUFFO0FBQ3ZELFFBQVEsSUFBSSxNQUFNLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUU7QUFDL0MsUUFBUSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDL0IsUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDOUIsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxPQUFPLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLEtBQUssQ0FBQztBQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsVUFBVSxNQUFNLEVBQUU7QUFDckQsUUFBUSxJQUFJLE1BQU0sS0FBSyxLQUFLLENBQUMsRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRTtBQUMvQyxRQUFRLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMvQixRQUFRLEdBQUcsQ0FBQyxDQUFDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQztBQUM5QixRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixRQUFRLE9BQU8sSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEMsS0FBSyxDQUFDO0FBQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxZQUFZO0FBQ2hELFFBQVEsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BDLEtBQUssQ0FBQztBQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsVUFBVSxNQUFNLEVBQUU7QUFDakQsUUFBUSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDL0IsUUFBUSxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxJQUFJLEdBQUcsQ0FBQztBQUN6QyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUMxQyxRQUFRLE9BQU8sSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEMsS0FBSyxDQUFDO0FBQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxVQUFVLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDdkQsUUFBUSxJQUFJLE1BQU0sS0FBSyxLQUFLLENBQUMsRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRTtBQUMvQyxRQUFRLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNoQyxRQUFRLElBQUksSUFBSSxHQUFHLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2hELFFBQVEsSUFBSSxDQUFDLEdBQUcsTUFBTSxHQUFHLEdBQUcsQ0FBQztBQUM3QixRQUFRLElBQUksSUFBSSxHQUFHO0FBQ25CLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO0FBQy9DLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO0FBQy9DLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO0FBQy9DLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO0FBQy9DLFNBQVMsQ0FBQztBQUNWLFFBQVEsT0FBTyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQyxLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLElBQUksT0FBTyxLQUFLLEtBQUssQ0FBQyxFQUFFLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ2hELFFBQVEsSUFBSSxNQUFNLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUU7QUFDL0MsUUFBUSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDL0IsUUFBUSxJQUFJLElBQUksR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDO0FBQ2hDLFFBQVEsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixRQUFRLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQUUsRUFBRSxPQUFPLEdBQUc7QUFDaEYsWUFBWSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksR0FBRyxDQUFDO0FBQ3pDLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFNBQVM7QUFDVCxRQUFRLE9BQU8sR0FBRyxDQUFDO0FBQ25CLEtBQUssQ0FBQztBQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsWUFBWTtBQUNqRCxRQUFRLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMvQixRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUM7QUFDcEMsUUFBUSxPQUFPLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLEtBQUssQ0FBQztBQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsVUFBVSxPQUFPLEVBQUU7QUFDM0QsUUFBUSxJQUFJLE9BQU8sS0FBSyxLQUFLLENBQUMsRUFBRSxFQUFFLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNoRCxRQUFRLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMvQixRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdEIsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLFFBQVEsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN0QixRQUFRLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNyQixRQUFRLElBQUksWUFBWSxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUM7QUFDdkMsUUFBUSxPQUFPLE9BQU8sRUFBRSxFQUFFO0FBQzFCLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFELFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFlBQVksSUFBSSxDQUFDLENBQUM7QUFDdkMsU0FBUztBQUNULFFBQVEsT0FBTyxHQUFHLENBQUM7QUFDbkIsS0FBSyxDQUFDO0FBQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLGVBQWUsR0FBRyxZQUFZO0FBQ3RELFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQy9CLFFBQVEsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN0QixRQUFRLE9BQU87QUFDZixZQUFZLElBQUk7QUFDaEIsWUFBWSxJQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDcEUsWUFBWSxJQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDckUsU0FBUyxDQUFDO0FBQ1YsS0FBSyxDQUFDO0FBQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxZQUFZO0FBQzVDLFFBQVEsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlCLEtBQUssQ0FBQztBQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsWUFBWTtBQUM3QyxRQUFRLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QixLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxFQUFFO0FBQzlDLFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQy9CLFFBQVEsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN0QixRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUIsUUFBUSxJQUFJLFNBQVMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNwQyxZQUFZLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvRixTQUFTO0FBQ1QsUUFBUSxPQUFPLE1BQU0sQ0FBQztBQUN0QixLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQVUsS0FBSyxFQUFFO0FBQ2xELFFBQVEsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDekUsS0FBSyxDQUFDO0FBQ04sSUFBSSxPQUFPLFNBQVMsQ0FBQztBQUNyQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ0wsQUFDTyxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ3ZDLElBQUksSUFBSSxLQUFLLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUU7QUFDekMsSUFBSSxJQUFJLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsRUFBRTtBQUN2QyxJQUFJLE9BQU8sSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3RDLENBQUM7O0FDbFZNLE1BQU0sVUFBVSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUM7QUFDbkUsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUNwRSxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQzFEO0FBQ0EsQUFBTyxNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztBQUM5QztBQUNBLEFBQU8sTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7O0FDTnJDLFNBQVMsSUFBSSxHQUFHO0FBQ3ZCLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztBQUN0QyxJQUFJLE9BQU8sUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDbEQ7QUFDQSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQztBQUM3QyxJQUFJLE9BQU8sUUFBUSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUN6RDtBQUNBLEVBQUUsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyxBQUNEO0FBQ0EsQUFBTyxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUU7QUFDckMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO0FBQ3RDLElBQUksT0FBTyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNsRTtBQUNBLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDO0FBQzdDLElBQUksT0FBTyxRQUFRLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pFO0FBQ0EsRUFBRSxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBQ0QsQUFvRU8sU0FBUyxhQUFhLEdBQUc7QUFDaEMsRUFBRSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9DLEVBQUUsR0FBRyxJQUFJLEVBQUU7QUFDWCxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUNuQyxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNyRCxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUNuQyxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDMUYsSUFBSSxPQUFPLElBQUksQ0FBQztBQUNoQixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDbEQsRUFBRSxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDakMsRUFBRSxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUMzRCxFQUFFLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUNqQyxFQUFFLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO0FBQ2hGLEVBQUUsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQztBQUN6QyxFQUFFLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3pELEVBQUUsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ2pDLEVBQUUsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2hELEVBQUUsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ2pDLEVBQUUsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBQztBQUNwRCxFQUFFLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QyxFQUFFLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDO0FBQ3hDLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBQ0Q7QUFDQSxBQUFPLGVBQWUsYUFBYSxHQUFHO0FBQ3RDLEVBQUUsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ2pEO0FBQ0EsRUFBRSxNQUFNLGNBQWMsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUM3RCxFQUFFLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUMvRCxFQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN2QixJQUFJLFFBQVEsRUFBRSxLQUFLO0FBQ25CLElBQUksZ0JBQWdCLEVBQUUsVUFBVTtBQUNoQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ04sRUFBRSxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDdEIsRUFBRSxNQUFNLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM1QyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFDNUQsRUFBRSxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDeEQsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksRUFBRSxDQUFDO0FBQ2xCLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtBQUMzQixJQUFJLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxJQUFJO0FBQ2pDLE1BQU0sTUFBTSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixFQUFFLENBQUMsRUFBRSxLQUFLO0FBQzNELFFBQVEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4QixRQUFRLE9BQU8sRUFBRSxDQUFDO0FBQ2xCLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLEtBQUssQ0FBQyxDQUFDO0FBQ1AsSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksRUFBRSxDQUFDO0FBQ3BCLEdBQUc7QUFDSCxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNuQyxFQUFFLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNuQixFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQzs7QUN6SU0sU0FBUyxTQUFTLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ25ELEVBQUUsRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRTtBQUNyQixJQUFJLE9BQU8sRUFBRSxJQUFJO0FBQ2pCLElBQUksVUFBVSxFQUFFLEtBQUs7QUFDckIsSUFBSSxRQUFRLEVBQUUsSUFBSTtBQUNsQixHQUFHLENBQUMsQ0FBQztBQUNMLEVBQUUsRUFBRSxDQUFDLE1BQU0sR0FBRyxNQUFNLElBQUksRUFBRSxDQUFDO0FBQzNCLEVBQUUsR0FBRyxNQUFNLEVBQUU7QUFDYixJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0IsR0FBRyxNQUFNO0FBQ1QsSUFBSSxJQUFJLElBQUksR0FBRyxhQUFhLEVBQUUsQ0FBQztBQUMvQixJQUFJLElBQUksSUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckMsR0FBRztBQUNILENBQUM7O0FDYk0sU0FBUyxRQUFRLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUU7QUFDOUMsRUFBRSxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM3RixFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN4RCxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDOUIsRUFBRSxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixFQUFFLE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQzs7QUNSRCxTQUFTLFNBQVMsR0FBRztBQUNyQixFQUFFLE1BQU0sY0FBYyxHQUFHLDJCQUEyQixDQUFDO0FBQ3JELEVBQUUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxLQUFLLENBQUMsV0FBVyxLQUFLLFVBQVU7QUFDL0QsSUFBSSxPQUFPLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUMvQixFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDO0FBQ2xDLEVBQUU7QUFDRixJQUFJLE1BQU0sRUFBRSxHQUFHLE1BQU07QUFDckIsTUFBTSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUUsTUFBSztBQUNMLElBQUksWUFBWSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuRSxHQUFHO0FBQ0gsRUFBRSxPQUFPLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN0QyxDQUFDLEFBQ0Q7QUFDQSxBQUFPLElBQUksUUFBUSxHQUFHLFNBQVMsRUFBRSxDQUFDOztBQ1gzQixlQUFlLGFBQWEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFdBQVcsR0FBRyxFQUFFLEVBQUU7QUFDakUsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksR0FBRyxJQUFJLEVBQUUsQ0FBQztBQUMzQixFQUFFLElBQUksT0FBTyxXQUFXLEtBQUssUUFBUSxDQUFDLEVBQUUsV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUN6RCxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2hDLE1BQU0sSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTtBQUMxQixNQUFNLE9BQU8sRUFBRSxRQUFRO0FBQ3ZCLE1BQU0sSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUc7QUFDMUMsS0FBSztBQUNMLElBQUksV0FBVyxDQUFDLENBQUM7QUFDakI7QUFDQSxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksV0FBVyxFQUFFO0FBQy9CLE1BQU0sSUFBSSxFQUFFLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzdDLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVDLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM3RCxDQUFDOztBQ2hCTSxNQUFNLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztBQUM1QyxBQVFBO0FBQ0EsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUNqQyxNQUFNLGFBQWEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxPQUFPLE9BQU8sRUFBRSxNQUFNLEtBQUs7QUFDN0QsRUFBRSxHQUFHLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQztBQUN4QjtBQUNBLEVBQUUsTUFBTSxhQUFhLEdBQUcsWUFBWTtBQUNwQyxJQUFJLE9BQU8sR0FBRyxNQUFNLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUM3QyxJQUFJLE1BQU0sQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO0FBQ2pDLElBQUksT0FBTyxFQUFFLENBQUM7QUFDZCxJQUFHO0FBQ0g7QUFDQSxFQUFFLEdBQUcsTUFBTSxDQUFDLGVBQWUsRUFBRTtBQUM3QixJQUFJLGFBQWEsRUFBRSxDQUFDO0FBQ3BCLEdBQUcsTUFBTTtBQUNUO0FBQ0EsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFlBQVk7QUFDaEQsTUFBTSxhQUFhLEVBQUUsQ0FBQztBQUN0QixNQUFNLEdBQUcsTUFBTSxDQUFDLGVBQWUsRUFBRTtBQUNqQyxRQUFRLGFBQWEsRUFBRSxDQUFDO0FBQ3hCLE9BQU87QUFDUCxLQUFLLENBQUMsQ0FBQztBQUNQLEdBQUc7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUNIO0FBQ0EsU0FBUyxZQUFZLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtBQUN6QyxFQUFFLE1BQU0sR0FBRyxHQUFHO0FBQ2QsSUFBSSxJQUFJLEVBQUUsT0FBTztBQUNqQixJQUFJLEtBQUs7QUFDVCxJQUFJLFVBQVU7QUFDZCxHQUFHLENBQUM7QUFDSixFQUFFLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN0RCxFQUFFLGNBQWMsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTTtBQUMxRCxJQUFJLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUMzRCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekIsSUFBSSxHQUFHLEVBQUUsQ0FBQyxhQUFhO0FBQ3ZCLE1BQU0sRUFBRSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQy9DLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU07QUFDM0IsSUFBSSxTQUFTLENBQUMsWUFBWSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNwQyxHQUFHLENBQUMsQ0FBQztBQUNMLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDO0FBQ0Q7QUFDQSxTQUFTLGNBQWMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFO0FBQ3JDLEVBQUUsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QyxFQUFFLElBQUk7QUFDTixJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRCxHQUFHLENBQUMsT0FBTyxHQUFHLEVBQUU7QUFDaEIsSUFBSSxFQUFFLEdBQUcsWUFBWSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNuQyxHQUFHO0FBQ0gsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU07QUFDM0IsSUFBSSxTQUFTLENBQUMsWUFBWSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNwQyxHQUFHLENBQUMsQ0FBQztBQUNMLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDO0FBQ0Q7QUFDQSxTQUFTLHFCQUFxQixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDOUMsRUFBRSxHQUFHLENBQUMsTUFBTSxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJO0FBQzFELElBQUksT0FBTyxZQUFZLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDL0Q7QUFDQSxFQUFFLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDeEIsRUFBRSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUM7QUFDdkMsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRDtBQUNBLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNoQztBQUNBLEVBQUUsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztBQUM1QixJQUFJLE9BQU8sY0FBYyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN2QztBQUNBLEVBQUUsTUFBTSxFQUFFLEdBQUcsWUFBWSxDQUFDLENBQUMsOEJBQThCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzNFLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQzVCO0FBQ0EsRUFBRSxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsTUFBTTtBQUNqQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUMxQixHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDWDtBQUNBLEVBQUUsY0FBYyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTTtBQUM3QyxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QixJQUFJLFNBQVMsQ0FBQyxZQUFZLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3BDLEdBQUcsQ0FBQyxDQUFDO0FBQ0w7QUFDQSxFQUFFLE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQztBQUNEO0FBQ0EsQUFBTyxTQUFTLFVBQVUsQ0FBQyxNQUFNLEVBQUU7QUFDbkMsRUFBRSxHQUFHLE9BQU8sRUFBRSxPQUFPLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2RCxFQUFFLE9BQU8scUJBQXFCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQy9DLENBQUM7Ozs7Ozs7QUNuR0Q7Ozs7O0FBS0EsQ0FBQyxTQUFTLE1BQU0sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFQyxXQUFTLEVBQUU7O0FBR25ELElBQUksZUFBZSxHQUFHLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM3RCxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVqRCxJQUFJLGFBQWEsR0FBRyxVQUFVLENBQUM7O0FBRS9CLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdkIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNuQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDOzs7Ozs7Ozs7QUFTbkIsU0FBUyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtJQUM3QyxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0NBQ25EOzs7Ozs7Ozs7OztBQVdELFNBQVMsY0FBYyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFO0lBQ3RDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNwQixJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoQyxPQUFPLElBQUksQ0FBQztLQUNmO0lBQ0QsT0FBTyxLQUFLLENBQUM7Q0FDaEI7Ozs7Ozs7O0FBUUQsU0FBUyxJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUU7SUFDbEMsSUFBSSxDQUFDLENBQUM7O0lBRU4sSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNOLE9BQU87S0FDVjs7SUFFRCxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUU7UUFDYixHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUNsQyxNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBS0EsV0FBUyxFQUFFO1FBQ2pDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDTixPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFO1lBQ25CLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdkMsQ0FBQyxFQUFFLENBQUM7U0FDUDtLQUNKLE1BQU07UUFDSCxLQUFLLENBQUMsSUFBSSxHQUFHLEVBQUU7WUFDWCxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDbkU7S0FDSjtDQUNKOzs7Ozs7Ozs7QUFTRCxTQUFTLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtJQUN0QyxJQUFJLGtCQUFrQixHQUFHLHFCQUFxQixHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsT0FBTyxHQUFHLFFBQVEsQ0FBQztJQUNsRixPQUFPLFdBQVc7UUFDZCxJQUFJLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3JDLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQzthQUM1RCxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQzthQUMxQixPQUFPLENBQUMsNEJBQTRCLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxxQkFBcUIsQ0FBQzs7UUFFckYsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLE9BQU8sS0FBSyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hFLElBQUksR0FBRyxFQUFFO1lBQ0wsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3ZEO1FBQ0QsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztLQUN4QyxDQUFDO0NBQ0w7Ozs7Ozs7OztBQVNELElBQUksTUFBTSxDQUFDO0FBQ1gsSUFBSSxPQUFPLE1BQU0sQ0FBQyxNQUFNLEtBQUssVUFBVSxFQUFFO0lBQ3JDLE1BQU0sR0FBRyxTQUFTLE1BQU0sQ0FBQyxNQUFNLEVBQUU7UUFDN0IsSUFBSSxNQUFNLEtBQUtBLFdBQVMsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO1lBQ3pDLE1BQU0sSUFBSSxTQUFTLENBQUMsNENBQTRDLENBQUMsQ0FBQztTQUNyRTs7UUFFRCxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUIsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDbkQsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlCLElBQUksTUFBTSxLQUFLQSxXQUFTLElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtnQkFDekMsS0FBSyxJQUFJLE9BQU8sSUFBSSxNQUFNLEVBQUU7b0JBQ3hCLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRTt3QkFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztxQkFDckM7aUJBQ0o7YUFDSjtTQUNKO1FBQ0QsT0FBTyxNQUFNLENBQUM7S0FDakIsQ0FBQztDQUNMLE1BQU07SUFDSCxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztDQUMxQjs7Ozs7Ozs7OztBQVVELElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxTQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtJQUNyRCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNWLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDcEIsSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLQSxXQUFTLENBQUMsRUFBRTtZQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hDO1FBQ0QsQ0FBQyxFQUFFLENBQUM7S0FDUDtJQUNELE9BQU8sSUFBSSxDQUFDO0NBQ2YsRUFBRSxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUM7Ozs7Ozs7OztBQVM5QixJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsU0FBUyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtJQUM1QyxPQUFPLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0NBQ2xDLEVBQUUsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDOzs7Ozs7OztBQVE3QixTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtJQUN0QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUztRQUN0QixNQUFNLENBQUM7O0lBRVgsTUFBTSxHQUFHLEtBQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRCxNQUFNLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUMzQixNQUFNLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQzs7SUFFdEIsSUFBSSxVQUFVLEVBQUU7UUFDWixNQUFNLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQzlCO0NBQ0o7Ozs7Ozs7O0FBUUQsU0FBUyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRTtJQUN6QixPQUFPLFNBQVMsT0FBTyxHQUFHO1FBQ3RCLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDdkMsQ0FBQztDQUNMOzs7Ozs7Ozs7QUFTRCxTQUFTLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0lBQ3pCLElBQUksT0FBTyxHQUFHLElBQUksYUFBYSxFQUFFO1FBQzdCLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJQSxXQUFTLEdBQUdBLFdBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNuRTtJQUNELE9BQU8sR0FBRyxDQUFDO0NBQ2Q7Ozs7Ozs7O0FBUUQsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtJQUM3QixPQUFPLENBQUMsSUFBSSxLQUFLQSxXQUFTLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztDQUM3Qzs7Ozs7Ozs7QUFRRCxTQUFTLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO0lBQy9DLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsU0FBUyxJQUFJLEVBQUU7UUFDakMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDakQsQ0FBQyxDQUFDO0NBQ047Ozs7Ozs7O0FBUUQsU0FBUyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtJQUNsRCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLFNBQVMsSUFBSSxFQUFFO1FBQ2pDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3BELENBQUMsQ0FBQztDQUNOOzs7Ozs7Ozs7QUFTRCxTQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO0lBQzdCLE9BQU8sSUFBSSxFQUFFO1FBQ1QsSUFBSSxJQUFJLElBQUksTUFBTSxFQUFFO1lBQ2hCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztLQUMxQjtJQUNELE9BQU8sS0FBSyxDQUFDO0NBQ2hCOzs7Ozs7OztBQVFELFNBQVMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUU7SUFDdEIsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQ2pDOzs7Ozs7O0FBT0QsU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFO0lBQ25CLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztDQUNuQzs7Ozs7Ozs7O0FBU0QsU0FBUyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7SUFDbkMsSUFBSSxHQUFHLENBQUMsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQzNCLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM1QixNQUFNO1FBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRTtZQUNuQixJQUFJLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxTQUFTLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxFQUFFO2dCQUM3RSxPQUFPLENBQUMsQ0FBQzthQUNaO1lBQ0QsQ0FBQyxFQUFFLENBQUM7U0FDUDtRQUNELE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDYjtDQUNKOzs7Ozs7O0FBT0QsU0FBUyxPQUFPLENBQUMsR0FBRyxFQUFFO0lBQ2xCLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztDQUM3Qzs7Ozs7Ozs7O0FBU0QsU0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7SUFDakMsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNoQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O0lBRVYsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRTtRQUNuQixJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEI7UUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLENBQUMsRUFBRSxDQUFDO0tBQ1A7O0lBRUQsSUFBSSxJQUFJLEVBQUU7UUFDTixJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ04sT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUM1QixNQUFNO1lBQ0gsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDbEQsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzFCLENBQUMsQ0FBQztTQUNOO0tBQ0o7O0lBRUQsT0FBTyxPQUFPLENBQUM7Q0FDbEI7Ozs7Ozs7O0FBUUQsU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRTtJQUM3QixJQUFJLE1BQU0sRUFBRSxJQUFJLENBQUM7SUFDakIsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRTlELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNWLE9BQU8sQ0FBQyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUU7UUFDL0IsTUFBTSxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksTUFBTSxHQUFHLFNBQVMsR0FBRyxRQUFRLENBQUM7O1FBRWhELElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRTtZQUNiLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxDQUFDLEVBQUUsQ0FBQztLQUNQO0lBQ0QsT0FBT0EsV0FBUyxDQUFDO0NBQ3BCOzs7Ozs7QUFNRCxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsU0FBUyxRQUFRLEdBQUc7SUFDaEIsT0FBTyxTQUFTLEVBQUUsQ0FBQztDQUN0Qjs7Ozs7OztBQU9ELFNBQVMsbUJBQW1CLENBQUMsT0FBTyxFQUFFO0lBQ2xDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxhQUFhLElBQUksT0FBTyxDQUFDO0lBQzNDLFFBQVEsR0FBRyxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsWUFBWSxJQUFJLE1BQU0sRUFBRTtDQUMxRDs7QUFFRCxJQUFJLFlBQVksR0FBRyx1Q0FBdUMsQ0FBQzs7QUFFM0QsSUFBSSxhQUFhLElBQUksY0FBYyxJQUFJLE1BQU0sQ0FBQyxDQUFDO0FBQy9DLElBQUksc0JBQXNCLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsS0FBS0EsV0FBUyxDQUFDO0FBQzVFLElBQUksa0JBQWtCLEdBQUcsYUFBYSxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUVqRixJQUFJLGdCQUFnQixHQUFHLE9BQU8sQ0FBQztBQUMvQixJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUM7QUFDM0IsSUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUM7QUFDL0IsSUFBSSxpQkFBaUIsR0FBRyxRQUFRLENBQUM7O0FBRWpDLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDOztBQUUxQixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDcEIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7O0FBRXJCLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztBQUN2QixJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUM7QUFDdkIsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUNyQixJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7O0FBRXhCLElBQUksb0JBQW9CLEdBQUcsY0FBYyxHQUFHLGVBQWUsQ0FBQztBQUM1RCxJQUFJLGtCQUFrQixHQUFHLFlBQVksR0FBRyxjQUFjLENBQUM7QUFDdkQsSUFBSSxhQUFhLEdBQUcsb0JBQW9CLEdBQUcsa0JBQWtCLENBQUM7O0FBRTlELElBQUksUUFBUSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLElBQUksZUFBZSxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDOzs7Ozs7Ozs7QUFTN0MsU0FBUyxLQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRTtJQUM5QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7SUFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7Ozs7SUFJMUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLEVBQUUsRUFBRTtRQUMzQixJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUU7WUFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNwQjtLQUNKLENBQUM7O0lBRUYsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOztDQUVmOztBQUVELEtBQUssQ0FBQyxTQUFTLEdBQUc7Ozs7O0lBS2QsT0FBTyxFQUFFLFdBQVcsR0FBRzs7Ozs7SUFLdkIsSUFBSSxFQUFFLFdBQVc7UUFDYixJQUFJLENBQUMsSUFBSSxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLFFBQVEsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hGLElBQUksQ0FBQyxLQUFLLElBQUksaUJBQWlCLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ25HOzs7OztJQUtELE9BQU8sRUFBRSxXQUFXO1FBQ2hCLElBQUksQ0FBQyxJQUFJLElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsUUFBUSxJQUFJLG9CQUFvQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkYsSUFBSSxDQUFDLEtBQUssSUFBSSxvQkFBb0IsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDdEc7Q0FDSixDQUFDOzs7Ozs7OztBQVFGLFNBQVMsbUJBQW1CLENBQUMsT0FBTyxFQUFFO0lBQ2xDLElBQUksSUFBSSxDQUFDO0lBQ1QsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7O0lBRTVDLElBQUksVUFBVSxFQUFFO1FBQ1osSUFBSSxHQUFHLFVBQVUsQ0FBQztLQUNyQixNQUFNLElBQUksc0JBQXNCLEVBQUU7UUFDL0IsSUFBSSxHQUFHLGlCQUFpQixDQUFDO0tBQzVCLE1BQU0sSUFBSSxrQkFBa0IsRUFBRTtRQUMzQixJQUFJLEdBQUcsVUFBVSxDQUFDO0tBQ3JCLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRTtRQUN2QixJQUFJLEdBQUcsVUFBVSxDQUFDO0tBQ3JCLE1BQU07UUFDSCxJQUFJLEdBQUcsZUFBZSxDQUFDO0tBQzFCO0lBQ0QsT0FBTyxLQUFLLElBQUksRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7Q0FDNUM7Ozs7Ozs7O0FBUUQsU0FBUyxZQUFZLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUU7SUFDN0MsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7SUFDeEMsSUFBSSxrQkFBa0IsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQztJQUN0RCxJQUFJLE9BQU8sSUFBSSxTQUFTLEdBQUcsV0FBVyxLQUFLLFdBQVcsR0FBRyxrQkFBa0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BGLElBQUksT0FBTyxJQUFJLFNBQVMsSUFBSSxTQUFTLEdBQUcsWUFBWSxDQUFDLEtBQUssV0FBVyxHQUFHLGtCQUFrQixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRW5HLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUMxQixLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7O0lBRTFCLElBQUksT0FBTyxFQUFFO1FBQ1QsT0FBTyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7S0FDeEI7Ozs7SUFJRCxLQUFLLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQzs7O0lBRzVCLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQzs7O0lBR2pDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDOztJQUVwQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pCLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztDQUNyQzs7Ozs7OztBQU9ELFNBQVMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRTtJQUN0QyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQzlCLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7SUFDOUIsSUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQzs7O0lBR3JDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO1FBQ3JCLE9BQU8sQ0FBQyxVQUFVLEdBQUcsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDcEQ7OztJQUdELElBQUksY0FBYyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUU7UUFDOUMsT0FBTyxDQUFDLGFBQWEsR0FBRyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN2RCxNQUFNLElBQUksY0FBYyxLQUFLLENBQUMsRUFBRTtRQUM3QixPQUFPLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztLQUNqQzs7SUFFRCxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO0lBQ3BDLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7SUFDMUMsSUFBSSxZQUFZLEdBQUcsYUFBYSxHQUFHLGFBQWEsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQzs7SUFFNUUsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLFNBQVMsR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUN4QixLQUFLLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQzs7SUFFekQsS0FBSyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdDLEtBQUssQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQzs7SUFFbkQsY0FBYyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMvQixLQUFLLENBQUMsZUFBZSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzs7SUFFakUsSUFBSSxlQUFlLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0UsS0FBSyxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDM0MsS0FBSyxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDM0MsS0FBSyxDQUFDLGVBQWUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxlQUFlLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUM7O0lBRWxILEtBQUssQ0FBQyxLQUFLLEdBQUcsYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3RSxLQUFLLENBQUMsUUFBUSxHQUFHLGFBQWEsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7O0lBRW5GLEtBQUssQ0FBQyxXQUFXLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNO1FBQ3BGLE9BQU8sQ0FBQyxTQUFTLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7O0lBRTVGLHdCQUF3QixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQzs7O0lBR3pDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7SUFDN0IsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDMUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0tBQ2xDO0lBQ0QsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7Q0FDekI7O0FBRUQsU0FBUyxjQUFjLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRTtJQUNwQyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQzFCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO0lBQ3ZDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO0lBQ3hDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDOztJQUV4QyxJQUFJLEtBQUssQ0FBQyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFO1FBQ3RFLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxHQUFHO1lBQzVCLENBQUMsRUFBRSxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUM7WUFDeEIsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQztTQUMzQixDQUFDOztRQUVGLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxHQUFHO1lBQzNCLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNYLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNkLENBQUM7S0FDTDs7SUFFRCxLQUFLLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkQsS0FBSyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3REOzs7Ozs7O0FBT0QsU0FBUyx3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFO0lBQzlDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxZQUFZLElBQUksS0FBSztRQUNwQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUztRQUM1QyxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7O0lBRTlDLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxZQUFZLEtBQUssU0FBUyxHQUFHLGdCQUFnQixJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUtBLFdBQVMsQ0FBQyxFQUFFO1FBQ2xHLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN4QyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7O1FBRXhDLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQy9DLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsU0FBUyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7O1FBRXpDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0tBQ2hDLE1BQU07O1FBRUgsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDekIsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDM0IsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDM0IsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7S0FDOUI7O0lBRUQsS0FBSyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDMUIsS0FBSyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDNUIsS0FBSyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDNUIsS0FBSyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7Q0FDL0I7Ozs7Ozs7QUFPRCxTQUFTLG9CQUFvQixDQUFDLEtBQUssRUFBRTs7O0lBR2pDLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDVixPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtRQUM5QixRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUc7WUFDVixPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3pDLE9BQU8sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7U0FDNUMsQ0FBQztRQUNGLENBQUMsRUFBRSxDQUFDO0tBQ1A7O0lBRUQsT0FBTztRQUNILFNBQVMsRUFBRSxHQUFHLEVBQUU7UUFDaEIsUUFBUSxFQUFFLFFBQVE7UUFDbEIsTUFBTSxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUM7UUFDM0IsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1FBQ3BCLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtLQUN2QixDQUFDO0NBQ0w7Ozs7Ozs7QUFPRCxTQUFTLFNBQVMsQ0FBQyxRQUFRLEVBQUU7SUFDekIsSUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQzs7O0lBR3JDLElBQUksY0FBYyxLQUFLLENBQUMsRUFBRTtRQUN0QixPQUFPO1lBQ0gsQ0FBQyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzdCLENBQUMsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztTQUNoQyxDQUFDO0tBQ0w7O0lBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QixPQUFPLENBQUMsR0FBRyxjQUFjLEVBQUU7UUFDdkIsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDekIsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDekIsQ0FBQyxFQUFFLENBQUM7S0FDUDs7SUFFRCxPQUFPO1FBQ0gsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDO1FBQzVCLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQztLQUMvQixDQUFDO0NBQ0w7Ozs7Ozs7OztBQVNELFNBQVMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ2xDLE9BQU87UUFDSCxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsSUFBSSxDQUFDO1FBQ3JCLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxJQUFJLENBQUM7S0FDeEIsQ0FBQztDQUNMOzs7Ozs7OztBQVFELFNBQVMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7SUFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ1QsT0FBTyxjQUFjLENBQUM7S0FDekI7O0lBRUQsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxjQUFjLEdBQUcsZUFBZSxDQUFDO0tBQ25EO0lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksR0FBRyxjQUFjLENBQUM7Q0FDaEQ7Ozs7Ozs7OztBQVNELFNBQVMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFO0lBQ2hDLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDUixLQUFLLEdBQUcsUUFBUSxDQUFDO0tBQ3BCO0lBQ0QsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRXBDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDdkM7Ozs7Ozs7OztBQVNELFNBQVMsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFO0lBQzdCLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDUixLQUFLLEdBQUcsUUFBUSxDQUFDO0tBQ3BCO0lBQ0QsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztDQUMzQzs7Ozs7Ozs7QUFRRCxTQUFTLFdBQVcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO0lBQzdCLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUM7Q0FDcEc7Ozs7Ozs7OztBQVNELFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDMUIsT0FBTyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQztDQUMxRzs7QUFFRCxJQUFJLGVBQWUsR0FBRztJQUNsQixTQUFTLEVBQUUsV0FBVztJ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SSxVQUFVLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxHQUFHLE1BQU0sSUFBSSxPQUFPLElBQUksS0FBSyxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEcsVUFBVSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBRTNCLElBQUksT0FBT0MsV0FBTSxLQUFLLFVBQVUsSUFBSUEsV0FBTSxDQUFDLEdBQUcsRUFBRTtJQUM1Q0EsV0FBTSxDQUFDLFdBQVc7UUFDZCxPQUFPLE1BQU0sQ0FBQztLQUNqQixDQUFDLENBQUM7Q0FDTixNQUFNLElBQUksQ0FBZ0MsTUFBTSxDQUFDLE9BQU8sRUFBRTtJQUN2RCxjQUFjLEdBQUcsTUFBTSxDQUFDO0NBQzNCLE1BQU07SUFDSCxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsTUFBTSxDQUFDO0NBQy9COztDQUVBLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
