/* augmentations.d.ts
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 * SPDX-FileCopyrightText: 2023 Roman Tyukh
 *
 */

import type Clutter from '@gi-types/clutter10';

declare module '@gi-types/clutter10' {
  interface Actor {
    get actor(): Clutter.Actor;
  }
}

declare module '@gi-types/gobject2' {
  interface GObject {
    connectObject(...args: []): void;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  let TYPE_JSOBJECT: GObject.GType<object>;
}

declare module '@gi-types/st1' {
  interface BoxLayout {
    add(actor: Clutter.Actor, props?: unknown): void;
  }
}
