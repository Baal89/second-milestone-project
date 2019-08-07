queue()
    .defer(d3.csv, "data/StudentsPerformance.csv")
    .await(makeGraph);

function makeGraph(error, performanceData) {
    var ndx = crossfilter(performanceData);

    show_ethnicity_distribution(ndx);
    show_performance_in_math(ndx);
    show_performance_in_reading(ndx);
    show_performance_in_writing(ndx);

    dc.renderAll();
}


function show_ethnicity_distribution(ndx) {

    function rankByEthnicity(dimension, ethnicity) {
        return dimension.group().reduce(
            function(p, v) {
                p.total++;
                if (v.ethnicity == ethnicity) {
                    p.match++;
                }
                return p;
            },
            function(p, v) {
                p.total--;
                if (v.ethnicity == ethnicity) {
                    p.match--;
                }
                return p;
            },
            function() {
                return { total: 0, match: 0 };
            }
        );
    }

    var dim = ndx.dimension(dc.pluck("gender"));
    var aByEthnicity = rankByEthnicity(dim, "group A");
    var bByEthnicity = rankByEthnicity(dim, "group B");
    var cByEthnicity = rankByEthnicity(dim, "group C");
    var dByEthnicity = rankByEthnicity(dim, "group D");
    var eByEthnicity = rankByEthnicity(dim, "group E");

    dc.barChart("#ethnicity-perfomance")
        .width(500)
        .height(300)
        .dimension(dim)
        .group(aByEthnicity, "group A")
        .stack(bByEthnicity, "group B")
        .stack(cByEthnicity, "group C")
        .stack(dByEthnicity, "group D")
        .stack(eByEthnicity, "group E")
        .valueAccessor(function(d) {
            if (d.value.total > 0) {
                return (d.value.match / d.value.total) * 100;
            }
            else {
                return 0;
            }
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(420).y(20).itemHeight(15).gap(5))
        .margins({ top: 10, right: 100, bottom: 30, left: 30 });
}

function show_performance_in_math(ndx) {
    var dim = ndx.dimension(dc.pluck("gender"));
    var group = dim.group().reduceSum(dc.pluck("math score"));

    dc.barChart("#math-performance")
        .width(500)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
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
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
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
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
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
        if (p == 0) {
            p.total = 0;
            p.average = 0;
        }
        p.total -= v.spend;
        p.average = p.total / p.count;
        return p;
    }

    function initialise() {
        return { count: 0, total: 0, average: 0 };
    }


    var averageSpending = dim.group().reduce(add_item, remove_item, initialise);


    dc.barChart("#average-spending-per-person")
        .width(400)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
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
