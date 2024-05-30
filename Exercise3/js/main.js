d3.csv("ages.csv").then((data) => {
    console.log(data);

    data.forEach((d) => {
        d.age = +d.age;
    });
    var svg = d3.select("#chart-area").append("svg")
        .attr("width", 400)
        .attr("height", 400);
    var circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => i * 50 + 50)
        .attr("cy", 200)
        .attr("r", (d) => d.age)
        .attr("fill", (d) => d.age > 10 ? "pink" : "purple");

    console.log(circles);
}).catch((error) => {
    console.error(error);
});
