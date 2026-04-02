import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ item }) {
  return (
    <div className="col-4">
      <div className="card catalog-item-card">
        <img src={item.images[0]} className="card-img-top img-fluid" alt={item.title} style={{ height: '250px', objectFit: 'cover' }} />
        <div className="card-body">
          <p className="card-text">{item.title}</p>
          <p className="card-text">{item.price} руб.</p>
          <Link to={`/catalog/${item.id}.html`} className="btn btn-outline-primary">Заказать</Link>
        </div>
      </div>
    </div>
  );
}