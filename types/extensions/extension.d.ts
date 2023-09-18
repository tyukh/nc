/* extension.d.ts
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 * SPDX-FileCopyrightText: 2023 Roman Tyukh
 *
 */

declare module 'resource:///org/gnome/shell/extensions/extension.js' {
  import {ExtensionBase} from 'resource:///org/gnome/shell/extensions/sharedInternals.js';

  export class Extension extends ExtensionBase {
    static lookupByUUID(uuid: string): object;

    static defineTranslationFunctions(url: string): {
      /**
       * Translate `str` using the extension's gettext domain
       *
       * @param {string} str - the string to translate
       *
       * @returns {string} the translated string
       */
      gettext: (str: string) => string;

      /**
       * Translate `str` and choose plural form using the extension's
       * gettext domain
       *
       * @param {string} str - the string to translate
       * @param {string} strPlural - the plural form of the string
       * @param {number} n - the quantity for which translation is needed
       *
       * @returns {string} the translated string
       */
      ngettext: (str: string, strPlural: string, n: number) => string;

      /**
       * Translate `str` in the context of `context` using the extension's
       * gettext domain
       *
       * @param {string} context - context to disambiguate `str`
       * @param {string} str - the string to translate
       *
       * @returns {string} the translated string
       */
      pgettext: (context: string, str: string) => string;
    };

    enable(): void;
    disable(): void;

    /**
     * Open the extension's preferences window
     */
    openPreferences(): void;
  }

  export const {
    gettext,
    ngettext,
    pgettext,
  }: {
    /**
     * Translate `str` using the extension's gettext domain
     *
     * @param {string} str - the string to translate
     *
     * @returns {string} the translated string
     */
    gettext: (str: string) => string;

    /**
     * Translate `str` and choose plural form using the extension's
     * gettext domain
     *
     * @param {string} str - the string to translate
     * @param {string} strPlural - the plural form of the string
     * @param {number} n - the quantity for which translation is needed
     *
     * @returns {string} the translated string
     */
    ngettext: (str: string, strPlural: string, n: number) => string;

    /**
     * Translate `str` in the context of `context` using the extension's
     * gettext domain
     *
     * @param {string} context - context to disambiguate `str`
     * @param {string} str - the string to translate
     *
     * @returns {string} the translated string
     */
    pgettext: (context: string, str: string) => string;
  };
}
