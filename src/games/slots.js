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
    [':first_place:', 5],
    [':first_place:', 5],
    [':first_place:', 5],
    [':first_place:', 5],
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

let GoodValue;
function CheckIfLineIsWinning(Wheel, index) {
    let IsWinning = true;

    for (let Position = 0; Position < 5; Position++){
        if (index === 0){
            GoodValue = Screen[index][Position];
            // console.log(`FirstGoodValue: ${GoodValue}`);
        }
        
        // console.log(`Wheel Position: ${Wheel[Position]} , index: ${index}`);
        // console.log(`GoodValue: ${GoodValue} , index: ${index}`)
        IsWinning = (Wheel[Position] === GoodValue);
        if (!IsWinning) {
            return false;
        }
    }
    
    return true;

}




function MakeWheelsIntoLines(array) {

    let LinesArray = [];
    for (list in array) {
        let LinesList = []
        for (item in list) {
            LinesList.push[item];
        }
        LinesArray.push(LinesList);
    }
    return LinesArray;
}

function CheckIfLineIsWinning2(Line) {
    for (let Position = 0; Position < 5; Position++) {
        if (Position === 0){
            GoodValue = Line[Position];
            console.log(`FirstGoodValue: ${GoodValue}`);
        }
    }
}



module.exports = {
    play: function() {
        console.log('playing slots');
        
        for (let index = 0; index < 5; index++){
            Screen.push(CreateWheel());
        }

        let IsWinning = true;
        for (pos=0; pos < 5; pos++) {
        IsWinning = Screen.every( (Wheel) => {
            console.log("Current");
            console.log(Wheel[pos]);
            console.log("Good Value");
            console.log(Screen[0][pos]);
            console.log(Wheel[pos] === Screen[0][pos]);

            // console.log(`Current: ${Wheel[pos]} Good Value: ${Screen[0][pos]}`);
            return Wheel[pos] === Screen[0][pos]; //only have to check against first
        });
}
        console.log(IsWinning);
          

            
        ScreenAsLines = MakeWheelsIntoLines(Screen);
        
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
    },
}