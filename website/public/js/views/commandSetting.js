function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function commandsettingTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {"website\u002Fviews\u002Fcomponents\u002F\u002FcommandSetting.pug":".setting \r\n    .settingName \r\n        span.commandName \u002F#{command.name}\r\n    .settingDescription \r\n        span.commandDescription #{command.description}\r\n    .settingCheckBox\r\n        label.switch(for=`${command.name}-checkbox`)\r\n            input(type=\"checkbox\" id=`${command.name}-checkbox` checked=true)\r\n            .slider.round\r\n"};
;var locals_for_with = (locals || {});(function (command) {;pug_debug_line = 1;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcommandSetting.pug";
pug_html = pug_html + "\u003Cdiv class=\"setting\"\u003E";
;pug_debug_line = 1;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcommandSetting.pug";
pug_html = pug_html + " ";
;pug_debug_line = 2;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcommandSetting.pug";
pug_html = pug_html + "\u003Cdiv class=\"settingName\"\u003E";
;pug_debug_line = 2;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcommandSetting.pug";
pug_html = pug_html + " ";
;pug_debug_line = 3;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcommandSetting.pug";
pug_html = pug_html + "\u003Cspan class=\"commandName\"\u003E";
;pug_debug_line = 3;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcommandSetting.pug";
pug_html = pug_html + "\u002F";
;pug_debug_line = 3;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcommandSetting.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = command.name) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 4;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcommandSetting.pug";
pug_html = pug_html + "\u003Cdiv class=\"settingDescription\"\u003E";
;pug_debug_line = 4;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcommandSetting.pug";
pug_html = pug_html + " ";
;pug_debug_line = 5;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcommandSetting.pug";
pug_html = pug_html + "\u003Cspan class=\"commandDescription\"\u003E";
;pug_debug_line = 5;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcommandSetting.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = command.description) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 6;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcommandSetting.pug";
pug_html = pug_html + "\u003Cdiv class=\"settingCheckBox\"\u003E";
;pug_debug_line = 7;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcommandSetting.pug";
pug_html = pug_html + "\u003Clabel" + (" class=\"switch\""+pug_attr("for", `${command.name}-checkbox`, true, false)) + "\u003E";
;pug_debug_line = 8;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcommandSetting.pug";
pug_html = pug_html + "\u003Cinput" + (" type=\"checkbox\""+pug_attr("id", `${command.name}-checkbox`, true, false)+" checked=\"checked\"") + "\u002F\u003E";
;pug_debug_line = 9;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcommandSetting.pug";
pug_html = pug_html + "\u003Cdiv class=\"slider round\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";}.call(this,"command" in locals_for_with?locals_for_with.command:typeof command!=="undefined"?command:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}