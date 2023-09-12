/* prefs.ts
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 * SPDX-FileCopyrightText: 2022 Roman Tyukh
 *
 */

'use strict';

import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk?version=4.0';
import GObject from 'gi://GObject';

import {
  ExtensionPreferences,
  gettext as _,
} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class NCPreferences extends ExtensionPreferences {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static _preferencesInterface: any;

  /**
   * @param {object} metadata - metadata passed in when loading the extension
   */
  constructor(metadata: object) {
    super(metadata);

    if (NCPreferences._preferencesInterface === undefined)
      NCPreferences._preferencesInterface = GObject.registerClass(
        {
          GTypeName: 'PreferencesInterface',
          Template: this.dir.get_child('ui').get_child('prefs.ui').get_uri()!,
          InternalChildren: ['font', 'launcherBox', 'launcherPosition'],
        },
        class PreferencesInterface extends Adw.PreferencesPage {
          private _settings: Gio.Settings;

          private readonly _font!: Gtk.FontButton;
          private readonly _launcherBox!: Gtk.Scale;
          private readonly _launcherPosition!: Gtk.Scale;

          constructor(window: Adw.PreferencesWindow, prefs: ExtensionPreferences, properties = {}) {
            super(properties);

            this._settings = prefs.getSettings();

            this._font!.set_font(this._settings.get_string('font'));
            this._launcherBox!.set_value(
              ['left', 'center', 'right'].indexOf(this._settings.get_string('launcher-box')!)
            );
            this._launcherPosition!.set_value(
              [0, -1].indexOf(this._settings.get_enum('launcher-position'))
            );

            /*
                this._launcherBox.set_format_value_func(([], value) => {
                    return ([_("left"), _("center"), _("right")]).at(value);
                });
                this._launcherPosition.set_format_value_func(([], value) => {
                    return ([_("first"), _("last")]).at(value);
                });
          */

            this._launcherBox!.set_format_value_func(() => {
              return _('icon');
            });
            this._launcherPosition!.set_format_value_func(() => {
              return _('icon');
            });

            window.connect('close-request', () => {
              this._launcherBox!.set_format_value_func(null);
              this._launcherPosition!.set_format_value_func(null);
            });

            [_('left'), _('center'), _('right')].forEach((label, index) => {
              this._launcherBox!.add_mark(index, Gtk.PositionType.BOTTOM, label);
            });
            [_('first'), _('last')].forEach((label, index) => {
              this._launcherPosition!.add_mark(index, Gtk.PositionType.BOTTOM, label);
            });
          }

          private _onFontSet(): void {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
            this._settings.set_string('font', this._font!.get_font_family()?.get_name()!);
          }

          private _onLauncherBoxChange(): void {
            this._settings.set_string(
              'launcher-box',
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              ['left', 'center', 'right'].at(this._launcherBox!.get_value())!
            );
          }

          private _onLauncherPositionChange(): void {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this._settings.set_enum(
              'launcher-position',
              [0, -1].at(this._launcherPosition!.get_value())!
            );
          }
        }
      );
  }

  /**
   * Fill the preferences window with preferences.
   *
   * If this method is overridden, `getPreferencesWidget()` will NOT be called.
   *
   * @param {Adw.PreferencesWindow} window - the preferences window
   */
  fillPreferencesWindow(window: Adw.PreferencesWindow) {
    window.add(new NCPreferences._preferencesInterface(window, this));
  }
}
