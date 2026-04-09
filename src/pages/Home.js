import React from 'react';
import { Link } from 'react-router-dom';

import ProductCard from '../components/ProductCard';
import { benefits, products } from '../data/products';
import heroFashion from '../assets/hero-fashion.jpg';
import heroSecondary from '../assets/hero-secondary.jpg';
import categoryRoupas from '../assets/category-roupas.jpg';
import categoryAcessorios from '../assets/category-acessorios.jpg';

const featuredProducts = products.slice(0, 4);

export default function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="section-kicker">Moda masculina premium</span>
            <h1>Estilo que define presença em cada detalhe.</h1>
            <p>
              A Monarch Store foi criada para mostrar como uma loja online pode transmitir valor,
              desejo e confiança logo no primeiro acesso.
            </p>
            <div className="hero-actions">
              <Link to="/loja" className="primary-button">Comprar agora</Link>
              <Link to="/sobre" className="secondary-button">Conhecer a marca</Link>
            </div>
            <ul className="benefits-list">
              {benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>
          <div className="hero-media">
            <img src={heroFashion} alt="Moda masculina premium Monarch Store" />
          </div>
        </div>
      </section>

     <section className="container showcase-grid section-space">
  <div className="showcase-card wide-card showcase-flex">
    <div className="showcase-text">
      <span className="section-kicker">Editorial</span>
      <h2>Uma experiência visual construída para vender mais.</h2>
      <p>
        Layout premium, identidade forte e fluxo pensado para fazer o cliente se apaixonar pela ideia.
      </p>
    </div>

    <div className="showcase-image">
      <img src={heroSecondary} alt="Coleção contemporânea Monarch Store" />
    </div>
  </div>
</section>

      <section className="container section-space">
        <div className="section-header">
          <span className="section-kicker">Categorias</span>
          <h2>Escolha o estilo que mais combina com a proposta da marca.</h2>
        </div>

        <div className="category-grid">
          <article className="category-card">
            <img src={categoryRoupas} alt="Roupas masculinas" />
            <div className="category-content">
              <h3>Roupas</h3>
              <p>Peças pensadas para homens que valorizam presença, conforto e sofisticação.</p>
            </div>
          </article>

          <article className="category-card">
            <img src={categoryAcessorios} alt="Acessórios masculinos" />
            <div className="category-content">
              <h3>Acessórios</h3>
              <p>Relógios, bolsas e detalhes que elevam o valor percebido de qualquer composição.</p>
            </div>
          </article>
        </div>
      </section>

     <section className="container section-space">
  <div className="products-header">
    <div className="products-header-text">
<span className="products-kicker">Produtos</span>
      <h2>Produtos com cara de marca forte e desejo de compra.</h2>
    </div>
    <Link to="/loja" className="secondary-button">Ver catálogo completo</Link>
  </div>

  <div className="products-grid">
    {featuredProducts.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
</section>

      <section className="container trust-strip section-space">
        <div className="trust-card">
          <strong>Entrega expressa</strong>
          <span>Estrutura pronta para destacar frete e logística.</span>
        </div>
        <div className="trust-card">
          <strong>Compra segura</strong>
          <span>Checkout elegante para aumentar a confiança do cliente.</span>
        </div>
        <div className="trust-card">
          <strong>Atendimento premium</strong>
          <span>Conexão com WhatsApp e suporte para elevar conversão.</span>
        </div>
      </section>
    </>
  );
}