import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Page from '../../components/Page';
import MyResponsiveLine, { formatWeatherData, FormattedWeatherDataType } from './WeatherGraph';
import { getWeather, WeatherData } from './weather';
import { getZipFromCoords } from './zipcodes';
import WeatherInputs from './WeatherInputs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './weather.css';

const days = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];

function Weather() {
    const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);

    const getDefault = useCallback((s : string) => {
        return urlParams.get(s) || ''
    }, [urlParams]);

    const [currentAttempt, setCurrentAttempt] = useState(0);
    const [weatherData, setWeatherData] = useState<Array<WeatherData>>([]);
    const [initialZIP, setInitialZIP] = useState<string>('');

    const loadWeather = useCallback((z: string, coord: string) => {
        setCurrentAttempt(a => a + 1);
        getWeather(z, coord).then(d => {
            localStorage.setItem('coords', coord);
            window.history.replaceState(null, '', `?coords=${coord}`);
            setWeatherData(d);
        }).catch(r => {
            console.error(r);
            setCurrentAttempt(a => a + 1);
            loadWeather(z, coord);
        });
    }, []);

    const formattedWeatherData : Array<Array<FormattedWeatherDataType>> = useMemo(() => {
        return formatWeatherData(weatherData);
    }, [weatherData]);

    const getMax = (a: Array<FormattedWeatherDataType>) : string => {
        return a.find(ae => ae.id === 'temp')?.data.reduce((d, c) => d.y > c.y ? d : c).y?.toString() || '';
    }

    useEffect(() => {
        const dCoord = getDefault('coords');
        if(dCoord) {
            const dCoordSp = dCoord.replaceAll(' ', '').split(',');
            getZipFromCoords(Number(dCoordSp[0]), Number(dCoordSp[1])).then(n => {
                setInitialZIP(n);
                toast(`ZIP set to ${n}`);
                loadWeather(n, dCoord);
            }).catch(e => console.error(e));
        }
    }, [loadWeather, getDefault]);

    return <Page>
        <div className='weather-page'>
            <ToastContainer />
            <h3>
                - UV is only available for current date due to API constraint.  Multiplied by 10 for visibility.<br/>
                - Zip code table obtained form <a href='https://simplemaps.com/data/us-zips' target='_blank' rel='noreferrer'>https://simplemaps.com/data/us-zips</a><br/>
                <br/>
                0-20 low<br/>
                30-50 moderate<br/>
                60-70 high<br/>
                80-100 very high<br/>
                110+ extreme<br/>
                <br/>
                <WeatherInputs initialZIP={initialZIP} initialCoords={getDefault('coords')} urlParams={urlParams}/>
            </h3>
            <br/>
            {
                (weatherData.length && formattedWeatherData.map(fwd => {
                    return <div key={fwd[0].data[0].x}>
                        <h2>
                            {days[new Date(fwd[0].data[0].x).getDay()]} - Max {getMax(fwd)}
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