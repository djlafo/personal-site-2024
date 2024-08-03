interface APIData {                                                                
    properties: {
        periods: Array<OriginalWeatherData>
    };
    [key: string]: any;
}

interface OriginalWeatherData {
    startTime: string,
    temperature: number;
    temperatureUnit: string;
    relativeHumidity: {
        value: number,
        unitCode: string
    };
    probabilityOfPrecipitation: {
        unitCode: string,
        value: number
    };
    windSpeed: string;
    shortForecast: string;
    [key: string]: any;
}

export interface WeatherData {
    time: Date;
    temp: number;
    tempUnit: string;
    humidity: number;
    rainChance: number;
    windSpeed: string;
    desc: string;
    icon: string
}

const hourlyURL="https://api.weather.gov/gridpoints/LCH/113,87/forecast/hourly";
// import exampleData from '../example_data.json';

export async function getWeather(): Promise<Array<WeatherData>> {
    return new Promise((acc, rej) => {
        (async() => {
            try {
                const response: Response = await fetch(hourlyURL);
                const json: APIData = await response.json();
                // const json: APIData = exampleData;
                const dataPoints: Array<OriginalWeatherData> = json.properties.periods;
                const data: Array<WeatherData> = dataPoints.map(e => {
                    return {
                        time: new Date(e.startTime), //.toLocaleString('en-US', {timeZone: 'America/Chicago'}) 
                        temp: e.temperature,
                        tempUnit: e.temperatureUnit,
                        humidity: e.relativeHumidity.value,
                        rainChance: e.probabilityOfPrecipitation.value,
                        windSpeed: e.windSpeed,
                        desc: e.shortForecast,
                        icon: e.icon
                    };
                });
                acc(data);
            } catch (e) {
                rej();
            }
        })();
    });
}