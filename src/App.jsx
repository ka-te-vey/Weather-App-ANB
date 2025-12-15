import { useState, useEffect } from "react";
import { Wind, MapPin } from "lucide-react";
import humidity from "./assets/humidity.png";
import rain from "./assets/rain.png";
import summer from "./assets/summer.png";
import sunWithCloud from "./assets/sun-with-cloud.png";
import winter from "./assets/winter.png";
import "./App.css";

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [city, setCity] = useState("");

  const apiKey = "6d055e39ee237af35ca066f35474e9df";

  const getWeatherIcon = (desc, temp, size = "w-28 h-28") => {
    if (!desc) return <img src={sunWithCloud} alt="weather icon" className={size} />;
    const description = desc.toLowerCase();
    if (description.includes("rain")) {
      return <img src={rain} alt="rain icon" className={size} />;
    } else if (description.includes("snow") || temp <= 0) {
      return <img src={winter} alt="snow icon" className={size} />;
    } else if (description.includes("clear")) {
      return <img src={summer} alt="clear icon" className={size} />;
    } else {
      return <img src={sunWithCloud} alt="cloud icon" className={size} />;
    }
  };

  const fetchWeatherData = async (cityName) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found!");
      }

      const data = await response.json();
      const today = data.list[0];

      const weatherData = {
        city: data.city.name,
        temp: today.main.temp,
        desc: today.weather[0].description,
        humidity: today.main.humidity,
        wind: today.wind.speed,
      };

      const daily = data.list
        .filter((item) => item.dt_txt.includes("12:00:00"))
        .slice(0, 5)
        .map((day) => ({
          date: new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" }),
          temp: Math.round(day.main.temp),
          temp_min: Math.round(day.main.temp_min),
          temp_max: Math.round(day.main.temp_max),
          desc: day.weather[0].description,
        }));

      setWeather(weatherData);
      setForecast(daily);
      
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData("Phnom Penh");
  }, []);

  const handleSearch = () => {
    if (city.trim() === "") return;
    fetchWeatherData(city);
    setCity("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const date = new Date();
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="app-container">
      <div className="background"></div>
      <div className="content-container">
        {/* Header */}
        <div className="max-w-6xl mx-auto w-full overflow-y-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <h1 className="text-black text-3xl font-bold">🌦️ Weather Forecast</h1>
            
            {/* Search Box */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border border-gray-300 p-2 rounded-lg w-full sm:w-60 outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition w-full sm:w-auto"
              >
                Search
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && !weather && (
            <div className="text-gray-700 text-center text-lg mt-10">
              <div className="animate-pulse">Loading weather data...</div>
            </div>
          )}

          {/* Weather Display */}
          {weather && (
            <div className="max-w-2xl mx-auto">
              {/* Weather Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-2xl font-semibold">{weather.city}</h2>
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-gray-600 text-center mt-1">
                  {date.toLocaleDateString("en-US", { weekday: "long" })} {formattedTime}
                </p>

                <div className="flex justify-center py-6">
                  {getWeatherIcon(weather.desc, weather.temp)}
                </div>

                <h1 className="text-5xl font-medium text-center">
                  {Math.round(weather.temp)}°C
                </h1>
                <p className="text-gray-700 text-center mt-2 italic capitalize">
                  {weather.desc}
                </p>

                <div className="flex gap-4 mt-8 justify-center flex-wrap">
                  <div className="border border-blue-300 p-4 flex items-center gap-3 rounded-xl shadow">
                    <img src={humidity} alt="humidity icon" className="w-10 h-10" />
                    <div>
                      <p className="text-gray-700 font-medium">Humidity</p>
                      <p className="text-blue-500 font-bold text-lg">
                        {weather.humidity}%
                      </p>
                    </div>
                  </div>

                  <div className="border border-blue-300 p-4 flex items-center gap-3 rounded-xl shadow">
                    <Wind className="w-10 h-10 text-blue-500" />
                    <div>
                      <p className="text-gray-700 font-medium">Wind</p>
                      <p className="text-blue-500 font-bold text-lg">
                        {weather.wind} m/s
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forecast */}
              {forecast.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    5-Day Forecast
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    {forecast.map((day, index) => (
                      <div
                        key={index}
                        className="bg-white shadow-md py-4 px-3 rounded-lg text-center hover:shadow-lg transition border border-gray-200"
                      >
                        <p className="font-semibold text-lg">{day.date}</p>
                        <div className="w-16 h-16 mx-auto">
                          {getWeatherIcon(day.desc, day.temp, "w-16 h-16")}
                        </div>
                        <p className="text-xl font-bold text-blue-600">{day.temp}°C</p>
                        <div className="text-xs text-gray-500">
                          <p>Min: {day.temp_min}°C</p>
                          <p>Max: {day.temp_max}°C</p>
                        </div>
                        <p className="text-sm text-gray-600 capitalize mt-1">{day.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;