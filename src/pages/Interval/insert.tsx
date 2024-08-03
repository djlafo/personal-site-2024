import React, { useState } from 'react';
import { TimeInput } from '../../components';

type onSetFunction = (start : number, num : number, time : number) => void;
type roundsFunction = (n: number) => void;

function Insert({onSet, changeRounds, readOnly} : {onSet: onSetFunction, changeRounds: roundsFunction, readOnly?: boolean}) {
    const [num, setNum] = useState(0);
    const [time, setTime] = useState(0);
    const [start, setStart] = useState(1);
    const [hidden, setHidden] = useState(true);

    const fireOnSet = () => {
        onSet(start-1, num, time);
    }

    const toggleOptions = () => {
        setHidden(!hidden);
    }

    const pomodoro = () => {
        changeRounds(8);
        onSet(0,2,25*60);
        onSet(1,2,5*60);
        onSet(7,0,25*60);
    }

    return <div>
        <input type="button" onClick={toggleOptions} value={`${hidden ? 'Show' : 'Hide'} Advanced Options...`}/>
        <div hidden={hidden} className='interval-insert-box'>
            <p>
                <input disabled={readOnly} type="button" value="Set" onClick={fireOnSet} /> every <input min="0" readOnly={readOnly} value={num} onChange={e => setNum(Number(e.target.value))} type="number"/>th round to <TimeInput value={time} onValueChange={setTime}/> starting at cell <input min="1" readOnly={readOnly} value={start} onChange={e => setStart(Number(e.target.value))} type="number"/>
            </p>
            <p>
                <input disabled={readOnly} type="button" value="Pomodoro" onClick={pomodoro}/>
            </p>
        </div>
    </div>;
}

export default Insert;