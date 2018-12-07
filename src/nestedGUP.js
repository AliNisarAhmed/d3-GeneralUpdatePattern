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
  xScale.domain([0, d3.max(data, xValue)]);
  yScale.domain(data.map(yValue)).range([0, verticalSpacing * data.length]);

  let g = selection.selectAll("g").data([null]);
  g.enter()
    .append("g")
    .merge(g)
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // to remove duplicated logic, we create separate g for each data point, transform each with same x and y
  // & then attach rects and text to this group

  const groups = g.selectAll("g").data(data);
  groups.exit().remove();
  const groupsEnter = groups.enter().append("g");
  groupsEnter
    .merge(groups)
    .attr("transform", d => `translate(0, ${yScale(yValue(d))})`);

  // we can also write the above as
  // groups
  //   .merge(groupsEnter)
  //     .attr(...)

  // rectsUpdateSelect.exit().remove();

  // Below is the 'nested' version of the GUP
  // each react & text is nseted inside a g, which is nested inside an encompassing g

  let rects = groupsEnter
    .append("rect") // appending a rect on enter select. of g
    .merge(groups.select("rect")) // merges the rect g with rects which were already there on groups
    .attr("width", d => xScale(xValue(d)))
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue");

  let texts = groupsEnter
    .append("text")
    .merge(groups.select("text"))
    .attr("font-size", "2em")
    .attr("y", yScale.bandwidth() / 2) // scale,badwidth returns the width of each band
    .attr("dy", "0.32em")
    .attr("x", 10)
    .text(textValue);
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
