import { useCallback, useEffect, useRef, useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);
  const [buttons, setButtons] = useState([]);
  const [currentCount, setCurrentCount] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const intervalRef = useRef(null);
  const [status, setStatus] = useState({
    title: "Let's Play",
    color: 'text-black',
  });
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const handleClick = (e) => {
      setCursor({ x: e.clientX, y: e.clientY });
      setShowCursor(true);

      setTimeout(() => setShowCursor(false), 200);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const playGame = useCallback(() => {
    if (count <= 0) return;
    clearValues();
    setStatus({ title: "Let's Play", color: 'text-black' });
    setIsPlay(true);
    generateButtons(count);
    startTime();
  }, [count]);

  const generateButtons = (numButtons) => {
    const newButtons = Array.from({ length: numButtons }, (_, i) => ({
      id: i,
      left: `${(Math.random() * 90).toFixed(2)}%`,
      top: `${(Math.random() * 90).toFixed(2)}%`,
      removing: false,
    }));
    setButtons(newButtons);
  };

  const startTime = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTime(0);
    intervalRef.current = setInterval(() => setTime((timer) => timer + 10), 10);
  };

  const handleClickPoint = useCallback(
    (id) => {
      if (id !== currentCount) {
        setStatus({ title: 'GAME OVER', color: 'text-red-500' });
        clearValues();
        return;
      }

      setCurrentCount(currentCount + 1);
      setButtons((prevButtons) =>
        prevButtons.map((button) =>
          button.id === id ? { ...button, removing: true } : button
        )
      );

      setTimeout(() => {
        setButtons((prevButtons) =>
          prevButtons.filter((button) => button.id !== id)
        );
        if (buttons.length === 1) {
          setStatus({ title: 'ALL CLEARED', color: 'text-green-500' });
          clearValues();
        }
      }, 500);
    },
    [currentCount, buttons]
  );

  const clearValues = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentCount(0);
  };

  const formatTime = (timer) => {
    const milliseconds = Math.floor((timer % 1000) / 100);
    const seconds = Math.floor(timer / 1000)
      .toString()
      .slice(-2);
    return `${seconds}:${milliseconds}`;
  };

  return (
    <div className='container flex flex-col mx-auto py-6 gap-4 z-1'>
      <h1 className={`font-bold text-2xl ${status.color}`}>{status.title}</h1>
      <div className='flex flex-row gap-4 -z-11'>
        <h3>Points:</h3>
        <input
          className='border border-black rounded-md px-2 z-1'
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </div>
      <div className='flex flex-row gap-4'>
        <h3>Time:</h3>
        <p>{formatTime(time)}s</p>
      </div>
      <button
        className='border w-40 bg-gray-100 border-black rounded-sm hover:bg-gray-200 z-1 '
        onClick={playGame}
      >
        {!isPlay ? 'Play' : 'Reset'}
      </button>
      <div className='relative w-full border border-black h-[70vh] z-50'>
        {buttons.map((button) => (
          <button
            key={button.id}
            className={`absolute border border-black w-10 h-10 rounded-full bg-white transition-all duration-500 ease-in-out text-lg font-bold ${
              button.removing ? 'focus:bg-red-400 focus:duration-1000' : ''
            }`}
            style={{
              left: button.left,
              top: button.top,
              zIndex: count - button.id,
            }}
            onClick={() => handleClickPoint(button.id)}
          >
            {button.id + 1}
          </button>
        ))}
      </div>

      {showCursor && (
        <div
          className=' w-12 h-12 rounded-full absolute border border-black -translate-x-1/2 -translate-y-1/2  z-[9999] bg-transparent'
          style={{ left: cursor.x, top: cursor.y }}
        />
      )}
    </div>
  );
}

export default App;
