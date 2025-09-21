// Dashboard Buttons: Navigate to Topic Pages
const topicButtons = document.querySelectorAll('.topic-btn');
topicButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const page = btn.getAttribute('data-page');
        window.location.href = page; // Open topic page
    });
});

// Pakistan Map Interaction
const provinceInfo = document.getElementById('province-info');
const provinces = document.querySelectorAll('.province');
provinces.forEach(province => {
    province.addEventListener('click', () => {
        let info = '';
        switch(province.id) {
            case 'punjab':
                info = '<h3>Punjab</h3><p>Population: 110 million<br>Major cities: Lahore, Faisalabad, Rawalpindi</p>';
                break;
            case 'sindh':
                info = '<h3>Sindh</h3><p>Population: 50 million<br>Major cities: Karachi, Hyderabad</p>';
                break;
            case 'kpk':
                info = '<h3>Khyber Pakhtunkhwa</h3><p>Population: 35 million<br>Major cities: Peshawar, Mardan</p>';
                break;
            case 'balochistan':
                info = '<h3>Balochistan</h3><p>Population: 12 million<br>Major cities: Quetta, Gwadar</p>';
                break;
            case 'gilgit':
                info = '<h3>Gilgit-Baltistan</h3><p>Population: 2 million<br>Major cities: Gilgit, Skardu</p>';
                break;
        }
        provinceInfo.innerHTML = info + '<button onclick="scrollToDashboard()">Back</button>';
    });
});

// Make provinces clickable
document.querySelectorAll('.province').forEach(province => {
    province.addEventListener('click', () => {
        const id = province.id;
        switch(id) {
            case 'punjab': window.location.href = 'topic7.html'; break;
            case 'sindh': window.location.href = 'topic8.html'; break;
            case 'kpk': window.location.href = 'topic3.html'; break;
            case 'balochistan': window.location.href = 'topic6.html'; break;
            case 'gilgit': window.location.href = 'topic4.html'; break;
        }
    });
});
 
// Back button scroll
function scrollToDashboard() {
    document.getElementById('dashboard').scrollIntoView({behavior: "smooth"});
}

  // Map initialize karo
  var map = L.map('pakistanMap').setView([30.3753, 69.3451], 5); // Pakistan center

  // Base tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // Provinces example (replace with your GeoJSON shapes)
  var province = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "name": "Punjab" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[[71,32],[73,32],[73,31],[71,31],[71,32]]]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Sindh" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[[68,25],[71,25],[71,24],[68,24],[68,25]]]
        }
      }
      // Baaki provinces add kar do
    ]
  };

  //  Add provinces with style & click
  L.geoJSON(provinces, {
    style: function(feature) {
      return {color: 'blue', fillColor: 'lightblue', weight: 2, fillOpacity: 0.5};
    },
    onEachFeature: function(feature, layer) {
      layer.on('click', function() {
        alert("Province: " + feature.properties.name);
      });
    }
  }).addTo(map);
  // Owner Name
document.getElementById("ownerName").textContent = "Sawaira";

// Toggle provinces open/close
const toggleButtons = document.querySelectorAll(".toggle-province");
toggleButtons.forEach(button => {
  button.addEventListener("click", () => {
    const cityList = button.nextElementSibling;
    cityList.classList.toggle("hidden");
  });
});

// Add City Data Entry Employee dynamically
function addCityUser(provinceIndex, cityName, userName) {
  const provinceList = document.getElementById("provinceList");
  const provinceItem = provinceList.children[provinceIndex];
  const cityManagers = provinceItem.querySelector(".city-managers");

  const li = document.createElement("li");
  li.textContent = `City: ${cityName} - `;
  const span = document.createElement("span");
  span.classList.add("cityUser");
  span.textContent = userName;
  li.appendChild(span);

  cityManagers.appendChild(li);
}

// Example: Add new city user to Punjab
addCityUser(0, "Multan", "User H");

// Job Form Submission
document.getElementById("jobForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const province = document.getElementById("province").value;
  const city = document.getElementById("city").value;

  document.getElementById("formMessage").textContent = 
    `Thank you ${name}! Your application for${city},${province} has been submitted.`;

  this.reset();
});