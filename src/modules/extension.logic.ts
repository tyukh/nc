/* extension.logic.ts
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 * SPDX-FileCopyrightText: 2023 Roman Tyukh
 *
 */

'use strict';

import GObject from 'gi://GObject';
import {NCOpCode, type NCRegisters} from './extension.common.js';
import {NCEngine} from './extension.engine.js';

// import * as Main from 'resource:///org/gnome/shell/ui/main.js';
// Main.notify('Exponent:', NCLogic._EZero.exponent);

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

  public set digits(digit: string | number) {
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

  public set digits(digit: string | number | null) {
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
            this._sign = '';
            this._exponent = ''.padStart(NCEngine.Precision.MAX_E, '0');
          }
          break;
      }
  }

  public get sign(): boolean {
    return this._sign !== '-';
  }

  public set sign(value: boolean) {
    this._sign = value ? '' : '-';
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
        },
      },
      this
    );
  }

  private static readonly _digits: Readonly<Map<NCOpCode, string>> = new Map([
    [NCOpCode.ZERO, '0'],
    [NCOpCode.ONE, '1'],
    [NCOpCode.TWO, '2'],
    [NCOpCode.THREE, '3'],
    [NCOpCode.FOUR, '4'],
    [NCOpCode.FIVE, '5'],
    [NCOpCode.SIX, '6'],
    [NCOpCode.SEVEN, '7'],
    [NCOpCode.EIGHT, '8'],
    [NCOpCode.NINE, '9'],
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

  private _signal(name: string, value: string | NCRegisters): void {
    this.emit(name, value);
  }

  public synchronize(): void {
    this._signal('mantissa-signal', this._number.mantissa.digits);
    this._signal('exponent-signal', this._number.exponent.digits);
    this._signal('registers-signal', this._engine.registers);
  }

  private _processMantissa(opCode: NCOpCode): boolean {
    if (opCode === NCOpCode.POINT) this._number.mantissa.point = true;
    else {
      const digit = NCLogic._digits.get(opCode);
      if (digit === undefined) return false;
      this._number.mantissa.digits = digit;
    }
    this._engine.x = this._number.digits;

    this._signal('mantissa-signal', this._number.mantissa.digits);
    this._signal('registers-signal', this._engine.registers);
    return true;
  }

  private _processExponent(opCode: NCOpCode): boolean {
    if (opCode === NCOpCode.SIGN) this._number.exponent.sign = !this._number.exponent.sign;
    else {
      const digit = NCLogic._digits.get(opCode);
      if (digit === undefined) return false;
      this._number.exponent.digits = digit;
    }
    this._engine.x = this._number.digits;

    this._signal('exponent-signal', this._number.exponent.digits);
    this._signal('registers-signal', this._engine.registers);
    return true;
  }

  private _processControls(opCode: NCOpCode): boolean {
    switch (opCode) {
      case NCOpCode.ENTER_E:
        if (/^0\.*0*$/.test(this._number.mantissa.digits)) this._number.mantissa.digits = 1;
        this._number.exponent.digits = 0;
        this._engine.x = this._number.digits;

        this.synchronize();
        this._state = NCLogicState.EXPONENT;
        return true;

      case NCOpCode.CLEAR_X:
        this._number.mantissa.digits = 0;
        this._number.exponent.digits = null;
        this._engine.clearX();

        this.synchronize();
        this._state = NCLogicState.MANTISSA;
        return true;
    }

    return false;
  }

  public keyHandler(_sender: GObject.Object, opCode: NCOpCode): void {
    switch (this._state) {
      case NCLogicState.MANTISSA:
        if (this._processMantissa(opCode)) return;
        break;

      case NCLogicState.EXPONENT:
        if (this._processExponent(opCode)) return;
        break;
    }

    if (this._processControls(opCode)) {
      //
    } else {
      // error reporting
    }
  }
}
