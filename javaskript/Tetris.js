const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const startScreen = document.getElementById('startScreen');
const gameContainer = document.getElementById('gameContainer');
const gameOverScreen = document.getElementById('gameOverScreen');

context.scale(20, 20);

// Fargekart for blokkene
const colors = [
    null,        // Ingen blokk
    '#f39c12',   // T-blokk
    '#2ecc71',   // O-blokk
    '#3498db',   // L-blokk
    '#9b59b6',   // J-blokk
    '#e74c3c',   // I-blokk
    '#f1c40f',   // S-blokk
    '#e67e22',   // Z-blokk
];

const points = [0, 40, 100, 300, 1200];
let arena = createMatrix(12, 20);
let player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0,
    lines: 0,
    level: 1,
};

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function createMatrix(width, height) {
    const matrix = [];
    while (height--) {
        matrix.push(new Array(width).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    if (type === 'T') return [[0, 1, 0], [1, 1, 1], [0, 0, 0]];
    if (type === 'O') return [[2, 2], [2, 2]];
    if (type === 'L') return [[0, 0, 3], [3, 3, 3], [0, 0, 0]];
    if (type === 'J') return [[4, 0, 0], [4, 4, 4], [0, 0, 0]];
    if (type === 'I') return [[0, 0, 0, 0], [5, 5, 5, 5], [0, 0, 0, 0]];
    if (type === 'S') return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];
    if (type === 'Z') return [[7, 7, 0], [0, 7, 7], [0, 0, 0]];
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function drawGrid() {
    context.lineWidth = 0.05;
    context.strokeStyle = '#7f8c8d';
    for (let x = 0; x < canvas.width / 20; x++) {
        for (let y = 0; y < canvas.height / 20; y++) {
            context.strokeRect(x, y, 1, 1);
        }
    }
}

function draw() {
    context.fillStyle = '#34495e';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid(); // Tegn rutenett
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (
                m[y][x] !== 0 &&
                (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0
            ) {
                return true;
            }
        }
    }
    return false;
}

function arenaSweep() {
    let rowCount = 1;
    for (let y = arena.length - 1; y >= 0; --y) {
        if (arena[y].every(value => value !== 0)) {
            arena.splice(y, 1);
            arena.unshift(new Array(arena[0].length).fill(0));
            player.score += points[rowCount];
            player.lines += rowCount;
            rowCount++;
        }
    }
    updateScore();
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        arenaSweep();
        playerReset();
    }
    dropCounter = 0;
}

function playerMove(offset) {
    player.pos.x += offset;
    if (collide(arena, player)) {
        player.pos.x -= offset;
    }
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

    if (collide(arena, player)) {
        showGameOver();
    }
}

function updateScore() {
    scoreElement.innerText = player.score;
    linesElement.innerText = player.lines;
    levelElement.innerText = player.level;

    player.level = Math.floor(player.lines / 10) + 1;
    dropInterval = 1000 - (player.level - 1) * 100;
}

function showGameOver() {
    gameOverScreen.style.display = 'block';
}

function startGame() {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'flex';
    playerReset();
    updateScore();
    update();
}

function restartGame() {
    gameOverScreen.style.display = 'none';
    arena = createMatrix(12, 20);
    player.score = 0;
    player.lines = 0;
    player.level = 1;
    playerReset();
    updateScore();
}

function rotate(matrix, dir) {
    const rotated = matrix.map((_, i) => matrix.map(row => row[i]));
    if (dir > 0) {
        rotated.forEach(row => row.reverse());
    } else {
        rotated.reverse();
    }
    player.matrix = rotated;
    if (collide(arena, player)) {
        rotated.forEach(row => row.reverse());
        if (dir > 0) rotated.reverse();
        else rotated.reverse();
    }
}

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        playerMove(-1);
    } else if (event.key === 'ArrowRight') {
        playerMove(1);
    } else if (event.key === 'ArrowDown') {
        playerDrop();
    } else if (event.key === 'ArrowUp') {
        rotate(player.matrix, 1);
    }
});