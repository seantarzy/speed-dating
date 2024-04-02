import { useEffect, useState } from "react";
import "./App.css";
import useLocalStorage from "./components/useLocalStorage";
import useGameTimer from "./components/useGameTimer";
import {
  CENTURY_MAP,
  CENTURY_MAP_FREQ_BY_WEIGHT,
  CenturyKey,
  DAYS_STRINGS,
  DayKey,
  MONTH_MAP,
  MonthKey,
  isValidCenturyKey,
} from "./data/date_maps";
import { SpecialDate, famousDates } from "./data/famous_dates";
import { CenturyData, Month } from "./data/types";
import { FadeInText } from "./components/FadeInText";

// referencing https://www.almanac.com/how-find-day-week

const GAME_DURATION = 100;

const FEEDBACK_DURATION = 2;
const FADE_IN_DURATION = 1.5;

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

const isMobile = window.innerWidth < 768;

const DESC_TRUNCATE_LENGTH = isMobile ? 100 : 250;

function App() {
  const [monthKey, setMonthKey] = useState<MonthKey | null>(null);
  const [specialDateGame, setSpecialDateGame] = useState(true);
  const [day, setDay] = useState(0);
  const [year, setYear] = useState(0);
  const [correctDayOfWeekIdx, setCorrectDayOfWeekIdx] = useState<number | null>(
    null
  );
  const [famousDateDescription, setFamousDateDescription] =
    useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [userSelectedIdx, setUserSelecedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useLocalStorage("highScore", "0");
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [readableDate, setReadableDate] = useState<string>("");
  const isDateGenerated = monthKey !== null && day !== 0 && year !== 0;

  function calculateDayOfWeek(
    monthKey: MonthKey,
    centuryKey: CenturyKey,
    day: number,
    yearAddend: string
  ) {
    if (monthKey === null || centuryKey === null || day === 0) {
      return;
    }

    const monthData: Month = MONTH_MAP[monthKey];
    const monthName = monthData["name"];
    const dateString = `${monthName} ${day}, ${centuryKey}${yearAddend}`;
    setReadableDate(dateString);
    const date = new Date(dateString);
    const dayOfWeekIdx = (date.getDay() + 1) % 7;

    setCorrectDayOfWeekIdx(dayOfWeekIdx);
  }

  const onTimeUp = () => {
    setIsGameOver(true);
    resetState();
    setGameStarted(false);
    if (score > parseInt(highScore)) {
      setHighScore(score.toString());
    }
  };

  const { timeLeft, startTimer, resetTimer } = useGameTimer(
    GAME_DURATION,
    onTimeUp
  );

  function generateMonthKey() {
    return Math.floor(Math.random() * 12) + 1;
  }

  function generateDay(daysLimit: number) {
    return Math.floor(Math.random() * daysLimit) + 1;
  }

  function getLastTwoDigitsOfYear(century: CenturyKey) {
    const centuryData: CenturyData = CENTURY_MAP[century];
    const minYearLastTwoDigits = centuryData.min ? centuryData.min % 100 : 0; // Calculate the last two digits of the min year if specified
    const yearRange = 100 - minYearLastTwoDigits; // Adjust the range for generating the last two digits

    // Generate a random number within the adjusted range and add it to the minYearLastTwoDigits
    const yearWithinCentury =
      Math.floor(Math.random() * yearRange) + minYearLastTwoDigits;
    return yearWithinCentury;
  }
  function generateYear() {
    const randomIshCentury =
      CENTURY_MAP_FREQ_BY_WEIGHT[
        Math.floor(Math.random() * CENTURY_MAP_FREQ_BY_WEIGHT.length)
      ];
    if (!isValidCenturyKey(randomIshCentury)) {
      throw new Error(`Invalid century key: ${randomIshCentury}`);
    }
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
    let stateResetId: number;
    let fadeInDateId: number;
    if (userSelectedIdx !== null) {
      stateResetId = setTimeout(() => {
        resetState();
        generateRandomDate();
      }, FEEDBACK_DURATION * 1000);

      fadeInDateId = setTimeout(() => {
        setReadableDate("");
        if (specialDateGame) {
          setFamousDateDescription("");
        }
      }, FADE_IN_DURATION * 1000);
    }

    return () => {
      clearTimeout(stateResetId);
      clearTimeout(fadeInDateId);
    };
  }, [userSelectedIdx]);

  function generateRandomDate() {
    let generatedMonthKey: MonthKey;
    let generatedDay: DayKey;
    let generatedYear: number;
    if (specialDateGame) {
      const specialDate: SpecialDate =
        famousDates[Math.floor(Math.random() * famousDates.length)];
      const { month, day, year, description } = specialDate;

      generatedMonthKey = month;
      setMonthKey(generatedMonthKey as MonthKey);

      generatedDay = day;
      setDay(generatedDay);
      generatedYear = year;
      setYear(generatedYear);

      setFamousDateDescription(description);
    } else {
      generatedMonthKey = generateMonthKey();
      setMonthKey(generatedMonthKey as MonthKey);

      const monthData = MONTH_MAP[generatedMonthKey];

      generatedDay = generateDay(monthData["days"]);
      setDay(generatedDay);

      generatedYear = generateYear();
      setYear(generatedYear);
    }

    const randomCenturKey = Math.floor(generatedYear / 100) as CenturyKey;
    // the year addend for 1856 would be '56'

    const yearAddend = generatedYear.toString(10).slice(2);
    calculateDayOfWeek(
      generatedMonthKey as MonthKey,
      randomCenturKey,
      generatedDay,
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
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setIsGameOver(false);
    setScore(0);
    resetTimer();
    startTimer();
    generateRandomDate();
  };

  const handleGameStart = (specialDate: boolean) => {
    setSpecialDateGame(specialDate);
    startGame();
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-8 rounded-md">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-8 md:mt-24 flex flex-col justify-center items-center">
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
          <div className="flex flex-col gap-6 items-center max-h-72 md:max-h-none mb-24 md:mb-16">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-1 items-center justify-center">
                <div className="h-4">
                  {!!readableDate && <FadeInText>{readableDate}</FadeInText>}
                </div>
              </div>
              <div>
                {specialDateGame && (
                  <div className="text-center text-sm font-semibold text-gray-800 h-20 flex items-center">
                    {famousDateDescription && (
                      <FadeInText>
                        {famousDateDescription.length > DESC_TRUNCATE_LENGTH
                          ? `${famousDateDescription.substring(
                              0,
                              DESC_TRUNCATE_LENGTH
                            )}...`
                          : famousDateDescription}
                      </FadeInText>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="md:w-2/3">
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
                          disabled={userSelectedIdx !== null}
                          className={`px-2 py-1 md:px-4 md:py-2 font-semibold rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
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
              <div
                className={`md:h-10 text-center py-4 font-bold text-lg ${
                  isCorrect ? "text-green-500" : "text-red-500"
                } animate-pulse`}
              >
                {isCorrect !== null
                  ? !!isCorrect
                    ? "CORRECT!!"
                    : "NOT Quite!"
                  : "        "}
              </div>
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
                : "Welcome to 'Speed Dating'!"}
            </div>
            <br />
            <div className="text-lg font-semibold text-green-600">
              {score > parseInt(highScore)
                ? "New High Score!"
                : `High Score: ${highScore}`}
            </div>
          </div>
          <br />
          <div className="flex flex-col gap-1 justify-center items-center">
            <button
              onClick={() => handleGameStart(false)}
              className="px-4 py-2 font-semibold rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-opacity-75 bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-600"
            >
              {isGameOver ? "Play Again (regular)" : "Start Game (regular)"}
            </button>
            <br />
            <button
              onClick={() => handleGameStart(true)}
              className="px-4 py-2 font-semibold rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-opacity-75 bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-600"
            >
              {isGameOver ? "Play Again (special)" : "Start Game (special)"}
            </button>
          </div>
        </div>
      )}
      <br />
      <ReferenceLink />
    </div>
  );
}

export default App;
