export const getBackgroundImage = (weatherMain: string): string => {
  const backgrounds = {
    Clear: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1920',
    Clouds: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920',
    Rain: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1920',
    Snow: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1920',
    Thunderstorm: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1920',
    Drizzle: 'https://images.unsplash.com/photo-1541919329513-35f7af297129?auto=format&fit=crop&w=1920',
    Mist: 'https://images.unsplash.com/photo-1543968996-ee822b8176ba?auto=format&fit=crop&w=1920'
  };
  
  return backgrounds[weatherMain as keyof typeof backgrounds] || backgrounds.Clear;
};

export const kelvinToCelsius = (kelvin: number): number => {
  return Math.round(kelvin - 273.15);
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    hour12: false
  });
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'numeric'
  });
};

export const getUVIndexDescription = (uvi: number): string => {
  if (uvi <= 2) return 'Low';
  if (uvi <= 5) return 'Moderate';
  if (uvi <= 7) return 'High';
  if (uvi <= 10) return 'Very High';
  return 'Extreme';
};

export const metersToMiles = (meters: number): number => {
  return Math.round(meters / 1609.34);
};

export const mpsToMph = (mps: number): number => {
  return Math.round(mps * 2.237 * 10) / 10;
};