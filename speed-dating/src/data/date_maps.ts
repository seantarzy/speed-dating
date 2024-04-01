import { DayName, Month } from "./types";

export const MONTH_MAP: Record<number, Month> = {
  1: { name: "January", keyConstant: 1, leapYearKeyConstant: 0, days: 31 },
  2: { name: "February", keyConstant: 4, leapYearKeyConstant: 3, days: 28 },
  3: { name: "March", keyConstant: 4, leapYearKeyConstant: 4, days: 31 },
  4: { name: "April", keyConstant: 0, leapYearKeyConstant: 0, days: 30 },
  5: { name: "May", keyConstant: 2, leapYearKeyConstant: 2, days: 31 },
  6: { name: "June", keyConstant: 5, leapYearKeyConstant: 5, days: 30 },
  7: { name: "July", keyConstant: 0, leapYearKeyConstant: 0, days: 31 },
  8: { name: "August", keyConstant: 3, leapYearKeyConstant: 3, days: 31 },
  9: { name: "September", keyConstant: 6, leapYearKeyConstant: 6, days: 30 },
  10: { name: "October", keyConstant: 1, leapYearKeyConstant: 1, days: 31 },
  11: { name: "November", keyConstant: 4, leapYearKeyConstant: 4, days: 30 },
  12: { name: "December", keyConstant: 6, leapYearKeyConstant: 6, days: 31 },
};

export const DAY_MAP: Record<number, DayName> = {
  0: "Saturday",
  1: "Sunday",
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
};

export const DAYS_STRINGS: DayName[] = Object.values(DAY_MAP);

export const CENTURY_BEGINNING_KEY: number = 17;
export const CENTURY_BEGINNING: number = 1700;
export const CENTURY_MAP = {
  17: { valueKey: 4, weight: 10, min: 1753 },
  18: { valueKey: 2, weight: 12 },
  19: { valueKey: 0, weight: 75 },
  20: { valueKey: 6, weight: 10 },
  21: { valueKey: 4, weight: 2 },
  22: { valueKey: 2, weight: 2 },
  23: { valueKey: 0, weight: 4 },
  24: { valueKey: 6, weight: 1 },
};

export type CenturyKey = keyof typeof CENTURY_MAP;

export type MonthKey = keyof typeof MONTH_MAP;

export type DayKey = keyof typeof DAY_MAP;

export const CENTURY_MAP_FREQ_BY_WEIGHT = Object.entries(CENTURY_MAP).reduce(
  (acc, [century, { weight }]) => {
    return [...acc, ...Array(weight).fill(parseInt(century))];
  },
  [] as CenturyKey[]
);
console.log(CENTURY_MAP_FREQ_BY_WEIGHT);
export const isValidCenturyKey = (key: number): key is CenturyKey => {
  return CENTURY_MAP.hasOwnProperty(key);
};
