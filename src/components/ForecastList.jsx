const ForecastList = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="w-full mt-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">5-Day Forecast</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <div key={index} className="bg-white shadow-md py-4 px-5 rounded-lg text-center text-black hover:shadow-lg transition">
            <p className="font-semibold text-lg">{day.date}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt="weather icon"
              className="mx-auto w-16 h-16"
            />
            <p className="text-xl font-bold text-blue-600">{day.temp}°C</p>
            <p className="capitalize text-sm text-gray-600">{day.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
