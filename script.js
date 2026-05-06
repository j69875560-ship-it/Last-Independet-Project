let map;
let service;
let markers = [];
let userLocation;
let directionsService;
let directionsRenderer;

function initMap() {
  navigator.geolocation.getCurrentPosition((position) => {
    userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    map = new google.maps.Map(document.getElementById("map"), {
      center: userLocation,
      zoom: 14,
    });

    service = new google.maps.places.PlacesService(map);

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    new google.maps.Marker({
      position: userLocation,
      map,
      label: "You",
    });
  });
}

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

function clearMarkers() {
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
}

function getDistance(loc1, loc2) {
  const dx = loc1.lat - loc2.lat();
  const dy = loc1.lng - loc2.lng();
  return Math.sqrt(dx * dx + dy * dy);
}

window.onload = initMap;
