import { useState, useEffect } from "react";
import { Droplets, Wind, MapPin } from "lucide-react";
import humidity from './assets/humidity.png';
import rain from './assets/rain.png';
import summer from './assets/summer.png';
import sunWithCloud from './assets/sun-with-cloud.png';
import winter from './assets/winter.png';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [currentForecast, setCurrentForecast] = useState([]);
  const [searchedWeather, setSearchedWeather] = useState(null);
  const [searchedForecast, setSearchedForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [city, setCity] = useState("");

  const apiKey = "6d055e39ee237af35ca066f35474e9df";

  // Weather images object
  const weatherImages = {
    rain: rain,
    summer: summer,
    sunWithCloud: sunWithCloud,
    winter: winter,
    humidity: humidity
  };

  // Get local weather image based on description AND temperature
  const getWeatherImage = (desc, temp) => {
    if (!desc) return weatherImages.sunWithCloud;
    
    const description = desc.toLowerCase();
    const temperature = temp || 0;
    
    // If it's very cold (below 10°C), prioritize winter imagery
    if (temperature <= 10) {
      if (description.includes("snow")) {
        return weatherImages.winter;
      } else if (description.includes("rain") || description.includes("drizzle")) {
        return weatherImages.rain;
      } else if (temperature <= 3) {
        // Very cold - show winter even if clear/cloudy
        return weatherImages.winter;
      } else {
        // Cold but not freezing (4-10°C) - show clouds
        return weatherImages.sunWithCloud;
      }
    }
    
    // Normal temperature logic (above 10°C)
    if (description.includes("rain") || description.includes("drizzle")) {
      return weatherImages.rain;
    } else if (description.includes("snow")) {
      return weatherImages.winter;
    } else if (description.includes("clear")) {
      return weatherImages.summer;
    } else if (description.includes("cloud")) {
      return weatherImages.sunWithCloud;
    } else if (description.includes("mist") || description.includes("fog") || description.includes("haze")) {
      return weatherImages.sunWithCloud;
    } else {
      return weatherImages.sunWithCloud;
    }
  };

  const fetchWeatherData = async (cityName, isCurrentLocation = false) => {
    try {
      if (isCurrentLocation) {
        setLoading(true);
      } else {
        setSearchLoading(true);
      }
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
        .filter((item) => {
          const time = item.dt_txt.split(' ')[1];
          return time === "12:00:00" || time === "15:00:00" || time === "09:00:00";
        })
        .reduce((acc, day) => {
          const date = day.dt_txt.split(' ')[0];
          if (!acc.find(d => d.date === date)) {
            acc.push({
              date: date,
              temp: Math.round(day.main.temp),
              desc: day.weather[0].description,
            });
          }
          return acc;
        }, [])
        .slice(0, 5)
        .map((day) => ({
          date: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
          temp: day.temp,
          desc: day.desc,
        }));

      if (isCurrentLocation) {
        setCurrentWeather(weatherData);
        setCurrentForecast(daily);
        setLoading(false);
      } else {
        setSearchedWeather(weatherData);
        setSearchedForecast(daily);
        setSearchLoading(false);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      setTimeout(() => setError(""), 3000);
      if (isCurrentLocation) {
        setLoading(false);
      } else {
        setSearchLoading(false);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex flex-col items-center">
      {/* Header */}
      <div className="max-w-4xl w-full px-4">
        <div className="flex flex-col items-center gap-4 mb-8 w-full">
          <h1 className="text-blue-600 text-3xl font-bold text-center">🌦️ Weather Forecast</h1>
          
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-2xl mx-auto text-center">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && !currentWeather && (
          <div className="text-gray-700 text-center text-lg mt-10">
            <div className="animate-pulse">Loading weather data...</div>
          </div>
        )}

        {/* Weather Cards Container */}
        <div className="flex flex-col items-center justify-center w-full gap-8 max-w-lg mx-auto">
          
          {/* Current Location Weather - Only show if no searched city */}
          {currentWeather && !searchedWeather && !searchLoading && (
            <div className="w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
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
                  <img 
                    src={getWeatherImage(currentWeather.desc, currentWeather.temp)} 
                    alt={currentWeather.desc}
                    className="w-32 h-32 object-contain"
                  />
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
                  <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                    5-Day Forecast
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {currentForecast.map((day, index) => (
                      <div
                        key={index}
                        className="bg-white shadow-md py-3 px-2 rounded-lg text-center hover:shadow-lg transition"
                      >
                        <p className="font-semibold text-sm">{day.date}</p>
                        <div className="flex justify-center items-center h-12 my-2">
                          <img 
                            src={getWeatherImage(day.desc, day.temp)} 
                            alt={day.desc}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <p className="text-lg font-bold text-blue-600">{day.temp}°C</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search Loading */}
          {searchLoading && (
            <div className="text-gray-700 text-center text-lg">
              <div className="animate-pulse">Searching...</div>
            </div>
          )}

          {/* Searched City Weather */}
          {searchedWeather && !searchLoading && (
            <div className="w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
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
                  <img 
                    src={getWeatherImage(searchedWeather.desc, searchedWeather.temp)} 
                    alt={searchedWeather.desc}
                    className="w-32 h-32 object-contain"
                  />
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
                  <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                    5-Day Forecast
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {searchedForecast.map((day, index) => (
                      <div
                        key={index}
                        className="bg-white shadow-md py-3 px-2 rounded-lg text-center hover:shadow-lg transition"
                      >
                        <p className="font-semibold text-sm">{day.date}</p>
                        <div className="flex justify-center items-center h-12 my-2">
                          <img 
                            src={getWeatherImage(day.desc, day.temp)} 
                            alt={day.desc}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <p className="text-lg font-bold text-blue-600">{day.temp}°C</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to Current Location Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setSearchedWeather(null);
                    setSearchedForecast([]);
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Back to Your Location
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Empty State */}
        {!loading && currentWeather && !searchedWeather && !searchLoading && (
          <div className="text-gray-600 text-center mt-10">
            <p className="text-lg">Search for a city to see its current weather</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;