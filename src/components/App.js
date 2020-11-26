import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./LogIn";
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
        <Route path="/login" component={Login}></Route>
        <Route path="/" exact component={Login}></Route>
      </Switch>
    </Router>
    <Footer />
    </Fragment>
  );
}