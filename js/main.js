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
const filterColor = "#d30b0d"
const neutralColor = "lightgray";

var trends = []

var selectedBubble = null;

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

    var radiusScale1 = d3.scale.linear()
        .domain([1, 100])
        .range([10, 45]);

    var radiusScale2 = d3.scale.linear()
        .domain([1, 20])
        .range([20, 75]);

    var searchButton = d3.select("#buttonWrapper")
        .append('button')
        .text('Search')
        .attr('class', 'button card')
        .on('click', function() {
            let input = document.getElementById("query").value;
            getJSON(`http://localhost:5000/getSourceDistribution/${input}`, function(err, data) {
                if (err !== null) {
                    alert('Something went wrong: ' + err);
                    return;
                }

                data = cleanSourceData(data)

                let entry = new keywordEntry(
                    input,
                    Object.values(data).reduce(function(acc, a) {
                        return acc + a;
                    })
                )
                if (!trends.some(function(el) { 
                    return el.keyword === entry.keyword 
                })) {
                    trends.push(entry)
                    restartTrends();
                }
            });
        });

    // create trendBubbleChart 

    getJSON('http://localhost:5000/getTrending',
    function(err, data) {
        if (err !== null) {
            alert('Something went wrong: ' + err);
            return;
        }

        trends = Object.keys(data).map(function(key) {
            return new keywordEntry(key, data[key])
        })

        restartTrends();
    });

    trendBubbleChart.on("click", function() {
        sourceBubbleChart.selectAll("g")
            .data([])
            .exit().remove();

        if (this === d3.event.target) {
            trendBubbleChart.selectAll("circle").attr("fill", bubbleColor);
            selectedBubble = null;
            return;
        }

        selectedBubble = d3.select(d3.event.target.parentNode);
        var bubbleData = selectedBubble.data()[0];

        trendBubbleChart.selectAll("circle").attr("fill", neutralColor);
        selectedBubble.select("circle").attr("fill", filterColor);

        getJSON(`http://localhost:5000/getSourceDistribution/${bubbleData.keyword}`, function(err, data) {
            if (err !== null) {
                alert('Something went wrong: ' + err);
                return;
            }

            data = cleanSourceData(data)
            data = Object.keys(data).map(function(key) {
                return {
                    source: key,
                    articleCount: data[key]
                };
            });
            
            var nodes = sourceBubbleChart.selectAll(".node")
                .data(data)
                .enter()
    
            nodes.append("g")
                .attr("class", "node")
                .append("circle")
                .attr("r", function(d) {
                    return radiusScale2(d.articleCount);
                })
                .attr("fill", bubbleColor)
                
            sourceBubbleChart.selectAll("g")
                .append("text")
                .attr("class", "unselectable")
                .text(function(d) { return d.source; });

            force = d3.layout.force() //set up force
                .size([width, height])
                .nodes(data)
                .charge(-200)
                .on("tick", function() {
                    sourceBubbleChart.selectAll("circle")
                        .attr("cx", function(d) {
                            return d.x;
                        }) 
                        .attr("cy", function(d) {
                            return d.y;
                        });
                    sourceBubbleChart.selectAll("text")
                        .attr("x", function(d) {
                            return d.x;
                        }) 
                        .attr("y", function(d) {
                            return d.y + 3;
                        });
                })

            force.start()
        })
    })

    function restartTrends() {
        var nodes = trendBubbleChart.selectAll(".node")
            .data(trends)
            .enter()
    
        nodes.append("g")
            .attr("class", "node")
            .append("circle")
            .attr("r", function(d) {
                return radiusScale1(d.articleCount);
            })
            .attr("fill", function() {
                console.log(selectedBubble)
                if (selectedBubble == null) {
                    return bubbleColor;
                } else {
                    return neutralColor;
                }
            })
            
        trendBubbleChart.selectAll("g")
            .append("text")
            .attr("class", "unselectable")
            .text(function(d) { return d.keyword; });
    
        force = d3.layout.force() //set up force
            .size([width, height])
            .nodes(trends)
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
                        return d.y + 3;
                    });
            })
    
        force.start()
    }
}

function cleanSourceData(data) {
    return JSON.parse(data.publications.replace(/u'|'/g,'"'))
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