"use strict";

let vfile = require("to-vfile");
let unified = require("unified");
let parse = require("remark-parse");
let assert = require("assert");
// let inspect = require("unist-util-inspect");

let findNode = require("./index.js");

let file = vfile.readSync("example.md");
let tree = unified()
  .use(parse)
  .parse(file);

describe("headings and thematic break", () => {
  it("Doing Test", () => {
    let child = findNode(tree, { line: 1, column: 1 });
    assert(child === tree.children[0]);
    child = findNode(tree, { line: 3, column: 1 });
    assert(child === tree.children[1]);
    child = findNode(tree, { line: 10, column: 4 });
    assert(child.type === "heading" && child.children[0].value === "List");
  });
});

describe("List and ListItem", () => {
  it("ListItem", () => {
    let child = findNode(tree, { line: 11, column: 2 });
    assert(child.type === "listItem");
    child = findNode(tree, { line: 12, column: 5 });
    assert(child.type === "listItem" && child.checked === true);
    child = findNode(tree, { line: 34, column: 5 });
    assert(child.type === "listItem");
    child = findNode(tree, { line: 36, column: 5 });
    assert(child.type === "listItem");
  });

  it("list", () => {
    let child = findNode(tree, { line: 12, column: 100 });
    assert(child.type === "list" && child.ordered === true);
    // console.log(inspect(tree));
    child = findNode(tree, { line: 36, column: 100 });
    assert(child.type === "list");
  });
});

describe("table", () => {
  it("tableRow", () => {
    let child = findNode(tree, { line: 16, column: 1 });
    assert(child.type === "tableRow");
  });
  it("table", () => {
    let child = findNode(tree, { line: 17, column: 2 });
    assert(child.type === "table");
  });
  it("tableCell", () => {
    let child = findNode(tree, { line: 16, column: 4 });
    assert(child.type === "tableCell");
  });
});

// console.log(inspect(tree));
