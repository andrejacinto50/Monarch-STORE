import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Produto() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find((item) => item.slug === slug);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Único');

  const relatedProducts = useMemo(
    () => products.filter((item) => item.slug !== slug).slice(0, 3),
    [slug]
  );

  if (!product) {
    return (
      <section className="container page-section">
        <div className="empty-state">
          <h1>Produto não encontrado</h1>
          <Link to="/loja" className="primary-button">Voltar para a loja</Link>
        </div>
      </section>
    );
  }

  const handleBuyNow = () => {
    addToCart(product, selectedSize);
    navigate('/checkout');
  };

  return (
    <section className="container page-section">
      <div className="product-page-grid">
        <div className="product-image-panel">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-info-panel">
          <span className="section-kicker">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>

          <div className="price-row large-price">
            <strong>{formatPrice(product.price)}</strong>
            <span>{formatPrice(product.oldPrice)}</span>
          </div>

          <div className="size-selector">
            <p>Tamanho</p>
            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={selectedSize === size ? 'size-button active' : 'size-button'}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="button-row stacked-mobile">
            <button type="button" className="primary-button" onClick={() => addToCart(product, selectedSize)}>
              Adicionar ao carrinho
            </button>
            <button type="button" className="secondary-button" onClick={handleBuyNow}>
              Comprar agora
            </button>
          </div>

          <div className="info-box">
            <h3>Por que esse produto impressiona?</h3>
            <p>
              Porque ele faz a loja parecer uma marca real. Imagem forte, descrição premium e jornada de compra bem pensada.
            </p>
          </div>
        </div>
      </div>

      <div className="section-header split-header top-gap">
        <div>
          <span className="section-kicker">Relacionados</span>
          <h2>Outros produtos que reforçam o desejo de compra.</h2>
        </div>
      </div>
      <div className="products-grid">
        {relatedProducts.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
