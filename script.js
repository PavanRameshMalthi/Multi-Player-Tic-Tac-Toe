const state = {
    gridSize: 3,
    board: [],
    currentPlayer: "X",
    gameOver: false,
    scores: {
        X: 0,
        O: 0,
        draws: 0
    },
    history: []
};

const dom = {
    board: document.getElementById("gameBoard"),
    boardSize: document.getElementById("boardSize"),
    resetBtn: document.getElementById("resetMatchBtn"),
    nextBtn: document.getElementById("nextGameBtn"),
    status: document.getElementById("statusDisplay"),
    scoreX: document.getElementById("scoreX"),
    scoreO: document.getElementById("scoreO"),
    scoreDraws: document.getElementById("scoreDraws"),
    historyList: document.getElementById("historyList")
};

function startGame(resetScores = false) {

    state.gridSize = Number(dom.boardSize.value);

    state.board = Array(state.gridSize * state.gridSize).fill("");

    state.currentPlayer = "X";
    state.gameOver = false;

    state.history = [];

    if (resetScores) {
        state.scores = {
            X: 0,
            O: 0,
            draws: 0
        };
    }

    renderBoard();
    updateStatus();
    updateScores();

    dom.nextBtn.style.display = "none";

    addHistory("Game Started");
}

function renderBoard() {

    dom.board.innerHTML = "";

    dom.board.style.gridTemplateColumns =
        `repeat(${state.gridSize}, 1fr)`;

    state.board.forEach((_, index) => {

        const cell = document.createElement("button");

        cell.classList.add("cell");

        cell.dataset.index = index;

        cell.addEventListener("click", handleMove);

        dom.board.appendChild(cell);
    });
}

function handleMove(e) {

    if (state.gameOver) return;

    const index = Number(e.target.dataset.index);

    if (state.board[index] !== "") return;

    state.board[index] = state.currentPlayer;

    e.target.textContent = state.currentPlayer;
    e.target.classList.add(state.currentPlayer);

    const row = Math.floor(index / state.gridSize) + 1;
    const col = (index % state.gridSize) + 1;

    addHistory(
        `Player ${state.currentPlayer} played (${row}, ${col})`
    );

    const winningLine = checkWinner();

    if (winningLine) {

        winningLine.forEach(i => {
            dom.board.children[i].classList.add("winning-cell");
        });

        addHistory(`🏆 Player ${state.currentPlayer} Won`);

        state.scores[state.currentPlayer]++;

        updateScores();

        state.gameOver = true;

        dom.status.innerHTML =
            `Winner:
            <span class="turn-indicator turn-${state.currentPlayer.toLowerCase()}">
            Player ${state.currentPlayer}
            </span>`;

        dom.nextBtn.style.display = "block";

        return;
    }

    if (!state.board.includes("")) {

        state.scores.draws++;

        updateScores();

        addHistory("🤝 Draw Match");

        state.gameOver = true;

        dom.status.innerHTML =
            `<span class="turn-indicator">
            It's a Draw!
            </span>`;

        dom.nextBtn.style.display = "block";

        return;
    }

    state.currentPlayer =
        state.currentPlayer === "X" ? "O" : "X";

    updateStatus();
}

function checkWinner() {

    const lines = [];

    for (let r = 0; r < state.gridSize; r++) {

        const row = [];

        for (let c = 0; c < state.gridSize; c++) {
            row.push(r * state.gridSize + c);
        }

        lines.push(row);
    }

    for (let c = 0; c < state.gridSize; c++) {

        const col = [];

        for (let r = 0; r < state.gridSize; r++) {
            col.push(r * state.gridSize + c);
        }

        lines.push(col);
    }

    const diag1 = [];
    const diag2 = [];

    for (let i = 0; i < state.gridSize; i++) {

        diag1.push(i * state.gridSize + i);

        diag2.push(
            i * state.gridSize +
            (state.gridSize - 1 - i)
        );
    }

    lines.push(diag1);
    lines.push(diag2);

    for (const line of lines) {

        const first = state.board[line[0]];

        if (
            first &&
            line.every(i => state.board[i] === first)
        ) {
            return line;
        }
    }

    return null;
}

function updateStatus() {

    dom.status.innerHTML =
        `Current Turn:
        <span class="turn-indicator turn-${state.currentPlayer.toLowerCase()}">
        Player ${state.currentPlayer}
        </span>`;
}

function updateScores() {

    dom.scoreX.textContent = state.scores.X;
    dom.scoreO.textContent = state.scores.O;
    dom.scoreDraws.textContent = state.scores.draws;
}

function addHistory(message) {

    state.history.push(message);

    dom.historyList.innerHTML = "";

    state.history.forEach((item, index) => {

        const li = document.createElement("li");

        li.classList.add("history-item");

        li.innerHTML =
            `<span>${index + 1}. ${item}</span>`;

        dom.historyList.appendChild(li);
    });

    dom.historyList.scrollTop =
        dom.historyList.scrollHeight;
}

dom.boardSize.addEventListener("change", () => {
    startGame(true);
});

dom.resetBtn.addEventListener("click", () => {
    startGame(true);
});

dom.nextBtn.addEventListener("click", () => {
    startGame(false);
});

startGame(true);