const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
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

let arena = createMatrix(12, 20);
let player = {
    pos: { x: 0, y: 0 },
    matrix: null,
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

function draw() {
    context.fillStyle = '#34495e';
    context.fillRect(0, 0, canvas.width, canvas.height);

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
            if (m[y][x] !== 0) {
                if (
                    o.y + y < 0 || o.y + y >= arena.length || // out of vertical bounds
                    o.x + x < 0 || o.x + x >= arena[0].length || // out of horizontal bounds
                    arena[o.y + y] && arena[o.y + y][o.x + x] !== 0 // block collision
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
    }
    dropCounter = 0;
}

function playerMove(offset) {
    player.pos.x += offset;
    if (collide(arena, player)) {
        player.pos.x -= offset;  // Undo the move if collision occurs (no-clipping prevented)
    }
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

    if (collide(arena, player)) {
        gameOver();
    }
}

function gameOver() {
    alert('Game Over');
    resetGame();
}

function resetGame() {
    arena = createMatrix(12, 20);
    player.pos = { x: 0, y: 0 };
    player.matrix = null;
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
        playerMove(-1); // Move left
    } else if (event.key === 'ArrowRight') {
        playerMove(1);  // Move right
    } else if (event.key === 'ArrowDown') {
        playerDrop();  // Drop block down
    } else if (event.key === 'ArrowUp') {
        rotate(player.matrix, 1);  // Rotate block
    }
});

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

update();
