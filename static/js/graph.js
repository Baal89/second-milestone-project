queue()
    .defer(d3.csv, "data/StudentsPerformance.csv")
    .await(makeGraph);

function makeGraph(error, performanceData) {
    var ndx = crossfilter(performanceData);
    
    show_performance_in_math(ndx);
    show_performance_in_reading(ndx);
    show_performance_in_writing(ndx);
    
    dc.renderAll();
}


function show_performance_in_math(ndx) {
    var dim = ndx.dimension(dc.pluck("gender"));
    var group = dim.group().reduceSum(dc.pluck("math score"));

    dc.barChart("#math-performance")
       .width(500)
       .height(300)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(dim)
       .group(group)
       .transitionDuration(500)
       .x(d3.scale.ordinal())
       .xUnits(dc.units.ordinal)
       .xAxisLabel("Math Score")
       .elasticY(true)
       .yAxis().ticks(10);
}

function show_performance_in_reading(ndx) {
    var dim = ndx.dimension(dc.pluck("gender"));
    var group = dim.group().reduceSum(dc.pluck("reading score"));

    dc.barChart("#reading-performance")
       .width(500)
       .height(300)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(dim)
       .group(group)
       .transitionDuration(500)
       .x(d3.scale.ordinal())
       .xUnits(dc.units.ordinal)
       .xAxisLabel("reading score")
       .elasticY(true)
       .yAxis().ticks(10);
}

function show_performance_in_writing(ndx) {
    var dim = ndx.dimension(dc.pluck("gender"));
    var group = dim.group().reduceSum(dc.pluck("writing score"));

    dc.barChart("#writing-performance")
       .width(500)
       .height(300)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(dim)
       .group(group)
       .transitionDuration(500)
       .x(d3.scale.ordinal())
       .xUnits(dc.units.ordinal)
       .xAxisLabel("writing score")
       .elasticY(true)
       .yAxis().ticks(10);
}

function show_average_spending_per_person(ndx) {
    var dim = ndx.dimension(dc.pluck("name"));
    
    function add_item(p, v) {
        p.count++;
        p.total += v.spend;
        p.average = p.total / p.count;
        return p; 
    }
    
    function remove_item(p, v) {
        p.count--;
        if(p == 0) {
            p.total = 0;
            p.average = 0;
        }
        p.total -= v.spend;
        p.average = p.total / p.count;
        return p;
    }
    
    function initialise() {
        return {count: 0, total: 0, average: 0};
    }
    
    
    var averageSpending = dim.group().reduce(add_item, remove_item, initialise);
    
    
    dc.barChart("#average-spending-per-person")
       .width(400)
       .height(300)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(dim)
       .group(averageSpending)
       .valueAccessor(function(d) {
           return d.value.average;
       })
       .transitionDuration(500)
       .x(d3.scale.ordinal())
       .xUnits(dc.units.ordinal)
       .elasticY(true)
       .xAxisLabel("Average spending per person")
       .yAxis().ticks(10);
}