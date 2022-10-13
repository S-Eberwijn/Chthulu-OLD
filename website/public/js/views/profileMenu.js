function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function profilemenuTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {"website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug":"\u002F\u002F- button(onclick=\"window.location='http:\u002F\u002Flocalhost:8080\u002Fauth\u002Flogout';\") Logout\r\n.action \r\n    .profileHeader\r\n        .profileImageWrapper(onclick=\"profileMenuToggle();\")    \r\n            img(src=loggedInUser.avatar, alt=\"\" onfocusout=\"profileMenuToggle();\")\r\n        span#username #{`${loggedInUser.username}#${loggedInUser.discriminator}` }\r\n            if (isDungeonMaster === true)\r\n                span Dungeon Master \r\n            else if (userCharacter) \r\n                span #{`${userCharacter.name}` }\r\n    a(href=`${baseURL}\u002Fauth\u002Flogout`)   \r\n            .menuCategoryItem#profileHeader\r\n                span.menuIcon  "};
;var locals_for_with = (locals || {});(function (baseURL, isDungeonMaster, loggedInUser, userCharacter) {;pug_debug_line = 2;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
pug_html = pug_html + "\u003Cdiv class=\"action\"\u003E";
;pug_debug_line = 2;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
pug_html = pug_html + " ";
;pug_debug_line = 3;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
pug_html = pug_html + "\u003Cdiv class=\"profileHeader\"\u003E";
;pug_debug_line = 4;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
pug_html = pug_html + "\u003Cdiv class=\"profileImageWrapper\" onclick=\"profileMenuToggle();\"\u003E";
;pug_debug_line = 4;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
pug_html = pug_html + "   ";
;pug_debug_line = 5;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
pug_html = pug_html + "\u003Cimg" + (pug_attr("src", loggedInUser.avatar, true, false)+" alt=\"\" onfocusout=\"profileMenuToggle();\"") + "\u002F\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 6;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
pug_html = pug_html + "\u003Cspan id=\"username\"\u003E";
;pug_debug_line = 6;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `${loggedInUser.username}#${loggedInUser.discriminator}`) ? "" : pug_interp));
;pug_debug_line = 7;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
if ((isDungeonMaster === true)) {
;pug_debug_line = 8;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 8;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
pug_html = pug_html + "Dungeon Master \u003C\u002Fspan\u003E";
}
else
if ((userCharacter)) {
;pug_debug_line = 10;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 10;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `${userCharacter.name}`) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 11;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
pug_html = pug_html + "\u003Ca" + (pug_attr("href", `${baseURL}/auth/logout`, true, false)) + "\u003E";
;pug_debug_line = 11;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
pug_html = pug_html + "  ";
;pug_debug_line = 12;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
pug_html = pug_html + "\u003Cdiv class=\"menuCategoryItem\" id=\"profileHeader\"\u003E";
;pug_debug_line = 13;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
pug_html = pug_html + "\u003Cspan class=\"menuIcon\"\u003E";
;pug_debug_line = 13;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FprofileMenu.pug";
pug_html = pug_html + " \u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E";}.call(this,"baseURL" in locals_for_with?locals_for_with.baseURL:typeof baseURL!=="undefined"?baseURL:undefined,"isDungeonMaster" in locals_for_with?locals_for_with.isDungeonMaster:typeof isDungeonMaster!=="undefined"?isDungeonMaster:undefined,"loggedInUser" in locals_for_with?locals_for_with.loggedInUser:typeof loggedInUser!=="undefined"?loggedInUser:undefined,"userCharacter" in locals_for_with?locals_for_with.userCharacter:typeof userCharacter!=="undefined"?userCharacter:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}