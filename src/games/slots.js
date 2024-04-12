// SLOTS

let Output;
let SymbolBin;
let RandomBin;
let RandomIndex;
//let StartPosition;
//let ListOfIndices;
//let Wheel;

const SYMBOLMULTIPLIERS = [
    [':first_place:', 5],
    [':bell:', 3],
    [':crown:', 3],
    [':money_mouth_face:', 2],
    [':checkered_flag:', 2],
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
    [':baseball:', 0.25],
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
        SymbolBin.splice(RandomIndex, 1);  
    }

    Wheel = SpinWheel(RandomBin);

    return Wheel;
}


//Selects five consecutive emojis from the wheel
function SpinWheel(List) {
    let StartPosition = GetRandomInt(0, List.length);
    let ListOfIndices = [];
    let Wheel = [];

    for (let index = 0; index < 5; index++) {
        ListOfIndices.push(index + StartPosition);        
    }

    for (let value of ListOfIndices) {
        Wheel.push(List[value]);
    }

    return Wheel

}

module.exports = {
    play: function(){
        console.log('playing slots');
        Wheel1 = CreateWheel();
        Wheel2 = CreateWheel();
        Wheel3 = CreateWheel();
        Wheel4 = CreateWheel();
        Wheel5 = CreateWheel();

        console.log(Wheel1);
        console.log(Wheel2);
        console.log(Wheel3);
        console.log(Wheel4);
        console.log(Wheel5);
    },
}