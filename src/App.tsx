import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Search, Clock, Calendar, Sun, Wind, Droplets, Eye, Thermometer, Sunrise, Sunset } from 'lucide-react';
import { WeatherData, ExtendedWeatherData } from './types';
import { getBackgroundImage, kelvinToCelsius, formatTime, formatDate, getUVIndexDescription, metersToMiles, mpsToMph } from './utils';
import { fallbackWeatherData, fallbackForecastData } from './fallbackData';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ExtendedWeatherData | null>(null);
  const [city, setCity] = useState('London');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usingFallback, setUsingFallback] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const API_KEY = 'YOUR_API_KEY';
  
  const fetchWeatherData = async (searchCity: string) => {
    try {
      setLoading(true);
      setError('');
      setUsingFallback(false);
      
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&limit=1&appid=${API_KEY}`
      );
      
      if (geoResponse.data.length === 0) {
        throw new Error('City not found');
      }

      const { lat, lon } = geoResponse.data[0];
      
      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get<WeatherData>(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        ),
        axios.get<ExtendedWeatherData>(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        )
      ]);

      setWeather(weatherResponse.data);
      setForecast(forecastResponse.data);
    } catch (err) {
      setError('Unable to fetch weather data. Using demo data instead.');
      setUsingFallback(true);
      setWeather(fallbackWeatherData);
      setForecast(fallbackForecastData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherData(city);
  };

  const backgroundImage = weather ? getBackgroundImage(weather.weather[0].main) : getBackgroundImage('Clear');

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return '☀️';
      case 'clouds':
        return '☁️';
      case 'rain':
        return '🌧️';
      case 'snow':
        return '❄️';
      case 'thunderstorm':
        return '⛈️';
      case 'drizzle':
        return '🌦️';
      case 'mist':
      case 'fog':
        return '🌫️';
      default:
        return '🌤️';
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center transition-all duration-1000 relative overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 animate-pulse-slow" />
      
      <div className="min-h-screen backdrop-blur-sm bg-gradient-to-b from-black/40 to-black/20 px-4 py-6 sm:p-6 flex flex-col gap-4 sm:gap-6 relative">
        {/* Search Bar */}
        <div className="max-w-7xl mx-auto w-full">
          <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
            <MapPin className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/70 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${searchFocused ? 'scale-110' : ''}`} />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Enter city name"
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/70 text-white text-base sm:text-lg transition-all duration-300 hover:bg-white/15 focus:bg-white/20 shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 hover:bg-white/10 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110"
              disabled={loading}
            >
              <Search className="text-white/70 w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>
          {error && (
            <div className="mt-4 max-w-md mx-auto text-white bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 animate-fade-in">
              <p className="text-sm">{error}</p>
              {usingFallback && (
                <p className="text-xs mt-2 opacity-80">
                  Note: Currently displaying demo data. Please check your API key or try again later.
                </p>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : weather && forecast && (
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Weather Card */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white border border-white/10 hover:bg-white/15 transition-all duration-300 shadow-xl">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="text-8xl mb-4 animate-bounce-slow">{getWeatherIcon(weather.weather[0].main)}</div>
                  <h1 className="text-6xl sm:text-8xl font-bold mb-2 sm:mb-4 animate-fade-in">{kelvinToCelsius(weather.main.temp)}°</h1>
                  <p className="text-3xl sm:text-4xl font-medium mb-1 sm:mb-2">{weather.weather[0].main}</p>
                  <p className="text-lg sm:text-xl text-white/80">{weather.weather[0].description}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <Thermometer className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                      <p className="text-xs sm:text-sm text-white/70">Feels Like</p>
                    </div>
                    <p className="text-xl sm:text-2xl font-semibold">{kelvinToCelsius(weather.main.feels_like)}°</p>
                  </div>

                  <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                      <p className="text-xs sm:text-sm text-white/70">Humidity</p>
                    </div>
                    <p className="text-xl sm:text-2xl font-semibold">{weather.main.humidity}%</p>
                  </div>

                  <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                      <p className="text-xs sm:text-sm text-white/70">Visibility</p>
                    </div>
                    <p className="text-xl sm:text-2xl font-semibold">{metersToMiles(weather.visibility)} mi</p>
                  </div>

                  <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                      <p className="text-xs sm:text-sm text-white/70">Wind</p>
                    </div>
                    <p className="text-xl sm:text-2xl font-semibold">{mpsToMph(weather.wind.speed)} mph</p>
                  </div>
                </div>

                {/* Sunrise and Sunset */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-2">
                      <Sunrise className="w-5 h-5 text-yellow-400" />
                      <p className="text-sm text-white/70">Sunrise</p>
                    </div>
                    <p className="text-xl font-semibold mt-2">{formatTime(forecast.current.sunrise)}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-2">
                      <Sunset className="w-5 h-5 text-orange-400" />
                      <p className="text-sm text-white/70">Sunset</p>
                    </div>
                    <p className="text-xl font-semibold mt-2">{formatTime(forecast.current.sunset)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* UV Index Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white border border-white/10 hover:bg-white/15 transition-all duration-300 shadow-xl">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                <h2 className="text-xl sm:text-2xl font-semibold">UV Index</h2>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <p className="text-4xl sm:text-5xl font-bold">{Math.round(forecast.daily[0].uvi)}</p>
                <div className="text-right">
                  <p className="text-lg sm:text-xl font-medium">{getUVIndexDescription(forecast.daily[0].uvi)}</p>
                  <p className="text-sm text-white/70">Updated {formatTime(forecast.current.dt)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-1.5 sm:h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white/20 transition-all duration-1000"
                    style={{ width: `${(forecast.daily[0].uvi / 11) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-5 gap-2 text-xs text-center">
                  <div className="text-green-400">Low</div>
                  <div className="text-yellow-400">Moderate</div>
                  <div className="text-orange-400">High</div>
                  <div className="text-red-400">Very High</div>
                  <div className="text-purple-400">Extreme</div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Protection Required</span>
                    <span className="font-medium">
                      {forecast.daily[0].uvi > 3 ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Recommended SPF</span>
                    <span className="font-medium">
                      {forecast.daily[0].uvi <= 2 ? '15+' : 
                       forecast.daily[0].uvi <= 5 ? '30+' : 
                       forecast.daily[0].uvi <= 7 ? '50+' : '50+ (Reapply)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Peak Hours</span>
                    <span className="font-medium">10 AM - 4 PM</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-sm text-white/80">
                    {forecast.daily[0].uvi <= 2 ? 'Low risk of harm from unprotected sun exposure.' :
                     forecast.daily[0].uvi <= 5 ? 'Moderate risk of harm from unprotected sun exposure.' :
                     forecast.daily[0].uvi <= 7 ? 'High risk of harm from unprotected sun exposure.' :
                     forecast.daily[0].uvi <= 10 ? 'Very high risk of harm from unprotected sun exposure.' :
                     'Extreme risk of harm from unprotected sun exposure.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Hourly Forecast */}
            <div className="lg:col-span-3">
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white border border-white/10 hover:bg-white/15 transition-all duration-300 shadow-xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                  <h2 className="text-xl sm:text-2xl font-semibold">Hourly Forecast</h2>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4 sm:gap-8 overflow-x-auto pb-2">
                  {forecast.hourly.slice(0, 8).map((hour) => (
                    <div key={hour.dt} className="text-center min-w-[80px] hover:scale-105 transition-transform duration-300">
                      <p className="text-base sm:text-lg mb-1 sm:mb-2">{formatTime(hour.dt)}</p>
                      <p className="text-2xl mb-2">{getWeatherIcon(hour.weather[0].main)}</p>
                      <p className="text-xl sm:text-2xl font-semibold">{kelvinToCelsius(hour.temp)}°</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Forecast */}
            <div className="lg:col-span-3">
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white border border-white/10 hover:bg-white/15 transition-all duration-300 shadow-xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                  <h2 className="text-xl sm:text-2xl font-semibold">7-Day Forecast</h2>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4 sm:gap-8">
                  {forecast.daily.slice(0, 7).map((day) => (
                    <div key={day.dt} className="text-center hover:scale-105 transition-transform duration-300">
                      <p className="text-base sm:text-lg mb-1 sm:mb-2">{formatDate(day.dt)}</p>
                      <p className="text-2xl mb-2">{getWeatherIcon(day.weather[0].main)}</p>
                      <p className="text-xl sm:text-2xl font-semibold">{kelvinToCelsius(day.temp.day)}°</p>
                      <p className="text-sm text-white/70">{kelvinToCelsius(day.temp.min)}° / {kelvinToCelsius(day.temp.max)}°</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;