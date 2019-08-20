queue()
    .defer(d3.csv, "data/world-happiness-report-2016.csv")
    .await(makeGraphs);

function makeGraphs(error, happinessData) {
    var ndx = crossfilter(happinessData);
   
   show_happiness_per_region(ndx);
   
    dc.renderAll();
}

function show_happiness_per_region (ndx) {
    var dim = ndx.dimension(dc.pluck("Rank"))
    var group = dim.group(dc.pluck("Region"));
    
    dc.barChart("#region-happiness")
      .width(1500)
      .height(300)
      .margins({ top: 10, right: 50, bottom: 30, left: 50})
      .dimension(dim)
      .group(group)
      .transitionDuration(500)
      .x(d3.scale.ordinal())
      .xUnits(dc.units.ordinal)
      .elasticY(true)
      .xAxisLabel("happiness per region")
      .yAxis().ticks(20);
}

