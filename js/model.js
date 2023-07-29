const initialValue = {
    moves: [],
    history: {
        currentRoundGames: [],
        allGames: [],
    },
};

export default class Model {
    constructor(key, players) {
        this.localStorageKey = key;
        this.players = players;
    }

    get stats() {
        const state = this.#getState();

        return {
            playerWithStats: this.players.map((player) => {
                const wins = state.history.currentRoundGames.filter(
                    (game) => game.status.winner?.id === player.id
                ).length;

                return {
                    ...player,
                    wins,
                };
            }),

            ties: state.history.currentRoundGames.filter(
                (game) => game.status.winner === null
            ).length,
        };
    }

    get game() {
        const state = this.#getState();

        const currentPlayer = this.players[state.moves.length % 2];

        const winningPatterns = [
            [1, 2, 3],
            [1, 5, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 5, 7],
            [3, 6, 9],
            [4, 5, 6],
            [7, 8, 9],
        ];

        let winner = null;

        for (const player of this.players) {
            const selectedSquareIds = state.moves
                .filter((move) => move.player.id === player.id)
                .map((move) => move.squareId);

            for (const pattern of winningPatterns) {
                if (pattern.every((value) => selectedSquareIds.includes(value))) {
                    winner = player;
                }
            }
        }

        return {
            moves: state.moves,
            currentPlayer,
            status: {
                isComplete: winner != null || state.moves.length === 9,
                winner,
            },
        };
    }

    playerMove(squareId) {
        const stateClone = structuredClone(this.#getState());

        stateClone.moves.push({
            squareId,
            player: this.game.currentPlayer,
        });

        this.#saveState(stateClone);
    }

    reset() {
        const stateClone = structuredClone(this.#getState());

        const {
            status,
            moves
        } = this.game;

        if (status.isComplete) {
            stateClone.history.currentRoundGames.push({
                moves,
                status,
            });
        }

        stateClone.moves = [];

        this.#saveState(stateClone);
    }

    newRound() {
        this.reset();

        const stateClone = structuredClone(this.#getState());
        stateClone.history.allGames.push(...stateClone.history.currentRoundGames);
        stateClone.history.currentRoundGames = [];

        this.#saveState(stateClone);
    }

    #getState() {
        const item = window.localStorage.getItem(this.localStorageKey);

        return item ? JSON.parse(item) : initialValue;
    }

    #saveState(stateOrFunction) {
        const prevState = this.#getState();

        let newState;

        switch (typeof stateOrFunction) {
            case "function":
                newState = stateOrFunction(prevState);
                break;
            case "object":
                newState = stateOrFunction;
                break;
            default:
                throw new Error("Invalid argument passed to saveState.");
        }

       window.localStorage.setItem(this.localStorageKey, JSON.stringify(newState));
    }
}