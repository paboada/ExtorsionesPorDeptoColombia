/* global d3 */
function maneja_datos() {
  limpiar_dom();
  
  var colors = [
    "red",
    "blue",
    "yellow",
    "black",
    "green",
    "purple",
    "brown",
    "GreenYellow",
    "DARKSALMON",
    "MEDIUMVIOLETRED",
    "TOMATO",
    "DARKORANGE",
    "MAGENTA",
    "CHARTREUSE",
    "MEDIUMSEAGREEN"
  ];
  
  colors.forEach(function(color, index) {
    var box = document.getElementById('cbox' + (index + 1).toString());
    if (box.checked) {
      dibujar_datos(box.value, color);    
    }
  });
}

function limpiar_dom() {
  d3.selectAll(".city").remove();
  d3.selectAll("g").remove();
}

function dibujar_datos(nombre, color) {   
  var svg = d3.select("svg"),
    margin = {top: 20, right: 120, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var parseTime = d3.timeParse("%Y%m");

  var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

  var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temperature); });

  var ext = ".tsv";
  var ruta = "Datos/";
  var nombre_archivo = ruta.concat(nombre).concat(ext);

  d3.tsv(nombre_archivo, type, function(error, data) {
    if (error) throw error;

    var cities = data.columns.slice(1).map(function(id) {
      return {
        id: id,
        values: data.map(function(d) {
          return {date: d.date, temperature: d[id]};
        })
      };
    });

    //dominio para ver por mes
    x.domain([new Date(2012, 0, 1), new Date(2016, 12, 31)]).range([0, width]);
    y.domain([0,110]);
    z.domain(cities.map(function(c) { return c.id; }));

    //crea elementos para g
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Numero_Extorsiones, N");

    var city = g.selectAll(".city")
      .data(cities)
      .enter().append("g")
      .attr("class", "city");

    city.append("path")
      .attr("class", "line")
      .attr("stroke",color)
      .attr("d", function(d) { return line(d.values); })
    ;

    city.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });    
  });

  function type(d, _, columns) {
    d.date = parseTime(d.date);
    for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
    return d;
  }
}

function seleccionar_todos() {
  d3.selectAll("input").property('checked', true);
}

function ninguno() {
  d3.selectAll("input").property('checked', false);
}
