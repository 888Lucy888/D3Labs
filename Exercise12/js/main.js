// Define the dimensions of the SVG container and the donut chart
var margin = { top: 20, right: 300, bottom: 30, left: 50 },
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    radius = Math.min(width, height) / 2;

// Create an SVG element
var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
var g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Define a color scale
var color = d3.scaleOrdinal(d3.schemeCategory10);

// Define the arc generator for the donut chart
var arc = d3.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4);

// Define the pie layout generator
var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.count; });

// Load the data from the TSV file
d3.tsv("data/donut2.tsv").then((data) => {
    // Transform data to its proper format
    data.forEach(function(d) {
        d.count = +d.count;
        d.fruit = d.fruit.toLowerCase();
    });

    // Group the data by fruits
    var regionsByFruit = d3.nest()
        .key(function(d) { return d.fruit; })
        .entries(data);

    // Dynamically add radio buttons to select the fruit
    var label = d3.select("form").selectAll("label")
        .data(regionsByFruit)
        .enter().append("label");

    label.append("input")
        .attr("type", "radio")
        .attr("name", "fruit")
        .attr("value", function(d) { return d.key; })
        .on("change", update)
        .filter(function(d, i) { return !i; })
        .each(update)
        .property("checked", true);

    label.append("span")
        .attr("fill", "red")
        .text(function(d) { return d.key; });

}).catch((error) => {
    console.log(error);
});

// Function to update the chart based on selected fruit
function update(region) {
    var path = g.selectAll("path");

    var data0 = path.data(),
        data1 = pie(region.values);

    // JOIN elements with new data.
    path = path.data(data1, key);

    // EXIT old elements from the screen.
    path.exit()
        .datum(function(d, i) {
            return findNeighborArc(i, data1, data0, key) || d;
        })
        .transition()
        .duration(750)
        .attrTween("d", arcTween)
        .remove();
    
    // UPDATE elements still on the screen.
    path.transition()
        .duration(750)
        .attrTween("d", arcTween);

    // ENTER new elements in the array.
    path.enter()
        .append("path")
        .each(function(d, i) {
            this._current = findNeighborArc(i, data0, data1, key) || d;
        })
        .attr("fill", function(d) {  
            return color(d.data.region);
        })
        .transition()
        .duration(750)
        .attrTween("d", arcTween);
}

// Function to define the key for data binding
function key(d) {
    return d.data.region;
}

// Function to find the neighboring arc
function findNeighborArc(i, data0, data1, key) {
    var d;
    return (d = findPreceding(i, data0, data1, key)) ? { startAngle: d.endAngle, endAngle: d.endAngle }
        : (d = findFollowing(i, data0, data1, key)) ? { startAngle: d.startAngle, endAngle: d.startAngle }
        : null;
}

// Function to find the preceding element in data0
function findPreceding(i, data0, data1, key) {
    var m = data0.length;
    while (--i >= 0) {
        var k = key(data1[i]);
        for (var j = 0; j < m; ++j) {
            if (key(data0[j]) === k) return data0[j];
        }
    }
}

// Function to find the following element in data0
function findFollowing(i, data0, data1, key) {
    var n = data1.length, m = data0.length;
    while (++i < n) {
        var k = key(data1[i]);
        for (var j = 0; j < m; ++j) {
            if (key(data0[j]) === k) return data0[j];
        }
    }
}

// Function to define the arc transition
function arcTween(d) {
    var i = d3.interpolate(this._current, d);
    this._current = i(1);
    return function(t) { return arc(i(t)); };
}
