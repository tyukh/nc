/* extension.logic.ts
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 * SPDX-FileCopyrightText: 2023 Roman Tyukh
 *
 */

'use strict';

import GObject from 'gi://GObject';
import {NCOpCodes, type NCRegisters, type NCError} from './extension.common.js';
import {NCEngine} from './extension.engine.js';

const enum NCLogicState {
  MANTISSA,
  EXPONENT,
}

class NCMantissa {
  private _integer: string = '0';
  private _point: string = '';
  private _fraction: string = '';

  public get digits(): string {
    return this._integer + this._point + this._fraction;
  }

  public set digits(digit: string | 0 | 1) {
    switch (typeof digit) {
      case 'string':
        if (this._integer.length + this._fraction.length < NCEngine.Precision.MAX) {
          if (this._point !== '.')
            this._integer = this._integer === '0' ? digit : this._integer + digit;
          else this._fraction += digit;
        }
        break;

      case 'number':
        this._integer = digit.toFixed(0);
        this._point = '';
        this._fraction = '';
        break;
    }
  }

  public set point(value: boolean) {
    this._point = value ? '.' : '';
  }
}

class NCExponent {
  private _sign: string = '';
  private _exponent: string = '';

  public get digits(): string {
    return this._sign + this._exponent;
  }

  public set digits(digit: string | 0 | null) {
    if (digit === null) {
      this._sign = '';
      this._exponent = '';
    } else
      switch (typeof digit) {
        case 'string':
          this._exponent = this._exponent.slice(1) + digit;
          break;

        case 'number':
          if (digit === 0) {
            this._sign = '+';
            this._exponent = ''.padStart(NCEngine.Precision.MAX_E, '0');
          }
          break;
      }
  }

  public get sign(): boolean {
    return this._sign !== '-';
  }

  public set sign(value: boolean) {
    this._sign = value ? '+' : '-';
  }
}

class NCNumber {
  private _mantissa: NCMantissa;
  private _exponent: NCExponent;

  constructor() {
    this._mantissa = new NCMantissa();
    this._exponent = new NCExponent();
  }

  public get mantissa(): NCMantissa {
    return this._mantissa;
  }

  public get exponent(): NCExponent {
    return this._exponent;
  }

  public get digits(): string {
    if (this._exponent.digits.length === 0) return this._mantissa.digits;
    return `${this._mantissa.digits}e${this._exponent.digits}`;
  }
}

export default class NCLogic extends GObject.Object {
  static {
    GObject.registerClass(
      {
        GTypeName: 'NCLogic',
        Signals: {
          'mantissa-signal': {
            param_types: [GObject.TYPE_STRING],
          },
          'exponent-signal': {
            param_types: [GObject.TYPE_STRING],
          },
          'registers-signal': {
            param_types: [GObject.TYPE_JSOBJECT],
          },
          'memory-signal': {
            param_types: [GObject.TYPE_JSOBJECT],
          },
          'error-signal': {
            param_types: [GObject.TYPE_JSOBJECT],
          },
        },
      },
      this
    );
  }

  private readonly _digits: Readonly<Map<NCOpCodes, string>> = new Map([
    [NCOpCodes.ZERO, '0'],
    [NCOpCodes.ONE, '1'],
    [NCOpCodes.TWO, '2'],
    [NCOpCodes.THREE, '3'],
    [NCOpCodes.FOUR, '4'],
    [NCOpCodes.FIVE, '5'],
    [NCOpCodes.SIX, '6'],
    [NCOpCodes.SEVEN, '7'],
    [NCOpCodes.EIGHT, '8'],
    [NCOpCodes.NINE, '9'],
  ]);

  private _engine: NCEngine;
  private _state: NCLogicState;
  private _number: NCNumber;

  constructor() {
    super();

    this._engine = new NCEngine();
    this._number = new NCNumber();
    this._state = NCLogicState.MANTISSA;
  }

  private _signal(name: string, value: string | NCRegisters | NCError): void {
    this.emit(name, value);
  }

  public synchronize(): void {
    this._signal('mantissa-signal', this._number.mantissa.digits);
    this._signal('exponent-signal', this._number.exponent.digits);
    this._signal('registers-signal', this._engine.registers);
  }

  private _processMantissa(opCode: NCOpCodes): boolean {
    if (opCode === NCOpCodes.POINT) this._number.mantissa.point = true;
    else {
      const digit = this._digits.get(opCode);
      if (digit === undefined) return false;
      this._number.mantissa.digits = digit;
    }
    this._engine.x = this._number.digits;

    this._signal('mantissa-signal', this._number.mantissa.digits);
    this._signal('registers-signal', this._engine.registers);
    return true;
  }

  private _processExponent(opCode: NCOpCodes): boolean {
    if (opCode === NCOpCodes.SIGN) this._number.exponent.sign = !this._number.exponent.sign;
    else {
      const digit = this._digits.get(opCode);
      if (digit === undefined) return false;
      this._number.exponent.digits = digit;
    }

    this._engine.x = this._number.digits;

    this._signal('exponent-signal', this._number.exponent.digits);
    this._signal('registers-signal', this._engine.registers);
    return true;
  }

  private _processControls(opCode: NCOpCodes): boolean {
    switch (opCode) {
      case NCOpCodes.ENTER_E:
        if (/^0\.*0*$/.test(this._number.mantissa.digits)) this._number.mantissa.digits = 1;
        this._number.exponent.digits = 0;
        this._engine.x = this._number.digits;

        this.synchronize();
        this._state = NCLogicState.EXPONENT;
        return true;

      case NCOpCodes.CLEAR_X:
        this._number.mantissa.digits = 0;
        this._number.exponent.digits = null;
        this._engine.clearX();

        this.synchronize();
        this._state = NCLogicState.MANTISSA;
        return true;
    }

    return false;
  }

  private _processOperations(opCode: NCOpCodes): boolean {
    switch (opCode) {
      case NCOpCodes.PUSH:
        this._engine.push();
        break;

      case NCOpCodes.SIGN:
        this._engine.negate();
        break;

      case NCOpCodes.PLUS:
        this._engine.add();
        break;

      case NCOpCodes.MINUS:
        this._engine.sqrt();
        break;

      case NCOpCodes.DIVIDE:
        this._engine.div();
        break;

      default:
        return false;
    }

    this._number.mantissa.digits = 0;
    this._number.exponent.digits = null;

    const number = this._engine.x.split('e');
    this._signal('mantissa-signal', number.at(0)!);
    this._signal('exponent-signal', number.at(1) ?? '');
    this._signal('registers-signal', this._engine.registers);
    this._state = NCLogicState.MANTISSA;

    return true;
  }

  private _processError(error: NCError) {
    this._number.mantissa.digits = 0;
    this._number.exponent.digits = null;

    this._signal('mantissa-signal', 'ERROR');
    this._signal('exponent-signal', '');
    this._signal('registers-signal', this._engine.registers);
    this._signal('error-signal', error);
    this._state = NCLogicState.MANTISSA;
  }

  public keyHandler(_sender: GObject.Object, opCode: NCOpCodes): void {
    try {
      switch (this._state) {
        case NCLogicState.MANTISSA:
          if (this._processMantissa(opCode)) return;
          break;

        case NCLogicState.EXPONENT:
          if (this._processExponent(opCode)) return;
          break;
      }

      if (this._processControls(opCode)) return;

      if (this._processOperations(opCode)) return;
    } catch (e) {
      if (e instanceof RangeError) this._processError({type: 'Range Error', message: e.message});
      else if (e instanceof Error && /DecimalError/.test(e.message))
        this._processError({type: 'Decimal Error', message: e.message});
      else this._processError({type: 'Other Error', message: 'Unknown'});
      return;
    }

    this._processError({type: 'Operational Error', message: 'Unknown operation'});
  }
}
