import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function formatPrice(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatZip(zip) {
  const numbers = zip.replace(/\D/g, '').slice(0, 8);
  if (numbers.length <= 5) return numbers;
  return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
}

function cleanZip(zip) {
  return zip.replace(/\D/g, '');
}

function getDeliveryEstimate(zip) {
  const clean = cleanZip(zip);

  if (clean.length !== 8) return null;

  if (clean.startsWith('88')) {
    return {
      label: 'Entrega estimada',
      time: '2 a 4 dias úteis',
      service: 'Entrega padrão',
    };
  }

  if (clean.startsWith('89')) {
    return {
      label: 'Entrega estimada',
      time: '3 a 5 dias úteis',
      service: 'Entrega padrão',
    };
  }

  if (clean.startsWith('90')) {
    return {
      label: 'Entrega estimada',
      time: '4 a 6 dias úteis',
      service: 'Entrega padrão',
    };
  }

  return {
    label: 'Entrega estimada',
    time: '5 a 8 dias úteis',
    service: 'Entrega padrão',
  };
}

export default function Carrinho() {
  const navigate = useNavigate();

  const {
    cartItems,
    subtotal,
    shipping,
    total,
    zip,
    setZip,
    calculateShipping,
    clearShipping,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState('');
  const [shippingSuccess, setShippingSuccess] = useState('');

  const itemsCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const hasCalculatedShipping = cleanZip(zip).length === 8 && shipping > 0;
  const deliveryEstimate = hasCalculatedShipping ? getDeliveryEstimate(zip) : null;

  const freeShippingGoal = 600;
  const remainingForFreeShipping = Math.max(freeShippingGoal - subtotal, 0);
  const progressPercent = Math.min((subtotal / freeShippingGoal) * 100, 100);

  useEffect(() => {
    if (!cartItems.length) {
      clearShipping();
      setZip('');
      setShippingError('');
      setShippingSuccess('');
    }
  }, [cartItems.length, clearShipping, setZip]);

  function handleCepChange(e) {
    const formattedZip = formatZip(e.target.value);
    setZip(formattedZip);
    setShippingError('');
    setShippingSuccess('');

    if (cleanZip(formattedZip).length !== 8) {
      clearShipping();
    }
  }

  async function handleCalculateShipping() {
    const clean = cleanZip(zip);

    if (clean.length !== 8) {
      setShippingError('Digite um CEP válido com 8 números.');
      setShippingSuccess('');
      clearShipping();
      return;
    }

    setShippingLoading(true);
    setShippingError('');
    setShippingSuccess('');

    try {
      calculateShipping(zip, subtotal);
      setShippingSuccess('Frete calculado com sucesso.');
    } catch (error) {
      setShippingError('Não foi possível calcular o frete.');
      setShippingSuccess('');
      clearShipping();
    } finally {
      setShippingLoading(false);
    }
  }

  function handleGoToCheckout() {
    if (!hasCalculatedShipping) {
      setShippingError('Calcule o frete antes de continuar para o checkout.');
      return;
    }

    navigate('/checkout');
  }

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
          <div className="cart-benefits">
            <div className="cart-benefits-head">
              <strong>Resumo da experiência</strong>
              <span>{itemsCount} {itemsCount === 1 ? 'item' : 'itens'} no carrinho</span>
            </div>

            <div className="cart-progress">
              <div
                className="cart-progress-bar"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="cart-benefits-text">
              {remainingForFreeShipping > 0
                ? `Faltam ${formatPrice(remainingForFreeShipping)} para liberar frete grátis em pedidos acima de ${formatPrice(freeShippingGoal)}.`
                : `Parabéns! Seu pedido atingiu a faixa promocional de frete grátis.`}
            </p>
          </div>

          {cartItems.map((item) => (
            <article key={`${item.id}-${item.size}`} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />

              <div className="cart-item-body">
                <div className="cart-item-info">
                  <span className="product-category">{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>Tamanho: {item.size}</p>
                </div>

                <div className="cart-actions">
                  <div className="quantity-control">
                    <button
                      type="button"
                      aria-label={`Diminuir quantidade de ${item.name}`}
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      aria-label={`Aumentar quantidade de ${item.name}`}
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <strong>{formatPrice(item.price * item.quantity)}</strong>

                  <button
                    type="button"
                    className="text-button"
                    onClick={() => removeFromCart(item.id, item.size)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="summary-card premium-summary-card">
          <div className="summary-head">
            <h3>Resumo do pedido</h3>
            <span>{itemsCount} {itemsCount === 1 ? 'item' : 'itens'}</span>
          </div>

          <div className="shipping-box premium-shipping-box">
            <label htmlFor="cep">Calcular entrega</label>

            <div className="shipping-form">
              <input
                id="cep"
                type="text"
                placeholder="Digite seu CEP"
                value={zip}
                onChange={handleCepChange}
                maxLength={9}
              />

              <button type="button" onClick={handleCalculateShipping}>
                {shippingLoading ? 'Calculando...' : 'Calcular'}
              </button>
            </div>

            <div className="shipping-helper-row">
              <a
                href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                target="_blank"
                rel="noreferrer"
                className="text-button inline-link"
              >
                Não sei meu CEP
              </a>
            </div>

            {shippingError && <p className="shipping-error">{shippingError}</p>}
            {!shippingError && shippingSuccess && (
              <p className="shipping-success">{shippingSuccess}</p>
            )}

            {hasCalculatedShipping && deliveryEstimate && (
              <div className="shipping-result-card">
                <div className="shipping-result-top">
                  <strong>{deliveryEstimate.service}</strong>
                  <strong>{formatPrice(shipping)}</strong>
                </div>

                <div className="shipping-result-meta">
                  <span>CEP confirmado: {zip}</span>
                  <span>{deliveryEstimate.label}: {deliveryEstimate.time}</span>
                </div>
              </div>
            )}
          </div>

          <div className="summary-products-mini">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="summary-product">
                <span>
                  {item.name} <small>x {item.quantity}</small>
                </span>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <div className="summary-row">
            <span>Frete</span>
            <strong>
              {hasCalculatedShipping ? formatPrice(shipping) : 'A calcular'}
            </strong>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <div className="trust-list">
            <div className="trust-item">🔒 Compra segura</div>
            <div className="trust-item">💳 Pagamento protegido</div>
            <div className="trust-item">📦 Entrega com acompanhamento</div>
          </div>

          <button
            type="button"
            className="primary-button full-button"
            onClick={handleGoToCheckout}
            disabled={!hasCalculatedShipping || shippingLoading}
          >
            {hasCalculatedShipping ? 'Finalizar compra' : 'Calcule o frete para continuar'}
          </button>

          <Link to="/loja" className="secondary-button full-button">
            Continuar comprando
          </Link>
        </aside>
      </div>
    </section>
  );
}