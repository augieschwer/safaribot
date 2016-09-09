if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('botkit');
var controller = Botkit.slackbot(
    { debug: process.env.debug }
);
var bot = controller.spawn({
      token: process.env.token
})
bot.startRTM(function(err,bot,payload) {
      if (err) {
              throw new Error('Could not connect to Slack');
                }
});

controller.hears(['ping'], ['direct_message','direct_mention'], function(bot,message) {
    bot.reply(message,'PONG');
});
