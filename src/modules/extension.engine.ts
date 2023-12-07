import {Decimal} from '../libs/decimal.js/decimal.js';
import type {NCRegisters, NCMemory} from './extension.common.js';

export class NCEngine {
  private _register: {
    x: Decimal;
    y: Decimal;
    z: Decimal;
    t: Decimal;
    x0: Decimal;
  };

  private _memory: {
    m0: Decimal;
    m1: Decimal;
    m2: Decimal;
    m3: Decimal;
  };

  public static readonly Precision = {
    MAX: 8,
    MAX_E: 2,
    MIN_E_VALUE: -99,
    MAX_E_VALUE: 99,
  };

  constructor() {
    Decimal.set({
      precision: NCEngine.Precision.MAX,
      rounding: Decimal.ROUND_HALF_UP,
      minE: NCEngine.Precision.MIN_E_VALUE,
      maxE: NCEngine.Precision.MAX_E_VALUE,
      toExpPos: NCEngine.Precision.MAX,
      toExpNeg: -1,
    });

    this._register = {
      x: new Decimal(0),
      y: new Decimal(0),
      z: new Decimal(0),
      t: new Decimal(0),
      x0: new Decimal(0),
    };

    this._memory = {
      m0: new Decimal(0),
      m1: new Decimal(0),
      m2: new Decimal(0),
      m3: new Decimal(0),
    };
  }

  // Stack & memory getters / setters

  public set x(value: Decimal | string) {
    const result = new Decimal(value);
    if (!result.isFinite()) {
      this._register.x = new Decimal(0);
      throw new RangeError(result.toString());
    }
    this._register.x = result;
  }

  public get x(): string {
    return this._register.x.toString();
  }

  public get registers(): NCRegisters {
    return {
      x: this._register.x.toString(),
      y: this._register.y.toString(),
      z: this._register.z.toString(),
      t: this._register.t.toString(),
      x0: this._register.x0.toString(),
    };
  }

  public get memory(): NCMemory {
    return {
      m0: this._memory.m0.toString(),
      m1: this._memory.m1.toString(),
      m2: this._memory.m2.toString(),
      m3: this._memory.m3.toString(),
    };
  }

  // Stack control OPs

  public push(): void {
    this._register.t = this._register.z;
    this._register.z = this._register.y;
    this._register.y = this._register.x;
  }

  private pop(): void {
    this._register.x0 = this._register.x;
    this._register.x = this._register.y;
    this._register.y = this._register.z;
    this._register.z = this._register.t;
  }

  private save(): void {
    this._register.x0 = this._register.x;
  }

  public swap(): void {
    const x = this._register.x;
    this._register.x = this._register.y;
    this._register.y = x;
  }

  public circulate(): void {
    const x = this._register.x;
    this._register.x = this._register.y;
    this._register.y = this._register.z;
    this._register.z = this._register.t;
    this._register.t = x;
  }

  // Special unary OPs

  public clearX() {
    this._register.x = new Decimal(0);
  }

  public negate() {
    this._register.x = this._register.x.negated();
  }

  // Unary OPs

  private op1(op: (x: Decimal) => Decimal): void {
    const result = op.call(Decimal, this._register.x);

    if (!result.isFinite()) throw new RangeError(result.toString());

    this.save();
    this._register.x = result;
  }

  public sqrt(): void {
    this.op1(Decimal.sqrt);
  }

  // Binary OPs

  private op2(op: (x: Decimal, y: Decimal) => Decimal): void {
    const result = op.call(Decimal, this._register.y, this._register.x);

    if (!result.isFinite()) throw new RangeError(result.toString());

    this.save();
    this.pop();
    this._register.x = result;
  }

  public add(): void {
    this.op2(Decimal.add);
  }

  public div(): void {
    this.op2(Decimal.div);
  }
}
