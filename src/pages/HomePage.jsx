import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopSales } from '../store/slices/catalogSlice';
import Banner from '../components/Banner';
import Catalog from '../components/Catalog';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function HomePage() {
  const dispatch = useDispatch();
  const { topSales, topSalesStatus } = useSelector(state => state.catalog);

  useEffect(() => {
    dispatch(fetchTopSales());
  }, [dispatch]);

  const handleRetryTopSales = () => {
    dispatch(fetchTopSales());
  };

  const hideTopSales = topSalesStatus === 'success' && topSales.length === 0;

  return (
    <>
      <Banner />
      
      {!hideTopSales && (
        <section className="top-sales">
          <h2 className="text-center">Хиты продаж!</h2>
          
          {topSalesStatus === 'loading' && <Loader />}
          
          {topSalesStatus === 'error' && (
            <ErrorMessage onRetry={handleRetryTopSales} />
          )}
          
          {topSalesStatus === 'success' && topSales.length > 0 && (
            <div className="row">
              {topSales.map(item => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      )}
      <Catalog showSearch={false} />
    </>
  );
}