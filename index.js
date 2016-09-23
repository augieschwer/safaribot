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

controller.hears(['ping'], ['direct_message','direct_mention','mention'], function(bot,message) {
    bot.reply(message,'PONG');
});

controller.on(['direct_message','direct_mention','mention'], function(bot,message) {
    bot.startConversation(message, function(err, convo) {
        convo.ask('Howdy! What would you like to learn about?', function(response,convo) {
            var topic = response.text;
            convo.say('Cool! '+ topic + ' sounds interesting');
            convo.say('Here is a link to some content about ' + topic + ': https://www.safaribooksonline.com/search/?query=' + topic);
            convo.ask('Was that helpful?', [
                {
                    pattern: bot.utterances.yes,
                    callback: function(response,convo) {
                        convo.say('Great!');
                        convo.next();
                    }
                },
                {
                    pattern: bot.utterances.no,
                    callback: function(response,convo) {
                        convo.say('Bummer...');
                        convo.say('Maybe this link will be more helpful: https://www.safaribooksonline.com/search/?query=' + topic + '&field=title');
                        convo.next();
                    }
                },
                {
                    default: true,
                    callback: function(response,convo) {
                        convo.repeat();
                        convo.next();
                    }
                }
            ]);
            convo.next();
        });
    });
});
