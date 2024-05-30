// Set up SVG dimensions
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Create SVG element
const svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define scales
const xScale = d3.scaleLog().domain([142, 150000]).range([0, width]);
const yScale = d3.scaleLinear().domain([0, 90]).range([height, 0]);
const areaScale = d3.scaleLinear().domain([2000, 1400000000]).range([25 * Math.PI, 1500 * Math.PI]);
const colorScale = d3.scaleOrdinal(d3.schemePastel1);

// Add axes
const xAxis = d3.axisBottom(xScale).tickValues([400, 4000, 40000]).tickFormat(d3.format("$,"));
const yAxis = d3.axisLeft(yScale);

svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

// Add axis labels
svg.append("text")
    .attr("class", "x-axis-label")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("Income");

svg.append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .text("Life Expectancy");

// Add legend
const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width - 100) + ",20)");

// Read and process data
d3.json("data/data.json").then(function(data) {
    // Generate a random year between 1800 and 2020
    const randomYear = Math.floor(Math.random() * (2020 - 1800 + 1)) + 1800;

    // Iterate over the data entries to add the "year" attribute
    data.forEach(yearData => {
        yearData.year = parseInt(yearData.year); // Ensure year is parsed as integer
        yearData.countries = yearData.countries.filter(country => country.income !== null && country.life_exp !== null)
                                              .map(country => {
                                                  country.income = +country.income;
                                                  country.life_exp = +country.life_exp;
                                                  country.population = +country.population;
                                                  return country;
                                              });
    });

    // Add the random year data entry
    const randomData = {
        year: randomYear,
        countries: []
        // You can populate this array with random country data if needed
    };
    data.push(randomData);

    // Process the updated data
    const formattedData = data.map(yearData => yearData.countries);

    // Initial update with the processed data
    update(formattedData[0]);
});


// Update function
function update(yearData) {
    // Update scatter plot
    const circles = svg.selectAll("circle")
        .data(yearData, d => d.country);

    circles.enter()
        .append("circle")
        .attr("fill", d => colorScale(d.continent))
        .merge(circles)
        .attr("cx", d => xScale(d.income))
        .attr("cy", d => yScale(d.life_exp))
        .attr("r", d => Math.sqrt(areaScale(d.population) / Math.PI));

    circles.exit().remove();

    // Update year label
    svg.selectAll(".year-label").remove(); // Remove existing labels
    svg.append("text")
        .attr("class", "year-label")
        .attr("x", width - 100)
        .attr("y", height - 20);
}

// Define variables for play/pause functionality
let isPlaying = false;
let interval;

// Event listeners for buttons and slider
document.getElementById("play-pause-button").addEventListener("click", togglePlayPause);
document.getElementById("reset-button").addEventListener("click", resetVisualization);
document.getElementById("year-slider").addEventListener("input", updateYear);
document.getElementById("continent-filter").addEventListener("change", filterByContinent);

// Toggle play/pause functionality
function togglePlayPause() {
    if (isPlaying) {
        clearInterval(interval);
        isPlaying = false;
        document.getElementById("play-pause-button").innerText = "Play";
    } else {
        interval = setInterval(playNextYear, 1000); // Adjust interval as needed
        isPlaying = true;
        document.getElementById("play-pause-button").innerText = "Pause";
    }
}

// Function to play next year
function playNextYear() {
    let currentValue = parseInt(document.getElementById("year-slider").value);
    if (currentValue < 2020) {
        currentValue++;
        document.getElementById("year-slider").value = currentValue;
        updateYear();
    } else {
        togglePlayPause();
    }
}

// Reset visualization to the year 1800
function resetVisualization() {
    document.getElementById("year-slider").value = 1800;
    updateYear();
    if (isPlaying) {
        togglePlayPause();
    }
}

// Update visualization based on slider value
function updateYear() {
    let year = document.getElementById("year-slider").value;
    document.getElementById("slider-label").innerText = "Year: " + year;
    update(formattedData[year - 1800]);
}

// Filter data by continent
function filterByContinent() {
    let selectedContinent = document.getElementById("continent-filter").value;
    let filteredData;

    // Check if the selected continent is "all"
    if (selectedContinent === "all") {
        // If "all" is selected, show all data for the current year
        filteredData = formattedData[document.getElementById("year-slider").value - 1800];
    } else {
        // If a specific continent is selected, filter the data by continent
        filteredData = formattedData[document.getElementById("year-slider").value - 1800].filter(country => country.continent === selectedContinent);
    }

    // Update the visualization with filtered data
    update(filteredData);
}


// Add event listener to the continent filter dropdown
document.getElementById("continent-filter").addEventListener("change", filterByContinent);

// Add tooltip function
function addTooltip(circle) {
    circle.on("mouseover", function(d) {
        // Show tooltip
    })
    .on("mousemove", function(d) {
        // Update tooltip position
    })
    .on("mouseout", function(d) {
        // Hide tooltip
    });
}
