import React from "react";
import { Link } from "react-router-dom";
import "./BrokerWelcome.css";
import "./loading.css";
import { ReactComponent as HomeIcon } from "../images/home-black.svg";
import FadeLoader from "react-spinners/FadeLoader";

class BrokerWelcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false,
      brokerID: props.location.state,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.setState({ brokerID: this.props.location.state });
    const serachByBrokerId = this.props.location.state;
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url =
      "http://securedmessaging.azurewebsites.net/api/broker/" +
      serachByBrokerId;
    fetch(proxyurl + url)
      .then((res) => res.json())
      .then((data) => this.setState({ data: data, isLoading: false }));
  }

  routeChange(){
    window.location.href="/"
  }

  render() {
    const { data, isLoading } = this.state;
    if (isLoading) {
      return (
        <div className="pageLoading">
          <p>Loading...</p>
          <FadeLoader size={150} color={"#005EB8"} loading={isLoading} />
        </div>
      );
    }
    if (data.length === 0) {
      return <p>no data found</p>;
    }
    return (
      <div className="brokerWelcome">
        <div className="brokerDetails">
          <p className="brokerID">
            <strong>
              Welcome {data.brokerForename} {data.brokerSurname}
            </strong>
          </p>
          <p className="appName">
            <strong>Secured Messaging</strong>
          </p>
          <button className="brokerSignOut" onClick={() => this.routeChange()}>
            Sign Out
          </button>
        </div>
        <div className="brokerInfoBox">
          <p>
            <strong>Applications</strong>{" "}
          </p>
          <p>
            Click on the roll number to send and view messages relating to the
            application
          </p>
        </div>
        <div className="brokerApps">
          {data?.application?.map((app, index) => (
            <ul className="applicationBox" key={app.toString() + index}>
              <li className="appLink">
                <HomeIcon className="applicationBoxHeaderIcon" />
                <Link
                  to={{
                    pathname: "/ApplicationMessages",
                    state: {
                      rollNumber: app.rollNumber,
                      brokerID: this.state.brokerID,
                    },
                  }}
                >
                  Roll number: {app.rollNumber}
                </Link>
              </li>
              <li> Customer name: {app.customerFullName}</li>
            </ul>
          ))}
        </div>
      </div>
    );
  }
}

export default BrokerWelcome;
