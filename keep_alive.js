const fs = require('fs');
const Discord = require('discord.js')

var http = require('http');
http.createServer(function (req, res) {
  res.write("I'm alive");
  res.end();
}).listen(8080);

const client = new Discord.Client();
client.on('ready', () => {
	console.log('logged on')
});
client.login("MTI0OTk3ODMzMjA0NTYzOTcxMQ.GR_oTb.tRMENjAv5k8iFMIEhWLJWtHVJQzywJQ4yYDB2Q")
