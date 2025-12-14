import { useState, useEffect } from "react";
import { Cloud, CloudRain, CloudSnow, Sun, Droplets, Wind, MapPin } from "lucide-react";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [currentForecast, setCurrentForecast] = useState([]);
  const [searchedWeather, setSearchedWeather] = useState(null);
  const [searchedForecast, setSearchedForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [city, setCity] = useState("");

  const apiKey = "6d055e39ee237af35ca066f35474e9df";

  const getWeatherIcon = (desc) => {
    if (!desc) return <Cloud className="w-28 h-28 text-gray-400" />;
    const description = desc.toLowerCase();
    if (description.includes("rain")) {
      return <CloudRain className="w-28 h-28 text-blue-400" />;
    } else if (description.includes("snow")) {
      return <CloudSnow className="w-28 h-28 text-blue-200" />;
    } else if (description.includes("clear")) {
      return <Sun className="w-28 h-28 text-yellow-400" />;
    } else {
      return <Cloud className="w-28 h-28 text-gray-400" />;
    }
  };

  const fetchWeatherData = async (cityName, isCurrentLocation = false) => {
    try {
      if (!isCurrentLocation) setLoading(true);
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
          desc: day.weather[0].description,
          icon: day.weather[0].icon,
        }));

      if (isCurrentLocation) {
        setCurrentWeather(weatherData);
        setCurrentForecast(daily);
      } else {
        setSearchedWeather(weatherData);
        setSearchedForecast(daily);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData("Phnom Penh", true);
  }, []);

  const handleSearch = () => {
    if (city.trim() === "") return;
    fetchWeatherData(city, false);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <h1 className="text-blue-600 text-3xl font-bold">🌦️ Weather Forecast</h1>
          
          {/* Search Box */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border border-gray-300 p-2 rounded-lg w-60 outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
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
        {loading && !currentWeather && (
          <div className="text-gray-700 text-center text-lg mt-10">
            <div className="animate-pulse">Loading weather data...</div>
          </div>
        )}

        {/* Weather Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Location */}
          {currentWeather && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Your Location
              </h2>
              
              {/* Weather Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-2xl font-semibold">{currentWeather.city}</h2>
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-gray-600 text-center mt-1">
                  {date.toLocaleDateString("en-US", { weekday: "long" })} {formattedTime}
                </p>

                <div className="flex justify-center py-6">
                  {getWeatherIcon(currentWeather.desc)}
                </div>

                <h1 className="text-5xl font-medium text-center">
                  {Math.round(currentWeather.temp)}°C
                </h1>
                <p className="text-gray-700 text-center mt-2 italic capitalize">
                  {currentWeather.desc}
                </p>

                <div className="flex gap-4 mt-8 justify-center flex-wrap">
                  <div className="border border-blue-300 p-4 flex items-center gap-3 rounded-xl shadow">
                    <Droplets className="w-10 h-10 text-blue-500" />
                    <div>
                      <p className="text-gray-700 font-medium">Humidity</p>
                      <p className="text-blue-500 font-bold text-lg">
                        {currentWeather.humidity}%
                      </p>
                    </div>
                  </div>

                  <div className="border border-blue-300 p-4 flex items-center gap-3 rounded-xl shadow">
                    <Wind className="w-10 h-10 text-blue-500" />
                    <div>
                      <p className="text-gray-700 font-medium">Wind</p>
                      <p className="text-blue-500 font-bold text-lg">
                        {currentWeather.wind} m/s
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forecast */}
              {currentForecast.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    5-Day Forecast
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {currentForecast.map((day, index) => (
                      <div
                        key={index}
                        className="bg-white shadow-md py-4 px-3 rounded-lg text-center hover:shadow-lg transition"
                      >
                        <p className="font-semibold text-lg">{day.date}</p>
                        <img
                          src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                          alt="weather"
                          className="mx-auto w-16 h-16"
                        />
                        <p className="text-xl font-bold text-blue-600">{day.temp}°C</p>
                        <p className="text-sm text-gray-600 capitalize">{day.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Searched City */}
          {searchedWeather && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Search Results
              </h2>
              
              {/* Weather Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-center">
                  {searchedWeather.city}
                </h2>
                <p className="text-gray-600 text-center mt-1">
                  {date.toLocaleDateString("en-US", { weekday: "long" })} {formattedTime}
                </p>

                <div className="flex justify-center py-6">
                  {getWeatherIcon(searchedWeather.desc)}
                </div>

                <h1 className="text-5xl font-medium text-center">
                  {Math.round(searchedWeather.temp)}°C
                </h1>
                <p className="text-gray-700 text-center mt-2 italic capitalize">
                  {searchedWeather.desc}
                </p>

                <div className="flex gap-4 mt-8 justify-center flex-wrap">
                  <div className="border border-blue-300 p-4 flex items-center gap-3 rounded-xl shadow">
                    <Droplets className="w-10 h-10 text-blue-500" />
                    <div>
                      <p className="text-gray-700 font-medium">Humidity</p>
                      <p className="text-blue-500 font-bold text-lg">
                        {searchedWeather.humidity}%
                      </p>
                    </div>
                  </div>

                  <div className="border border-blue-300 p-4 flex items-center gap-3 rounded-xl shadow">
                    <Wind className="w-10 h-10 text-blue-500" />
                    <div>
                      <p className="text-gray-700 font-medium">Wind</p>
                      <p className="text-blue-500 font-bold text-lg">
                        {searchedWeather.wind} m/s
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forecast */}
              {searchedForecast.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    5-Day Forecast
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {searchedForecast.map((day, index) => (
                      <div
                        key={index}
                        className="bg-white shadow-md py-4 px-3 rounded-lg text-center hover:shadow-lg transition"
                      >
                        <p className="font-semibold text-lg">{day.date}</p>
                        <img
                          src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                          alt="weather"
                          className="mx-auto w-16 h-16"
                        />
                        <p className="text-xl font-bold text-blue-600">{day.temp}°C</p>
                        <p className="text-sm text-gray-600 capitalize">{day.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Empty State */}
        {!loading && currentWeather && !searchedWeather && (
          <div className="text-gray-600 text-center mt-10">
            <p className="text-lg">Search for a city to compare weather</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;