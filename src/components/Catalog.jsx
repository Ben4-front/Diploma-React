import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchCategories, fetchItems, setActiveCategory, setOffset } from '../store/slices/catalogSlice';
import ProductCard from './ProductCard';
import Loader from './Loader';

export default function Catalog({ showSearch = false }) {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [localSearch, setLocalSearch] = useState(queryParam);
  
  const { categories, items, itemsStatus, activeCategory, offset, hasMore } = useSelector(state => state.catalog);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  useEffect(() => {
    dispatch(fetchItems({ categoryId: activeCategory, offset: 0, q: queryParam }));
    setLocalSearch(queryParam);
  }, [dispatch, activeCategory, queryParam]);

  const handleCategoryClick = (e, id) => {
    e.preventDefault();
    dispatch(setActiveCategory(id));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: localSearch });
  };

  const handleLoadMore = () => {
    const newOffset = offset + 6;
    dispatch(setOffset(newOffset));
    dispatch(fetchItems({ categoryId: activeCategory, offset: newOffset, q: queryParam }));
  };

  return (
    <section className="catalog">
      <h2 className="text-center">Каталог</h2>
      
      {showSearch && (
        <form className="catalog-search-form form-inline" onSubmit={handleSearchSubmit}>
          <input className="form-control" placeholder="Поиск" value={localSearch} onChange={e => setLocalSearch(e.target.value)} />
        </form>
      )}

      <ul className="catalog-categories nav justify-content-center">
        <li className="nav-item">
          <a className={`nav-link ${activeCategory === null ? 'active' : ''}`} href="#" onClick={(e) => handleCategoryClick(e, null)}>Все</a>
        </li>
        {categories.map(cat => (
          <li className="nav-item" key={cat.id}>
            <a className={`nav-link ${activeCategory === cat.id ? 'active' : ''}`} href="#" onClick={(e) => handleCategoryClick(e, cat.id)}>{cat.title}</a>
          </li>
        ))}
      </ul>

      {items.length === 0 && itemsStatus === 'success' && <p>Ничего не найдено</p>}

      <div className="row">
        {items.map(item => <ProductCard key={item.id} item={item} />)}
      </div>

      {itemsStatus === 'loading' && <Loader />}
      {itemsStatus === 'error' && <p>Ошибка загрузки каталога</p>}
      
      {itemsStatus !== 'loading' && hasMore && items.length >= 6 && (
        <div className="text-center">
          <button className="btn btn-outline-primary" onClick={handleLoadMore}>Загрузить ещё</button>
        </div>
      )}
    </section>
  );
}