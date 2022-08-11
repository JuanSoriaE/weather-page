import { useEffect, useRef, useState } from 'react';
import './App.css';
import ForecastWeatherCard from './components/ForecastWeatherCard';
import Infomation from './components/Information';
import ModalLoading from './components/ModalLoading';

const APIKEY = import.meta.env.VITE_APIKEY;
const url = (city = 'californ') => `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}`;
const url_current = (city = 'californ') => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`;

const BGDICTIONARY = {
  // DAY
  '01d': 'linear-gradient(0deg, rgba(189,213,223,1) 0%, rgba(161,205,255,1) 25%, rgba(89,155,255,1) 100%)',
  '02d': 'linear-gradient(0deg, rgba(232,232,232,1) 0%, rgba(168,168,203,1) 35%, rgba(152,178,212,1) 100%)',
  '09d': 'linear-gradient(0deg, rgba(167,167,167,1) 0%, rgba(117,117,156,1) 35%, rgba(75,96,128,1) 100%)',
  '10d': 'linear-gradient(0deg, rgba(167,167,167,1) 0%, rgba(117,117,156,1) 35%, rgba(75,96,128,1) 100%)',
  '11d': 'linear-gradient(0deg, rgba(42,71,84,1) 0%, rgba(0,40,83,1) 25%, rgba(0,28,69,1) 100%)',
  '13d': 'linear-gradient(0deg, rgba(201,201,201,1) 0%, rgba(186,186,224,1) 35%, rgba(191,207,235,1) 100%)',
  '50d': 'rgb(203,203,203)',
  // NIGHT
  '01n': 'linear-gradient(0deg, rgba(46,85,116,1) 0%, rgba(14,50,92,1) 35%, rgba(13,45,96,1) 100%)',
  '02n': 'linear-gradient(0deg, rgba(90,94,106,1) 0%, rgba(43,60,80,1) 35%, rgba(25,41,65,1) 100%)',
  '09n': 'linear-gradient(0deg, rgba(90,94,106,1) 0%, rgba(43,60,80,1) 35%, rgba(25,41,65,1) 100%)',
  '10n': 'linear-gradient(0deg, rgba(90,94,106,1) 0%, rgba(43,60,80,1) 35%, rgba(25,41,65,1) 100%)',
  '11n': 'linear-gradient(0deg, rgba(59,62,70,1) 0%, rgba(37,52,70,1) 35%, rgba(18,33,55,1) 100%)',
  '13n': 'linear-gradient(0deg, rgba(90,94,106,1) 0%, rgba(43,60,80,1) 35%, rgba(25,41,65,1) 100%)',
  '50n': 'rgb(50,50,50)'
};
const FONTCOLORDICTIONARY = {
  // DAY
  '01d': 'rgb(123, 163, 209)',
  '02d': 'rgb(149, 148, 181)',
  '09d': 'rgb(103, 103, 138)',
  '10d': 'rgb(103, 103, 138)',
  '11d': 'rgb(1, 30, 61)',
  '13d': 'rgb(140, 140, 156)',
  '50d': 'rgb(203,203,203)',
  // NIGHT
  '01n': 'rgb(39, 73, 99)',
  '02n': 'rgb(90,94,106)',
  '09n': 'rgb(90,94,106)',
  '10n': 'rgb(90,94,106)',
  '11n': 'rgb(21, 29, 51)',
  '13n': 'rgb(54, 54, 61)',
  '50n': 'rgb(50,50,50)'
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
  
  const main_info_ref = useRef(null);

  const getHumanDate = (unix_time, timezone_dif = 0) => {
    let DATESDICTIONARY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    let date_obj = new Date((unix_time + timezone_dif) * 1000);

    let year = date_obj.getFullYear();
    let month = (date_obj.getUTCMonth() + 1).toString().padStart(2, 0);
    let day = date_obj.getUTCDate().toString().padStart(2, 0);
    let day_of_week = DATESDICTIONARY[date_obj.getUTCDay()];
    
    let hours = date_obj.getUTCHours().toString().padStart(2, 0);
    let minutes = date_obj.getUTCMinutes().toString().padStart(2, 0);

    return `${day_of_week}, ${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const cleanRain = () => {
    var child = main_info_ref.current.lastElementChild;

    while (child.nodeName === 'I') {
      main_info_ref.current.removeChild(child);
      child = main_info_ref.current.lastElementChild;
    }
  };

  const rain = (num_of_drops = 30, duration = 1, min_duration = 0.4, snow = false) => {
    if (main_info_ref.current) {
      cleanRain();
      // Create drops
      let index = 0;
      while (index < num_of_drops) {
        let drop = document.createElement('i');
        drop.classList.add('drop');
        snow && drop.classList.add('snow');
        let x = innerWidth * Math.random();
        let time = duration * Math.random();

        drop.style.animationDuration = time <= min_duration ? time + min_duration + 's' : time + 's';
        drop.style.animationDelay = time + 's';
        drop.style.left = x +  'px';

        main_info_ref.current.appendChild(drop);

        index++;
      }
    }
  };

  const handleSuccessFetch = (data, city) => {
    // Set state
    setData(data);
    setStatus('ok');
    setLastCity(city);
    
    setDate(getHumanDate(data.list[0].dt, data.city.timezone).split(' ')[1]);
    setHour(getHumanDate(data.list[0].dt, data.city.timezone).split(' ')[2]);

    // Set initial hours arr
    setHoursArr(
      Array.from(new Set(
        data.list.map(ele => getHumanDate(ele.dt, data.city.timezone))
        .filter(date_ele => date_ele.includes(date)) // Get dates and hours of certain date
        .map(ele => ele.split(' ')[2])
      ))
    );

    console.log(hours_arr);
  };

  const handleSuccessFetchCurrentData = (data) => {
    // Set current data
    setCurrentData(data);

    var key = data.weather[0].icon;

    // Set drizzle, rain, thunderstorm or snow
    cleanRain();
    if (key === '09d' || key === '09n') rain(10); // Drizzle
    if (key === '10d' || key === '10n') rain(); // Rain
    if (key === '11d' || key === '11n') rain(50, 0.8); // ThunderStorm
    if (key === '13d' || key === '13n') rain(20, 2, 1.5, true); // Snow

    // Set styles
    if (key === '03d' || key === '04d') key = '02d';
    if (key === '03n' || key === '04n') key = '02n';

    // Set style
    const background = BGDICTIONARY[key];
    setBackground(background);
    const font_color = FONTCOLORDICTIONARY[key];
    setFontColor(font_color);
  };

  const fetchCurrentData = city => {
    setStatus('loading');
    fetch(url_current(city))
      .then(res => res.json())
      .then(data => {
        if (data.cod != 200) return setStatus('no res');
        handleSuccessFetchCurrentData(data, city);
      })
      .catch(err => {});
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
      });
  };

  const changeForecastData = (date, hour) => {
    let complete_date = date + ' ' + hour;
    if (complete_date.length < 17) complete_date += ':00';

    for (let i = 0; i < data.list.length; i++) {
      if ((getHumanDate(data.list[i].dt, data.city.timezone).split(' ').slice(1).join(' ') + ':00') == complete_date) {
        return setRequiredIndex(i);
      }
    }
  };

  const handleInputChange = e => {
    e.preventDefault();

    if(!e.target.value) return;

    fetchCurrentData(e.target.value || last_city);
    fetchData(e.target.value || last_city);
  };

  const getDatesArr = arr => {
    return Array.from(new Set(arr.map(ele => getHumanDate(ele.dt, data.city.timezone).split(' ')[1])));
  };

  const handleDateSelectChange = e => {
    setDate(e.target.value);
    
    // Set hours arr to display options
    setHoursArr(
      data.list.map(ele => getHumanDate(ele.dt, data.city.timezone).split(' ').slice(1).join(' '))
        .filter(date_ele => date_ele.includes(e.target.value)) // Get dates and hours of certain date
        .map(ele => ele.split(' ')[1]) // Get only hours
    );

    setHour(hours_arr[0] + ':00');
    // Change forecast data
    changeForecastData(e.target.value, hour);
  };

  const handleHourSelectChange = e => {
    setHour(e.target.value + ':00');

    // Change forecast data
    changeForecastData(date, (e.target.value + ':00'));
  };

  const handleTabChange = tab => {
    let today_tab = document.getElementById('today-tab');
    let forecast_tab = document.getElementById('forecast-tab');

    if (tab === 'today' && !current_info_display) {
      setCurrentInfoDisplay(true);

      forecast_tab.style.border = 'none';
      today_tab.style.borderBottom = `2px solid ${font_color}`;
    } else if (tab === 'forecast' && current_info_display) {
      setCurrentInfoDisplay(false);

      today_tab.style.borderBottom = 'none';
      forecast_tab.style.borderBottom = `2px solid ${font_color}`;
    }
  };

  useEffect(() => {
    fetchCurrentData();
    fetchData();
  }, []);

  return (data.city && current_data.weather) && (
    <div className='App'>
      {
        // Loading Spinner
        status === 'loading' && <ModalLoading />
      }
      <div id='main-info' ref={ main_info_ref } style={ {background: background} }>
        <div className='input-container'>
          <input type='text' className='city-input' id='city-name' placeholder='City Name' onChange={ handleInputChange } autoComplete='off' />
        </div>
        <div id='weather-date-container'>
          <span id='weather-date'>{ getHumanDate(current_data.dt, current_data.timezone) }</span>
          <span>Local time</span>
        </div>
        <span id='weather-status'>{ current_data.weather[0].description }</span>
        <span id='weather-deg'>{ Math.round(current_data.main.temp - 273.15) }</span>
      </div>
      <div className='info-waves-container'>
        <svg className='waves' id='waves' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#fefeff" fillOpacity="1" d="M0,64L40,64C80,64,160,64,240,90.7C320,117,400,171,480,181.3C560,192,640,160,720,154.7C800,149,880,171,960,181.3C1040,192,1120,192,1200,186.7C1280,181,1360,171,1400,165.3L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path></svg>
        <div className='specific-info'>
          <h1 className='city-name' style={ {color: font_color} }>{ data.city.name }</h1>
          <span className='date-text bold'>Date: </span>
          <select id="select-date" 
            onChange={ handleDateSelectChange } 
            style={ {borderColor: font_color.replace('rgb', 'rgba').replace(')', ', 0.4)')} }>
            {
              getDatesArr(data.list).map((date, index) => (
                <option key={ index } value={ date }>{ date }</option>
              ))
            }
          </select>
          <select id="select-hour" 
            onChange={ handleHourSelectChange } 
            style={ {borderColor: font_color.replace('rgb', 'rgba').replace(')', ', 0.4)')} }>
            {
              hours_arr.map((hour, index) => (
                <option key={ index } value={ hour }>{ hour }</option>
              ))
            }
          </select>
          <div className='forecast-weather-container'>
            {
              data.list.slice(required_index, required_index + 5).map((ele, idx) => 
                <ForecastWeatherCard key={ idx } 
                  icon_key={ ele.weather[0].icon } 
                  hour={ getHumanDate(ele.dt, data.city.timezone).split(' ')[2].split(':')[0] } />
              )
            }
          </div>
          <div className='info-main'>
            <div className='tabs-container'>
              <div id='today-tab' className='info-main-tab' 
                style={ {borderBottom: `2px solid ${font_color}`} } 
                onClick={ () => handleTabChange('today') }>TODAY</div>
              <div id='forecast-tab' className='info-main-tab' 
                onClick={ () => handleTabChange('forecast') }>FORECAST</div>
            </div>
            <div className='info-data-container'>
              {
                current_info_display ? <Infomation data={ current_data.main } /> : <Infomation data={ data.list[required_index].main } />
              }
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
