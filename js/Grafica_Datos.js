/* global d3 */
function maneja_datos(){
   
  if (document.getElementById('cbox1').checked)
  {
    var color = "red";
    var texto = document.getElementById('cbox1').value;
    dibujar_datos(texto,color);    
  }
  if (document.getElementById('cbox2').checked)
  {
    var color = "blue";
    var texto = document.getElementById('cbox2').value;
    dibujar_datos(texto,color);   
    
  }
  if (document.getElementById('cbox3').checked)
  {
      var color = "yellow";
    var texto = document.getElementById('cbox3').value;
    dibujar_datos(texto,color);    
  }
  if (document.getElementById('cbox4').checked)
  {
        var color = "black";
    var texto = document.getElementById('cbox4').value;
   dibujar_datos(texto,color);     
  }
  if (document.getElementById('cbox5').checked)
  {
      var color = "green";
    var texto = document.getElementById('cbox5').value;
    dibujar_datos(texto,color);   
  }
  if (document.getElementById('cbox6').checked)
  {
    var color = "purple";
    var texto = document.getElementById('cbox6').value;
    dibujar_datos(texto,color);    
  }
  if (document.getElementById('cbox7').checked)
  {
      var color = "brown";
    var texto = document.getElementById('cbox7').value;
    dibujar_datos(texto,color);      
  }
  if (document.getElementById('cbox8').checked)
  {
      var color = "GreenYellow";
    var texto = document.getElementById('cbox8').value;
    dibujar_datos(texto,color);     
  }
  //alert('Conoce ' + cant + ' lenguajes ' + texto);
}


function dibujar_datos(nombre,color){   


var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
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
    .y(function(d) { return y(d.temperature); })
    ;


var ext = ".tsv";
var ruta = "Datos/";
//var nombre = "data_cundinamarca";
var nombre_archivo = ruta.concat(nombre).concat(ext);

//var nombre_archivo = ruta.concat("data_cundinamarca.tsv");*/
        
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

  /*y.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
  ]);*/

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
      
//crea elementos para city
//enter
  var city = g.selectAll(".city")
              .data(cities)
              .enter().append("g")
              .attr("class", "city");
      
//colors = d3.scale.category20();
    city.append("path")
      .attr("class", "line")
      .attr("stroke",color)
      //.attr("stroke",function(d){return color(d) )
      .attr("d", function(d) { return line(d.values); })
      //.attr("stroke", function(d) { return z(d.id); })
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