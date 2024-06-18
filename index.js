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

    //----------Kick-------//
    /*
    else if(command.startsWith("kick")) {
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
            "3awed el command w zid tagui w ilal ekteb el id ta3 el member li bech tkickih w tansach t7ot el reason."
          );
        }
        reason = args.join(" ").trim();
      }
  
      if (!reason) {
        return message.reply("3awed el command w zid el reason ta3 el kick.");
      }
  
      try {
        const memberToKick = await message.guild.members.fetch(target);
        await memberToKick.send(`Jak kick, reason: ${reason}`);
        await memberToKick.kick(reason);
        await message.reply(`Successfully kicked <@${memberToKick.id}> for: ${reason}`);
        
        // Log the kick action
        let punish = "Kick";
        let staff = message.member.id;
        let member = target;
        let rs = reason;
        let duration = "---";
  
        let save = `${punish}/${staff}/${member}/${rs}/${duration}.`
        console.log(save);
        fs.appendFile('Logs.txt', save + '\n', (err) => {
        });
      } catch (error) {
        console.error(`Failed to kick ${target}:`, error);
        message.reply("Kick t3adit ema member prv mta3ou msaker majahouch msg.");
      }
    }

  */
    //----------Kick-------//
  }
  //----------Punishments-------//
});

//----------Verification-------//
/*
const claims = new Map();

client.on("voiceStateUpdate", (oldState, newState) => {
  const member = newState.member;

  if (
    (member.roles.cache.has(VISITOR) ||
      member.roles.cache.has(VERIF_PERMISSION)) &&
    newState.channel &&
    VOICE_GATES.includes(newState.channel.id) &&
    (!oldState.channelId || oldState.channelId !== newState.channelId)
  ) {
    const logs = member.guild.channels.cache.get(VERIF_LOGS);
    logs.send("<@" + member.id + "> d5al lel room <#" + newState.channel.id + ">",);
  }

  if (
    member.roles.cache.has(VISITOR) &&
    newState.channel &&
    VOICE_GATES.includes(newState.channel.id) &&
    (!oldState.channelId || oldState.channelId !== newState.channelId)
  ) {
    const textChannel = member.guild.channels.cache.get(GATE_VISA);
    if (textChannel) {
      const claimEmbed = new EmbedBuilder()
        .setColor("#3c204b")
        .setTitle("Verification Claim")
        .setDescription(`Claim Before You Join The Verification.`);

      const claimRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`claim_${member.id}`)
          .setLabel("Claim Verification")
          .setStyle("Primary")
      );

      console.log("Fama chkoun d5al lel verify room")

      textChannel.send({
        content: "<@&" + VERIF_PERMISSION + "> (<@" + member.id + ">)",
        embeds: [claimEmbed],
        components: [claimRow],
      });

    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const { customId } = interaction;

  if (customId.startsWith("claim")) {
    const [action, memberId] = customId.split("_");
    const member = interaction.guild.members.cache.get(memberId);

    if (!member) return;

    if (interaction.member.roles.cache.has(VERIF_PERMISSION)) {
      claims.set(memberId, interaction.member.id);

      const verificationEmbed = new EmbedBuilder()
        .setColor("#3c204b")
        .setTitle("Role Assignment")
        .setDescription('Claimed by ' + (interaction.member.nickname || interaction.member.user.username));

      console.log('Verification Claimed by ' + (interaction.member.nickname || interaction.member.user.username))

      const roleRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`verif_${member.id}_boy`)
          .setLabel("Click To Verify")
          .setStyle("Primary"),

        new ButtonBuilder()
          .setCustomId(`verif_${member.id}_blacklist`)
          .setLabel("Blacklist")
          .setStyle("Danger")
      );

      await interaction.update({
        content: "<@&" + VERIF_PERMISSION + "> (<@" + member.id + ">)",
        embeds: [verificationEmbed],
        components: [roleRow],
      });
    } else {
      interaction.reply({
        content: "You don't have permission to perform this action.",
        ephemeral: true,
      });
    }
  }

  if (customId.startsWith("verif")) {
    const [action, memberId, option] = customId.split("_");
    const member = interaction.guild.members.cache.get(memberId);

    if (!member) return;

    const claimerId = claims.get(memberId);
    if (interaction.member.id === claimerId && member.roles.cache.has(VISITOR)) {
      let message;

      switch (option) {
        case "boy":
          if (interaction.member.voice.channelId === member.voice.channelId) {
            await member.roles.add(CITIZEN);
            await member.roles.remove(VISITOR);
            message = "Verified";
          } else {
            return interaction.reply({
              content: "You and the member must be in the same voice channel for verification.",
              ephemeral: true,
            });
          }
          break;

        case "blacklist":
          await member.roles.add(BLACKLIST);
          await member.roles.remove(VISITOR);
          message = "Blacklist";
          break;
      }

      const logs = interaction.guild.channels.cache.get(VERIF_LOGS);
      logs.send(
        "<@" + interaction.member.id + "> 3mal verification w el target : <@" + member.id + "> Role : (" + message + ")",
      );
      await interaction.reply({
        content: `Verification result: Role Updated for <@${memberId}> (${message}).`,
        ephemeral: true,
      });
      const chatChannel = interaction.guild.channels.cache.get(GATE_VISA);
      if (chatChannel) {
        chatChannel.send(
          `Verification result: Role Updated for <@${memberId}> (${message}).`,
        );
        console.log("`Verification Completed")
      }
    } else {
      interaction.reply({
        content: "You don't have permission to perform this action or the member no longer has the old role.",
        ephemeral: true,
      });
    }
  }
}); */

//----------Verification-------//


  //----------Report-------//
  client.on("voiceStateUpdate", (oldState, newState) => {
    const member = newState.member;
    
    if (member.roles.cache.has(REPORT_PERMISSION) &&
      newState.channel &&
      
      (
        REPORT_WAIT.includes(newState.channel.id) && (!oldState.channelId || oldState.channelId !== newState.channelId) || 
        REPORT_VOICES.includes(newState.channel.id) && (!oldState.channelId || oldState.channelId !== newState.channelId)
      )
    ) {
      const logs = member.guild.channels.cache.get(REPORT_LOGS);
      logs.send("Staff <@" + member.id + "> d5al lel room <#" + newState.channel.id + ">",);
    }

    else if (member.roles.cache.has(CITIZEN) &&
      newState.channel &&
      (
        REPORT_WAIT.includes(newState.channel.id) && (!oldState.channelId || oldState.channelId !== newState.channelId) || 
        REPORT_VOICES.includes(newState.channel.id) && (!oldState.channelId || oldState.channelId !== newState.channelId)
      )
    ) {
      const logs = member.guild.channels.cache.get(REPORT_LOGS);
      logs.send("<@" + member.id + "> d5al lel room <#" + newState.channel.id + ">",);
    }
  
    if (
      member.roles.cache.has(CITIZEN) &&
      newState.channel &&
      REPORT_WAIT.includes(newState.channel.id) && (!oldState.channelId || oldState.channelId !== newState.channelId)
    ) {
      const textChannel = member.guild.channels.cache.get(REPORT_MENTION);
      if (textChannel) {
        const ReportEmbed = new EmbedBuilder()
          .setColor("#3c204b")
          .setTitle("REPORT Claim")
          .setDescription(`Claim Before You Join The Report.`);
        
          const claimRep = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`claimrep_${member.id}`)
              .setLabel("Claim Report")
              .setStyle("Primary")
          );
  
        console.log("Fama chkoun d5al lel report room")
  
        textChannel.send({
          content: "<@&" + REPORT_PERMISSION + "> (<@" + member.id + ">)",
          embeds: [ReportEmbed],
          components: [claimRep],
        });
  
      }
    }
  });

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const { customId } = interaction;

  if (customId.startsWith("claimrep")) {
    const [action, memberId] = customId.split("_");
    const member = interaction.guild.members.cache.get(memberId);

    if (!member) return;

    if (interaction.member.roles.cache.has(REPORT_PERMISSION)) {
      claims.set(memberId, interaction.member.id);

      const Reportmbed = new EmbedBuilder()
        .setColor("#3c204b")
        .setTitle("Report Claimed")
        .setDescription('Claimed by ' + (interaction.member.nickname || interaction.member.user.username));
      
      console.log('Report Claimed by ' + (interaction.member.nickname || interaction.member.user.username))
    }
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

client.login(process.env.TOKEN);
