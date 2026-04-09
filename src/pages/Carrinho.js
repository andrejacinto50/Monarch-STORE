import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Carrinho() {
  const navigate = useNavigate();
  const { cartItems, subtotal, shipping, total, updateQuantity, removeFromCart } = useCart();

  if (!cartItems.length) {
    return (
      <section className="container page-section">
        <div className="empty-state">
          <span className="section-kicker">Carrinho</span>
          <h1>Seu carrinho está vazio.</h1>
          <p>Adicione produtos para visualizar uma experiência completa de compra.</p>
          <Link to="/loja" className="primary-button">Ir para a loja</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container page-section">
      <div className="page-header split-header">
        <div>
          <span className="section-kicker">Carrinho</span>
          <h1>Um carrinho elegante reforça confiança e valor percebido.</h1>
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-list">
          {cartItems.map((item) => (
            <article key={`${item.id}-${item.size}`} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-body">
                <div>
                  <span className="product-category">{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>Tamanho: {item.size}</p>
                </div>
                <div className="cart-actions">
                  <div className="quantity-control">
                    <button type="button" onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>+</button>
                  </div>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                  <button type="button" className="text-button" onClick={() => removeFromCart(item.id, item.size)}>
                    Remover
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="summary-card">
          <h3>Resumo do pedido</h3>
          <div className="summary-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
          <div className="summary-row"><span>Frete</span><strong>{formatPrice(shipping)}</strong></div>
          <div className="summary-row total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
          <button type="button" className="primary-button full-button" onClick={() => navigate('/checkout')}>
            Finalizar compra
          </button>
          <Link to="/loja" className="secondary-button full-button">Continuar comprando</Link>
        </aside>
      </div>
    </section>
  );
}
