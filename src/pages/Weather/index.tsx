import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Page from '../../components/Page';
import MyResponsiveLine, { formatWeatherData, FormattedWeatherDataType } from './WeatherGraph';
import { getWeather, WeatherData } from './weather';

import './weather.css';

const days = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];

function Weather() {
    const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);

    const getDefault = useCallback((s : string) => {
        return urlParams.get(s) || localStorage.getItem(s) || ''
    }, [urlParams]);

    const [currentAttempt, setCurrentAttempt] = useState(0);
    const [weatherData, setWeatherData] = useState<Array<WeatherData>>([]);
    const [zip, setZip] = useState<string>(() => getDefault('zip'));
    const [coord, setCoord] = useState<string>(() => getDefault('coord'));


    const setUrlParams = () => {
        if(zip && zip.length === 5 && coord) {
            urlParams.set('coord', coord.replaceAll(' ', ''));
            urlParams.set('zip', zip);
            window.location.search = urlParams.toString();
        }
    }

    const loadWeather = useCallback((zip: string, coord: string) => {
        setCurrentAttempt(a => a + 1);
        getWeather(zip, coord).then(d => {
            localStorage.setItem('coord', coord);
            localStorage.setItem('zip', zip);
            window.history.replaceState(null, '', `?zip=${zip}&coord=${coord}`);
            setWeatherData(d);
        }).catch(r => {
            console.error(r);
            setCurrentAttempt(a => a + 1);
            loadWeather(zip, coord);
        });
    }, []);

    useEffect(() => {
        const dZip = getDefault('zip');
        const dCoord = getDefault('coord');
        if(dZip && dZip.length === 5 && dCoord) {
            loadWeather(dZip, dCoord);
        }
    }, [loadWeather, urlParams, getDefault]);

    const formattedWeatherData : Array<Array<FormattedWeatherDataType>> = useMemo(() => {
        return formatWeatherData(weatherData);
    }, [weatherData]);

    return <Page>
        <div className='weather-page'>
            <h3>
                - UV is only available for current date due to API constraint.  Multiplied by 10 for visibility.<br/>
                <br/>
                0-20 low<br/>
                30-50 moderate<br/>
                60-70 high<br/>
                80-100 very high<br/>
                110+ extreme<br/>
                <br/>
                Coordinates: <input type='textbox' value={coord} onChange={e => setCoord(e.target.value)}/><br/>
                Zip: <input type='textbox' value={zip} onChange={e => setZip(e.target.value)}/><br/>
                <input className='big-button' type='button' value='Get' onClick={() => setUrlParams()}/>
            </h3>
            <br/>
            {
                (weatherData.length && formattedWeatherData.map(fwd => {
                    return <div key={fwd[0].data[0].x}>
                        <h2>
                            {days[new Date(fwd[0].data[0].x).getDay()]}
                        </h2>
                        <div className='weather-chart-container'>
                            <div className='weather-chart'>
                                <MyResponsiveLine data={fwd}/>
                            </div>
                        </div>
                    </div>
                })) || null
            }
            {
                !weatherData.length && currentAttempt > 0 && `Attempting to load...attempt ${currentAttempt}`
            }
        </div>
    </Page>;
}


export default Weather;