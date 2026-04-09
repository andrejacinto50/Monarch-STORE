import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Layout({ children }) {
  const { itemsCount } = useCart();

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container nav-wrap">
          <Link to="/" className="brand-mark">MONARCH <span>STORE</span></Link>

          <nav className="main-nav">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/loja">Loja</NavLink>
            <NavLink to="/sobre">Sobre</NavLink>
            <NavLink to="/contato">Contato</NavLink>
            <NavLink to="/politicas">Políticas</NavLink>
          </nav>

          <Link to="/carrinho" className="cart-pill">
            Carrinho <span>{itemsCount}</span>
          </Link>
        </div>
      </header>

      <main>{children}</main>

      <a
        className="floating-whatsapp"
        href="https://wa.me/5548991087702"
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp
      </a>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <h4>Monarch Store</h4>
            <p>
              Loja conceito de moda masculina e acessórios criada para impressionar clientes e valorizar marcas no digital.
            </p>
          </div>
          <div>
            <h5>Navegação</h5>
            <ul>
              <li><Link to="/loja">Loja</Link></li>
              <li><Link to="/carrinho">Carrinho</Link></li>
              <li><Link to="/checkout">Checkout</Link></li>
            </ul>
          </div>
          <div>
            <h5>Contato</h5>
            <ul>
              <li><a href="https://wa.me/5548991087702" target="_blank" rel="noreferrer">WhatsApp</a></li>
              <li><a href="mailto:contato@monarchstore.com">contato@monarchstore.com</a></li>
              <li>Atendimento premium de segunda a sábado</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
