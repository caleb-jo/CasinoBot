// ROULETTE


function GetRandomInt(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function GetColor() {
    Cell = GetRandomInt(1,37);
    switch (true){
        case (Cell <= 18): return 'red';
        case (Cell <= 36): return 'black';
        case (Cell === 37): return 'green';
    }

}

module.exports = {
    play: function(Wager, Color){
        let IsAWinner = false;
        let ResponseMessage = '';

        let RolledColor = GetColor();
        ResponseMessage += `:${RolledColor}_circle: :${RolledColor}_circle: :${RolledColor}_circle:`
        

        if (Color === RolledColor){
            IsAWinner = true;
            BalanceAdjustment = Wager * 2;
        }
        else {
            IsAWinner = false;
            BalanceAdjustment = 0 - Wager;
        }

        return [IsAWinner, BalanceAdjustment, ResponseMessage];

    },
}

