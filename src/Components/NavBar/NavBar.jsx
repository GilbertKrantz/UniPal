import React from 'react'
import './NavBar.css'
import UniPal from '../../Assets/Logo/UniPal.png';

const NavBar = () => {
  return (
    <>
        <header>
        <div class="logo">
            <img src={UniPal} alt=""/>
        </div>
        <nav>
            <ul>
                <li><a href="">FAQs</a></li>
                <li><button id="nav_sign-in-btn" class="sign-in-btn"><a href="">Sign In</a></button></li>
            </ul>
        </nav>
    </header>
    </>
  )
}

export default NavBar