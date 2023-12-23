export const enum NCOpCodes {
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

  POINT = 10,
  SIGN = 11,
  ENTER_E = 12,

  PUSH = 20,
  SWAP = 21,
  CLEAR_X = 22,
  BACK_X = 23,

  PLUS = 30,
  MINUS = 31,
  MULTIPLY = 32,
  DIVIDE = 33,

  NOP = 90,

  RESERVED_NULL = 9999,
}

export type NCRegisters = {x: string; y: string; z: string; t: string; x0: string};
export type NCMemory = {m0: string; m1: string; m2: string; m3: string};
export type NCError = {type: string; message: string};
