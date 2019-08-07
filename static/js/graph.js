queue()
    .defer(d3.csv, "data/world-happiness-report-2019.csv")
    .await(makeGraph);

function makeGraph(error, spendData) {
    var ndx = crossfilter(spendData);
    
    spendData.forEach(function(d) {
        d.spend = parseInt(d.spend);
    });

    show_discipline_selector(ndx);
    show_spending_per_person(ndx);
    show_spending_per_store(ndx);
    show_spending_per_city(ndx);
    show_average_spending_per_person(ndx);
    
    dc.renderAll();
}

function show_discipline_selector(ndx) {
    dim = ndx.dimension(dc.pluck("discipline"));
    group = dim.group();
    
    dc.selectMenu("#discipline-selector")
      .dimension(dim)
      .group(group);
}

function show_spending_per_person(ndx) {
    var dim = ndx.dimension(dc.pluck("Country"));
    var group = dim.group().reduceSum(dc.pluck("Ladder"));

    dc.barChart("#spending-per-person")
       .width(6500)
       .height(500)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(dim)
       .group(group)
       .transitionDuration(500)
       .x(d3.scale.ordinal())
       .xUnits(dc.units.ordinal)
       .xAxisLabel("Person")
       .elasticY(true)
       .yAxis().ticks(10);
}

function show_spending_per_store(ndx) {
    var dim = ndx.dimension(dc.pluck("store"));
    var group = dim.group().reduceSum(dc.pluck("spend"));

    dc.barChart("#spending-per-store")
       .width(1000)
       .height(500)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(dim)
       .group(group)
       .transitionDuration(500)
       .x(d3.scale.ordinal())
       .xUnits(dc.units.ordinal)
       .xAxisLabel("Store")
       .elasticY(true)
       .yAxis().ticks(10);
}

function show_spending_per_city(ndx) {
    var dim = ndx.dimension(dc.pluck("city"));
    var group = dim.group().reduceSum(dc.pluck("spend"));

    dc.barChart("#spending-per-city")
       .width(500)
       .height(300)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(dim)
       .group(group)
       .transitionDuration(500)
       .x(d3.scale.ordinal())
       .xUnits(dc.units.ordinal)
       .xAxisLabel("City")
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