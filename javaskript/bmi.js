// JavaScript-fil: bmi.js

// Funksjon som beregner BMI
function calculateBMI() {
  // Henter brukerens vekt fra input-feltet med id 'weight'
  var weight = document.getElementById('weight').value;
  
  // Henter brukerens høyde fra input-feltet med id 'height'
  var height = document.getElementById('height').value;

  // Sjekker om både vekt og høyde er gyldige (større enn 0)
  if (weight > 0 && height > 0) {
    
    // Konverterer høyden fra centimeter til meter
    var heightInMeters = height / 100;
    
    // Beregner BMI ved å bruke formelen BMI = vekt / (høyde * høyde)
    var bmi = weight / (heightInMeters * heightInMeters);
    
    // Vist resultatet i HTML-elementet med id 'result'
    // Runder av BMI-resultatet til 2 desimaler og viser det som tekst
    document.getElementById('result').innerText = 'Din BMI er ' + bmi.toFixed(2);
  } else {
    // Hvis vekt eller høyde er ugyldige, vises en feilmelding
    document.getElementById('result').innerText = 'Vennligst skriv inn gyldig vekt og høyde.';
  }
}
