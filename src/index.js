
const {Client, IntentsBitField} = require('discord.js');
const fs = require('fs');

let DiscordBotToken;
let ReplyMessage;
let IsHelpRequest;



const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})


//PUT TOKEN IN TEXT FILE BY ITSELF
function GetToken(callback) {
    fs.readFile('token/token.txt', 'utf-8', function GetFileContent(err, data) {
        if (err) {
            console.error(err);
            return;
        }
        DiscordBotToken = data;
        callback()
    })
}

function ClientLogin() {
    client.login(DiscordBotToken);
    return
}

function ParseMessage(message) {
    CoreMessage = message.content.slice(8, 100); //remove !gamble from beginning because I don't like it
    console.log(`Message received: ${CoreMessage})`);

    IsHelpRequest = CoreMessage.match(/--help/);
    let Numbers = CoreMessage.match(/\d+/g);
    let Words = CoreMessage.match(/([a-z]+)/g);
    console.log(Numbers)
    console.log(Words)

    if (IsHelpRequest) {
        message.reply('Welcome to CasinoBot! I am here to serve all your gambling and ATM needs from the comfort of your discord server.\n\nList of Games:\nSlots: "!gamble slots {amount to wager} {number of lines (1-5)}"\nWager amount is multiplied by number of lines.\n\nRoulette: "!gamble roulette {amount to wager} {"red", "black", "1st", "2nd", "3rd"}"\nRed/black give 1:1 odds, first(1-12)/second(13-24)/third(25-36) give 1:2 odds\n\nNow we\'ve never seen anyone to have to do this, but feel free to take out a loan using the command: "!gamble loan {amount of money}"\n\nHappy Hunting!');
    }

    return;
}





//CLIENT 

client.on('ready', (cli) => {
    console.log(`${cli.user.tag} wants you to gamble.`)
})

client.on('messageCreate', (message) => {
    ReplyMessage = '';
    if (message.author.bot) {
        return; //robots don't gamble
    }

    let BeginningOfMessage = message.content.slice(0,7);
    if (BeginningOfMessage == '!gamble') {
        let Gambler, Game, Wager = 0;
        Gambler, Game, Wager = ParseMessage(message);
    }
    return
});



//LOGIN

LoginDiscordBot = GetToken(ClientLogin);























