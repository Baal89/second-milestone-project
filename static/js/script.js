window.onresize = function(event) {
    var newWidth = document.getElementById("mother-education").offsetWidth;
    mother_education.width(newWidth)
        .transitionDuration(0);
    dc.renderAll();
    mother_education.transitionDuration(750)
};
