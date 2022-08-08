import { BsCloudDrizzle, BsCloudMoon, BsCloudRain, BsCloudSun } from 'react-icons/bs';
import { IoSnowOutline } from 'react-icons/io5';
import { TbMist } from 'react-icons/tb';
import { TiWeatherNight, TiWeatherSunny } from 'react-icons/ti';
import { WiDayThunderstorm, WiNightAltThunderstorm } from 'react-icons/wi';
import './ForecastWeatherCard.css';

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

function ForecastWeatherCard({icon_key, hour}) {
  if (icon_key === '03d' || icon_key === '04d') icon_key = '02d';
  if (icon_key === '03n' || icon_key === '04n') icon_key = '02n';

  return (
    <div className='forecast-weather-element'>
      { ICONDICTIONARY[icon_key] }
      <span>{ hour }</span>
    </div>
  );
}

export default ForecastWeatherCard;
