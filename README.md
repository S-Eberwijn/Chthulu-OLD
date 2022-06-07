
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
### General
| <div style="width:220px">Command name</div>  | <div style="width:250px">Options</div>             |  Description  |
| -------------  | -------------       | ------------- |
| /`spell`       | \<spell-name\>      | This command will provide more information about the given spell-name. |
| /`condition`   | \<condition-name\>  | This command will provide more information about the given condition-name. |
| /`weapon`      | \<weapon -name\>    | This command will provide more information about the given weapon-name. |
| /`magic-item`  | \<magic-item-name\> | This command will provide more information about the given magic-item-name. |
| /`npc`         | [npc-name]          | TODO |
| /`roll-dice`   | [d4] [d6] [d8] [d10] [d12] [d20] [d100] [modifier]  | TODO |
| /`roll-check`  | [modifier] [roll twice]  | TODO |

### Players
| Command name | <div style="width:250px">Options</div>           |  Description  |
| --------------------- | --------------------- | ------------- |
| /`characterCreation`  |                       | This command will create a new text channel, in which Chthulu will ask the user some question about his/her soon to be character. Once all questions have been filled in, the character will be created and assigned to the user. |
| /`character`          | [@User]               | When a user has a character configured, the can view their (or someone else's) by using this command. |
| /`quests`             |                       | Chthulu will show a list of all ongoing quests, which can be configured and updated on the website. |
| /`session`            | <'request', 'board'>  | A user with a configured character can use this command to request a new session, as well as see all planned session in a nicely formatted embed. |
| /`magicItemList`      |                       | Chthulu will give a list with magic items. |
| /`roll-stats`         | [amount-of-dice] [drop-lowest] [drop-highest] [modifier]  | TODO |
|  | | |

### Dungeon Masters
| Command name <img width=220/>   | <div style="width:250px">Options</div>              |  Description  |
| -------------                    | -------------        | ------------- |
| /`add-character-channel`         | \<channel-name\>     | Add in-character channel (voice), so if someone has a character on that server configured, their name will change to his/her/they character's. |
| /`nonPlayableCharacterCreation`  |                      | A Dungeon Master can use this command to create a new NPC. Chthulu will create a new channel and ask questions about the new, soon to be, NPC. Once finished, the NPC will be stored in the database and the Dungeon Master can start impersonating the creature. |
| /`set-level`                     | \<@User\> \<1-20\>   | A Dungeon Master can use this command to set a new level to the provided user, considering the user has an active character configured. |
| /`stop-impersonating`            |                      | A Dungeon Master can use this command to stop impersonating the previously chosen creature. |
| /`impersonate`                   |                      | Chthulu will show a list where the Dungeon Master can choose which create to impersonate. When the Dungeon Master is in an 'in-character'-channel, their name will change to the responding NPC. |

<table>
<tr>
<th align="center">
<img width="294" height="1">
<p>
<small>
Command name
</small>
</p>
</th>
<th align="center">
<img width="294" height="1">
<p>
<small>
Options
</small>
</p>
</th>
<th align="center">
<img width="294" height="1">
<p>
<small>
Description
</small>
</p>
</th>
</tr>
<tr>
<td>
test 1x2
</td>
<td>
test 2x2

</td>
<td>
test 3x2
</td>

</tr>
<tr>
<td align="center">
Column 1
</td>
<td align="center">
Column 2
</td>
</tr>
</table>

<table>
<tr>
<th align="center">
<img width="294" height="1">
<p>
<small>
Command name
</small>
</p>
</th>
<th align="center">
<img width="294" height="1">
<p>
<small>
Options
</small>
</p>
</th>
<th align="center">
<img width="294" height="1">
<p>
<small>
Description
</small>
</p>
</th>
</tr>
<tr>
<td>
test 1x2
</td>
<td>
test 2x2

</td>
<td>
test 3x2
</td>

</tr>
<tr>
<td align="center">
Column 1
</td>
<td align="center">
Column 2
</td>
</tr>
</table>

# Developers information
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

<!-- on replit use double quotes for FS_PRIVATE_KEY and JSON.parse it -->
