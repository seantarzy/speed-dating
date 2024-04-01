import { useEffect, useState, useCallback } from "react";

function useGameTimer(initialTime = 100, onEnd = () => {}) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [restart, setRestart] = useState(false);

  const decrementTimeLeft = useCallback(() => {
    setTimeLeft((prevTime) => prevTime - 1);
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const interval = setInterval(decrementTimeLeft, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, timeLeft, decrementTimeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsRunning(false);
      onEnd();
    }
  }, [timeLeft, onEnd]);

  const startTimer = () => {
    setIsRunning(true);
    setRestart(false);
  };
  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setTimeLeft(initialTime);
    setRestart(true);
  };

  // Use an effect to restart the timer based on the restart flag
  useEffect(() => {
    if (restart) {
      setIsRunning(true);
    }
  }, [restart]);

  return { timeLeft, startTimer, stopTimer, resetTimer };
}

export default useGameTimer;
