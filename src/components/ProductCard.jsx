import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ item }) {
  return (
    <div className="col-4">
      <div className="card catalog-item-card" style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <div style={{ 
          height: '250px', 
          overflow: 'hidden', 
          flexShrink: 0 
        }}>
          <img 
            src={item.images[0]} 
            className="card-img-top" 
            alt={item.title} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              objectPosition: 'center'
            }} 
          />
        </div>

        <div className="card-body" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1 
        }}>
          <p className="card-text" style={{ 
            flex: 1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {item.title}
          </p>
          <p className="card-text">
            <strong>{item.price} руб.</strong>
          </p>
          <Link 
            to={`/catalog/${item.id}.html`} 
            className="btn btn-outline-primary mt-auto"
          >
            Заказать
          </Link>
        </div>
      </div>
    </div>
  );
}