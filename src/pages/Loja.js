import React, { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

export default function Loja() {
  const [filter, setFilter] = useState('Todos');

  const filteredProducts = useMemo(() => {
    if (filter === 'Todos') return products;
    return products.filter((product) => product.category === filter);
  }, [filter]);

  return (
    <section className="container page-section">
      <div className="page-header center-header">
        <span className="section-kicker">Loja</span>
        <h1>Um catálogo criado para vender com imagem, organização e desejo.</h1>
        <p>
          Estrutura ideal para apresentar produtos de forma premium e facilitar a jornada de compra.
        </p>
      </div>

      <div className="filter-row">
        {['Todos', 'Roupas', 'Acessórios'].map((item) => (
          <button
            key={item}
            type="button"
            className={filter === item ? 'filter-button active' : 'filter-button'}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
