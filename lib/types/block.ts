export type Literal =
  | { type: "number"; value: number }
  | { type: "boolean"; value: boolean };

export type List = Literal[];

export enum BlockType {
  Input = "inputBlock",
  Output = "outputBlock",
  ReturnLiteral = "returnLiteralBlock",
  Min = "minBlock",
  Max = "maxBlock",
  Sum = "sumBlock",
  Count = "countBlock",
  InfixOperator = "infixOperatorBlock",
  PrefixOperator = "prefixOperatorBlock",
}

export const UnknownBlockError = new Error("Unknown block type");
export const InvalidBlockError = new Error("Invalid block object");

export abstract class Block {
  name: BlockType;
  constructor(name: BlockType) {
    this.name = name;
  }

  public static stringify(block: Block): string {
    return JSON.stringify(block);
  }

  public static parse(input: string): Block {
    const obj = JSON.parse(input);
    return this.parseObject(obj);
  }

  private static parseObject(obj: any): any {
    if (!obj) {
      throw InvalidBlockError;
    }

    if (!obj.name || typeof obj.name !== "string") {
      throw InvalidBlockError;
    }

    switch (obj.name as BlockType) {
      case BlockType.Input:
        if (!obj.value || !Array.isArray(obj.value)) {
          throw InvalidBlockError;
        }
        return new InputBlock(obj.value);
      case BlockType.Output:
        const block = this.parseObject(obj.block);
        if (block instanceof Block) {
          return new OutputBlock(block);
        }
        throw InvalidBlockError;
      case BlockType.ReturnLiteral:
        if (!obj.literal) {
          throw InvalidBlockError;
        }
        return new ReturnLiteralBlock(obj.literal);
      case BlockType.Min:
        const minList = this.parseObject(obj.listBlock);
        if (minList instanceof ListBlock) {
          return new MinBlock(minList);
        }
        throw InvalidBlockError;
      case BlockType.Max:
        const maxList = this.parseObject(obj.listBlock);
        if (minList instanceof ListBlock) {
          return new MaxBlock(minList);
        }
        throw InvalidBlockError;
      case BlockType.Sum:
        const sumList = this.parseObject(obj.listBlock);
        if (minList instanceof ListBlock) {
          return new SumBlock(minList);
        }
        throw InvalidBlockError;
      case BlockType.Count:
        const countList = this.parseObject(obj.listBlock);
        if (countList instanceof ListBlock) {
          return new CountBlock(countList);
        }
        throw InvalidBlockError;
      case BlockType.InfixOperator:
        const left = this.parseObject(obj.left);
        const right = this.parseObject(obj.right);
        if (
          left instanceof LiteralBlock &&
          right instanceof LiteralBlock &&
          obj.operator
        ) {
          return new InfixOperatorBlock(left, obj.operator, right);
        }
        throw InvalidBlockError;
      case BlockType.PrefixOperator:
        const rightPrefix = this.parseObject(obj.right);
        if (rightPrefix instanceof LiteralBlock && obj.operator) {
          return new PrefixOperatorBlock(obj.operator, rightPrefix);
        }
        throw InvalidBlockError;
      default:
        throw UnknownBlockError;
    }
  }

  // TODO: Dec-48 please implement this function
  public static evaluate(block: Block): any {}
}

export abstract class LiteralBlock extends Block {}
export abstract class ListBlock extends Block {}

// InputBlock = class
// List = input
// ListBlock = output
export class InputBlock extends ListBlock {
  value: List;

  constructor(value: List) {
    super(BlockType.Input);
    this.value = value;
  }
}

export class OutputBlock extends Block {
  block: Block;

  constructor(block: Block) {
    super(BlockType.Output);
    this.block = block;
  }
}

export class ReturnLiteralBlock extends LiteralBlock {
  literal: Literal;

  constructor(literal: Literal) {
    super(BlockType.ReturnLiteral);
    this.literal = literal;
  }
}

export class MinBlock extends LiteralBlock {
  listBlock: ListBlock;

  constructor(listBlock: ListBlock) {
    super(BlockType.Min);
    this.listBlock = listBlock;
  }
}

export class MaxBlock extends LiteralBlock {
  listBlock: ListBlock;

  constructor(listBlock: ListBlock) {
    super(BlockType.Max);
    this.listBlock = listBlock;
  }
}

export class SumBlock extends LiteralBlock {
  listBlock: ListBlock;

  constructor(listBlock: ListBlock) {
    super(BlockType.Sum);
    this.listBlock = listBlock;
  }
}

export class CountBlock extends LiteralBlock {
  listBlock: ListBlock;

  constructor(listBlock: ListBlock) {
    super(BlockType.Count);
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
    left: LiteralBlock,
    operator: InfixOperator,
    right: LiteralBlock,
  ) {
    super(BlockType.InfixOperator);
    this.left = left;
    this.right = right;
    this.operator = operator;
  }
}

export class PrefixOperatorBlock extends LiteralBlock {
  operator: PrefixOperator;
  right: LiteralBlock;

  constructor(operator: PrefixOperator, right: LiteralBlock) {
    super(BlockType.PrefixOperator);
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
