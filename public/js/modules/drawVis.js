export function drawVis(chartLocation, data) {    
    d3.json(chartLocation).then(topo => {
        d3.select("body").append("svg")
        d3.select("svg").append("g").attr("id", "mainG")
        drawChart(topo)
        drawRegionCircles(topo, data)
    })
}

let zoom = d3.zoom()
    .scaleExtent([1 / 2, 100])
    .on("zoom", zoomed)


function zoomed() {
    let chartContainer = d3.select("#mainG")    
    chartContainer.attr('transform', 'translate(' +d3.event.transform.x+', '+d3.event.transform.y+') scale('+d3.event.transform.k+')');
};

function narrower(data) {
    let cityData = data.cities
    console.log(cityData);
    actuallyDrawThem(cityData)
}

function drawChart(topo) {
    console.log("Drawing map of Japan...")
    let svg = d3.select("#mainG")
    let chartContainer = svg.append("g")
    chartContainer.selectAll("path")
        .data(topo.features).enter()
        .append("path")
            .attr("class", "feature")
            .attr("d", setElementPosition(topo)[0])
    svg.call(zoom)
}

function drawRegionCircles(topo, data) {
    console.log(topo)
    console.log(data) 
    let projection = setElementPosition(topo)[1]

    
    data.then(data => actuallyDrawThem(data, projection))
}

function actuallyDrawThem(data, projection) {
    console.log(data);
    let scale = d3.scaleLinear().domain([5, 175]).range([0, 1])

    console.log("Drawing objects on the map..")
    let circles =  d3.select("#mainG").selectAll("circle")
        .data(data)
        circles.attr("cx", function (d) { return projection([d.long, d.lat])[0] })
            .attr("cy", function (d) { return projection([d.long, d.lat])[1] })
            .attr("r", d => {
                if (scale(d.totalObjects * 2) > 150) {
                    return 50
                } else if (scale(d.totalObjects * 2) < 1) {
                    return 5
                } else {
                    return scale(d.totalObjects * 2)
                }
            })
            .on("click", narrower)
        circles.enter()
            .append("circle")
            .attr("cx", function (d) { return projection([d.long, d.lat])[0] })
            .attr("cy", function (d) { return projection([d.long, d.lat])[1] })
            .attr("r", d => {
                if (scale(d.totalObjects * 2) > 150) {
                    return 50
                } else if (scale(d.totalObjects * 2) < 1) {
                    return 5
                } else {
                    return scale(d.totalObjects * 2)
                }
            })
            .on("click", narrower)
        circles.exit().remove()

}

function setElementPosition(topo) {
    const width = 1900
    const height = 800

    // Code inspiration and formulas from https://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
    // Rewrote to latest d3 version and ES6
    let chartSize = 100
    let projection = d3.geoMercator().scale(chartSize).center(d3.geoCentroid(topo))
        .translate([width / 2, height / 2]);
    let path = d3.geoPath().projection(projection);

    // using the path determine the bounds of the current map and use 
    // these to determine better values for the scale and translation
    let bounds = path.bounds(topo);
    let hscale = chartSize * width / (bounds[1][0] - bounds[0][0]);
    let vscale = chartSize * height / (bounds[1][1] - bounds[0][1]);
    let scale = (hscale < vscale) ? hscale : vscale;

    // new projection
    projection = d3.geoMercator().center(d3.geoCentroid(topo))
        .scale(scale).translate([width - (bounds[0][0] + bounds[1][0]) / 2,
        height - (bounds[0][1] + bounds[1][1]) / 2]);
    path = path.projection(projection);
    return [path, projection]
}