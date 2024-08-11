import React from 'react';

const Features = () => {
  return (
    <div className="footer-widget-heading padding-both">
        <h3>New Features</h3>
        <p className="year">
          <h2>May 2024</h2>
          <div className="bukvitsa">
          With the increase in the seal number in the database, the task of facilitating discoverability and minimizing editorial mistakes arose. In May 2024, we introduced the ability to search by <a href='./search/saints/2b,c/crosses/2'>unidentified saints</a> as well as groups of saints and <a href='./search/signs/32e/crosses/null'>princely signs</a>. The new functionality should speed up the search and recognition of mediocre preserved specimens and help identify previously unidentified images.
          <div><img src="https://server.kievan-rus.online/video/search_options.png" width="600px" /></div>
          Moreover, it became possible to find <a href='./search/crosses/4/other/nulla'>all possible image combinations</a> for any particular image that will be useful if only one side of a seal is clearly visible.
          </div>
        </p>
        <p className="year">
          <h2>April 2024</h2>
          <div className="bukvitsa">
          <a href='./paleography'>The palaeography</a> section was created to enhance the possibility of studying ancient Rus' seals from this point of view. All letter combinations met on small seals are listed there.
          </div>
        </p>
      </div>
  );
};

export default Features;