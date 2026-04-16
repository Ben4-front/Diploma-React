import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchItems, setActiveCategory } from '../store/slices/catalogSlice';
import Banner from '../components/Banner';
import Catalog from '../components/Catalog';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function CatalogPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [localSearch, setLocalSearch] = useState(queryParam);
  const [searchStatus, setSearchStatus] = useState('idle');

  const { activeCategory } = useSelector((state) => state.catalog);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setSearchStatus('loading');

    try {
      await dispatch(
        fetchItems({ categoryId: activeCategory, offset: 0, q: localSearch })
      ).unwrap();
      setSearchParams(localSearch ? { q: localSearch } : {});
      setSearchStatus('success');
    } catch (e) {
      setSearchStatus('error');
    }
  };

  const handleRetrySearch = async () => {
    setSearchStatus('loading');
    try {
      await dispatch(
        fetchItems({ categoryId: activeCategory, offset: 0, q: localSearch })
      ).unwrap();
      setSearchStatus('success');
    } catch (e) {
      setSearchStatus('error');
    }
  };

  return (
    <>
      <Banner />
      <section className="catalog-search">
        <form
          className="catalog-search-form form-inline justify-content-center"
          onSubmit={handleSearchSubmit}
        >
          <input
            className="form-control mr-2"
            placeholder="Поиск"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              if (searchStatus === 'error') setSearchStatus('idle');
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={searchStatus === 'loading'}
          >
            {searchStatus === 'loading' ? 'Поиск...' : 'Найти'}
          </button>
        </form>
        {searchStatus === 'loading' && (
          <div className="text-center mt-2">
            <Loader />
            <p className="text-muted">Загружаем результаты...</p>
          </div>
        )}
        {searchStatus === 'error' && (
          <div className="mt-2">
            <ErrorMessage onRetry={handleRetrySearch} />
          </div>
        )}
      </section>
      <Catalog showSearch={false} />
    </>
  );
}