import React, { useEffect, useState } from 'react';
import InternalService from '../../../services/internal-api';
import './publications.css';
import axios from 'axios';
import { getCookie } from '../../../helpers/cookie';

const renderRecords = (records, renderRecord) => {
  records = records.map(record => {
    if (!localStorage.getItem("token") && record.count === 0) return null;
    return record;
  }).filter(Boolean);
  // Group records by year
  const groupedByYear = records.reduce((acc, record) => {
    const year = record.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(record);
    return acc;
  }, {});

  // Render the grouped records
  return Object.entries(groupedByYear).map(([year, yearRecords]) => year!=3000?
  (
    <div key={year} className="year">
      <h2>{year}</h2>
      {renderYearRecords(yearRecords, renderRecord)}
    </div>
  ):null);
};

const renderYearRecords = (yearRecords, renderRecord) => {
  // Group records by journal and number if journal is not null
  const groupedByJournalAndNumber = yearRecords.reduce((acc, record) => {
    const { journal, number, place } = record;
    if (journal !== null) {
      const key = `${journal}_${place}_${number}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(record);
    } else {
      // If journal is null, group by an empty string to keep these records together
      const key = '';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(record);
    }
    return acc;
  }, {});

  // Render the grouped records
  return Object.entries(groupedByJournalAndNumber).map(([key, group], index) => (
    <div key={index}>
      {key.split('_')[0] !== '' && (
        <div className="journal">
          {key.split('_')[0]}.
          {key.split('_')[2]!='null' && ` Volume ${key.split('_')[2]}.`} {key.split('_')[1]}
        </div>
      )}
      {group.map((record, subIndex) => (
        <div key={subIndex}>
          {renderRecord(record)}
        </div>
      ))}
    </div>
  ));  
};

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function handleRadioChange() {
  let selectedValue = document.querySelector('input[name="publications-list"]:checked').value;
  setCookie('selectedPublication', selectedValue.substring(6), 365); 
}

const Publications = () => {
  const stampsData = new InternalService();
  const [publicationsAdvanced, setPublicationsAdvanced] = useState(null);
  const [english, setEnglish] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await stampsData.getPublicationsAdvanced();
        setPublicationsAdvanced(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const checkLanguageCookie = () => {
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
      }, {});
      if (!cookies.language) {
        axios.get('https://ipapi.co/json/')
          .then((response) => {
            if (!['Russia', 'Belarus', 'Ukraine', 'Bulgaria'].includes(response.data.country_name) && !stampsData.token) {
              let date = new Date();
              date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
              document.cookie = `language=en; expires=${date.toUTCString()}; path=/`;
              applyTranslation('en');
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      else if (getCookie('language') === 'en') setEnglish(true);
    };
  
    checkLanguageCookie();
  }, [stampsData.token]);

  const applyTranslation = (language) => {
    const interval = setInterval(() => {
      const googleTranslateElement = document.querySelector('.goog-te-combo');
      if (googleTranslateElement) {
        googleTranslateElement.value = language;
        googleTranslateElement.dispatchEvent(new Event('change'));
        clearInterval(interval);
      }
    }, 1000); 
  };

  useEffect(() => {
    if (publicationsAdvanced) {
      const selectedPublicationValue = getCookie('selectedPublication');
      const radioElement = document.querySelector(`input[value="option${selectedPublicationValue}"]`);
      if (radioElement) {
        radioElement.checked = true;
      }
    }
  }, [publicationsAdvanced]);

  if (!publicationsAdvanced) {
    return (
      <h3>List is empty.</h3>
    )
  }

  const renderRecord = (record) => {
    const { id, name, name_en, number, journal, place, count } = record;
    const volume = number ? `Volume ${number}.` : null;
    const optionKey = `option${id}`;
    const url = `./publication/${id}`;
    const englishName = (english && !name.includes(name_en)) ? ` ${name_en} /` : ``;
    const link = count>0 ? (<span><a href={url} target='_blank'><i>{englishName}</i> {name}</a></span>): name;
    
    return (
      <div>
        {journal !== null ? (
            <div className="journals_article"> 
              <span>{localStorage.getItem("token") && (<input type="radio" name="publications-list" value={optionKey} onChange={handleRadioChange} />)} {link}</span>  
              <span className="count_specimens">{count}</span>
            </div>
              ) : (
            <div className="separate_book">
              <span>{localStorage.getItem("token") && (<input type="radio" name="publications-list" value={optionKey} onChange={handleRadioChange} />)} {link} {volume} {place}</span>  
              <span className="count_specimens">{count}</span>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="footer-widget-heading padding-both">
            <h3>Bibliography</h3>

      <div className='bukvitsa'>
          Publications below ({publicationsAdvanced.length} of them) are considered in the database so far.
          We have a plan to populate the database further in the future.
         If you want to suggest seals from publications that are not present here, please <a href='mailto:creators@kievan-rus.online'>contact us via email</a>.  
      </div>
      <br />
      
      {localStorage.getItem("token") && (<div><input type="radio" name="publications-list" value="option0" onChange={handleRadioChange} /> Автоматически не заполнять</div>)}
      <br />
      {renderRecords(publicationsAdvanced, renderRecord)}
    </div>
  );
};

export default Publications;