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
            <h3>
                - UV is only available for current date due to API constraint.  Multiplied by 10 for visibility.<br/>
                <br/>
                0-20 low<br/>
                30-50 moderate<br/>
                60-70 high<br/>
                80-100 very high<br/>
                110+ extreme<br/>
                <br/>
                - This is only setup for my location because it's only made for me =)<br/>Though maybe if someone actually wants to use this?<br/>
            </h3>
            <br/>
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