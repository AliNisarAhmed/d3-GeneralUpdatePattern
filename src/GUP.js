import { select } from "d3";

const svg = select("svg");

let data = [{ name: "Milk", price: 3 }];

// CONSTANTS
const textValue = d => `${d.name}: $${d.price}`;
const verticalSpacing = 40;
//

function render(selection, data) {
  let updateSelection = selection.selectAll("text").data(data);

  updateSelection.text(textValue); // setting text on update selection, modified data elements

  let enterSelect = updateSelection
    .enter()
    .append("text")
    .attr("font-size", "2em")
    .attr("y", (d, i) => 50 + verticalSpacing * i)
    .attr("x", 100)
    .text(textValue); // setting text on newly appended elements "The enter selection"

  let exitSelect = updateSelection.exit(); // calling .exit() on update selection gets us the "exit" selection
  // the elements that are abt to be removed
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
