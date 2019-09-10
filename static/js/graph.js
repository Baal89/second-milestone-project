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

    show_percent_higher_mother_education(ndx, "F", "#percentage-of-female-mother-higher-education");
    show_percent_higher_mother_education(ndx, "M", "#percentage-of-male-mother-higher-education");
    show_percent_higher_father_education(ndx, "F", "#percentage-of-female-father-higher-education");
    show_percent_higher_father_education(ndx, "M", "#percentage-of-male-father-higher-education");

    show_performance_to_workday_alcohol_cosumption(ndx);

    show_student_performance(ndx);

    dc.renderAll();
}

function show_discipline_selector(ndx) {
    var dim = ndx.dimension(dc.pluck("discipline"));
    var group = dim.group();

    dc.selectMenu("#discipline-selector")
        .dimension(dim)
        .group(group);
}

function show_sex_distribution(ndx) {
    var dim = ndx.dimension(dc.pluck("sex"));
    var group = dim.group();

    dc.barChart("#sex-distribution")
        .width(400)
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
        .width(400)
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
        .width(400)
        .height(300)
        .dimension(dim)
        .group(noneMotherEducation, "none")
        .stack(secondaryGradeMotherEducation, "primary")
        .stack(secondaryMotherEducation, "High School")
        .stack(firstMotherEducation, "College")
        .stack(higherMotherEducation, "higher")
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
        .xAxisLabel("Mother education level per gender")
        .legend(dc.legend().x(320).y(20).itemHeight(15).gap(5))
        .margins({ top: 10, right: 100, bottom: 50, left: 50 });
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
    var higherFatherEducation = fatherEducation(dim, "4");


    dc.barChart("#father-education")
        .width(400)
        .height(300)
        .dimension(dim)
        .group(noneFatherEducation, "none")
        .stack(secondaryGradeFatherEducation, "primary")
        .stack(secondaryFatherEducation, "High School")
        .stack(firstFatherEducation, "College")
        .stack(higherFatherEducation, "higher")
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
        .xAxisLabel("father education level per gender")
        .legend(dc.legend().x(320).y(20).itemHeight(15).gap(5))
        .margins({ top: 10, right: 100, bottom: 50, left: 50 });
}

function show_percent_higher_mother_education(ndx, gender, element) {
    var percentageMotherHigherEducation = ndx.groupAll().reduce(
        function(p, v) {
            if (v.sex === gender) {
                p.count++;
                if (v.Medu === "4") {
                    p.are_higher++;
                }
            }
            return p;
        },
        function(p, v) {
            if (v.sex === gender) {
                p.count--;
                if (v.Medu === "4") {
                    p.are_higher--;
                }
            }
            return p;
        },
        function() {
            return { count: 0, are_higher: 0 };
        },
    );
    dc.numberDisplay(element)
        .formatNumber(d3.format(".2%"))
        .valueAccessor(function(d) {
            if (d.count == 0) {
                return 0;
            }
            else {
                return (d.are_higher / d.count);
            }
        })
        .group(percentageMotherHigherEducation);
}

function show_percent_higher_father_education(ndx, gender, element) {
    var percentageFatherHigherEducation = ndx.groupAll().reduce(
        function(p, v) {
            if (v.sex === gender) {
                p.count++;
                if (v.Fedu === "4") {
                    p.are_higher++;
                }
            }
            return p;
        },
        function(p, v) {
            if (v.sex === gender) {
                p.count--;
                if (v.Fedu === "4") {
                    p.are_higher--;
                }
            }
            return p;
        },
        function() {
            return { count: 0, are_higher: 0 };
        },
    );
    dc.numberDisplay(element)
        .formatNumber(d3.format(".2%"))
        .valueAccessor(function(d) {
            if (d.count == 0) {
                return 0;
            }
            else {
                return (d.are_higher / d.count);
            }
        })
        .group(percentageFatherHigherEducation);
}

function show_performance_to_workday_alcohol_cosumption(ndx) {

    var genderColors = d3.scale.ordinal()
        .domain(["Female", "Male"])
        .range(["pink", "blue"]);

    var performanceDim = ndx.dimension(dc.pluck("G3"))
    var consumptionDim = ndx.dimension(function(d) {
        return [d.G3, d.Dalc, d.sex];
    });
    var workDayConsumptionGroup = consumptionDim.group();

    var minPerformance = performanceDim.bottom(1)[0].G3;
    var maxPerformance = performanceDim.top(1)[0].G3;

    dc.scatterPlot("#workday-alcohol-graduation")
        .width(700)
        .height(400)
        .x(d3.scale.linear().domain([minPerformance, maxPerformance]))
        .y(d3.scale.linear().domain([0, 10]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(5)
        .xAxisLabel("")
        .title(function(d) {
            return "Workday Consumption: " + d.key[1] + " units";
        })
        .colors(genderColors)
        .colorAccessor(function(d) {
            return d.key[2];
        })
        .dimension(consumptionDim)
        .group(workDayConsumptionGroup)
        .xAxisLabel("final grade math results")
        .yAxisLabel("units of alchool per workday")
        .margins({ top: 10, right: 50, bottom: 75, left: 65 })
        .yAxis().ticks(5);
}


function show_student_performance(ndx) {

    function schoolPerformance(dimension, sex) {
        return dimension.group().reduce(
            function(p, v) {
                p.total++;
                if (v.sex == sex) {
                    p.match++;
                }
                return p;
            },
            function(p, v) {
                p.total--;
                if (v.sex == sex) {
                    p.match--;
                }
                return p;
            },
            function() {
                return { total: 0, match: 0 };
            }
        );
    }

    var dim = ndx.dimension(dc.pluck("G3"));
    var femalePerformance = schoolPerformance(dim, "F");
    var malePerformance = schoolPerformance(dim, "M");

    dc.barChart("#student-performance")
        .width(700)
        .height(400)
        .dimension(dim)
        .group(femalePerformance, "female")
        .stack(malePerformance, "male")
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
        .xAxisLabel("final grade math results")
        .legend(dc.legend().x(620).y(20).itemHeight(15).gap(5))
        .margins({ top: 10, right: 100, bottom: 50, left: 30 });
}


`window.addEventListener("resize", myFunction);

function myFunction() {
    dc.renderAll()
}
`;
