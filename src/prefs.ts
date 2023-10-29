/* prefs.ts
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 * SPDX-FileCopyrightText: 2023 Roman Tyukh
 *
 */

'use strict';

import Adw from 'gi://Adw';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

import NCPrefsInterface from './modules/prefs.interface.js';

export default class NCPreferences extends ExtensionPreferences {
  /**
   * Fill the preferences window with preferences.
   *
   * If this method is overridden, `getPreferencesWidget()` will NOT be called.
   *
   * @param {Adw.PreferencesWindow} window - the preferences window
   */
  fillPreferencesWindow(window: Adw.PreferencesWindow) {
    window.add(new NCPrefsInterface(window, this));
  }
}
