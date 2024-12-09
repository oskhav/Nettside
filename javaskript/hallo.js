

let a = [1, 2, 3, 4, 6]; // En array definert med noen tall

function kul(s) {
    let b = ""; // Start med en tom streng for å bygge resultatet

    // Iterer gjennom hvert andre element (hopp med 2 om gangen)
    for (let i = 0; i < s.length; i += 2) {
        b = b + s[i]; // Legg til hvert andre element i strengen b
    }

    return b; // Returner den oppbygde strengen
}

// Kall funksjonen med a som argument
console.log(kul(a));