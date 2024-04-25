
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
let UserMessage; // global for message object





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
        if (!JsonKeys.includes(Gambler.id)) {
            CurrentBalance = 1000000;
        }
        else {
            CurrentBalance = Json[Gambler.id];
        }
        UserBalance = CurrentBalance;
        ReplyMessage = `Hey ${Gambler}, you have ${UserBalance} in your bank account.`
        UserMessage.reply(ReplyMessage);
        UserBalance = 0; 
    });

};

// interacts with USERBALANCEFILE to update user balances, adds new users to userbalance.json (gives 1,000,000)
// update balance takes message.author.id as userid and amount gained/lost from bet
function UpdateBalance(user, amount=0) {
    let CurrentBalance;
    let NewBalance;
    let User = user;
    let UserId = user.id;
    console.log(User, UserId);

    fs.readFile(USERBALANCEFILE, function (err, data) {
        if (err) {
            console.error(err);
            return;
        }
        
        Json = JSON.parse(data);

        JsonKeys = Object.keys(Json);

        if (!JsonKeys.includes(user.id)) {
            CurrentBalance = 1000000;       
        }
        else {
            CurrentBalance = Json[user.id];
        }

        if(amount){
            //since I don't think it's possible to bet and, win or lose, have amt=0
            //use message.author.id to track amounts so changing username does not lose progress
            NewBalance = CurrentBalance + amount;

            Json[user.id] = NewBalance;

            UserBalance = NewBalance;
            
            // console.log(JsonKeys);

            Json = JSON.stringify(Json);
            
            fs.writeFile(USERBALANCEFILE, Json, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        } else {
            RespondWith(`Hey ${user}, you have ${CurrentBalance} in your bank account.`)
        }
    });

    return;
};






//-----------------------RESPONSE_MESSAGES-------------------------------------

function SendHelpMessage() {
    ReplyMessage = 'Welcome to CasinoBot! I am here to serve all your gambling needs from the comfort of your discord server. Use --balance to see your current balance!\n\nList of Games:\nSlots: "!gamble slots {amount to wager} {number of lines (1-5)}"\n Wager amount is multiplied by number of lines.\n\nRoulette: "!gamble roulette {amount to wager} {"red", "black"}\n\nHappy Hunting!';
    UserMessage.reply(ReplyMessage);
    return;
};

function RespondWith(Message) {
    UserMessage.reply(Message);
    return;
};

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
};



//-----------------------MESSAGE_INPUT_PROCESSING-------------------------------------

function ParseMessage(message) {
// message = String
// returns list of message phrases and cuts !gamble from front e.g. "!gamble roulette 500 black" --> ["roulette", 500, "black"], "!gamble --help roulette" --> ["--help", "roulette"]

    CoreMessage = message.content.slice(8, 100); //remove !gamble from beginning of message
    // console.log(`Message received: ${CoreMessage}`);

    
    // .match function returns list, regex more "resilient" than splitting on spaces
    CoreMessage = CoreMessage.replace('—','--')
    let Phrases = CoreMessage.match(/(--|)([a-zA-Z0-9]+)/g);

    return Phrases;
};

function IsValidMessage(PhraseList) {
    // returns True if NO errors in message, add more things to this check as I think of/come across them

    switch(true) {
        case (!PhraseList):
        case (!PhraseList[0]):
        case (typeof(PhraseList[0]) != "string"):
            SendHelpMessage();
            return false;

        case (PhraseList[1] != PhraseList[1]):
        case (PhraseList[1] <= 0):
            RespondWith("Wager must be a positive number");
            return false;
    }

    return true;
};

function ExecuteGame(Player, Phrases) {
    //ADD GAMES HERE AND TO /src/games FOLDER AND REQUIRE ^^^
    let FirstWord = Phrases.shift();
    let Wager = Number(Phrases.shift());
    let HasWonTheGame=false;
    let AmountDifference=0;
    let AddToMessage='';

    switch (FirstWord) {
        case '--help':
            SendHelpMessage();
            break;
        case '--balance':
            UpdateBalance(Player);
            break;
        case 'slots':
            Lines = Number(Phrases.shift());
            if (isNaN(Lines) || Lines > 5 || Lines < 1) {
                RespondWith('Invalid number of lines. Slots command is: "!gamble slots {wager} {lines 1-5}". Use "!gamble --help" for more information.');
                break;
            }
            [HasWonTheGame, AmountDifference, AddToMessage] = SLOTS.play(Wager, Lines);
            break;
        case 'roulette':
            Color = Phrases.shift();
            if (!(['red', 'black'].includes(Color))) {
                //console.log('invalid roulette choice');
                RespondWith('Invalid color choice. Roulette command is: "!gamble roulette {wager} {red/black}". Use "!gamble --help" for more information.');
                break;
            }
            [HasWonTheGame, AmountDifference, AddToMessage] = ROULETTE.play(Wager, Color);
            break;
        default:
            RespondWith('Sorry, that command was not recognized. Use "!gamble --help" for more information.');
            break;
    }

    return [HasWonTheGame, AmountDifference, AddToMessage];
};



//-----------------------DISCORD_CLIENT_ACTIONS-------------------------------------

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
});

client.on('messageCreate', (message) => {
    
    if (message.author.bot) {
        return; //robots don't gamble
    }

    //use .match for this instead?
    let BeginningOfMessage = message.content.slice(0,7);
    if (BeginningOfMessage === '!gambl3') {
        UserMessage = message;
        Player = message.author;
        ReplyMessage = '';
        MessagePhrases = ParseMessage(message);

    } else {
        return;
    };


    let HasWonTheGame, AmountDifference, AddToMessage;
    if(IsValidMessage(MessagePhrases)){
        [HasWonTheGame, AmountDifference, AddToMessage] = ExecuteGame(Player, MessagePhrases);
    };

    if (AmountDifference) {
        ReplyMessage += AddToMessage;

        UpdateBalance(Player, AmountDifference);

        RespondWith(GenerateResultMessage(HasWonTheGame, AmountDifference)); 
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
};


// callback for GetToken, gives login token to client once it is read from file
function ClientLogin() {
    client.login(DiscordBotToken);
    return
};

LoginDiscordBot = GetToken(ClientLogin);
