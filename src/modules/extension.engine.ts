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
    this._register.x = new Decimal(value);
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

  public negate() {
    this._register.x = this._register.x.negated();
  }

  public clearX() {
    this._register.x = new Decimal(0);
  }

  // Unary OPs

  // Binary OPs

  private op2(op: (x: Decimal, y: Decimal) => Decimal): boolean {
    let result: Decimal;

    try {
      result = op(this._register.x, this._register.y);
    } catch {
      return false;
    }

    if (result.isFinite() === false) return false;

    this.save();
    this.pop();
    this._register.x = result;

    return true;
  }

  public add(): boolean {
    return this.op2(Decimal.add);
  }
}
