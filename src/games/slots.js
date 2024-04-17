// SLOTS

let Output;
let SymbolBin;
let RandomBin;
let RandomIndex;
let Screen = [];
//let StartPosition;
//let ListOfIndices;
//let Wheel;

const SYMBOLMULTIPLIERS = [
    [':first_place:',           5000], //0
    [':bell:',                  2500],
    [':bell:',                  2500],
    [':money_with_wings:',      1500],
    [':money_with_wings:',      1500],
    [':money_with_wings:',      1500],
    [':pig:',                   750],
    [':pig:',                   750],
    [':pig:',                   750],
    [':pig:',                   750],
    [':pig:',                   750],
    [':poop:',                  500],
    [':poop:',                  500],
    [':poop:',                  500],
    [':poop:',                  500],
    [':poop:',                  500],
    [':poop:',                  500],
    //[':crown:',                 800],
    //[':money_mouth_face:',      8000],
    //[':checkered_flag:',        5000],
    //[':fleur_de_lis:',          5000],
    //[':infinity:',              5000], 
    //[':star:',                  3000],
    //[':heart_on_fire:',         3000],
    //[':smiling_imp:',           3000],
    //[':tv:',                    10],
    //[':santa:',                 6],
    //[':moyai:',                 5],
    //[':battery:',               5],
    //[':apple:',                 5],
    //[':rocket:',                5],
    //[':baseball:',              5],
];

/*
let EmojiList = [
    ':heart_on_fire:',
    ':fleur_de_lis:',
    ':infinity:',
    ':checkered_flag:',
    ':tv:',
    ':moyai:',
    ':bell:',
    ':battery:',
    ':money_with_wings:',
    ':rocket:',
    ':first_place:',
    ':baseball:',
    ':apple:',
    ':star:',
    ':pig:',
    ':crown:',
    ':santa:',
    ':poop:',
    ':smiling_imp:',
    ':money_mouth_face:',
]
*/

function GetRandomInt(min, max) {
    return Math.floor(Math.random() * max) + min;
  }

function CreateWheel() {
    SymbolBin = [];
    RandomBin = [];
    for (let value of SYMBOLMULTIPLIERS) {
        SymbolBin.push(value);
    }
    
    while (true) {
        RandomIndex = GetRandomInt(0, SymbolBin.length);
        if (SymbolBin.length == 0) {
            break;
        }

        RandomBin.push(SymbolBin[RandomIndex]);
        SymbolBin.splice(RandomIndex, 1); //SLICE SYMBOLMODIFIERS INSTEAD OF SPLICE!
    }

    let WheelFinal = SpinWheel(RandomBin);

    return WheelFinal;
}


// Selects five consecutive emojis from the wheel
function SpinWheel(List) {
    let StartPosition = GetRandomInt(0, List.length - 1);
    let Wheel = [];

    Wheel = List.concat(List).slice(StartPosition, StartPosition+5);
    //console.log(`WHEEL: ${Wheel}`);

    return Wheel;
    /*
    should return
    [
        [':crown:', 3],
        [':money_mouth_face:', 2],
        [':checkered_flag:', 2],
        [':fleur_de_lis:', 1.5],
        [':infinity:', 1.5],
    ]
    */
}


function CheckIfLineIsWinning(LineFlags) {
    let WinningLines = [];
    let IsWinning;
    let WinningMultipliers = [];



    for (pos in LineFlags) {
        IsWinning = Screen.every(
            (Wheel) => {
                let GoodValue = Screen[0][pos][0];
                let CurrentValue = Wheel[pos][0];
                return CurrentValue === GoodValue;
            }
        )
        if (IsWinning) {
            // console.log(IsWinning, pos);
            WinningLines.push(Number(pos)+1);
            WinningMultipliers.push(Screen[0][pos][1]);
        }
        
    }
    
    return [WinningMultipliers, WinningLines];

}

function GenerateLineFlags(LineCount) {
    let LineFlags = [];
    switch(LineCount) {
        case 1: LineFlags = [2];         break;
        case 2: LineFlags = [0,2];       break;
        case 3: LineFlags = [0,2,4];     break;
        case 4: LineFlags = [0,1,2,4];   break;
        case 5: LineFlags = [0,1,2,3,4]; break;
    }

    return LineFlags
}

function CalculateBalanceAdjustment(BetPerLine, LineCount, MultiplierList) {
    let Adjustment = 0;
    
    for (Multiplier of MultiplierList) {
        Adjustment += (BetPerLine * Multiplier);
    }

    let MissedLines = LineCount - MultiplierList.length;
    Adjustment -= (BetPerLine * MissedLines);

    return Adjustment;
}

function ReformatArrayForResponseMessage(array){
    let width = array.length;
    let height = array[0].length;
    let OutputMessage = 'Trusty and Reliable Slot Machine!\n------------------------\n';



    for (let w = 0; w < width; w++){
        for (let h = 0; h < height; h++) {
            if (h === 0) {
                OutputMessage += '[-'
            }
            OutputMessage += String(array[h][w][0]);
            OutputMessage += '-';
            if (h === height-1) {
                OutputMessage += ']';
            }
        }
        OutputMessage += '\n------------------------\n';
    }

    return OutputMessage;

}

module.exports = {
    play: function(Wager, LineCount) {

        let IsAWinner = false;
        let BalanceAdjustment = 1;
        let ResponseMessage = '';

        // console.log('playing slots');
        Screen = [];
        let WinningMultipliersList = [];
        let WinningLinesList = [];
        
        for (let index = 0; index < 5; index++){
            Screen.push(CreateWheel());
        }

        [WinningMultipliersList, WinningLinesList] = CheckIfLineIsWinning(GenerateLineFlags(LineCount));
        // console.log(`WinningMultipliersList`);

        if (WinningLinesList.length) {
            IsAWinner = true;
            BalanceAdjustment = CalculateBalanceAdjustment(Wager, LineCount, WinningMultipliersList);
        }
        else {
            IsAWinner = false;
            BalanceAdjustment = 0 - (Wager * LineCount);
        }

        ResponseMessage = ReformatArrayForResponseMessage(Screen);
    
        return [IsAWinner, BalanceAdjustment, ResponseMessage];
        


    }
        
}
        // console.log(`SCREEN: ${Screen}`);
        // console.log(ScreenAsLines.every(CheckIfLineIsWinning));

        /*
        for (Line in ScreenAsLines) {
            IsLineWinning = CheckIfLineIsWinning2(Line);
            console.log(IsLineWinning);
        }
        */
        

        



/*
        for (let Position = 0; Position < 5; Position++){
            
            for(let Wheel = 0; Wheel < 5; Wheel++){
                

                // is Screen[Wheel][Position] == all Screen[Wheel][Position]
            }
        }
*/
