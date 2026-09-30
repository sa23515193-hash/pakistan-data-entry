/* =========================================================
   PAKISTAN INSIGHTS - MAIN SCRIPT
   ========================================================= */


/* =========================================================
   1. TOPIC BUTTONS
   ========================================================= */

const topicButtons = document.querySelectorAll(".topic-btn");

topicButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const page = button.getAttribute("data-page");

        if (page) {
            window.location.href = page;
        }

    });

});


/* =========================================================
   2. PROVINCE INFORMATION
   ========================================================= */

const provinceInfo = document.getElementById("province-info");
const provinceButtons = document.querySelectorAll(".province");

const provinceData = {

    punjab: {
        name: "Punjab",
        description:
            "Punjab is one of Pakistan's major administrative regions. Explore education, agriculture, population, employment and other indicators through the available topic pages."
    },

    sindh: {
        name: "Sindh",
        description:
            "Sindh is an important region of Pakistan with major urban, agricultural, industrial and economic activity."
    },

    kpk: {
        name: "Khyber Pakhtunkhwa",
        description:
            "Khyber Pakhtunkhwa contains diverse geographic, demographic, economic and social characteristics."
    },

    balochistan: {
        name: "Balochistan",
        description:
            "Balochistan is Pakistan's largest province by area and contains important natural resources and diverse geographic regions."
    },

    gilgit: {
        name: "Gilgit-Baltistan",
        description:
            "Gilgit-Baltistan is a mountainous region known for its distinctive geography, communities and tourism potential."
    }

};


provinceButtons.forEach((province) => {

    province.addEventListener("click", () => {

        const id = province.id;
        const data = provinceData[id];

        if (!data || !provinceInfo) {
            return;
        }

        provinceInfo.innerHTML = `
            <div class="province-info-content">
                <h3>${data.name}</h3>

                <p>
                    ${data.description}
                </p>

                <button
                    type="button"
                    onclick="scrollToDashboard()">
                    Back to Dashboard
                </button>
            </div>
        `;

    });

});


/* =========================================================
   3. BACK TO DASHBOARD
   ========================================================= */

function scrollToDashboard() {

    const dashboard = document.getElementById("dashboard");

    if (dashboard) {

        dashboard.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================================
   4. PAKISTAN LEAFLET MAP
   ========================================================= */

let pakistanMap = null;

const mapElement = document.getElementById("pakistanMap");

if (mapElement && typeof L !== "undefined") {

    pakistanMap = L.map("pakistanMap").setView(
        [30.3753, 69.3451],
        5
    );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 18,

            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(pakistanMap);


    /* -----------------------------------------
       Major regional locations
       ----------------------------------------- */

    const locations = [

        {
            name: "Punjab",
            coordinates: [31.1471, 72.7097]
        },

        {
            name: "Sindh",
            coordinates: [25.8943, 68.5247]
        },

        {
            name: "Khyber Pakhtunkhwa",
            coordinates: [34.9526, 72.3311]
        },

        {
            name: "Balochistan",
            coordinates: [28.4907, 65.0958]
        },

        {
            name: "Gilgit-Baltistan",
            coordinates: [35.9208, 74.3086]
        }

    ];


    locations.forEach((location) => {

        const marker = L.marker(
            location.coordinates
        ).addTo(pakistanMap);


        marker.bindPopup(`
            <strong>${location.name}</strong>
            <br>
            Pakistan Insights
        `);


        marker.on("click", () => {

            if (provinceInfo) {

                provinceInfo.innerHTML = `
                    <div class="province-info-content">

                        <h3>
                            ${location.name}
                        </h3>

                        <p>
                            You selected
                            ${location.name}.
                            Use the topic pages and
                            dashboard filters to explore
                            available information.
                        </p>

                    </div>
                `;

            }

        });

    });

}


/* =========================================================
   5. SEARCH SYSTEM
   ========================================================= */

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResults = document.getElementById("searchResults");


const searchableTopics = [

    {
        title: "Exports",
        category: "Economy",
        page: "topic1.html",
        keywords:
            "exports trade international trade products economy"
    },

    {
        title: "Education",
        category: "Education",
        page: "topic2.html",
        keywords:
            "education schools universities literacy students"
    },

    {
        title: "Employment",
        category: "Employment",
        page: "topic3.html",
        keywords:
            "employment jobs labour workforce unemployment"
    },

    {
        title: "Online Work",
        category: "Technology",
        page: "topic4.html",
        keywords:
            "online work freelancing remote work digital jobs"
    },

    {
        title: "Population",
        category: "Population",
        page: "topic5.html",
        keywords:
            "population census people demographic"
    },

    {
        title: "Healthcare",
        category: "Healthcare",
        page: "topic6.html",
        keywords:
            "health hospitals healthcare diseases medical"
    },

    {
        title: "Industries",
        category: "Industry",
        page: "topic7.html",
        keywords:
            "industries factories manufacturing business"
    },

    {
        title: "Agriculture",
        category: "Agriculture",
        page: "topic8.html",
        keywords:
            "agriculture crops farming livestock food"
    },

    {
        title: "Technology",
        category: "Technology",
        page: "topic9.html",
        keywords:
            "technology software IT digital innovation"
    },

    {
        title: "Infrastructure",
        category: "Infrastructure",
        page: "topic10.html",
        keywords:
            "infrastructure roads transport construction development"
    },

    {
        title: "Youth",
        category: "Demographics",
        page: "topic11.html",
        keywords:
            "youth young people students population"
    },

    {
        title: "Economy",
        category: "Economy",
        page: "topic12.html",
        keywords:
            "economy GDP finance trade business economic"
    },

    {
        title: "Defense & Security",
        category: "Security",
        page: "topic13.html",
        keywords:
            "defense security military safety"
    },

    {
        title: "Energy & Power",
        category: "Energy",
        page: "topic14.html",
        keywords:
            "energy electricity power gas solar renewable"
    },

    {
        title: "Demographics",
        category: "Demographics",
        page: "topic15.html",
        keywords:
            "demographics age gender population regions"
    }

];


function performSearch() {

    if (!searchInput || !searchResults) {
        return;
    }


    const query =
        searchInput.value.trim().toLowerCase();


    if (!query) {

        searchResults.innerHTML = "";

        return;
    }


    const results =
        searchableTopics.filter((item) => {

            const searchableText =
                `${item.title} ${item.category} ${item.keywords}`
                    .toLowerCase();

            return searchableText.includes(query);

        });


    if (results.length === 0) {

        searchResults.innerHTML = `
            <div class="search-empty">
                <h3>No results found</h3>

                <p>
                    Try searching for population,
                    education, employment, agriculture,
                    technology or another topic.
                </p>
            </div>
        `;

        return;
    }


    searchResults.innerHTML = `

        <div class="search-result-list">

            ${results.map((item) => `

                <div class="search-result-card">

                    <span>
                        ${item.category}
                    </span>

                    <h3>
                        ${item.title}
                    </h3>

                    <a href="${item.page}">
                        Explore Topic →
                    </a>

                </div>

            `).join("")}

        </div>

    `;

}


if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        performSearch
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        performSearch
    );


    searchInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                performSearch();

            }

        }
    );

}


/* =========================================================
   6. FILTER SYSTEM
   ========================================================= */

const provinceFilter =
    document.getElementById("provinceFilter");

const districtFilter =
    document.getElementById("districtFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const yearFilter =
    document.getElementById("yearFilter");

const resetFilters =
    document.getElementById("resetFilters");

const resultsSummary =
    document.getElementById("resultsSummary");


function updateFilters() {

    const province =
        provinceFilter
            ? provinceFilter.value
            : "all";

    const category =
        categoryFilter
            ? categoryFilter.value
            : "all";

    const year =
        yearFilter
            ? yearFilter.value
            : "all";


    if (resultsSummary) {

        let message =
            "Showing available data";

        if (province !== "all") {
            message += ` for ${province}`;
        }

        if (category !== "all") {
            message += ` • ${category}`;
        }

        if (year !== "all") {
            message += ` • ${year}`;
        }

        message += ".";

        resultsSummary.textContent = message;

    }


    updateCharts(
        province,
        category,
        year
    );

}


[
    provinceFilter,
    districtFilter,
    categoryFilter,
    yearFilter
].forEach((filter) => {

    if (filter) {

        filter.addEventListener(
            "change",
            updateFilters
        );

    }

});


if (resetFilters) {

    resetFilters.addEventListener(
        "click",
        () => {

            if (provinceFilter) {
                provinceFilter.value = "all";
            }

            if (districtFilter) {
                districtFilter.value = "all";
            }

            if (categoryFilter) {
                categoryFilter.value = "all";
            }

            if (yearFilter) {
                yearFilter.value = "all";
            }

            updateFilters();

        }
    );

}


/* =========================================================
   7. CHART.JS
   ========================================================= */

let populationChart = null;
let educationChart = null;
let employmentChart = null;
let regionalChart = null;


function destroyChart(chart) {

    if (chart) {
        chart.destroy();
    }

}


function updateCharts(
    selectedProvince = "all",
    selectedCategory = "all",
    selectedYear = "all"
) {

    if (typeof Chart === "undefined") {
        return;
    }


    /* -----------------------------------------
       Population Chart
       ----------------------------------------- */

    const populationCanvas =
        document.getElementById(
            "populationChart"
        );


    if (populationCanvas) {

        destroyChart(populationChart);


        populationChart = new Chart(
            populationCanvas,
            {
                type: "bar",

                data: {

                    labels: [
                        "Punjab",
                        "Sindh",
                        "Khyber Pakhtunkhwa",
                        "Balochistan",
                        "Gilgit-Baltistan"
                    ],

                    datasets: [
                        {
                            label:
                                "Population dataset",

                            data: [
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        }
                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display: true
                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        if (
                                            context.raw === null
                                        ) {

                                            return "Data will be connected";

                                        }

                                        return context.raw;

                                    }

                            }

                        }

                    }

                }

            }
        );

    }


    /* -----------------------------------------
       Education Chart
       ----------------------------------------- */

    const educationCanvas =
        document.getElementById(
            "educationChart"
        );


    if (educationCanvas) {

        destroyChart(educationChart);


        educationChart = new Chart(
            educationCanvas,
            {
                type: "line",

                data: {

                    labels: [
                        "Punjab",
                        "Sindh",
                        "KPK",
                        "Balochistan",
                        "GB"
                    ],

                    datasets: [

                        {
                            label:
                                "Education indicators",

                            data: [
                                null,
                                null,
                                null,
                                null,
                                null
                            ],

                            tension: 0.3

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false

                }

            }
        );

    }


    /* -----------------------------------------
       Employment Chart
       ----------------------------------------- */

    const employmentCanvas =
        document.getElementById(
            "employmentChart"
        );


    if (employmentCanvas) {

        destroyChart(employmentChart);


        employmentChart = new Chart(
            employmentCanvas,
            {
                type: "doughnut",

                data: {

                    labels: [
                        "Employment",
                        "Unemployment",
                        "Data Pending"
                    ],

                    datasets: [

                        {
                            data: [
                                null,
                                null,
                                1
                            ]
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false

                }

            }
        );

    }


    /* -----------------------------------------
       Regional Comparison Chart
       ----------------------------------------- */

    const regionalCanvas =
        document.getElementById(
            "regionalChart"
        );


    if (regionalCanvas) {

        destroyChart(regionalChart);


        regionalChart = new Chart(
            regionalCanvas,
            {
                type: "bar",

                data: {

                    labels: [
                        "Punjab",
                        "Sindh",
                        "KPK",
                        "Balochistan",
                        "GB"
                    ],

                    datasets: [

                        {
                            label:
                                "Regional dataset",

                            data: [
                                null,
                                null,
                                null,
                                null,
                                null
                            ]
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false

                }

            }
        );

    }

}


/* Initialize charts */

updateCharts();


/* =========================================================
   8. JOB FORM
   ========================================================= */

const jobForm =
    document.getElementById("jobForm");


if (jobForm) {

    jobForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "name"
                )?.value.trim();


            const email =
                document.getElementById(
                    "email"
                )?.value.trim();


            const province =
                document.getElementById(
                    "province"
                )?.value;


            const city =
                document.getElementById(
                    "city"
                )?.value.trim();


            const formMessage =
                document.getElementById(
                    "formMessage"
                );


            if (
                !name ||
                !email ||
                !province ||
                !city
            ) {

                if (formMessage) {

                    formMessage.textContent =
                        "Please complete all fields.";

                }

                return;

            }


            if (formMessage) {

                formMessage.textContent =
                    `Thank you ${name}! Your application for ${city}, ${province} has been submitted successfully.`;

            }


            jobForm.reset();

        }
    );

}


/* =========================================================
   9. PAGE READY MESSAGE
   ========================================================= */

console.log(
    "🇵🇰 Pakistan Insights dashboard loaded successfully."
);
