import { useState } from 'react';

type timerReturn = [
    {
        times: Array<number>;
        savedTimes: Array<number>;
        round: number;
        active: boolean;
    },
    {
        nextRound: () => void;
        setTimeAt: (n: number, amount: number) => void;
        setTimeAtN: (start: number, num: number, time: number) => void;
        setSavedTimes: React.Dispatch<React.SetStateAction<number[]>>;
        setRounds: (n: number) => void;
        setRound: (n: number) => void;
        setTimes: React.Dispatch<React.SetStateAction<number[]>>;
        startTimer: () => void;
        stopTimer: () => void;
    }
];

export function useTimer({ onRoundOver } : { onRoundOver: () => void }) : timerReturn {
    const [times, setTimes] = useState([25*60, 5*60, 25*60, 5*60, 25*60, 5*60, 25*60, 25*60]);
    const [savedTimes, setSavedTimes] = useState<Array<number>>([]);
    const [round, _setRound] = useState(0);
    const [active, setActive] = useState(false);
    const [timerDate, setTimerDate] = useState(() => new Date());
    const [, setTimerFlipper] = useState(true);

    const setRounds = (n : number) => {
        setTimes((new Array(n).fill(1500)));
        _setRound(0);
    };

    const setRound = (n : number) => {
        if(n >= times.length)
            n = times.length-1;
        if(n < 0)
            n = 0;
        _setRound(n);
    }

    const setTimeAt = (n : number, amount: number) => {
        const copy = times.slice();
        copy[n] = amount;
        setTimes(copy);
    };

    const setTimeAtN = (start : number, num : number, time : number) => {
        setTimes(r => r.map((r,i) => {
            if((i-start) % num === 0 || ( num === 0 && start === i)) {
                return time;
            } else {
                return r;
            }
        }));
    }

    const stopTimer = () => {
        setActive(false);
    };

    const nextRound = () => {    
        onRoundOver();
        if(round !== times.length - 1) { // if not last timer
            _setRound(round + 1);
        } else {
            stopTimer();
        }
    };

    const startTimer = () => {
        setTimerDate(new Date());
        setActive(true);
        setTimeout(() => {
            setTimerFlipper(f => !f);
        }, 1000);
    }

    const currentDate = new Date();
    if (active && (currentDate.getTime() - timerDate.getTime()) >= 1000) {
        const time = times[round];
        if(!time) {
            nextRound();
        } else {
            setTimeAt(round, time-1);
        }
        startTimer();
    }

    return [
        {
            times,
            savedTimes,
            round,
            active
        }, 
        {
            nextRound,
            setTimeAt,
            setTimeAtN,
            setSavedTimes,
            setRounds,
            setRound,
            startTimer,
            stopTimer,
            setTimes
        }
    ];
}