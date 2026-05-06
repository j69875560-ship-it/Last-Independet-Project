let map;
let service;
let markers = [];
let userLocation;
let directionsService;
let directionsRenderer;

// Initialize map
function initMap() {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLocation = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      loadMap();
    },
    () => {
      // fallback (Nairobi)
      userLocation = { lat: -1.286389, lng: 36.817223 };
      loadMap();
    },
  );
}

function loadMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: userLocation,
    zoom: 14,
  });

  service = new google.maps.places.PlacesService(map);

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // User marker
  new google.maps.Marker({
    position: userLocation,
    map,
    label: "You",
  });

  loadSavedPlaces();
}

// 🔍 SEARCH nearby places
function searchPlaces() {
  clearMarkers();

  const keyword = document.getElementById("searchInput").value;
  const radius = document.getElementById("radius").value;

  const request = {
    location: userLocation,
    radius: radius,
    keyword: keyword,
  };

  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      processResults(results);
    }
  });
}

// 🧠 Process + sort results
function processResults(results) {
  const sortBy = document.getElementById("sortBy").value;

  results.forEach((place) => {
    place.distance = getDistance(userLocation, place.geometry.location);
  });

  if (sortBy === "distance") {
    results.sort((a, b) => a.distance - b.distance);
  } else if (sortBy === "rating") {
    results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    results.sort(
      (a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0),
    );
  }

  displayResults(results);
}

// 📍 Show markers + list
function displayResults(places) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  places.forEach((place) => {
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
    });

    markers.push(marker);

    const div = document.createElement("div");
    div.className = "result-item";

    div.innerHTML = `
            <strong>${place.name}</strong><br>
            ⭐ ${place.rating || "N/A"} | 📝 ${place.user_ratings_total || 0}
        `;

    div.onclick = () => showRoute(place.geometry.location);

    container.appendChild(div);
  });
}

// 🚗 Show shortest route
function showRoute(destination) {
  directionsService.route(
    {
      origin: userLocation,
      destination: destination,
      travelMode: "DRIVING",
    },
    (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);
      }
    },
  );
}

// 📦 Load user-added places (localStorage)
function loadSavedPlaces() {
  const places = JSON.parse(localStorage.getItem("places")) || [];

  places.forEach((place) => {
    if (!place.lat || !place.lng) return;

    const position = { lat: place.lat, lng: place.lng };

    const marker = new google.maps.Marker({
      position,
      map,
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    });

    markers.push(marker);
  });
}

// 🧹 Clear markers
function clearMarkers() {
  markers.forEach((m) => m.setMap(null));
  markers = [];
}

// 📏 Distance calculation
function getDistance(loc1, loc2) {
  const dx = loc1.lat - loc2.lat();
  const dy = loc1.lng - loc2.lng();
  return Math.sqrt(dx * dx + dy * dy);
}

// 📝 FORM (add.html)
document.addEventListener("DOMContentLoaded", () => {
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

      navigator.geolocation.getCurrentPosition((pos) => {
        const place = {
          name,
          type,
          rating: Number(rating),
          reviews: Number(reviews),
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        let places = JSON.parse(localStorage.getItem("places")) || [];
        places.push(place);

        localStorage.setItem("places", JSON.stringify(places));

        document.getElementById("message").textContent = "Place added!";
        form.reset();
      });
    });
  }
});
