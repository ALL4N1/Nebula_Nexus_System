const http = require('http');
const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');

// Server setup
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

// Discord bot setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});
client.login("MTI0OTk3ODMzMjA0NTYzOTcxMQ.GR_oTb.tRMENjAv5k8iFMIEhWLJWtHVJQzywJQ4yYDB2Q")
