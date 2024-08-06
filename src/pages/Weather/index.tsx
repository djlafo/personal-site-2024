import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Page from '../../components/Page';
import MyResponsiveLine, { formatWeatherData, FormattedWeatherDataType } from './WeatherGraph';
import { getWeather, WeatherData } from './weather';

import './weather.css';

const days = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];

function Weather() {
    const [currentAttempt, setCurrentAttempt] = useState(0);
    const [weatherData, setWeatherData] = useState<Array<WeatherData>>([]);

    const loadWeather = useCallback(() => {
        setCurrentAttempt(a => a + 1);
        getWeather().then(d => {
            setWeatherData(d);
        }).catch(r => {
            setCurrentAttempt(a => a + 1);
            loadWeather();
        });
    }, []);

    useEffect(() =>
      loadWeather() 
    , [loadWeather]);

    const formattedWeatherData : Array<Array<FormattedWeatherDataType>> = useMemo(() => {
        return formatWeatherData(weatherData);
    }, [weatherData]);
    return <Page>
        <div>
            {
                weatherData.length && (() : Array<React.ReactNode> => {
                    return formattedWeatherData.map(fwd => <div>
                        <h2>
                            {days[new Date(fwd[0].data[0].x).getDay()]}
                        </h2>
                        <div className='weather-chart-container'>
                            <div className='weather-chart'>
                                <MyResponsiveLine data={fwd}/>
                            </div>
                        </div>
                    </div>);
                })()
            }
            {
                !weatherData.length && `Attempting to load...attempt ${currentAttempt}`
            } 
        </div>
    </Page>;
}


export default Weather;