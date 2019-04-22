/*
* Political Inclinations of Online News Media Visualized
* CS 4440 Spring 2019
*
* Team members:
* Thushara Mudireddy
* Ashwin Natarajan
* Noah Roberts
*/

const width = 700;
const height = 700;
const diameter = 250;
const colorRamp = ['#5D2B7D','#A72D89','#1474BB','#8FC33E','#FEEE22','#E41E26'];
const neutralColor = "lightgray";
const selectedColors = ["#003f5c", "#58508d", "#bc5090", "#ff6361", "#ffa600"];
const filterColor = "#58508d";
const histColor = filterColor;
const maxSelected = 5;
const chart2BottomPadding = 50;
const chart2LeftPadding = 100;
const chart2TopPadding = 50;

var selected = "";

window.onload = start;

function start() {
    var chart1 = d3.select("#bubblechart")
                    .append("svg:svg")
                    .attr("width", width)
                    .attr("height", height);

    var chart2 = d3.select("#distribution")
                    .append("svg:svg")
                    .attr("width", width)
                    .attr("height", height);


    var radiusScale = d3.scale.linear()
        .domain([1, 2600])
        .range([1, 45]);

    var colorScale = d3.scale.linear()
        .domain([1, 2600])
        .range([0, colorRamp.length]);
    
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width - chart2LeftPadding], 0.3);
    
    var y = d3.scale.linear()
        .domain([1, 2600])
        .range([height - chart2BottomPadding - chart2TopPadding, 0]);

    var xHist = d3.scale.linear()
        .domain([0, 100])
        .range([0, width - chart2LeftPadding - 10]);

    var yHist = d3.scale.linear()
        .range([height / 2 - chart2BottomPadding - 5, 0])
        .domain([0, 215]);

    var searchButton = d3.select("#buttonWrapper")
        .append('button')
        .text('Search')
        .attr('class', 'button card')
        .on('click', function() {

            console.log(document.getElementById("query").value);



            // getAggregate
            data.push({
                keyword: "test",
                articleCount: 15
            });
            
            update();
            


            // d3.select("#filter")
            //     .style("visibility", "visible");
            // d3.select("#details")
            //     .style("visibility", "hidden");
            
            // chart1.selectAll("circle").attr("fill", function(d) {
            //     return colorRamp[Math.floor(colorScale(d.value.joy * 2 + d.value.meh))];
            // });
            // filterSelected = new CandyEntry(0,0,0);
            // selected = [];
            // chart3_gender.selectAll("g")
            //     .data([])
            //     .exit().remove();
            // chart3_age.selectAll(".bar")
            //     .data([])
            //     .exit().remove();
            // mode = "filter";

            // chart3_gender.append("text")
            //     .attr("class", "welcomeText")
            //     .text("Please select a candy")
            //     .attr("x", "50%")
            //     .attr("y", "50%")
            //     .style("font-size", "14px")
        });

    // var compareButton = d3.select("#buttonWrapper") 
    //     .append('button')
    //     .text('Compare')
    //     .attr('class', 'button card')
    //     .on('click', function() {
    //         d3.select("#details")
    //             .style("visibility", "visible");
    //         d3.select("#filter")
    //             .style("visibility", "hidden");
    //         chart1.selectAll("circle").attr("fill", function(d) {
    //             return colorRamp[Math.floor(colorScale(d.value.joy * 2 + d.value.meh))];
    //         });
    //         selected = []; // clear array
    //         filterSelected = new CandyEntry(0,0,0);
    //         chart2.selectAll("rect").data([]).exit().remove();
    //         mode = "compare";
    //     });

    // get data

    // getAggregate(keyword)
    data = [{
        keyword: "Trump",
        articleCount: 10
    }]

    // create chart1 

    var radiusScale = d3.scale.linear()
        .domain([1, 30])
        .range([1, 40]);

    var colorScale = d3.scale.linear()
        .domain([1, 30])
        .range([0, colorRamp.length])

    force = d3.layout.force() //set up force
        .size([width, height])
        .nodes(data)
        .charge(-100)
        .on("tick", tick)

    function tick() {
        chart1.selectAll("circle")
            .attr("cx", function(d) {
                return d.x;
            }) 
            .attr("cy", function(d) {
                return d.y;
            });
        chart1.selectAll("text")
            .attr("x", function(d) {
                return d.x;
            }) 
            .attr("y", function(d) {
                return d.y;
            });
    }

    function update() {

        var nodes = chart1.selectAll(".node")
            .data(data)
            .enter()

        nodes.append("g")
            .attr("class", "node")
            .append("circle")
            .attr("class", "candy")
            .attr("r", function(d) {
                return radiusScale(d.articleCount);
            })
            .attr("fill", "#247ba0")
        
        nodes.append("text")
            .text(function(d) { return d.keyword; });

        force.start()
    }
        
    update()
}
