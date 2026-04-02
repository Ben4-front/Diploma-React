import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);
  const cartCount = cartItems.length;
  
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchText.trim()) {
      setSearchVisible(!searchVisible);
    } else {
      navigate(`/catalog.html?q=${searchText}`);
      setSearchText('');
      setSearchVisible(false);
    }
  };

  return (
    <header className="container">
      <div className="row">
        <div className="col">
          <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <NavLink className="navbar-brand" to="/">
              <img src="/img/header-logo.png" alt="Bosa Noga" />
            </NavLink>
            <div className="collapse navbar-collapse" id="navbarMain">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item"><NavLink className="nav-link" to="/">Главная</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/catalog.html">Каталог</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/about.html">О магазине</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/contacts.html">Контакты</NavLink></li>
              </ul>
              <div>
                <div className="header-controls-pics">
                  <div data-id="search-expander" className="header-controls-pic header-controls-search" onClick={handleSearchSubmit}></div>
                  <div className="header-controls-pic header-controls-cart" onClick={() => navigate('/cart.html')}>
                    {cartCount > 0 && <div className="header-controls-cart-full">{cartCount}</div>}
                    <div className="header-controls-cart-menu"></div>
                  </div>
                </div>
                <form data-id="search-form" className={`header-controls-search-form form-inline ${searchVisible ? '' : 'invisible'}`} onSubmit={handleSearchSubmit}>
                  <input className="form-control" placeholder="Поиск" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </form>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}