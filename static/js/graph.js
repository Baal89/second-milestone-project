queue()
    .defer(d3.csv, "data/student-performance.csv")
    .await(makeGraphs);

function makeGraphs(error, performanceData) {
    var ndx = crossfilter(performanceData);

    show_gender_balance(ndx);
    show_age_balance(ndx);
    show_family_size(ndx);

    dc.renderAll();
}

function show_gender_balance(ndx) {
    var dim = ndx.dimension(dc.pluck("sex"));
    var group = dim.group();

    dc.barChart("#gender-balance")
        .width(500)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("gender distribution")
        .yAxis().ticks(20);
}

function show_age_balance(ndx) {
    var dim = ndx.dimension(dc.pluck("age"));
    var group = dim.group();

    dc.barChart("#age-balance")
        .width(500)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("students age")
        .yAxis().ticks(20);
}

function show_family_size(ndx) {
    var dim = ndx.dimension(dc.pluck("famsize"));
    var group = dim.group();

    dc.barChart("#family-size")
        .width(500)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Students family size")
        .yAxis().ticks(20);
}
