import React, { Component }  from 'react';
import SearchStatus from '../search-panel/search-status';
import SearchAddMore from '../search-panel/search-add-more';
import SearchPagination from '../search-panel/search-pagination';
import Loading from '../loading';

import InternalService from '../../services/internal-api';
import './stamps-list.css';

export default class Stamps extends Component {

  stampsData = new InternalService();

  state = {
    stampsList: null,
    currentPage: 1,
    obv: null,
    rev: null,
    loading: true
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
            this.setState({[side]: body.data});
          });
        break;
      case "other":
        this.stampsData.getOther([index])
          .then((body) => {
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
      if (searchParams["id"]) {
        this.stampsData.getDukesStamps([searchParams["id"]])
        .then((body) => {
          this.setState({
            stampsList: body.data
          });
        });
      }
      else {
        this.stampsData.getStamps()
          .then((body) => {
            this.setState({
              stampsList: body.data
            });
          });
      }
    }
    this.setState({loading: false});
  }

  setCurrentPage(page) {
    this.setState({currentPage: page});
  }

  renderItems(arr) {
    return arr.map(({obverse, reverse, obv, rev, cnt, obvType, revType, pubNo, idPublication}) => {
      const obvPath = `${this.stampsData._apiBase}/stamps/${obv}.${obvType}`;
      const revPath = `${this.stampsData._apiBase}/stamps/${rev}.${revType}`;
      const specimensPath = `${this.stampsData._clientBase}type/${obv}/${rev}`;
      let janinNo;

      if (pubNo) {
        const indexSearch = pubNo.search(/[^A-Za-z0-9\u0410-\u044F\u0410-\u042F]/);
        const YaninOrGaydukov = idPublication == 10 ? 'Y/G' : 'Yanin';
        janinNo = [2, 10, 46].includes(idPublication) ? indexSearch===-1 ? 
          `${YaninOrGaydukov} #` + pubNo :
          `${YaninOrGaydukov} #` + pubNo.substring(0, indexSearch) : null;
      }

      const typeImages = (janinNo && !localStorage.getItem("token")) ? null :
      (<div>
        <a href={specimensPath}>
          <img src={obvPath} height="100" alt="Obverse" />
          <img src={revPath} height="100" alt="Reverse" />
        </a>
      </div>);

      const janinClass = idPublication == 2 ? 'janin-2 capitalize' : idPublication == 10 ? 'janin-10 capitalize' : 'janin-46 capitalize';

      const uniqueKey = `${obv}-${rev}`;
      return (
        <div key={uniqueKey}>
          {typeImages}
          <div className="top-add">
            <div className={janinClass}> {janinNo} </div>
            <div>{obverse} <br /> {reverse} 
              <div className="quantity"><b>Specimens</b>: <a href={specimensPath}>{cnt}</a> listed</div>
            </div>
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
        <Loading />
      )
    }

    if (obv===null) obv = searchParams["o"];
    if (rev===null) rev = searchParams["r"];

    const selection = [obv, rev, stampsList.length];
    const params = stampsList.length === 0 ? searchParams : stampsList[0].typeId;

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

    const pageSize = 12;
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    const pagedList = stampsList.slice(firstPageIndex, lastPageIndex);

    const items = this.renderItems(pagedList);

    return (
      <div className="flex-header">
        <SearchStatus selection={selection} />
        <div className="list-items">
          {items}
        </div>
        <SearchPagination
          className="pagination-bar grid-element top-30"
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
