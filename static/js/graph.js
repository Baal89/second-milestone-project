queue()
    .defer(d3.csv, "data/student-mat.csv")
    .await(makeGraphs);

function makeGraphs(error, performanceData) {
    var ndx = crossfilter(performanceData);
    
    performanceData.forEach(function(d) {
        d.G3 = parseInt(d.G3);
    });

    show_discipline_selector(ndx);

    show_sex_distribution(ndx);
    show_age_distribution(ndx);
    show_mother_education(ndx);
    show_father_education(ndx);

    show_performance_to_workday_alcohol_cosumption(ndx);

    dc.renderAll();
}

function show_discipline_selector(ndx) {
    dim = ndx.dimension(dc.pluck("discipline"))
    group = dim.group()

    dc.selectMenu("#discipline-selector")
        .dimension(dim)
        .group(group);
}

function show_sex_distribution(ndx) {
    var dim = ndx.dimension(dc.pluck("sex"));
    var group = dim.group();

    dc.barChart("#sex-distribution")
        .width(500)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("gender in the schools")
        .yAxis().ticks(10);
}

function show_age_distribution(ndx) {
    var dim = ndx.dimension(dc.pluck("age"));
    var group = dim.group();

    dc.barChart("#age-distribution")
        .width(500)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("age population in the schools")
        .yAxis().ticks(10);
}

function show_mother_education(ndx) {

    function motherEducation(dimension, Medu) {
        return dimension.group().reduce(
            function(p, v) {
                p.total++;
                if (v.Medu == Medu) {
                    p.match++;
                }
                return p;
            },
            function(p, v) {
                p.total--;
                if (v.Medu == Medu) {
                    p.match--;
                }
                return p;
            },
            function() {
                return { total: 0, match: 0 };
            }
        );

    }
    var dim = ndx.dimension(dc.pluck("sex"));
    var noneMotherEducation = motherEducation(dim, "0");
    var firstMotherEducation = motherEducation(dim, "1");
    var secondaryMotherEducation = motherEducation(dim, "2");
    var secondaryGradeMotherEducation = motherEducation(dim, "3");
    var higherMotherEducation = motherEducation(dim, "4");


    dc.barChart("#mother-education")
        .width(500)
        .height(300)
        .dimension(dim)
        .group(noneMotherEducation)
        .stack(secondaryGradeMotherEducation)
        .stack(secondaryMotherEducation)
        .stack(firstMotherEducation)
        .stack(higherMotherEducation)
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

function show_father_education(ndx) {

    function fatherEducation(dimension, Fedu) {
        return dimension.group().reduce(
            function(p, v) {
                p.total++;
                if (v.Fedu == Fedu) {
                    p.match++;
                }
                return p;
            },
            function(p, v) {
                p.total--;
                if (v.Fedu == Fedu) {
                    p.match--;
                }
                return p;
            },
            function() {
                return { total: 0, match: 0 };
            }
        );

    }
    var dim = ndx.dimension(dc.pluck("sex"));
    var noneFatherEducation = fatherEducation(dim, "0");
    var firstFatherEducation = fatherEducation(dim, "1");
    var secondaryFatherEducation = fatherEducation(dim, "2");
    var secondaryGradeFatherEducation = fatherEducation(dim, "3");
    var higherFatherEducation = fatherEducation(dim, "4")


    dc.barChart("#father-education")
        .width(500)
        .height(300)
        .dimension(dim)
        .group(noneFatherEducation)
        .stack(secondaryGradeFatherEducation)
        .stack(secondaryFatherEducation)
        .stack(firstFatherEducation)
        .stack(higherFatherEducation)
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

function show_performance_to_workday_alcohol_cosumption(ndx) {
    var performanceDim = ndx.dimension(dc.pluck("G3"))
    var consumptionDim = ndx.dimension(function(d) {
        return [d.G3, d.Dalc];
    });
    var workDayConsumptionGroup = consumptionDim.group();

    var minPerformance = performanceDim.bottom(1)[0].G3;
    var maxPerformance = performanceDim.top(1)[0].G3;

    dc.scatterPlot("#workday-alcohol-graduation")
        .width(800)
        .height(400)
        .x(d3.scale.linear().domain([minPerformance, maxPerformance]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .xAxisLabel("")
        .title(function(d) {
            return "Work day Consumption: " + d.key[1];
        })
        .dimension(consumptionDim)
        .group(workDayConsumptionGroup)
        .margins({ top: 10, right: 50, bottom: 75, left: 75 });
}
