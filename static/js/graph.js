queue()
    .defer(d3.csv, "data/world-happiness-report-2019.csv")
    .await(makeGraph);

function makeGraph(error, countryData) {
    var ndx = crossfilter(countryData);

    show_happiness_level(ndx);
    
    dc.renderAll();
}

function show_happiness_level(ndx) {
    var dim = ndx.dimension(dc.pluck("Social support"));
    var group = dim.group();

    dc.barChart("#happiness-level")
       .width(7500)
       .height(300)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(dim)
       .group(group)
       .transitionDuration(500)
       .x(d3.scale.ordinal())
       .xUnits(dc.units.ordinal)
       .elasticY(true)
       .yAxis().ticks(10);
}
