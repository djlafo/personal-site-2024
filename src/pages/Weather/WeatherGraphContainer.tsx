import React from 'react';
import MyResponsiveLine, { FormattedWeatherDataType } from './WeatherGraph';

interface WeatherGraphContainerType {
    data : Array<FormattedWeatherDataType>;
    onIncrementDay : (n: number) => void;
}

export default function WeatherGraphContainer({ data, onIncrementDay } : WeatherGraphContainerType) {
    const getMax = (a: Array<FormattedWeatherDataType>) : string => {
        return a.find(ae => ae.id === 'temp')?.data.reduce((d, c) => d.y > c.y ? d : c).y?.toString() || '';
    }

    const date = new Date(data[0].data[0].x);

    return <div className='weather-chart-container-container'>
        <h2>
            <input type='button' value='<' onClick={() => onIncrementDay(-1)}/>
            {date.toDateString()} - Max {getMax(data)}
            <input type='button' value='>' onClick={() => onIncrementDay(1)}/>
        </h2>
        <div className='weather-chart-container'>
            <div className='weather-chart'>
                <MyResponsiveLine data={data}/>
            </div>
        </div>
    </div>;
}