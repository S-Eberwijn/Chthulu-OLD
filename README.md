
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
If you want to add the Chthulu to your Discord server, click [here](https://discord.com/oauth2/authorize?client_id=532524817740464138&permissions=0&scope=bot%20applications.commands).

# Commands

We have carefully constructed our commands to ease their use. All commands are written in lowercase and multiple words are seperated by a hyphen ("-").

Some comands do require manditory parameters to work properly, the manditory parameters are indicated with pointy brackets (\<>) in the table below like so: \<manditory-parameter>. 

Other commands do offer additional customisation options, these are indicated with square brackets (\[ \]) in the table below like so: \[optional-parameter\].

## 1. General
| Command   | Parameters    | Description     |
| :------ | :---------- | :---------- |
| /character | [@User]   | This command will show a character-card the active character of the mentioned user. (if the target-user has a character configured)   |
| /condition     | [condition-name] | This command will provide basic information about the given condition. |
| /magic-item-list |    | Currently unavailable  |
| /npc           | [npc-name]  | This command will show a character-card the NPC with a given name (leaving the name-field blank will give 2 dropdown menus to select an NPC). |
| /roll-check    | [modifier] [roll twice] | This command will roll 1 d20, You can use parameters to add a skillmodefier(a numeric value) or add a second dice by not leaving the "roll-twice"-field |
| /roll-dice  | [d4] [d6] [d8] [d10] [d12] [d20] [d100] [modifier]  | This command allows you to roll any combination of the 7 most commun dice-types (upto 24 dice).    |
| /roll-stats    | \<amount-of-dice> \<dice-type> [drop-highest] [drop-lowest] [modifier] | This command will generate 6 random stats based on the given parameters. we recommend 4 d6 drop-lowest 1. <br/> - You can chose how many dice are rolled per stat,<br/> -  What type of dice (only one dicekind can be used).<br/> -   It's possible to add an additional modifier (to garantee a minimum value for stats) <br/>- And you can chose to ignore the highest/lowest x dice per stat |
| /spell         | \<spell-name>    | This command will provide basic information about the given spell. |
| /weapon        | [weapon-name]   | This command will provide basic information about the given weapon.    | 


## 2. Payers

| Command | Parameters  | Description       |
| :------ | :---------- | :---------------- |
| /cc | | This command will create a new text channel, in which Chthulu will ask the user some question about his/her soon to be character. Once all questions have been filled in, the character will be created and assigned to the user. |
| /quests            | &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | Chthulu will show a list of all ongoing quests, which can be configured and updated on the website.  |
| /session-request        |  | A user with a configured character can use this command to request a new session |
| /session-board          |   | A user can see all planned session in a nicely formatted embed. |

## 3. Game Masters

| Command   | Parameters   | Description     |
| :-------- | :----------- | :-------------- |
| /add-character-channel   | \<channel-name>  | Add in-character channel (voice), so if someone has a character on that server configured, their name will change to his/her/they character's.  |
| /impersonate  |   | Chthulu will show a list where the Dungeon Master can choose which create to impersonate. When the Dungeon Master is in an 'in-character'-channel, their name will change to the responding NPC.   |
| /nonPlayableCharacterCreation |   | A Dungeon Master can use this command to create a new NPC. Chthulu will create a new channel and ask questions about the new, soon to be, NPC. Once finished, the NPC will be stored in the database and the Dungeon Master can start impersonating the creature. |
| /set-level  | \<@User> \<1-20> | A Dungeon Master can use this command to set a new level to the provided user, considering the user has an active character configured.  |
| /stop-impersonating   | &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;| A Dungeon Master can use this command to stop impersonating the previously chosen creature.   |

# Feedback

Your feedback is important to us, we are only a small team who intensively use the bot and therefore might just miss some things. You can leave your feedback [in this form](https://forms.gle/bi1Kng7JG2UkW9618) so we can implement it when suited.

# Contribution

No formal way to contribute *yet* Just leave a message and we'll figure things out.
