import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Loja from './pages/Loja';
import Produto from './pages/Produto';
import Carrinho from './pages/Carrinho';
import Checkout from './pages/Checkout';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';
import Politicas from './pages/Politicas';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loja" element={<Loja />} />
        <Route path="/produto/:slug" element={<Produto />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/politicas" element={<Politicas />} />
      </Routes>
    </Layout>
  );
}
