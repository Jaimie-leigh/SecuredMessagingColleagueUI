import React from "react";
import { ReactComponent as LBGLogo } from "../images/LBGLogo.svg";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <LBGLogo className="header-logo" />
    </header>
  );
}
