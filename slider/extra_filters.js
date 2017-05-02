
// create filter with id #drop-shadow
// height=130% so that the shadow is not clipped
/*var glow_filter = defs.append("filter")
    .attr("id", "glow")
    .attr("height", "130%");

// SourceAlpha refers to opacity of graphic that this filter will be applied to
// convolve that with a Gaussian with standard deviation 3 and store result
// in blur
glow_filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 2.5)
    .attr("result", "coloredBlur");


// overlay original SourceGraphic over translated blurred opacity by using
// feMerge filter. Order of specifying inputs is important!
var glow_feMerge = glow_filter.append("feMerge");

glow_feMerge.append("feMergeNode")
    .attr("in", "coloredBlur")
glow_feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");

*/

// create filter with id #drop-shadow
// height=130% so that the shadow is not clipped
/*var filter = defs.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "130%");

// SourceAlpha refers to opacity of graphic that this filter will be applied to
// convolve that with a Gaussian with standard deviation 3 and store result
// in blur
filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 5)
    .attr("result", "blur");

// translate output of Gaussian blur to the right and downwards with 2px
// store result in offsetBlur
/*filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 5)
    .attr("dy", 5)
    .attr("result", "offsetBlur");*/

// overlay original SourceGraphic over translated blurred opacity by using
// feMerge filter. Order of specifying inputs is important!
/*var feMerge = filter.append("feMerge");

feMerge.append("feMergeNode")
    .attr("in", "offsetBlur")
feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");*/

// for each rendered node, apply #drop-shadow filter
/*var item = svg.selectAll("rect")
    .data(items)
  .enter().append("rect")
    .attr("width", 170)
    .attr("height", 100)
    .attr("fill", "steelblue")
    .attr("stroke-width", 2)
    .style("filter", "url(#drop-shadow)")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });*/