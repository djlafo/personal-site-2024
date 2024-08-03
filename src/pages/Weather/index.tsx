import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Page from '../../components/Page';
import { WeatherData, getWeather } from './weather';

import { ResponsiveLine } from '@nivo/line';

import './weather.css';

interface Point {
    x: string;
    y: number;
    color: string
}

interface FormattedWeatherDataType {
    id: string;
    color: string;
    data: Array<Point>
}

const MyResponsiveLine = ( { data } : { data: Array<FormattedWeatherDataType> } ) => (
    <ResponsiveLine 
        data={data}
        sliceTooltip={point => {
            return <div className='weather-graph-tooltip'>{`${point.slice.points[0].data.x} => Temp:${point.slice.points[3].data.y} Humidity:${point.slice.points[2].data.y} Rain:${point.slice.points[1].data.y} Wind:${point.slice.points[0].data.y}`}</div>;
        }}
        curve="monotoneX"
        enableSlices="x"
        enableTouchCrosshair
        colors={{datum: 'color'}}
        axisBottom={{
            format: (t) => {
                const d = new Date(t);
                return `${d.toLocaleTimeString('en-US', {hour: 'numeric', hour12: true}).replaceAll(' ', '')}`;
            }
        }}
        legends={[
            {
            anchor: 'bottom',
            direction: 'row',
            itemHeight: 20,
            itemWidth: 80,
            toggleSerie: true,
            translateY: 50
            }
        ]}
        margin={{
            bottom: 60,
            left: 80,
            right: 20,
            top: 20
        }}
        yScale={{
            stacked: false,
            type: 'linear'
        }}
        theme={{
            background: '#000000',
            text: {
                fill: '#FFFFFF'
            },
            tooltip: {
                container: {
                    color: '#000000'
                }
            }
        }}
    />
);

const days = ['Sun','Mon','Tues','Wed','Thrus','Fri','Sat'];

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
        const template = [
            {id: 'temp', color: 'hsl(7, 88%, 40%)', data: []},
            {id: 'humidity', color: 'hsl(214, 88%, 72%)', data: []},
            {id: 'rain', color: 'hsl(214, 92%, 49%)', data: []},
            {id: 'wind', color: 'hsl(90, 9%, 85%)', data: []}
        ];
        let tempFormat : Array<Array<FormattedWeatherDataType>> = [];
        let lastDay : number;
        weatherData.forEach((wd, i) => {
            // const day = days[wd.time.getDay()];
            // const time = wd.time.toLocaleTimeString('en-US', {timeStyle: 'short', hour12: true});
            // const xFormat = `${day}-${time}`;
            if(lastDay !== wd.time.getDate())  {
                tempFormat.push(JSON.parse(JSON.stringify(template)));
                lastDay = wd.time.getDate();
            }
            const xFormat = wd.time.toLocaleString();
            tempFormat[tempFormat.length -1][0].data.push( {x: xFormat, color: 'hsl(7, 88%, 40%)', y: wd.temp} );
            tempFormat[tempFormat.length -1][1].data.push( {x: xFormat, color: 'hsl(214, 88%, 72%)', y: wd.humidity} );
            tempFormat[tempFormat.length -1][2].data.push( {x: xFormat, color: 'hsl(214, 92%, 49%)', y: wd.rainChance} );
            tempFormat[tempFormat.length -1][3].data.push( {x: xFormat, color: 'hsl(90, 9%, 85%)', y: Number(wd.windSpeed.split(' ')[0])} );
        });
        return tempFormat;
    }, [weatherData]);
    return <Page>
        <div>
            {
                weatherData.length && (() : Array<React.ReactNode> => {
                    return formattedWeatherData.map(fwd => <div><h2>{days[new Date(fwd[0].data[0].x).getDay()]}</h2><div className='weather-chart'><MyResponsiveLine data={fwd}/></div></div>)
                })()
            }
            {
                !weatherData.length && `Attempting to load...attempt ${currentAttempt}`
            } 
        </div>
    </Page>;
}


export default Weather;