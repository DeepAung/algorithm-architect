export type Literal =
  | { type: "number"; value: number }
  | { type: "boolean"; value: boolean };

export type List = Literal[];

export const UnknownBlockError = new Error("Unknown block type");

export abstract class Block {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  static stringify(block: Block): string {
    return JSON.stringify(block);
  }

  static parse(input: string): Block {
    const obj = JSON.parse(input);
    switch (obj.name) {
      case "inputBlock":
        return new InputBlock(obj.name, obj.value);
      case "outputBlock":
        return new OutputBlock(obj.name, obj.block);
      case "minBlock":
        return new MinBlock(obj.name, obj.list);
      case "maxBlock":
        return new MaxBlock(obj.name, obj.list);
      default:
        throw UnknownBlockError;
    }
  }

  // TODO: Dec-48 please implement this function
  static evaluate(block: Block): any {}
}

export abstract class LiteralBlock extends Block {}
export abstract class ListBlock extends Block {}

// InputBlock = class
// List = input
// ListBlock = output
export class InputBlock extends ListBlock {
  value: List;

  constructor(name: "inputBlock", value: List) {
    super(name);
    this.value = value;
  }
}

export class OutputBlock extends Block {
  block: Block;

  constructor(name: "outputBlock", block: Block) {
    super(name);
    this.block = block;
  }
}

export class ReturnLiteralBlock extends LiteralBlock {
  literal: Literal;

  constructor(name: "returnLiteralBlock", literal: Literal) {
    super(name);
    this.literal = literal;
  }
}

export class MinBlock extends LiteralBlock {
  listBlock: ListBlock;

  constructor(name: "minBlock", listBlock: ListBlock) {
    super(name);
    this.listBlock = listBlock;
  }
}

export class MaxBlock extends LiteralBlock {
  listBlock: ListBlock;

  constructor(name: "minBlock", listBlock: ListBlock) {
    super(name);
    this.listBlock = listBlock;
  }
}

export class SumBlock extends LiteralBlock {
  listBlock: ListBlock;

  constructor(name: "sumBlock", listBlock: ListBlock) {
    super(name);
    this.listBlock = listBlock;
  }
}

export class CountBlock extends LiteralBlock {
  listBlock: ListBlock;

  constructor(name: "countBlock", listBlock: ListBlock) {
    super(name);
    this.listBlock = listBlock;
  }
}

export type InfixOperator =
  | "+"
  | "-"
  | "*"
  | "//"
  | "%"
  | "^"
  | "&&"
  | "||"
  | "=="
  | "!="
  | "<"
  | "<="
  | ">"
  | ">=";

export type PrefixOperator = "!" | "-";

export class InfixOperatorBlock extends LiteralBlock {
  left: LiteralBlock;
  operator: InfixOperator;
  right: LiteralBlock;

  constructor(
    name: "infixOperatorBlock",
    left: LiteralBlock,
    operator: InfixOperator,
    right: LiteralBlock,
  ) {
    super(name);
    this.left = left;
    this.right = right;
    this.operator = operator;
  }
}

export class PrefixOperatorBlock extends LiteralBlock {
  operator: PrefixOperator;
  right: LiteralBlock;

  constructor(
    name: "prefixOperatorBlock",
    operator: PrefixOperator,
    right: LiteralBlock,
  ) {
    super(name);
    this.right = right;
    this.operator = operator;
  }
}

// will do this later on
// export class AverageBlock extends LiteralBlock {}
// export class MedianBlock extends LiteralBlock {}
// export class MapBlock extends LiteralBlock {}
// export class FilterBlock extends LiteralBlock {}
// export class ReduceBlock extends LiteralBlock {}
