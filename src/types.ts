export interface WeatherData {
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    dew_point: number;
  };
  wind: {
    speed: number;
    gust: number;
  };
  visibility: number;
  name: string;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  weather: {
    main: string;
    description: string;
  }[];
}

export interface DailyForecast {
  dt: number;
  temp: {
    day: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
  uvi: number;
}

export interface ExtendedWeatherData {
  current: WeatherData;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}