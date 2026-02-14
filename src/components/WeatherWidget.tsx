"use client";

import { useState, useEffect } from "react";
import Card from "./Card";
import { CloudSun, CloudRain, CloudSnow, CloudLightning, Cloud, Wind, Droplets, MapPin, RefreshCw } from "lucide-react";

interface WeatherData {
  temperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  isLoading: boolean;
  error?: string;
}

const getWeatherIcon = (code: number) => {
  if (code === 0) return <CloudSun className="w-12 h-12 text-yellow-400" />;
  if (code >= 1 && code <= 3) return <Cloud className="w-12 h-12 text-gray-400" />;
  if (code >= 51 && code <= 67) return <CloudRain className="w-12 h-12 text-blue-400" />;
  if (code >= 71 && code <= 77) return <CloudSnow className="w-12 h-12 text-cyan-300" />;
  if (code >= 80 && code <= 82) return <CloudRain className="w-12 h-12 text-blue-500" />;
  if (code >= 95) return <CloudLightning className="w-12 h-12 text-yellow-500" />;
  return <Cloud className="w-12 h-12 text-gray-400" />;
};

const getWeatherDescription = (code: number): string => {
  if (code === 0) return "Klarer Himmel";
  if (code >= 1 && code <= 3) return "Leicht bewölkt";
  if (code >= 51 && code <= 67) return "Regnerisch";
  if (code >= 71 && code <= 77) return "Schneefall";
  if (code >= 80 && code <= 82) return "Schauer";
  if (code >= 95) return "Gewitter";
  return "Bewölkt";
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 0,
    weatherCode: 0,
    humidity: 0,
    windSpeed: 0,
    isLoading: true,
  });

  const fetchWeather = async () => {
    setWeather(prev => ({ ...prev, isLoading: true, error: undefined }));
    
    try {
      // Berlin coordinates
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m"
      );
      
      if (!response.ok) throw new Error("Failed to fetch weather");
      
      const data = await response.json();
      
      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        weatherCode: data.current.weather_code,
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        isLoading: false,
      });
    } catch (error) {
      setWeather(prev => ({
        ...prev,
        isLoading: false,
        error: "Could not load weather",
      }));
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000); // 30 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <Card title="Wetter" icon={<CloudSun className="w-5 h-5" />} accentColor="primary">
      <div className="flex flex-col items-center">
        {weather.isLoading ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : weather.error ? (
          <div className="flex flex-col items-center gap-2 text-destructive">
            <Cloud className="w-12 h-12" />
            <p className="text-sm">{weather.error}</p>
            <button
              onClick={fetchWeather}
              className="text-xs text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Berlin, DE</span>
            </div>
            
            {getWeatherIcon(weather.weatherCode)}
            
            <div className="mt-2 text-5xl font-bold">
              {weather.temperature}°C
            </div>
            
            <p className="text-muted-foreground mt-1">
              {getWeatherDescription(weather.weatherCode)}
            </p>
            
            <div className="flex gap-6 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span>{weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-4 h-4 text-gray-400" />
                <span>{weather.windSpeed} km/h</span>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
