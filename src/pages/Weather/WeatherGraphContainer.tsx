import React, { useMemo, useState } from 'react';
import MyResponsiveLine, { FormattedWeatherDataType } from './WeatherGraph';
import { Modal } from '../../components';

interface WeatherGraphContainerType {
    data : Array<FormattedWeatherDataType>;
    onIncrementDay : (n: number) => void;
    children: JSX.Element | Array<JSX.Element>;
}

interface WeatherProps {
    id: string;
    enabled: boolean;
}

export default function WeatherGraphContainer({ data, onIncrementDay, children } : WeatherGraphContainerType) {
    const [prevData, setPrevData] = useState<Array<FormattedWeatherDataType>>([]);
    const [weatherProps, setWeatherProps] = useState<Array<WeatherProps>>([]);
    const [filterOpen, setFilterOpen] = useState(false);

    if(data !== prevData) {
        setPrevData(data);
        setWeatherProps(data.map(d => {
            const lc = localStorage.getItem(d.id);
            let lcb = true;
            if(lc) lcb = !!Number(lc);
            return {
                id: d.id,
                enabled: lcb
            };
        }));
    }

    const updateProp = (id : string, val : boolean) => {
        localStorage.setItem(id, Number(val).toString());
        setWeatherProps(wp => {
            const ind = weatherProps.findIndex(wp => wp.id === id);
            const shallowCop = [...wp];
            shallowCop.splice(ind, 1, {id: id, enabled: val});
            return shallowCop;
        });
    };

    const filteredData = useMemo(() => {
        return prevData.filter(pd => {
            return weatherProps.find(wp => wp.id === pd.id)?.enabled;
        });
    }, [weatherProps, prevData])

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
        {children}
        <input type='button' value='Filter' onClick={() => setFilterOpen(true)}/>
        <Modal opened={filterOpen} onClose={() => setFilterOpen(false)} styleOne>
            <div className='chart-filters'>
                {
                    weatherProps.map(d => <span key={d.id}>
                        <input type='checkbox' id={d.id} checked={d.enabled} onChange={e => updateProp(d.id, e.target.checked)}/>
                        <label htmlFor={d.id}>{d.id}</label>
                    </span>)
                }
            </div>
        </Modal>
        <div className='weather-chart-container'>
            <div className='weather-chart'>
                <MyResponsiveLine data={filteredData}/>
            </div>
        </div>
    </div>;
}