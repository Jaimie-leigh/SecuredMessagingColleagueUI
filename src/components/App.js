import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LogIn from "./LogIn";
import BrokerWelcome from "./BrokerWelcome";
import ApplicationMessages from "./ApplicationMessages";
import Header from "./Header";
import Footer from "./Footer";

export default function App() {
  return (
    <Fragment>
    <Header/>
    <Router>
      <Switch>
        <Route path="/ApplicationMessages" component={ApplicationMessages} ></Route>
        <Route path="/BrokerWelcome" component={BrokerWelcome}></Route>
        <Route path="/LogIn" component={LogIn}></Route>
        <Route path="/" exact component={LogIn}></Route>
      </Switch>
    </Router>
    <Footer />
    </Fragment>
  );
}