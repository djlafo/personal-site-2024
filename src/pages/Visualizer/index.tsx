import { useRef, useState } from 'react';

import { Page } from '../../components';

// Visualizer
import {supported} from './butterchurn';

import VisualizerOptions, {VisualizerOptionsType} from './VisualizerOptions';
import useVisualizerCore from './VisualizerCore';

import './visualizer.css';

export default function Visualizer() {
    const {shuffle, create, setLock} = useVisualizerCore();
    const [fullScreen, setFullScreen] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const start = (o : VisualizerOptionsType) => {
        create({...o, canvas: canvasRef.current});
    }

    return <Page>
        <div className='visualizer'>
            {
                (!supported && <>Browser not supported</>) ||
                (!navigator.mediaDevices && <>Cannot get media source</>) ||
                <>
                    <h2>
                        Added using <a href="https://github.com/jberg/butterchurn" target="_blank" rel="noreferrer">Butterchurn</a>
                    </h2>
                    <VisualizerOptions onLock={setLock} onShuffle={shuffle} onStart={o => start(o)}/>
                    <canvas ref={canvasRef} onClick={() => setFullScreen(fs => !fs)} className={fullScreen ? 'full' : ''}/>
                </>    
            }
        </div>
    </Page>;
}