export type WeatherKind = 'clear' | 'rain' | 'night'

export const WEATHER_OPTIONS: { id: WeatherKind; label: string }[] = [
  { id: 'clear', label: 'Clear' },
  { id: 'rain', label: 'Rain' },
  { id: 'night', label: 'Night' },
]
