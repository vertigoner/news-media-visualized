/*
* Political Inclinations of Online News Media Visualized
* CS 4440 Spring 2019
*
* Team members:
* Thushara Mudireddy
* Ashwin Natarajan
* Noah Roberts
*/

const host = "localhost";

var vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const width = vw / 2;
const height = 400;
const numSources = 15;
const neutralColor = "lightgray";
const filterColor = "#4056a1";
const defaultColor = "#428bca";

// political colors:
const darkblue = "#3474aa";
const blue = defaultColor;
const lightblue = "#4ba2ea";
const neutral = "#4056a1";
const lightred = "#ef4345";
const red = "#ea3335";
const darkred = "#d30b0d";

const sourceAffiliation = {
    "The New York Times": blue,
    "Business Insider": blue, 
    "Yahoo.com": lightblue, 
    "CNN": lightblue,
    "Politico": blue,
    "Huffpost.com": darkblue,
    "Time": blue, 
    "Independent": lightblue,
    "ABC News": blue,
    "Fivethirtyeight.com": lightblue,
    "USA Today": neutral,
    "Gizmodo.com": darkblue,
    "Fox News": red,
    "Mashable": darkblue,
    "Reuters": neutral,
    "The Wall Street Journal": neutral,
    "Npr.org": neutral,
    "Newyorker.com": darkblue,
    "Youtube.com": neutral
};

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

    var barMargin = {
        top: 0,
        right: vw / 4,
        bottom: 15,
        left: vw / 4
    };

    var barWidth = vw - barMargin.left - barMargin.right,
        barHeight = 400 - barMargin.top - barMargin.bottom;

    var candidateBarChart = d3.select("#candidate-bars")
        .append("svg:svg")
        .attr("width", barWidth + barMargin.left + barMargin.right)
        .attr("height", barHeight + barMargin.top + barMargin.bottom)

    var candidateGroup = candidateBarChart.append("g")
        .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

    var tooltip = d3.select("body").append("div")	
        .attr("class", "tooltip card")				
        .style("opacity", 0)
    
    tooltip.append("span").attr("class", "name");

    var radiusScale1 = d3.scale.linear()
        .domain([1, 100])
        .range([10, 45]);

    var radiusScale2 = d3.scale.linear()
        .domain([1, 60])
        .range([20, 60]);

    var radiusScale3 = d3.scale.linear()
        .domain([1, 60])
        .range([20, 60]);

    var searchButton = d3.select("#buttonWrapper")
        .append('button')
        .text('Search')
        .attr('class', 'button card')
        .on('click', function() {
            let input = document.getElementById("query").value;
            getJSON(`http://${host}:5000/getSourceDistribution/${input}`, function(err, data) {
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

    getJSON(`http://${host}:5000/getTrending`,
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

        candidateBarChart.selectAll(".bar").attr("fill", function(d) {
            return sourceAffiliation[d.source] || neutral;
        });
        sourceBubbleChart.selectAll("g")
            .data([])
            .exit().remove();

        if (this === d3.event.target) {
            trendBubbleChart.selectAll("circle").attr("fill", defaultColor);
            selectedBubble = null;
            return;
        }

        selectedBubble = d3.select(d3.event.target.parentNode);
        var bubbleData = selectedBubble.data()[0];

        trendBubbleChart.selectAll("circle").attr("fill", neutralColor);
        selectedBubble.select("circle").attr("fill", filterColor);

        getJSON(`http://${host}:5000/getSourceDistribution/${bubbleData.keyword}`, function(err, data) {
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
                .on("mouseover", function() {
                    return tooltip.style("visibility", "visible")
                        .text("Total Articles: " + 10);
                })
                .on("mousemove", function() {
                    return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                })
                .on("mouseout", function() {
                    return tooltip.style("visibility", "hidden");
                })
                .append("circle")
                .attr("r", function(d) {
                    return radiusScale2(d.articleCount);
                })
                .attr("fill", function(d) {
                    return sourceAffiliation[d.source] || neutral;
                });
                
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
            .on("mouseover", function() {
                return tooltip.style("visibility", "visible")
                    .text("Total Articles: " + d3.event.target.__data__.articleCount);
            })
            .on("mousemove", function() {
                return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
            })
            .on("mouseout", function() {
                return tooltip.style("visibility", "hidden");
            })
            .append("circle")
            .attr("r", function(d) {
                return radiusScale1(d.articleCount);
            })
            .attr("fill", function() {
                if (selectedBubble == null) {
                    return defaultColor;
                } else {
                    return neutralColor;
                }
            });
            
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

    getJSON(`http://${host}:5000/getCandidateInfo`, function(err, data) {
        if (err !== null) {
            alert('Something went wrong: ' + err);
            return;
        }

        let newData = {};
        Object.keys(data).forEach(function(key1) {
            let curr = JSON.parse(data[key1].replace(/'/g, `"`))

            Object.keys(curr).forEach(function(key2) {
                if (newData[key2] === undefined) {
                    newData[key2] = {};
                }
                (newData[key2])[key1] = curr[key2];
            });
        })

        data = Object.keys(newData).map(function(key) {
            return {
                source: key,
                articleCount: Object.values(newData[key]).reduce(function(acc, a) {
                    return acc + a;
                }),
                candidateDist: newData[key]
            }
        });

        data.sort(function(x, y){
            return d3.ascending(x.articleCount, y.articleCount);
        });
        data = data.slice(data.length - numSources, data.length)        

        var barX = d3.scale.linear()
            .range([0, barWidth])
            .domain([0, d3.max(data, function(d) {
                return d.articleCount;
            })]);

        var barY = d3.scale.ordinal()
            .rangeRoundBands([barHeight, 0], .1)
            .domain(data.map(function(d) {
                return d.source;
            }));

        var barYAxis = d3.svg.axis()
            .scale(barY)
            .tickSize(0)
            .orient("left");

        var barGY = candidateGroup.append("g")
            .attr("class", "y axis")
            .call(barYAxis)

        var bars = candidateGroup.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")

        bars.append("rect")
            .attr("class", "bar")
            .attr("fill", function(d) {
                return sourceAffiliation[d.source] || neutral;
            })
            .attr("y", function (d) {
                return barY(d.source);
            })
            .attr("height", barY.rangeBand())
            .attr("x", 0)
            .attr("width", function (d) {
                return barX(d.articleCount);
            });

        bars.append("text")
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("y", function (d) {
                return barY(d.source) + barY.rangeBand() / 2 + 4;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", function (d) {
                return barX(d.value) + 3;
            })
            .text(function (d) {
                return d.value;
            });
    });

    var selectedBar = null;

    candidateBarChart.on("click", function() {
        trendBubbleChart.selectAll("circle").attr("fill", defaultColor);
        sourceBubbleChart.selectAll("g")
            .data([])
            .exit().remove();

        if (this === d3.event.target) {
            candidateBarChart.selectAll(".bar").attr("fill", defaultColor);
            selectedBar = null;
            return;
        }

        selectedBar = d3.select(d3.event.target);
        var barData = selectedBar.data()[0];

        candidateBarChart.selectAll(".bar").attr("fill", neutralColor);
        selectedBar.attr("fill", filterColor);

        let data = Object.keys(barData.candidateDist).map(function(key) {
            return {
                name: key,
                articleCount: barData.candidateDist[key]
            }
        });

        var nodes = sourceBubbleChart.selectAll(".node")
            .data(data)
            .enter()
    
        nodes.append("g")
            .attr("class", "node")
            .on("mouseover", function() {
                return tooltip.style("visibility", "visible")
                    .text("Total Articles: " + d3.event.target.__data__.articleCount);
            })
            .on("mousemove", function() {
                return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
            })
            .on("mouseout", function() {
                return tooltip.style("visibility", "hidden");
            })
            .append("circle")
            .attr("r", function(d) {
                return radiusScale3(d.articleCount);
            })
            .attr("fill", defaultColor)
            
        sourceBubbleChart.selectAll("g")
            .append("text")
            .attr("class", "unselectable")
            .text(function(d) { return d.name; });

        force = d3.layout.force() //set up force
            .size([width, height])
            .nodes(data)
            .charge(-300)
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

        force.start();
    })

    var tooltip = d3.select("body")
        .append("div")
        .style("font-family", "'Roboto', sans-serif")
        .style("font-size", "13px")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");

    candidateBarChart.selectAll("g")
        .on("mouseover", function() {
            return tooltip.style("visibility", "visible")
                .text("Total Articles: " + d3.event.target.__data__.articleCount);
        })
	    .on("mousemove", function() {
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
	    .on("mouseout", function() {
            return tooltip.style("visibility", "hidden");
        });
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