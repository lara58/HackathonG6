import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './login.css';

const Header = () => {
  const navigate = useNavigate();  

  const handleProfileClick = () => {
    navigate('/profil');  
  };

  return (
    <header>
      <div className='logo-container'>
        <img className='logo' src='../../../public/twitter_logo.png' alt="Logo" />
      </div>
      <div className='icons-list-container'>
        <ul className='icons-list'>
          <li className='search-icon'>
            <img src='../../assets/icons/search.png' alt="Search" />
          </li>
          <li className='notifications-icon'>
            <img src='../../assets/icons/bell.png' alt="Notifications" />
          </li>
          <li className='profile-icon'>
            <img 
              src='../../assets/images/profile_photo.png' 
              alt="Profile" 
              onClick={handleProfileClick} 
            />
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
