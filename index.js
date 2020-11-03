const Eris = require('eris');

require('dotenv').config();

const bot = new Eris(process.env.TOKEN);

const hoists = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '{', '}', '[', ']', ';', ':', '/', '?', '+', '=', '_', '-', '.', ',', '\\', '|', '~', '"', '`', '\''];

function cleanMember(member) {
  if (member.nick && hoists.includes(member.nick[0])) {
    member.edit({
      nick: process.env.NICK
    });
  }

  if (hoists.includes(member.username[0])) {

    member.edit({
      nick: process.env.NICK
    });
  }
}

function clean(guild) {
  let members = Array.from(guild.members.values());

  for (let member of members) {
    clean(member);
  }
}

function automatedClean() {
  let guild = bot.guilds.get(process.env.GUILD);
  clean(guild);
}

bot.on('guildMemberUpdate', (guild, member) => {
  clean(member);
});

bot.on('messageCreate', msg => {
  if (!msg.content.startsWith(process.env.PREFIX)) return;
  if (!msg.member.roles.includes(process.env.ROLE)) return;

  content = msg.content.slice(1);

  if (content === 'clean') {
    let guild = msg.channel.guild;
    clean(guild);
    bot.createMessage(msg.channel.id, `Started systematic cleaning of ${guild.members.size} members!`);
  }
});

bot.on('ready', () => {
  console.log('Ready to clean!');
  setInterval(() => {
    automatedClean();
  }, 1000 * 60 * 60 * 6);
});

bot.connect();