
const {Client, IntentsBitField, NewsChannel} = require('discord.js');
const fs = require('fs');


// GAMES
const SLOTS = require('./games/slots');
const ROULETTE = require('./games/roulette');

// FILES
const TOKENFILE = './token/token.txt';
const USERBALANCEFILE = './token/json/userbalance.json';



let DiscordBotToken; // for data from TOKENFILE
let ReplyMessage;  // global for constructed response message
let IsHelpRequest; // move this to ParseMessage?
let UserMessage; // global for message object

// client object has permissions (intents)
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
// update balance takes message.author.id as userid and amount gained/lost from bet
function UpdateBalance(userid=0, amount=0) {
    fs.readFile(USERBALANCEFILE, function (err, data) {
        if (err) {
            console.error(err);
            return;
        }
        
        // parse data for json info and list keys (users in this case)
        Json = JSON.parse(data);

        JsonKeys = Object.keys(Json);


        let CurrentBalance;
        let NewBalance;
        
        // in case of new user, initialize balance to 1,000,000
        // else get value
        if (!JsonKeys.includes(userid)) {
            console.log("a new addict >:)");
            CurrentBalance = 1000000;            
        }
        else {
            CurrentBalance = Json[userid];
        }

        // change value from file by amount, rebind that value to userid, stringify 
        NewBalance = CurrentBalance + amount;

        Json[userid] = NewBalance;
        
        // console.log(JsonKeys);

        Json = JSON.stringify(Json);
        
        
        // write updated json string back to file
        fs.writeFile(USERBALANCEFILE, Json, (err) => {
            if (err) {6
                console.error(err);
                return;
            }
        });


    });
}

// callback for GetToken, gives login token to client once it is read from file
function ClientLogin() {
    client.login(DiscordBotToken);
    return
}


function ParseMessage(message) {

    let Gambler, Game, Wager = 0;
    // Gambler: discord user who sent the msg, Game: game played (slots, roulette, etc...), Wager: amount bet on game

    CoreMessage = message.content.slice(8, 100); //remove !gamble from beginning of message
    // console.log(`Message received: ${CoreMessage}`);
    
    // .match function returns list
    IsHelpRequest = CoreMessage.match(/--[a-z]+/g); //search for collection of letters proceeding "--"
    let Numbers = CoreMessage.match(/\d+/g); //search for col. of nums
    let Words = CoreMessage.match(/([a-z]+)/g); //search for col. of letters


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
        } // need to exit this/provide catch all?
        
    }

    return;
}


//ADD GAMES HERE AND TO /src/games FOLDER. REQUIRE AT TOP
function SelectGame(Words, Numbers) {
    if (Words) {
        let FirstWord = Words[0];
    
    switch(FirstWord) {
        case 'slots':
        // template input message: !gamble slots {Wager} {Lines}

            let Lines = Number(Numbers[1]);
            if (Lines > 5 || Lines < 1 || !Lines) {
                ReplyMessage = "Invalid number of lines. Please input a number between 1 and 5. Use --help for more information.";
                UserMessage.reply(ReplyMessage);
                return;
            }
            // else {console.log(`Playing ${Lines} lines`)}
            
            SLOTS.play();
            break;
        case 'roulette':
        // template input message !gamble roulette {Wager} {color(red/black}

            
            ROULETTE.play();
            break;
    
        }
    }
}




//CLIENT 

client.on('ready', (cli) => {
    console.log(`${cli.user.tag} wants you to gamble.`) //startup message
})

client.on('messageCreate', (message) => {
    UserMessage = message;
    
    if (message.author.bot) {
        return; //robots don't gamble
    }

    //use .match for this instead?
    let BeginningOfMessage = message.content.slice(0,7);
    if (BeginningOfMessage === '!gamble') {
        ReplyMessage = '';
        ParseMessage(message);
    }
    return
});



//LOGIN

LoginDiscordBot = GetToken(ClientLogin);
























