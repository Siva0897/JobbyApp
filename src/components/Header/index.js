import {Link, withRouter} from 'react-router-dom'
import {FcHome, FcBriefcase} from 'react-icons/fc'
import {FiLogOut} from 'react-icons/fi'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-large-container">
          <Link to="/">
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
          <ul className="nav-menu">
            <li className="nav-menu-item">
              <Link to="/" className="header-nav-link">
                Home
              </Link>
            </li>

            <li className="nav-menu-item">
              <Link to="/jobs" className="header-nav-link">
                Jobs
              </Link>
            </li>
          </ul>
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="nav-menu-mobile">
        <ul className="nav-menu-list-mobile">
          <li className="nav-menu-item-mobile">
            <Link to="/" className="nav-link">
              <img
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
                className="nav-bar-mobile-logo"
              />
            </Link>
          </li>
          <div className="nav-menu-mobile-item-container">
            <li className="nav-menu-item-mobile">
              <Link to="/" className="nav-link">
                <FcHome className="react-icons" />
              </Link>
            </li>
            <li className="nav-menu-item-mobile">
              <Link to="/jobs" className="nav-link">
                <FcBriefcase className="react-icons" />
              </Link>
            </li>
            <li className="nav-menu-item-mobile" onClick={onClickLogout}>
              <FiLogOut className="react-icons" />
            </li>
          </div>
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Header)
