import { useState, useEffect } from "react";
import { Droplets, Wind, MapPin, Search } from "lucide-react";

import rain from "./assets/rain.png";
import summer from "./assets/summer.png";
import sunWithCloud from "./assets/sun-with-cloud.png";
import winter from "./assets/winter.png";

// ---------------- Weather Image Helper ----------------
const weatherImages = {
  rain,
  summer,
  sunWithCloud,
  winter,
};

const getWeatherImage = (desc, temp) => {
  if (!desc) return weatherImages.sunWithCloud;
  const d = desc.toLowerCase();

  if (temp <= 5 || d.includes("snow")) return weatherImages.winter;
  if (d.includes("rain") || d.includes("drizzle")) return weatherImages.rain;
  if (d.includes("clear")) return weatherImages.summer;
  return weatherImages.sunWithCloud;
};
// -----------------------------------------------------

export default function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);

  const apiKey = "6d055e39ee237af35ca066f35474e9df";

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    setLoading(true);

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();

    const today = data.list[0];

    setWeather({
      city: data.city.name,
      temp: Math.round(today.main.temp),
      desc: today.weather[0].description,
      humidity: today.main.humidity,
      wind: today.wind.speed,
    });

    const daily = data.list
      .filter((i) => i.dt_txt.includes("12:00:00"))
      .slice(1, 5)
      .map((d) => ({
        day: new Date(d.dt_txt).toLocaleDateString("en-US", { weekday: "short" }),
        temp: Math.round(d.main.temp),
        desc: d.weather[0].description,
      }));

    setForecast(daily);
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather("Phnom Penh");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-transparent">
      <div className="w-full max-w-sm">

        {/* SEARCH BAR */}
        <div className="flex items-center gap-3 mb-5">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather(city)}
            placeholder="Enter a City..."
            className="flex-1 px-5 py-3 rounded-full bg-white/30 backdrop-blur-sm shadow outline-none placeholder-gray-600 text-black"
          />
          <button
            onClick={() => fetchWeather(city)}
            className="p-3 rounded-full bg-black text-white shadow"
          >
            <Search size={20} />
          </button>
        </div>

        {/* WEATHER CARD */}
        {weather && !loading && (
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl p-6">

            {/* CITY + TEMP */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-1">
                  <MapPin size={18} /> {weather.city}
                </h1>
                <p className="capitalize text-gray-700/80 text-sm mt-1">
                  {weather.desc}
                </p>
              </div>
              <p className="text-5xl font-bold">{weather.temp}°C</p>
            </div>

            {/* ICON */}
            <div className="flex justify-center my-6">
              <img
                src={getWeatherImage(weather.desc, weather.temp)}
                className="w-28 h-28"
              />
            </div>

            {/* STATS ROW */}
            <div className="flex justify-between text-center mb-6">
              <div className="flex-1">
                <Droplets className="mx-auto" />
                <p className="font-semibold">{weather.humidity}%</p>
                <p className="text-xs text-gray-700/80">Humidity</p>
              </div>
              <div className="flex-1">
                <Wind className="mx-auto" />
                <p className="font-semibold">{weather.wind} m/s</p>
                <p className="text-xs text-gray-700/80">Wind</p>
              </div>
            </div>

            {/* FORECAST */}
            <div className="grid grid-cols-4 gap-3">
              {forecast.map((d, i) => (
                <div
                  key={i}
                  className="bg-white/30 backdrop-blur-sm rounded-2xl p-3 text-center"
                >
                  <p className="text-sm font-medium">{d.day}</p>
                  <img
                    src={getWeatherImage(d.desc, d.temp)}
                    className="w-8 h-8 mx-auto"
                  />
                  <p className="font-bold text-sm">{d.temp}°C</p>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}