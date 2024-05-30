var margin = { top: 10, right: 10, bottom: 100, left: 100 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X & Y Label
g.append("text")
    .attr("class", "x-axis-label")
    .attr("x", width / 2)
    .attr("y", height + 80)
    .attr("text-anchor", "middle")
    .text("Months");

var yLabel = g.append("text")
    .attr("class", "y-axis-label")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("text-anchor", "middle")
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .text("Revenue");

var xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

var yAxisGroup = g.append("g")
    .attr("class", "y axis");

var flag = true;

d3.json("data/revenues.json").then((data) => {
    data.forEach((d) => {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
    });

    update(data);

    d3.interval(() => {
        update(data);
        flag = !flag;
    }, 1000);

}).catch((error) => {
    console.error(error);
});

function update(data) {
    var value = flag ? "revenue" : "profit";

    var x = d3.scaleBand()
        .domain(data.map((d) => d.month))
        .range([0, width])
        .padding(0.2);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d[value]; })])
        .range([height, 0]);

    var xAxisCall = d3.axisBottom(x);
    var yAxisCall = d3.axisLeft(y).ticks(5).tickFormat(d => d + "m");

    xAxisGroup.call(xAxisCall)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-40)");

    yAxisGroup.call(yAxisCall);

    var rects = g.selectAll("rect")
        .data(data);

    rects.exit().remove();

    rects.enter().append("rect")
        .merge(rects)
        .attr("x", (d) => x(d.month))
        .attr("y", (d) => y(d[value]))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d[value]))
        .attr("fill", "yellow");

    var label = flag ? "Revenue" : "Profit";
    yLabel.text(label);
}
