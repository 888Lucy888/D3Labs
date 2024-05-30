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
    const formattedData = data.map(year => {
        return year["countries"]
            .filter(country => country.income !== null && country.life_exp !== null)
            .map(country => {
                country.income = +country.income;
                country.life_exp = +country.life_exp;
                country.population = +country.population;
                return country;
            });
    });

    // Initial update
    update(formattedData[0]);

    // Interval function
    let index = 0;
    setInterval(() => {
        index = (index + 1) % formattedData.length;
        update(formattedData[index]);
    }, 1000);
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
        .attr("y", height - 20)
        .text("Year: " + yearData[0].year);
}
