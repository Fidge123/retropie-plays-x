import * as uinput from 'uinput';

export type allowedInputs =
  | 'a'
  | 'b'
  | 'x'
  | 'y'
  | 'start'
  | 'select'
  | 'l1'
  | 'l2'
  | 'r1'
  | 'r2'
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'special'
  | 'esc'
  | 'enter'
  | 'admin_end_game'
  | 'admin_save_game'
  | 'admin_load_game';

const keyMap: { [key: string]: number } = {
  a: uinput.BTN_0,
  b: uinput.BTN_1,
  x: uinput.BTN_2,
  y: uinput.BTN_3,
  start: uinput.BTN_START,
  select: uinput.BTN_SELECT,
  l1: uinput.BTN_4,
  l2: uinput.BTN_5,
  r1: uinput.BTN_6,
  r2: uinput.BTN_7,
  up: uinput.BTN_DPAD_UP,
  down: uinput.BTN_DPAD_DOWN,
  left: uinput.BTN_DPAD_LEFT,
  right: uinput.BTN_DPAD_RIGHT,
  special: uinput.BTN_8,
  esc: uinput.KEY_ESC,
  enter: uinput.KEY_ENTER,
  admin_end_game: uinput.KEY_END, // aTODO Combo
  admin_save_game: uinput.KEY_SAVE,
  admin_load_game: uinput.KEY_REFRESH
};

export function getCommandRegex(): RegExp {
  return new RegExp(`^(${Object.keys(keyMap).join('|')})$`, 'i');
}

export function getSetupOptions(): uinput.ISetupOptions {
  return { EV_KEY: Object.keys(keyMap).map((key: string): any => keyMap[key]) } as uinput.ISetupOptions;
}

export function getCreateOptions(): uinput.ICreateOptions {
  const absmax: number[] = [];
  absmax[uinput.ABS_X] = 255;
  absmax[uinput.ABS_Y] = 255;
  const absmin: number[] = [];
  absmin[uinput.ABS_X] = 0;
  absmin[uinput.ABS_Y] = 0;
  const absfuzz: number[] = [];
  absfuzz[uinput.ABS_X] = 0;
  absfuzz[uinput.ABS_X] = 0;
  const absflat: number[] = [];
  absflat[uinput.ABS_X] = 15;
  absflat[uinput.ABS_X] = 15;

  const id: uinput.ICreateID = {
    bustype: uinput.BUS_USB,
    vendor: 0x045e,
    product: 0x028e,
    version: 0x0114,
    ff_effects_max: 1,
    absmax,
    absmin,
    absfuzz,
    absflat
  };

  return { name: 'Microsoft X-Box 360 pad', id } as uinput.ICreateOptions;
}

export function toKey(ircInput: allowedInputs): number {
  return keyMap[ircInput];
}
