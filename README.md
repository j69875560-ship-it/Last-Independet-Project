# 📍 Smart Facility Finder

## 🧭 Project Overview

Smart Facility Finder is a web-based mapping application designed to help users locate and explore nearby facilities such as hospitals, cafes, schools, gyms, and restaurants.

The application uses interactive maps and real-time location data to help users quickly find essential services around them. It solves the problem of difficulty in identifying and navigating to nearby facilities, especially in unfamiliar areas.

Users can search for facilities, view them on a map, get directions, and also add custom locations which are saved in the browser using local storage.

---

## 🎯 Key Features

- 🗺️ Interactive map using Leaflet.js
- 📍 Real-time user location tracking
- 🔍 Search for nearby facilities (cafes, hospitals, schools, gyms, etc.)
- 📡 Uses OpenStreetMap Overpass API for real data
- 📏 Adjustable search radius (1km – 20km)
- 🚗 Route generation from user to selected facility
- ⏱️ Displays estimated travel distance and time
- 📌 Sidebar listing of nearby facilities
- ➕ Add custom facilities using a form
- 💾 Data persistence using localStorage
- 📱 Fully responsive design for mobile and desktop

---

## 🛠️ Technologies Used

- HTML5 (Semantic structure)
- CSS3 (Flexbox, Grid, Responsive design)
- JavaScript (DOM manipulation, event handling)
- Leaflet.js (Interactive mapping)
- Leaflet Routing Machine (Directions and routes)
- OpenStreetMap Overpass API (Facility data)
- Geolocation API (User location)
- localStorage API (Data persistence)

---

## 📂 Project Structure
/project-folder
│
├── index.html # Main map and search interface
├── add.html # Form to add custom facilities
├── about.html # About the project
│
├── style.css # Styling and responsive design
├── script.js # Core JavaScript functionality
│
└── README.md # Project documentation

---

## 🧩 How It Works

1. The user opens the homepage (index.html).
2. The application detects the user’s location.
3. The user searches for a facility (e.g., “hospital”, “cafe”).
4. The system fetches nearby results using the Overpass API.
5. Results are displayed:
   - On the map as markers
   - In the sidebar as a list
6. Clicking a result:
   - Zooms to location
   - Shows route from user
   - Displays distance and estimated time
7. Users can also add custom facilities using a form, which are stored locally.

---

## 💾 Data Persistence

This project uses **localStorage** to store user-added facilities.

- Data is saved when a user submits the form in `add.html`
- Data is retrieved in `index.html`
- Data persists even after page refresh

---

## 📱 Responsive Design

The application is fully responsive:

- Desktop: Map + sidebar layout
- Tablet: Adjusted flexible layout
- Mobile: Stacked layout for easy navigation

CSS Flexbox and media queries are used for responsiveness.

---

## ⚠️ Known Issues

- Overpass API may sometimes be slow or rate-limited
- Routing depends on external services
- Facility data depends on OpenStreetMap contributions
- No backend database (uses localStorage only)

---

## 🚀 Future Improvements

- User authentication system
- Save favorite locations
- Advanced filtering system
- Real-time traffic integration
- Multiple travel modes (walking, driving, cycling)
- Improved AI-based search suggestions

---

## 👨‍💻 Developer

**Name:** Johncarlos Mwenda  
**Institution:** Moringa School Bootcamp  
**Program:** Intro to Software Engineering  

---

## 🎓 Project Purpose

This project was developed as a final independent project to demonstrate skills in:

- Frontend web development
- API integration
- DOM manipulation
- Responsive design
- Data persistence using localStorage
- Building a functional real-world web application

---

## 🙏 Acknowledgements

- Moringa School
- Mentors: Jerlard and Josiah
- OpenStreetMap contributors
- Leaflet.js community

---

## 📌 License

This project is for educational purposes only.
MIT License

Copyright (c) 2026 Johncarlos Mwenda

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.