import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Page from '../../components/Page';
import { getWeather, WeatherData } from './weather';
import { getZipFromCoords } from './zipcodes';
import WeatherInputs from './WeatherInputs';
import WeatherGraphContainer from './WeatherGraphContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './weather.css';
import { FormattedWeatherDataType, formatWeatherData } from './WeatherGraph';

function Weather() {
    const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);

    const getDefault = useCallback((s : string) => {
        return urlParams.get(s) || localStorage.getItem(s) || ''
    }, [urlParams]);

    const [currentAttempt, setCurrentAttempt] = useState(0);
    const [weatherData, setWeatherData] = useState<Array<WeatherData>>([]);
    const [initialZIP, setInitialZIP] = useState<string>('');
    const [selectedDay, setSelectedDay] = useState(0);
    const [hideSettings, setHideSettings] = useState(true);

    const loadWeather = useCallback((z: string, coord: string) => {
        getWeather(z, coord).then(d => {
            localStorage.setItem('coords', coord);
            window.history.replaceState(null, '', `?coords=${coord}`);
            setSelectedDay(0);
            setHideSettings(true);
            setCurrentAttempt(a => a + 1);
            setWeatherData(d);
        }).catch(r => {
            toast(r.message);
            loadWeather(z, coord);
        });
    }, []);

    const fwd : Array<Array<FormattedWeatherDataType>> = useMemo(() => {
        return formatWeatherData(weatherData);
    }, [weatherData]);

    const increment = useCallback((inc: number) : number => {
        const res = selectedDay + inc;
        if(res < 0) return fwd.length-1;
        if(res >= fwd.length) return 0;
        return res;
    }, [selectedDay, fwd]);

    const startLoadWeather = useCallback((c : string) => {
        const dCoordSp = c.replaceAll(' ', '').split(',');
        setWeatherData([]);
        setCurrentAttempt(1);
        getZipFromCoords(Number(dCoordSp[0]), Number(dCoordSp[1])).then(n => {
            setInitialZIP(n);
            toast(`ZIP set to ${n}`);
            loadWeather(n, c);
        }).catch(e => toast(e.message));
    }, [loadWeather]);

    useEffect(() => {
        const dCoord = getDefault('coords');
        if(dCoord) {
            startLoadWeather(dCoord);
        } else {
            setHideSettings(false);
        }
    }, [startLoadWeather, getDefault, setHideSettings]);

    useEffect(() => {
		const shiftActive = (e : KeyboardEvent) => {
            if(e.key === 'ArrowLeft') {
                setSelectedDay(increment(-1));
            } else if (e.key === 'ArrowRight') {
                setSelectedDay(increment(1));
            }
		};

		window.addEventListener('keydown', shiftActive);
		return () => {
			window.removeEventListener('keydown', shiftActive);
		}
	}, [setSelectedDay, increment])

    return <Page>
        <div className='weather-page'>
            <ToastContainer />
            <input type='button' value={hideSettings ? 'Show' : 'Hide'} onClick={() => setHideSettings(h => !h)}/>
            <div className='settings-box' hidden={hideSettings}>
                <h3>
                    - UV is only available for current date due to API constraint.  Multiplied by 10 for visibility.<br/>
                    - Zip code table obtained from <a href='https://simplemaps.com/data/us-zips' target='_blank' rel='noreferrer'>simplemaps</a><br/>
                    <br/>
                    0-20 low<br/>
                    30-50 moderate<br/>
                    60-70 high<br/>
                    80-100 very high<br/>
                </h3>
                <WeatherInputs initialZIP={initialZIP} initialCoords={getDefault('coords')} doReload={startLoadWeather}/>
            </div>
            {
                !weatherData.length && currentAttempt > 0 && ` Loading...attempt ${currentAttempt}`
            }
            { 
                (weatherData.length && 
                <WeatherGraphContainer data={fwd[selectedDay]}
                    onIncrementDay={(n : number) => setSelectedDay(increment(n))}/>) || '' 
            }
        </div>
    </Page>;
}


export default Weather;