// ==========================================
// Pakistan Data & Statistics Dashboard
// ==========================================

let indicatorData = [];
let populationChart = null;
let educationChart = null;
let employmentChart = null;
let regionalChart = null;


// ==========================================
// LOAD ACTUAL DATA
// ==========================================

async function loadIndicatorData() {
    try {
        const response = await fetch("data/indicators.json");

        if (!response.ok) {
            throw new Error("Unable to load indicators.json");
        }

        const json = await response.json();

        indicatorData = Array.isArray(json.data) ? json.data : [];

        console.log("Actual data loaded:", indicatorData);

        populateFilters();
        updateDashboard();

    } catch (error) {
        console.error("Data loading error:", error);

        const results = document.getElementById("dataResults");

        if (results) {
            results.innerHTML = `
                <div class="empty-state">
                    <h3>Data could not be loaded</h3>
                    <p>Please check whether <strong>data/indicators.json</strong> exists.</p>
                </div>
            `;
        }
    }
}


// ==========================================
// POPULATE FILTERS
// ==========================================

function populateFilters() {

    const provinceFilter = document.getElementById("provinceFilter");
    const districtFilter = document.getElementById("districtFilter");
    const categoryFilter = document.getElementById("categoryFilter");
    const yearFilter = document.getElementById("yearFilter");

    if (!provinceFilter) return;

    const provinces = [
        ...new Set(indicatorData.map(item => item.province).filter(Boolean))
    ];

    const districts = [
        ...new Set(indicatorData.map(item => item.district).filter(Boolean))
    ];

    const categories = [
        ...new Set(indicatorData.map(item => item.category).filter(Boolean))
    ];

    const years = [
        ...new Set(indicatorData.map(item => item.year).filter(Boolean))
    ].sort((a, b) => b - a);


    provinceFilter.innerHTML = `
        <option value="">All Provinces</option>
        ${provinces.map(p => `<option value="${p}">${p}</option>`).join("")}
    `;


    districtFilter.innerHTML = `
        <option value="">All Districts</option>
        ${districts.map(d => `<option value="${d}">${d}</option>`).join("")}
    `;


    categoryFilter.innerHTML = `
        <option value="">All Categories</option>
        ${categories.map(c => `<option value="${c}">${c}</option>`).join("")}
    `;


    yearFilter.innerHTML = `
        <option value="">All Years</option>
        ${years.map(y => `<option value="${y}">${y}</option>`).join("")}
    `;
}


// ==========================================
// FILTER DATA
// ==========================================

function getFilteredData() {

    const province =
        document.getElementById("provinceFilter")?.value || "";

    const district =
        document.getElementById("districtFilter")?.value || "";

    const category =
        document.getElementById("categoryFilter")?.value || "";

    const year =
        document.getElementById("yearFilter")?.value || "";


    return indicatorData.filter(item => {

        const provinceMatch =
            !province || item.province === province;

        const districtMatch =
            !district || item.district === district;

        const categoryMatch =
            !category || item.category === category;

        const yearMatch =
            !year || String(item.year) === String(year);

        return (
            provinceMatch &&
            districtMatch &&
            categoryMatch &&
            yearMatch
        );
    });
}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    const filteredData = getFilteredData();

    renderDataResults(filteredData);
    updateStatistics(filteredData);
    updateCharts(filteredData);

    const summary = document.getElementById("resultsSummary");

    if (summary) {
        summary.textContent =
            `${filteredData.length} record(s) found`;
    }
}


// ==========================================
// RENDER DATA RESULTS
// ==========================================

function renderDataResults(data) {

    const container = document.getElementById("dataResults");

    if (!container) return;

    if (data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>No data found</h3>
                <p>Try changing your filters.</p>
            </div>
        `;

        return;
    }


    container.innerHTML = data.map(item => {

        const formattedValue =
            typeof item.value === "number"
                ? item.value.toLocaleString()
                : item.value ?? "N/A";


        return `
            <div class="data-card">

                <div class="data-card-header">
                    <span class="data-category">
                        ${item.category || "Data"}
                    </span>

                    <span class="data-year">
                        ${item.year || ""}
                    </span>
                </div>

                <h3>${item.indicator || "Indicator"}</h3>

                <p>
                    <strong>Province:</strong>
                    ${item.province || "N/A"}
                </p>

                <p>
                    <strong>District:</strong>
                    ${item.district || "N/A"}
                </p>

                <div class="data-value">
                    ${formattedValue}
                    <small>${item.unit || ""}</small>
                </div>

                <p class="data-source">
                    Source: ${item.source || "Not specified"}
                </p>

            </div>
        `;

    }).join("");
}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics(data) {

    const populationValue =
        document.getElementById("populationValue");

    const educationValue =
        document.getElementById("educationValue");

    const employmentValue =
        document.getElementById("employmentValue");


    const populationData =
        data.filter(item =>
            item.category === "Population"
        );


    const totalPopulation =
        populationData.reduce(
            (sum, item) =>
                sum + (Number(item.value) || 0),
            0
        );


    if (populationValue) {

        if (totalPopulation > 0) {

            populationValue.textContent =
                formatLargeNumber(totalPopulation);

        } else {

            populationValue.textContent = "—";
        }
    }


    if (educationValue) {

        const educationData =
            data.filter(item =>
                item.category === "Education"
            );

        educationValue.textContent =
            educationData.length
                ? educationData.length
                : "—";
    }


    if (employmentValue) {

        const employmentData =
            data.filter(item =>
                item.category === "Employment"
            );

        employmentValue.textContent =
            employmentData.length
                ? employmentData.length
                : "—";
    }
}


// ==========================================
// FORMAT LARGE NUMBERS
// ==========================================

function formatLargeNumber(number) {

    if (number >= 1000000000) {
        return (number / 1000000000).toFixed(2) + "B";
    }

    if (number >= 1000000) {
        return (number / 1000000).toFixed(2) + "M";
    }

    if (number >= 1000) {
        return (number / 1000).toFixed(1) + "K";
    }

    return number.toLocaleString();
}


// ==========================================
// CHARTS
// ==========================================

function updateCharts(data) {

    if (typeof Chart === "undefined") return;


    // --------------------------------------
    // Population Chart
    // --------------------------------------

    const populationCanvas =
        document.getElementById("populationChart");


    if (populationCanvas) {

        const populationData =
            data.filter(item =>
                item.category === "Population"
            );


        const labels =
            populationData.map(item => item.district);


        const values =
            populationData.map(item =>
                Number(item.value) || 0
            );


        if (populationChart) {
            populationChart.destroy();
        }


        populationChart =
            new Chart(populationCanvas, {

                type: "bar",

                data: {
                    labels: labels,

                    datasets: [{
                        label: "Population",
                        data: values
                    }]
                },

                options: {
                    responsive: true,

                    plugins: {
                        legend: {
                            display: true
                        }
                    }
                }
            });
    }


    // --------------------------------------
    // Education Chart
    // --------------------------------------

    const educationCanvas =
        document.getElementById("educationChart");


    if (educationCanvas) {

        if (educationChart) {
            educationChart.destroy();
        }


        educationChart =
            new Chart(educationCanvas, {

                type: "line",

                data: {
                    labels: [],
                    datasets: [{
                        label: "Education Data",
                        data: []
                    }]
                },

                options: {
                    responsive: true
                }
            });
    }


    // --------------------------------------
    // Employment Chart
    // --------------------------------------

    const employmentCanvas =
        document.getElementById("employmentChart");


    if (employmentCanvas) {

        if (employmentChart) {
            employmentChart.destroy();
        }


        employmentChart =
            new Chart(employmentCanvas, {

                type: "doughnut",

                data: {
                    labels: ["Available Data"],
                    datasets: [{
                        data: [1]
                    }]
                },

                options: {
                    responsive: true
                }
            });
    }


    // --------------------------------------
    // Regional Chart
    // --------------------------------------

    const regionalCanvas =
        document.getElementById("regionalChart");


    if (regionalCanvas) {

        if (regionalChart) {
            regionalChart.destroy();
        }


        const provinceTotals = {};

        data.forEach(item => {

            if (item.category !== "Population") return;

            const province = item.province;

            provinceTotals[province] =
                (provinceTotals[province] || 0) +
                (Number(item.value) || 0);
        });


        regionalChart =
            new Chart(regionalCanvas, {

                type: "bar",

                data: {
                    labels: Object.keys(provinceTotals),

                    datasets: [{
                        label: "Population",
                        data: Object.values(provinceTotals)
                    }]
                },

                options: {
                    responsive: true
                }
            });
    }
}


// ==========================================
// SEARCH
// ==========================================

function performSearch() {

    const input =
        document.getElementById("searchInput");

    const results =
        document.getElementById("searchResults");

    if (!input || !results) return;


    const query =
        input.value.trim().toLowerCase();


    if (!query) {

        results.innerHTML = "";

        return;
    }


    const matches =
        indicatorData.filter(item => {

            return (
                String(item.province || "")
                    .toLowerCase()
                    .includes(query) ||

                String(item.district || "")
                    .toLowerCase()
                    .includes(query) ||

                String(item.category || "")
                    .toLowerCase()
                    .includes(query) ||

                String(item.indicator || "")
                    .toLowerCase()
                    .includes(query)
            );
        });


    if (matches.length === 0) {

        results.innerHTML = `
            <div class="search-empty">
                No matching data found.
            </div>
        `;

        return;
    }


    results.innerHTML = matches.map(item => {

        return `
            <div class="search-result-card">

                <h3>${item.indicator}</h3>

                <p>
                    ${item.district},
                    ${item.province}
                </p>

                <strong>
                    ${Number(item.value).toLocaleString()}
                    ${item.unit || ""}
                </strong>

                <small>
                    ${item.year} · ${item.source}
                </small>

            </div>
        `;

    }).join("");
}


// ==========================================
// RESET FILTERS
// ==========================================

function resetFilters() {

    const filters = [
        "provinceFilter",
        "districtFilter",
        "categoryFilter",
        "yearFilter"
    ];


    filters.forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = "";
        }
    });


    updateDashboard();
}


// ==========================================
// PROVINCE MAP INFO
// ==========================================

const provinceInfo = {

    punjab:
        "Punjab is Pakistan's most populous province and contains major urban and agricultural regions.",

    sindh:
        "Sindh is located in southeastern Pakistan and includes Karachi, Pakistan's largest city.",

    kpk:
        "Khyber Pakhtunkhwa is located in northwestern Pakistan and contains diverse mountainous regions.",

    balochistan:
        "Balochistan is Pakistan's largest province by area.",

    gilgit:
        "Gilgit-Baltistan is a mountainous administrative territory in northern Pakistan."
};


function showProvinceInfo(province) {

    const info =
        document.getElementById("province-info");

    if (!info) return;

    info.textContent =
        provinceInfo[province] ||
        "Select a province to view information.";
}


// ==========================================
// LEAFLET MAP
// ==========================================

function initializeMap() {

    const mapElement =
        document.getElementById("pakistanMap");

    if (!mapElement || typeof L === "undefined") {
        return;
    }


    const map =
        L.map("pakistanMap").setView(
            [30.3753, 69.3451],
            5
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '&copy; OpenStreetMap contributors'
        }
    ).addTo(map);


    const locations = [

        {
            name: "Punjab",
            lat: 31.1704,
            lng: 72.7097
        },

        {
            name: "Sindh",
            lat: 25.8943,
            lng: 68.5247
        },

        {
            name: "Khyber Pakhtunkhwa",
            lat: 34.9526,
            lng: 72.3311
        },

        {
            name: "Balochistan",
            lat: 28.4907,
            lng: 65.0958
        },

        {
            name: "Gilgit-Baltistan",
            lat: 35.8026,
            lng: 74.9832
        }
    ];


    locations.forEach(location => {

        L.marker([
            location.lat,
            location.lng
        ])
        .addTo(map)
        .bindPopup(
            `<strong>${location.name}</strong>`
        );
    });
}


// ==========================================
// JOB FORM
// ==========================================

function initializeJobForm() {

    const form =
        document.getElementById("jobForm");

    if (!form) return;


    form.addEventListener("submit", function(event) {

        event.preventDefault();


        const message =
            document.getElementById("formMessage");


        if (message) {

            message.textContent =
                "Thank you! Your information has been submitted successfully.";

            message.style.display = "block";
        }


        form.reset();
    });
}


// ==========================================
// EVENT LISTENERS
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    // Load actual JSON data
    loadIndicatorData();


    // Search
    const searchBtn =
        document.getElementById("searchBtn");

    const searchInput =
        document.getElementById("searchInput");


    if (searchBtn) {
        searchBtn.addEventListener(
            "click",
            performSearch
        );
    }


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            function(event) {

                if (event.key === "Enter") {
                    performSearch();
                }
            }
        );
    }


    // Filters
    [
        "provinceFilter",
        "districtFilter",
        "categoryFilter",
        "yearFilter"
    ].forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {

            element.addEventListener(
                "change",
                updateDashboard
            );
        }
    });


    // Reset
    const resetButton =
        document.getElementById("resetFilters");

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetFilters
        );
    }


    // Province buttons
    document.querySelectorAll(".province")
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    showProvinceInfo(
                        this.id
                    );
                }
            );
        });


    // Topic buttons
    document.querySelectorAll(".topic-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    const page =
                        this.dataset.page;

                    if (page) {
                        window.location.href = page;
                    }
                }
            );
        });


    initializeMap();
    initializeJobForm();

});
