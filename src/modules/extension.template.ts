// import Clutter from 'gi://Clutter';
// import St from 'gi://St';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

// import {NCKey} from './extension.controls.js';

export type NCTemplateObjects =
  | NCTemplatePopupSubMenuMenuItem
  | NCTemplatePopupSeparatorMenuItem
  | NCTemplatePopupBaseMenuItem;

export type NCTemplateTypes =
  | PopupMenu.PopupSubMenuMenuItem
  | PopupMenu.PopupSeparatorMenuItem
  | PopupMenu.PopupBaseMenuItem;

export type NCTemplateTypeOfs =
  | typeof PopupMenu.PopupSubMenuMenuItem
  | typeof PopupMenu.PopupSeparatorMenuItem
  | typeof PopupMenu.PopupBaseMenuItem;

export type NCTemplate = NCTemplateObjects[] | NCTemplateObjects;

export interface NCTemplateObject {
  type: NCTemplateTypeOfs;
  include?: Array<NCTemplateObjects> | NCTemplateObjects;
}

export interface NCTemplatePopupSubMenuMenuItem extends NCTemplateObject {
  label?: string;
  ornament?: PopupMenu.Ornament;
}

export interface NCTemplatePopupSeparatorMenuItem extends Omit<NCTemplateObject, 'include'> {}

export interface NCTemplatePopupBaseMenuItem extends NCTemplateObject {
  ornament?: PopupMenu.Ornament;
  params?: object;
}

export const Template = (): NCTemplate => [
  {
    type: PopupMenu.PopupSubMenuMenuItem,
    label: _('Registers | Memory'),
    ornament: PopupMenu.Ornament.HIDDEN,
    include: [],
  },
  {
    type: PopupMenu.PopupSeparatorMenuItem,
  },
  {
    type: PopupMenu.PopupBaseMenuItem,
    ornament: PopupMenu.Ornament.HIDDEN,
    params: {
      reactive: false,
      can_focus: false,
      activate: false,
      style_class: 'NC-PopupBaseMenuItem',
    },
    include: [],
  },
  {
    type: PopupMenu.PopupSeparatorMenuItem,
  },
  {
    type: PopupMenu.PopupBaseMenuItem,
    ornament: PopupMenu.Ornament.HIDDEN,
    params: {
      reactive: false,
      can_focus: false,
      activate: false,
      style_class: 'NC-PopupBaseMenuItem',
    },
    include: [],
  },
  {
    type: PopupMenu.PopupSeparatorMenuItem,
  },
  {
    type: PopupMenu.PopupBaseMenuItem,
    ornament: PopupMenu.Ornament.HIDDEN,
    params: {
      reactive: false,
      can_focus: false,
      activate: false,
      style_class: 'NC-PopupBaseMenuItem',
    },
    include: [],
  },
];
