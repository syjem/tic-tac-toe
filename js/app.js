import View from "./view.js";
import Model from "./model.js";

const players = [{
        id: 1,
        name: "Player 1",
        iconClass: "fa-x",
        colorClass: "turquoise",
    },
    {
        id: 2,
        name: "Player 2",
        iconClass: "fa-o",
        colorClass: "yellow",
    },
];

function init() {
    const view = new View();
    const model = new Model('localStorage-key', players);

    function initView() {
        view.closeAll();

        view.clearGameBoard();

        view.setTurnIndicator(model.game.currentPlayer);

        view.updateScoreBoard(
            model.stats.playerWithStats[0].wins,
            model.stats.playerWithStats[1].wins,
            model.stats.ties
        );

        view.initializeMoves(model.game.moves);
    }

    window.addEventListener("storage", () => {
        console.log("State change from the other tab.");
        initView();
    });

    initView();

    view.resetEvent((event) => {
        model.reset();
        initView();
    });

    view.newRoundEvent((event) => {
        model.newRound();
        initView();
    });

    view.playerMoveEvent((square) => {
        const existingMove = model.game.moves.find(
            (move) => move.squareId === +square.id
        );

        if (existingMove) {
            return;
        }

        // Place an icon of the current player in a square
        view.handlePlayerMove(square, model.game.currentPlayer);

        // Advance to the next state by pushing a move to moves array
        model.playerMove(+square.id);

        if (model.game.status.isComplete) {
            view.openModal(
                model.game.status.winner ?
                `${model.game.status.winner.name} wins!` :
                "Tie!"
            );

            return;
        }

        // Set the next player's turn indicator
        view.setTurnIndicator(model.game.currentPlayer);

        // Close toggle menu
        view.closeAll();
    });
}

window.addEventListener("load", init);