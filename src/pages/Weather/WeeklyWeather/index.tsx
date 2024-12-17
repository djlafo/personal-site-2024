import { useEffect, useState } from "react";

import WeatherGraph from "../WeatherGraph";
import DaySwitcher from "./DaySwitcher";

import { getWeather } from "../WeatherApi";
import { formatWeatherData, FormattedWeatherData } from "../WeatherGraph/helpersAndTypes";

import './weeklyweather.css';

export default function WeeklyWeather({zip, coords, onError} : {zip?: string, coords?: string, onError: (e:any) => void}) {
    const [lastZip, setLastZip] = useState<string>();
    const [lastCoords, setLastCoords] = useState<string>();
    const [weekWeatherData, setWeekWeatherData] = useState<FormattedWeatherData>();
    const [currentDay, setCurrentDay] = useState<string>();
    
    if(zip && coords && (lastZip !== zip || lastCoords !== coords)) {
        setLastZip(zip);
        setLastCoords(coords);
    }

    useEffect(() => {
        if(zip && coords) {
            getWeather(zip, coords, true).then(wd => {
                const formatted = formatWeatherData(wd);
                setCurrentDay(Object.keys(formatted)[0]);
                setWeekWeatherData(formatted);
            }).catch(e => onError(e));
        }
    }, [zip,coords,onError])

    if(weekWeatherData && currentDay) {
        return <div className='weekly-weather'>
            <DaySwitcher currentDay={currentDay} 
                days={Object.keys(weekWeatherData)} 
                onDaySwitched={s => setCurrentDay(s)}/>
            <div className='graph-container'>
                <WeatherGraph data={weekWeatherData[currentDay as keyof FormattedWeatherData]}/>
            </div>
        </div>;
    }
}