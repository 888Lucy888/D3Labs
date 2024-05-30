var margin = { top: 10, right: 10, bottom: 100, left: 100 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("buildings.json").then((data) => {
    console.log(data);

    var x = d3.scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.height)])
        .range([height, 0]);

    var colorScale = d3.scaleOrdinal()
        .domain(data.map((d) => d.name))
        .range(d3.schemeSet3);

    var rects = g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.name))
        .attr("y", (d) => y(d.height))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.height))
        .attr("fill", (d) => colorScale(d.name));

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
        .attr("y", height + 140)
        .attr("text-anchor", "middle")
        .text("The world's tallest buildings");

    g.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -(height / 2))
        .attr("y", -60)
        .attr("text-anchor", "middle")
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .text("Height (m)");
}).catch((error) => {
    console.error(error);
});
