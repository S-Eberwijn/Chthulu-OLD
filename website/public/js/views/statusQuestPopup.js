function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function statusquestpopupTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {"website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug":"input(action=\"status\" type=\"checkbox\" id=\"statusQuestModal\")\r\nlabel(for=\"statusQuestModal\" action=\"status\").modal-background\r\n.modal(action=\"status\") \r\n    .modal-header\r\n        .icon\r\n            .bot-icon\r\n                img(src=bot_icon alt=\"Chthulu Avatar\")\r\n        h3 Change status\r\n        label(for=\"statusQuestModal\")\r\n            i.fa-solid.fa-xmark.fa-xl\r\n    .modal-content\r\n        form.status\r\n            input(type=\"button\" value=\"Done\" onclick=\"statusChangeQuest(this.value)\").done\r\n                \u002F\u002F- i.far.fa-check-circle\r\n            input(type=\"button\" value=\"Expired\" onclick=\"statusChangeQuest(this.value)\").expired\r\n                \u002F\u002F- i.far.fa-clock\r\n            input(type=\"button\" value=\"Failed\" onclick=\"statusChangeQuest(this.value)\").failed\r\n                \u002F\u002F- i.fas.fa-times"};
;var locals_for_with = (locals || {});(function (bot_icon) {;pug_debug_line = 1;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug";
pug_html = pug_html + "\u003Cinput action=\"status\" type=\"checkbox\" id=\"statusQuestModal\"\u002F\u003E";
;pug_debug_line = 2;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug";
pug_html = pug_html + "\u003Clabel class=\"modal-background\" for=\"statusQuestModal\" action=\"status\"\u003E\u003C\u002Flabel\u003E";
;pug_debug_line = 3;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"modal\" action=\"status\"\u003E";
;pug_debug_line = 3;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug";
pug_html = pug_html + " ";
;pug_debug_line = 4;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"modal-header\"\u003E";
;pug_debug_line = 5;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"icon\"\u003E";
;pug_debug_line = 6;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"bot-icon\"\u003E";
;pug_debug_line = 7;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug";
pug_html = pug_html + "\u003Cimg" + (pug_attr("src", bot_icon, true, false)+" alt=\"Chthulu Avatar\"") + "\u002F\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 8;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug";
pug_html = pug_html + "\u003Ch3\u003E";
;pug_debug_line = 8;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug";
pug_html = pug_html + "Change status\u003C\u002Fh3\u003E";
;pug_debug_line = 9;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug";
pug_html = pug_html + "\u003Clabel for=\"statusQuestModal\"\u003E";
;pug_debug_line = 10;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug";
pug_html = pug_html + "\u003Ci class=\"fa-solid fa-xmark fa-xl\"\u003E\u003C\u002Fi\u003E\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 11;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"modal-content\"\u003E";
;pug_debug_line = 12;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug";
pug_html = pug_html + "\u003Cform class=\"status\"\u003E";
;pug_debug_line = 13;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug";
pug_html = pug_html + "\u003Cinput class=\"done\" type=\"button\" value=\"Done\" onclick=\"statusChangeQuest(this.value)\"\u002F\u003E";
;pug_debug_line = 15;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug";
pug_html = pug_html + "\u003Cinput class=\"expired\" type=\"button\" value=\"Expired\" onclick=\"statusChangeQuest(this.value)\"\u002F\u003E";
;pug_debug_line = 17;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FstatusQuestPopup.pug";
pug_html = pug_html + "\u003Cinput class=\"failed\" type=\"button\" value=\"Failed\" onclick=\"statusChangeQuest(this.value)\"\u002F\u003E\u003C\u002Fform\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";}.call(this,"bot_icon" in locals_for_with?locals_for_with.bot_icon:typeof bot_icon!=="undefined"?bot_icon:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}