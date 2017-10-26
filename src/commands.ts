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
  | 'admin_end_game'
  | 'admin_save_game'
  | 'admin_load_game';

const keyMap: { [key: string]: number } = {
  a: uinput.KEY_A,
  b: uinput.KEY_B,
  x: uinput.KEY_X,
  y: uinput.KEY_Y,
  start: uinput.KEY_S,
  select: uinput.KEY_E,
  l1: uinput.KEY_1,
  l2: uinput.KEY_2,
  r1: uinput.KEY_3,
  r2: uinput.KEY_4,
  up: uinput.KEY_UP,
  down: uinput.KEY_DOWN,
  left: uinput.KEY_LEFT,
  right: uinput.KEY_RIGHT,
  admin_end_game: uinput.KEY_END, // aTODO Combo
  admin_save_game: uinput.KEY_SAVE,
  admin_load_game: uinput.KEY_REFRESH
};

export function getCommandRegex(): RegExp {
  return /^(a|b|x|y|start|select|l1|l2|r1|r2|up|down|left|right|admin_end_game|admin_save_game|admin_load_game)$/i;
}

export function getSetupOptions(): uinput.ISetupOptions {
  return { EV_KEY: Object.keys(keyMap).map((key: string): any => keyMap[key]) } as uinput.ISetupOptions;
}

export function getCreateOptions(): uinput.ICreateOptions {
  const id: uinput.ICreateID = { bustype: uinput.BUS_USB, vendor: 0x1234, product: 0x5678, version: 1 };

  return { name: 'myuinput', id } as uinput.ICreateOptions;
}

export function toKey(ircInput: allowedInputs): number {
  return keyMap[ircInput];
}
