d3.json("buildings.json").then((data) => {
    console.log(data);

    var svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", 800)
        .attr("height", 400);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 80)
        .attr("y", (d) => 400 - parseFloat(d.height))
        .attr("width", 60)
        .attr("height", (d) => parseFloat(d.height))
        .attr("fill", "pink");
}).catch((error) => {
    console.error(error);
});
