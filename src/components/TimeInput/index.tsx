import React, { useState, useRef, ComponentProps } from 'react';
import './timeinput.css';

type valueChangeFunction = (n : number) => void;

interface TimeProps extends ComponentProps<'input'> {
    value? : number; 
    onValueChange? : valueChangeFunction;
    required? : boolean;
}

function TimeInput({ value, onValueChange, required, ...props } : TimeProps ) {
    // const [remainingTime, setRemainingTime] = useState(1500);
    const inputRef = useRef<HTMLInputElement>(null);
    const [remainingTimeText, setRemainingTimeText] = useState('');
    const [lastValue, setLastValue] = useState<number>();

    const calculateString = (n : number) : string => {
        let minutes = Math.floor(n / 60);
        const seconds = n % 60;
        const hours = Math.floor(minutes / 60);
        minutes -= hours*60;
        return `${hours ? `${hours}h ` : ''}${minutes ? `${minutes}m ` : '' }${seconds}s`;
    };

    const calculateTime = (s : string) : number => {
        const parts : Array<string> = s.split(' ');
        
        let timeCalc = 0;
        if(parts.length > 0) {
            parts.forEach((p,i) => {
                let multiplier = 0;
                if(p.length > 0) {
                    switch(p.charAt(p.length-1).toLowerCase()) {
                        case 'h':
                            multiplier = 60*60;
                        break;
                        case  'm':
                            multiplier = 60;
                        break;
                        case 's': 
                            multiplier = 1;
                        break;
                    }
                    if(multiplier === 0) {
                        timeCalc = 0;
                        return;
                    }
                    const num = Number(p.substring(0, p.length-1));
                    timeCalc += num * multiplier || 0;
                }
            });
        }
        return timeCalc;
    };

    const alertValueChange = (s : string) => {
        const v = calculateTime(s);
        onValueChange && onValueChange(v);
    }

    if((value || value === 0) && value >= 0 && value !== lastValue) {
        setLastValue(value);
        const remainingText = calculateString(value);
        setRemainingTimeText(remainingText);
    }

    return <span className='time-input'>
        <input type="text" value={remainingTimeText} onChange={e => setRemainingTimeText(e.target.value)} onBlur={e => alertValueChange(e.target.value)} ref={inputRef} {...props}/>
        {
            <span className='help-text'>Format 8h 4m 2s</span>
            // (invalid && <span className='error-text'>Invalid unit</span>)
        }
    </span>;

}

export default TimeInput;


// const translateTimeSave = (s : string) => {
//     // Split times
//     const parts : Array<string> = s.split(' ');
//     let invalidt = false;
//     let reconstructed = '';

//     if(inputRef.current)
//         inputRef.current.setCustomValidity(invalid ? 'invalid' : '');

//     // For each split, check the unit and mult to seconds
//     if(parts.length > 0) {
//         let timeCalc = 0;
//         parts.forEach((p,i) => {
//             let multiplier = 0;
//             if(p.length > 0) {
//                 switch(p.charAt(p.length-1).toLowerCase()) {
//                     case 'h':
//                         multiplier = 60*60;
//                     break;
//                     case  'm':
//                         multiplier = 60;
//                     break;
//                     case 's': 
//                         multiplier = 1;
//                     break;
//                     default: 
//                         invalidt = true;
//                     break;
//                 }
//                 // if you just type in a unit
//                 if(!invalidt && p.length === 1) invalidt = true;

//                 const num = Number(p.substring(0, p.length-1));

//                 // if term before end unit is NaN (letters inside, etc)
//                 if (isNaN(num)) invalidt = true;

//                 // only add the time if it's valid
//                 if(!invalidt) {
//                     timeCalc += num * multiplier || 0;
//                 }
//             }
//             reconstructed += `${i>0 ? ' ' : ''}${p}`;
//         });

//         // Set times, fire up the value changed

//         // setRemainingTime(timeCalc);
//         if(!reconstructed && required) invalidt = true;
//         setRemainingTimeText(reconstructed);
//         setInvalid(invalidt);
//         onValueChanged && onValueChanged(timeCalc);
//     }
// };