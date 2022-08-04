import { useEffect, useState } from 'react';
import { BsCloudRain, BsClouds } from 'react-icons/bs';
import { IoSnowOutline } from 'react-icons/io5';
import { TiWeatherSunny } from 'react-icons/ti';
import './App.css';
import ModalLoading from './components/ModalLoading';


const APIKEY = '573f8e9a386bca9cafc258bce0c1d683';
// const url = (city = 'californ') => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`;
const url = (city = 'californ') => `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}`;
const url_current = (city = 'californ') => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`;

const BGDICTIONARY = {
  clouds: 'linear-gradient(0deg, rgba(232,232,232,1) 0%, rgba(168,168,203,1) 35%, rgba(152,178,212,1) 100%)',
  rain: 'linear-gradient(0deg, rgba(167,167,167,1) 0%, rgba(117,117,156,1) 35%, rgba(75,96,128,1) 100%)',
  clear: 'linear-gradient(0deg, rgba(189,213,223,1) 0%, rgba(161,205,255,1) 25%, rgba(89,155,255,1) 100%)',
  snow: 'linear-gradient(0deg, rgba(201,201,201,1) 0%, rgba(186,186,224,1) 35%, rgba(191,207,235,1) 100%)'
};
const FONTCOLORDICTIONARY = {
  clouds: 'rgb(149, 148, 181)',
  rain: 'rgb(103, 103, 138)',
  clear: 'rgb(123, 163, 209)',
  snow: 'rgb(140, 140, 156)'
}
const ICONDICTIONARY = {
  clouds: <BsClouds className='weather-icon' />,
  rain: <BsCloudRain className='weather-icon' />,
  clear: <TiWeatherSunny className='weather-icon' />,
  snow: <IoSnowOutline className='weather-icon' />,
};

const formatKey = key => {
  key = key.replace('_', ' ');
  return key.charAt(0).toUpperCase() + key.slice(1);
};

const infoCard = (key, value, i) => (
  <div className='info-card' key={ i }>
    <span className='info-card-title'>{ formatKey(key) }: </span>
    <span className={ 'info-card-value' + ((key.includes('temp') || key === 'feels_like') && ' degs') }>{ (key.includes('temp') || key === 'feels_like') ? Math.round(value - 273.15) : value }</span>
  </div>
);

const forecastWeatherElement = (key, hour = 'now', index) => {
  return (
  <div className='forecast-weather-element' key={ index }>
    { ICONDICTIONARY[key] }
    <span>{ hour }</span>
  </div>
)};

function App() {
  
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState({});
  const [current_data, setCurrentData] = useState({});
  const [last_city, setLastCity] = useState('californ');
  const [background, setBackground] = useState('');
  const [font_color, setFontColor] = useState('');

  const handleSuccessFetch = (data, city) => {
    console.log('FORECAST: ')
    console.log(data);

    // Set state
    setData(data);
    setStatus('ok');
    setLastCity(city);
  };

  const handleSuccessFetchCurrentData = (data, city) => {
    const key = data.weather[0].main.toLowerCase();
    console.log('CURRENT: ');
    console.log(data);

    // Set current data
    setCurrentData(data);

    // Set style
    const background = BGDICTIONARY[key];
    setBackground(background);
    const font_color = FONTCOLORDICTIONARY[key];
    setFontColor(font_color);

    // Set rain or snow
    if (key === 'rain') console.log('RAIN');
    if (key === 'snow') console.log('SNOW');
  };

  const fetchCurrentData = city => {
    setStatus('loading');
    fetch(url_current(city))
      .then(res => res.json())
      .then(data => {
        if (data.cod != 200) return setStatus('no res');
        handleSuccessFetchCurrentData(data, city);
      })
      .catch(err => console.error(err));
  };
  
  const fetchData = city => {
    fetch(url(city))
      .then(res => res.json())
      .then(data => {
        if (data.cod != 200) return setStatus('no res');
        handleSuccessFetch(data, city);
      })
      .catch(err => {
        setStatus('err');
        console.error(err);
      });
  };

  const handleInputChange = e => {
    e.preventDefault();

    fetchCurrentData(e.target.value || last_city);
    fetchData(e.target.value || last_city);
  };

  useEffect(() => {
    fetchCurrentData();
    fetchData();
  }, []);

  return data.city && (
    <div className='App'>
      {
        // Loading Spinner
        status === 'loading' && <ModalLoading />
      }
      {/* GOOD ONE */}
      <div className='main-info' style={ {background: background} }>
        <div className='input-container'>
          <input type='text' className='city-input' id='city-name' placeholder='City Name' onChange={ handleInputChange } autoComplete='off' />
        </div>
        <span className='weather-status'>{ current_data.weather[0].main }</span>
        <span className='weather-deg'>{ Math.round(current_data.main.temp - 273.15) }</span>
      </div>
      <svg className='waves' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#fefeff" fill-opacity="1" d="M0,64L40,64C80,64,160,64,240,90.7C320,117,400,171,480,181.3C560,192,640,160,720,154.7C800,149,880,171,960,181.3C1040,192,1120,192,1200,186.7C1280,181,1360,171,1400,165.3L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path></svg>
      <div className='specific-info'>
        <h1 className='city-name' style={ {color: font_color} }>{ data.city.name }</h1>
        <p className='tomorrow-text'><span className='bold'>Tomorrow:</span> { data.list[0].dt_txt.split(' ')[0] }</p>
        <div className='forecast-weather-container'>
          {
            data.list.slice(0, 5).map((ele, i) => forecastWeatherElement(ele.weather[0].main.toLowerCase(), ele.dt_txt.split(' ')[1].split(':')[0], i))
          }
        </div>
        <div className='info-cards-container'>
          {/* {
            Object.keys(data.main).map((key, i) => infoCard(key, data.main[key], i))
          } */}
        </div>
      </div>
    </div>
  )
}

export default App
