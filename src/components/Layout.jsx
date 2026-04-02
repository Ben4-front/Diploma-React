import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="container">
        <div className="row">
          <div className="col">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}