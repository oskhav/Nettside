function erPrimtall(n) {
    // Sjekker om tallet er mindre enn 2, som ikke er primtall
    if (n < 2) {
        return false;
    }
    
    // Sjekker om tallet kan deles på noen tall fra 2 til kvadratroten av n
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            return false; // Tallet er delelig med et annet tall enn 1 og seg selv
        }
    }
    
    return true; // Tallet er et primtall
}

// Test eksempler
console.log(erPrimtall(7));   // true
console.log(erPrimtall(10));  // false
