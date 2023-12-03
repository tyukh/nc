/* extension.logic.ts
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 * SPDX-FileCopyrightText: 2023 Roman Tyukh
 *
 */

'use strict';

import GObject from 'gi://GObject';
import {NCOpCode} from './extension.common.js';
import {NCEngine} from './extension.engine.js';

// import * as Main from 'resource:///org/gnome/shell/ui/main.js';
// Main.notify('Exponent:', NCLogic._EZero.exponent);

const enum NCLogicState {
  MANTISSA,
  EXPONENT,
}

class NCNumber {
  private _integer: string = '0';
  private _point: string = '';
  private _fraction: string = '';
  private _exponentSign: string = '';
  private _exponent: string = '';

  public get mantissa(): string {
    return this._integer + this._point + this._fraction;
  }

  public get exponent(): string {
    return this._exponentSign + this._exponent;
  }

  public get number(): string {
    if (this.exponent.length === 0) return this.mantissa;
    return `${this.mantissa}e${this.exponent}`;
  }

  public set mantissa(digit: string | number) {
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

  public set exponent(digit: string | number | null) {
    if (digit === null) {
      this._exponentSign = '';
      this._exponent = '';
    } else
      switch (typeof digit) {
        case 'string':
          this._exponent = this._exponent.slice(1) + digit;
          break;

        case 'number':
          if (digit === 0) {
            this._exponentSign = '';
            this._exponent = ''.padStart(NCEngine.Precision.MAX_E, '0');
          }
          break;
      }
  }

  public negateE(): void {
    this._exponentSign = this._exponentSign === '-' ? '' : '-';
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

  public synchronize(): void {
    this.emit('mantissa-signal', this._number.mantissa);
    this.emit('exponent-signal', this._number.exponent);
    this.emit('registers-signal', this._engine.registers);
  }

  private _processMantissa(opCode: NCOpCode): boolean {
    if (opCode === NCOpCode.POINT) this._number.point = true;
    else {
      const digit = NCLogic._digits.get(opCode);
      if (digit === undefined) return false;
      this._number.mantissa = digit;
    }
    this._engine.x = this._number.number;

    this.emit('mantissa-signal', this._number.mantissa);
    this.emit('registers-signal', this._engine.registers);
    return true;
  }

  private _processExponent(opCode: NCOpCode): boolean {
    if (opCode === NCOpCode.SIGN) this._number.negateE();
    else {
      const digit = NCLogic._digits.get(opCode);
      if (digit === undefined) return false;
      this._number.exponent = digit;
    }
    this._engine.x = this._number.number;

    this.emit('exponent-signal', this._number.exponent);
    this.emit('registers-signal', this._engine.registers);
    return true;
  }

  private _processControls(opCode: NCOpCode): boolean {
    switch (opCode) {
      case NCOpCode.ENTER_E:
        if (/^0\.*0*$/.test(this._number.mantissa)) this._number.mantissa = 1;
        this._number.exponent = 0;
        this._engine.x = this._number.number;

        this.synchronize();
        this._state = NCLogicState.EXPONENT;
        return true;

      case NCOpCode.CLEAR_X:
        this._number.mantissa = 0;
        this._number.exponent = null;
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
