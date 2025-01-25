import { useState } from "react";

export interface VisualizerOptionsType {
    width: number;
    height: number;
    fps: number;
    shuffleTimer: number;
    lock: boolean;
    shuffleCounter: number;
}

export default function VisualizerOptions({onUpdate} : {onUpdate : (o : VisualizerOptionsType) => void}) {
    const [width, setWidth] = useState('1600');
    const [height, setHeight] = useState('900');
    const [fps, setFps] = useState('30');
    const [shuffleTimer, setShuffleTimer] = useState('15');
    const [lock, setLock] = useState(false);
    const [shuffleCounter, setShuffleCounter] = useState(0);

    const [started, setStarted] = useState(false);

    const update = (o : { lock ?: boolean, shuffleCounter?: number}) => {
        const current = {
            width: Number(width) || 1600,
            height: Number(height) || 900,
            fps: Number(fps) || 30,
            shuffleTimer: Number(shuffleTimer) || 15,
            lock: lock,
            shuffleCounter: shuffleCounter
        };
        onUpdate({...current, ...o});
        setStarted(true);

        if(!Number(width)) setWidth('1600');
        if(!Number(height)) setHeight('900');
        if(!Number(fps)) setFps('30');
        if(!Number(shuffleTimer)) setShuffleTimer('15');
    }

    return <>
            <div>
            <label htmlFor='widthInput'>Render width: </label>
            <input type='text' id="widthInput" value={width} onChange={e => setWidth(e.target.value)}/><br/>

            <label htmlFor='heightInput'>Render height: </label>
            <input type='text' id="heightInput" value={height} onChange={e => setHeight(e.target.value)}/><br/>

            <label htmlFor='fpsInput'>FPS: </label>
            <input type='text' id="fpsInput" value={fps} onChange={e => setFps(e.target.value)}/><br/>
            
            <label htmlFor='shuffleInput'>Shuffle Timer: </label>
            <input type='text' id="shuffleInput" value={shuffleTimer} onChange={e => setShuffleTimer(e.target.value)}/><br/>
        </div>
        <div>
            <label htmlFor='lockInput'>Lock: </label>
            <input type='checkbox' id="lockInput" value={shuffleTimer} onChange={e => {
                update({lock: e.target.checked});
                setLock(e.target.checked);
            }}/>
        </div>

        <div>
            <input type='button' value={started ? 'Restart' : 'Start'} onClick={() => update()}/>
            {started && <input type='button' value='Shuffle' onClick={() => {
                update({shuffleCounter: shuffleCounter + 1});
                setShuffleCounter(shuffleCounter + 1);
            }}/>}
            <br/><br/>
            {started && <>Click canvas to take up browser content</>}
        </div>
    </>;
}