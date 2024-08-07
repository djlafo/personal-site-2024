import React from 'react';

import { TimeInput } from '../../components';

interface RoundProps {
    activeRound: boolean;
    time: number;
    roundNumber: number;
    readOnly: boolean;
    setTime: (v: number) => void;
    removeTime: () => void;
    addTime: () => void;
    setRound: () => void;
}

function RoundBox({ activeRound, time, roundNumber, readOnly, setTime, removeTime, addTime, setRound} : RoundProps) {
    return <div className={activeRound ? 'active-round' : ''}>
        <span>
            Round {roundNumber+1}
            {   
                !readOnly && <span className='round-buttons'>
                    <input type='button' value='+' onClick={() => addTime()}/>
                    <input type='button' value='-' onClick={() => removeTime()} />
                </span>
            }
        </span>
        <TimeInput value={time} readOnly={readOnly} onValueChange={v => setTime(v)} required/>
        {(!readOnly && !activeRound && <input type='button' value='Select' onClick={() => setRound()}></input>) || <span/>}
    </div>;
}

export default RoundBox;