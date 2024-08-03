import React, { useState, useEffect, useCallback } from 'react';

import { Page, TimeInput } from '../../components';
import Insert from './insert';

import './interval.css';

function Interval() {
    const [remainingTimeArr, setRemainingTimeArr] = useState([25*60, 5*60, 25*60, 5*60, 25*60, 5*60, 25*60, 25*60]);
    const [savedTimeArr, setSavedTimeArr] = useState<Array<number>>([]);
    const [selectedRound, setSelectedRound] = useState<number>(0);

    const [timerActive, setTimerActive] = useState(false);

    const changeRounds = (n : number) => {
        setSelectedRound(n ? 0 : n);
        setRemainingTimeArr((new Array(n).fill(1500)));
    };

    const changeSelectedRound = (n : number) => {
        if(n >= remainingTimeArr.length)
            n = remainingTimeArr.length-1;
        if(n < 0)
            n = 0;
        setSelectedRound(n);
    }

    const setRemainingTime = useCallback((n : number, amount: number) => {
        const copy = remainingTimeArr.slice();
        copy[n] = amount;
        setRemainingTimeArr(copy);
    }, [remainingTimeArr]);

    const setupRounds = (start : number, num : number, time : number) => {
        setRemainingTimeArr(r => r.map((r,i) => {
            if((i-start) % num === 0 || ( num === 0 && start === i)) {
                return time;
            } else {
                return r;
            }
        }));
    }

    const startTimer = () => {
        setTimerActive(true)
    };

    const stopTimer = () => {
        setTimerActive(false);
    }

    const advanceTimer = useCallback(() => {    
        const a = new Audio('/timer-alert.mp3');
        a.play();    
        if(selectedRound !== remainingTimeArr.length - 1) { // if not last timer
            setSelectedRound(selectedRound + 1);
        } else {
            setTimerActive(false);
        }
    }, [selectedRound, remainingTimeArr]);

    useEffect(() => {
        if(timerActive) setTimeout(() => { 
            const time = remainingTimeArr[selectedRound];
            if(!time) {
                advanceTimer();
            } else {
                setRemainingTime(selectedRound, time-1);
            }
        }, 1000);
    }, [selectedRound, setRemainingTime, remainingTimeArr, timerActive, advanceTimer]);

    return <Page>
        <div>
            <h1>
                Interval Timer
            </h1>
            <hr/>
            <p>
                Rounds <input type="text" value={remainingTimeArr.length || ''} readOnly={timerActive} onChange={e => changeRounds(Number(e.target.value))}/>
            </p>
            {remainingTimeArr.length > 0 && !timerActive && <Insert changeRounds={changeRounds} onSet={setupRounds} readOnly={timerActive}/>}
            <div className='round-list'>
                {
                    (() => {
                        const roundEle : Array<React.ReactNode> = [];
                        for(let i=0; i<remainingTimeArr.length; i++) {
                            roundEle.push(<div className={selectedRound===i ? 'active-round' : ''} key={`${i}-${remainingTimeArr[i]}`}>
                                <span>
                                    Round {i+1}
                                    {   
                                        !timerActive && <span className='round-buttons'>
                                            <input type='button' value='+' onClick={() => setRemainingTimeArr([...remainingTimeArr.slice(0, i+1), 0, ...remainingTimeArr.slice(i+1, remainingTimeArr.length)])}/>
                                            <input type='button' value='-' onClick={() => setRemainingTimeArr(remainingTimeArr.filter((r, ri) => ri !== i))} />
                                        </span>
                                    }
                                </span>
                                <TimeInput value={remainingTimeArr[i]} readOnly={timerActive} onValueChange={v => setRemainingTime(i, v)} required/>
                                {(selectedRound !== i && !timerActive && <input type='button' value='Select' onClick={() => changeSelectedRound(i)}></input>) || <span/>}
                            </div>);
                        }
                        return roundEle;
                    })()
                }
            </div>
            <p>
                { 
                    (!timerActive && remainingTimeArr.length > 0 && <input className='big-button' type='button' value='Start' onClick={() => startTimer()}/>)
                    || (timerActive && <input className='big-button' type='button' value='Stop' onClick={() => stopTimer()}/>)
                }
                {
                    remainingTimeArr.length > 0 && !timerActive && <span>
                            <input className='big-button' type='button' value='Save' onClick={() =>  setSavedTimeArr(remainingTimeArr)}/>
                            <input className='big-button' type='button' value={`Load${savedTimeArr.length ? `(${savedTimeArr.length})` : '(empty)'}`} onClick={() =>  setRemainingTimeArr(savedTimeArr)}/>
                        </span>

                }
            </p>
        </div>
    </Page>;
}

export default Interval;