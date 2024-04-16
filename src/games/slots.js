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
    [':first_place:', 5], //0
    [':first_place:', 5], //0
    [':first_place:', 5], //0
    [':first_place:', 5], //0
    [':first_place:', 5], //0

    /*
    [':bell:', 3],
    [':crown:', 3],
    [':money_mouth_face:', 2],
    [':checkered_flag:', 2],
    */


/*
    [':fleur_de_lis:', 1.5],
    [':infinity:', 1.5],
    [':star:', 1.5],
    [':heart_on_fire:', 1.25],
    [':smiling_imp:', 1.25],
    [':tv:', 1.1],
    [':pig:', 1],
    [':santa:', 1],
    [':moyai:', 1],
    [':battery:', 1],
    [':money_with_wings:', 0.5],
    [':apple:', 0.5],
    [':poop:', 0.5],
    [':rocket:', 0.25],
    [':baseball:', 0.25], //19
*/
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


function CheckIfLineIsWinning(Wheel, index) {
    let IsWinning = true;
    let GoodValue;

    
    
    return true;

}




function MakeWheelsIntoLines(Screen) {

    let LinesArray = [];
    let LinesList = [];

    for (let Wheel = 0; Wheel < 5; Wheel++) {
        for (let Position = 0; Position < 5; Position++) {
            LinesList.push(Screen[Position][Wheel]);
        }
        LinesArray.push(LinesList);
        LinesList = [];
    }
    
    return LinesArray;
}
    


module.exports = {
    play: function() {
        console.log('playing slots');
        Screen = [];
        
        for (let index = 0; index < 5; index++){
            Screen.push(CreateWheel());
        }

        ScreenAsLines = MakeWheelsIntoLines(Screen);

        CheckIfLineIsWinning(ScreenAsLines);

        for(Line of ScreenAsLines) {

            console.log(Line);
            if (Line.every( (Pos) => {if(Line[Pos] === Line[0]){return true}})) {
                console.log(`Line ${Line+1} is a WINNER!`);
            }

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
}
