const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);  // Scale the drawing for each block to make it easier to work with

const colors = [
    null, '#f39c12', '#2ecc71', '#3498db', '#9b59b6', '#e74c3c', '#f1c40f', '#e67e22'
];

let arena = createMatrix(12, 20);
let player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0,
    level: 1,
    lines: 0,
};

let dropCounter = 0;
let dropInterval = 1000; // Start speed
let lastTime = 0;

function createMatrix(width, height) {
    const matrix = [];
    while (height--) matrix.push(new Array(width).fill(0));
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

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
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

// Draw the grid on top of the game canvas
function drawGrid() {
    context.strokeStyle = 'rgba(249, 242, 242, 0.1)'; // Light grid lines
    for (let x = 0; x < canvas.width / 20; x++) {
        for (let y = 0; y < canvas.height / 20; y++) {
            context.strokeRect(x, y, 1, 1); // Draw small grid squares
        }
    }
}

function draw() {
    context.fillStyle = '#34495e';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid(); // Draw the grid first
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - 
                   (player.matrix[0].length / 2 | 0);

    if (collide(arena, player)) {
        endGame();
    }
}

function rotate(matrix, dir) {
    const pos = player.pos.x;
    let offset = 1;

    // Rotate the matrix
    const rotated = matrix.map((_, i) => matrix.map(row => row[i]));
    if (dir > 0) rotated.forEach(row => row.reverse());
    else rotated.reverse();

    // Check if it can fit
    player.matrix = rotated;
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            player.pos.x = pos;
            return;
        }
    }
}

function playerRotate(dir) {
    rotate(player.matrix, dir);
}

function clearLines() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) continue outer;
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        player.lines++;
        rowCount *= 2;

        if (player.lines % 10 === 0) {
            player.level++;
            dropInterval = Math.max(100, 1000 - (player.level * 100));
        }
    }
    document.getElementById('score').textContent = player.score;
    document.getElementById('level').textContent = player.level;
    document.getElementById('lines').textContent = player.lines;
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        clearLines();
        playerReset();
    }
    dropCounter = 0;
}

function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    arena = createMatrix(12, 20);
    player.score = 0;
    player.lines = 0;
    player.level = 1;
    dropInterval = 1000;
    playerReset();
    update();
}

function restartGame() {
    startGame();
}

function endGame() {
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'block';
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') player.pos.x -= 1;
    if (event.key === 'ArrowRight') player.pos.x += 1;
    if (event.key === 'ArrowDown') playerDrop();
    if (event.key === 'ArrowUp') playerRotate(1);

    if (collide(arena, player)) {
        if (event.key === 'ArrowLeft') player.pos.x += 1;
        if (event.key === 'ArrowRight') player.pos.x -= 1;
    }
});

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) playerDrop();

    draw();
    requestAnimationFrame(update);
}
