const robot = require('robotjs');
const { exec } = require('child_process');

// Funksjon for å åpne en app
function openApp(command) {
    exec(command, (error) => {
        if (error) {
            console.error(`Kunne ikke åpne appen: ${error}`);
            return;
        }
        console.log(`App åpnet: ${command}`);
    });
}

// Oppsett for tastetrykk
function setupKeybindings() {
    console.log("Trykk Ctrl+C for å avslutte programmet.");

    // Sjekker tastetrykk kontinuerlig
    setInterval(() => {
        if (robot.keyToggle('control', 'down') && robot.keyTap('1')) {
            openApp("notepad");  // Åpner Notepad i Windows
        } else if (robot.keyToggle('control', 'down') && robot.keyTap('2')) {
            openApp("calc");     // Åpner kalkulator i Windows
        } else if (robot.keyToggle('control', 'down') && robot.keyTap('3')) {
            openApp("mspaint");  // Åpner Paint i Windows
        } else if (robot.keyToggle('control', 'down') && robot.keyTap('4')) {
            openApp("explorer"); // Åpner File Explorer i Windows
        }
    }, 100);  // Sjekker hvert 100 millisekund
}

// Starter oppsettet
setupKeybindings();
