
// PACKAGES
const {Client, IntentsBitField, NewsChannel} = require('discord.js');
const fs = require('fs');


// MODULES (GAMES)
const SLOTS = require('./games/slots');
const ROULETTE = require('./games/roulette');

// FILES
const TOKENFILE = './token/test-token.txt';
const USERBALANCEFILE = './token/json/userbalance.json';



let DiscordBotToken; // for data from TOKENFILE
let ReplyMessage;  // global for constructed response message
let UserMessage; // global for message object
let UserBalance; //global for user balance



function GetNewBalance(Gambler) {
    fs.readFile(USERBALANCEFILE, function (err, data) {
        if (err) {
            console.error(err);
            return;
        }
        
        // parse data for json info and list keys (users in this case)
        Json = JSON.parse(data);

        JsonKeys = Object.keys(Json);


        
        
        // in case of new user, initialize balance to 1,000,000
        // else get value
        if (!JsonKeys.includes(Gambler)) {
            CurrentBalance = 1000000;       
        }
        else {
            CurrentBalance = Json[Gambler];
        }
        UserBalance = CurrentBalance;
        ReplyMessage = `Hey ${UserMessage.author}, you have ${UserBalance} in your bank account.`
        UserMessage.reply(ReplyMessage);
        UserBalance = 0; 
    });

}

// interacts with USERBALANCEFILE to update user balances, adds new users to userbalance.json (gives 1,000,000)
// update balance takes message.author.id as userid and amount gained/lost from bet
function UpdateBalance(userid=0, amount=0) {
    let CurrentBalance;
    let NewBalance;

    fs.readFile(USERBALANCEFILE, function (err, data) {
        if (err) {
            console.error(err);
            return;
        }
        
        // parse data for json info and list keys (users in this case)
        Json = JSON.parse(data);

        JsonKeys = Object.keys(Json);


        
        
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

        UserBalance = NewBalance;
        
        // console.log(JsonKeys);

        Json = JSON.stringify(Json);
        
        
        // write updated json string back to file
        fs.writeFile(USERBALANCEFILE, Json, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    });

    return;
}


function ParseMessage(message) {
// message = String
// returns list of message phrases and cuts !gamble from front e.g. "!gamble roulette 500 black" --> ["roulette", 500, "black"], "!gamble --help roulette" --> ["--help", "roulette"]

    CoreMessage = message.content.slice(8, 100); //remove !gamble from beginning of message
    // console.log(`Message received: ${CoreMessage}`);

    
    // .match function returns list, regex more "resilient" than splitting on spaces
    CoreMessage = CoreMessage.replace('—','--')
    let Phrases = CoreMessage.match(/(--|)([a-zA-Z0-9]+)/g);

    return Phrases;
}

function GenerateResultMessage(WonGame, AmountDifference) {
    AmountDifference = Math.abs(AmountDifference);

    if (WonGame) {
        ReplyMessage += `\n\nCongratulations! You won the game! You have received $${AmountDifference}! Keep the streak alive!`
        // console.log(ReplyMessage);
    }
    else {
        ReplyMessage += `\n\nAww, tough luck hot shot. You can't win 'em all. Don't let this measly $${AmountDifference} loss keep you down!`
        // console.log(ReplyMessage);
    }

    return ReplyMessage;
}

function SendHelpMessage() {
    ReplyMessage = 'Welcome to CasinoBot! I am here to serve all your gambling needs from the comfort of your discord server. Use --balance to see your current balance!\n\nList of Games:\nSlots: "!gamble slots {amount to wager} {number of lines (1-5)}"\n Wager amount is multiplied by number of lines.\n\nRoulette: "!gamble roulette {amount to wager} {"red", "black"}\n\nHappy Hunting!';
    UserMessage.reply(ReplyMessage);
    return;
}


function RespondWith(Message) {
    UserMessage.reply(Message);
    return;
};

// returns True if NO errors in message, add more things to this check as I think of/come across them
function IsValidMessage(PhraseList) {
    
    if(!PhraseList || !(typeof(PhraseList[0]) === "string")) {
        SendHelpMessage();
        return false;
    }

    return true;
}


//ADD GAMES HERE AND TO /src/games FOLDER AND REQUIRE ^^^
function ExecuteGame(Phrases) {
    let FirstWord = Phrases.shift();
    let Wager = Number(Phrases.shift());
    console.log(typeof(Wager));

    //error checking
    switch (true) {
        case !FirstWord:
            SendHelpMessage();
            return;
        case isNaN(Wager):
            RespondWith('Please enter a number to bet. "!gamble --help" for more information.');
            return;
    }


    switch (FirstWord) {
        case '--help':
            SendHelpMessage();
            return;

        case '--balance':
            GetNewBalance(Gambler);
            return;
        case 'slots':
            Lines = Number(Phrases.shift());
            if (isNaN(Lines) || Lines > 5 || Lines < 1) {
                RespondWith('Please enter a valid number of lines. Slots command is: "!gamble slots {wager} {lines 1-5}". Use "!gamble --help" for more information.');
                return;
            }
            [HasWonTheGame, AmountDifference, AddToMessage] = SLOTS.play(Wager, Lines);
            break;
        case 'roulette':
            Color = Phrases.shift();
            if (!(['red', 'black'].includes(Color))) {
                //console.log('invalid roulette choice');
                RespondWith('Invalid color choice. Roulette command is: "!gamble roulette {wager} {red/black}". "!gamble --help" for more information.');
                break;
            }
            [HasWonTheGame, AmountDifference, AddToMessage] = ROULETTE.play(Wager, Color);
            break;
        default:
            SendHelpMessage();
            return;

    }
    ReplyMessage += AddToMessage;

    UpdateBalance(Gambler, AmountDifference);

    RespondWith(GenerateResultMessage(HasWonTheGame, AmountDifference));

    return;
}

//-----------------------DISCORD-CLIENT-ACTIONS-------------------------------------

// client object has permissions (intents)
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

client.on('ready', (cli) => {
    console.log(`${cli.user.tag} wants you to gamble.`) //startup message
})

client.on('messageCreate', (message) => {
    
    if (message.author.bot) {
        return; //robots don't gamble
    }

    //use .match for this instead?
    let BeginningOfMessage = message.content.slice(0,7);
    if (BeginningOfMessage === '!gambl3') {
        UserMessage = message;
        Gambler = message.author.id;
        ReplyMessage = '';
        MessagePhrases = ParseMessage(message);
    } else {
        return
    };

    if(IsValidMessage(MessagePhrases)){
        ExecuteGame(MessagePhrases);
    };
    return;
});



//-----------------------LOGIN-------------------------------------


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


// callback for GetToken, gives login token to client once it is read from file
function ClientLogin() {
    client.login(DiscordBotToken);
    return
}

LoginDiscordBot = GetToken(ClientLogin);
