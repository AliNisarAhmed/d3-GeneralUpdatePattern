import * as d3 from "d3";

const svg = d3.select("svg");

// let data = [{ name: "Milk", price: 3 }];

// CONSTANTS
const verticalSpacing = 60;
const width = +svg.attr("width");
const margin = { top: 20, left: 100, right: 20, bottom: 20 };
const innerWidth = width - margin.left - margin.right;

// Accessor functions
const textValue = d => `${d.name}: $${d.price}`;
const xValue = d => d.price;
const yValue = d => d.name;

//SCALES
const xScale = d3.scaleLinear().range([0, innerWidth]);
const yScale = d3
  .scaleBand()
  .paddingInner(0.1)
  .paddingOuter(0.05);

function render(selection, data) {
  // sorting the array from highest amount to lowest
  data.sort((a, b) => d3.descending(xValue(a), xValue(b)));

  xScale.domain([0, d3.max(data, xValue)]);
  yScale.domain(data.map(yValue)).range([0, verticalSpacing * data.length]);

  let g = selection.selectAll("g").data([null]);
  g.enter()
    .append("g")
    .merge(g)
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const groups = g.selectAll("g").data(data, yValue); // second argument to data() is key, used to identify unique elements in the array. here we use yValue to generate unique strings of item name as keys
  groups.exit().remove();
  const groupsEnter = groups
    .enter()
    .append("g")
    .attr("transform", d => `translate(0, ${yScale(yValue(d))})`);

  groupsEnter
    .merge(groups)
    .transition()
    .duration(200)
    .attr("transform", d => `translate(0, ${yScale(yValue(d))})`);

  let rects = groupsEnter
    .append("rect") // appending a rect on enter select. of g
    .merge(groups.select("rect")) // merges the rect g with rects which were already there on groups
    .attr("width", d => xScale(xValue(d)))
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue");

  // Two text elements for effects

  let textBackground = groupsEnter
    .append("text")
    .attr("class", "background") // using classes allows us to select both text elements individually each time, otherwise, only the first one was being selected
    .merge(groups.select(".background"))
    .attr("font-size", "2em")
    .attr("y", yScale.bandwidth() / 2)
    .attr("dy", "0.32em")
    .attr("x", 10)
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 5)
    .attr("stroke-linejoin", "round")
    .text(textValue);

  let textForeground = groupsEnter
    .append("text")
    .attr("class", "foreground")
    .merge(groups.select(".foreground"))
    .attr("font-size", "2em")
    .attr("y", yScale.bandwidth() / 2)
    .attr("dy", "0.32em")
    .attr("x", 10)
    .text(textValue);
}

d3.json("../data/data.json").then(data => {
  data.forEach((list, i) => {
    setTimeout(() => {
      render(svg, list);
    }, i * 1000);
  });
});
