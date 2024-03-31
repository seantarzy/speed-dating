import { useEffect, useState } from "react";
import "./App.css";
import useLocalStorage from "./components/useLocalStorage";

// referencing https://www.almanac.com/how-find-day-week

interface Month {
  name: string;
  keyConstant: number;
  leapYearKeyConstant: number;
  days: number;
}
const MONTH_MAP: Record<number, Month> = {
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

const DAY_MAP = {
  0: "Saturday",
  1: "Sunday",
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
};

// Correctly obtaining the type of the values in DAY_MAP
type DayNames = (typeof DAY_MAP)[keyof typeof DAY_MAP];

// Extracting the values from DAY_MAP to create an array of strings
const DAYS_STRINGS: DayNames[] = Object.values(DAY_MAP);

type centuryData = {
  valueKey: number;
  weight: number;
  min?: number;
};
const CENTURY_MAP = {
  17: { valueKey: 4, weight: 5, min: 1753 },
  18: { valueKey: 2, weight: 7 },
  19: { valueKey: 0, weight: 50 },
  20: { valueKey: 6, weight: 7 },
  21: { valueKey: 4, weight: 2 },
  22: { valueKey: 2, weight: 2 },
  23: { valueKey: 0, weight: 4 },
  24: { valueKey: 6, weight: 1 },
};

const CENTURY_MAP_FREQ_BY_WEIGHT = Object.entries(CENTURY_MAP).reduce(
  (acc, [century, { weight }]) => {
    return [...acc, ...Array(weight).fill(parseInt(century))];
  },
  [] as number[]
);

type centuryKey = keyof typeof CENTURY_MAP;

type monthKey = keyof typeof MONTH_MAP;

const GAME_DURATION = 100;

const FEEDBACK_DURATION = 2;

const isLeapYear = (year: number) => {
  return year % 4 === 0;
};

function ReferenceLink() {
  return (
    <div className="text-center text-md font-semibold text-gray-800">
      <a
        href="https://www.almanac.com/how-find-day-week"
        target="_blank"
        rel="noreferrer"
      >
        Reference: How to Find the Day of the Week
      </a>
    </div>
  );
}

function App() {
  const [monthKey, setMonthKey] = useState<monthKey | null>(null);
  const [day, setDay] = useState(0);
  const [year, setYear] = useState(0);
  const [correctDayOfWeekIdx, setCorrectDayOfWeekIdx] = useState<number | null>(
    null
  );
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [userSelectedIdx, setUserSelecedIdx] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useLocalStorage("highScore", "0");
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const isDateGenerated = monthKey !== null && day !== 0 && year !== 0;
  function calculateDayOfWeek(
    monthKey: monthKey,
    centuryKey: centuryKey,
    day: number,
    yearAddend: number
  ) {
    if (
      monthKey === null ||
      centuryKey === null ||
      day === 0 ||
      yearAddend === 0
    ) {
      return;
    }

    const monthKeyConstant = isLeapYear(year)
      ? MONTH_MAP[monthKey]["leapYearKeyConstant"]
      : MONTH_MAP[monthKey]["keyConstant"];

    const dayOfWeekIdx =
      (CENTURY_MAP[centuryKey]["valueKey"] +
        yearAddend +
        Math.floor(yearAddend / 4) +
        monthKeyConstant +
        day) %
      7;
    setCorrectDayOfWeekIdx(dayOfWeekIdx);
  }

  function decrementTimeLeft() {
    setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
  }
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsGameOver(true);
      resetState();
      setGameStarted(false);
      if (score > parseInt(highScore)) {
        setHighScore(score.toString());
      }
      setTimeLeft(GAME_DURATION);
    }
  }, [timeLeft, score]);

  useEffect(() => {
    const timer = setInterval(decrementTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  function generateMonthKey() {
    return Math.floor(Math.random() * 12) + 1;
  }

  function generateDay(daysLimit: number) {
    return Math.floor(Math.random() * daysLimit) + 1;
  }

  function getLastTwoDigitsOfYear(century: centuryKey) {
    // 1753 is the first year of the Gregorian calendar
    const centuryData: centuryData = CENTURY_MAP[century];
    const lowerBound = centuryData.min || 0;
    return Math.floor(Math.random() * (100 - lowerBound)) + lowerBound;
  }

  function generateYear() {
    const randomIshCentury = CENTURY_MAP_FREQ_BY_WEIGHT[
      Math.floor(Math.random() * CENTURY_MAP_FREQ_BY_WEIGHT.length)
    ] as centuryKey;
    const randomYear = getLastTwoDigitsOfYear(randomIshCentury);
    return randomIshCentury * 100 + randomYear;
  }

  function resetState() {
    setMonthKey(null);
    setDay(0);
    setYear(0);
    setCorrectDayOfWeekIdx(null);
    setIsCorrect(null);
    setUserSelecedIdx(null);
  }

  useEffect(() => {
    if (userSelectedIdx !== null) {
      setTimeout(() => {
        resetState();
        generateRandomDate();
      }, FEEDBACK_DURATION * 1000);
    }
  }, [userSelectedIdx]);

  function generateRandomDate() {
    const randomMonthKey = generateMonthKey();
    setMonthKey(randomMonthKey as monthKey);

    const randomDay = generateDay(MONTH_MAP[randomMonthKey]["days"]);
    setDay(randomDay);

    const randomYear = generateYear();
    setYear(randomYear);

    const randomCenturKey = Math.floor(randomYear / 100) as centuryKey;
    // the year addend for 1856 would be '56'
    const yearAddend = parseInt(randomYear.toString(10).slice(2));

    calculateDayOfWeek(
      randomMonthKey as monthKey,
      randomCenturKey,
      randomDay,
      yearAddend
    );
  }

  const handleDaySelect = (dayIndex: number) => {
    setUserSelecedIdx(dayIndex);
    if (!isDateGenerated) {
      console.error("No correct day of the week has been calculated");
      return;
    }

    if (dayIndex === correctDayOfWeekIdx) {
      setIsCorrect(true);
      setScore((prevScore) => prevScore + 1);
    } else {
      setIsCorrect(false);
      setScore((prevScore) => prevScore - 1);
      console.log("Incorrect");
    }
  };

  const startGame = () => {
    setGameStarted(true);
    generateRandomDate();
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col justify-center items-center p-8 rounded-md">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
        Select the Day of the Week for any given date
      </h1>

      {gameStarted ? (
        <>
          <div>
            Time Left: <span>{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </div>
          <div>
            Score: <span>{score}</span>
          </div>
          <br />
          <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-row gap-1 items-center justify-center">
              {!!monthKey && (
                <>
                  <div>Current Date:</div>
                  <div>{MONTH_MAP[monthKey]["name"]}</div>
                  <div>{day}</div>,<div>{year}</div>
                </>
              )}
            </div>
            <div className="w-2/3 min-h-96">
              <div className="div flex flex-row items-center justify-center flex-wrap">
                {isDateGenerated ? (
                  DAYS_STRINGS.map((dayString, index) => {
                    return (
                      <div
                        className="border-sky-100 p-2 md:p-4 relative"
                        key={index}
                      >
                        <button
                          key={index}
                          onClick={() => handleDaySelect(index)}
                          className={`px-1 py-[0.5px] md:px-4 md:py-2 font-semibold rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
                            correctDayOfWeekIdx === index && isCorrect !== null
                              ? "bg-green-500 text-white focus:ring-green-500" // Always highlight the correct day in green
                              : userSelectedIdx === index
                              ? "bg-red-500 text-white focus:ring-red-500" // Highlight the user's incorrect selection in red
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400" // Default styling
                          }`}
                        >
                          {dayString}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="gap-4 place-items-center flex flex-wrap justify-center">
                    {Array.from({ length: 7 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-6 w-20 md:h-10 md:w-24 bg-gray-200 animate-pulse rounded-lg"
                      ></div>
                    ))}
                  </div>
                )}
              </div>
              {isCorrect !== null && (
                <div
                  className={`text-center py-4 font-bold text-lg ${
                    isCorrect ? "text-green-500" : "text-red-500"
                  } animate-pulse`}
                >
                  {isCorrect ? "CORRECT!!" : "NOT Quite!"}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div>
          <div
            className={`text-center text-2xl font-bold text-gray-800 ${
              isGameOver ? "text-red-900" : ""
            }`}
          >
            <div>
              {isGameOver
                ? `Game Over! Your score was ${score}`
                : "Welcome to the Day of the Week Game!"}
            </div>
            <br />
            <div className="text-lg font-semibold text-green-600">
              {score > parseInt(highScore)
                ? "New High Score!"
                : `High Score: ${highScore}`}
            </div>
          </div>
          <br />
          <button
            onClick={startGame}
            className="px-4 py-2 font-semibold rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-opacity-75 bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-600"
          >
            {isGameOver ? "Play Again" : "Start Game"}
          </button>
        </div>
      )}
      <br />
      <ReferenceLink />
    </div>
  );
}

export default App;
