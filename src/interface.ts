/* interface.ts
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

'use strict';

import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import St from 'gi://St';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

// const Processor = Me.imports.calculator.processor;

interface KeyConstructorProperties extends St.Button.ConstructorProperties {
  key_id?: number | null;
}

class Key extends St.Button {
  private _keyId!: number | null;
  static {
    GObject.registerClass(
      {
        Properties: {
          'key-id': GObject.ParamSpec.uint(
            'key-id',
            'keyId',
            'A read-write integer property',
            GObject.ParamFlags.READWRITE,
            0,
            65535,
            0
          ),
        },
      },
      this
    );
  }

  constructor(params?: Partial<KeyConstructorProperties>) {
    super(params);
  }

  get keyId(): number | null {
    if (this._keyId === undefined) this._keyId = null;
    return this._keyId;
  }

  set keyId(value: number | null) {
    if (this._keyId !== value) this._keyId = value;
  }
}

export default class NCInterface {
  private _button: PanelMenu.Button | null;
  private readonly _menu: PopupMenu.PopupMenu;
  // private readonly _processor: Processor.Processor;

  private _x1RegisterLabel!: St.Label;
  private _tRegisterLabel!: St.Label;
  private _zRegisterLabel!: St.Label;
  private _yRegisterLabel!: St.Label;
  private _xRegisterLabel!: St.Label;
  private _mantissaIndicatorLabel!: St.Label;
  private _exponentIndicatorLabel!: St.Label;

  constructor(
    private _extension: Extension,
    private _font: string,
    private _position: string,
    private _order: number
  ) {
    this._button = new PanelMenu.Button(0.0, _(`${this._extension.uuid} Indicator`));
    this._menu = this._button.menu;

    // this._processor = new Processor.Processor();

    this._button.add_child(
      new St.Icon({
        icon_name: 'org.gnome.Calculator-symbolic',
        style_class: 'system-status-icon',
      })
    );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._initControls(this._menu, this._font);

    // -- Init connections
    // this._processor.connectIndicators(this._onIndicatorSet.bind(this));
    this._menu.actor.connectObject('key-press-event', this._onKeyboardKeyEvent.bind(this), this);

    /* In here we are adding the button in the status area
     * - button is and instance of panelMenu.Button
     * - 0 is the position
     * - `right` is the box where we want our button to be displayed (left/center/right)
     */
    Main.panel.addToStatusArea(this._extension.uuid, this._button, this._order, this._position);
  }

  public destroy(): void {
    if (this._button !== null) {
      this._button.destroy();
      this._button = null;
    }
  }

  private _initControls(menu: PopupMenu.PopupMenu, font: string): void {
    // -- Init Stack
    const stackArea = new PopupMenu.PopupSubMenuMenuItem(_('Stack registers'), false);
    stackArea.setOrnament(PopupMenu.Ornament.HIDDEN);
    this._initStack(stackArea, font);

    // -- Init Indicator
    const indicatorArea = new PopupMenu.PopupBaseMenuItem({
      reactive: false,
      can_focus: false,
      activate: false,
      style_class: 'panel-calc-rpn-PopupBaseMenuItem',
    });
    indicatorArea.setOrnament(PopupMenu.Ornament.HIDDEN);
    this._initIndicator(indicatorArea, font);

    // -- Init Keyboard
    const keyboardArea = new PopupMenu.PopupBaseMenuItem({
      reactive: false,
      can_focus: false,
      activate: false,
      style_class: 'panel-calc-rpn-PopupBaseMenuItem',
    });
    keyboardArea.setOrnament(PopupMenu.Ornament.HIDDEN);
    this._initKeyboard(keyboardArea, font);

    // -- Init Popup
    menu.addMenuItem(stackArea);
    menu.addMenuItem(indicatorArea);
    menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    menu.addMenuItem(keyboardArea);
  }

  private _initRegister(stackBox: St.BoxLayout, label: string, font: string): St.Label {
    const box = new St.BoxLayout({
      vertical: false,
      x_expand: true,
      y_expand: true,
      x_align: Clutter.ActorAlign.FILL,
      y_align: Clutter.ActorAlign.CENTER,
      style_class: 'panel-calc-rpn-registerBoxLayout',
    });

    const valueBox = new St.BoxLayout({
      x_expand: true,
      x_align: Clutter.ActorAlign.FILL,
      y_align: Clutter.ActorAlign.CENTER,
      style_class: 'panel-calc-rpn-registerValueBoxLayout',
    });
    const nameBox = new St.BoxLayout({
      x_align: Clutter.ActorAlign.FILL,
      y_align: Clutter.ActorAlign.CENTER,
      style_class: 'panel-calc-rpn-registerNameBoxLayout',
    });

    const value = new St.Label({
      text: '',
      x_expand: true,
      x_align: Clutter.ActorAlign.START,
      y_align: Clutter.ActorAlign.CENTER,
      style_class: 'panel-calc-rpn-registerValueLabel',
    });
    value.set_style(`font-family: ${font}`);

    const name = new St.Label({
      text: label,
      x_align: Clutter.ActorAlign.START,
      y_align: Clutter.ActorAlign.CENTER,
      style_class: 'panel-calc-rpn-registerNameLabel',
    });
    name.set_style(`font-family: ${font}`);

    valueBox.add_actor(value);
    nameBox.add_actor(name);

    box.add_actor(valueBox);
    box.add_actor(nameBox);
    stackBox.add_actor(box);

    return value;
  }

  private _initStack(stackArea: PopupMenu.PopupSubMenuMenuItem, font: string): void {
    const stack1Box = new St.BoxLayout({
      vertical: true,
      x_expand: true,
      y_expand: true,
      x_align: Clutter.ActorAlign.FILL,
      y_align: Clutter.ActorAlign.CENTER,
      opacity: 150,
      style_class: 'panel-calc-rpn-stack1BoxLayout',
    });
    const stack2Box = new St.BoxLayout({
      vertical: true,
      x_expand: true,
      y_expand: true,
      x_align: Clutter.ActorAlign.FILL,
      y_align: Clutter.ActorAlign.CENTER,
      opacity: 150,
      style_class: 'panel-calc-rpn-stack2BoxLayout',
    });

    this._x1RegisterLabel = this._initRegister(stack1Box, 'X\u{2081}', font);
    this._tRegisterLabel = this._initRegister(stack2Box, 'T', font);
    this._zRegisterLabel = this._initRegister(stack2Box, 'Z', font);
    this._yRegisterLabel = this._initRegister(stack2Box, 'Y', font);
    this._xRegisterLabel = this._initRegister(stack2Box, 'X', font);

    stackArea.menu.box.add(stack1Box);
    stackArea.menu.box.add(new PopupMenu.PopupSeparatorMenuItem());
    stackArea.menu.box.add(stack2Box);
  }

  private _initIndicator(indicatorArea: PopupMenu.PopupBaseMenuItem, font: string): void {
    const indicatorBox = new St.BoxLayout({
      vertical: false,
      x_expand: true,
      y_expand: true,
      x_align: Clutter.ActorAlign.FILL,
      y_align: Clutter.ActorAlign.FILL,
      style_class: 'panel-calc-rpn-indicatorBoxLayout',
    });

    const mantissaBox = new St.BoxLayout({
      x_expand: true,
      x_align: Clutter.ActorAlign.FILL,
      y_align: Clutter.ActorAlign.CENTER,
      style_class: 'panel-calc-rpn-indicatorMantissaBoxLayout',
    });
    const exponentBox = new St.BoxLayout({
      x_align: Clutter.ActorAlign.FILL,
      y_align: Clutter.ActorAlign.CENTER,
      style_class: 'panel-calc-rpn-indicatorExponentBoxLayout',
    });

    this._mantissaIndicatorLabel = new St.Label({
      text: '',
      x_expand: true,
      x_align: Clutter.ActorAlign.START,
      y_align: Clutter.ActorAlign.CENTER,
      style_class: 'panel-calc-rpn-indicatorMantissaLabel',
    });
    this._mantissaIndicatorLabel.set_style(`font-family: ${font}`);

    this._exponentIndicatorLabel = new St.Label({
      text: '',
      x_expand: true,
      x_align: Clutter.ActorAlign.END,
      y_align: Clutter.ActorAlign.CENTER,
      style_class: 'panel-calc-rpn-indicatorExponentLabel',
    });
    this._exponentIndicatorLabel.set_style(`font-family: ${font}`);

    mantissaBox.add_actor(this._mantissaIndicatorLabel);
    exponentBox.add_actor(this._exponentIndicatorLabel);

    indicatorBox.add_actor(mantissaBox);
    indicatorBox.add_actor(exponentBox);

    indicatorArea.actor.add_child(indicatorBox);
  }

  private _initKeyboard(keyboardArea: PopupMenu.PopupBaseMenuItem, font: string): void {
    const Glyph: Readonly<Record<string, string>> = {
      NONE: '',

      MODE_EE: _('EE'),
      MODE_F: 'F',
      MODE_K: 'K',
      MODE_E: _('E'),

      ZERO: '0',
      ONE: '1',
      TWO: '2',
      THREE: '3',
      FOUR: '4',
      FIVE: '5',
      SIX: '6',
      SEVEN: '7',
      EIGHT: '8',
      NINE: '9',
      PI: '\u{03C0}',
      POINT: '.',
      SIGN: '/-/',

      OP_ENTER_EXPONENT: _('EE'),

      OP_CLEAR_X: _('Cx'),
      OP_CLEAR_F: _('CF'),
      OP_NOP: _('NOP'),

      OP_PUSH_X: _('E\u{2191}'),
      OP_BACK_X: _('Bx'),
      OP_SWAP: '\u{27F7}',
      OP_CIRCLE: '\u{2941}',

      OP_ADD: '+',
      OP_SUBTRACT: '-',
      OP_MULTIPLY: '\u{00D7}',
      OP_DIVIDE: '\u{00F7}',
      OP_1_DIV_X: '1/x',

      OP_SINE: 'sin',
      OP_COSINE: 'cos',
      OP_TANGENT: 'tg',
      OP_ARCSINE: 'sin\u{207B}\u{00B9}',
      OP_ARCCOSINE: 'cos\u{207B}\u{00B9}',
      OP_ARCTANGENT: 'tg\u{207B}\u{00B9}',

      OP_X_SQ: 'x\u{00B2}',
      OP_SQRT: '\u{221A}',
      OP_TEN_POW_X: '10\u{02E3}',
      OP_X_POW_Y: 'x\u{02b8}',

      OP_E_POW_X: 'e\u{02E3}',
      OP_LG: 'lg',
      OP_LN: 'ln',

      OP_INTEGER: '[x]',
      OP_DECIMAL: '{x}',
      OP_ABSOLUTE: '|x|',
    };
    const keyMatrix = [
      {
        keys: [
          {
            id: 1, // Processor.Processor.Key.F,
            label: Glyph.MODE_F,
            labelF: Glyph.NONE,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-yellowButton',
          },
          {
            id: 2, // Processor.Processor.Key.K,
            label: Glyph.MODE_K,
            labelF: Glyph.NONE,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-blueButton',
          },
          {
            id: 0, // Processor.Processor.Key.RESERVED_NULL,
          },
        ],
        labels: false,
      },
      {
        keys: [
          {
            id: 3, // Processor.Processor.Key.SEVEN,
            label: Glyph.SEVEN,
            labelF: Glyph.OP_SINE,
            labelK: Glyph.OP_INTEGER,
            style_class: 'panel-calc-rpn-grayButton',
          },
          {
            id: 4, // Processor.Processor.Key.EIGHT,
            label: Glyph.EIGHT,
            labelF: Glyph.OP_COSINE,
            labelK: Glyph.OP_DECIMAL,
            style_class: 'panel-calc-rpn-grayButton',
          },
          {
            id: 5, // Processor.Processor.Key.NINE,
            label: Glyph.NINE,
            labelF: Glyph.OP_TANGENT,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-grayButton',
          },
          {
            id: 6, // Processor.Processor.Key.MINUS,
            label: Glyph.OP_SUBTRACT,
            labelF: Glyph.OP_SQRT,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-grayButton',
          },
          {
            id: 7, // Processor.Processor.Key.DIVIDE,
            label: Glyph.OP_DIVIDE,
            labelF: Glyph.OP_1_DIV_X,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-grayButton',
          },
        ],
        labels: true,
      },
      {
        keys: [
          {
            id: 8, // Processor.Processor.Key.FOUR,
            label: Glyph.FOUR,
            labelF: Glyph.OP_ARCSINE,
            labelK: Glyph.OP_ABSOLUTE,
            style_class: 'panel-calc-rpn-grayButton',
          },
          {
            id: 9, // Processor.Processor.Key.FIVE,
            label: Glyph.FIVE,
            labelF: Glyph.OP_ARCCOSINE,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-grayButton',
          },
          {
            id: 10, // Processor.Processor.Key.SIX,
            label: Glyph.SIX,
            labelF: Glyph.OP_ARCTANGENT,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-grayButton',
          },
          {
            id: 11, // Processor.Processor.Key.PLUS,
            label: Glyph.OP_ADD,
            labelF: Glyph.PI,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-grayButton',
          },
          {
            id: 12, // Processor.Processor.Key.MULTIPLY,
            label: Glyph.OP_MULTIPLY,
            labelF: Glyph.OP_X_SQ,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-grayButton',
          },
        ],
        labels: true,
      },
      {
        keys: [
          {
            id: 13, // Processor.Processor.Key.ONE,
            label: Glyph.ONE,
            labelF: Glyph.OP_E_POW_X,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-grayButton',
          },
          {
            id: 14, // Processor.Processor.Key.TWO,
            label: Glyph.TWO,
            labelF: Glyph.OP_LG,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-grayButton',
          },
          {
            id: 15, // Processor.Processor.Key.THREE,
            label: Glyph.THREE,
            labelF: Glyph.OP_LN,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-grayButton',
          },
          {
            id: 16, // Processor.Processor.Key.SWAP,
            label: Glyph.OP_SWAP,
            labelF: Glyph.OP_X_POW_Y,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-grayButton',
          },
          {
            id: 17, // Processor.Processor.Key.PUSH,
            label: Glyph.OP_PUSH_X,
            labelF: Glyph.OP_BACK_X,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-grayButton',
          },
        ],
        labels: true,
      },
      {
        keys: [
          {
            id: 18, // Processor.Processor.Key.ZERO,
            label: Glyph.ZERO,
            labelF: Glyph.OP_TEN_POW_X,
            labelK: Glyph.OP_NOP,
            style_class: 'panel-calc-rpn-grayButton',
          },
          {
            id: 19, // Processor.Processor.Key.POINT,
            label: Glyph.POINT,
            labelF: Glyph.OP_CIRCLE,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-grayButton',
          },
          {
            id: 20, // Processor.Processor.Key.SIGN,
            label: Glyph.SIGN,
            labelF: Glyph.NONE,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-grayButton',
          },
          {
            id: 21, // Processor.Processor.Key.ENTER_E,
            label: Glyph.OP_ENTER_EXPONENT,
            labelF: Glyph.NONE,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-grayButton',
          },
          {
            id: 22, // Processor.Processor.Key.CLEAR_X,
            label: Glyph.OP_CLEAR_X,
            labelF: Glyph.OP_CLEAR_F,
            labelK: Glyph.NONE,
            style_class: 'panel-calc-rpn-redButton',
          },
        ],
        labels: true,
      },
    ];

    const controlButtons = [
      {
        icon: 'edit-copy-symbolic',
        handler: this._onCopyButtonClicked.bind(this),
      },
      {
        icon: 'org.gnome.Settings-symbolic',
        handler: this._onSettingsButtonClicked.bind(this),
      },
      {
        icon: 'help-about-symbolic',
        handler: this._onHelpButtonClicked.bind(this),
      },
    ];

    const keyboardBox = new St.BoxLayout({
      vertical: true,
      x_expand: true,
      y_expand: true,
      y_align: Clutter.ActorAlign.CENTER,
      style_class: 'panel-calc-rpn-BoxLayout',
    });

    keyMatrix.forEach((row) => {
      const lineKeyboardBox = new St.BoxLayout({
        vertical: false,
        x_expand: true,
        y_align: Clutter.ActorAlign.CENTER,
        style_class: 'panel-calc-rpn-BoxLayout',
      });
      row.keys.forEach((key) => {
        if (key.id !== 0 /*Processor.Processor.Key.RESERVED_NULL*/) {
          const keyButton = new Key({
            label: key.label,
            style_class: key.style_class,
            x_expand: false,
            x_align: Clutter.ActorAlign.START,
            y_align: Clutter.ActorAlign.CENTER,
            key_id: key.id,
          });
          keyButton.set_style(`font-family: ${font}`);
          keyButton.connect('clicked', this._onKeyboardDispatcher.bind(this));

          if (row.labels) {
            const placeholderBox = new St.BoxLayout({
              vertical: true,
              x_expand: true,
              y_expand: true,
              x_align: Clutter.ActorAlign.START,
              y_align: Clutter.ActorAlign.END,
              style_class: 'panel-calc-rpn-BoxLayout',
            });
            const labelBox = new St.BoxLayout({
              vertical: false,
              x_expand: true,
              y_expand: true,
              x_align: Clutter.ActorAlign.FILL,
              y_align: Clutter.ActorAlign.END,
              style_class: 'panel-calc-rpn-BoxLayout',
            });
            if (key.labelF !== '') {
              const labelFBox = new St.BoxLayout({
                vertical: false,
                x_expand: true,
                y_expand: true,
                x_align: Clutter.ActorAlign.CENTER,
                y_align: Clutter.ActorAlign.END,
                style_class: 'panel-calc-rpn-BoxLayout',
              });
              const labelF = new St.Label({
                text: key.labelF,
                x_align: Clutter.ActorAlign.CENTER,
                y_align: Clutter.ActorAlign.END,
                style_class: 'panel-calc-rpn-labelFLabel',
              });
              labelF.set_style(`font-family: ${font}`);
              labelFBox.add_actor(labelF);
              labelBox.add_actor(labelFBox);
            }
            if (key.labelK !== '') {
              const labelKBox = new St.BoxLayout({
                vertical: false,
                x_expand: true,
                y_expand: true,
                x_align: Clutter.ActorAlign.CENTER,
                y_align: Clutter.ActorAlign.END,
                style_class: 'panel-calc-rpn-BoxLayout',
              });
              const labelK = new St.Label({
                text: key.labelK,
                x_align: Clutter.ActorAlign.CENTER,
                y_align: Clutter.ActorAlign.END,
                style_class: 'panel-calc-rpn-labelKLabel',
              });
              labelK.set_style(`font-family: ${font}`);
              labelKBox.add_actor(labelK);
              labelBox.add_actor(labelKBox);
            }
            placeholderBox.add_actor(labelBox);
            placeholderBox.add_actor(keyButton);
            lineKeyboardBox.add_actor(placeholderBox);
          } else {
            lineKeyboardBox.add_actor(keyButton);
          }
        } else {
          const controlBox = new St.BoxLayout({
            vertical: false,
            x_expand: true,
            x_align: Clutter.ActorAlign.FILL,
            y_align: Clutter.ActorAlign.FILL,
            style_class: 'panel-calc-rpn-controlBoxLayout',
          });
          controlBox.add_actor(
            new St.BoxLayout({
              vertical: false,
              x_expand: true,
              x_align: Clutter.ActorAlign.CENTER,
              y_align: Clutter.ActorAlign.FILL,
            })
          );
          controlButtons.forEach((controlButton) => {
            const button = new St.Button({
              can_focus: true,
              reactive: true,
              track_hover: true,
              style_class: 'panel-calc-rpn-controlButton',
              x_align: Clutter.ActorAlign.END,
              y_align: Clutter.ActorAlign.CENTER,
            });
            button.add_actor(
              new St.Icon({
                icon_name: controlButton.icon,
              })
            );
            button.connect('clicked', controlButton.handler);
            controlBox.add_actor(button);
          });
          lineKeyboardBox.add_actor(controlBox);
        }
      });
      keyboardBox.add_actor(lineKeyboardBox);
    });

    keyboardArea.actor.add_child(keyboardBox);
  }

  private _formatDecimal(value: string): string {
    const digit = [
      '\u{2070}',
      '\u{00b9}',
      '\u{00b2}',
      '\u{00b3}',
      '\u{2074}',
      '\u{2075}',
      '\u{2076}',
      '\u{2077}',
      '\u{2078}',
      '\u{2079}',
    ];
    const string = value.split('e');
    if (string.length > 1) {
      let exp = '\u{2219}10';
      const e = string[1].split('');
      e.forEach((symbol) => {
        switch (symbol) {
          case '-':
            exp = exp.concat('\u{207b}');
            break;
          case '+':
            break;
          default:
            exp = exp.concat(digit[symbol.charCodeAt(0) - '0'.charCodeAt(0)]);
            break;
        }
      });
      return string[0].concat(exp);
    }
    return string[0];
  }

  /* private _onIndicatorSet(indicator: number, value: string): void {
      switch (indicator) {
        case Processor.Processor.Indicator.MANTISSA:
          this._mantissaIndicatorLabel.set_text(value);
          break;

        case Processor.Processor.Indicator.EXPONENT:
          this._exponentIndicatorLabel.set_text(value);
          break;

        case Processor.Processor.Indicator.REGISTER_X:
          this._xRegisterLabel.set_text(this._formatDecimal(value));
          break;

        case Processor.Processor.Indicator.REGISTER_Y:
          this._yRegisterLabel.set_text(this._formatDecimal(value));
          break;

        case Processor.Processor.Indicator.REGISTER_Z:
          this._zRegisterLabel.set_text(this._formatDecimal(value));
          break;

        case Processor.Processor.Indicator.REGISTER_T:
          this._tRegisterLabel.set_text(this._formatDecimal(value));
          break;

        case Processor.Processor.Indicator.REGISTER_X1:
          this._x1RegisterLabel.set_text(this._formatDecimal(value));
          break;

        case Processor.Processor.Indicator.MODE:
          switch (value) {
            case Processor.Processor.Mode.NORMAL_MODE:
              break;

            case Processor.Processor.Mode.EE_MODE:
              break;

            case Processor.Processor.Mode.F_MODE:
              break;

            case Processor.Processor.Mode.K_MODE:
              break;

            case Processor.Processor.Mode.E_MODE:
              break;

            default:
              break;
          }
          break;

        default:
      }
    } */

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onKeyboardDispatcher(button: typeof Key): void {
    // this._processor.keyPressed(button.keyId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onKeyboardKeyEvent(_actor: Clutter.Actor, _event: Clutter.KeyEvent): boolean {
    // let state: Clutter.ModifierType = event.get_state();
    return Clutter.EVENT_PROPAGATE; //

    /*
      // BUTTON1_MASK - the first mouse button.
      // BUTTON2_MASK - the second mouse button.
      // BUTTON3_MASK - the third mouse button.
      // BUTTON4_MASK - the fourth mouse button.
      // BUTTON5_MASK - the fifth mouse button.
      // CONTROL_MASK - the Control key.
      // HYPER_MASK - the Hyper modifier.
      // LOCK_MASK - a Lock key (depending on the modifier mapping of the X server this may either be CapsLock or ShiftLock).
      // META_MASK - the Meta modifier.
      // MOD1_MASK - normally it is the Alt key.
      // MOD2_MASK - normally it is the Numlock key.
      // MOD3_MASK - the sixth modifier key ( it depends on the modifier mapping of the X server which key is interpreted as this modifier).
      // MOD4_MASK - the seventh modifier key (it depends on the modifier mapping of the X server which key is interpreted as this modifier).
      // MOD5_MASK - the eighth modifier key ( it depends on the modifier mapping of the X server which key is interpreted as this modifier).
      // MODIFIER_MASK - a mask covering all modifier types.
      // RELEASE_MASK - not used in GDK itself.
      // SHIFT_MASK - the Shift key.
      // SUPER_MASK - the Super modifier.
      // if user has a modifier down (except capslock, numlock, alt ...)
      // then don't handle the key press here
      state &= ~Clutter.ModifierType.LOCK_MASK;
      state &= ~Clutter.ModifierType.MOD1_MASK;
      state &= ~Clutter.ModifierType.MOD2_MASK;
      state &= ~Clutter.ModifierType.SHIFT_MASK;
      state &= Clutter.ModifierType.MODIFIER_MASK;

      // if (state) return Clutter.EVENT_PROPAGATE;
      if (state !== 0) return Clutter.EVENT_PROPAGATE;

      const symbol = event.get_key_symbol();

      // Shift + Key
      if ((event.get_state() & Clutter.ModifierType.SHIFT_MASK) !== 0) {
        switch (symbol) {
          case Clutter.KEY_KP_Subtract:
            this._processor.keyPressed(Processor.Processor.Key.SIGN);
            break;

          case Clutter.KEY_KP_Enter:
            this._processor.keyPressed(Processor.Processor.Key.SWAP);
            break;

          default:
            return Clutter.EVENT_PROPAGATE;
        }
        return Clutter.EVENT_STOP;
      }

      // Key & Numlock + Key
      switch (symbol) {
        case Clutter.KEY_KP_0:
        case Clutter.KEY_KP_Insert:
          this._processor.keyPressed(Processor.Processor.Key.ZERO);
          break;

        case Clutter.KEY_KP_1:
        case Clutter.KEY_KP_End:
          this._processor.keyPressed(Processor.Processor.Key.ONE);
          break;

        case Clutter.KEY_KP_2:
        case Clutter.KEY_KP_Down:
          this._processor.keyPressed(Processor.Processor.Key.TWO);
          break;

        case Clutter.KEY_KP_3:
        case Clutter.KEY_KP_Page_Down:
          this._processor.keyPressed(Processor.Processor.Key.THREE);
          break;

        case Clutter.KEY_KP_4:
        case Clutter.KEY_KP_Left:
          this._processor.keyPressed(Processor.Processor.Key.FOUR);
          break;

        case Clutter.KEY_KP_5:
        case Clutter.KEY_KP_Begin:
          this._processor.keyPressed(Processor.Processor.Key.FIVE);
          break;

        case Clutter.KEY_KP_6:
        case Clutter.KEY_KP_Right:
          this._processor.keyPressed(Processor.Processor.Key.SIX);
          break;

        case Clutter.KEY_KP_7:
        case Clutter.KEY_KP_Home:
          this._processor.keyPressed(Processor.Processor.Key.SEVEN);
          break;

        case Clutter.KEY_KP_8:
        case Clutter.KEY_KP_Up:
          this._processor.keyPressed(Processor.Processor.Key.EIGHT);
          break;

        case Clutter.KEY_KP_9:
        case Clutter.KEY_KP_Page_Up:
          this._processor.keyPressed(Processor.Processor.Key.NINE);
          break;

        case Clutter.KEY_KP_Decimal:
        case Clutter.KEY_KP_Delete:
          this._processor.keyPressed(Processor.Processor.Key.POINT);
          break;

        case Clutter.KEY_KP_Add:
          this._processor.keyPressed(Processor.Processor.Key.PLUS);
          break;

        case Clutter.KEY_KP_Subtract:
          this._processor.keyPressed(Processor.Processor.Key.MINUS);
          break;

        case Clutter.KEY_KP_Multiply:
          this._processor.keyPressed(Processor.Processor.Key.MULTIPLY);
          break;

        case Clutter.KEY_KP_Divide:
          this._processor.keyPressed(Processor.Processor.Key.DIVIDE);
          break;

        case Clutter.KEY_KP_Enter:
          this._processor.keyPressed(Processor.Processor.Key.PUSH);
          break;

        case Clutter.KEY_BackSpace:
          this._processor.keyPressed(Processor.Processor.Key.CLEAR_X);
          break;

        case Clutter.KEY_Alt_L:
          this._processor.keyPressed(Processor.Processor.Key.F);
          break;

        default:
          return Clutter.EVENT_PROPAGATE;
      }

      return Clutter.EVENT_STOP;
      */
  }

  private _onSettingsButtonClicked(): void {
    this._menu.toggle();
    this._extension.openPreferences();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onHelpButtonClicked(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onCopyButtonClicked(): void {}
}
