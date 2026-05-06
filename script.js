// Load places on home page
function loadPlaces() {
  const container = document.getElementById("results");
  if (!container) return;

  const places = JSON.parse(localStorage.getItem("places")) || [];

  container.innerHTML = "";

  places.forEach((place) => {
    const div = document.createElement("div");
    div.className = "result-item";

    div.innerHTML = `
            <strong>${place.name}</strong><br>
            Type: ${place.type}<br>
            ⭐ ${place.rating} | 📝 ${place.reviews}
        `;

    container.appendChild(div);
  });
}

// Sort function
function sortPlaces() {
  let places = JSON.parse(localStorage.getItem("places")) || [];
  const type = document.getElementById("sortBy").value;

  if (type === "rating") {
    places.sort((a, b) => b.rating - a.rating);
  } else if (type === "reviews") {
    places.sort((a, b) => b.reviews - a.reviews);
  }

  displaySorted(places);
}

function displaySorted(places) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  places.forEach((place) => {
    const div = document.createElement("div");
    div.className = "result-item";

    div.innerHTML = `
            <strong>${place.name}</strong><br>
            ⭐ ${place.rating} | 📝 ${place.reviews}
        `;

    container.appendChild(div);
  });
}

// Form handling
document.addEventListener("DOMContentLoaded", () => {
  loadPlaces();

  const form = document.getElementById("placeForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const type = document.getElementById("type").value;
      const rating = document.getElementById("rating").value;
      const reviews = document.getElementById("reviews").value;

      if (!name || rating < 1 || rating > 5) {
        document.getElementById("message").textContent = "Invalid input!";
        return;
      }

      const place = {
        name,
        type,
        rating: Number(rating),
        reviews: Number(reviews),
      };

      let places = JSON.parse(localStorage.getItem("places")) || [];
      places.push(place);

      localStorage.setItem("places", JSON.stringify(places));

      document.getElementById("message").textContent = "Place added!";
      form.reset();
    });
  }
});

// Basic map
let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -1.286389, lng: 36.817223 },
    zoom: 12,
  });
}
