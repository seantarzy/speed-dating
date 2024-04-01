export type MonthName =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

export type DayName =
  | "Saturday"
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday";

export type WeekdayNum = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export interface Month {
  name: MonthName;
  keyConstant: number;
  leapYearKeyConstant: number;
  days: number;
}

export type CenturyData = {
  valueKey: number;
  weight: number;
  min?: number;
};
