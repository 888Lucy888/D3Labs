var margin = { top: 10, right: 10, bottom: 100, left: 100 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data/revenues.json").then((data) => {
    console.log(data);

    var x = d3.scaleBand()
        .domain(data.map((d) => d.month))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.revenue)])
        .range([height, 0]);

    var colorScale = d3.scaleOrdinal()
        .domain(data.map((d) => d.month))
        .range(d3.schemeYlOrBr[data.length]);

    var rects = g.selectAll(".revenue-bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "revenue-bar")
        .attr("x", (d) => x(d.month))
        .attr("y", (d) => y(d.revenue))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.revenue))
        .attr("fill", (d) => colorScale(d.month));

    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-40)");

    g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + "m"));

    g.append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + 80)
        .attr("text-anchor", "middle")
        .text("Months");

    g.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -(height / 2))
        .attr("y", -60)
        .attr("text-anchor", "middle")
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .text("Revenue (m)");
}).catch((error) => {
    console.error(error);
});