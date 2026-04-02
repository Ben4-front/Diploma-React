import React from 'react';
import Banner from '../components/Banner';

export default function AboutPage() {
  return (
    <>
      <Banner />
      <section className="top-sales">
        <h2 className="text-center">О магазине</h2>
        <p>В каталоге нашего магазина вы найдете отличную обувь для любых целей.</p>
        <p>С 2009 года мы предоставляем нашим клиентам широкий ассортимент качественной обуви по доступным ценам.</p>
      </section>
    </>
  );
}