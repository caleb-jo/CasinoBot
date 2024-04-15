
const {Client, IntentsBitField, NewsChannel} = require('discord.js');
const fs = require('fs');


// GAMES
const SLOTS = require('./games/slots');
const ROULETTE = require('./games/roulette');

// FILES
const TOKENFILE = './token/token.txt';
const USERBALANCEFILE = './token/json/userbalance.json';



let DiscordBotToken;
let ReplyMessage;
let IsHelpRequest;
let UserMessage;


const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});


//PUT TOKEN IN TEXT FILE BY ITSELF
function GetToken(callback) {
    fs.readFile(TOKENFILE, 'utf-8', function GetFileContent(err, data) {
        if (err) {
            console.error(err);
            return;
        }
        DiscordBotToken = data;
        callback();
    })
}

/*
function Balances(state, userid='', amount=0) {
    if (state == READ){
        fs.readFile(USERBALANCEFILE, 'utf-8', function GetFileContent(err, data) {
            if (err) {
                console.error(err);
                return;
            }
            UserBalances = data;
            console.log(JSON.parse(data));
        })
    }
}
*/

// interacts with USERBALANCEFILE to update user balances, adds new users to userbalance.json (gives 1,000,000)
function UpdateBalance(userid=0, amount=0) {
    fs.readFile(USERBALANCEFILE, function (err, data) {
        if (err) {
            console.error(err);
            return;
        }

        Json = JSON.parse(data);

        JsonKeys = Object.keys(Json);


        let CurrentBalance;
        let NewBalance;

        if (!JsonKeys.includes(userid)) {
            console.log("a new addict >:)");
            CurrentBalance = 1000000;            
        }
        else {
            CurrentBalance = Json[userid];
        }


        NewBalance = CurrentBalance + amount;

        Json[userid] = NewBalance;


        // user is not in object, do this:
        
        console.log(JsonKeys);

        Json = JSON.stringify(Json);
        
        

        fs.writeFile(USERBALANCEFILE, Json, (err) => {
            if (err) {6
                console.error(err);
                return;
            }
        });


    });
}


function ClientLogin() {
    client.login(DiscordBotToken);
    return
}


function ParseMessage(message) {

    let Gambler, Game, Wager = 0; //init vars

    CoreMessage = message.content.slice(8, 100); //remove !gamble from beginning because I don't like it
    console.log(`Message received: ${CoreMessage}`);

    IsHelpRequest = CoreMessage.match(/--[a-z]+/g);
    let Numbers = CoreMessage.match(/\d+/g);
    let Words = CoreMessage.match(/([a-z]+)/g);


    Gambler = message.author.id;
    if (Numbers){
        Wager = Number(Numbers[0]); //wager is always first number
    }

    Game = SelectGame(Words, Numbers);


    if (IsHelpRequest) {
        switch(IsHelpRequest[0]) {
            case '--help':
                ReplyMessage += 'Welcome to CasinoBot! I am here to serve all your gambling and ATM needs from the comfort of your discord server.\n\nList of Games:\nSlots: "!gamble slots {amount to wager} {number of lines (1-5)}"\n Wager amount is multiplied by number of lines.\n\nRoulette: "!gamble roulette {amount to wager} {"red", "black", "first", "second", "third"}"\nRed/black give 1:1 odds, first(1-12)/second(13-24)/third(25-36) give 1:2 odds\n\nHappy Hunting!';
                message.reply(ReplyMessage);
                break;
        }
        
    }

    return;
}


//ADD GAMES HERE AND 
function SelectGame(Words, Numbers) {
    if (Words) {
        let FirstWord = Words[0];
    
    switch(FirstWord) {
        case 'slots':

            let Lines = Number(Numbers[1]);
            if (Lines > 5 || Lines < 1 || !Lines) {
                ReplyMessage = "Invalid number of lines. Please input a number between 1 and 5. Use --help for more information.";
                UserMessage.reply(ReplyMessage);
                return;
            }
            else {console.log(`Playing ${Lines} lines`)}
            
            SLOTS.play();
            break;
        case 'roulette':

            
            ROULETTE.play();
            break;
    
        }
    }
}




//CLIENT 

client.on('ready', (cli) => {
    console.log(`${cli.user.tag} wants you to gamble.`)
})

client.on('messageCreate', (message) => {
    UserMessage = message;
    
    if (message.author.bot) {
        return; //robots don't gamble
    }

    let BeginningOfMessage = message.content.slice(0,7);
    if (BeginningOfMessage === '!gamble') {
        ReplyMessage = '';
        ParseMessage(message);
    }
    return
});



//LOGIN

LoginDiscordBot = GetToken(ClientLogin);
























