import { Testcase } from "@prisma/client";

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

    let list;
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
        if (!obj.listBlock) {
          return new MinBlock(null);
        }
        list = this.parseObject(obj.listBlock);
        if (list instanceof ListBlock) {
          return new MinBlock(list);
        }
        throw InvalidBlockError;

      case BlockType.Max:
        if (!obj.listBlock) {
          return new MaxBlock(null);
        }
        list = this.parseObject(obj.listBlock);
        if (list instanceof ListBlock) {
          return new MaxBlock(list);
        }
        throw InvalidBlockError;

      case BlockType.Sum:
        if (!obj.listBlock) {
          return new SumBlock(null);
        }
        list = this.parseObject(obj.listBlolk);
        if (list instanceof ListBlock) {
          return new SumBlock(list);
        }
        throw InvalidBlockError;

      case BlockType.Count:
        if (!obj.listBlock) {
          return new CountBlock(null);
        }
        list = this.parseObject(obj.listBlock);
        if (list instanceof ListBlock) {
          return new CountBlock(list);
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

  public static evaluate(
    block: Block,
    testcase: Testcase,
  ): List | Literal | null {
    const input: List | Literal | null = convertToListOrLiteral(
      JSON.parse(testcase.input),
    );

    let left, right, operator, leftResult, rightResult;
    switch (block.name as BlockType) {
      case BlockType.Input:
        return input;

      case BlockType.Output:
        const innerBlock = (block as OutputBlock).block;
        if (!innerBlock) {
          return null;
        }
        return this.evaluate(innerBlock, testcase);

      case BlockType.ReturnLiteral:
        return (block as ReturnLiteralBlock).literal;

      case BlockType.Min:
      case BlockType.Max:
      case BlockType.Sum:
      case BlockType.Count:
        const listBlock = (block as MinBlock).listBlock;
        if (!listBlock) {
          return null;
        }
        const listResult = this.evaluate(listBlock, testcase);
        if (!Array.isArray(listResult)) {
          // console.log("list block not arrar");
          return null;
        }
        // console.log("list result: ", listResult);
        const values = (listResult as List).map((literal: Literal) =>
          Number(literal.value),
        );
        // console.log("values: ", values);
        if (block instanceof MinBlock) {
          return { type: "number", value: Math.min(...values) };
        } else if (block instanceof MaxBlock) {
          return { type: "number", value: Math.max(...values) };
        } else if (block instanceof SumBlock) {
          return {
            type: "number",
            value: values.reduce((acc, x) => acc + x, 0),
          };
        } else if (block instanceof CountBlock) {
          return { type: "number", value: values.length };
        } else {
          return null;
        }
      case BlockType.InfixOperator:
        left = (block as InfixOperatorBlock).left;
        operator = (block as InfixOperatorBlock).operator;
        right = (block as InfixOperatorBlock).right;
        if (!left || !operator || !right) {
          return null;
        }

        leftResult = this.evaluate(left, testcase);
        if (!leftResult || Array.isArray(leftResult)) {
          return null;
        }
        rightResult = this.evaluate(right, testcase);
        if (!rightResult || Array.isArray(rightResult)) {
          return null;
        }

        switch (operator) {
          case "+":
            return {
              type: "number",
              value: Number(leftResult.value) + Number(rightResult.value),
            };
          case "-":
            return {
              type: "number",
              value: Number(leftResult.value) - Number(rightResult.value),
            };
          case "*":
            return {
              type: "number",
              value: Number(leftResult.value) * Number(rightResult.value),
            };
          case "//":
            return {
              type: "number",
              value: Math.floor(
                Number(leftResult.value) / Number(rightResult.value),
              ),
            };
          case "%":
            return {
              type: "number",
              value: Number(leftResult.value) % Number(rightResult.value),
            };
          case "^":
            return {
              type: "number",
              value: Number(leftResult.value) ** Number(rightResult.value),
            };
          case "&&":
            return {
              type: "boolean",
              value: Boolean(leftResult.value) && Boolean(rightResult.value),
            };
          case "||":
            return {
              type: "boolean",
              value: Boolean(leftResult.value) || Boolean(rightResult.value),
            };
          case "==":
            return {
              type: "boolean",
              value: leftResult.value == rightResult.value,
            };
          case "!=":
            return {
              type: "boolean",
              value: leftResult.value != rightResult.value,
            };
          case "<":
            return {
              type: "boolean",
              value: leftResult.value < rightResult.value,
            };
          case "<=":
            return {
              type: "boolean",
              value: leftResult.value <= rightResult.value,
            };
          case ">":
            return {
              type: "boolean",
              value: leftResult.value > rightResult.value,
            };
          case ">=":
            return {
              type: "boolean",
              value: leftResult.value >= rightResult.value,
            };
        }

      case BlockType.PrefixOperator:
        operator = (block as PrefixOperatorBlock).operator;
        right = (block as PrefixOperatorBlock).right;
        if (!operator || !right) {
          return null;
        }

        rightResult = this.evaluate(right, testcase);
        if (!rightResult || Array.isArray(rightResult)) {
          return null;
        }

        switch (operator) {
          case "!":
            return { type: "boolean", value: !rightResult.value };
          case "-":
            return { type: "number", value: -rightResult.value };
        }

      default:
        throw UnknownBlockError;
    }
  }
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

// TODO: handle error
function convertToListOrLiteral(input: any): List | Literal | null {
  if (Array.isArray(input)) {
    const result = [];

    for (const item of input) {
      const itemResult = convertToListOrLiteral(item);

      if (itemResult && !Array.isArray(itemResult)) result.push(itemResult);
    }

    return result;
  } else {
    if (typeof input === "number") {
      return { type: "number", value: input };
    } else if (typeof input === "boolean") {
      return { type: "boolean", value: input };
    }

    return null;
  }
}

// export class MapBlock extends LiteralBlock {}
// export class FilterBlock extends LiteralBlock {}
// export class ReduceBlock extends LiteralBlock {}
