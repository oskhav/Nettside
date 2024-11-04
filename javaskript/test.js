// Be om input fra brukeren
let input1 = prompt("Vennligst skriv inn det første tallet:");
let input2 = prompt("Vennligst skriv inn det andre tallet:");

// Konverter til tall
let number1 = parseFloat(input1);
let number2 = parseFloat(input2);

// Sjekk om begge inngangene er tall
if (isNaN(number1) || isNaN(number2)) {
    console.log("En eller begge inngangene er ikke tall.");
    document.getElementById("result").innerHTML = "En eller begge inngangene er ikke tall.";
} else {
    // Summer tallene
    let sum = number1 + number2;

    // Vis resultatet i terminalen
    console.log("Inngangene var: " + number1 + " og " + number2);
    console.log("Summen av tallene er: " + sum);

    // Vis resultatet på nettstedet
    document.getElementById("result").innerHTML = "Inngangene var: " + number1 + " og " + number2 + "<br>" + "Summen av tallene er: " + sum;
}
