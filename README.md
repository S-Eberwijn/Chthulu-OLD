
<p align="center"><img align="center" src="./website/public/favicon.ico?raw=true" height="200"></p>
<h1 align="center">Chthulu</h1>

<p align="center">
<img align="center" src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white">
<img align="center" src="https://img.shields.io/badge/Pug-E3C29B?style=for-the-badge&logo=pug&logoColor=black">
<img align="center" src="https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black">
<img align="center" src="https://img.shields.io/badge/replit-667881?style=for-the-badge&logo=replit&logoColor=white">
<img align="center" src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E">
<img align="center" src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white">
</p>

# Intro
**Chthulu** is a Great Old One of great power who lies in a death-like slumber beneath the **Pacific Ocean** in his sunken city of **R'lyeh**. He remains a dominant presence in the eldritch dealings on our world. From his cave he rules over the fantasies of many **Dungeons & Dragons** players, guiding them on their adventure through this website. Here he will provide **information** over the party you are traveling with, the **powers** one can gain, and **plan** your party's next move.

# Getting started
If you want to add the Chthulu to your Discord server, click [here](https://discord.com/oauth2/authorize?client_id=532524817740464138&permissions=0&scope=bot%20applications.commands)

# Commands
<table>
<tr>
<th colspan="3" align="left">
<font size=5>1. General </font>
</th>
</tr>
<tr>
<th colspan="3" align="left">
</th>
</tr>
<tr>
<th align="left">
Command name
</th>
<th align="left">
Options
</th>
<th align="left">
Description
</th>
</tr>
<tr>
<td>

/`spell`  

</td>
<td>

\<spell-name\>
</td>
<td>
This command will provide more information about the given spell-name.
</td>

</tr>
<tr>
<td>

/`condition`

</td>
<td>

\<condition-name\>
</td>
<td>
This command will provide more information about the given condition-name.
</td>

</tr>
<tr>
<tr>
<td>

/`weapon`
</td>
<td>

\<weapon-name\>
</td>
<td>
A user with a configured character can use this command to request a new session, as well as see all planned session in a nicely formatted embed.
</td>

</tr>
<tr>
<td>

/`magicItemList`

</td>
<td>

\<magic-item-name\>
</td>
<td>
Chthulu will give a list with magic items.
</td>

</tr>
<td>

/`npc`  

</td>
<td>
[npc-name]
</td>
<td>
TODO
</td>

</tr>

<tr>
<td>

/`roll-dice`

</td>
<td>
[d4] [d6] [d8] [d10] [d12] [d20] [d100] [modifier]
</td>
<td>
TODO
</td>
</tr>
<tr>
<td>

/`roll-check`

</td>
<td>
[modifier] [roll twice]
</td>
<td>
TODO
</td>
</tr>

<tr>
<th colspan="3" align="left">
</th>
</tr>
<tr>
<th colspan="3" align="left">
<font size="+2">2. Players </font>
</th>
</tr>
<tr>
<th colspan="3" align="left">
</th>
</tr>
<tr>
<th align="left">
Command name
</th>
<th align="left">
Options
</th>
<th align="left">
Description
</th>
</tr>
<tr>
<td>

/`characterCreation`

</td>
<td>
</td>
<td>

This command will create a new text channel, in which Chthulu will ask the user some question about his/her soon to be character. Once all questions have been filled in, the character will be created and assigned to the user.

</td>

</tr>
<tr>
<td>

/`character`

</td>
<td>

[@User]

</td>
<td>

When a user has a character configured, the can view their (or someone else's) by using this command.

</td>

</tr>
<tr>
<td>

/`quests`

</td>
<td>
</td>
<td>

Chthulu will show a list of all ongoing quests, which can be configured and updated on the website.

</td>

</tr>
<tr>
<td>

/`session`    

</td>
<td>
<'request', 'board'>
</td>
<td>
A user with a configured character can use this command to request a new session, as well as see all planned session in a nicely formatted embed.
</td>

</tr>
<tr>
<td>

/`magicItemList`

</td>
<td>
</td>
<td>
Chthulu will give a list with magic items.
</td>

</tr>
<tr>
<td>

/`roll-stats`

</td>
<td>
[amount-of-dice] [drop-lowest] [drop-highest] [modifier]
</td>
<td>
TODO
</td>

</tr>
<tr>
<th colspan="3" align="left">
</th>
</tr>
<tr>
<th colspan="3" align="left">
<font size="+2">3. Dungeon Masters </font>
</th>
</tr>
<tr>
<th colspan="3" align="left">
</th>
</tr>
<tr>
<th align="left">
Command name
</th>
<th align="left">
Options
</th>
<th align="left">
Description
</th>
</tr>
<td>

/`add-character-channel`

</td>
<td>

\<channel-name\>

</td>
<td>

Add in-character channel (voice), so if someone has a character on that server configured, their name will change to his/her/they character's.

</td>

</tr>
<tr>
<td>

/`nonPlayableCharacterCreation`

</td>
<td>
</td>
<td>

A Dungeon Master can use this command to create a new NPC. Chthulu will create a new channel and ask questions about the new, soon to be, NPC. Once finished, the NPC will be stored in the database and the Dungeon Master can start impersonating the creature.

</td>

</tr>
<tr>
<td>

/`set-level`

</td>
<td>

\<@User\> \<1-20\>

</td>
<td>

A Dungeon Master can use this command to set a new level to the provided user, considering the user has an active character configured.

</td>

</tr>
<tr>
<td>

/`impersonate`  

</td>
<td>
</td>
<td>

Chthulu will show a list where the Dungeon Master can choose which create to impersonate. When the Dungeon Master is in an 'in-character'-channel, their name will change to the responding NPC.

</td>

</tr>
<tr>
<td>

/`stop-impersonating`

</td>
<td>
</td>
<td>

A Dungeon Master can use this command to stop impersonating the previously chosen creature.

</td>

</tr>
</table>




# Developers information
##### .env
```
APP_ENV=TEST

BOT_TOKEN=
AUTHOR=

OATH2_CLIENT_ID=
OATH2_CLIENT_SECRET=
OATH2_CLIENT_GRANT_TYPE=

WB_BASE_URL=http://localhost
WB_PORT=8080
SECRET_KEY=

FS_PROJECT_ID=
FS_PRIVATE_KEY_ID=
FS_PRIVATE_KEY=
FS_CLIENT_EMAIL=
FS_CLIENT_ID=
FS_CERT_URL=
FS_DATABASE_NAME=
```

##### replit shell
```
curl -sL https://repl-deploy.vercel.app/ -o repl.deploy
chmod +x ./repl.deploy 
change
```
<!-- on replit use double quotes for FS_PRIVATE_KEY and JSON.parse it -->
