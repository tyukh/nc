import Clutter from 'gi://Clutter';
import St from 'gi://St';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

import {NCValue} from './extension.controls.js';
import type * as Types from './extension.templates.js';

const Template = (): Types.NCTemplate => [
  {
    type: PopupMenu.PopupSubMenuMenuItem,
    label: _('Registers | Memory'),
    ornament: PopupMenu.Ornament.HIDDEN,
    include: [
      {
        type: St.BoxLayout,
        params: {
          vertical: false,
          x_expand: true,
          y_expand: true,
          x_align: Clutter.ActorAlign.FILL,
          y_align: Clutter.ActorAlign.CENTER,
          opacity: 150,
          style_class: 'NC-BoxLayout',
        },
        include: [
          {
            type: St.BoxLayout,
            params: {
              vertical: true,
              x_expand: true,
              y_expand: true,
              x_align: Clutter.ActorAlign.START,
              y_align: Clutter.ActorAlign.END,
              opacity: 150,
              style_class: 'NC-stack1BoxLayout',
            },
            include: [
              {
                type: NCValue,
                params: {
                  label: 'X0',
                  prefix: false,
                },
              },
              {
                type: NCValue,
                params: {
                  label: 'T',
                  prefix: true,
                },
              },
              {
                type: NCValue,
                params: {
                  label: 'Z',
                  prefix: true,
                },
              },
              {
                type: NCValue,
                params: {
                  label: 'Y',
                  prefix: true,
                },
              },
              {
                type: NCValue,
                params: {
                  label: 'X',
                  prefix: true,
                },
              },
            ],
          },
          {
            type: St.BoxLayout,
            params: {
              vertical: true,
              x_expand: true,
              y_expand: true,
              x_align: Clutter.ActorAlign.FILL,
              y_align: Clutter.ActorAlign.END,
              opacity: 150,
              style_class: 'NC-stack2BoxLayout',
            },
          },
          {
            type: St.BoxLayout,
            params: {
              vertical: true,
              x_expand: true,
              y_expand: true,
              x_align: Clutter.ActorAlign.END,
              y_align: Clutter.ActorAlign.END,
              opacity: 150,
              style_class: 'NC-stack1BoxLayout',
            },
            include: [
              {
                type: NCValue,
                params: {
                  label: 'M0',
                  prefix: false,
                },
              },
              {
                type: NCValue,
                params: {
                  label: 'M1',
                  prefix: false,
                },
              },
              {
                type: NCValue,
                params: {
                  label: 'M2',
                  prefix: false,
                },
              },
              {
                type: NCValue,
                params: {
                  label: 'M3',
                  prefix: false,
                },
              },
            ],
          },
        ],
      },
    ],
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

export default Template;
