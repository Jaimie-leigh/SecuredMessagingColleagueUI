import React from 'react';
import {ReactComponent as HalifaxLogo} from '../images/halifax_logo.svg';
import './Header.css'

export default function Header() {
  
  return (
    <header className="header">
<HalifaxLogo className="header-logo" />
</header>
  );


  }