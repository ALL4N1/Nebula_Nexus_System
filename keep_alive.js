const http = require('http');
const server = http.createServer(receive_req);
server.listen(8080, '0.0.0.0', () => {
  console.log(`Server running!`);
});

function receive_req(req, res) {
  if (req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("I'm Alive");
  }
}


const fs = require('fs');
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
} = require("discord.js");
const { MessageButton } = require("discord.js");
const client = new Client({
  intents: [
    "Guilds",
    "MessageContent",
    "GuildMessages",
    "GuildMembers",
    "GuildVoiceStates",
  ],
});

//---------------------------------------------//

console.log("Project is running");
client.on("ready", () =>
  console.log(`logged in as - ${client.user.username} - `),
);
client.login("MTI0OTk3ODMzMjA0NTYzOTcxMQ.GR_oTb.tRMENjAv5k8iFMIEhWLJWtHVJQzywJQ4yYDB2Q")
