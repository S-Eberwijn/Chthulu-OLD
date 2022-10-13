function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_has_own_property=Object.prototype.hasOwnProperty;
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}
function pug_style(r){if(!r)return"";if("object"==typeof r){var t="";for(var e in r)pug_has_own_property.call(r,e)&&(t=t+e+":"+r[e]+";");return t}return r+""}function createsessionpopupTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {"website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug":"input(action=\"create\" type=\"checkbox\" id=\"createSessionModal\")\r\nlabel(for=\"createSessionModal\" class=\"new-session-label\")\r\nlabel(for=\"createSessionModal\" action=\"create\").modal-background\r\n.modal(action=\"create\").session\r\n    .modal-header\r\n        .icon\r\n            .bot-icon\r\n                img(src=bot_icon alt=\"Chthulu Avatar\")\r\n        h3 Create Session\r\n        label(for=\"createSessionModal\")\r\n            i.fa-solid.fa-xmark.fa-xl\r\n    .modal-content\r\n        form\r\n            .label-input-section\r\n                label.optional#players Players (1\u002F5)\r\n                    .userListBox\r\n                        .leftSide\r\n                            .userDisplay.locked\r\n                                .userAvatarWrapper \r\n                                    img(src=loggedInUser.avatar alt=\"User Avatar\") \r\n                                .userName #{`${loggedInUser.username}`}\r\n                            \r\n                        .rightSide\r\n                            \r\n                    .select-wrapper \r\n                        .select \r\n                            .select_trigger \r\n                                span( id=\"quest_priority\") Select players \r\n                                i.fas.fa-chevron-down\r\n                            .custom-options \r\n                                each player, index in possiblePlayers\r\n                                    if player.id === loggedInUser.discordID\r\n                                        span.custom-option(data-value=`${player.id}` style=`--index:${index};`).selected.locked \r\n                                            .playerIcon\r\n                                                img(src=`${player.avatarURL}` alt=\"User Avatar\")\r\n                                            span.text #{`${player.username}`}\r\n                                            span.character #{`[${player.characterName}]`}\r\n                                    else \r\n                                        span.custom-option(data-value=`${player.id}` style=`--index:${index};`) \r\n                                            .playerIcon\r\n                                                img(src=`${player.avatarURL}` alt=\"User Avatar\")\r\n                                            span.text #{`${player.username}`}\r\n                                            span.character #{`[${player.characterName}]`}\r\n            .label-input-section\r\n                label.required Objective\r\n                textarea(cols=\"5\" rows=\"5\" maxlength=\"400\" spellcheck=\"false\" autocomplete=\"off\" id=\"session_objective\" oninput=\"updateInput(this)\" placeholder=`e.g. \"Defeat the BBEG at his lair.\"`).description-field\r\n\r\n            .label-input-section\r\n                label().optional Location\r\n                input(type=\"text\" autocomplete=\"off\" spellcheck=\"false\" id=\"session_location\" oninput=\"updateInput(this)\" onkeydown=\"return event.key != 'Enter';\" maxlength=\"30\" placeholder=\"Roll20 (online)\").title-field\r\n\r\n            .label-input-section\r\n                label.required Date - Time [DD\u002FMM\u002FYYYY HH:MM]\r\n                input(type=\"text\" autocomplete=\"off\" spellcheck=\"false\" id=\"session_date\" oninput=\"updateInput(this)\" onkeydown=\"return event.key != 'Enter';\" maxlength=\"16\" placeholder=`e.g. \"20\u002F05\u002F2025 13:15\"`).title-field\r\n    .modal-footer\r\n        .button-wrapper\r\n            input(id=\"create_quest\" type=\"button\" value=\"Create\" disabled=\"true\" onclick=\"createGameSession(this)\")\r\n            i.fa.fa-spinner.fa-spin.fa-align-center"};
;var locals_for_with = (locals || {});(function (bot_icon, loggedInUser, possiblePlayers) {;pug_debug_line = 1;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cinput action=\"create\" type=\"checkbox\" id=\"createSessionModal\"\u002F\u003E";
;pug_debug_line = 2;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Clabel class=\"new-session-label\" for=\"createSessionModal\"\u003E\u003C\u002Flabel\u003E";
;pug_debug_line = 3;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Clabel class=\"modal-background\" for=\"createSessionModal\" action=\"create\"\u003E\u003C\u002Flabel\u003E";
;pug_debug_line = 4;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"modal session\" action=\"create\"\u003E";
;pug_debug_line = 5;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"modal-header\"\u003E";
;pug_debug_line = 6;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"icon\"\u003E";
;pug_debug_line = 7;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"bot-icon\"\u003E";
;pug_debug_line = 8;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cimg" + (pug_attr("src", bot_icon, true, false)+" alt=\"Chthulu Avatar\"") + "\u002F\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 9;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Ch3\u003E";
;pug_debug_line = 9;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "Create Session\u003C\u002Fh3\u003E";
;pug_debug_line = 10;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Clabel for=\"createSessionModal\"\u003E";
;pug_debug_line = 11;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Ci class=\"fa-solid fa-xmark fa-xl\"\u003E\u003C\u002Fi\u003E\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 12;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"modal-content\"\u003E";
;pug_debug_line = 13;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cform\u003E";
;pug_debug_line = 14;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"label-input-section\"\u003E";
;pug_debug_line = 15;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Clabel class=\"optional\" id=\"players\"\u003E";
;pug_debug_line = 15;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "Players (1\u002F5)";
;pug_debug_line = 16;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"userListBox\"\u003E";
;pug_debug_line = 17;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"leftSide\"\u003E";
;pug_debug_line = 18;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"userDisplay locked\"\u003E";
;pug_debug_line = 19;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"userAvatarWrapper\"\u003E";
;pug_debug_line = 19;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + " ";
;pug_debug_line = 20;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cimg" + (pug_attr("src", loggedInUser.avatar, true, false)+" alt=\"User Avatar\"") + "\u002F\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 21;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"userName\"\u003E";
;pug_debug_line = 21;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `${loggedInUser.username}`) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 23;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"rightSide\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 25;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"select-wrapper\"\u003E";
;pug_debug_line = 25;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + " ";
;pug_debug_line = 26;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"select\"\u003E";
;pug_debug_line = 26;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + " ";
;pug_debug_line = 27;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"select_trigger\"\u003E";
;pug_debug_line = 27;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + " ";
;pug_debug_line = 28;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cspan id=\"quest_priority\"\u003E";
;pug_debug_line = 28;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "Select players \u003C\u002Fspan\u003E";
;pug_debug_line = 29;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Ci class=\"fas fa-chevron-down\"\u003E\u003C\u002Fi\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 30;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"custom-options\"\u003E";
;pug_debug_line = 30;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + " ";
;pug_debug_line = 31;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
// iterate possiblePlayers
;(function(){
  var $$obj = possiblePlayers;
  if ('number' == typeof $$obj.length) {
      for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
        var player = $$obj[index];
;pug_debug_line = 32;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
if (player.id === loggedInUser.discordID) {
;pug_debug_line = 33;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cspan" + (" class=\"custom-option selected locked\""+pug_attr("data-value", `${player.id}`, true, false)+pug_attr("style", pug_style(`--index:${index};`), true, false)) + "\u003E";
;pug_debug_line = 33;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + " ";
;pug_debug_line = 34;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"playerIcon\"\u003E";
;pug_debug_line = 35;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cimg" + (pug_attr("src", `${player.avatarURL}`, true, false)+" alt=\"User Avatar\"") + "\u002F\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 36;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cspan class=\"text\"\u003E";
;pug_debug_line = 36;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `${player.username}`) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 37;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cspan class=\"character\"\u003E";
;pug_debug_line = 37;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `[${player.characterName}]`) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E";
}
else {
;pug_debug_line = 39;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cspan" + (" class=\"custom-option\""+pug_attr("data-value", `${player.id}`, true, false)+pug_attr("style", pug_style(`--index:${index};`), true, false)) + "\u003E";
;pug_debug_line = 39;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + " ";
;pug_debug_line = 40;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"playerIcon\"\u003E";
;pug_debug_line = 41;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cimg" + (pug_attr("src", `${player.avatarURL}`, true, false)+" alt=\"User Avatar\"") + "\u002F\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 42;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cspan class=\"text\"\u003E";
;pug_debug_line = 42;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `${player.username}`) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 43;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cspan class=\"character\"\u003E";
;pug_debug_line = 43;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `[${player.characterName}]`) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E";
}
      }
  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;
      var player = $$obj[index];
;pug_debug_line = 32;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
if (player.id === loggedInUser.discordID) {
;pug_debug_line = 33;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cspan" + (" class=\"custom-option selected locked\""+pug_attr("data-value", `${player.id}`, true, false)+pug_attr("style", pug_style(`--index:${index};`), true, false)) + "\u003E";
;pug_debug_line = 33;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + " ";
;pug_debug_line = 34;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"playerIcon\"\u003E";
;pug_debug_line = 35;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cimg" + (pug_attr("src", `${player.avatarURL}`, true, false)+" alt=\"User Avatar\"") + "\u002F\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 36;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cspan class=\"text\"\u003E";
;pug_debug_line = 36;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `${player.username}`) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 37;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cspan class=\"character\"\u003E";
;pug_debug_line = 37;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `[${player.characterName}]`) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E";
}
else {
;pug_debug_line = 39;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cspan" + (" class=\"custom-option\""+pug_attr("data-value", `${player.id}`, true, false)+pug_attr("style", pug_style(`--index:${index};`), true, false)) + "\u003E";
;pug_debug_line = 39;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + " ";
;pug_debug_line = 40;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"playerIcon\"\u003E";
;pug_debug_line = 41;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cimg" + (pug_attr("src", `${player.avatarURL}`, true, false)+" alt=\"User Avatar\"") + "\u002F\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 42;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cspan class=\"text\"\u003E";
;pug_debug_line = 42;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `${player.username}`) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 43;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cspan class=\"character\"\u003E";
;pug_debug_line = 43;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `[${player.characterName}]`) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E";
}
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 44;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"label-input-section\"\u003E";
;pug_debug_line = 45;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Clabel class=\"required\"\u003E";
;pug_debug_line = 45;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "Objective\u003C\u002Flabel\u003E";
;pug_debug_line = 46;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Ctextarea class=\"description-field\" cols=\"5\" rows=\"5\" maxlength=\"400\" spellcheck=\"false\" autocomplete=\"off\" id=\"session_objective\" oninput=\"updateInput(this)\" placeholder=\"e.g. &quot;Defeat the BBEG at his lair.&quot;\"\u003E\u003C\u002Ftextarea\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 48;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"label-input-section\"\u003E";
;pug_debug_line = 49;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Clabel class=\"optional\"\u003E";
;pug_debug_line = 49;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "Location\u003C\u002Flabel\u003E";
;pug_debug_line = 50;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cinput class=\"title-field\" type=\"text\" autocomplete=\"off\" spellcheck=\"false\" id=\"session_location\" oninput=\"updateInput(this)\" onkeydown=\"return event.key != 'Enter';\" maxlength=\"30\" placeholder=\"Roll20 (online)\"\u002F\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 52;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"label-input-section\"\u003E";
;pug_debug_line = 53;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Clabel class=\"required\"\u003E";
;pug_debug_line = 53;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "Date - Time [DD\u002FMM\u002FYYYY HH:MM]\u003C\u002Flabel\u003E";
;pug_debug_line = 54;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cinput class=\"title-field\" type=\"text\" autocomplete=\"off\" spellcheck=\"false\" id=\"session_date\" oninput=\"updateInput(this)\" onkeydown=\"return event.key != 'Enter';\" maxlength=\"16\" placeholder=\"e.g. &quot;20\u002F05\u002F2025 13:15&quot;\"\u002F\u003E\u003C\u002Fdiv\u003E\u003C\u002Fform\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 55;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"modal-footer\"\u003E";
;pug_debug_line = 56;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cdiv class=\"button-wrapper\"\u003E";
;pug_debug_line = 57;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Cinput id=\"create_quest\" type=\"button\" value=\"Create\" disabled=\"true\" onclick=\"createGameSession(this)\"\u002F\u003E";
;pug_debug_line = 58;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FcreateSessionPopup.pug";
pug_html = pug_html + "\u003Ci class=\"fa fa-spinner fa-spin fa-align-center\"\u003E\u003C\u002Fi\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";}.call(this,"bot_icon" in locals_for_with?locals_for_with.bot_icon:typeof bot_icon!=="undefined"?bot_icon:undefined,"loggedInUser" in locals_for_with?locals_for_with.loggedInUser:typeof loggedInUser!=="undefined"?loggedInUser:undefined,"possiblePlayers" in locals_for_with?locals_for_with.possiblePlayers:typeof possiblePlayers!=="undefined"?possiblePlayers:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}