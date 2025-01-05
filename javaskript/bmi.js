function calculateBMI() {
    var weight = document.getElementById('weight').value;
    var height = document.getElementById('height').value;
  
    if (weight > 0 && height > 0) {
      var heightInMeters = height / 100;
      var bmi = weight / (heightInMeters * heightInMeters);
      document.getElementById('result').innerText = 'Your BMI is ' + bmi.toFixed(2);
    } else {
      document.getElementById('result').innerText = 'Please enter valid weight and height.';
    }
  }