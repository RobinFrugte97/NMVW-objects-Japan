let legend = [
    { size: "s", r: 7, text: "1-500 Objecten", x: 55, y: 250, textX: "70" },
    { size: "m", r: 15, text: "500-1499 Objecten", x: 55, y: 215, textX: "80" },
    { size: "l", r: 30, text: "1500-2999 Objecten", x: 55, y: 165, textX: "95" },
    { size: "xl", r: 50, text: "3000+ Objecten", x: 55, y: 75, textX: "115" },
]
export function drawVis(chartLocation, data) {    
    d3.json(chartLocation).then(topo => {
        d3.select("body").append("svg").attr("id", "chart")
        d3.select("svg").append("g").attr("id", "mainG")
        drawChart(topo)
        setupRegionCircles(topo, data)
        createResetButton(topo, data)
        renderLegend(legend)
    })
}

function renderLegend(legend) {
    d3.select("body").append("svg").attr("id", "legend")
    let legendSvg = d3.select("#legend").selectAll("circle")
        .data(legend)

    legendSvg
        .enter()
        .append("circle")
        .attr("r", d => { return d.r })
        .attr("cx", d => { return d.x })
        .attr("cy", d => { return d.y })
        
    let text = d3.select("#legend").selectAll("text")
        .data(legend)

    text
        .enter()
        .append("text")
        .attr("x", d => { return d.textX })
        .attr("y", d => { return d.y+5 })
        .text(d => { return d.text })

}

function createResetButton(topo, data) {
    console.log(data)
    let projection = setElementPosition(topo)[1]
    data.then(data => {
        let button = d3.select("body").append("button")
        console.log(button)
        button
            .text("Reset")
            .on("click", function () {
                resetAll(data, projection)
            })
    })
}

function resetAll(data, projection) {
    drawRegionCircles(data, projection)
    let regionLabel = d3.select("h2")
    regionLabel
        .text("Selecteer een regio")
}

function regionLabel(d) {
    let regionLabel = d3.select("h2")
    regionLabel
        .text("Objecten in " + d.province)
}

let zoom = d3.zoom()
    .scaleExtent([1 / 2, 3])
    .on("zoom", zoomed)

function zoomed() {
    let chartContainer = d3.select("#mainG")    
    chartContainer.attr('transform', 'translate(' +d3.event.transform.x+', '+d3.event.transform.y+') scale('+d3.event.transform.k+')');
    adjustCirclesToZoomLevel(d3.event.transform.k);
};

function narrower(d, projection) {
    console.log(d)
    let cityData = d.cities
    console.log(cityData);
    drawRegionCircles(cityData, projection)
    regionLabel(d)
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

function setupRegionCircles(topo, data) {
    console.log(topo)
    console.log(data) 
    let projection = setElementPosition(topo)[1]

    
    data.then(data => drawRegionCircles(data, projection))
}

function drawRegionCircles(data, projection) {
    let scale = d3.scaleLinear().domain([5, 175]).range([0, 1])
    console.log("Drawing objects on the map..")
    let circles = d3.select("g").selectAll("circle")
            .data(data)
        // update any changes before continuing
        circles
            .transition()
            .attr("cx", function (d) { return projection([d.long, d.lat])[0] })
            .attr("cy", function (d) { return projection([d.long, d.lat])[1] })
            .attr("r", 0)
            .transition()
            .attr("r", d => {
                if (scale(d.objects * 2) > 150) {
                    return 50
                } else if (scale(d.objects * 2) < 1) {
                    return 5
                } else {
                    return scale(d.objects * 2)
                }
            })
        // enter the circles    
        circles.enter()
            .append("circle")
            .attr("cx", function (d) { return projection([d.long, d.lat])[0] })
            .attr("cy", function (d) { return projection([d.long, d.lat])[1] })
            .attr("r", d => {
                if (scale(d.objects * 2) > 150) {
                    return 50
                } else if (scale(d.objects * 2) < 1) {
                    return 5
                } else {
                    return scale(d.objects * 2)
                }
            })
            .on("click", function(d){
                narrower(d, projection)
            })
        // remove any surplus of circles    
        circles
            .exit().remove()

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

// adjusts the circles to the zoomlevel
function adjustCirclesToZoomLevel(zoomLevel) {
    let scale = d3.scaleLinear().domain([5, 175]).range([0, 1])

    const minRadius = (zoomLevel / 3 < 2) ? 3 - (zoomLevel / 3) : 1;
    const maxRadius = (zoomLevel * 7 < 37.5) ? 100 - (zoomLevel * 7) : 2.5;
    const factor = (maxRadius - minRadius) / (1000 - 1);
    let g = d3.select("g")
    g.selectAll('circle')
        .attr('r', d => {
            if (scale(d.objects * 2 /zoomLevel) > 200) {
                return 50
            } else if (scale(d.objects * 2 /zoomLevel) < 1) {
                return 5
            } else {
                return scale(d.objects * 2 / zoomLevel)
            }
        })
        .style("stroke-width", .3 / zoomLevel+"em")
}