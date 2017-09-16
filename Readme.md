# unist-find-node
Find the nearest MDAST node matching the position (inline nodes excluded).

## Install
npm:
```
npm i --save unist-find-node
```

## Usage 
See the following example as `Example.md`:
```markdown
# hello, This is Markdown 
... any other texts
```

```js
let vfile = require("to-vfile");
let unified = require("unified");
let parse = require("remark-parse");
let findNode = require("./index.js");


let assert = require("assert");

let tree = unified()
  .use(parse)
  .parse("Example.md");
let child = findNode(tree, { line: 1, column: 1 });
```

Then the child is the first heading node which would be intercepted as
``` js 
let inspect = require("unist-util-inspect");
console.log(inspect(child));
// heading[1] (1:1-1:27, 0-26) [depth=1]
//   -- text: "hello, This is Markdown" (1:3-1:26, 2-25)
```

## API
``` js
  child = findNode(node, position)
```
* `node`: the AST node parsed by `unist`
* `position`: `{line, column}` an object with `line` and `column` property
