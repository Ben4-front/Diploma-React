import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import Banner from '../components/Banner';
import Loader from '../components/Loader';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:7070/api/items/${id}`)
      .then(res => res.json())
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <><Banner /><Loader /></>;
  if (!product) return <><Banner /><p className="text-center">Товар не найден</p></>;

  const availableSizes = product.sizes.filter(s => s.available);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    dispatch(addToCart({ id: product.id, title: product.title, price: product.price, size: selectedSize, count: quantity }));
    navigate('/cart.html');
  };

  return (
    <>
      <Banner />
      <section className="catalog-item">
        <h2 className="text-center">{product.title}</h2>
        <div className="row">
          <div className="col-5">
            <img src={product.images[0]} className="img-fluid" alt={product.title} />
          </div>
          <div className="col-7">
            <table className="table table-bordered">
              <tbody>
                <tr><td>Артикул</td><td>{product.sku}</td></tr>
                <tr><td>Производитель</td><td>{product.manufacturer}</td></tr>
                <tr><td>Цвет</td><td>{product.color}</td></tr>
                <tr><td>Материал</td><td>{product.material}</td></tr>
                <tr><td>Сезон</td><td>{product.season}</td></tr>
                <tr><td>Повод</td><td>{product.reason}</td></tr>
              </tbody>
            </table>
            {availableSizes.length > 0 && (
              <div className="text-center">
                <p>Размеры в наличии: 
                  {availableSizes.map(s => (
                    <span key={s.size} className={`catalog-item-size ${selectedSize === s.size ? 'selected' : ''}`} onClick={() => setSelectedSize(s.size)}>{s.size}</span>
                  ))}
                </p>
                <p>Количество: 
                  <span className="btn-group btn-group-sm pl-2">
                    <button className="btn btn-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <span className="btn btn-outline-primary">{quantity}</span>
                    <button className="btn btn-secondary" onClick={() => setQuantity(Math.min(10, quantity + 1))}>+</button>
                  </span>
                </p>
                <button className="btn btn-danger btn-block btn-lg" disabled={!selectedSize} onClick={handleAddToCart}>В корзину</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}