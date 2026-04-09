import React from 'react';

const topics = [
  {
    title: 'Trocas e devoluções',
    text: 'Esta página mostra como uma loja séria organiza regras claras para passar confiança ao cliente antes da compra.',
  },
  {
    title: 'Entrega e prazos',
    text: 'Informações bem posicionadas reduzem objeções e ajudam a elevar a conversão do checkout.',
  },
  {
    title: 'Privacidade e segurança',
    text: 'Políticas reforçam credibilidade e tornam a experiência da loja mais profissional e completa.',
  },
];

export default function Politicas() {
  return (
    <section className="container page-section">
      <div className="page-header center-header">
        <span className="section-kicker">Políticas</span>
        <h1>Regras claras aumentam a sensação de compra segura.</h1>
      </div>

      <div className="info-grid">
        {topics.map((topic) => (
          <article key={topic.title} className="card-surface">
            <h3>{topic.title}</h3>
            <p>{topic.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
