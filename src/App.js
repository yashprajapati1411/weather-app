import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!location) {
      setError("Please enter a valid location.");
      return;
    }
    setError("");
    const apiKey = "1ff28cf77b014684bea182505250802";
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=yes&alerts=no`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Unable to fetch data");
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      setError("Unable to fetch weather data. Please try again.");
    }
  };

  const getTime = (dateTimeString) => {
    const options = { weekday: "long", hour: "2-digit", minute: "2-digit" };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchWeather(); // Trigger the fetchWeather function when the Enter key is pressed
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Weather App</h1>
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={handleKeyDown} // Handle the key down event here
        />
        <button onClick={fetchWeather}>Get Weather</button>
        {error && <p className="error">{error}</p>}
        {weatherData && (
          <div>
            <div className="current-weather">
              <h2>{weatherData.location.name}, {weatherData.location.region}</h2>
              <p>{getTime(weatherData.location.localtime)}</p>
              <h3>{weatherData.current.temp_c}°C</h3>
              <p>{weatherData.current.condition.text}</p>
              <p>Humidity: {weatherData.current.humidity}%</p>
              <p>Wind: {weatherData.current.wind_kph} km/h</p>
            </div>

            <div className="hourly-forecast">
              <h2>Hourly Forecast</h2>
              <div className="hourly-cards">
                {weatherData.forecast.forecastday[0].hour.map((hour, index) => (
                  <div key={index} className="hour-card">
                    <p>{new Date(hour.time).getHours()}:00</p>
                    <p>{hour.temp_c}°C</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="weekly-forecast">
              <h2>Weekly Forecast</h2>
              <div className="weekly-cards">
                {weatherData.forecast.forecastday.map((day, index) => (
                  <div key={index} className="day-card">
                    <p>{new Date(day.date).toLocaleDateString("en-US", { weekday: "long" })}</p>
                    <p>High: {day.day.maxtemp_c}°C</p>
                    <p>Low: {day.day.mintemp_c}°C</p>
                    <p>{day.day.condition.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
