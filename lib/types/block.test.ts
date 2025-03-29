import { Block, InputBlock, MinBlock, OutputBlock } from "./block";

const node = new OutputBlock(new MinBlock(new InputBlock()));

console.log("node: ", node);

const json = Block.stringify(node);
console.log("json: ", json);

const parsedNode = Block.parse(json);
console.log("parsedNode: ", parsedNode);
