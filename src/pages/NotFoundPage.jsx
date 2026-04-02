import React from 'react';
import Banner from '../components/Banner';

export default function NotFoundPage() {
  return (
    <>
      <Banner />
      <section className="top-sales">
        <h2 className="text-center">Страница не найдена</h2>
        <p className="text-center">Извините, такая страница не найдена!</p>
      </section>
    </>
  );
}