function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function questTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {"website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug":"if (quest.quest_description)\r\n    .questDiv(id=quest.quest_identifier quest_importance_value=quest.quest_importance_value quest_started=quest.createdAt).quest\r\n        .questTitleDiv\r\n            p.title #{quest.quest_name}\r\n                \u002F\u002F- - var createdAt = quest.createdAt.toISOString().split('T')[0].split('-').reverse().join('\u002F')\r\n                span.createdAt #{quest.data.created_date}\r\n            if (quest.quest_description)\r\n                span.description #{quest.quest_description} \r\n        .options \r\n            if (quest.quest_status === \"OPEN\")\r\n                label(action=\"delete\" for=\"deleteQuestModal\" class=\"trash-label\" onclick=\"updateGlobalQuestId(this)\")\r\n                    i.fas.fa-trash\r\n                label(action=\"edit\" for=\"editQuestModal\" class=\"edit-label\" onclick=\"updateGlobalQuestId(this)\")\r\n                    i.fas.fa-edit\r\n            else if (quest.quest_status === \"DONE\")\r\n                i.far.fa-check-circle(style=\"color: lightgreen; z-index: 100;\")\r\n            else if (quest.quest_status === \"EXPIRED\")\r\n                i.far.fa-clock(style=\"color: orange; z-index: 100;\")\r\n            else if (quest.quest_status === \"FAILED\")\r\n                i.fas.fa-times(style=\"color: red; z-index: 100;\")\r\nelse \r\n    .questDiv(id=quest.quest_identifier quest_importance_value=quest.quest_importance_value quest_started=quest.createdAt).quest.onlyTitle\r\n        .questTitleDiv\r\n            p.title #{quest.quest_name}\r\n                \u002F\u002F- - var createdAt = quest.createdAt.toISOString().split('T')[0].split('-').reverse().join('\u002F')\r\n                span.createdAt #{quest.data.created_date}\r\n            if (quest.quest_description)\r\n                span.description #{quest.quest_description}\r\n        .options \r\n            if (quest.quest_status === \"OPEN\")\r\n                label(action=\"delete\" for=\"deleteQuestModal\" class=\"trash-label\" onclick=\"updateGlobalQuestId(this)\")\r\n                    i.fas.fa-trash\r\n                label(action=\"edit\" for=\"editQuestModal\" class=\"edit-label\" onclick=\"updateGlobalQuestId(this)\")\r\n                    i.fas.fa-edit\r\n            else if (quest.quest_status === \"DONE\")\r\n                i.far.fa-check-circle(style=\"color: lightgreen; z-index: 100;\")\r\n            else if (quest.quest_status === \"EXPIRED\")\r\n                i.far.fa-clock(style=\"color: orange; z-index: 100;\")\r\n            else if (quest.quest_status === \"FAILED\")\r\n                i.fas.fa-times(style=\"color: red; z-index: 100;\")"};
;var locals_for_with = (locals || {});(function (quest) {;pug_debug_line = 1;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
if ((quest.quest_description)) {
;pug_debug_line = 2;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"questDiv quest\""+pug_attr("id", quest.quest_identifier, true, false)+pug_attr("quest_importance_value", quest.quest_importance_value, true, false)+pug_attr("quest_started", quest.createdAt, true, false)) + "\u003E";
;pug_debug_line = 3;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Cdiv class=\"questTitleDiv\"\u003E";
;pug_debug_line = 4;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Cp class=\"title\"\u003E";
;pug_debug_line = 4;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = quest.quest_name) ? "" : pug_interp));
;pug_debug_line = 6;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Cspan class=\"createdAt\"\u003E";
;pug_debug_line = 6;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = quest.data.created_date) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fp\u003E";
;pug_debug_line = 7;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
if ((quest.quest_description)) {
;pug_debug_line = 8;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Cspan class=\"description\"\u003E";
;pug_debug_line = 8;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = quest.quest_description) ? "" : pug_interp));
;pug_debug_line = 8;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + " \u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 9;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Cdiv class=\"options\"\u003E";
;pug_debug_line = 9;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + " ";
;pug_debug_line = 10;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
if ((quest.quest_status === "OPEN")) {
;pug_debug_line = 11;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Clabel class=\"trash-label\" action=\"delete\" for=\"deleteQuestModal\" onclick=\"updateGlobalQuestId(this)\"\u003E";
;pug_debug_line = 12;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Ci class=\"fas fa-trash\"\u003E\u003C\u002Fi\u003E\u003C\u002Flabel\u003E";
;pug_debug_line = 13;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Clabel class=\"edit-label\" action=\"edit\" for=\"editQuestModal\" onclick=\"updateGlobalQuestId(this)\"\u003E";
;pug_debug_line = 14;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Ci class=\"fas fa-edit\"\u003E\u003C\u002Fi\u003E\u003C\u002Flabel\u003E";
}
else
if ((quest.quest_status === "DONE")) {
;pug_debug_line = 16;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Ci class=\"far fa-check-circle\" style=\"color: lightgreen; z-index: 100;\"\u003E\u003C\u002Fi\u003E";
}
else
if ((quest.quest_status === "EXPIRED")) {
;pug_debug_line = 18;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Ci class=\"far fa-clock\" style=\"color: orange; z-index: 100;\"\u003E\u003C\u002Fi\u003E";
}
else
if ((quest.quest_status === "FAILED")) {
;pug_debug_line = 20;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Ci class=\"fas fa-times\" style=\"color: red; z-index: 100;\"\u003E\u003C\u002Fi\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
}
else {
;pug_debug_line = 22;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"questDiv quest onlyTitle\""+pug_attr("id", quest.quest_identifier, true, false)+pug_attr("quest_importance_value", quest.quest_importance_value, true, false)+pug_attr("quest_started", quest.createdAt, true, false)) + "\u003E";
;pug_debug_line = 23;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Cdiv class=\"questTitleDiv\"\u003E";
;pug_debug_line = 24;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Cp class=\"title\"\u003E";
;pug_debug_line = 24;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = quest.quest_name) ? "" : pug_interp));
;pug_debug_line = 26;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Cspan class=\"createdAt\"\u003E";
;pug_debug_line = 26;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = quest.data.created_date) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fp\u003E";
;pug_debug_line = 27;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
if ((quest.quest_description)) {
;pug_debug_line = 28;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Cspan class=\"description\"\u003E";
;pug_debug_line = 28;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = quest.quest_description) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 29;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Cdiv class=\"options\"\u003E";
;pug_debug_line = 29;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + " ";
;pug_debug_line = 30;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
if ((quest.quest_status === "OPEN")) {
;pug_debug_line = 31;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Clabel class=\"trash-label\" action=\"delete\" for=\"deleteQuestModal\" onclick=\"updateGlobalQuestId(this)\"\u003E";
;pug_debug_line = 32;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Ci class=\"fas fa-trash\"\u003E\u003C\u002Fi\u003E\u003C\u002Flabel\u003E";
;pug_debug_line = 33;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Clabel class=\"edit-label\" action=\"edit\" for=\"editQuestModal\" onclick=\"updateGlobalQuestId(this)\"\u003E";
;pug_debug_line = 34;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Ci class=\"fas fa-edit\"\u003E\u003C\u002Fi\u003E\u003C\u002Flabel\u003E";
}
else
if ((quest.quest_status === "DONE")) {
;pug_debug_line = 36;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Ci class=\"far fa-check-circle\" style=\"color: lightgreen; z-index: 100;\"\u003E\u003C\u002Fi\u003E";
}
else
if ((quest.quest_status === "EXPIRED")) {
;pug_debug_line = 38;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Ci class=\"far fa-clock\" style=\"color: orange; z-index: 100;\"\u003E\u003C\u002Fi\u003E";
}
else
if ((quest.quest_status === "FAILED")) {
;pug_debug_line = 40;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002Fquest.pug";
pug_html = pug_html + "\u003Ci class=\"fas fa-times\" style=\"color: red; z-index: 100;\"\u003E\u003C\u002Fi\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
}}.call(this,"quest" in locals_for_with?locals_for_with.quest:typeof quest!=="undefined"?quest:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}