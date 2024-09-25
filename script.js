var board = new Array(9).fill(null);
var currentPlayer = 'X';
var gameActive = true;
var isAgainstAI = true;
var cells = document.querySelectorAll('.cell');
var resetButton = document.getElementById('reset-button');
var winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
function handleCellClick(event) {
    var target = event.target;
    var cellIndex = Number(target.dataset.index);
    if (board[cellIndex] !== null || !gameActive || currentPlayer === 'O')
        return;
    makeMove(cellIndex);
    if (isAgainstAI && gameActive) {
        setTimeout(aiMove, 500);
    }
}
function makeMove(cellIndex) {
    if (board[cellIndex] !== null)
        return;
    board[cellIndex] = currentPlayer;
    cells[cellIndex].textContent = currentPlayer;
    if (checkWinner()) {
        setTimeout(function () { return alert("".concat(currentPlayer, " wins!")); }, 100);
        gameActive = false;
        return;
    }
    if (board.every(function (cell) { return cell !== null; })) {
        setTimeout(function () { return alert('Draw!'); }, 100);
        gameActive = false;
        return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}
function checkWinner() {
    return winningCombinations.some(function (combination) {
        var a = combination[0], b = combination[1], c = combination[2];
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}
function aiMove() {
    var bestMove = findBestMove();
    if (bestMove !== null) {
        makeMove(bestMove);
    }
}
function minimax(board, depth, isMaximizing, alpha, beta) {
    var winner = checkWinnerState(board);
    if (winner === 'O')
        return 10 - depth;
    if (winner === 'X')
        return depth - 10;
    if (board.every(function (cell) { return cell !== null; }))
        return 0;
    if (isMaximizing) {
        var maxEval = -Infinity;
        for (var i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                var evalScore = minimax(board, depth + 1, false, alpha, beta);
                board[i] = null;
                maxEval = Math.max(evalScore, maxEval);
                alpha = Math.max(alpha, evalScore);
                if (beta <= alpha)
                    break;
            }
        }
        return maxEval;
    }
    else {
        var minEval = Infinity;
        for (var i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                var evalScore = minimax(board, depth + 1, true, alpha, beta);
                board[i] = null;
                minEval = Math.min(evalScore, minEval);
                beta = Math.min(beta, evalScore);
                if (beta <= alpha)
                    break;
            }
        }
        return minEval;
    }
}
function findBestMove() {
    var bestScore = -Infinity;
    var move = null;
    for (var i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = 'O';
            var score = minimax(board, 0, false, -Infinity, Infinity);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}
function checkWinnerState(board) {
    for (var _i = 0, winningCombinations_1 = winningCombinations; _i < winningCombinations_1.length; _i++) {
        var combination = winningCombinations_1[_i];
        var a = combination[0], b = combination[1], c = combination[2];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}
function resetGame() {
    board = new Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(function (cell) { return (cell.textContent = ''); });
}
cells.forEach(function (cell) { return cell.addEventListener('click', handleCellClick); });
resetButton.addEventListener('click', resetGame);
