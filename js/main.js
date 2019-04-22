/*
* Political Inclinations of Online News Media Visualized
* CS 4440 Spring 2019
*
* Team members:
* Thushara Mudireddy
* Ashwin Natarajan
* Noah Roberts
*/

const width = 600;
const height = 500;
const bubbleColor = "#428bca"
const neutralColor = "lightgray";

var selected = "";

var keywordEntry = function(keyword, articleCount) {
    this.keyword = keyword
    this.articleCount = articleCount
}

window.onload = start;

function start() {

    var trendBubbleChart = d3.select("#trend-bubbles")
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height);

    var sourceBubbleChart = d3.select("#source-bubbles")
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height);

    var radiusScale = d3.scale.linear()
        .domain([1, 100])
        .range([10, 45]);

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

    // create trendBubbleChart 

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

        var nodes = trendBubbleChart.selectAll(".node")
            .data(dataArray)
            .enter()
    
        nodes.append("g")
            .attr("class", "node")
            .append("circle")
            .attr("r", function(d) {
                console.log(d)
                return radiusScale(d.articleCount);
            })
            .attr("fill", bubbleColor)
        
        nodes.append("text")
            .text(function(d) { return d.keyword; });

        force = d3.layout.force() //set up force
            .size([width, height])
            .nodes(dataArray)
            .charge(-200)
            .on("tick", function() {
                trendBubbleChart.selectAll("circle")
                    .attr("cx", function(d) {
                        return d.x;
                    }) 
                    .attr("cy", function(d) {
                        return d.y;
                    });
                trendBubbleChart.selectAll("text")
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