import { useState } from "react";
import { VisualizerOptionsType } from "./VisualizerOptions";
import { createButterchurn, presets } from "./butterchurn";

export default function VisualizerCore({canvas, options} : {canvas : React.RefObject<HTMLCanvasElement>, options ?: VisualizerOptionsType}) {
    const [visualizer, setVisualizer] = useState<any>();
    const [vRenderer, setVRenderer] = useState<number|null>();
    const [presetSwitcher, setPresetSwitcher] = useState<number|null>();
    const [lastShuffle, setLastShuffle] = useState(0);

    // HELPER FUNCTIONS 
    const startShuffle = (v=visualizer) => {
        if(!options) return;

        const presetFn : TimerHandler = () => {
            setRandomPreset(v);
        };
        setPresetSwitcher(setInterval(presetFn, 1000*Number(options.shuffleTimer)));
    }
    const setRandomPreset = (v=visualizer) => {
        if(v) {
            const keys = Object.keys(presets);
            v.loadPreset(presets[keys[Math.floor(Math.random() * keys.length)]], 1.0);
        }
    }
    const createVisualizerAndSet = () => {
        if(!canvas.current || !options) return;
        setVisualizer(1);
        createButterchurn(canvas.current, options.width, options.height).then(v => {
            setVisualizer(v);
            setRandomPreset(v);
            const renderFn : TimerHandler = () => {
                v.render();
            };
            if(vRenderer) {
                clearInterval(vRenderer);
            }
            setVRenderer(setInterval(renderFn, 1000/(options.fps || 30)));
            if(presetSwitcher) {
                clearInterval(presetSwitcher);
            }
            if(!options.lock) {
                startShuffle(v);
            } else if(options.lock && presetSwitcher) {
                setPresetSwitcher(null);
            }
        }).catch(e => {});
    }
    // END OF FUNCTIONS

    // LOGIC FROM PROPS
    if(canvas && options && !visualizer) {
        console.log('call create');
        createVisualizerAndSet();
    }
    if(options && lastShuffle !== options.shuffleCounter) {
        if(presetSwitcher) {
            clearInterval(presetSwitcher);
        }
        setRandomPreset();
        if(!options.lock) startShuffle();
        setLastShuffle(options.shuffleCounter);
    }
    if(options?.lock && presetSwitcher) {
        clearInterval(presetSwitcher);
        setPresetSwitcher(null);
    } else if (options && !options.lock && !presetSwitcher && vRenderer) {
        startShuffle();
    }
    return <></>;
}