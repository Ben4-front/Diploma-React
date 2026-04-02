import React from 'react';
import Banner from '../components/Banner';
import Catalog from '../components/Catalog';

export default function CatalogPage() {
  return (
    <>
      <Banner />
      <Catalog showSearch={true} />
    </>
  );
}