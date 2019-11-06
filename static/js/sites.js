
var start = moment().subtract(6, "days"); // 7 days before now
var end = moment(); // today
function cb(start, end) {
    $('#netrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY')); // display the data range
    var numbers  = end.diff(start,"days") + 1; // get the number of days
    // random code generators
        function datagenerator() {
            var chartData = [];    
            var voiceOne =50;
            var voicetwo =50;
            var voicethree =50;
            var voiceaverage = 0;
        
            for (var i = 0; i < numbers; i++) {        
                var newDate = new Date();
                newDate.setDate(newDate.getDate() - i);        
                voiceOne += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
                voicetwo += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
                voicethree += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
                voiceaverage = Math.ceil((voiceOne + voicetwo + voicethree)/3);
                voicetotal = voiceOne + voicetwo + voicethree;

                chartData.push({
                date: newDate.getTime(),
                stringDate: moment(newDate).format("DD MMM YYYY"),
                one: voiceOne,
                two: voicetwo,
                three: voicethree,
                average: voiceaverage,
                total: voicetotal
                });
            }
            return chartData;
        
        }
        function datageneratorone() {
            var chartData = [];
            var voiceOne =70;
            var voicetwo =70;
            var voicethree =70;
            var voiceaverage = 0;
        
            for (var i = 0; i < numbers; i++) {
                var newDate = new Date();
                newDate.setDate(newDate.getDate() - i);        
                voiceOne += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
                voicetwo += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
                voicethree += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
                voiceaverage = Math.ceil((voiceOne + voicetwo + voicethree)/3);
                voicetotal = voiceOne + voicetwo + voicethree;

                chartData.push({
                date: newDate.getTime(),
                one: voiceOne,
                two: voicetwo,
                three: voicethree,
                average: voiceaverage,
                total: voicetotal
                });
            }
            return chartData;
        
        }

        var generatedData = datagenerator();
        // for highcharts to need to sort the data for zooming to work properly
        generatedData.sort(function(a, b) {
            return a.date - b.date
        })
        var generatedDataOne = datageneratorone();
        generatedDataOne.sort(function(a, b) {
            return a.date - b.date
        })

            //Code for network utilization
            Highcharts.chart('netchart', {
                    title: {
                        text: 'Network Utilization'
                    },
                    chart: {            
                        zoomType: 'x' // for zooming along x-axis only
                    },
                
                    xAxis: {
                        title: {
                            text: 'Date'
                        },
                        type: 'datetime' // for both date and time
                    },
                    plotOptions: {
                        series: {
                          states: {
                            inactive: {
                              opacity: 1
                            }
                          }
                        }
                      },
                    yAxis: {
                        title: {
                            text: 'Percentage (%)'
                        }
                    },
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    },
                    tooltip: {
                        shared: false, // false to set the tooltip  to show only the values in cursor is hovering  
                        useHTML: true,
                        headerFormat: '<span>{point.key}</span><table>',
                        pointFormat: '<tr><td style="color: {series.color}">Network Type: </td>' +
                        '<td style="text-align:right"><b>{series.name}</b></td></tr>'+'<tr><td style="color: {series.color}">Net Util.: </td>' +
                            '<td style="text-align:right"><b>{point.y} %</b></td></tr>',
                        footerFormat: '</table>',
                        valueDecimals: 2 // just number of decimal places 
                    },        
                    series: [{            
                                name: '2G',
                                data: generatedData.map((x)=>[x.date, x.one]).sort(function(a, b) { // the whole data must be in a []
                                    return a.y - b.y
                                })
                            },
                            {   
                                name: '3G',
                                data: generatedData.map((x)=>[x.date, x.two]).sort(function(a, b) { // the whole data must be in a []
                                    return a.y - b.y
                                })
                            },{
                            
                                name: '4G',
                                data: generatedData.map((x)=>[x.date, x.three]).sort(function(a, b) { // the whole data must be in a []
                                    return a.y - b.y
                                })
                            },
                            {           
                                name: 'Average',
                                data: generatedData.map((x)=>[x.date, x.average])
                    }
                ]  

                
                });

            // code for voice traffic 
            Highcharts.chart('voicechart', {
                    title: {
                        text: 'Voice Traffic'
                    },
                    chart: {
                        zoomType: 'x'
                    },
                
                    xAxis: {
                        title: {
                            text: 'Date'
                        },
                        type: 'datetime'
                    },
                    yAxis: {
                        title: {
                            text: 'Call Durations in minutes'
                        }
                    },
                    plotOptions: {
                        series: {
                          states: {
                            inactive: {
                              opacity: 1
                            }
                          }
                        }
                      },
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    },        
                    tooltip: {
                        shared: false,
                        useHTML: true,
                        headerFormat: '<span>{point.key}</span><table>',
                        pointFormat: '<tr><td style="color: {series.color}">Network Type: </td>' +
                        '<td style="text-align:right"><b>{series.name}</b></td></tr>'+'<tr><td style="color: {series.color}">Call durations: </td>' +
                            '<td style="text-align:right"><b>{point.y} minutes</b></td></tr>',
                        footerFormat: '</table>',
                        valueDecimals: 2
                    },

                    series: [{            
                            name: '2G',
                            data: generatedDataOne.map((x)=>[x.date, x.one])
                        },
                        {   
                            name: '3G',
                            data: generatedDataOne.map((x)=>[x.date, x.two])
                        },{
                        
                            name: '4G',
                            data: generatedDataOne.map((x)=>[x.date, x.three])
                        }


                ]
                
                });
            // code for data traffic 
            Highcharts.chart('datachart', {
                        title: {
                            text: 'Data Traffic'
                        },
                        chart: {
                            zoomType: 'x'
                        },
                    
                        xAxis: {
                            title: {
                                text: 'Date'
                            },
                            type: 'datetime'
                        },
                        yAxis: {
                            title: {
                                text: 'Data Consumed in MB'
                            }
                        },
                        plotOptions: {
                            series: {
                              states: {
                                inactive: {
                                  opacity: 1
                                }
                              }
                            }
                          },
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        },        
                        tooltip: {
                            shared: false,
                            useHTML: true,
                            headerFormat: '<span>{point.key}</span><table>',
                            pointFormat: '<tr><td style="color: {series.color}">Network Type: </td>' +
                            '<td style="text-align:right"><b>{series.name}</b></td></tr>'+'<tr><td style="color: {series.color}">Data Consumed: </td>' +
                                '<td style="text-align:right"><b>{point.y} MB</b></td></tr>',
                            footerFormat: '</table>',
                            valueDecimals: 2
                        },
                
                        series: [{            
                                name: '2G',
                                data: generatedDataOne.map((x)=>[x.date, x.one])
                            },
                            {   
                                name: '3G',
                                data: generatedDataOne.map((x)=>[x.date, x.two])
                            },{
                            
                                name: '4G',
                                data: generatedDataOne.map((x)=>[x.date, x.three])
                            }
                
                
                    ]
                    
                });
            // code for successful termination
            Highcharts.chart('terminationChart',{

                    chart: {                            
                        type: 'pie' // type of chart
                    },
                title: {
                    text: 'Total Subscriber Terminations' // Title of the page 
                },
                tooltip: {
                    useHTML: true, // use html setting  
                    headerFormat: '<span>{point.key}</span><table>', // header 
                    // the body
                    pointFormat: '<tr><td style="color: {series.color}">Total: </td>' +
                    '<td style="text-align:right"><b>{point.y:.if}</b></td></tr>'+'<tr><td style="color: {series.color}">Percentage: </td>' +
                        '<td style="text-align:right"><b>{point.percentage:.1f} %</b></td></tr>',
                    footerFormat: '</table>', // footer 
                },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer', // type pf cursor
                            showInLegend: true, // to show legend
                            point: {
                                events: { // for adding events
                                    click: function () {

                                    }
                                }
                            },
                            dataLabels: {
                                enabled: false,
                            
                            }
                        }
                    },
                        series: [{ // this chart has drilldown and series is where the data will be placed
                            name: 'Subscriber Terminations', // title of chart  
                            colorByPoint: true,                 
                            data: [{ // because there is a drilldown is the format is {name, y, drilldown}
                                name: 'Voice subscriber Terminations', // name
                                y: 1000.00, // value
                                color: '#90ed7d',
                                drilldown: 'voice' // name of the drilldown under this chart 
                                
                            }, {
                                name: 'Data Subscriber Terminations', // name
                                y: 5000.00, // value
                                color: '#f7a35c',
                                drilldown: 'data' // name of the drilldown under this chart 
                            }]
                        }],
                        drilldown: {
                            series: [
                                {
                                    name:'Voice Subscriber Terminations',
                                    id: 'voice', // same name under in the series array abovecolor: '#90ed7d',                        
                                    data: [ // the format is [name, value]
                                        ['2G Voice Subscriber Terminations',
                                        3000],
                                        ['3G Voice Subscriber Terminations',
                                        4000],
                                        ['4G Voice Subscriber Terminations',
                                        2400],

                                    ]
                                },
                                {
                                    name:'Data Subscriber Terminations',
                                    id: 'data', // same name under in the series array above
                                    data: [
                                        ['2G Data Subscriber Terminations',
                                        3000], // 
                                        ['3G Data Subscriber Terminations',
                                        4000],
                                        ['4G Data Subscriber Terminations',
                                        2400],

                                    ]
                                }
                            ]
                        }
                    
            });
            // code for availability
            Highcharts.chart('availableChart', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Availability'
                },    
                xAxis: {
                    categories: generatedData.map((x)=>[x.stringDate]).sort(function(a, b) {
                        return a.y - b.y
                    }),
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Percentage(%)'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                    footerFormat: '</table>',
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: 'Availability',
                    data: generatedData.map((x)=>[x.one]).sort(function(a, b) {
                        return a.y - b.y
                    })

                }]
            });
            // code for transaction
            Highcharts.chart('transactionChart', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Transaction'
                },    
                xAxis: {
                    categories: generatedData.map((x)=>[x.stringDate]).sort(function(a, b) {
                        return a.y - b.y
                    }),
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Number of Transactions'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.4f}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: 'Transactions',
                    data: generatedData.map((x)=>[x.one]).sort(function(a, b) {
                        return a.y - b.y
                    })

                }]
            });


}

$('#netrange').daterangepicker({
    startDate: start,
    endDate: end,
    opens: 'center',
    ranges: {
       'Today': [moment(), moment()],
       'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
       'Last 7 Days': [moment().subtract(6, 'days'), moment()],
       'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      // 'This Month': [moment().startOf('month'), moment().endOf('month')],
       'Last 60 Days': [moment().subtract(59, 'days'), moment()],
       'Last 90 Days': [moment().subtract(89, 'days'), moment()],
       
    }
    
    
}, cb);
cb(start, end);
 




