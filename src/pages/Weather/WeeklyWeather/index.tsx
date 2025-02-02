import { useContext, useEffect, useState } from "react";

import WeatherGraph from "../WeatherGraph";
import DaySwitcher from "./DaySwitcher";

import { getWeather } from "../WeatherApi";
import { formatWeatherData, FormattedWeatherData } from "../WeatherGraph/helpersAndTypes";
import { LocationContext } from "../LocationHandler";

import './weeklyweather.css';

export default function WeeklyWeather() {
    const {zip, coords, setLogs} = useContext(LocationContext);
    const [weekWeatherData, setWeekWeatherData] = useState<FormattedWeatherData>();
    const [currentDay, setCurrentDay] = useState<string>();
    

    useEffect(() => {
        if(zip && coords) {
            getWeather(zip, coords, true).then(wd => {
                const formatted = formatWeatherData(wd);
                setCurrentDay(Object.keys(formatted)[0]);
                setWeekWeatherData(formatted);
            }).catch(e => {
                setLogs && setLogs(a => a.concat([{
                    error: e.error,
                    string: e.string
                }]));
            });
        }
    }, [zip,coords, setLogs])

    if(weekWeatherData && currentDay) {
        return <div className='weekly-weather'>
            <DaySwitcher currentDay={currentDay} 
                days={Object.keys(weekWeatherData)} 
                onDaySwitched={s => setCurrentDay(s)}/>
            <div className='graph-container'>
                <WeatherGraph data={weekWeatherData[currentDay as keyof FormattedWeatherData]}/>
            </div>
        </div>;
    } else if (!weekWeatherData && zip && coords) {
        return <div className='day-switcher'>Fetching data...</div>
    }
}