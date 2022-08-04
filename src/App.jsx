import { useEffect, useState } from 'react';
import './App.css';
import ModalLoading from './components/ModalLoading';
import logo from './logo.svg';

const APIKEY = '573f8e9a386bca9cafc258bce0c1d683';
const url = (city = 'californ') => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`;

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

function App() {
  
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState({});
  const [last_city, setLastCity] = useState('californ');
  const [background, setBackground] = useState('');
  const [font_color, setFontColor] = useState('');

  const handleSuccessFetch = (data, city) => {
    const key = data.weather[0].main.toLowerCase();
    console.log(data);
    setData(data);
    setStatus('ok');
    setLastCity(city);
    const background = BGDICTIONARY[key];
    setBackground(background);
    const font_color = FONTCOLORDICTIONARY[key];
    setFontColor(font_color);
  };
  
  const fetchData = (city) => {
    setStatus('loading');
    fetch(url(city))
      .then(res => res.json())
      .then(data => {
        if (data.cod !== 200) return setStatus('no res');
        handleSuccessFetch(data, city);
      })
      .catch(err => {
        setStatus('err');
        console.error(err);
      });
  };

  const handleInputChange = e => {
    e.preventDefault();

    fetchData(e.target.value || last_city);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return data.main && (
    <div className='App'>
      {
        // Loading Spinner
        status === 'loading' && <ModalLoading />
      }
      {/* GOOD ONE */}
      <div className='main-info' style={ {background: background} }>
        <div className='input-container'>
          <input type='text' className='city-input' id='city-name' placeholder='City Name' onChange={ handleInputChange } />
        </div>
        <span className='weather-status'>{ data.weather[0].main }</span>
        <span className='weather-deg'>{ Math.round(data.main.temp - 273.15) }</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#ffffff" fill-opacity="1" d="M0,64L40,64C80,64,160,64,240,90.7C320,117,400,171,480,181.3C560,192,640,160,720,154.7C800,149,880,171,960,181.3C1040,192,1120,192,1200,186.7C1280,181,1360,171,1400,165.3L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path></svg>
      <div className='specific-info'>
        <h1 className='city-name' style={ {color: font_color} }>{ data.name }</h1>
        <div className='info-cards-container'>
          {
            Object.keys(data.main).map((key, i) => infoCard(key, data.main[key], i))
          }
        </div>
      </div>
    </div>
  )
}

export default App
