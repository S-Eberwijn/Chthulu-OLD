function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function characterlistitemTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {"website\u002Fviews\u002Fcomponents\u002F\u002FcharacterListItem.pug":".characterItem(id=`listItem-${character.character_id}`)\r\n    .classIcon \r\n        if (character.playerIcon)\r\n            img(src=`${character.playerIcon}` alt=\"Player Icon\")\r\n    .characterFullName \r\n        p #{character.name}\r\n    .characterLevel \r\n        p Lvl.\r\n        | !{' '}\r\n        p #{character.level || '?'}"};
;var locals_for_with = (locals || {});(function (character) {;pug_debug_line = 1;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcharacterListItem.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"characterItem\""+pug_attr("id", `listItem-${character.character_id}`, true, false)) + "\u003E";
;pug_debug_line = 2;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcharacterListItem.pug";
pug_html = pug_html + "\u003Cdiv class=\"classIcon\"\u003E";
;pug_debug_line = 2;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcharacterListItem.pug";
pug_html = pug_html + " ";
;pug_debug_line = 3;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcharacterListItem.pug";
if ((character.playerIcon)) {
;pug_debug_line = 4;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcharacterListItem.pug";
pug_html = pug_html + "\u003Cimg" + (pug_attr("src", `${character.playerIcon}`, true, false)+" alt=\"Player Icon\"") + "\u002F\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 5;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcharacterListItem.pug";
pug_html = pug_html + "\u003Cdiv class=\"characterFullName\"\u003E";
;pug_debug_line = 5;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcharacterListItem.pug";
pug_html = pug_html + " ";
;pug_debug_line = 6;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcharacterListItem.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 6;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcharacterListItem.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = character.name) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 7;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcharacterListItem.pug";
pug_html = pug_html + "\u003Cdiv class=\"characterLevel\"\u003E";
;pug_debug_line = 7;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcharacterListItem.pug";
pug_html = pug_html + " ";
;pug_debug_line = 8;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcharacterListItem.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 8;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcharacterListItem.pug";
pug_html = pug_html + "Lvl.\u003C\u002Fp\u003E";
;pug_debug_line = 9;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcharacterListItem.pug";
pug_html = pug_html + (null == (pug_interp = ' ') ? "" : pug_interp);
;pug_debug_line = 10;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcharacterListItem.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 10;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcharacterListItem.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = character.level || '?') ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";}.call(this,"character" in locals_for_with?locals_for_with.character:typeof character!=="undefined"?character:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}