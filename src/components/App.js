import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LogIn from "./LogIn";
import ColleagueWelcome from "./ColleagueWelcome";
import Header from "./Header";
import Footer from "./Footer";

export default function App() {
  return (
    <Fragment>
    <Header/>
    <Router>
      <Switch>
        <Route path="/ColleagueWelcome" component={ColleagueWelcome}></Route>
        <Route path="/LogIn" component={LogIn}></Route>
        <Route path="/" exact component={LogIn}></Route>
      </Switch>
    </Router>
    <Footer />
    </Fragment>
  );
}