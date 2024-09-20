import React from 'react';

const Features = () => {
  return (
    <div className="footer-widget-heading padding-both">
        <h3>New Features</h3>
        <p className="year">
          <h2>July 2024</h2>
          <div className="bukvitsa">
          Russian, Belarusian, and Ukrainian descriptions of the princes (<a href='./person/42'>example</a>), seal obverses and reverses (<a href='./type/100016188/100016189'>example</a>), and <a href='./publications'>publication names</a> are translated into English. 
          </div>   
        </p>
        <p className="year">
          <h2>June 2024</h2>
          <div className="bukvitsa">
          The new <a href='./genealogy'>Genealogy</a> section is now available. In this section, you can view the Rurikid dynasty tree from any prince, extending four generations down if the prince's heirs are known. 
          To expand the tree down from any prince, click the down arrow under their node. To go up a level and view the tree from the prince’s father, click the up arrow under the topmost node.
          </div>
          <br />

          <div>The left menu allows for quick navigation to the root tree of the Rurikids and to the three main branches: the Ragnvald's grandchildren, the Monomashichi, and the Olgovichi.
          </div>
          <br />

          <div>On a prince's card, you can quickly access a page with a description of the prince's seals. The number of seal types attributed to the prince is indicated in brackets. Below this, you will find the prince's baptismal name and year of death. The princely signs found on the prince's seals are shown next; clicking on each sign will display all the seals with that sign (even those not attributed to the prince). 
          </div>
          <br />
          <div>The next line indicates the saints found on the prince's seals, excluding the prince's own holy patron. If the saint's image is associated with the prince's father, it is marked with an "F" tag; otherwise, it is marked with "!". This information provides insight into the validity of existing attributions and offers additional analysis opportunities for researchers.
          </div>    
        </p>
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
          The <a href='./paleography'>Palaeography</a> section was created to enhance the possibility of studying ancient Rus' seals from this point of view. All letter combinations met on small seals are listed there.
          </div>
        </p>
      </div>
  );
};

export default Features;