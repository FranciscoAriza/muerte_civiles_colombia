var width = 640,
    height = 500,
    margin = {top: 20, right: 20, bottom: 20, left: 60},
    svg3 = d3.select("#scatter")
            .append("svg")
            .attr("id", "scatter1")
            .attr("width", width)
            .attr("height", height),    
    g3 = svg3.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
    widthScale = d3.scaleLinear().range([0,width - margin.left -margin.right]),
    heightScale = d3.scaleLinear().range([height -margin.top - margin.bottom-60,0]),
    colorScale = d3.scaleOrdinal(d3.schemeCategory20)
    r = 6;

d3.csv("static/data/scatter.csv", function(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    return d;
},

function(error, data){
    if (error) throw error;

    var keys = data.columns.slice(1);
    console.log(keys);    

    widthScale.domain([0, d3.max(data, function(d) { return d.Civiles; })]).nice();
    heightScale.domain([0, d3.max(data, function(d) { return d.Combatiente; })]).nice();
    
    var tooltip3 = d3.select("#scatter").append("div")
      .attr("class", "toolTip")
      .style("display", "none");


    var tipMouseover3 = function(d){
        tooltip3
            .style("left", d3.event.pageX + 50 + "px")
            .style("top", d3.event.pageY - 50 +  "px")
            .style("display", "inline-block")
            .html("<strong>Tipo de Hecho:</strong> " + d.Tipo_Hecho +"<br>" +
                    "<strong>#Muertes civíles:</strong> " + d3.format(",d")(d.Civiles) +"<br>" +                    
                    "<strong>#Muertes combatientes:</strong> " + d3.format(",d")(d.Combatiente));
    };
        
    var tipMouseout3 = function(d) {
        tooltip3.style("display", "none");
    };

    
    var ps = g3.selectAll("circle")
        .data(data);

    var psEnter =  ps.enter()
        .append("circle")
    .attr("class", "elemento")
        .attr("r", r)
        .attr("cx",0)
        .attr("cy",heightScale(d3.min(data, function(d) { return d.Combatiente; })));

    ps.merge(psEnter)
        .attr("cy", function (d) {return heightScale(d.Combatiente); })
        .style("fill", function (d,i) { return colorScale(i); })
        .attr("cx", function (d) { return widthScale(d.Civiles); })
        .on("mousemove", tipMouseover3)
        .on("mouseout", tipMouseout3);

    g3.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - margin.top - margin.bottom )+ ")")    
        .call(d3.axisBottom(widthScale).ticks(null, "s"))
    .append("text")
        .attr("class", "axis_label")
        .attr("transform", "translate(" + (width - margin.left - margin.right -80) + ",50)")            
        .attr("text-anchor","end")
        .text("#Civiles Muertos");        

    g3.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,0)")    
        .call(d3.axisLeft(heightScale).ticks(null, "s"))
    .append("text")
        .attr("class", "axis_label")
        .attr("transform", "translate(-45,100) rotate(-90)")
        .text("#Combatientes muertos")        
        .attr("text-anchor","end")
});