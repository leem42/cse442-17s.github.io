

    /*@@@@@@@@@@@@@@@@@@@@@@@ HANDLE VARIABLES @@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    /************************* INITIALIZE COMMON VARIABLES *****************/
    // The data from the CSV
    var GLOBAL_CSV_ONLY_DATA = null;
    var GLOBAL_JSON_DATA = null;

    // Will hold the current year selection
    var GLOBAL_TIME_FILTER = null;

    // Will hold the current topic selection
    var GLOBAL_TOPIC_FILTER = null;
    
    // Will parse dates as a year value.
    var parseDate = d3.timeParse("%Y");

    var us_state_abbrev = {
      'Alabama': 'AL',
      'Alaska': 'AK',
      'Arizona': 'AZ',
      'Arkansas': 'AR',
      'California': 'CA',
      'Colorado': 'CO',
      'Connecticut': 'CT',
      'Delaware': 'DE',
      'Florida': 'FL',
      'Georgia': 'GA',
      'Hawaii': 'HI',
      'Idaho': 'ID',
      'Illinois': 'IL',
      'Indiana': 'IN',
      'Iowa': 'IA',
      'Kansas': 'KS',
      'Kentucky': 'KY',
      'Louisiana': 'LA',
      'Maine': 'ME',
      'Maryland': 'MD',
      'Massachusetts': 'MA',
      'Michigan': 'MI',
      'Minnesota': 'MN',
      'Mississippi': 'MS',
      'Missouri': 'MO',
      'Montana': 'MT',
      'Nebraska': 'NE',
      'Nevada': 'NV',
      'New Hampshire': 'NH',
      'New Jersey': 'NJ',
      'New Mexico': 'NM',
      'New York': 'NY',
      'North Carolina': 'NC',
      'North Dakota': 'ND',
      'Ohio': 'OH',
      'Oklahoma': 'OK',
      'Oregon': 'OR',
      'Pennsylvania': 'PA',
      'Rhode Island': 'RI',
      'South Carolina': 'SC',
      'South Dakota': 'SD',
      'Tennessee': 'TN',
      'Texas': 'TX',
      'Utah': 'UT',
      'Vermont': 'VT',
      'Virginia': 'VA',
      'Washington': 'WA',
      'West Virginia': 'WV',
      'Wisconsin': 'WI',
      'Wyoming': 'WY'
    };
      
    var GLOBAL_COLOR_SCALE = d3.scaleQuantile()
      .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);
    GLOBAL_COLOR_SCALE.domain([ 0, 1000]);

    var mapWidth = 1024, mapHeight = 500;

    var mapSVG = d3.select("#wrapper")
      // .classed("svg-container", true) //container class to make it responsive
      // .style("padding-bottom", "35%")
      .append("svg")
      //responsive SVG needs these 2 attributes and no width and height attr
      // .attr("preserveAspectRatio", "xMinYMin meet")
      // .attr("viewBox", "0 0 " + mapWidth * 1.5 + " " + mapHeight * 1.5)
      // // //class to make it responsive
      // .classed("svg-content-responsive", true)
      .attr('id', 'map-svg')
      .attr("width", mapWidth)
      .attr("height", mapHeight);

    // Start of Map Code
    var projection = d3.geoAlbersUsa()
     .translate([mapWidth/2, mapHeight/2])
     .scale([1000]);
    alert("hello");
    // Define path generator
    var path = d3.geoPath().projection(projection);


    /******************* INITIALIZE SLIDER VARIABLES *******************/

     // Dimensions for the SVG image.
    var sliderMargin = {top: 20, right: 40, bottom: 100, left: 170},
        sliderWidth = 590 - sliderMargin.left - sliderMargin.right,
        sliderHeight = 150 - sliderMargin.top - sliderMargin.bottom;
    //Create SVG element

    // Create a scale for the timeline
    var sliderX = d3.scaleTime()
        .rangeRound([0, sliderWidth]);

    // Create the svg element
    var sliderSVG = d3.select("#wrapper")
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .style("padding-bottom", "10%")
        .append("svg")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + sliderWidth * 3 + " " + sliderHeight * 3)
        //class to make it responsive
        .classed("svg-content-responsive", true)
        .attr('id', 'slider-svg')
        
        // .attr("width", sliderWidth + sliderMargin.left + sliderMargin.right)
        // .attr("height", sliderHeight + sliderMargin.top + sliderMargin.bottom)
      .append("g")
        .attr("transform", "translate(" + sliderMargin.left + "," + sliderMargin.top + ")");

    /*********************** INITIALIZE MAP VARIABLES *******************/
    
    /*@@@@@@@@@@@@@@@ LOAD DATA AND INITIAL DRAWING @@@@@@@@@@@@@@@@@@@@@@*/

    
   
    /********************** LOAD THE CSV *************************/
    d3.csv("SuccinctCSV.csv", function(error, data) {
      if (error) throw error;

      // Format the data to change the years to dates.
      data.forEach(function(d, i) {
          d.evyy = parseDate(d.evyy);
          d.rptyy = parseDate(d.rptyy);
          d.year = d.evyy === null ? d.rptyy : d.evyy;

          if (d.year === null) {
            console.log('***************');
            console.log('NULL DATE');
            console.log('index', i);
            console.log('eventid', d.eventid);
            console.log('evyy', d.evyy);
            console.log('rptyy', d.rptyy);
            console.log('year', d.year);
          } else if (d.year.getFullYear() < 1960) {
            console.log('***************');
            console.log('YEAR NOT A DATE');
            console.log('index', i);
            console.log('eventid', d.eventid);
            console.log('evyy', d.evyy);
            console.log('rptyy', d.rptyy);
            console.log('year', d.year);
            // In the mean time set this poorly formatted year to null.
            d.year = null;
          }
          // do I need to include the rest here?
      });

      GLOBAL_CSV_ONLY_DATA = data;


      /**************** CREATE THE TOPIC MENU *******************/
      // generate all the binned claims in csv data
      var topics = d3.nest()
      .key(function (d) { return d.BinnedClaim1; })
      .rollup( function (v) {return v.length })
      .entries(GLOBAL_CSV_ONLY_DATA)

      // drop down menu with  
      topicMenu = d3.select('#wrapper')
      .append('div')
      .attr("class", "topics")
      .append('select')
      .on('change', function(d) { 
        if (this.value == '-- select an option --') {
          GLOBAL_TOPIC_FILTER = null;
        } else {
          GLOBAL_TOPIC_FILTER = this.value;
        }
        updateMap();
      })

      // bind data to menu
      topicMenu.selectAll('option')
      .data(topics)
      .enter()
      .append('option')
      .attr('value',function (d) { return d.key })
      .text(function (d) { return (d.key + " " + d.value)})

      // default selection.
      topicMenu
      .append('option')
      .property("selected", true)
      .text('-- select an option --')

      topicMenu
      .style("margin-left", "170px")
      .style("display", "block")


      /**************** CREATE THE SLIDER ***********************/

      // Set the domain to the year data for the slider.
      // This will set the width and tick marks to go off of the data range.
      // We will be showing all the data by default, so set the first filter
      // to be the full year domain in the data.
      sliderX.domain(d3.extent(data, function(d) { return d.year }));
      GLOBAL_TIME_FILTER = sliderX.domain();

      // Make the tall white tick marks
      sliderSVG.append("g")
          .attr("class", "axis axis--grid")
          .attr("transform", "translate(0," + sliderHeight + ")")
          .call(d3.axisBottom(sliderX)
              .ticks(d3.timeYear)
              .tickSize(-sliderHeight)
              .tickFormat(function() { return null; }))
        .selectAll(".tick")
          .classed("tick--minor", function(d) { return d.getFullYear() % 5; });

      // Draw the year labels
      sliderSVG.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + sliderHeight + ")")
          .call(d3.axisBottom(sliderX)
              .ticks(d3.timeYear.every(5))
              .tickPadding(0))
          .attr("text-anchor", null)
        .selectAll("text")
          .attr("x", 6);


      // Create the glow filter for the selection
      var defs = sliderSVG.append("defs");

      var glow_filter = defs.append("filter")
        .attr("id", "glow-filter")
        //.attr("height", "130%");
        .attr("height", "300%")
        .attr("width", "300%")
        .attr("x", "-75%")
        .attr("y", "-75%");

      glow_filter.append("feMorphology")
        .attr("operator", "dilate")
        .attr("radius", "4")
        .attr("in", "SourceAlpha")
        .attr("result", "thicken");

      glow_filter.append("feGaussianBlur")
        .attr("in", "thicken")
        .attr("stdDeviation", "10")
        .attr("result", "blurred");

      glow_filter.append("feFlood")
        //.attr("flood-color", "rgb(249, 245, 194)")    // softer yellow
        .attr("flood-color", "rgb(249, 249, 139)")      // brighter yellow
        .attr("result", "glowColor");

      glow_filter.append("feComposite")
        .attr("in", "glowColor")
        .attr("in2", "blurred")
        .attr("operator", "in")
        .attr("result", "softGlow_colored");


      // overlay original SourceGraphic over glow by using
      // feMerge filter. Order of specifying inputs is important!
      var glow_feMerge = glow_filter.append("feMerge");

      glow_feMerge.append("feMergeNode")
          .attr("in", "softGlow_colored")
      glow_feMerge.append("feMergeNode")
          .attr("in", "SourceGraphic");


      // Define a brush object along the x axis.
      var brush = d3.brushX()
            .extent([[0, 0], [sliderWidth, sliderHeight]])
            .on("end", brushended);

      // Draw the brush, and have the full range brushed at first to
      // show the full span of years in the dataset. Also set the cursor
      // to default for the selection since you can't move it.
      var time_brush = sliderSVG.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, sliderX.range());
        d3.selectAll(".selection").attr("cursor", getBrushSelectionCursor);
  

 

      /****************** LOAD AND DECORATE GEOJSON DATA ***************/
      // BinnedClaimCountTwo --> {state: (year, binnedClaim, FullClaim etc)}
      // (another asynch call)
      d3.json("us-states.json", function(error, json) {

        /**************** CREATE THE MAP *************************/
      
       
        // Define quantize scale to sort data values into buckets of color
        // GLOBAL_COLOR_SCALEs taken from GLOBAL_COLOR_SCALEbrewer.js, included in the D3 download
        
        // go through data and group by value for each state if that value was in the clicked claim list
        var BinnedClaimTwo = d3.nest()
          .key(function(d) { return d.StateAbbreviation; }) // {claim1 : subdivClaim1: Yes No }
          .rollup(function(v) { return v; })
          .entries(data);
        
        // Merge the ag. data and GeoJSON
        // Loop through once for each ag. data value
        for (var i = 0; i < BinnedClaimTwo.length; i++) {
          // Grab cumalative number of protests for the state 
          
          var dataValue = BinnedClaimTwo[i].value;
          var state = BinnedClaimTwo[i].key;
          // Find the corresponding state inside the GeoJSON
          for (var j = 0; j < json.features.length; j++) {

            var jsonState = us_state_abbrev[json.features[j].properties.name]; // convert the name to an abbreviated version

            if (state == jsonState) {
              json.features[j].properties.fullName = json.features[j].properties.name;
              json.features[j].properties.name = jsonState;
              json.features[j].properties.dictionary = dataValue

              
              // Stop looking through the JSON
              break;
            }
          }   
        }

        GLOBAL_JSON_DATA = json;
        console.log(GLOBAL_JSON_DATA);
        constructMap(); 
      });
    });




    /*@@@@@@@@@@@@@@@@@@@@@@@ HELPER FUNCTIONS @@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    /************************** COMMON HELPER FUNCTIONS *********************/
    // Returns true if the given eventYear Date object is within the current year filter
    // otherwise returns false.
    function inYearFilter(eventYear) {
      if (eventYear === null) return false;

      if(typeof eventYear.getFullYear === 'function') {
    	  return eventYear.getFullYear() >= GLOBAL_TIME_FILTER[0].getFullYear() && 
          eventYear.getFullYear() < GLOBAL_TIME_FILTER[1].getFullYear();
      } else {
    	  var year = parseFloat(eventYear.substring(0,4));
    	  return year >= GLOBAL_TIME_FILTER[0].getFullYear() && year < GLOBAL_TIME_FILTER[1].getFullYear();
      }
      
    }

    function inTopicFilter(topicTitle) {
      return GLOBAL_TOPIC_FILTER === null || GLOBAL_TOPIC_FILTER == topicTitle;
    }

    /************************** SLIDER HELPER FUNCTIONS *********************/

    // Determine which cursor to display on the brush selection, default or move.
    function getBrushSelectionCursor() {
      // If the entire span is brushed, set the cursor to default
      if (fullSpanIsBrushed()) {
        return "default";
      // Otherwise set it to move.
      } else {
        return "move";
      }
    }

    // Returns whether the full year span is brushed.
    function fullSpanIsBrushed() {
      return GLOBAL_TIME_FILTER[0].getFullYear() == sliderX.domain()[0].getFullYear() &&
          GLOBAL_TIME_FILTER[1].getFullYear() == sliderX.domain()[1].getFullYear();
    }

    // Returns whether only part of the year span is brushed.
    function partialSpanIsBrushed() {
      return !fullSpanIsBrushed();
    }


    // Update brush span upon drag or reselect.
    function brushended() {
      if (!d3.event.sourceEvent) return; // Only transition after input.

      // Empty selections should just rebrush the entire year span,
      // and reset the filter to the entire domain.
      var newFilter = sliderX.domain();
      var spanToBrush = sliderX.range();

      // If we did have a selection, reset the span to brush to this smaller selection.
      if (d3.event.selection) {
        var d0 = d3.event.selection.map(sliderX.invert),
            d1 = d0.map(d3.timeYear.round);

        // If empty when rounded, use floor & ceil instead.
        if (d1[0] >= d1[1]) {
          d1[0] = d3.timeYear.floor(d0[0]);
          d1[1] = d3.timeYear.offset(d1[0]);
        }

        // Set the new time filter to this new selection,
        // and update the span to brush.
        newFilter = d1;
        spanToBrush = d1.map(sliderX);
      }

      // Brush the axis to the selection
      // Update the global time filter
      // Update the class of the brush to remove the move cursor and glow if
      //  the entire span is brushed.
      d3.select(this).transition().call(d3.event.target.move, spanToBrush);
      GLOBAL_TIME_FILTER = newFilter;
      console.log('new filter', GLOBAL_TIME_FILTER);
      d3.selectAll(".selection").attr("cursor", getBrushSelectionCursor)
          .classed("move-enabled", partialSpanIsBrushed);

	    updateMap();
      // Update the data
    }

    /******************* MAP HELPER FUNCTIONS ************************/
    // If mouse hovers over a state then highlight it
    function handleMouseOver(d, i) {  // Add interactivity
      d3.select(this)
        .style("fill","rgb(0,125,255)");
      
      // Specify where to put label of text
      mapSVG.append("text")
        .attr("class", "stateID")
        .attr("transform", function(d) { return "translate(900, 275)"; })
        .style("font-family", "calibri")
        .text(function() {
          return d.properties.fullName;
        });

      mapSVG.append("text")
        .attr("class", "stateID")
        .attr("transform", function(d) { return "translate(900, 300)"; })
        .style("font-family", "calibri")
        .text(function() {
        	var length = d.properties.dictionary.length;
            var out = "Total Protests:" + length;
            return out;  // Value of the text
        });
    }

    function handleMouseOut(d,i) {
    	var length;
	   	length = d.properties.dictionary.length;
	    d3.select(this).style("fill", GLOBAL_COLOR_SCALE(Math.log(length + 1) + ""));
	    mapSVG.selectAll(".stateID").remove();
    	
    }
    
    // Updates the map to reflect the current global filters
    function updateMap() {

      // need to update the GLOBAL_COLOR_SCALE method
      console.log("UpdateMap Called");

      var COPY_GLOBAL_DATA = JSON.parse(JSON.stringify(GLOBAL_JSON_DATA));

      minValue = 1000;
      maxValue = -1000;

      var newData = COPY_GLOBAL_DATA.features.filter(function(d) {
        if(d.properties.dictionary) {
        	var filteredDict = d.properties.dictionary.filter( 
            function(element) {
              return inYearFilter(element.evyy) && inTopicFilter(element.BinnedClaim1);
            }
          );
      	  d.properties.dictionary = filteredDict;
          maxValue = Math.max(maxValue,d.properties.dictionary.length);
          minValue = Math.min(minValue,d.properties.dictionary.length);
          return d; 
        }
      }); 


      updateColorAndLegend(minValue,maxValue);

      var updatedData = mapSVG.selectAll("path") // update
        .data(newData);

        updatedData
        .exit()
        .transition()
        .duration(1000)
        .remove();

        updatedData
        .enter()
        .append("path")
        .attr("d", path)
        .merge(updatedData)
        .on("mouseover",handleMouseOver)
        .on("mouseout", handleMouseOut)
        
        .style("stroke", "white")
        .transition()
        .duration(1000)
        .style("fill", function(d) {
          //Get data value
          var value = Math.log(d.properties.dictionary.length + 1);
          if (value || value == 0) {
              //If value exists…

              return GLOBAL_COLOR_SCALE(value);
          } else {
              //If value is undefined…
              return "#ccc";
          }
        })

      // append text to 
      // mapSVG.selectAll("text")
      // .data(newData)
      // .enter()
      // .append("svg:text")
      // .text(function(d){ return d.properties.name; })
      // .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
      // .attr("text-anchor","middle")
      // .attr('font-size','6pt')
      // .attr('fill', 'white')
      // console.log("text");
    };

    function constructMap() {
      updateColorAndLegend(7,5228);
      var COPY_GLOBAL_DATA = JSON.parse(JSON.stringify(GLOBAL_JSON_DATA));
      // 52 states
      var newData = COPY_GLOBAL_DATA.features.filter(function(d) {
        if(d.properties.dictionary) {
          // dictionary: array of claims.
           var filteredDict = d.properties.dictionary.filter( 
              function(element) {
                return inYearFilter(element.evyy) && inTopicFilter(element.BinnedClaim1);
              }
            );
            d.properties.dictionary = filteredDict;
            return d; 
        }
      }); 
      var updatedData = mapSVG.selectAll("path") // update
      .data(newData);

      updatedData
      .exit()
      .transition()
      .duration(500)
      .remove();

      updatedData
      .enter()
      .append("path")
      .attr("d", path)
      // .merge(updatedData)
      .on("mouseover",handleMouseOver)
      .on("mouseout", handleMouseOut)
      
      .style("stroke", "white")
      .style("fill", function(d) {
        //Get data value
        var value = Math.log(d.properties.dictionary.length + 1);
        if (value || value == 0) {
            //If value exists…
            return GLOBAL_COLOR_SCALE(value);
        } else {
            //If value is undefined…
            return "#ccc";
        }
      })
    }

    // this function updates color scale and legend
    function updateColorAndLegend(minValue,maxValue) {
      console.log(Math.log(minValue + 1))
      console.log(Math.log(maxValue + 1))
      // minValue = 0
      // maxValue = 5227
      GLOBAL_COLOR_SCALE = d3.scaleQuantile()
      .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);
      GLOBAL_COLOR_SCALE.domain([ Math.log(minValue + 1), Math.log(maxValue + 1)]);

      var transformedColorScale = d3.scaleQuantile()
      .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);
      transformedColorScale.domain([minValue, maxValue]);

      var legend = d3.legendColor()
      .labelFormat(d3.format(",.0f"))
      .cells(10)
      .scale(transformedColorScale);
      // http://bl.ocks.org/syntagmatic/29bccce80df0f253c97e
      var mapSvg = d3.select("#wrapper").select("#map-svg")
      mapSvg.select(".legendHeader").remove();
      mapSvg.append("text")
        .attr("transform", "translate(900,390)")
        .attr("class", "legendHeader")
        .text("Number of Protests")
        .style("font-weight", "bold")
        .style("font-family", "calibri")
      mapSvg.append("g")
        .attr("class", "legendQuant")
        .attr("transform", "translate(900,400)");

      mapSvg.select(".legendQuant")
        .call(legend);
    }

