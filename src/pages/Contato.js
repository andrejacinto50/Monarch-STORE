import React from 'react';

export default function Contato() {
  return (
    <section className="container page-section">
      <div className="page-header center-header">
        <span className="section-kicker">Contato</span>
        <h1>Atendimento pensado para gerar confiança desde o primeiro contato.</h1>
        <p>
          Nesta página o cliente encontra rapidamente os principais canais para falar com a marca e avançar na compra.
        </p>
      </div>

      <div className="contact-grid">
        <div className="card-surface">
          <h3>WhatsApp</h3>
          <p>Canal ideal para suporte, dúvidas e fechamento rápido.</p>
          <a href="https://wa.me/5548991087702" target="_blank" rel="noreferrer" className="primary-button">
            Falar agora
          </a>
        </div>
        <div className="card-surface">
          <h3>E-mail</h3>
          <p>Para atendimento institucional e solicitações comerciais.</p>
<p className="contact-text">contato@monarchstore.com</p>

<button 
  className="text-button"
  onClick={() => {
    navigator.clipboard.writeText("contato@monarchstore.com");
    alert("Email copiado!");
  }}
>
  Copiar email
</button>
        </div>
        <div className="card-surface">
          <h3>Instagram</h3>
          <p>Canal de relacionamento, lançamentos e reforço da presença da marca.</p>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="secondary-button">
            @monarchstore
          </a>
        </div>
      </div>
    </section>
  );
}
