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
  PermissionsBitField,
  TextInputBuilder,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const { MessageButton } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

const {
  GUILD_ID,
  SUGGESTION,
  RENAME_ID,
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
  VIP,
  CLAN_LEADER,
  CLAN_COLEADER,
  CLAN_LIMIT,
  CLAN_MANAGER,
  TICKET_LOGS,
  TICKET_CLAN_CATEGORY,
} = require("./config.json");
const { Console } = require("console");

//---------------------------------------------//

console.log("Project is running");
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const guild = client.guilds.cache.get(GUILD_ID); // Assumes the bot is in one guild
  const category = guild.channels.cache.get(TICKET_CLAN_CATEGORY);
  const logChannel = guild.channels.cache.get(TICKET_LOGS);

  if (!category || category.type !== 4) { // 4 is the category type
    console.log('Category not found or not a category type');
    return;
  }

  let updatedChannels = [];

  for (const channel of category.children.cache.values()) {
    const updatedChannel = await checkAndUpdatePermissions(channel);
    if (updatedChannel) {
      updatedChannels.push(updatedChannel);
    }
  }

  if (updatedChannels.length > 0) {
    const embed = {
      color: 0x0099ff,
      title: 'Permissions Updated',
      description: `The following channels have been updated with view permissions for the role: <@&${CLAN_MANAGER}>`,
      fields: updatedChannels.map(channelName => ({ name: channelName, value: '\u200B' })),
      timestamp: new Date(),
      footer: {
        text: 'Bot Permissions Check',
      },
    };

    logChannel.send({ embeds: [embed] });
  } else {
    logChannel.send('All channels already have the necessary permissions.');
  }
});

// Function to check and update permissions
const checkAndUpdatePermissions = async (channel) => {
  const permissions = channel.permissionOverwrites.cache.get(CLAN_MANAGER);

  const requiredPermissions = [
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.Connect,
    PermissionsBitField.Flags.SendMessages,
    PermissionsBitField.Flags.ReadMessageHistory,
    PermissionsBitField.Flags.ManageChannels,
    PermissionsBitField.Flags.PrioritySpeaker
  ];

  if (!permissions || !requiredPermissions.every(perm => permissions.allow.has(perm))) {
    try {
      await channel.permissionOverwrites.create(CLAN_MANAGER, {
        ViewChannel: true,
        Connect: true,
        SendMessages: true,
        ReadMessageHistory: true,
        ManageChannels: true,
        PrioritySpeaker: true
      });
      console.log(`Updated permissions for channel: ${channel.name}`);
      return channel.name;
    } catch (error) {
      console.error(`Failed to update permissions for channel: ${channel.name}`, error);
    }
  }
  return null;
};

client.on('channelCreate', async (channel) => {
  if (channel.parentId === TICKET_CLAN_CATEGORY) {
    const updatedChannel = await checkAndUpdatePermissions(channel);
    if (updatedChannel) {
      const logChannel = channel.guild.channels.cache.get(TICKET_LOGS);
      const embed = {
        color: 0x0099ff,
        title: 'New Channel Detected & Permissions Updated',
        description: `The channel **${channel.name}** has been created and updated with view permissions for the role: <@&${CLAN_MANAGER}>`,
        timestamp: new Date(),
        footer: {
          text: 'Bot Permissions Check',
        },
      };
      logChannel.send({ embeds: [embed] });
    }
  }
});

client.on("messageCreate", async (message) => {
   
  if (message.author.bot) return;
  
  if (message.content.toLowerCase().includes("slm")) {
    message.reply("Mar7ba");
    console.log("slm");
  }

  if (message.content.toLowerCase().includes("a7la nass")) {
    message.reply("3aychou L7ob");
    console.log("a7la nass");
  }
  
   if (message.content === '!ready') {
        message.channel.send('Bot is ready!');
    }



//----------RENAME_ID Name-------//

if (message.channelId === RENAME_ID) {
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
        console.log("Name RENAME_IDd with Clan Tag");
      } else {
        await message.member.setNickname(Null);
        console.log("Name RENAME_IDd without tag");
      }

      message.react("✅");
      console.log("Name RENAME_IDd");
    } catch (error) {
      console.error(error);
      message.react("❎");
      console.log("Name Not RENAME_IDd");
    }
  } else {
    try {
      const data = fs.readFileSync('Clan.txt', 'utf8');
      const clanData = data.split('\n').map(line => line.split('/'));
      const clanRole = clanData.find(([clanId, clanTag]) => message.member.roles.cache.has(clanId));
      if (clanRole) {
        const [, clanTag] = clanRole;
        await message.member.setNickname(`${clanTag} | ${message.content}`);
        console.log("Name RENAME_IDd with Clan Tag");
      } else {
        await message.member.setNickname(`${message.content}`);
        console.log("Name RENAME_IDd without tag");
      }

      message.react("✅");
    } catch (error) {
      console.error(error);
      message.react("❎");
      console.log("Name Not RENAME_IDd");
    }
  }
}
//----------RENAME_ID Name-------//

  //----------VIP_ROLES-------//
  if (VIP.includes(message.channel.id)) {
    message.react("⭐");
    console.log("Star Has Been Added");
  }

  //----------VIP_ROLES-------//

  //----------Suggestion-------//
  if (message.channelId === SUGGESTION) {
  const suggestion = message.content;
  message.delete();

  const suggestionEmbed = new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("New Suggestion")
    .setDescription(suggestion)
    .setTimestamp()
    .setFooter({ text: `Suggested by ${message.author.tag}` });

  console.log(`Suggestion added by ${message.author.tag}`);

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
  const prefix = "nn!";
  
  if (!message.content.toUpperCase().startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (!message.member.roles.cache.has(REPORT_PERMISSION)) {
    message.delete();
    return;
  }

  if (command.startsWith("warn")) {
    async function warnMember() {
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
        
        let punish = "Warn";
        let staff = message.member.id;
        let member = target;
        let rs = reason;
        let duration = "---";

        let save = `${punish}/${staff}/${member}/${rs}/${duration}.`;
        console.log(save);
        fs.appendFile('Logs.txt', save + '\n', (err) => {
          if (err) {
            console.error("Failed to append to log file:", err);
          }
        });
      } catch (error) {
        console.error(`Failed to send warning to ${target}:`, error);
        message.reply(
          "Warn t3adit ema member prv mta3ou msaker majahouch msg.",
        );
      }
    }

    await warnMember();
  }
});
  //----------Report_New-------//

// Map to track users on cooldown
const claimCooldowns = new Map();
const cooldownPeriod = 15 * 60 * 1000; // 15 minutes in milliseconds

// Logging channel ID
const loggingChannelID = REPORT_LOGS;

// Monitored channels
const monitoredChannels = [REPORT_WAIT, REPORT_VOICES[0], REPORT_VOICES[1], REPORT_VOICES[2]];

client.on('voiceStateUpdate', async (oldState, newState) => {
  const waitingRoomID = REPORT_WAIT; // waiting for report vc
  const staffRoleID = REPORT_PERMISSION; // report staff role

  // Logging user joins
  async function logUserJoin() {
    const loggingChannel = client.channels.cache.get(loggingChannelID);
    if (!loggingChannel) return;

    if (monitoredChannels.includes(newState.channelId)) {
      const user = newState.member;
      const roomId = newState.channelId;
      const role = user.roles.cache.has(staffRoleID) ? 'Staff ' : '';

      await loggingChannel.send(`${role}${user} joined <#${roomId}>`);
    }
  }

  // Processing voice state update
  async function processVoiceStateUpdate() {
    if (newState.channelId === waitingRoomID && oldState.channelId !== waitingRoomID && !newState.member.roles.cache.has(staffRoleID)) {
      const userId = newState.member.id;
      const currentTime = Date.now();

      // Check if user is on cooldown
      if (claimCooldowns.has(userId) && claimCooldowns.get(userId) > currentTime) {
        console.log(`User ${newState.member.user.tag} is on cooldown.`);
        return;
      }

      const channel = client.channels.cache.get(REPORT_MENTION); // report request text channel
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
      const collector = channel.createMessageComponentCollector({ filter, max: 1, time: 60000 });

      collector.on('collect', async (interaction) => {
        try {
          await interaction.deferUpdate();
          const claimedMember = interaction.member;

          // Move the user who wants to report to the staff member's channel
          await newState.member.voice.setChannel(claimedMember.voice.channel);

          embed.setFooter({ text: `Claimed by ${claimedMember.user.tag}`, iconURL: claimedMember.user.displayAvatarURL() });

          await interaction.message.edit({
            embeds: [embed],
            components: [],
          });

          await notifyMsg.edit(`${staffRole}, a report has been claimed by ${claimedMember}!`);

          // Add user to cooldown map
          claimCooldowns.set(userId, currentTime + cooldownPeriod);

          // Log the claim action
          const loggingChannel = client.channels.cache.get(loggingChannelID);
          if (loggingChannel) {
            await loggingChannel.send(`Staff ${claimedMember} claimed ${newState.member}'s report`);
          }
        } catch (error) {
          console.error('Error processing interaction:', error);
        }
      });

      collector.on('end', async (collected) => {
        if (collected.size === 0) {
          await msg.edit({ components: [] });
        }
      });

      // Set the user's cooldown expiration time
      claimCooldowns.set(userId, currentTime + cooldownPeriod);
    }
  }

  try {
    await logUserJoin();
    await processVoiceStateUpdate();
  } catch (error) {
    console.error('Error:', error);
  }
});
  //----------Report-------//

//--------------Temp_VC_Cleanup--------------//

const CATEGORY_ID = '1264410664353398826';
const WHITELIST = ["1264410666715058237", "1264410665309835306"];

client.once('ready', () => {
  console.log(`Loaded vc!`);
  checkEmptyVoiceChannels();
  setInterval(checkEmptyVoiceChannels, 3 * 60 * 1000); // Check every 3 minute for testing
});

async function checkEmptyVoiceChannels() {
  const guild = client.guilds.cache.get(GUILD_ID); // Get the specific guild by its ID
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

client.on('guildMemberAdd', async member => {
  if (member.guild.id === GUILD_ID) {
    if (member.user.bot) {
      console.log(`Bot joined: ${member.user.tag}, not assigning roles.`);
      return;
    }

    console.log(`New member joined: ${member.user.tag}`);

    const visitID = member.guild.roles.cache.get(VISITOR);
    const citizenID = member.guild.roles.cache.get(CITIZEN);

    if (!visitID || !citizenID) {
      console.error('Roles not found.');
      return;
    }

    // Log current roles for debugging
    console.log(`Current roles for ${member.user.tag}:`, member.roles.cache.map(role => role.name));

    // Wait for a brief moment (adjust timing as needed)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check and assign visitor role if not already assigned
    if (!member.roles.cache.has(visitID.id)) {
      try {
        await member.roles.add(visitID);
        console.log(`Assigned role ${visitID.name} to ${member.user.tag}`);
      } catch (error) {
        console.error(`Failed to assign role to ${member.user.tag}:`, error);
      }
    } else {
      console.log(`Member ${member.user.tag} already has the role ${visitID.name}`);
    }

    // Check and remove citizen role if assigned
    if (member.roles.cache.has(citizenID.id)) {
      try {
        await member.roles.remove(citizenID);
        console.log(`Removed role ${citizenID.name} from ${member.user.tag}`);
      } catch (error) {
        console.error(`Failed to remove role from ${member.user.tag}:`, error);
      }
    } else {
      console.log(`Member ${member.user.tag} doesn't have the role ${citizenID.name}`);
    }

    // Log updated roles after role management
    console.log(`Updated roles for ${member.user.tag}:`, member.roles.cache.map(role => role.name));
  }
});


//-------------Visitor_Role_Check------------//


client.login(process.env.TOKEN);
