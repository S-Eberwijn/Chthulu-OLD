function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function discordsessionembedTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {"website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug":".slideItem(id=session.id)    \r\n    .embedWrapper   \r\n        .embed\r\n            if(session.session_status === 'CREATED')\r\n                h4 #{'Session Request'}\r\n            else if(session.session_status === 'PLANNED')\r\n                h4 #{`Session ${session.session_number}`}\r\n            else if(session.session_status === 'PLAYED')\r\n                h4 #{`Session ${session.session_number}: PLAYED`}\r\n            else if(session.session_status === 'CANCELED')\r\n                h4 #{`Session ${session.session_number}: CANCELED`}\r\n            img.embedThumbnail(src=`${session.session_commander.data.picture_url}`, alt=\"\")\r\n            .embedField \r\n                h5 #{'Session Commander:'}\r\n                p.embedFieldValue.sessionCommander \r\n                    span.user #{`@${session.session_commander.player.username}`}\r\n            .embedField \r\n                h5 #{`Players (${session.session_party.length}\u002F5):`}\r\n                p.embedFieldValue(id=\"userList\") \r\n                    span.user #{`@${session.session_commander.player.username}`}\r\n                    each member in session.session_party.filter((member, index) =\u003E member != session.session_commander.player.id)\r\n                        span ,#{' '}\r\n                        span.user #{`@${member.username || 'Unknown'}`}\r\n                    \u002F\u002F- if (session.session_party.length \u003C 5 && [\"CREATED\", \"PLANNED\"].includes(session.session_status) && loggedInUser.discordID === session.session_commander.player.id) \r\n                    \u002F\u002F-     span(id=\"addPlayer\" onclick=`joinGameSession(${session.id},'241273372892200963')`).addPlayer + Add Player\r\n                        \r\n                        \r\n            .embedField \r\n                h5 #{'DM:'}\r\n                if (session.dungeon_master_id_discord != undefined)\r\n                    p.embedFieldValue(data-attribute=\"DM\")\r\n                        span.user #{`@${session.dungeon_master_id_discord.nickname || session.dungeon_master_id_discord.user.username}`}\r\n                else \r\n                    p.embedFieldValue.italic(data-attribute=\"DM\") #{'TBD'}\r\n            .embedField \r\n                h5 #{'Location:'}\r\n                p.embedFieldValue.italic #{session.location || 'Roll20 (online)'}\r\n            .embedField \r\n                h5 #{'Date & Time:'}\r\n                code #{session.date}\r\n                \u002F\u002F- p.embedFieldValue #{'Saturday (10\u002F12\u002F2022) 13:00'}\r\n            .embedField \r\n                h5 #{'Objective:'}\r\n                p.embedFieldValue.italic.objective #{session.objective || 'No data avaialable.'}\r\n        .embedFooterWrapper    \r\n            .embedFooter \r\n                .imgWrapper\r\n                    img(src=`${session.session_commander.player.displayAvatarURL()}`, alt=\"\")\r\n                p.footerText #{`Requested by ${session.session_commander.player.username} - ${session.created}`}    \r\n\r\n    .embedButtons \r\n        if(isDungeonMaster)\r\n            if(session.session_status === 'CREATED')\r\n                .button.approve(onclick=`approveGameSession(${session.id})`)\r\n                    i(class=\"fas fa-thumbs-up\")\r\n                    p Approve\r\n                .button.decline(onclick=`declineGameSession(${session.id})`)\r\n                    i(class=\"fas fa-times\")\r\n                    p Decline\r\n            else if (session.session_status === 'PLANNED')\r\n                .button.approve(onclick=`doneGameSession(${session.id})`)\r\n                    i(class=\"fas fa-thumbs-up\")\r\n                    p Played\r\n                .button.decline\r\n                    i(class=\"fas fa-times\")\r\n                    p Canceled\r\n        else if(userCharacter && (session.session_party.length \u003C 5 && ![\"PLAYED\", \"CANCELED\"].includes(session.session_status) &&  !session.session_party.map(user =\u003E user.id).includes(loggedInUser.discordID)) && session.session_commander.player.id != loggedInUser.discordID)\r\n            .button.join(onclick=`joinGameSession(${session.id})`)\r\n                i(class=\"fas fa-handshake\")\r\n                p Join"};
;var locals_for_with = (locals || {});(function (isDungeonMaster, loggedInUser, session, userCharacter) {;pug_debug_line = 1;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"slideItem\""+pug_attr("id", session.id, true, false)) + "\u003E";
;pug_debug_line = 1;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "   ";
;pug_debug_line = 2;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv class=\"embedWrapper\"\u003E";
;pug_debug_line = 2;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "  ";
;pug_debug_line = 3;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv class=\"embed\"\u003E";
;pug_debug_line = 4;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
if ((session.session_status === 'CREATED')) {
;pug_debug_line = 5;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 5;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = 'Session Request') ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
}
else
if ((session.session_status === 'PLANNED')) {
;pug_debug_line = 7;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 7;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `Session ${session.session_number}`) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
}
else
if ((session.session_status === 'PLAYED')) {
;pug_debug_line = 9;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 9;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `Session ${session.session_number}: PLAYED`) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
}
else
if ((session.session_status === 'CANCELED')) {
;pug_debug_line = 11;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Ch4\u003E";
;pug_debug_line = 11;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `Session ${session.session_number}: CANCELED`) ? "" : pug_interp)) + "\u003C\u002Fh4\u003E";
}
;pug_debug_line = 12;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cimg" + (" class=\"embedThumbnail\""+pug_attr("src", `${session.session_commander.data.picture_url}`, true, false)+" alt=\"\"") + "\u002F\u003E";
;pug_debug_line = 13;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv class=\"embedField\"\u003E";
;pug_debug_line = 13;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + " ";
;pug_debug_line = 14;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Ch5\u003E";
;pug_debug_line = 14;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = 'Session Commander:') ? "" : pug_interp)) + "\u003C\u002Fh5\u003E";
;pug_debug_line = 15;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cp class=\"embedFieldValue sessionCommander\"\u003E";
;pug_debug_line = 15;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + " ";
;pug_debug_line = 16;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cspan class=\"user\"\u003E";
;pug_debug_line = 16;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `@${session.session_commander.player.username}`) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 17;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv class=\"embedField\"\u003E";
;pug_debug_line = 17;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + " ";
;pug_debug_line = 18;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Ch5\u003E";
;pug_debug_line = 18;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `Players (${session.session_party.length}/5):`) ? "" : pug_interp)) + "\u003C\u002Fh5\u003E";
;pug_debug_line = 19;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cp class=\"embedFieldValue\" id=\"userList\"\u003E";
;pug_debug_line = 19;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + " ";
;pug_debug_line = 20;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cspan class=\"user\"\u003E";
;pug_debug_line = 20;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `@${session.session_commander.player.username}`) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 21;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
// iterate session.session_party.filter((member, index) => member != session.session_commander.player.id)
;(function(){
  var $$obj = session.session_party.filter((member, index) => member != session.session_commander.player.id);
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var member = $$obj[pug_index0];
;pug_debug_line = 22;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 22;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + ",";
;pug_debug_line = 22;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = ' ') ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 23;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cspan class=\"user\"\u003E";
;pug_debug_line = 23;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `@${member.username || 'Unknown'}`) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var member = $$obj[pug_index0];
;pug_debug_line = 22;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 22;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + ",";
;pug_debug_line = 22;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = ' ') ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 23;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cspan class=\"user\"\u003E";
;pug_debug_line = 23;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `@${member.username || 'Unknown'}`) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 28;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv class=\"embedField\"\u003E";
;pug_debug_line = 28;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + " ";
;pug_debug_line = 29;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Ch5\u003E";
;pug_debug_line = 29;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = 'DM:') ? "" : pug_interp)) + "\u003C\u002Fh5\u003E";
;pug_debug_line = 30;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
if ((session.dungeon_master_id_discord != undefined)) {
;pug_debug_line = 31;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cp class=\"embedFieldValue\" data-attribute=\"DM\"\u003E";
;pug_debug_line = 32;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cspan class=\"user\"\u003E";
;pug_debug_line = 32;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `@${session.dungeon_master_id_discord.nickname || session.dungeon_master_id_discord.user.username}`) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fp\u003E";
}
else {
;pug_debug_line = 34;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cp class=\"embedFieldValue italic\" data-attribute=\"DM\"\u003E";
;pug_debug_line = 34;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = 'TBD') ? "" : pug_interp)) + "\u003C\u002Fp\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 35;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv class=\"embedField\"\u003E";
;pug_debug_line = 35;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + " ";
;pug_debug_line = 36;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Ch5\u003E";
;pug_debug_line = 36;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = 'Location:') ? "" : pug_interp)) + "\u003C\u002Fh5\u003E";
;pug_debug_line = 37;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cp class=\"embedFieldValue italic\"\u003E";
;pug_debug_line = 37;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = session.location || 'Roll20 (online)') ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 38;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv class=\"embedField\"\u003E";
;pug_debug_line = 38;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + " ";
;pug_debug_line = 39;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Ch5\u003E";
;pug_debug_line = 39;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = 'Date & Time:') ? "" : pug_interp)) + "\u003C\u002Fh5\u003E";
;pug_debug_line = 40;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Ccode\u003E";
;pug_debug_line = 40;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = session.date) ? "" : pug_interp)) + "\u003C\u002Fcode\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 42;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv class=\"embedField\"\u003E";
;pug_debug_line = 42;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + " ";
;pug_debug_line = 43;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Ch5\u003E";
;pug_debug_line = 43;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = 'Objective:') ? "" : pug_interp)) + "\u003C\u002Fh5\u003E";
;pug_debug_line = 44;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cp class=\"embedFieldValue italic objective\"\u003E";
;pug_debug_line = 44;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = session.objective || 'No data avaialable.') ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 45;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv class=\"embedFooterWrapper\"\u003E";
;pug_debug_line = 45;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "   ";
;pug_debug_line = 46;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv class=\"embedFooter\"\u003E";
;pug_debug_line = 46;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + " ";
;pug_debug_line = 47;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv class=\"imgWrapper\"\u003E";
;pug_debug_line = 48;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cimg" + (pug_attr("src", `${session.session_commander.player.displayAvatarURL()}`, true, false)+" alt=\"\"") + "\u002F\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 49;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cp class=\"footerText\"\u003E";
;pug_debug_line = 49;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = `Requested by ${session.session_commander.player.username} - ${session.created}`) ? "" : pug_interp));
;pug_debug_line = 49;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "    \u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 51;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv class=\"embedButtons\"\u003E";
;pug_debug_line = 51;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + " ";
;pug_debug_line = 52;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
if ((isDungeonMaster)) {
;pug_debug_line = 53;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
if ((session.session_status === 'CREATED')) {
;pug_debug_line = 54;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"button approve\""+pug_attr("onclick", `approveGameSession(${session.id})`, true, false)) + "\u003E";
;pug_debug_line = 55;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Ci class=\"fas fa-thumbs-up\"\u003E\u003C\u002Fi\u003E";
;pug_debug_line = 56;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 56;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "Approve\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 57;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"button decline\""+pug_attr("onclick", `declineGameSession(${session.id})`, true, false)) + "\u003E";
;pug_debug_line = 58;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Ci class=\"fas fa-times\"\u003E\u003C\u002Fi\u003E";
;pug_debug_line = 59;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 59;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "Decline\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E";
}
else
if ((session.session_status === 'PLANNED')) {
;pug_debug_line = 61;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"button approve\""+pug_attr("onclick", `doneGameSession(${session.id})`, true, false)) + "\u003E";
;pug_debug_line = 62;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Ci class=\"fas fa-thumbs-up\"\u003E\u003C\u002Fi\u003E";
;pug_debug_line = 63;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 63;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "Played\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 64;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv class=\"button decline\"\u003E";
;pug_debug_line = 65;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Ci class=\"fas fa-times\"\u003E\u003C\u002Fi\u003E";
;pug_debug_line = 66;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 66;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "Canceled\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E";
}
}
else
if ((userCharacter && (session.session_party.length < 5 && !["PLAYED", "CANCELED"].includes(session.session_status) &&  !session.session_party.map(user => user.id).includes(loggedInUser.discordID)) && session.session_commander.player.id != loggedInUser.discordID)) {
;pug_debug_line = 68;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"button join\""+pug_attr("onclick", `joinGameSession(${session.id})`, true, false)) + "\u003E";
;pug_debug_line = 69;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Ci class=\"fas fa-handshake\"\u003E\u003C\u002Fi\u003E";
;pug_debug_line = 70;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 70;pug_debug_filename = "website\u002Fviews\u002Fcomponents\u002F\u002FdiscordSessionEmbed.pug";
pug_html = pug_html + "Join\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";}.call(this,"isDungeonMaster" in locals_for_with?locals_for_with.isDungeonMaster:typeof isDungeonMaster!=="undefined"?isDungeonMaster:undefined,"loggedInUser" in locals_for_with?locals_for_with.loggedInUser:typeof loggedInUser!=="undefined"?loggedInUser:undefined,"session" in locals_for_with?locals_for_with.session:typeof session!=="undefined"?session:undefined,"userCharacter" in locals_for_with?locals_for_with.userCharacter:typeof userCharacter!=="undefined"?userCharacter:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}