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

//import * as Main from 'resource:///org/gnome/shell/ui/main.js';

class NCNumber {
  private _mantissaSign!: string;
  private _integer!: string;
  private _fraction!: string;
  private _exponentSign!: string;
  private _exponent!: string;

  constructor() {
    this.null();
  }

  public null(): void {
    this._mantissaSign = '';
    this._integer = '';
    this._fraction = '';
    this._exponentSign = '';
    this._exponent = '';
  }

  public get number(): string {
    return this._integer.length > 0 ? this._integer : '0';
  }

  public set integer(digit: string) {
    if (this._integer.length + this._fraction.length < NCEngine.Precision.MAX)
      this._integer += digit;
  }
}

const enum NCLogicState {
  INTEGER,
  FRACTION,
  EXPONENT,
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
  private _number: NCNumber;
  private _state: NCLogicState;

  constructor() {
    super();

    this._engine = new NCEngine();
    this._number = new NCNumber();
    this._state = NCLogicState.INTEGER;
  }

  public synchronize(): void {
    this.emit('mantissa-signal', this._number.number);
  }

  private _processInteger(opCode: NCOpCode): boolean {
    const digit = NCLogic._digits.get(opCode);
    if (digit === undefined) return false;
    this._number.integer = digit;

    return true;
  }

  private _processFraction(opCode: NCOpCode): boolean {
    return true;
  }

  private _processExponent(opCode: NCOpCode): boolean {
    return true;
  }

  private _processControls(opCode: NCOpCode): boolean {
    switch (opCode) {
      case NCOpCode.POINT:
        this._state = NCLogicState.FRACTION;
        return true;
      case NCOpCode.ENTER_E:
        this._state = NCLogicState.EXPONENT;
        return true;
    }
    return true;
  }

  public keyHandler(_sender: GObject.Object, opCode: NCOpCode): void {
    //Main.notify('Key is:', opCode.toString());
    switch (this._state) {
      case NCLogicState.INTEGER:
        if (this._processInteger(opCode)) {
          this.emit('mantissa-signal', this._number.number);
          return;
        }
        break;

      case NCLogicState.FRACTION:
        if (this._processFraction(opCode)) {
          this.emit('mantissa-signal', '');
          return;
        }
        break;

      case NCLogicState.EXPONENT:
        if (this._processExponent(opCode)) {
          this.emit('exponent-signal', '');
          return;
        }
        break;
    }

    if (this._processControls(opCode)) {
      //
    } else {
      // error reporting
    }
  }
}
