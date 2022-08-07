import { useEffect, useState } from 'react';
import { BsCloudDrizzle, BsCloudMoon, BsCloudRain, BsCloudSun } from 'react-icons/bs';
import { IoSnowOutline } from 'react-icons/io5';
import { TbMist } from 'react-icons/tb';
import { TiWeatherNight, TiWeatherSunny } from 'react-icons/ti';
import { WiDayThunderstorm, WiNightAltThunderstorm } from 'react-icons/wi';
import './App.css';
import ModalLoading from './components/ModalLoading';


const APIKEY = '573f8e9a386bca9cafc258bce0c1d683';
const url = (city = 'californ') => `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}`;
const url_current = (city = 'californ') => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`;

const BGDICTIONARY = {
  clouds: 'linear-gradient(0deg, rgba(232,232,232,1) 0%, rgba(168,168,203,1) 35%, rgba(152,178,212,1) 100%)',
  rain: 'linear-gradient(0deg, rgba(167,167,167,1) 0%, rgba(117,117,156,1) 35%, rgba(75,96,128,1) 100%)',
  clear: 'linear-gradient(0deg, rgba(189,213,223,1) 0%, rgba(161,205,255,1) 25%, rgba(89,155,255,1) 100%)',
  snow: 'linear-gradient(0deg, rgba(201,201,201,1) 0%, rgba(186,186,224,1) 35%, rgba(191,207,235,1) 100%)',
  thunderstorm: 'linear-gradient(0deg, rgba(42,71,84,1) 0%, rgba(0,40,83,1) 25%, rgba(0,28,69,1) 100%)'
};
const FONTCOLORDICTIONARY = {
  clouds: 'rgb(149, 148, 181)',
  rain: 'rgb(103, 103, 138)',
  clear: 'rgb(123, 163, 209)',
  snow: 'rgb(140, 140, 156)',
  thunderstorm: 'rgb(1, 30, 61)'
}
const ICONDICTIONARY = {
  // DAY
  '01d': <TiWeatherSunny className='weather-icon' />,
  '02d': <BsCloudSun className='weather-icon' />,
  '09d': <BsCloudDrizzle className='weather-icon' />,
  '10d': <BsCloudRain className='weather-icon' />,
  '11d': <WiDayThunderstorm className='weather-icon' />,
  '13d': <IoSnowOutline className='weather-icon' />,
  '50d': <TbMist className='weather-icon' />,
  // NIGHT
  '01n': <TiWeatherNight className='weather-icon' />,
  '02n': <BsCloudMoon className='weather-icon' />,
  '09n': <BsCloudDrizzle className='weather-icon' />,
  '10n': <BsCloudRain className='weather-icon' />,
  '11n': <WiNightAltThunderstorm className='weather-icon' />,
  '13n': <IoSnowOutline className='weather-icon' />,
  '50n': <TbMist className='weather-icon' />,
};
const MAINDATADICTIONARY = {
  temp: 'Temperature',
  temp_min: 'Min Temperature',
  temp_max: 'Max Temperature',
  feels_like: 'Feels like',
  humidity: 'Humidity',
  pressure: 'Pressure',
  sea_level: 'Sea level pressure',
  grnd_level: 'Ground level pressure'
};

const forecastWeatherElement = (key, hour = 'now', index) => {
  if (key === '03d' || key === '04d') key = '02d';
  if (key === '03n' || key === '04n') key = '02n';

  return (
  <div className='forecast-weather-element' key={ index }>
    { ICONDICTIONARY[key] }
    <span>{ hour }</span>
  </div>
)};

const infoData = (data) => {
  // infot_to_display: true = today | false = forecast
  if (data.temp_kf) delete data.temp_kf;

  return (
    <div className='info-data-container'>
      {
        Object.entries(data).map((info_data, index) => (
          <div key={ index } className='info-data-row'>
            <div className='info-data-key'>{ MAINDATADICTIONARY[info_data[0]] }</div>
            <div className={ 'info-data-value' + ((info_data[0].includes('temp') || info_data[0] === 'feels_like') ? ' degs' : '') }>{ (info_data[0].includes('temp') || info_data[0] === 'feels_like') ? Math.round(info_data[1] - 273.15) : info_data[1] }</div>
          </div>
        ))
      }
    </div>
  );
};

function App() {
  
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState({});
  const [current_data, setCurrentData] = useState({});
  const [last_city, setLastCity] = useState('californ');
  const [background, setBackground] = useState('');
  const [font_color, setFontColor] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [hours_arr, setHoursArr] = useState([]);
  const [required_index, setRequiredIndex] = useState(0);
  const [current_info_display, setCurrentInfoDisplay] = useState(true); // true = today | false = forecast

  const handleSuccessFetch = (data, city) => {
    // Set state
    setData(data);
    setStatus('ok');
    setLastCity(city);
    setDate(data.list[0].dt_txt.split(' ')[0]);
    setHour(data.list[0].dt_txt.split(' ')[1]);

    // Set initial hours arr
    setHoursArr(
      [... new Set(
        data.list.map(ele => ele.dt_txt)
        .filter(date_ele => date_ele.includes(date)) // Get dates and hours of certain date
        .map(ele => ele.split(' ')[1])
      )]
    );
  };

  const handleSuccessFetchCurrentData = (data, city) => {
    const key = data.weather[0].main.toLowerCase();

    // Set current data
    setCurrentData(data);

    // Set style
    const background = BGDICTIONARY[key];
    setBackground(background);
    const font_color = FONTCOLORDICTIONARY[key];
    setFontColor(font_color);

    // Set rain or snow
    // if (key === 'rain') console.log('RAIN');
    // if (key === 'snow') console.log('SNOW');
    // if (key === 'thunderstorm') console.log('THUNDERSTORM');
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

  const changeForecastData = (date, hour) => {
    const complete_date = date + ' ' + hour;

    for (let i = 0; i < data.list.length; i++) {
      if (data.list[i].dt_txt == complete_date) {
        return setRequiredIndex(i);
      }
    }
  };

  const handleInputChange = e => {
    e.preventDefault();

    fetchCurrentData(e.target.value || last_city);
    fetchData(e.target.value || last_city);
  };

  const getDatesArr = arr => {
    return Array.from(new Set(arr.map(ele => ele.dt_txt.split(' ')[0])));
  };

  const handleDateSelectChange = e => {
    setDate(e.target.value);
    
    // Set hours arr to display options
    setHoursArr(
      data.list.map(ele => ele.dt_txt)
        .filter(date => date.includes(e.target.value)) // Get dates and hours of certain date
        .map(ele => ele.split(' ')[1]) // Get only hours
    );

    // Change forecast data
    changeForecastData(e.target.value, hour);
  };

  const handleHourSelectChange = e => {
    setHour(e.target.value);

    // Change forecast data
    changeForecastData(date, e.target.value);
  };

  const handleTabChange = tab => {
    let today_tab = document.getElementById('today-tab');
    let forecast_tab = document.getElementById('forecast-tab');

    if (tab === 'today') {
      setCurrentInfoDisplay(true);

      forecast_tab.style.border = 'none';
      today_tab.style.borderBottom = `2px solid ${font_color}`;
    } else {
      setCurrentInfoDisplay(false);

      today_tab.style.borderBottom = 'none';
      forecast_tab.style.borderBottom = `2px solid ${font_color}`;
    }
  };

  useEffect(() => {
    fetchCurrentData();
    fetchData();
  }, []);

  return (data.city && current_data) && (
    <div className='App'>
      {
        // Loading Spinner
        status === 'loading' && <ModalLoading />
      }
      <div className='main-info' style={ {background: background} }>
        <div className='input-container'>
          <input type='text' className='city-input' id='city-name' placeholder='City Name' onChange={ handleInputChange } autoComplete='off' />
        </div>
        <span id='weather-status'>{ current_data.weather[0].main }</span>
        <span id='weather-deg'>{ Math.round(current_data.main.temp - 273.15) }</span>
      </div>
      <svg className='waves' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#fefeff" fillOpacity="1" d="M0,64L40,64C80,64,160,64,240,90.7C320,117,400,171,480,181.3C560,192,640,160,720,154.7C800,149,880,171,960,181.3C1040,192,1120,192,1200,186.7C1280,181,1360,171,1400,165.3L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path></svg>
      <div className='specific-info'>
        <h1 className='city-name' style={ {color: font_color} }>{ data.city.name }</h1>
        <span className='date-text bold'>Date: </span>
        <select id="select-date" onChange={ handleDateSelectChange } style={ {
          borderColor: font_color.replace('rgb', 'rgba').replace(')', ', 0.4)')
        } }>
          {
            getDatesArr(data.list).map((date, index) => (
              <option key={ index } value={ date }>{ date }</option>
            ))
          }
        </select>
        <select id="select-hour" onChange={ handleHourSelectChange } style={ {
          borderColor: font_color.replace('rgb', 'rgba').replace(')', ', 0.4)')
        } }>
          {
            hours_arr.map((hour, index) => (
              <option key={ index } value={ hour }>{ hour }</option>
            ))
          }
        </select>
        <div className='forecast-weather-container'>
          {
            data.list.slice(required_index, required_index + 5).map((ele, i) => forecastWeatherElement(ele.weather[0].icon, ele.dt_txt.split(' ')[1].split(':')[0], i))
          }
        </div>
        <div className='info-main'>
          <div className='tabs-container'>
            <div id='today-tab' className='info-main-tab' style={ {borderBottom: `2px solid ${font_color}`} } onClick={ () => handleTabChange('today') }>TODAY</div>
            <div id='forecast-tab' className='info-main-tab' onClick={ () => handleTabChange('forecast') }>FORECAST</div>
          </div>
          {
            current_info_display ? infoData(current_data.main) : infoData(data.list.filter(ele => ele.dt_txt === date + ' ' + hour)[0].main)
          }
        </div>
      </div>
    </div>
  )
}

export default App;
