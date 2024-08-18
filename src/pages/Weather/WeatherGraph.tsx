import { ResponsiveLine } from '@nivo/line';
import { WeatherData, calcHeatIndex, calcWetBulb } from './weather';
import React from 'react';

interface Point {
    x: string;
    y: number;
    color: string
}

export interface FormattedWeatherDataType {
    id: string;
    color: string;
    data: Array<Point>
}

export function formatWeatherData(weatherData : Array<WeatherData>) : Array<Array<FormattedWeatherDataType>> {
    
    const template = [
        {id: 'temp', color: 'hsl(7, 88%, 40%)', data: []},
        {id: 'humidity', color: 'hsl(214, 88%, 72%)', data: []},
        {id: 'rain', color: 'hsl(214, 92%, 49%)', data: []},
        {id: 'wind', color: 'hsl(90, 9%, 85%)', data: []},
        {id: 'heat', color: 'hsl(27, 100%, 61%)', data: []},
        {id: 'bulb', color: 'hsl(135, 100%, 60%)', data: []},
        {id: 'UV', color: 'hsl(57, 100%, 61%)', data: []}
    ];

    let tempFormat : Array<Array<FormattedWeatherDataType>> = [];
    let lastDay : number;
    weatherData.forEach(wd => {
        if(lastDay !== wd.time.getDate())  {
            tempFormat.push(JSON.parse(JSON.stringify(template)));
            lastDay = wd.time.getDate();
        }
        const xFormat = wd.time.toLocaleString();
        tempFormat[tempFormat.length -1][0].data.push( {x: xFormat, color: 'hsl(7, 88%, 40%)', y: wd.temp} );
        tempFormat[tempFormat.length -1][1].data.push( {x: xFormat, color: 'hsl(214, 88%, 72%)', y: wd.humidity} );
        tempFormat[tempFormat.length -1][2].data.push( {x: xFormat, color: 'hsl(214, 92%, 49%)', y: wd.rainChance} );
        tempFormat[tempFormat.length -1][3].data.push( {x: xFormat, color: 'hsl(90, 9%, 85%)', y: Number(wd.windSpeed.split(' ')[0])} );
        tempFormat[tempFormat.length -1][4].data.push( {x: xFormat, color: 'hsl(27, 100%, 61%)', y: calcHeatIndex(wd.temp, wd.humidity)} );
        tempFormat[tempFormat.length -1][5].data.push( {x: xFormat, color: 'hsl(135, 100%, 60%)', y: calcWetBulb(wd.temp, wd.humidity)} );
        if(wd.UV || wd.UV === 0) tempFormat[tempFormat.length -1][6].data.push( {x: xFormat, color: 'hsl(57, 100%, 61%)', y: wd.UV*10} );
    });
    return tempFormat;
}

const MyResponsiveLine = ( { data } : { data: Array<FormattedWeatherDataType> } ) => (
    <ResponsiveLine 
        data={data}
        sliceTooltip={point => {
            const points = point.slice.points;
            return <div className='weather-graph-tooltip'>
                [{new Date(point.slice.points[0].data.x).toLocaleTimeString('en-US', {hour: 'numeric', hour12: true})}]<br/>
                {
                    points.map(p => {
                        let spanTxt = '';
                        switch(p.id.split('.')[0]) {
                            case 'temp':
                                spanTxt = `Temp: ${p.data.y}F`;
                                break;
                            case 'humidity':
                                spanTxt = `Humi: ${p.data.y}%`;
                                break;
                            case 'rain':
                                spanTxt = `Rain: ${p.data.y}%`;
                                break;
                            case 'wind':
                                spanTxt = `Wind: ${p.data.y}mph`;
                                break;
                            case 'heat':
                                spanTxt = `Heat: ${Number(p.data.y).toFixed(1)}F`;
                                break;
                            case 'bulb':
                                spanTxt = `UV10: ${Number(p.data.y).toFixed(1)}F`;
                                break;
                            case 'UV':
                                spanTxt = `UV10: ${p.data.y}`;
                                break;
                            default:
                                spanTxt = `Unknown: ${p.data.y}`;
                                break;
                        }
                        return <React.Fragment key={p.id}>
                            <span>
                                {spanTxt}
                            </span>
                            <br/>
                        </React.Fragment>;
                    })
                }
            </div>;
        }}
        curve="monotoneX"
        enableSlices="x"
        enableTouchCrosshair
        colors={{datum: 'color'}}
        axisLeft={{
            tickValues: 20
        }}
        axisBottom={{
            format: (t) => {
                const d = new Date(t);
                return `${d.toLocaleTimeString('en-US', {hour: 'numeric', hour12: true}).replaceAll(' ', '')}`;
            }
        }}
        legends={[
            {
            anchor: 'top-left',
            direction: 'row',
            itemHeight: 5,
            itemWidth: 80,
            toggleSerie: true,
            translateY: -25,
            translateX: 10
            }
        ]}
        margin={{
            bottom: 25,
            left: 40,
            right: 40,
            top: 35
        }}
        yScale={{
            stacked: false,
            type: 'linear',
            min: 0,
            max: 'auto'
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

export default MyResponsiveLine;