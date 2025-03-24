export const fallbackWeatherData = {
  weather: [{
    main: "Clear",
    description: "Clear skies and sunshine",
    icon: "01d"
  }],
  main: {
    temp: 294.15, // 21°C
    feels_like: 293.15, // 20°C
    humidity: 21,
    dew_point: 270.15 // -3°C
  },
  wind: {
    speed: 1.88, // 4.2 MPH
    gust: 1.89 // 4.24 MPH
  },
  visibility: 16093.4, // 10 miles
  name: "London"
};

export const fallbackForecastData = {
  current: fallbackWeatherData,
  hourly: [
    { dt: Date.now() / 1000 + 3600 * 0, temp: 285.15, weather: [{ main: "Clear", description: "Clear sky" }] }, // 12°C
    { dt: Date.now() / 1000 + 3600 * 1, temp: 285.15, weather: [{ main: "Clear", description: "Clear sky" }] }, // 12°C
    { dt: Date.now() / 1000 + 3600 * 2, temp: 286.15, weather: [{ main: "Clear", description: "Clear sky" }] }, // 13°C
    { dt: Date.now() / 1000 + 3600 * 3, temp: 287.15, weather: [{ main: "Clear", description: "Clear sky" }] }, // 14°C
    { dt: Date.now() / 1000 + 3600 * 4, temp: 289.15, weather: [{ main: "Clear", description: "Clear sky" }] }, // 16°C
    { dt: Date.now() / 1000 + 3600 * 5, temp: 290.15, weather: [{ main: "Clear", description: "Clear sky" }] }, // 17°C
    { dt: Date.now() / 1000 + 3600 * 6, temp: 291.15, weather: [{ main: "Clear", description: "Clear sky" }] }, // 18°C
    { dt: Date.now() / 1000 + 3600 * 7, temp: 292.15, weather: [{ main: "Clear", description: "Clear sky" }] }, // 19°C
    { dt: Date.now() / 1000 + 3600 * 8, temp: 293.15, weather: [{ main: "Clear", description: "Clear sky" }] }  // 20°C
  ],
  daily: [
    { dt: Date.now() / 1000 + 86400 * 0, temp: { day: 289.15 }, weather: [{ main: "Clear", description: "Clear sky" }], uvi: 3 }, // 16°C
    { dt: Date.now() / 1000 + 86400 * 1, temp: { day: 288.15 }, weather: [{ main: "Clear", description: "Clear sky" }], uvi: 3 }, // 15°C
    { dt: Date.now() / 1000 + 86400 * 2, temp: { day: 288.15 }, weather: [{ main: "Clear", description: "Clear sky" }], uvi: 4 }, // 15°C
    { dt: Date.now() / 1000 + 86400 * 3, temp: { day: 288.15 }, weather: [{ main: "Clear", description: "Clear sky" }], uvi: 4 }, // 15°C
    { dt: Date.now() / 1000 + 86400 * 4, temp: { day: 289.15 }, weather: [{ main: "Clear", description: "Clear sky" }], uvi: 3 }, // 16°C
    { dt: Date.now() / 1000 + 86400 * 5, temp: { day: 290.15 }, weather: [{ main: "Clear", description: "Clear sky" }], uvi: 4 }, // 17°C
    { dt: Date.now() / 1000 + 86400 * 6, temp: { day: 291.15 }, weather: [{ main: "Clear", description: "Clear sky" }], uvi: 4 }, // 18°C
    { dt: Date.now() / 1000 + 86400 * 7, temp: { day: 291.15 }, weather: [{ main: "Clear", description: "Clear sky" }], uvi: 5 }  // 18°C
  ]
};