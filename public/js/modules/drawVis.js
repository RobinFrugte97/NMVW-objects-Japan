export function drawVis(chartLocation, data) {    
    d3.json(chartLocation).then(topo => {
        d3.select("body").append("svg")
        drawChart(topo)
        drawRegionCircles(topo, data)
    })
} 

function drawChart(topo) {
    console.log("Drawing map of Japan...")
    let svg = d3.select("svg")
    let chartContainer = svg.append("g")
    chartContainer.selectAll("path")
        .data(topo.features).enter()
        .append("path")
            .attr("class", "feature")
            .attr("d", setElementPosition(topo)[0])
}
let centered

function drawRegionCircles(topo, data) {
    console.log(topo)
    console.log(data)
    
    let projection = setElementPosition(topo)[1]
    data.then(data => {
        console.log(data);
        let scale = d3.scaleLinear().domain([5, 175]).range([0, 1])
        
        console.log("Drawing objects on the map..")
        d3.select("svg").selectAll("circle")
            .data(data).enter() 
            .append("circle")
                .attr("cx", function (d) { return projection([d.long, d.lat])[0] })
                .attr("cy", function (d) { return projection([d.long, d.lat])[1] })
                .attr("r", d => {
                    if (scale(d.totalObjects*2) > 150) {
                        return 50
                    } else if (scale(d.totalObjects*2) < 1) {
                        return 5
                    } else {
                        return scale(d.totalObjects * 2)
                    }
                })
                .on("click", clicked)
    })
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

function clicked(d, topo) {
    console.log(d);
    console.log(topo);
    
    
    let x, y, k;
    let width = 1900
    let height = 800
    let projection = setElementPosition(topo)[1]
    let path = setElementPosition(topo)[0]


    if (d && centered !== d) {
        let centroid = [d.lat, d.long]
        console.log(centroid);
        
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centered = d;
    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
    }

    let svg = d3.select("svg")
    svg.selectAll("circle")
        .classed("active", centered && function (d) { return d === centered; });

    svg.transition()
        .duration(750)
        .attr("transform", "scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");
}