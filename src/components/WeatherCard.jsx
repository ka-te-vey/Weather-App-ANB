const WeatherCard = ({ weather, isCurrentLocation }) => {
  const [date] = useState(new Date());

  const getWeatherIcon = (desc) => {
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

  if (!weather) return (
    <div className="text-center p-6 mt-6 text-gray-600 bg-white rounded-2xl shadow-lg">
      <p>Loading weather data...</p>
    </div>
  );

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="text-center p-6 mt-6 text-black bg-white rounded-2xl shadow-lg">
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-2xl capitalize font-semibold">{weather.city}</h2>
        {isCurrentLocation && (
          <MapPin className="w-5 h-5 text-blue-500" />
        )}
      </div>
      <h2 className="text-md mt-1 uppercase text-gray-600">
        {date.toLocaleDateString("en-US", {
          weekday: "long",
        })}{" "}
        {formattedTime}
      </h2>

      <div className="flex justify-center pt-7">
        {getWeatherIcon(weather.desc)}
      </div>

      <h1 className="text-5xl font-medium mt-10">{Math.round(weather.temp)}°C</h1>
      <p className="text-md pt-2 italic capitalize text-gray-700">{weather.desc}</p>

      <div className="flex gap-5 items-center mt-10 justify-center flex-wrap">
        <div className="border border-blue-300 p-4 flex items-center justify-center gap-4 rounded-xl shadow-md bg-white min-w-[150px]">
          <Droplets className="w-10 h-10 text-blue-500" />
          <div>
            <p className="font-medium text-gray-700">Humidity</p>
            <p className="font-bold text-blue-500 text-lg">
              {weather.humidity}%
            </p>
          </div>
        </div>

        <div className="border border-blue-300 p-4 flex items-center justify-center gap-4 rounded-xl shadow-md bg-white min-w-[150px]">
          <Wind className="w-10 h-10 text-blue-500" />
          <div>
            <p className="font-medium text-gray-700">Wind</p>
            <p className="font-bold text-blue-500 text-lg">
              {weather.wind} m/s
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
