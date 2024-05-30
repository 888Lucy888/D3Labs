d3.json("buildings.json").then((data) => {
    console.log(data);

    var svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", 500)
        .attr("height", 500);

    var x = d3.scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, 400])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.height)])
        .range([0, 400]);

    var colorScale = d3.scaleOrdinal()
        .domain(data.map((d) => d.name))
        .range(d3.schemeSet3);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.name))
        .attr("y", (d) => 500 - y(d.height))
        .attr("width", x.bandwidth())
        .attr("height", (d) => y(d.height))
        .attr("fill", (d) => colorScale(d.name));
}).catch((error) => {
    console.error(error);
});
