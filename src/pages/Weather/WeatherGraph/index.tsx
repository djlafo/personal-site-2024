/* 3rd party components */
import { ResponsiveLine, LineSvgProps } from '@nivo/line';

/* components */
import Tooltip from './Tooltip';

/* Types */
import { WeatherDataPoint } from './helpersAndTypes';

/* css */
import './weathergraph.css';

const graphProps : (data : Array<WeatherDataPoint>) => LineSvgProps = (data) => {
    return {
        data: data,
        sliceTooltip: Tooltip,
        curve: 'monotoneX',
        enableSlices: 'x',
        enableTouchCrossHair: true,
        colors: {
            datum: 'color'
        },
        axisLeft: {
            tickValues: 20
        },
        axisBottom: {
            format: (t) => {
                const d = new Date(t);
                return `${d.toLocaleTimeString('en-US', {hour: 'numeric', hour12: true}).replaceAll(' ', '')}`;
            }
        },
        legends: [
            {
                anchor: 'top-left',
                direction: 'row',
                itemHeight: 5,
                itemWidth: 100,
                toggleSerie: true,
                translateY: -25,
                translateX: 10
            }
        ],
        margin: {
            bottom: 25,
            left: 40,
            right: 40,
            top: 35
        },
        yScale: {
            stacked: false,
            type: 'linear',
            min: 0,
            max: 'auto'
        },
        theme: {
            background: '#000000',
            text: {
                fill: '#FFFFFF'
            },
            tooltip: {
                container: {
                    color: '#000000'
                }
            }
        }
    };
};

export default function WeatherGraph({ data } : { data: Array<WeatherDataPoint> }) {
    return <div className='weather-graph'>
        <ResponsiveLine {...graphProps(data)}/>
    </div>;
};