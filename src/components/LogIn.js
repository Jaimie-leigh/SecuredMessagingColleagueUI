import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import "./Login.css";

export default function LogIn() {
  const history = useHistory();
  const [value, setValue] = useState("");
  const regexp = /^[0-9\b]+$/;
  // const [error, setError] = useState(null);
  // const [isLoaded, setIsLoaded] = useState(false);
  // const [brokers, setBrokers] = useState([]);
  
  function handleChange(e) {
    setValue(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();   
    if (!regexp.test(value)) {
      alert("Username should not contain letters, please re-enter");

      return;
    }

    return history.replace("/BrokerWelcome", value);
  }

  return (
    <div className="Login">
        <form onSubmit={handleSubmit}>
        <h1>Secured Messenging</h1>
          <label>
            Username:
            <input
              type="text"
              name="BrokerId"
              value={value}
              onChange={handleChange}
              required
              maxLength="7"
              minLength="7"
              // isValid={checkNameIsValid}
            />
          </label>
          <button>Log In</button>
        </form>
    </div>
  );
}
