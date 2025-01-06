// prosjekt.js
// Hent modal-elementet
var modal = document.getElementById("myModal");

// Hent bildet og modal-bildeelementet
var modalImg = document.getElementById("img01");

// Hent alle bilder i grid4
var images = document.querySelectorAll(".grid4 .box4 img");

// Legg til klikkhendelse for hvert bilde
images.forEach(function(img) {
  img.onclick = function() {
    modal.style.display = "block";
    modalImg.src = this.src;
  }
});

// Hent <span> elementet som lukker modalen
var span = document.getElementsByClassName("close")[0];

// Når brukeren klikker på <span> (x), lukk modalen
span.onclick = function() {
  modal.style.display = "none";
}