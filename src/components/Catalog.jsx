import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  fetchCategories,
  fetchItems,
  setActiveCategory,
  setOffset,
} from '../store/slices/catalogSlice';
import ProductCard from './ProductCard';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

export default function Catalog({ showSearch = false }) {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [localSearch, setLocalSearch] = useState(queryParam);

  const [loadMoreStatus, setLoadMoreStatus] = useState('idle');

  const {
    categories,
    items,
    itemsStatus,
    activeCategory,
    offset,
    hasMore,
  } = useSelector((state) => state.catalog);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchItems({ categoryId: activeCategory, offset: 0, q: queryParam }));
    setLocalSearch(queryParam);
    setLoadMoreStatus('idle');
  }, [dispatch, activeCategory, queryParam]);

  const handleCategoryClick = (e, id) => {
    e.preventDefault();
    dispatch(setActiveCategory(id));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(localSearch ? { q: localSearch } : {});
  };

  const handleLoadMore = async () => {
    const newOffset = offset + 6;
    dispatch(setOffset(newOffset));
    setLoadMoreStatus('loading');

    try {
      await dispatch(
        fetchItems({ categoryId: activeCategory, offset: newOffset, q: queryParam })
      ).unwrap();
      setLoadMoreStatus('idle');
    } catch (e) {
      setLoadMoreStatus('error');
    }
  };

  const handleRetryLoadMore = async () => {
    setLoadMoreStatus('loading');
    try {
      await dispatch(
        fetchItems({ categoryId: activeCategory, offset, q: queryParam })
      ).unwrap();
      setLoadMoreStatus('idle');
    } catch (e) {
      setLoadMoreStatus('error');
    }
  };

  const isInitialLoading = itemsStatus === 'loading' && offset === 0;
  const isInitialError = itemsStatus === 'error' && offset === 0;

  return (
    <section className="catalog">
      <h2 className="text-center">Каталог</h2>

      {showSearch && (
        <form
          className="catalog-search-form form-inline"
          onSubmit={handleSearchSubmit}
        >
          <input
            className="form-control"
            placeholder="Поиск"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary ml-2">
            Найти
          </button>
        </form>
      )}

      <ul className="catalog-categories nav justify-content-center">
        <li className="nav-item">
          <a
            className={`nav-link ${activeCategory === null ? 'active' : ''}`}
            href="#"
            onClick={(e) => handleCategoryClick(e, null)}
          >
            Все
          </a>
        </li>
        {categories.map((cat) => (
          <li className="nav-item" key={cat.id}>
            <a
              className={`nav-link ${activeCategory === cat.id ? 'active' : ''}`}
              href="#"
              onClick={(e) => handleCategoryClick(e, cat.id)}
            >
              {cat.title}
            </a>
          </li>
        ))}
      </ul>

      {isInitialLoading && <Loader />}

      {isInitialError && (
        <ErrorMessage
          onRetry={() =>
            dispatch(fetchItems({ categoryId: activeCategory, offset: 0, q: queryParam }))
          }
        />
      )}

      {itemsStatus === 'success' && items.length === 0 && (
        <p className="text-center">По вашему запросу ничего не найдено</p>
      )}

      {/* Список товаров */}
      <div className="row">
        {items.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>

      <div className="text-center" style={{ marginTop: '20px' }}>
        {loadMoreStatus === 'loading' && <Loader />}
        {loadMoreStatus === 'error' && (
          <ErrorMessage onRetry={handleRetryLoadMore} />
        )}

        {loadMoreStatus !== 'loading' &&
          loadMoreStatus !== 'error' &&
          hasMore &&
          items.length >= 6 &&
          itemsStatus !== 'error' && (
            <button
              className="btn btn-outline-primary"
              onClick={handleLoadMore}
            >
              Загрузить ещё
            </button>
          )}
      </div>
    </section>
  );
}