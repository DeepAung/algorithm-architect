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
  id: string;
  name: BlockType;

  constructor(name: BlockType) {
    this.id = crypto.randomUUID();
    this.name = name;
  }

  public abstract clone(): Block;

  public static stringify(block: Block): string {
    return JSON.stringify(block);
  }

  public static parse(input: string): Block {
    const obj = JSON.parse(input);
    return this.parseObject(obj) || {};
  }

  private static parseObject(obj: any): any {
    if (!obj) {
      return null;
    }

    if (!obj.name || typeof obj.name !== "string") {
      throw InvalidBlockError;
    }

    switch (obj.name as BlockType) {
      case BlockType.Input:
        return new InputBlock();

      case BlockType.Output:
        if (!obj.block) {
          return new OutputBlock(null);
        }
        const block = this.parseObject(obj.block);
        if (block instanceof Block) {
          return new OutputBlock(block);
        }
        throw InvalidBlockError;

      case BlockType.ReturnLiteral:
        return new ReturnLiteralBlock(obj.literal || null);

      case BlockType.Min:
      case BlockType.Max:
      case BlockType.Sum:
      case BlockType.Count:
        if (!obj.listBlock) {
          return new MinBlock(null);
        }
        const list = this.parseObject(obj.listBlock);
        if (list instanceof ListBlock) {
          return new MinBlock(list);
        }
        throw InvalidBlockError;

      case BlockType.InfixOperator:
        const left = this.parseObject(obj.left);
        const right = this.parseObject(obj.right);
        if (
          (!left || left instanceof LiteralBlock) &&
          (!right || right instanceof LiteralBlock)
        ) {
          return new InfixOperatorBlock(
            left || null,
            obj.operator || null,
            right || null,
          );
        }
        throw InvalidBlockError;

      case BlockType.PrefixOperator:
        const rightPrefix = this.parseObject(obj.right);
        if (!rightPrefix || rightPrefix instanceof LiteralBlock) {
          return new PrefixOperatorBlock(
            obj.operator || null,
            rightPrefix || null,
          );
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
  constructor() {
    super(BlockType.Input);
  }

  public clone(): Block {
    return new InputBlock();
  }
}

export class OutputBlock extends Block {
  block: Block | null;

  constructor(block: Block | null) {
    super(BlockType.Output);
    this.block = block;
  }

  public clone(): Block {
    return new OutputBlock(this.block ? this.block.clone() : null);
  }
}

export class ReturnLiteralBlock extends LiteralBlock {
  literal: Literal | null;

  constructor(literal: Literal | null) {
    super(BlockType.ReturnLiteral);
    this.literal = literal;
  }

  public clone(): Block {
    return new ReturnLiteralBlock(this.literal);
  }
}

export class MinBlock extends LiteralBlock {
  listBlock: ListBlock | null;

  constructor(listBlock: ListBlock | null) {
    super(BlockType.Min);
    this.listBlock = listBlock;
  }

  public clone(): Block {
    return new MinBlock(this.listBlock ? this.listBlock.clone() : null);
  }
}

export class MaxBlock extends LiteralBlock {
  listBlock: ListBlock | null;

  constructor(listBlock: ListBlock | null) {
    super(BlockType.Max);
    this.listBlock = listBlock;
  }

  public clone(): Block {
    return new MaxBlock(this.listBlock ? this.listBlock.clone() : null);
  }
}

export class SumBlock extends LiteralBlock {
  listBlock: ListBlock | null;

  constructor(listBlock: ListBlock | null) {
    super(BlockType.Sum);
    this.listBlock = listBlock;
  }

  public clone(): Block {
    return new SumBlock(this.listBlock ? this.listBlock.clone() : null);
  }
}

export class CountBlock extends LiteralBlock {
  listBlock: ListBlock | null;

  constructor(listBlock: ListBlock | null) {
    super(BlockType.Count);
    this.listBlock = listBlock;
  }

  public clone(): Block {
    return new CountBlock(this.listBlock ? this.listBlock.clone() : null);
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
  left: LiteralBlock | null;
  operator: InfixOperator | null;
  right: LiteralBlock | null;

  constructor(
    left: LiteralBlock | null,
    operator: InfixOperator | null,
    right: LiteralBlock | null,
  ) {
    super(BlockType.InfixOperator);
    this.left = left;
    this.right = right;
    this.operator = operator;
  }

  public clone(): Block {
    const newLeft = this.left ? this.left.clone() : null;
    const newRight = this.right ? this.right.clone() : null;
    return new InfixOperatorBlock(newLeft, this.operator, newRight);
  }
}

export class PrefixOperatorBlock extends LiteralBlock {
  operator: PrefixOperator | null;
  right: LiteralBlock | null;

  constructor(operator: PrefixOperator | null, right: LiteralBlock | null) {
    super(BlockType.PrefixOperator);
    this.right = right;
    this.operator = operator;
  }

  public clone(): Block {
    const newRight = this.right ? this.right.clone() : null;
    return new PrefixOperatorBlock(this.operator, newRight);
  }
}

// will do this later on
// export class AverageBlock extends LiteralBlock {}
// export class MedianBlock extends LiteralBlock {}
// export class MapBlock extends LiteralBlock {}
// export class FilterBlock extends LiteralBlock {}
// export class ReduceBlock extends LiteralBlock {}
