import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <Link to={`/produto/${product.slug}`} className="product-thumb-wrap">
        <img src={product.image} alt={product.name} className="product-thumb" />
        <span className="product-badge">{product.badge}</span>
      </Link>

      <div className="product-content">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div className="price-row">
          <strong>{formatPrice(product.price)}</strong>
          <span>{formatPrice(product.oldPrice)}</span>
        </div>

        <div className="button-row">
          <Link to={`/produto/${product.slug}`} className="secondary-button">Ver produto</Link>
          <button type="button" className="primary-button" onClick={() => addToCart(product, product.sizes[0])}>
            Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}
