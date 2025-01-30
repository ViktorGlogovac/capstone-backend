import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./CSS/Navbar.css";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { IoDocumentText } from "react-icons/io5";

function Navbar() {
  const location = useLocation(); // Get the current route

  return (
    <div className='navbarContainer'>
      <div className="nameContainer">
        <div className="navbarTitle">SkyWatch</div>
      </div>

      {/* Projections Tab - Active for both /projections and /company/:companyName */}
      <div className={`Projection-Container-Nav ${location.pathname.startsWith("/projections") || location.pathname.startsWith("/company/") ? "active-tab" : ""}`}>
        <AiOutlineFundProjectionScreen className='projection-icon'/>
        <Link to="/projections" className='navLink'>Projections</Link>
      </div>

      {/* Documentation Tab */}
      <div className={`Documentation-Container-Nav ${location.pathname === "/documentation" ? "active-tab" : ""}`}>
        <IoDocumentText className='projection-icon'/>
        <Link to="/documentation" className="navLink">Documentation</Link>
      </div>
    </div>
  );
}

export default Navbar;
