let score = 0;
let timer = 60;
let interval;
const items = [
    { id: 'item1', src: 'images/avis.png', bin: 'papir' },
    { id: 'item2', src: 'images/plastflaske.png', bin: 'plast' },
    { id: 'item3', src: 'images/epleskrott.png', bin: 'mat' },
    { id: 'item4', src: 'images/glasskrukke.png', bin: 'glass' },
    { id: 'item5', src: 'images/papp.png', bin: 'papir' },
    { id: 'item6', src: 'images/plastpose.png', bin: 'plast' },
    { id: 'item7', src: 'images/brod.png', bin: 'mat' },
    { id: 'item8', src: 'images/vindusglass.png', bin: 'glass' },
];

function startGame() {
    // Tilfeldig utvalg av objekter
    const selectedItems = items.sort(() => 0.5 - Math.random()).slice(0, 6);
    const itemsContainer = document.getElementById('items');
    itemsContainer.innerHTML = '';

    selectedItems.forEach(item => {
        const img = document.createElement('img');
        img.id = item.id;
        img.src = item.src;
        img.className = 'item';
        img.setAttribute('draggable', 'true');
        img.setAttribute('data-bin', item.bin);
        img.setAttribute('ondragstart', 'drag(event)');
        itemsContainer.appendChild(img);
    });

    score = 0;
    timer = 60;
    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = timer;

    clearInterval(interval);
    interval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timer--;
    document.getElementById('timer').textContent = timer;

    if (timer <= 0) {
        clearInterval(interval);
        alert(`Tiden er ute! Du fikk ${score} poeng.`);
        startGame();
    }
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const itemId = event.dataTransfer.getData("text");
    const item = document.getElementById(itemId);
    const bin = event.target;

    if (item.dataset.bin === bin.id) {
        bin.appendChild(item);
        item.draggable = false;
        item.style.border = "3px solid #4CAF50";
        item.style.cursor = "default";
        updateScore(10); // Legg til poeng
    } else {
        item.style.border = "3px solid #E74C3C";
        updateScore(-5); // Trekk fra poeng
    }

    // Sjekk om alle objekter er sortert
    if (document.querySelectorAll('.item[draggable="true"]').length === 0) {
        clearInterval(interval);
        alert(`Gratulerer! Du sorterte alt riktig og fikk ${score} poeng!`);
        startGame();
    }
}

function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;
}

// Start spillet ved oppstart
startGame();
