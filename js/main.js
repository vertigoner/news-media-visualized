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

var keywordEntry = function(keyword, articleCount) {
    this.keyword = keyword
    this.articleCount = articleCount
}

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
        });

    // create chart1 

    var radiusScale = d3.scale.linear()
        .domain([1, 100])
        .range([10, 40]);

    var colorScale = d3.scale.linear()
        .domain([1, 30])
        .range([0, colorRamp.length])

    getJSON('http://localhost:5000/getTrending',
    function(err, data) {
        if (err !== null) {
            alert('Something went wrong: ' + err);
            return;
        }

        dataArray = []
        for (let key of Object.keys(data)) {
            dataArray.push(new keywordEntry(key, data[key]))
        }

        console.log(dataArray)

        var nodes = chart1.selectAll(".node")
            .data(dataArray)
            .enter()
    
        nodes.append("g")
            .attr("class", "node")
            .append("circle")
            .attr("r", function(d) {
                console.log(d)
                return radiusScale(d.articleCount);
            })
            .attr("fill", "#247ba0")
        
        nodes.append("text")
            .text(function(d) { return d.keyword; });

        force = d3.layout.force() //set up force
            .size([width, height])
            .nodes(dataArray)
            .charge(-200)
            .on("tick", function() {
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
            })

        force.start()
    });
}

function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};