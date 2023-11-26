import React, { Component }  from 'react';
import './app-footer.css';

import InternalService from '../../services/internal-api';

export default class AppFooter extends Component {

  stampsData = new InternalService();
  svenssons = `${this.stampsData._clientBase}svenssons.jpeg`;

  render() {
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
                                <li><a href="/about">About the system</a></li>
                                <li><a href="/stats">Database stats</a></li>
                                <li><a href='mailto:creators@kievan-rus.online'>Contact us</a></li>
                            </ul>
                        </div>
                    </div>
                    {/*
                    <div className="col-xl-4 col-lg-4 col-md-6 mb-50">
                        <div className="footer-widget">
                            <div className="footer-widget-heading">
                                <h3>Subscribe</h3>
                            </div>
                            <div className="footer-text mb-25">
                                <p>Don’t miss to subscribe to our new feeds, kindly fill the form below.</p>
                            </div>
                            <div className="subscribe-form">
                                <form action="#">
                                    <input type="text" placeholder="Email Address" />
                                    <button><i className="fab fa-telegram-plane"></i></button>
                                </form>
                            </div>
                        </div>
                    </div>
                    */}
                </div>
            </div>
        </div>
        <div className="copyright-area">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-lg-6 text-center text-lg-left">
                        <div className="copyright-text">
                            <p>Copyright &copy; 2023</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    )
  }
}
