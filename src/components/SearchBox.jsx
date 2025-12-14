import { useState, useEffect } from "react";
import { Cloud, CloudRain, CloudSnow, Sun, Droplets, Wind, MapPin } from "lucide-react";

// SearchBox Component
const SearchBox = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    if (city.trim() === "") return;
    onSearch(city);
    setCity("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2 mt-6">
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyPress={handleKeyPress}
        className="border border-gray-300 p-2 rounded-lg w-60 outline-none focus:border-blue-500 bg-white text-black"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-5 py-1 rounded-lg hover:bg-blue-600 transition"
      >
        Search
      </button>
    </div>
  );
};
