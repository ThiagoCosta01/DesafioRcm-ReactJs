import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsSearch } from "react-icons/bs";

const api = {
  key: '6b0f472b0043337bd1cfd27da6efafc3',
  base: 'https://api.openweathermap.org/data/2.5/',
};

const App = () => {
  const [search, setSearch] = useState('');
  const [weather, setWeather] = useState({});
  const [userLocation, setUserLocation] = useState({});
  const urlApi = `${api.base}weather?q=${search}&units=metric&APPID=${api.key}&lang=pt_br`;
  const imgUrlUser = userLocation.weather ? `http://openweathermap.org/img/wn/${userLocation.weather[0].icon}.png` : '';
  const imgUrlWeather = weather.weather ? `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png` : '';

  useEffect(() => {
    getUserLocation();
  }, []); 

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getUserLocation = async () => {
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;
        const urlUser = `${api.base}weather?lat=${latitude}&lon=${longitude}&appid=${api.key}&lang=pt_br`;
        const results = await fetchData(urlUser);
        setUserLocation(results);
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    }
  };

  const searchPressed = async () => {
    try {
      const res = await fetch(urlApi);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const result = await res.json();
      setWeather(result);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="Container">
          <h1 className="custom-h1" id='title'>Clima - RMC</h1>
          <div className="UserLocation">
            <h3>Localização atual: </h3>

            <p>{userLocation.main && `${Math.trunc(userLocation.main.temp - 273.15)}°`}</p>
            <div className='d-flex  justify-content-center' id='cityWeatherDetails'>

              <p>{userLocation.name}</p>

              <div id='verticalLine' ></div>

              <p id='descWeather'>{userLocation.weather && userLocation.weather[0].description}</p>
              <img src={imgUrlUser} alt="" id="weather-icon" />
            </div>
          </div>
          <hr className="my-4" />
          <div className="Search">
            <h2>Pesquisar</h2>
            <div className='form-group d-flex align-items-center'>
              <input
                className='form-control'
                id='searchInput'
                type="text"
                placeholder="Cidade"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className='btn btn-secondary' onClick={searchPressed}> <BsSearch /></button>
            </div>
            {weather.main && (
              <div id="detailsLocation">
                <img src={`https://flagsapi.com/${weather.sys.country}/flat/64.png`} />
                <p>{weather.main.temp}°</p>
                <p id='cityNameWeather'>{weather.name}</p>
                <div className='d-flex align-items-center justify-content-center ' id='descWeather'>
                  <p>{weather.weather[0].description}</p>
                  <img src={imgUrlWeather} alt="Condições Climáticas" id="weather-icon" />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
