// Inital screen displayed on load on the Colleague Interface

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Login.css";

export default function LogIn() {
  const history = useHistory();
  const [value, setValue] = useState("");
  const regexp = /^[0-9]{0,7}$/;
  const [isValid, setIsValid] = useState("");
  
  //sets value from username entered by user
  // sets isValid to true or false if username is in expected format using regular expression 
  function handleChange(e) {
    setValue(e.target.value);
    if (!regexp.test(value)) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }

  // on click of 'Log in' button checks username is in correct format
  // routes to colleague landing page if correct 
  function handleSubmit(e) {
    e.preventDefault();
    if(!isValid)
    {
      return
    }
    return history.replace("/ColleagueWelcome", value);
  }

  // renders on the page
  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <h1>Secured Messenging</h1>
        <label>
          Username:
          <input
            type="tel"
            name="ColleagueId"
            value={value}
            onChange={handleChange}
            required
            maxLength="6"
            minLength="6"
          />
        </label>
        {isValid === false && (
          <div className="helpText">
            <p>Username should consist of 6 characters including only digits, please re-enter your username</p>
          </div>
        )}
        <button>Log In</button>
      </form>
    </div>
  );
}
