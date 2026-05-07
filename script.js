let map;
let markers = [];
let userLocation = [-1.286389, 36.817223]; // Nairobi default
let routingControl;

// Initialize map
function initMap() {
  map = L.map("map").setView(userLocation, 13);

  // OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // User location marker
  const userMarker = L.circleMarker(userLocation, {
    radius: 10,
    color: "blue",
  }).addTo(map);

  loadSavedPlaces();

  // Get actual user location
  navigator.geolocation.getCurrentPosition((pos) => {
    userLocation = [pos.coords.latitude, pos.coords.longitude];

    map.setView(userLocation, 14);

    const userIcon = L.divIcon({
      className: "",
      html: `<div class="pulse"></div>`,
      iconSize: [20, 20],
    });

    L.marker(userLocation, {
      icon: userIcon,
    })
      .addTo(map)
      .bindPopup("You are here");
  });
}

// Search places
async function searchPlaces() {
  clearMarkers();

  const keyword = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();

  const radius = document.getElementById("radius").value;

  const lat = userLocation[0];
  const lng = userLocation[1];

  if (!keyword) {
    alert("Please enter a facility to search");
    return;
  }

  // Dynamic Overpass query
  const query = `
    [out:json];

    (
      node
      ["amenity"]
      ["amenity"~"${keyword}",i]
      (around:${radius},${lat},${lng});

      node
      ["shop"]
      ["shop"~"${keyword}",i]
      (around:${radius},${lat},${lng});

      node
      ["tourism"]
      ["tourism"~"${keyword}",i]
      (around:${radius},${lat},${lng});

      node
      ["leisure"]
      ["leisure"~"${keyword}",i]
      (around:${radius},${lat},${lng});
    );

    out;
  `;

  const url = "https://overpass-api.de/api/interpreter";

  try {
    const response = await fetch(url, {
      method: "POST",
      body: query,
    });

    const data = await response.json();

    displayOSMResults(data.elements);
  } catch (error) {
    console.error(error);

    alert("Search failed");
  }
}
function displayOSMResults(places) {
  const results = document.getElementById("results");

  results.innerHTML = "";
  document.getElementById("facilityCount").innerHTML = `(${places.length})`;

  if (places.length === 0) {
    results.innerHTML = "<p>No places found.</p>";
    return;
  }

  places.forEach((place) => {
    const lat = place.lat;
    const lng = place.lon;

    // Marker
    const marker = L.marker([lat, lng])
      .addTo(map)
      .bindPopup(place.tags.name || "Unnamed Place");

    markers.push(marker);

    // Result card
    const div = document.createElement("div");

    div.className = "result-item";

    div.innerHTML = `
      <strong>${place.tags.name || "Unnamed Place"}</strong><br>
      📍 
${
  place.tags.amenity ||
  place.tags.shop ||
  place.tags.tourism ||
  place.tags.leisure ||
  "Facility"
}
    `;

    // Zoom to marker
    div.onclick = () => {
      map.setView([lat, lng], 17);

      marker.openPopup();

      showRoute(lat, lng);
    };

    results.appendChild(div);
  });
}
// Display places
function displayResults(places) {
  clearMarkers();

  const results = document.getElementById("results");

  results.innerHTML = "";

  places.forEach((place) => {
    const marker = L.marker([place.lat, place.lng]).addTo(map).bindPopup(`
        <strong>${place.name}</strong><br>
        ⭐ ${place.rating}<br>
        📝 ${place.reviews}
      `);

    markers.push(marker);

    const div = document.createElement("div");

    div.className = "result-item";

    div.innerHTML = `
      <h3>${place.name}</h3>

      <p>
        📍 ${place.type}
      </p>

      <p>
        ⭐ ${place.rating} | 📝 ${place.reviews}
      </p>

      <p>
        ${place.description || "No description available"}
      </p>

      <small>
        Click to view route
      </small>
    `;

    div.onclick = () => {
      map.setView([place.lat, place.lng], 16);

      marker.openPopup();

      showRoute(place.lat, place.lng);
    };

    results.appendChild(div);
  });
}
function showRoute(lat, lng) {
  if (routingControl) {
    map.removeControl(routingControl);
  }

  routingControl = L.Routing.control({
    waypoints: [L.latLng(userLocation[0], userLocation[1]), L.latLng(lat, lng)],

    routeWhileDragging: true,

    lineOptions: {
      styles: [{ color: "blue", weight: 6 }],
    },

    createMarker: function () {
      return null;
    },
  }).addTo(map);

  // Get route info
  routingControl.on("routesfound", function (e) {
    const route = e.routes[0];

    const distanceKM = (route.summary.totalDistance / 1000).toFixed(2);

    const timeMinutes = Math.round(route.summary.totalTime / 60);

    document.getElementById("routeInfo").innerHTML = `
      🚗 Distance: ${distanceKM} km
      <br>
      ⏱ Estimated Time: ${timeMinutes} mins
    `;
  });
}

// Load saved places
function loadSavedPlaces() {
  const places = JSON.parse(localStorage.getItem("places")) || [];

  displayResults(places);
}

// Clear markers
function clearMarkers() {
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];
}

// Sort places
function sortPlaces() {
  let places = JSON.parse(localStorage.getItem("places")) || [];

  const sortType = document.getElementById("sortBy").value;

  if (sortType === "rating") {
    places.sort((a, b) => b.rating - a.rating);
  } else if (sortType === "reviews") {
    places.sort((a, b) => b.reviews - a.reviews);
  }

  displayResults(places);
}

// Add place form
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("map")) {
    initMap();
  }

  const form = document.getElementById("placeForm");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const type = document.getElementById("type").value;
      const rating = document.getElementById("rating").value;
      const reviews = document.getElementById("reviews").value;
      const description = document.getElementById("description").value;
      if (!name || rating < 1 || rating > 5) {
        document.getElementById("message").textContent =
          "Please enter valid data";
        return;
      }

      navigator.geolocation.getCurrentPosition((pos) => {
        const place = {
          name,
          type,
          rating: Number(rating),
          reviews: Number(reviews),
          description,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        let places = JSON.parse(localStorage.getItem("places")) || [];

        places.push(place);

        localStorage.setItem("places", JSON.stringify(places));

        document.getElementById("message").textContent =
          "Place added successfully!";

        form.reset();
      });
    });
  }
});
