const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 8080;
const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end("I'm alive");
  } else {
    res.writeHead(405, { 'Content-Type': 'text/html' });
    res.end("Method Not Allowed");
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

const Discord = require("discord.js");
const {
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  GatewayIntentBits,
} = require("discord.js");
const { MessageButton } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const {
  SUGGESTION,
  CHANGE,
  VERIF_PERMISSION,
  GATE_VISA,
  VOICE_GATES,
  VERIF_LOGS,
  VISITOR,
  CITIZEN,
  BOY,
  GIRL,
  ADULT_ROLE,
  MINOR_ROLE,
  BLACKLIST,
  REPORT_MENTION,
  REPORT_PERMISSION,
  REPORT_LOGS,
  REPORT_WAIT,
  REPORT_VOICES,
  STARS,
} = require("./config.json");
const { Console } = require("console");

//---------------------------------------------//

console.log("Project is running");
client.on("ready", () =>
  console.log(`logged in as - ${client.user.username} - `),
);

client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase().includes("slm")) {
    message.reply("Mar7ba");
    console.log("slm");
  }

  if (message.content.toLowerCase().includes("a7la nass")) {
    message.reply("3aychou L7ob");
    console.log("a7la nass");
  }

  if (message.content.toLowerCase().includes("<@747962450392907948>")) {
    message.reply("baz raw raged hathaka tayechlou msg fel prv");
    console.log("a7la nass");
  }

  if (message.author.bot) return;

//----------Change Name-------//

if (message.channelId === CHANGE) {
  if (message.content.toLowerCase() === "reset") {
    try {

      await message.member.setNickname(null);
      const name = message.member.nickname || message.member.user.username;

      const data = fs.readFileSync('Clan.txt', 'utf8');
      const clanData = data.split('\n').map(line => line.split('/'));
      const clanRole = clanData.find(([clanId, clanTag]) => message.member.roles.cache.has(clanId));

      if (clanRole) {
        const [, clanTag] = clanRole;
        await message.member.setNickname(`${clanTag} | ${name}`);
        console.log("Name Changed with Clan Tag");
      } else {
        await message.member.setNickname(`𝗗𝗞 | ${name}`);
        console.log("Name Changed with Server Tag");
      }

      message.react("✅");
      console.log("Name Changed");
    } catch (error) {
      console.error(error);
      message.react("❎");
      console.log("Name Not Changed");
    }
  } else {
    try {
      const data = fs.readFileSync('Clan.txt', 'utf8');
      const clanData = data.split('\n').map(line => line.split('/'));
      const clanRole = clanData.find(([clanId, clanTag]) => message.member.roles.cache.has(clanId));
      if (clanRole) {
        const [, clanTag] = clanRole;
        await message.member.setNickname(`${clanTag} | ${message.content}`);
        console.log("Name Changed with Clan Tag");
      } else {
        await message.member.setNickname(`𝗗𝗞 | ${message.content}`);
        console.log("Name Changed with Server Tag");
      }

      message.react("✅");
    } catch (error) {
      console.error(error);
      message.react("❎");
      console.log("Name Not Changed");
    }
  }
}
//----------Change Name-------//

  //----------Stars-------//
  
    if (STARS.includes(message.channel.id)) {
      message.react("⭐")
      console.log("Star Has Been Add");
    }
  

  //----------Stars-------//

  //----------Suggestion-------//

  const suggestion = message.content;
  if (message.channelId === SUGGESTION) {
    message.delete();

    const suggestionEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("New Suggestion")
      .setDescription(suggestion)
      .setTimestamp()
      .setFooter({ text: `Suggested by ${message.author.tag}` });

    console.log(`Suggest added by ${message.author.tag}`)

    const suggestionChannel = message.guild.channels.cache.get(SUGGESTION);
    if (!suggestionChannel) {
      return console.error("Suggestion channel not found.");
    }

    suggestionChannel
      .send({ embeds: [suggestionEmbed] })
      .then((sentMessage) => {
        sentMessage.react("👍");
        sentMessage.react("👎");
      })
      .catch((error) => {
        console.error("Error sending suggestion:", error);
      });
  }
  //----------Suggestion-------//

  //----------Punishments-------//
  const prefix = "DK";
  
  if (!message.content.toUpperCase().startsWith(prefix)) return;

  else{
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(!(message.member.roles.cache.has(REPORT_PERMISSION))){
      message.delete();
    }
      //----------Warn-------//
    
    if (command.startsWith("warn")) {
      let target;
      let reason;
    
      const mention = message.mentions.members.first();
      if (mention) {
        target = mention.id;
        reason = args.slice(1).join(" ").trim();
      } else {
        target = args.shift();
        if (!target) {
          return message.reply(
            "3awed el command w zid tagui w ilal ekteb el id ta3 el member li bech twarnih w tansach t7ot el reason.",
          );
        }
        reason = args.join(" ").trim();
      }
    
      if (!reason) {
        return message.reply("3awed el command w zid el reason ta3 el warn.");
      }
    
      try {
        const user = await client.users.fetch(target);
        await message.reply(`Successfully warned <@${user.id}> for: ${reason}`);
        await user.send(`Jak warn, reason: ${reason}`);
        
        let punish = "Warn"
        let staff = message.member.id
        let member = target
        let rs = reason
        let duration = "---"

        let save = `${punish}/${staff}/${member}/${rs}/${duration}.`
        console.log(save)
        fs.appendFile('Logs.txt', save + '\n', (err) => {
        });
      } catch (error) {
        console.error(`Failed to send warning to ${target}:`, error);
        message.reply(
          "Warn t3adit ema member prv mta3ou msaker majahouch msg.",
          );
        }
      }
    //----------Warn-------//
    }
});

  //----------Report_New-------//
const claimCooldown = new Map();

// Report handling
client.on('voiceStateUpdate', async (oldState, newState) => {
  const waitingRoomID = '1250199602490118266'; // waiting for report vc
  const staffRoleID = '1236773938076319834'; // report staff role
  const cooldownPeriod = 15 * 60 * 1000; // 15 minutes in milliseconds

  async function processVoiceStateUpdate() {
    if (newState.channelId === waitingRoomID && oldState.channelId !== waitingRoomID && !newState.member.roles.cache.has(staffRoleID)) {
      const userId = newState.member.id;

      // Check if user received a notification recently
      if (claimCooldown.has(userId)) {
        const lastNotificationTime = claimCooldown.get(userId);
        const timeSinceLastNotification = Date.now() - lastNotificationTime;
        if (timeSinceLastNotification < cooldownPeriod) {
          console.log(`User ${newState.member.user.tag} received a notification recently.`);
          return;
        }
      }

      const channel = client.channels.cache.get('1250199005045063771'); // report request text channel
      const staffRole = newState.guild.roles.cache.get(staffRoleID);
      if (!channel || !staffRole) return;

      const notifyMsg = await channel.send({ content: `${staffRole}, a user is waiting for admin in the waiting room!` });

      const embed = new EmbedBuilder()
        .setTitle('Report Waiting')
        .setDescription(`**User:** ${newState.member}\n**Waiting Room:** <#${waitingRoomID}>\n\nClick the button below to claim this report.`)
        .setColor('#00FFFF')
        .setTimestamp();

      const button = new ButtonBuilder()
        .setLabel('Claim')
        .setCustomId('report_claim')
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder().addComponents(button);

      const msg = await channel.send({ embeds: [embed], components: [row] });

      const filter = (interaction) => interaction.customId === 'report_claim' && interaction.user.id !== client.user.id;
      const collector = channel.createMessageComponentCollector({ filter, time: 60000 });

      collector.once('collect', async (interaction) => {
        await interaction.deferUpdate();
        const claimedMember = interaction.member;

        // Move the user who wants to report to the staff member's channel
        await newState.member.voice.setChannel(claimedMember.voice.channel);

        // Record the time of notification for cooldown
        claimCooldown.set(userId, Date.now());

        embed.setFooter({ text: `Claimed by ${claimedMember.user.tag}`, iconURL: claimedMember.user.displayAvatarURL() });

        await interaction.message.edit({
          embeds: [embed],
          components: [],
        });

        await notifyMsg.edit(`${staffRole}, a report has been claimed by ${claimedMember}!`);
      });

      collector.once('end', async () => {
        await msg.edit({ components: [] });
      });
    }
  }

  try {
    await processVoiceStateUpdate();
  } catch (error) {
    console.error('Error:', error);
  }
});
  //----------Report-------//

//--------------Commands--------------//

const prefix = "!";

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (
    message.author.id == "368858808690409482" || //Laycat
    message.author.id == "747962450392907948" || //Evelynn
    message.author.id == "1226908013105909790"|| //The King
    message.author.id == "809368215905370142" || //CRL
    message.author.id == "1043514978700898375"   //Rick
  ) {
    switch (command) {
      case "casino":
        console.log("Casino started");
        rsl = 0;
        for (i = 0; i < 5; i++) {
          var a = Math.floor(Math.random() * 500) + 400;
          message.channel.send("Round " + (i + 1) + " : " + a);
          rsl = rsl + a;
        }

        message.channel.send("you have " + rsl + " points !");
        if (rsl < 4000) {
          message.channel.send(
            "sorry <@" +
              message.author.id +
              "> you have lost your score didn't " +
              ' make it to 4000, Better Luck Next Time :")))',
          );
        } else {
          message.channel.send(
            "Congrates, you win <@" + message.author.id + '> :")))',
          );
        }

        break;
    }
  }
});

//--------------Commands--------------//

//--------------Temp_VC_Cleanup--------------//

const CATEGORY_ID = '1249197923150069883';
const WHITELIST = ["1249197926690062391", "1249197931223978035", "1250787368890400828"];

client.once('ready', () => {
  console.log(`Loaded vc!`);
  checkEmptyVoiceChannels();
  setInterval(checkEmptyVoiceChannels, 3 * 60 * 1000); // Check every 3 minute for testing
});

async function checkEmptyVoiceChannels() {
  const guild = client.guilds.cache.get('1226979436143050784'); // Get the specific guild by its ID
  if (!guild) {
    console.log('Guild not found');
    return;
  }

  const category = guild.channels.cache.get(CATEGORY_ID);
  if (!category) {
    console.log('Category not found');
    return;
  }

  const voiceChannels = category.children.cache.filter(channel => channel.type === Discord.ChannelType.GuildVoice);
  console.log(`Found ${voiceChannels.size} voice channels in the category`);

  for (const channel of voiceChannels.values()) {

    if (WHITELIST.includes(channel.id)) {
      console.log(`Channel ${channel.name} is whitelisted`);
      continue;
    }

    if (channel.members.size === 0) {
      if (!channel.lastActiveTimestamp) {
        channel.lastActiveTimestamp = Date.now();
        console.log(`Set last active timestamp for channel ${channel.name}`);
      }

      const now = Date.now();
      console.log(`Channel ${channel.name} is empty, last active ${now - channel.lastActiveTimestamp} ms ago`);

      if (now - channel.lastActiveTimestamp >= 3 * 60 * 1000) { // 3 minutes
        console.log(`Deleting channel ${channel.name}`);
        await channel.delete().catch(console.error);
      }
    } else {
      if (channel.lastActiveTimestamp) {
        delete channel.lastActiveTimestamp;
        console.log(`Channel ${channel.name} is not empty, removed last active timestamp`);
      }
    }
  }
}

client.on('voiceStateUpdate', (oldState, newState) => {
  if (oldState.channelId && oldState.channel.members.size === 0) {
    oldState.channel.lastActiveTimestamp = Date.now();
    console.log(`Updated last active timestamp for channel ${oldState.channel.name}`);
  }

  if (newState.channelId && newState.channel.members.size > 0) {
    if (newState.channel.lastActiveTimestamp) {
      delete newState.channel.lastActiveTimestamp;
      console.log(`Channel ${newState.channel.name} is not empty, removed last active timestamp`);
    }
  }
});

//--------------Temp_VC_Cleanup--------------//

//-------------Visitor_Role_Check------------//

const GUILD_ID = '1226979436143050784';
const ROLE_ID = '1227087978741108778';

client.on('guildMemberAdd', member => {
  if (member.guild.id === GUILD_ID) {
    if (member.user.bot) {
      console.log(`Bot joined: ${member.user.tag}, not assigning role.`);
      return;
    }

    console.log(`New member joined: ${member.user.tag}`);
    setTimeout(async () => {
      const role = member.guild.roles.cache.get(ROLE_ID);
      if (!role) {
        console.error('Role not found');
        return;
      }

      if (!member.roles.cache.has(ROLE_ID)) {
        try {
          await member.roles.add(role);
          console.log(`Assigned role ${role.name} to ${member.user.tag}`);
        } catch (error) {
          console.error(`Failed to assign role to ${member.user.tag}:`, error);
        }
      } else {
        console.log(`Member ${member.user.tag} already has the role`);
      }
    }, 5000); // 5 seconds
  }
});

//-------------Visitor_Role_Check------------//

client.login(process.env.TOKEN);
