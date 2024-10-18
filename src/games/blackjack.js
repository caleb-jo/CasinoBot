
let NumberList = ['A', '2','3','4','5','6','7','8','9','10','J','Q','K']
let SuitsList = [':spades:', ':clubs:', ':hearts:', ':diamonds:']
let Deck = []

function CreateDeck() {
    for (let i=0; i < NumberList.length; i++){
        for (let j=0; j < SuitsList.length; j++){
            Deck.push(NumberList[i] + SuitsList[j])
        }
    }
    print(Deck)
}


module.exports = {
    play: function(Wager){
        let IsAWinner = false;
        let ResponseMessage = '';






        return [IsAWinner, BalanceAdjustment, ResponseMessage];

    },
}

