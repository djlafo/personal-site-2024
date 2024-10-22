import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Page from '../../components/Page';
import { getWeather, WeatherData } from './weather';
import WeatherInputs from './WeatherInputs';
import WeatherGraphContainer from './WeatherGraphContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './weather.css';
import { FormattedWeatherDataType, formatWeatherData } from './WeatherGraph';
import { Modal } from '../../components';

function Weather() {
    const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);

    const getDefault = useCallback((s : string) => {
        return urlParams.get(s) || localStorage.getItem(s) || ''
    }, [urlParams]);

    // const [currentAttempt, setCurrentAttempt] = useState(0);
    const [weatherData, setWeatherData] = useState<Array<WeatherData>>([]);
    const [selectedDay, setSelectedDay] = useState(0);
    const [hideSettings, setHideSettings] = useState(true);

    const loadWeather = useCallback((z: string, coord: string, times : number = 0) => {
        getWeather(z, coord).then(d => {
            localStorage.setItem('coords', coord);
            localStorage.setItem('zip', z);
            window.history.replaceState(null, '', `?coords=${coord}&zip=${z}`);
            setSelectedDay(0);
            setHideSettings(true);
            // setCurrentAttempt(a => a + 1);
            setWeatherData(d);
        }).catch(r => {
            if(times < 2) {
                toast(r.message);
                loadWeather(z, coord, times + 1);
            } else {
                toast('Too many attempts, clearing data and refreshing');
                setTimeout(() => {
                    localStorage.clear();
                    window.history.replaceState(null, '', '?');
                    window.location.reload();
                }, 7000);
            }
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

    const startLoadWeather = useCallback((c : string, z : string) => {
        setWeatherData([]);
        // setCurrentAttempt(1);
        loadWeather(z, c);
    }, [loadWeather]);

    useEffect(() => {
        const dCoord = getDefault('coords');
        const dZip = getDefault('zip')
        if(dCoord) {
            startLoadWeather(dCoord, dZip);
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
            <Modal onClose={() => setHideSettings(true)} styleOne opened={!hideSettings}>
                <div className='settings-box'>
                    <h2>
                        Weather Settings
                    </h2>
                    <p>
                        - UV is only available for current date due to API constraint.  Multiplied by 10 for visibility.<br/>
                        - Zip code table obtained from <a href='https://simplemaps.com/data/us-zips' target='_blank' rel='noreferrer'>simplemaps</a><br/>
                        <br/>
                        0-20 low<br/>
                        30-50 moderate<br/>
                        60-70 high<br/>
                        80-100 very high<br/>
                    </p>
                    <WeatherInputs initialZIP={getDefault('zip')} initialCoords={getDefault('coords')} doReload={startLoadWeather}/>
                </div>
            </Modal>
            {/* {
                !weatherData.length && currentAttempt > 0 && <span className='loading-text'>Loading...attempt ${currentAttempt}</span>
            } */}
            { 
                (weatherData.length && 
                <WeatherGraphContainer data={fwd[selectedDay]}
                    onIncrementDay={(n : number) => setSelectedDay(increment(n))}>
                    <input type='button' value='Settings' onClick={() => setHideSettings(false)}/>
                </WeatherGraphContainer>) || '' 
            }
        </div>
    </Page>;
}


export default Weather;