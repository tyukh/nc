import {Decimal} from '../libs/decimal.js/decimal.js';

export class NCEngine {
  private _x: Decimal;
  private _y: Decimal;
  private _z: Decimal;
  private _t: Decimal;
  private _x0: Decimal;

  private _m0: Decimal;
  private _m1: Decimal;
  private _m2: Decimal;
  private _m3: Decimal;

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

    this._x = new Decimal(0);
    this._y = new Decimal(0);
    this._z = new Decimal(0);
    this._t = new Decimal(0);
    this._x0 = new Decimal(0);

    this._m0 = new Decimal(0);
    this._m1 = new Decimal(0);
    this._m2 = new Decimal(0);
    this._m3 = new Decimal(0);
  }

  // Stack & memory getters / setters

  public set x(value: Decimal | string) {
    this._x = new Decimal(value);
  }

  public get x(): Decimal {
    return this._x;
  }

  public registers(): {x: string; y: string; z: string; t: string; x0: string} {
    return {
      x: this._x.toString(),
      y: this._y.toString(),
      z: this._z.toString(),
      t: this._t.toString(),
      x0: this._x0.toString(),
    };
  }

  public memory(): {m0: string; m1: string; m2: string; m3: string} {
    return {
      m0: this._m0.toString(),
      m1: this._m1.toString(),
      m2: this._m2.toString(),
      m3: this._m3.toString(),
    };
  }

  // Stack control OPs

  public push(): void {
    this._t = this._z;
    this._z = this._y;
    this._y = this._x;
  }

  private pop(): void {
    this._x0 = this._x;
    this._x = this._y;
    this._y = this._z;
    this._z = this._t;
  }

  private save(): void {
    this._x0 = this._x;
  }

  public swap(): void {
    const interchange = this._x;
    this._x = this._y;
    this._y = interchange;
  }

  public circulate(): void {
    const interchange = this._x;
    this._x = this._y;
    this._y = this._z;
    this._z = this._t;
    this._t = interchange;
  }

  // Special unary OPs

  public negate() {
    this._x = this._x.negated();
  }

  public clearX() {
    this._x = new Decimal(0);
  }

  // Unary OPs

  // Binary OPs

  private op2(op: (x: Decimal, y: Decimal) => Decimal): boolean {
    let result: Decimal;

    try {
      result = op(this._x, this._y);
    } catch {
      return false;
    }

    if (result.isFinite() === false) return false;

    this.save();
    this.pop();
    this._x = result;

    return true;
  }

  public add(): boolean {
    return this.op2(Decimal.add);
  }
}
