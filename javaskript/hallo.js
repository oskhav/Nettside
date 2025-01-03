const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const startScreen = document.getElementById('startScreen');
const gameContainer = document.getElementById('gameContainer');
const gameOverScreen = document.getElementById('gameOverScreen');

context.scale(20, 20);

const colors = [
    null,
    '#f39c12',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#e74c3c',
    '#f1c40f',
    '#e67e22',
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

function updateScore() {
    scoreElement.innerText = player.score;
    linesElement.innerText = player.lines;
    levelElement.innerText = player.level;

    player.level = Math.floor(player.lines / 10) + 1;
    dropInterval = Math.max(100, 1000 - Math.pow(player.level, 2) * 50);

    if (player.level > 1) {
        console.log(`Nivå opp! Du er nå på nivå ${player.level}.`);
    }
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

// Resten av spillets funksjoner...
