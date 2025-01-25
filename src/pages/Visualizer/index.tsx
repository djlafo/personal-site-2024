import { useRef, useState } from 'react';

import { Page } from '../../components';

// Visualizer
import {supported} from './butterchurn';

import VisualizerOptions, {VisualizerOptionsType} from './VisualizerOptions';
import VisualizerCore from './VisualizerCore';

import './visualizer.css';

export default function Visualizer() {
    const [fullScreen, setFullScreen] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [options, setOptions] = useState<VisualizerOptionsType>();

    return <Page>
        <div className='visualizer'>
            {
                (!supported && <>Browser not supported</>) ||
                (!navigator.mediaDevices && <>Cannot get media source</>) ||
                <>
                    <VisualizerOptions onUpdate={o => setOptions(o)}/>
                    <VisualizerCore canvas={canvasRef} options={options}/>
                    <canvas ref={canvasRef} onClick={() => setFullScreen(fs => !fs)} className={fullScreen ? 'full' : ''}/>
                </>    
            }
        </div>
    </Page>;
}