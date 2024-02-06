import React, { useState, useRef, useEffect } from 'react';
import InternalService from '../../services/internal-api';
import './about.css';

const About = () => {
  const [videoPath, setVideoPath] = useState("https://server.kievan-rus.online/video/welcome.mp4");
  const [key, setKey] = useState(0);
  const [showGradient, setShowGradient] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const [specimens, setSpecimens] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const data = new InternalService();

  useEffect(() => {
    data.getSpecimenNumbers()
    .then((body) => {
      setSpecimens(body.data);
      setSelectedId(body.data[0].id);
    });
  }, []);

  const toggleZIndex = () => {
    setVideoPath("https://server.kievan-rus.online/video/welcome_video.mp4");
    setShowGradient(false);
    setShowButton(false); 
    setIsMuted(false); 
    setKey(prevKey => prevKey + 1); 
  }

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = videoRef.current.duration - 5; 
      videoRef.current.pause(); 
    }
  };

  const handleNumberSearch = (e) => {
    e.preventDefault();
    const selected = specimens.find(specimen => specimen.id == selectedId);
    if (selected) {
      const { idObv, idRev } = selected;
      window.location.href = `/type/${idObv}/${idRev}/${selectedId}`;
    }
  };

  const handlePaste = (e) => {
    const pastedValue = e.clipboardData.getData('text');
    console.log(pastedValue)
    const matchingSpecimen = specimens.find(specimen => specimen.id == pastedValue);
    if (matchingSpecimen) {
      setSelectedId(pastedValue);
    }
  };

  return (
    <div className='fifty-fifty'>
    <div>
      <div className='padding-left bukvitsa indent'>
  
        The basic functionality of the system includes: <br/>
        <div className='indent'>1. A search by the name of issuers - princes, their wives, boyars and clergy. Each attribution is substantiated in some scientific publication. The system allows you to move along the family tree of princes, as well as look separately at representatives of certain dynastic branches e.g. <a href='./5'>Younger Monomashichi</a> or <a href='./1'>"Rogvolod's grandchildren"</a>. Likewise, you can review only the issuing <a href='./7'>Metropolitans</a>.<br/>
        </div> 
        <div className='indent'>2. Seals can be <a href='./search'>filtered</a> by main iconographic types - images of patron saints, inscriptions and individual letters, princely signs, crosses of various types, and others. It is possible to specify both strict search criteria and search by groups of images, e.g. <a href='./search/saints/7/letters/null'>the image of the Apostle Peter on one side and any letters or inscriptions on another</a>. No matter what side you consider the obverse - the system will find matches in <a href='./search/letters/null/saints/7'>both directions</a>. Numbers according to the classical catalogue of Valentin Yanin are given directly in the list of the search results.
        </div> 
        <div className='indent'>3. <a href='./type/189/190'>Inside the type</a>, one can find images of all specimens added to the database with indications of their publications, as well as a map of the finds. Functions of adding new specimens and attributions are available to <b>authorized</b> users. Want to get editorial access - individual or institutional? <a href='mailto:creators@kievan-rus.online'>Request from us</a>.
        </div> 
        <div className='indent'>4. The <a href='./stats'>global topography</a> of seals is presented on a separate page. Here you can view finds by settlement both as a list and directly on the map.<br/>
        </div> 
        <div className='indent' style={{ display: 'flex' }}>
          <span style={{ marginRight: '20px' }}>5. When scholar is working on a publication, it is important to cite the number in the source. We use 5-digit reference numbers of specimens. You can easily navigate to the desired instance by its number:</span>
          <form onSubmit={handleNumberSearch}>
            <select 
              className="search_specimens"
              value={selectedId} 
              onChange={(e) => setSelectedId(e.target.value)}>
              {specimens.map(specimen => (
                <option key={specimen.id} value={specimen.id}>{specimen.id}</option>
              ))}
            </select>
            <button type="submit" className="toggle-button">Go</button>
          </form>
        </div> 
      </div>
    </div>

    <div className="video-container">
      {showGradient && <div className='gradient-overlay'></div>}

      <video
        key={key}
        autoPlay
        muted={isMuted}
        loop={isMuted}
        playsInline
        className="autoplay-video"
        style={{ zIndex: 2 }}
        onEnded={handleVideoEnded} 
        ref={videoRef}
      >
        <source
          src={videoPath}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {showButton && (
          <button className="toggle-button top_left" onClick={toggleZIndex}>
            <span>See demo</span>
          </button>
        )}
        <div className='padding-both indent'><br /><br />The creation of a client-server application using modern technologies was made possible thanks to funding from the <a href='https://svensvenssonsstiftelse.se/'>Sven Svensson Foundation</a>. 
        </div> 
    </div>

  </div>
  );
}; 

export default About;
