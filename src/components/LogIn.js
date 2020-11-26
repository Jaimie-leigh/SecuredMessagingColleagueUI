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

  // function checkNameIsValid(name){
  //   const result = brokers.filter(broker => broker === name)
  //   console.log("valid check:", result);
  // }

  // // Note: the empty deps array [] means
  // // this useEffect will run once
  // // similar to componentDidMount()
  // useEffect(() => {
  //   //this.setState({ isLoading: true });
  //       const proxyurl = "https://cors-anywhere.herokuapp.com/";
  //       const url = "http://securedmessaging.azurewebsites.net/api/broker";
  //       fetch(proxyurl + url) 
  //     .then(res => res.json())
  //     .then(
  //       (result) => {
  //         setIsLoaded(true);
  //         setBrokers(result);
  //       },
  //       // Note: it's important to handle errors here
  //       // instead of a catch() block so that we don't swallow
  //       // exceptions from actual bugs in components.
  //       (error) => {
  //         setIsLoaded(true);
  //         setError(error);
  //       }
  //     )
  // }, [])

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // } else if (!isLoaded) {
  //   return <div>Loading...</div>;
  // } else {
  //   return (
  //     <ul>
  //       {items.map(item => (
  //         <li key={item.id}>
  //           {item.name} {item.price}
  //         </li>
  //       ))}
  //     </ul>
  //   );
  // }


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
