// Inital screen displayed on load on the Broker Interface

// Options to improve:
// check pop up so be warning as text entered (like the length text does)
// on submit check username is in DB if not say username is not valid.

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Login.css";

export default function LogIn() {
  const history = useHistory();
  const [value, setValue] = useState("");
  const regexp = /^[0-9]{0,7}$/;
  const [isValid, setIsValid] = useState("");
  
  //sets value from username entered by broker
  // sets isValid to true or false if username is in expected format
  function handleChange(e) {
    setValue(e.target.value);
    if (!regexp.test(value)) {
      //alert("Username should not contain letters, please re-enter");
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }

  // on click of 'Log in' button checks username is in correct format
  // routes to broker landing page if correct 
  function handleSubmit(e) {
    e.preventDefault();
    if(!isValid)
    {
      return
    }
    return history.replace("/BrokerWelcome", value);
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
            name="BrokerId"
            value={value}
            onChange={handleChange}
            required
            maxLength="7"
            minLength="7"
          />
        </label>
        {isValid === false && (
          <div className="helpText">
            <p>Username should consist of 7 characters including only digitis, please re-enter your username</p>
          </div>
        )}
        <button>Log In</button>
      </form>
    </div>
  );
}
