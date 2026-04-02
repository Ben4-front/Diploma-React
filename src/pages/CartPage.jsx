import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner';
import Loader from '../components/Loader';

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalSum = cartItems.reduce((sum, item) => sum + (item.price * item.count), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const orderData = { owner: { phone, address }, items: cartItems.map(item => ({ id: item.id, price: item.price, count: item.count })) };

    try {
      const res = await fetch('http://localhost:7070/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) { setOrderSuccess(true); dispatch(clearCart()); }
    } catch (err) { alert('Ошибка при оформлении заказа'); } 
    finally { setLoading(false); }
  };

  if (orderSuccess) return <><Banner /><section className="cart"><h2 className="text-center">Заказ успешно оформлен!</h2></section></>;

  return (
    <>
      <Banner />
      <section className="cart">
        <h2 className="text-center">Корзина</h2>
        <table className="table table-bordered">
          <thead>
            <tr><th scope="col">#</th><th scope="col">Название</th><th scope="col">Размер</th><th scope="col">Кол-во</th><th scope="col">Стоимость</th><th scope="col">Итого</th><th scope="col">Действия</th></tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={`${item.id}-${item.size}`}>
                <td>{index + 1}</td>
                <td><Link to={`/catalog/${item.id}.html`}>{item.title}</Link></td>
                <td>{item.size}</td><td>{item.count}</td><td>{item.price} руб.</td><td>{item.price * item.count} руб.</td>
                <td><button className="btn btn-outline-danger btn-sm" onClick={() => dispatch(removeFromCart({ id: item.id, size: item.size }))}>Удалить</button></td>
              </tr>
            ))}
            <tr><td colSpan="5" className="text-right">Общая стоимость</td><td>{totalSum} руб.</td></tr>
          </tbody>
        </table>
      </section>
      {cartItems.length > 0 && (
        <section className="order">
          <h2 className="text-center">Оформить заказ</h2>
          <div className="card" style={{ maxWidth: '30rem', margin: '0 auto' }}>
            <form className="card-body" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Телефон</label>
                <input type="text" className="form-control" placeholder="Ваш телефон" required value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Адрес доставки</label>
                <input type="text" className="form-control" placeholder="Адрес доставки" required value={address} onChange={e => setAddress(e.target.value)} />
              </div>
              <div className="form-group form-check">
                <input type="checkbox" className="form-check-input" id="agreement" required checked={agreement} onChange={e => setAgreement(e.target.checked)} />
                <label className="form-check-label" htmlFor="agreement">Согласен с правилами доставки</label>
              </div>
              <button type="submit" className="btn btn-outline-secondary" disabled={loading || !agreement}>Оформить</button>
              {loading && <Loader />}
            </form>
          </div>
        </section>
      )}
    </>
  );
}