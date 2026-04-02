import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopSales } from '../store/slices/catalogSlice';
import Banner from '../components/Banner';
import Catalog from '../components/Catalog';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function HomePage() {
  const dispatch = useDispatch();
  const { topSales, topSalesStatus } = useSelector(state => state.catalog);

  useEffect(() => { dispatch(fetchTopSales()); }, [dispatch]);

  return (
    <>
      <Banner />
      {topSalesStatus !== 'error' && topSales.length > 0 && (
        <section className="top-sales">
          <h2 className="text-center">Хиты продаж!</h2>
          {topSalesStatus === 'loading' && <Loader />}
          <div className="row">
            {topSales.map(item => <ProductCard key={item.id} item={item} />)}
          </div>
        </section>
      )}
      <Catalog showSearch={false} />
    </>
  );
}