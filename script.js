//! AJAX CHART /////////////////////////////////


// create svg 

// var mySvg = document.createElement('svg');
// mySvg.setAttribute('width','100px');
// mySvg.setAttribute('height','100px');
// var container = document.getElementsByClassName('container')[0];
// container.prepend(mySvg);

//Width height and PI * 2
var w = 500;
var h = 500;
const TWOPI = 6.28318530718;



var svg = d3.select("#se-header")
    .append("svg")
    .style("background-color", "black")
    .attr("width", "100%")
    .attr("height", h);



var dataset = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10];






function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getData() {
    $.ajax({
        url: 'https://canvasjs.com/services/data/datapoints.php',
        type: 'post',
        dataType: 'jsonp',
        success: function (result) {
            var listOut = []
            result.forEach((element, index) => {
                listOut.push(result[index][1])
            });
            dataset = listOut;

            svg.selectAll("circle")
                .data(dataset)
                .enter()
                .append("circle")
                .attr("r", function (d) {
                    return Math.abs(d) * 2;
                });






            d3.selectAll("circle")
                .data(dataset)
                .transition()
                .duration(4000)
                .ease(d3.easeElastic.period(0.1))
                .attr("cy", function (d) {
                    let cy = 100 * Math.cos((d / 16) * TWOPI)
                    return cy + h / 2;
                })
                .attr("cx", function (d) {
                    let cx = 100 * Math.sin((d / 8) * TWOPI)
                    return cx + w;
                })
                .style("fill", function (d) {
                    return "hsl(" + (d / 16) * 50 + ",70%,50%)";
                })


        },
        error: function () {
            document.getElementById('data').innerHTML = "error";

        }
    });
    await sleep(1000);
    getData();
}
getData();



//   ("fill", function() {
//     return function(t) {
//       return "hsl(" + t * 360 + ",100%,50%)";
//     };





//! TABLE 1 /////////////////////////////////

var population = {
    "Belgium": 11500000,
    "Bulgaria": 7000000,
    "Czech Republic": 10700000,
    "Denmark": 5800000,
    "Germany": 83000000,
    "Estonia(¹)": 1329000,
    "Ireland": 5000000,
    "Greece(²)": 10700000,
    "Spain(³)": 47000000,
    "France": 67000000,
    "Croatia": 4000000,
    "Italy(⁴)": 60360000,
    "Cyprus": 1189000,
    "Latvia(⁵)": 1920000,
    "Lithuania": 2794000,
    "Luxembourg": 613894,
    "Hungary": 9770000,
    "Malta": 514564,
    "The Netherlands(⁶)": 17280000,
    "Austria": 8859000,
    "Poland": 37970000,
    "Portugal": 10280000,
    "Romania": 19410000,
    "Slovenia": 2081000,
    "Slovakia": 5464000,
    "Finland(⁷)": 5518000,
    "Sweden": 10230000,
    "Iceland(⁸)": 364134,
    "Liechtenstein": 38250,
    "Norway": 5391000,
    "Switzerland(⁷)": 8570000,
    "Montenegro": 621873,
    "Macedonia": 2077000,
    "Serbia": 6982000,
    "Turkey(⁹)": 82000000
}




var firstTable = [];
var table1 = document.getElementById('table1');
var numberOfCountries = table1.rows.length;


for (var i = 2; i < numberOfCountries; i++) {

    //country object creation
    var country = [];

    //population by country
    var populationOfCountry = 0;


    // get country name
    var countryName = table1.rows[i].cells[1].innerHTML;



    populationOfCountry = population[`${countryName}`];


    // get total crimes by countries

    var total = 0;

    for (var j = 0; j < 11; j++) {
        var dataTable = table1.rows[i].cells[j + 2].innerHTML;
        dataTable == ":" ? dataTable = 0 : null;
        dataTable = parseFloat(dataTable);
        total += dataTable;
        // firstTable.countryName.push
    }

    total /= parseInt(populationOfCountry);

    // country.push({total:total});

    //get all crimes by countries 
    var dataList = [];
    for (var j = 0; j < 11; j++) {
        var dataTable = table1.rows[i].cells[j + 2].innerHTML;
        dataTable == ":" ? dataTable = 0 : null;
        dataTable = parseFloat(dataTable);
        var year = 2002 + j;
        dataList.push([year, dataTable]);
    }

    country.push({
        countryName: countryName,
        total: total,
        data: dataList
    });

    firstTable.push(country);
}


//SORT TABLE1
firstTableCopy = firstTable;
firstTableSorted = [];

// function that iterate through table1, sort it and put inside a new object firstTableSorted 
function sortTable1(obj) {
    var max = 0;
    var indexMax = 0;
    var objOut = {};
    if (obj.length == 0) {
        null
    } else {
        // find the maximum total crimes commited
        obj.forEach((element, index) => {
            var value = obj[index][0].total;
            if (value > max) {
                max = value;
                indexMax = index;
                objOut = obj[index][0];
            }
        });
        firstTableSorted.push(objOut);
        obj.splice(indexMax, 1);
        sortTable1(obj);
    }
}

sortTable1(firstTableCopy);


var sortedCountries = [];
var sortedData = [];
var gradientColor = []

firstTableSorted.forEach((element, index) => {
    sortedCountries.push(element.countryName);
    sortedData.push(element.total);
    gradientColor.push(`rgb(${255 - index * 9}, ${index * 8}, 0)`)
});


var myChart = document.createElement("canvas");
myChart.setAttribute('height', '150');
myChart.style.marginTop = "50px";
document.getElementsByTagName('h3')[0].append(myChart);

var chart = new Chart(myChart, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: sortedCountries,
        datasets: [{
            // label: 'total crimes by country between 2002 and 2012',
            backgroundColor: gradientColor,
            borderColor: 'rgb(0, 0, 0.)',
            data: sortedData
        }]
    },

    // Configuration options go here
    options: {
        legend: {
            display: false
        },

        scales: {
            xAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: 'countries'
                }
            }],
            yAxes: [{
                type: 'logarithmic',
                ticks: {
                    min: 0,
                    max: 0.0015,
                    callback: function (value, index, values) {
                        if (index % 4 == 0) {
                            return value;
                        }
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Crimes during 2002/2012 BY INHABITANT'
                }
            }]
        }

    }
});



//! PRISON CHART 

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }




var prisonCountries = [];
var prisonChart1 = [];
var prisonChart2 = [];
var colorGradient = [];

var table2 = document.getElementById('table2');


for (var i = 1; i < 31; i++) {
    var dataTable = table2.rows[i].cells[1].innerHTML;
    prisonCountries.push(dataTable);
    var dataTable = table2.rows[i].cells[2].innerHTML;
    prisonChart1.push(parseInt(dataTable));
    var dataTable = table2.rows[i].cells[3].innerHTML;
    prisonChart2.push(parseInt(dataTable));
    colorGradient.push(`hsl( ${i * 5} ,70%,50%)`)
}




var elem = document.querySelector('#Homicides');
elem.style.display = "block";
var myChart2 = document.createElement("canvas");
myChart2.setAttribute('id', 'prisonChart');
elem.parentNode.insertBefore(myChart2, elem);



var button2 = document.createElement('button')
button2.innerHTML = "2010-12";
button2.onclick = function(){
    

    var del = document.getElementById('prisonChart');
    del.remove();
    var myChart2 = document.createElement("canvas");
    myChart2.setAttribute('height', '150');
    myChart2.setAttribute('id', 'prisonChart');
    myChart2.setAttribute('width', '150');
    myChart2.style.display= "block";
    myChart2.style.marginTop = "50px";
    button2.append(myChart2);


    var chart2 = new Chart(myChart2, {
        // The type of chart we want to create
        type: 'doughnut',
    
        // The data for our dataset
        data: {
            labels: prisonCountries,
            datasets: [{
                label: 'My First dataset',
                backgroundColor: colorGradient,
                borderColor: 'rgb(255, 99, 132)',
                data: prisonChart2
            }]
        },
    
        // Configuration options go here
        options: {
            legend: {
                display: false
            }
        }
    });
    };
insertAfter(elem, button2);
button2.style.display = "block";











var button1 = document.createElement('button')
button1.innerHTML = "2007-09";
button1.onclick = function(){

    var del = document.getElementById('prisonChart');
    del.remove();
    var myChart2 = document.createElement("canvas");
    myChart2.setAttribute('height', '150');
    myChart2.setAttribute('id', 'prisonChart');
    myChart2.setAttribute('width', '150');
    myChart2.style.display= "block";
    myChart2.style.marginTop = "50px";
    button1.append(myChart2);


var chart2 = new Chart(myChart2, {
    // The type of chart we want to create
    type: 'doughnut',

    // The data for our dataset
    data: {
        labels: prisonCountries,
        datasets: [{
            label: 'My First dataset',
            backgroundColor: colorGradient,
            borderColor: 'rgb(255, 99, 132)',
            data: prisonChart1
        }]
    },

    // Configuration options go here
    options: {
        legend: {
            display: false
        }
    }
});
};
insertAfter(elem, button1);





