export default class View {
    $ = {};
    $$ = {};

    constructor() {
        this.$.actionBtn = this.#selector("[data-id='action-button']");
        this.$.actionItems = this.#selector("[data-id='action-items']");
        this.$.resetBtn = this.#selector("[data-id='reset-btn']");
        this.$.newRoundBtn = this.#selector("[data-id='new-round-btn']");
        this.$.modal = this.#selector("[data-id='modal']");
        this.$.modalText = this.#selector("[data-id='modal-text']");
        this.$.modalBtn = this.#selector("[data-id='modal-btn']");
        this.$.turn = this.#selector("[data-id='turn']");
        this.$.playerTurn = this.#selector("[data-id='player-turn']");
        this.$.p1Wins = this.#selector("[data-id='p1-wins']");
        this.$.p2Wins = this.#selector("[data-id='p2-wins']");
        this.$.ties = this.#selector("[data-id='ties']");

        this.$$.squares = this.#selectorAll("[data-id='square']");

        // UI-only eventListener
        // ✅ Toggle Actions
        this.$.actionBtn.addEventListener("click", () => {
            this.#toggleMenu();
        });
    }

    #toggleMenu() {
        this.$.actionBtn.classList.toggle("border");
        this.$.actionItems.classList.toggle("hidden");

        const icon = this.$.actionBtn.querySelector("i");
        icon.classList.toggle("fa-chevron-down");
        icon.classList.toggle("fa-chevron-up");
    }

    handlePlayerMove(squareId, player) {
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", player.iconClass, player.colorClass);

        squareId.replaceChildren(icon);
    }

    initializeMoves(moves) {
        this.$$.squares.forEach(square => {
            const existingMove = moves.find(move => move.squareId === +square.id)

            if (existingMove) {
                this.handlePlayerMove(square, existingMove.player);
            }
        });
    }

    setTurnIndicator(player) {
        const icon = document.createElement("i");
        const label = document.createElement("p");

        icon.classList.add("fa-solid", player.colorClass, player.iconClass);

        label.classList.add(player.colorClass);
        label.textContent = `Turn: ${player.name}`;

        this.$.turn.replaceChildren(icon, label);
    }

    resetEvent(handler) {
        this.$.resetBtn.addEventListener("click", handler);
        this.$.modalBtn.addEventListener("click", handler);
    }

    newRoundEvent(handler) {
        this.$.newRoundBtn.addEventListener("click", handler);
    }

    playerMoveEvent(handler) {
        this.$$.squares.forEach((square) => {
            square.addEventListener("click", () => handler(square));
        });
    }

    #selector(selector, parent) {
        const element = parent ?
            parent.querySelector(selector) :
            document.querySelector(selector);

        if (!element) throw new Error("Could not find the element!");

        return element;
    }

    #selectorAll(selector) {
        const elementList = document.querySelectorAll(selector);

        if (!elementList) throw new Error("Could not find the element!");

        return elementList;
    }

    openModal(message) {
        this.$.modal.classList.remove("hidden");
        this.$.modalText.innerText = message;
    }

    closeAll() {
        this.#closeModal();
        this.#closeToggleMenu();
    }

    #closeModal() {
        this.$.modal.classList.add("hidden");
    }

    #closeToggleMenu() {
        setTimeout(() => {
            this.$.actionItems.classList.add("hidden");
            this.$.actionBtn.classList.remove("border");

            const icon = this.$.actionBtn.querySelector("i");
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");
        }, 25);
    }

    clearGameBoard() {
        this.$$.squares.forEach((square) => {
            square.replaceChildren();
        });
    }

    updateScoreBoard(p1wins, p2wins, ties) {
        this.$.p1Wins.innerText = `${p1wins} Wins`;
        this.$.p2Wins.innerText = `${p2wins} Wins`;
        this.$.ties.innerText = `${ties}`;
    }
}