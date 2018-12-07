import * as d3 from "d3";

const svg = d3.select("svg");

let data = [{ name: "Milk", price: 3 }];

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
  xScale.domain([0, d3.max(data, xValue)]);
  yScale.domain(data.map(yValue)).range([0, verticalSpacing * data.length]);

  // appending a 'g' element to selection so that rects and text can move together
  // const g = selection
  //   .append("g")
  //   .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // The above code produces 5 'g's coz it appends a 'g' for every render invocation

  // we need to use 'single-element trick' by using a fake data join to 'enter' and 'update'
  // the same 'g' on every render invocation

  let g = selection.selectAll("g").data([null]);
  g.enter()
    .append("g")
    .merge(g)
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  let rectsUpdateSelect = g.selectAll("rect").data(data);
  let updateSelection = g.selectAll("text").data(data);

  rectsUpdateSelect.exit().remove();

  rectsUpdateSelect
    .enter()
    .append("rect")
    .merge(rectsUpdateSelect)
    .attr("x", 0)
    .attr("y", d => yScale(yValue(d)))
    .attr("width", d => xScale(xValue(d)))
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue");

  let enterSelect = updateSelection
    .enter()
    .append("text")
    .merge(updateSelection)
    .attr("font-size", "2em")
    .attr("y", d => yScale(yValue(d)) + yScale.bandwidth() / 2) // scale,badwidth returns the width of each band
    .attr("dy", "0.32em")
    .attr("x", 10)
    .text(textValue);

  let exitSelect = updateSelection.exit();
  exitSelect.remove();
}

render(svg, [{ name: "Milk", price: 3 }]);

setTimeout(() => {
  render(svg, [{ name: "Milk", price: 3 }, { name: "Eggs", price: 20 }]);
}, 1000);

setTimeout(() => {
  render(svg, [{ name: "Milk", price: 3 }, { name: "Eggs", price: 2 }]);
}, 2000);

setTimeout(() => {
  render(svg, [
    { name: "Milk", price: 3 },
    { name: "Eggs", price: 2 },
    { name: "Cupcakes", price: 5 }
  ]);
}, 3000);

setTimeout(() => {
  render(svg, [{ name: "Milk", price: 3 }, { name: "Eggs", price: 2 }]);
}, 4000);
