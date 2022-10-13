function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function nonplayablecharactercardTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {"website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug":".characterCardHolder\r\n    .characterCard(unselectable=\"on\")\r\n        span.characterName #{npc.name} (#{npc.age})\r\n        span.characterDescription #{npc.description}\r\n        .infoBundle\r\n            span Race\r\n                span.characterRace #{npc.race}\r\n            span Class \r\n                span.characterClass #{npc.class} \r\n            span Title \r\n                span.characterBackground #{npc.title}\r\n        .characterImageHolder \r\n            img(src=npc.picture_url alt=\"NPC Image\")"};
;var locals_for_with = (locals || {});(function (npc) {;pug_debug_line = 1;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + "\u003Cdiv class=\"characterCardHolder\"\u003E";
;pug_debug_line = 2;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + "\u003Cdiv class=\"characterCard\" unselectable=\"on\"\u003E";
;pug_debug_line = 3;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + "\u003Cspan class=\"characterName\"\u003E";
;pug_debug_line = 3;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = npc.name) ? "" : pug_interp));
;pug_debug_line = 3;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + " (";
;pug_debug_line = 3;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = npc.age) ? "" : pug_interp));
;pug_debug_line = 3;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + ")\u003C\u002Fspan\u003E";
;pug_debug_line = 4;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + "\u003Cspan class=\"characterDescription\"\u003E";
;pug_debug_line = 4;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = npc.description) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 5;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + "\u003Cdiv class=\"infoBundle\"\u003E";
;pug_debug_line = 6;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 6;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + "Race";
;pug_debug_line = 7;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + "\u003Cspan class=\"characterRace\"\u003E";
;pug_debug_line = 7;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = npc.race) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 8;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 8;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + "Class ";
;pug_debug_line = 9;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + "\u003Cspan class=\"characterClass\"\u003E";
;pug_debug_line = 9;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = npc.class) ? "" : pug_interp));
;pug_debug_line = 9;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + " \u003C\u002Fspan\u003E\u003C\u002Fspan\u003E";
;pug_debug_line = 10;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 10;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + "Title ";
;pug_debug_line = 11;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + "\u003Cspan class=\"characterBackground\"\u003E";
;pug_debug_line = 11;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = npc.title) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 12;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + "\u003Cdiv class=\"characterImageHolder\"\u003E";
;pug_debug_line = 12;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + " ";
;pug_debug_line = 13;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FnonPlayableCharacterCard.pug";
pug_html = pug_html + "\u003Cimg" + (pug_attr("src", npc.picture_url, true, false)+" alt=\"NPC Image\"") + "\u002F\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";}.call(this,"npc" in locals_for_with?locals_for_with.npc:typeof npc!=="undefined"?npc:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}