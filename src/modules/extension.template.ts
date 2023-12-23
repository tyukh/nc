import Clutter from 'gi://Clutter';
import St from 'gi://St';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

import {NCKey, NCPlaceholder, NCValue} from './extension.controls.js';
import {type NCTemplate} from './extension.templates.js';

export const NCTemplateInstance = (): NCTemplate => [
  // <!- Registers, Memory
  {
    type: PopupMenu.PopupSubMenuMenuItem,
    arguments: [_('Registers | Memory'), false],
    prepare: (control: PopupMenu.PopupSubMenuMenuItem): void =>
      control.setOrnament(PopupMenu.Ornament.HIDDEN),
    include: [
      {
        type: St.BoxLayout,
        arguments: [
          {
            vertical: false,
            x_expand: true,
            y_expand: true,
            x_align: Clutter.ActorAlign.FILL,
            y_align: Clutter.ActorAlign.CENTER,
            opacity: 150,
            style_class: 'NC-BoxLayout',
          },
        ],
        include: [
          // <!- Registers
          {
            type: St.BoxLayout,
            arguments: [
              {
                vertical: true,
                x_expand: true,
                y_expand: true,
                x_align: Clutter.ActorAlign.START,
                y_align: Clutter.ActorAlign.END,
                opacity: 150,
                style_class: 'NC-stack1BoxLayout',
              },
            ],
            include: [
              {
                type: NCValue,
                arguments: [
                  {
                    label: 'X0',
                    prefix: false,
                  },
                ],
                property: '_registerX0',
              },
              {
                type: NCValue,
                arguments: [
                  {
                    label: 'T',
                    prefix: true,
                  },
                ],
                property: '_registerT',
              },
              {
                type: NCValue,
                arguments: [
                  {
                    label: 'Z',
                    prefix: true,
                  },
                ],
                property: '_registerZ',
              },
              {
                type: NCValue,
                arguments: [
                  {
                    label: 'Y',
                    prefix: true,
                  },
                ],
                property: '_registerY',
              },
              {
                type: NCValue,
                arguments: [
                  {
                    label: 'X',
                    prefix: true,
                  },
                ],
                property: '_registerX',
              },
            ],
          },
          // -!> Registers
          {
            type: St.BoxLayout,
            arguments: [
              {
                vertical: true,
                x_expand: true,
                y_expand: true,
                x_align: Clutter.ActorAlign.FILL,
                y_align: Clutter.ActorAlign.END,
                opacity: 150,
                style_class: 'NC-stack2BoxLayout',
              },
            ],
          },
          // <!- Memory
          {
            type: St.BoxLayout,
            arguments: [
              {
                vertical: true,
                x_expand: true,
                y_expand: true,
                x_align: Clutter.ActorAlign.END,
                y_align: Clutter.ActorAlign.END,
                opacity: 150,
                style_class: 'NC-stack1BoxLayout',
              },
            ],
            include: [
              {
                type: NCValue,
                arguments: [
                  {
                    label: 'M0',
                    prefix: false,
                  },
                ],
              },
              {
                type: NCValue,
                arguments: [
                  {
                    label: 'M1',
                    prefix: false,
                  },
                ],
              },
              {
                type: NCValue,
                arguments: [
                  {
                    label: 'M2',
                    prefix: false,
                  },
                ],
              },
              {
                type: NCValue,
                arguments: [
                  {
                    label: 'M3',
                    prefix: false,
                  },
                ],
              },
            ],
          },
          // -!> Memory
        ],
      },
    ],
  },
  // -!> Registers, Memory
  {
    type: PopupMenu.PopupSeparatorMenuItem,
    arguments: [],
  },
  // <!- Indicator
  {
    type: PopupMenu.PopupBaseMenuItem,
    arguments: [
      {
        reactive: false,
        can_focus: false,
        activate: false,
        style_class: 'NC-PopupBaseMenuItem',
      },
    ],
    prepare: (control: PopupMenu.PopupBaseMenuItem): void =>
      control.setOrnament(PopupMenu.Ornament.HIDDEN),
    include: [],
  },
  // -!> Indicator
  {
    type: PopupMenu.PopupSeparatorMenuItem,
    arguments: [],
  },
  // <!- Settings, About, Copy
  {
    type: PopupMenu.PopupBaseMenuItem,
    arguments: [
      {
        reactive: false,
        can_focus: false,
        activate: false,
        style_class: 'NC-PopupBaseMenuItem',
      },
    ],
    prepare: (control: PopupMenu.PopupBaseMenuItem): void =>
      control.setOrnament(PopupMenu.Ornament.HIDDEN),
    include: {
      type: St.BoxLayout,
      arguments: [
        {
          vertical: false,
          x_expand: true,
          y_expand: true,
          x_align: Clutter.ActorAlign.FILL,
          y_align: Clutter.ActorAlign.FILL,
          style_class: 'NC-BoxLayout',
        },
      ],
      include: [
        {
          type: St.BoxLayout,
          arguments: [
            {
              vertical: false,
              x_expand: true,
              y_expand: true,
              x_align: Clutter.ActorAlign.FILL,
              y_align: Clutter.ActorAlign.CENTER,
              style_class: 'NC-BoxLayout',
            },
          ],
        },
        // <!- Copy button
        {
          type: St.Button,
          arguments: [
            {
              can_focus: true,
              reactive: true,
              track_hover: true,
              style_class: 'NC-controlButton',
              x_align: Clutter.ActorAlign.END,
              y_align: Clutter.ActorAlign.CENTER,
            },
          ],
          signal: [
            {
              signal: 'clicked',
              callback: '_onCopyButtonClicked',
            },
          ],
          include: {
            type: St.Icon,
            arguments: [
              {
                icon_name: 'edit-copy-symbolic',
              },
            ],
          },
        },
        // -!> Copy button
        // ---
        // <!- Settings button
        {
          type: St.Button,
          arguments: [
            {
              can_focus: true,
              reactive: true,
              track_hover: true,
              style_class: 'NC-controlButton',
              x_align: Clutter.ActorAlign.END,
              y_align: Clutter.ActorAlign.CENTER,
            },
          ],
          signal: [
            {
              signal: 'clicked',
              callback: '_onSettingsButtonClicked',
            },
          ],
          include: {
            type: St.Icon,
            arguments: [
              {
                icon_name: 'org.gnome.Settings-symbolic',
              },
            ],
          },
        },
        // -!> Settings button
        // ---
        // <!- Info button
        {
          type: St.Button,
          arguments: [
            {
              can_focus: true,
              reactive: true,
              track_hover: true,
              style_class: 'NC-controlButton',
              x_align: Clutter.ActorAlign.END,
              y_align: Clutter.ActorAlign.CENTER,
            },
          ],
          signal: [
            {
              signal: 'clicked',
              callback: '_onInfoButtonClicked',
            },
          ],
          include: {
            type: St.Icon,
            arguments: [
              {
                icon_name: 'help-about-symbolic',
              },
            ],
          },
        },
        // -!> Info button
      ],
    },
  },
  // -!> Settings, About, Copy
  {
    type: PopupMenu.PopupSeparatorMenuItem,
    arguments: [],
  },
  // <!- Keyboard
  {
    type: PopupMenu.PopupBaseMenuItem,
    prepare: (control: PopupMenu.PopupBaseMenuItem): void =>
      control.setOrnament(PopupMenu.Ornament.HIDDEN),
    arguments: [
      {
        reactive: false,
        can_focus: false,
        activate: false,
        style_class: 'NC-PopupBaseMenuItem',
      },
    ],
    include: {
      type: St.BoxLayout,
      arguments: [
        {
          vertical: true,
          x_expand: true,
          y_expand: true,
          y_align: Clutter.ActorAlign.CENTER,
          style_class: 'NC-BoxLayout',
        },
      ],
      include: [
        // <!- Keyboard Line 1
        {
          type: St.BoxLayout,
          arguments: [
            {
              vertical: false,
              x_expand: true,
              y_align: Clutter.ActorAlign.CENTER,
              style_class: 'NC-BoxLayout',
            },
          ],
          include: [
            // <!- Keyboard Row 1
            {
              type: NCPlaceholder,
              arguments: [],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: 'F', // MODE F
                    style_class: 'NC-yellowButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.F,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 1
            // ---
            // <!- Keyboard Row 2
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: 'sin', // SINE
                  label_right: '[x]', // INTEGER
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: '7', // SEVEN
                    style_class: 'NC-grayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.SEVEN,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 2
            // ---
            // <!- Keyboard Row 3
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: 'cos', // COSINE
                  label_right: '{x}', // DECIMAL
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: '8', // EIGHT
                    style_class: 'NC-grayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.EIGHT,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 3
            // ---
            // <!- Keyboard Row 4
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: 'tg', // TANGENT
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: '9', // NINE
                    style_class: 'NC-grayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.NINE,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 4
            // ---
            // <!- Keyboard Row 5
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: '\u{221A}', // SQUARE ROOT
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: '-', // MINUS
                    style_class: 'NC-grayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.MINUS,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 5
            // ---
            // <!- Keyboard Row 6
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: '1/x', // ONE DIVIDE X
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: '\u{00F7}', // DIVIDE
                    style_class: 'NC-grayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.DIVIDE,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 6
          ],
        },
        // -!> Keyboard Line 1
        // ---
        // <!- Keyboard Line 2
        {
          type: St.BoxLayout,
          arguments: [
            {
              vertical: false,
              x_expand: true,
              y_align: Clutter.ActorAlign.CENTER,
              style_class: 'NC-BoxLayout',
            },
          ],
          include: [
            // <!- Keyboard Row 1
            {
              type: NCPlaceholder,
              arguments: [],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: 'K', // -!> K MODE
                    style_class: 'NC-blueButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.K,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 1
            // ---
            // <!- Keyboard Row 2
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: 'sin\u{207B}\u{00B9}', // ARCSINE
                  label_right: '|x|', // ABSOLUTE
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: '4', // FOUR
                    style_class: 'NC-grayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.FOUR,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 2
            // ---
            // <!- Keyboard Row 3
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: 'cos\u{207B}\u{00B9}', // ARCCOSINE
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: '5', // FIVE
                    style_class: 'NC-grayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.FIVE,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 3
            // ---
            // <!- Keyboard Row 4
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: 'tg\u{207B}\u{00B9}', // ARCTANGENT
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: '6', // SIX
                    style_class: 'NC-grayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.SIX,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 4
            // ---
            // <!- Keyboard Row 5
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: '\u{03C0}', // PI
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: '+', // PLUS
                    style_class: 'NC-grayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.PLUS,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 5
            // ---
            // <!- Keyboard Row 6
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: 'x\u{00B2}', // X POWER TWO
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: '\u{00D7}', // MULTIPLY
                    style_class: 'NC-grayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.MULTIPLY,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 6
          ],
        },
        // -!> Keyboard Line 2
        // ---
        // <!- Keyboard Line 3
        {
          type: St.BoxLayout,
          arguments: [
            {
              vertical: false,
              x_expand: true,
              y_align: Clutter.ActorAlign.CENTER,
              style_class: 'NC-BoxLayout',
            },
          ],
          include: [
            // <!- Keyboard Row 1
            {
              type: NCPlaceholder,
              arguments: [],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: _('M\u{2192}X'), // MEMORY TO X
                    style_class: 'NC-dimgrayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.MX,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 1
            // ---
            // <!- Keyboard Row 2
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: 'e\u{02E3}', // E POWER X
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: '1', // ONE
                    style_class: 'NC-darkgrayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.ONE,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 2
            // ---
            // <!- Keyboard Row 3
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: 'lg', // DECIMAL LOGARITHM
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: '2', // TWO
                    style_class: 'NC-darkgrayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.TWO,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 3
            // ---
            // <!- Keyboard Row 4
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: 'ln', // NATURAL LOGARITHM
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: '3', // THREE
                    style_class: 'NC-darkgrayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.THREE,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 4
            // ---
            // <!- Keyboard Row 5
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: 'x\u{02b8}', // X POWER Y
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: '\u{27F7}', // SWAP
                    style_class: 'NC-grayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.SWAP,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 5
            // ---
            // <!- Keyboard Row 6
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: _('Bx'), // BACK X
                  label_right: _('rnd'), // RANDOM
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: _('E\u{2191}'), // PUSH X (ENTER)
                    style_class: 'NC-grayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.PUSH,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 6
          ],
        },
        // -!> Keyboard Line 3
        // ---
        // <!- Keyboard Line 4
        {
          type: St.BoxLayout,
          arguments: [
            {
              vertical: false,
              x_expand: true,
              y_align: Clutter.ActorAlign.CENTER,
              style_class: 'NC-BoxLayout',
            },
          ],
          include: [
            // <!- Keyboard Row 1
            {
              type: NCPlaceholder,
              arguments: [],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: _('X\u{2192}M'), // X TO MEMORY
                    style_class: 'NC-dimgrayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.XM,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 1
            // ---
            // <!- Keyboard Row 2
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: '10\u{02E3}', // TEN POWER X
                  label_right: _('CK'), // CLEAR MODE K
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: '0', // ZERO
                    style_class: 'NC-darkgrayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.ZERO,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 2
            // ---
            // <!- Keyboard Row 3
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: '\u{2941}', // CYCLE
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: '.', // POINT
                    style_class: 'NC-grayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.POINT,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 3
            // ---
            // <!- Keyboard Row 4
            {
              type: NCPlaceholder,
              arguments: [],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: '/-/', // SIGN
                    style_class: 'NC-grayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.SIGN,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 4
            // ---
            // <!- Keyboard Row 5
            {
              type: NCPlaceholder,
              arguments: [],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: _('EE'), // ENTER EXPONENT
                    style_class: 'NC-grayButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.ENTER_E,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 5
            // ---
            // <!- Keyboard Row 6
            {
              type: NCPlaceholder,
              arguments: [
                {
                  label_left: _('CF'), // CLEAR F MODE
                },
              ],
              include: {
                type: NCKey,
                arguments: [
                  {
                    label: _('CX'), // CLEAR X
                    style_class: 'NC-redButton',
                    x_expand: false,
                    x_align: Clutter.ActorAlign.START,
                    y_align: Clutter.ActorAlign.CENTER,
                    key_id: NCKeys.CLEAR_X,
                  },
                ],
                signal: [
                  {
                    signal: 'clicked',
                    callback: '_onKeyboardDispatcher',
                  },
                ],
              },
            },
            // -!> Keyboard Row 6
          ],
        },
        // -!> Keyboard Line 4
      ],
    },
  },
  // -!> Keyboard
];

export const enum NCKeys {
  ZERO = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,

  POINT,
  SIGN,
  ENTER_E,

  PUSH,
  SWAP,
  CLEAR_X,
  BACK_X,

  PLUS,
  MINUS,
  MULTIPLY,
  DIVIDE,

  F,
  K,

  MX,
  XM,

  RESERVED_NULL = 9999,
}
