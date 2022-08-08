import './Information.css';

const INFOKEYDICTIONARY = {
  temp: 'Temperature',
  temp_min: 'Min Temperature',
  temp_max: 'Max Temperature',
  feels_like: 'Feels like',
  humidity: 'Humidity',
  pressure: 'Pressure',
  sea_level: 'Sea level pressure',
  grnd_level: 'Ground level pressure'
};

function Infomation({data}) {
  if (!data) return (
    <span>No data available.</span>
  );

  if (data.temp_kf) delete data.temp_kf;

  const getUnitsClass = (info_data_key) => {
    if (info_data_key.includes('temp') || info_data_key === 'feels_like') return ' degs';
    if (info_data_key.includes('level') || info_data_key === 'pressure') return ' pressure';
    if (info_data_key === 'humidity') return ' humidity';
    return '';
  };
  
  const informationRow = (info_data, key) => (
    <div className='info-data-row' key={ key }>
      <div className='info-data-key'>
        { INFOKEYDICTIONARY[info_data[0]] }
      </div>
      <div className={ 'info-data-value' + getUnitsClass(info_data[0]) }>
        {
          (info_data[0].includes('temp') || info_data[0] === 'feels_like') ? Math.round(info_data[1] - 273.15) : info_data[1]
        }
      </div>
    </div>
  );

  return (
    <>
      {
        Object.entries(data).map((info_data, idx) => (
          informationRow(info_data, idx)
        ))
      }
    </>
  );
}

export default Infomation;
