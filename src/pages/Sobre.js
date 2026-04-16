import React from 'react';
import aboutBrand from '../assets/destacar.png';

export default function Sobre() {
  return (
    <section className="container page-section">
      <div className="page-header center-header">
        <span className="section-kicker">Sobre a marca</span>
        <h1>Uma loja conceito feita para mostrar como presença visual influencia vendas.</h1>
        <p>
          A Monarch Store nasceu como um projeto premium de moda masculina e acessórios para transmitir valor,
          credibilidade e desejo em todos os detalhes.
        </p>
      </div>

      <div className="about-layout">
        <img src={aboutBrand} alt="Sobre a Monarch Store" className="about-image" />
        <div className="about-copy card-surface">
          <h2>Marca, posicionamento e experiência</h2>
          <p>
            Mais do que vender produtos, a proposta da Monarch Store é construir uma experiência visual que faça o cliente
            enxergar a marca como algo forte, moderno e memorável.
          </p>
          <p>
            É o tipo de estrutura ideal para empresários que querem uma loja online com aparência profissional,
            jornada de compra organizada e valor percebido mais alto.
          </p>
        </div>
      </div>
    </section>
  );
}
