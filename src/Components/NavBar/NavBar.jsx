import React from 'react'
import './NavBar.css'
import UniPal from '../../Assets/Logo/UniPal.png'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <>
      <header>
        <div class='logo'>
          <img src={UniPal} alt='' />
        </div>
        <nav>
          <ul>
            <li>
              <button id='nav_sign-in-btn' class='sign-in-btn'>
                <Link to='/signin'>Masuk</Link>
              </button>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}

export default NavBar
