queue()
    .defer(d3.csv, "data/student-performance.csv")
    .await(makeGraphs);

function makeGraphs(error, performanceData) {
    var ndx = crossfilter(performanceData);

    show_gender_balance(ndx);
    show_age_balance(ndx);
    show_family_size(ndx);
    show_mother_education(ndx);

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

function show_mother_education(ndx) {

    function graduationBYMotherEducation(dimension, Medu) {
        return dimension.group().reduce(
            function(p, v) {
                p.total++;
                if (v.rank == Medu) {
                    p.match++;
                }
                return p;
            },
            function(p, v) {
                p.total--;
                if (v.rank == Medu) {
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
    var noneMotherEducation = graduationBYMotherEducation(dim, "0");
    var PrimaryMotherEducation = graduationBYMotherEducation(dim, "1");
    var secondaryMotherEducation = graduationBYMotherEducation(dim, "2");
    var secondaryGradeMotherEducation = graduationBYMotherEducation(dim, "3");
    var higherMotherEducation = graduationBYMotherEducation(dim, "4");

    dc.barChart("#mother-education")
        .width(400)
        .height(300)
        .dimension(dim)
        .group(noneMotherEducation, "0")
        .stack(PrimaryMotherEducation, "1")
        .stack(secondaryMotherEducation, "2")
        .stack(secondaryGradeMotherEducation, "3")
        .stack(higherMotherEducation, "4")
        .valueAccessor(function(d) {
            if (d.value > 0) {
                return (d.value.match / d.value.total) * 100;
            }
            else {
                return 0;
            }
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(320).y(20).itemHeight(15).gap(5))
        .margins({ top: 10, right: 100, bottom: 30, left: 30 });
}

