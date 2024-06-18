const { Client, Intents, Events, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const moment = require('moment');
const ytdl = require('ytdl-core');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });
var verification_tickets = [];

const verificator_role_id = "1236773845931921428";
const verificated_role_id = "1227087797286998138";
const verification_rooms = ["1228147379438620672", "1228147412598521936", "1228147412644663307", "1252442799702413373", "1252442857672019978"];
const verificator_room = "1228825696873218120";
const sus_role_id = "1252630697835761664";
const blacklist_role_id = "1228149587999588424";
const not_verified_role_id = "1227087978741108778";



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});



client.on("voiceStateUpdate", (oldVoiceState, newVoiceState) => {
  if (oldVoiceState.channel && !newVoiceState.channel) return;

  if (newVoiceState.member.roles.cache.some(role => role.id == verificated_role_id)) return;

  if (newVoiceState.member.user.id in verification_tickets) {
    if (newVoiceState.channel.id != verification_tickets[newVoiceState.member.user.id].room) {
      newVoiceState.member.voice.setChannel(client.channels.cache.get(verification_tickets[newVoiceState.member.user.id].room));
    }

    return;
  }
  verification_tickets[newVoiceState.member.user.id] = { room: newVoiceState.channel.id }

  if (newVoiceState.channel.id == verification_rooms[0] || newVoiceState.channel.id == verification_rooms[1] || newVoiceState.channel.id == verification_rooms[2] || newVoiceState.channel.id == verification_rooms[3] || newVoiceState.channel.id == verification_rooms[4]) {  //The member connected to a channel.
    console.log(`${newVoiceState.member.user.tag} connected to ${newVoiceState.channel.name} with id= ${newVoiceState.channel.id}..`);
    const content_tmp = `<@&` + verificator_role_id + `>,--> ${newVoiceState.member.user} is waiting for verification on ` + 'room <#' + newVoiceState.channel.id + '>';

    let embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('Waiting Verification...')
      .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      .setDescription('**Room:** <#' + newVoiceState.channel.id + '>' + "\n\n" + "**Name:** <@" + newVoiceState.member.user.id + ">")
      .addFields(
        { name: '\u200B', value: 'Joined on:', inline: true },
        { name: '\u200B', value: `${moment(newVoiceState.member.joinedTimestamp).format("D/M/YYYY  H:mm")}`, inline: true },
      );


    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('claim_verify')
          .setLabel('Claim verification!')
          .setStyle(ButtonStyle.Danger),
      );

    newVoiceState.guild.channels.cache.get(verificator_room).send({ content: content_tmp, ephemeral: true, embeds: [embed], components: [row] });

  }
});


client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  // Check if the button that was clicked is the "claim verify" button
  if (interaction.customId === 'claim_verify' && interaction.member.roles.cache.has(verificator_role_id)) {
    // Modify the original verification request message to indicate that it has been claimed
    const message = await interaction.message.fetch();
    const staffMember = message.guild.members.cache.find(member => member.id === interaction.member.user.id);

    const content_tmp = "Verification Claimed by <@" + staffMember + ">";



    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('claim_verify')
          .setLabel('Verification Claimed!')
          .setStyle(ButtonStyle.Success)
          .setDisabled(true),
      );



    interaction.message.embeds[0].data.title = 'Verification Claimed!';
    interaction.message.embeds[0].data.color = 1834752;

    const myArr = interaction.message.embeds[0].data.description.match(/<@\d.*>/g);
    let ticket_client = myArr[0].slice(2, myArr[0].length - 1);
    verification_tickets[ticket_client].admin = staffMember.user.id;
    console.log(verification_tickets);

    let embed_tmp = interaction.message.embeds[0];
    interaction.message.edit({ content: content_tmp, ephemeral: true, embeds: [embed_tmp], components: [row] });

    //send a msg to the verify room
    const verification_channel = await interaction.guild.channels.fetch(verification_tickets[ticket_client].room);
    const ticket_client_disc = message.guild.members.cache.find(member => member.id === ticket_client);

    const content_2 = "Verification of <@" + ticket_client + "> Claimed by <@" + staffMember + ">";

    let embed_2 = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('Add roles')
      .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      .setDescription('**Room:** <#' + verification_tickets[ticket_client].room + '>' + "\n\n" + "**Name:** <@" + ticket_client + ">")
      .addFields(
        { name: '\u200B', value: 'Joined on:', inline: true },
        { name: '\u200B', value: `${moment(ticket_client_disc.joinedTimestamp).format("D/M/YYYY  H:mm")}`, inline: true },
      );


    const row_2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('role_add_member')
          .setLabel('Verify')
          .setStyle(ButtonStyle.Success),
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('role_add_sus')
          .setLabel('Suspected')
          .setStyle(ButtonStyle.Secondary),
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('role_add_blacklist')
          .setLabel('Blacklist')
          .setStyle(ButtonStyle.Danger),
      );

    verification_channel.send({ content: content_2, ephemeral: true, embeds: [embed_2], components: [row_2] });
  }

  if (interaction.member.roles.cache.has(verificator_role_id) && interaction.customId.includes("role_add_")) {
    const message = await interaction.message.fetch();
    const myArr = interaction.message.embeds[0].data.description.match(/<@\d.*>/g);
    let ticket_client = myArr[0].slice(2, myArr[0].length - 1);



    const ticket_client_disc = message.guild.members.cache.find(member => member.id === ticket_client);


    var role_to_add_id;
    if (interaction.customId === 'role_add_member') {
      role_to_add_id = verificated_role_id;
      const role_to_remove = interaction.guild.roles.cache.get(not_verified_role_id);
      if (role_to_remove) {
        try {
          await ticket_client_disc.roles.remove(role_to_remove);
          console.log(`Role ${role_to_remove.name} removed from member ${ticket_client_disc.user.tag}`);
        }
        catch (error) {
          console.error(error);
        }
      }
      else {
        console.log('role_to_remove found.');
      }

    }
    if (interaction.customId === 'role_add_sus') role_to_add_id = sus_role_id;
    if (interaction.customId === 'role_add_blacklist') role_to_add_id = blacklist_role_id;
    const role_to_add = interaction.guild.roles.cache.get(role_to_add_id);


    if (role_to_add) {
      try {
        console.log("debug111" + role_to_add_id);
        await ticket_client_disc.roles.add(role_to_add);
        if (role_to_add_id == blacklist_role_id) {
          const role_to_remove2 = interaction.guild.roles.cache.get(verificated_role_id);
          if (role_to_remove2) {
            try {
              await ticket_client_disc.roles.remove(role_to_remove2);
              console.log(`Role ${role_to_remove2.name} removed from member ${ticket_client_disc.user.tag}`);
            }
            catch (error) {
              console.error(error);
            }
          }
          else {
            console.log('role_to_remove found.');
          }
        }
        if(role_to_add == verificated_role_id){
          const role_to_remove2 = interaction.guild.roles.cache.get(blacklist_role_id);
          if (role_to_remove2) {
            try {
              await ticket_client_disc.roles.remove(role_to_remove2);
              console.log(`Role ${role_to_remove2.name} removed from member ${ticket_client_disc.user.tag}`);
            }
            catch (error) {
              console.error(error);
            }
          }
          else {
            console.log('role_to_remove found.');
          }
        }
        console.log("debug222" + role_to_add_id);
        console.log(`Role ${role_to_add.name} added to member 
        ${ticket_client_disc.user.tag}`);
      }
      catch (error) {
        console.error(error);
      }
    }
    else {
      console.log('Role or member not found.');
    }

  }
  interaction.deferUpdate();
});



client.login(process.env['bot_secret']);
const Discord = require('discord.js');
client.on(Discord.Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'button') {
    const row = new Discord.ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('primary')
          .setLabel('Claim verification!')
          .setStyle(ButtonStyle.Primary),
      );

    const embed = new Discord.EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Some title')
      .setURL('https://discord.js.org')
      .setDescription('Some description here');

    await interaction.reply({ content: 'content houni,', ephemeral: true, embeds: [embed], components: [row] });
  }
});




const http = require('http');
const server = http.createServer(receive_req);
server.listen(8080, '0.0.0.0', () => {
  console.log(`Server running!`);
});

function receive_req(req, res) {
  if (req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end('Post basic authenticaton redirector by RTS. ' + Math.random());
  }
}
