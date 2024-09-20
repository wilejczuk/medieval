import React, { Component }  from 'react';
import CountUp from 'react-countup';
import './app-footer.css';

import InternalService from '../../services/internal-api';

export default class AppFooter extends Component {

  stampsData = new InternalService();
  svenssons = `${this.stampsData._clientBase}svenssons.jpeg`;

  state = {
    specimensCount: 0,
    recordsman: null
  };

  componentDidMount() {
    this.stampsData.getSpecimensCount()
      .then((body) => {
        this.setState({
            specimensCount: body.data["count(1)"],
        });
      });

    this.stampsData.getAttributionsCount()
      .then((body) => {
        this.setState({
            recordsman: body.data,
        });
      });  
  }

  render() {

    const {specimensCount, recordsman } = this.state;
    if ((!specimensCount) || (!recordsman)) {
        return (
          <h3>Loading.</h3>
        )
      }

    const recordsmanLink = `/person/${recordsman['id']}`;

    return (
    <footer className="footer-section">
        <div className="container">
            <div className="footer-content pt-5 pb-5">
                <div className="row">
                    <div className="col-xl-4 col-lg-4 mb-50">
                        <div className="footer-widget">
                            <div className="footer-logo">
                                <a href="/"><img src={this.svenssons} className="img-fluid" alt="logo" /></a>
                            </div>
                            <div className="footer-text">
                                <p>We are running the service with the support of Svensson's foundation.</p>
                            </div>
                            <div className="footer-social-icon">

                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
                        <div className="footer-widget">
                            <div className="footer-widget-heading">
                                <h3>Useful Links</h3>
                            </div>
                            <ul>
                                <li><a href="/">Home</a></li>
                                <li><a href="/genealogy">Genealogy</a></li>
                                <li><a href="/about">About the system</a></li>
                                <li><a href="/stats">Geography</a></li>
                                <li><a href="/features">New features</a></li>
                                <li><a href="/paleography">Paleography</a></li>
                                <li><a href='mailto:creators@kievan-rus.online'>Contact us</a></li>
                                <li><a href="/publications">Bibliography</a></li>                                
                                
                            </ul>
                        </div>
                    </div>
                    {
                    <div className="col-xl-4 col-lg-4 col-md-6 mb-50 centered">
                        Seals in the database
                        <br />
                    <CountUp
                        className="numbers"
                        start={3500}
                        end={specimensCount}
                        duration={8}
                        useEasing={true}
                        useGrouping={true}
                        separator=" "
                        decimals={0}
                    />
                    <br /><br />
                        The largest number of attributed types <br /> 
                        <a href={recordsmanLink}>{recordsman['name_en']}</a>
                        <br />
                    <CountUp
                        className="numbers"
                        start={0}
                        end={recordsman['cnt']}
                        duration={8}
                        useEasing={true}
                        useGrouping={true}
                        separator=" "
                        decimals={0}
                    />
                    </div>}
                </div>
            </div>
        </div>
        <div className="copyright-area">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-lg-6 text-center text-lg-left">
                        <div className="copyright-text">
                            <p>Copyright &copy; 2023-2024</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    )
  }
}
