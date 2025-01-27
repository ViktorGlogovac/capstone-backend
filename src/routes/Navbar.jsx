import React from 'react';
import { Link } from 'react-router-dom';
import "./CSS/Navbar.css";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { IoDocumentText } from "react-icons/io5";

function Navbar() {
  return (
    <div className='navbarContainer'>
      <div className="nameContainer">
        <div className="navbarTitle">SkyWatch</div>
      </div>

      <div className="Projection-Container-Nav">
      <AiOutlineFundProjectionScreen className='projection-icon'/>
        <Link to="/Projections" className='navLink'>Projections</Link>
      </div>
      <div className="Documentation-Container-Nav">
      <IoDocumentText className='projection-icon'/>
        <Link to="/documentation" className="navLink">Documentation</Link>
      </div>
    </div>
  );
}

export default Navbar;
