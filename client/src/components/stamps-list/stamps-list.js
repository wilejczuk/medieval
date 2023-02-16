import React, { Component }  from 'react';
import SearchStatus from '../search-panel/search-status';
import SearchAddMore from '../search-panel/search-add-more';
import SearchPagination from '../search-panel/search-pagination';

import InternalService from '../../services/internal-api';
import './stamps-list.css';

export default class Stamps extends Component {

  stampsData = new InternalService();

  state = {
    stampsList: null,
    currentPage: 1,
    obv: null,
    rev: null
  };

  requestDetails (side, group, index) {
    switch (group) {
      case "saints":
        this.stampsData.getSaint([index])
          .then((body) => {
            this.setState({[side]: body.data});
          });
        break;
      case "crosses":
        this.stampsData.getCross([index])
          .then((body) => {
            this.setState({[side]: body.data});
          });
        break;
      case "letters":
        this.stampsData.getLetter([index])
          .then((body) => {
            console.log (body.data)
            this.setState({[side]: body.data});
          });
        break;
      default:
    }
  }

  componentDidMount() {
    let searchParams = this.props.match.params;

    if (searchParams["o"]) {
      if (searchParams["od"]!='null') this.requestDetails("obv", searchParams["o"], searchParams["od"]);
      if (searchParams["rd"]!='null') this.requestDetails("rev", searchParams["r"], searchParams["rd"]);
      this.stampsData.getSomeStamps([searchParams["o"],searchParams["od"],
                                    searchParams["r"],searchParams["rd"]])
        .then((body) => {
          this.setState({
            stampsList: body.data
          });
        });
    }
    else {
      console.log ("no params");
      this.stampsData.getStamps()
        .then((body) => {
          this.setState({
            stampsList: body.data
          });
        });
    }
  }

  setCurrentPage(page) {
    this.setState({currentPage: page});
  }

  renderItems(arr) {
    return arr.map(({obverse, reverse, obv, rev, cnt}) => {
      const obvPath = `${this.stampsData._apiBase}/stamps/${obv}.png`;
      const revPath = `${this.stampsData._apiBase}/stamps/${rev}.png`;
      const specimensPath = `${this.stampsData._clientBase}type/${obv}/${rev}`;
      const uniqueKey = `${obv}-${rev}`;
      return (
        <div key={uniqueKey}>
          <div>
            <a href={specimensPath}>
              <img src={obvPath} height="100" alt="Obverse" />
              <img src={revPath} height="100" alt="Reverse" />
            </a>
          </div>
          <div className="top-add">
            <div>{obverse} <br /> {reverse} <div className="quantity"> <b>Экз</b>.: {cnt} в базе</div></div>
          </div>
        </div>
      );
    });
  }

  render() {

    let { obv, rev, stampsList, currentPage } = this.state;
    let searchParams = this.props.match.params;

    if (!stampsList) {
      return (
        <h3>List of stamps is empty.</h3>
      )
    }

    if (obv===null) obv = searchParams["o"];
    if (rev===null) rev = searchParams["r"];

    const selection = [obv, rev, stampsList.length];
    const params = stampsList.length === 0 ? searchParams : stampsList[0].id;

    const addMore = (localStorage.getItem("token") &&
        !Object.values(searchParams).includes('null') && ('o' in searchParams)) ?
            (<SearchAddMore selection={selection} queryData={params} />) : null;

    const noneFound = addMore ?
    (
      <div className="pad-left">
        <SearchStatus selection={selection} />
        <h4>Found no records corresponding to the search criteria. </h4>
        {addMore}
      </div>
    ) :
    (
      <div className="pad-left">
        <SearchStatus selection={selection} />
        <h4>Found no records corresponding to the search criteria. </h4>
        <p>Please try again.</p>
      </div>
    )

    if (stampsList.length === 0) {
      return (
        noneFound
      )
    }

    const pageSize = 6;
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    const pagedList = stampsList.slice(firstPageIndex, lastPageIndex);

    const items = this.renderItems(pagedList);

    return (
      <div className="flex-header">
        <SearchStatus selection={selection} />
        {items}
        <SearchPagination
          className="pagination-bar grid-element"
          currentPage={currentPage}
          totalCount={stampsList.length}
          pageSize={pageSize}
          onPageChange={page => this.setCurrentPage(page)}
        />
        {addMore}
      </div>
    )
  }
}
