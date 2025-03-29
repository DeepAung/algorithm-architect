import { Block, InputBlock, MinBlock, OutputBlock } from "./block";

const node = new OutputBlock(
  "outputBlock",
  new MinBlock(
    "minBlock",
    new InputBlock("inputBlock", [
      { type: "number", value: 1 },
      { type: "number", value: 2 },
      { type: "number", value: 3 },
    ]),
  ),
);

console.log("node: ", node);

const json = Block.stringify(node);
console.log("json: ", json);

const parsedNode = Block.parse(json);
console.log("parsedNode: ", parsedNode);
