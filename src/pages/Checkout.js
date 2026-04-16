import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import checkoutBanner from '../assets/checkout.png';

function formatPrice(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanZip(zip) {
  return zip.replace(/\D/g, '');
}

function formatZip(zip) {
  const numbers = zip.replace(/\D/g, '').slice(0, 8);
  if (numbers.length <= 5) return numbers;
  return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
}

function getDeliveryEstimate(zip) {
  const clean = cleanZip(zip);

  if (clean.length !== 8) return null;

  if (clean.startsWith('88')) {
    return {
      service: 'Entrega padrão',
      time: '2 a 4 dias úteis',
      note: 'Região atendida com prazo reduzido.',
    };
  }

  if (clean.startsWith('89')) {
    return {
      service: 'Entrega padrão',
      time: '3 a 5 dias úteis',
      note: 'Prazo estimado para entrega com rastreamento.',
    };
  }

  if (clean.startsWith('90')) {
    return {
      service: 'Entrega padrão',
      time: '4 a 6 dias úteis',
      note: 'Envio com acompanhamento do pedido.',
    };
  }

  return {
    service: 'Entrega padrão',
    time: '5 a 8 dias úteis',
    note: 'Prazo médio para capitais e outras regiões.',
  };
}

export default function Checkout() {
  const {
    cartItems,
    subtotal,
    shipping,
    total,
    zip,
    setZip,
    calculateShipping,
    clearShipping,
  } = useCart();

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: zip || '',
  });

  const [errors, setErrors] = useState({});
  const [zipLoading, setZipLoading] = useState(false);
  const [zipSuccess, setZipSuccess] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const itemsCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const hasCalculatedShipping = cleanZip(form.zip).length === 8 && shipping > 0;
  const deliveryEstimate = hasCalculatedShipping ? getDeliveryEstimate(form.zip) : null;

  const fetchAddressByZip = useCallback(
    async (zipValue) => {
      const clean = cleanZip(zipValue);

      if (clean.length !== 8) {
        setErrors((prev) => ({
          ...prev,
          zip: 'Informe um CEP válido com 8 números.',
        }));
        setZipSuccess('');
        clearShipping();
        return;
      }

      try {
        setZipLoading(true);
        setZipSuccess('');

        const response = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        const data = await response.json();

        if (data.erro) {
          setErrors((prev) => ({
            ...prev,
            zip: 'CEP não encontrado.',
          }));
          setZipSuccess('');
          clearShipping();
          return;
        }

        const formattedZip = formatZip(clean);

        setZip(formattedZip);
        calculateShipping(formattedZip, subtotal);

        setForm((prev) => ({
          ...prev,
          zip: formattedZip,
          city: data.localidade || '',
          state: data.uf || '',
          address: data.logradouro ? data.logradouro : prev.address,
        }));

        setErrors((prev) => ({
          ...prev,
          zip: '',
          city: '',
          state: '',
          address: '',
        }));

        setZipSuccess('Entrega validada com sucesso.');
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          zip: 'Erro ao buscar o CEP.',
        }));
        setZipSuccess('');
        clearShipping();
      } finally {
        setZipLoading(false);
      }
    },
    [calculateShipping, clearShipping, setZip, subtotal]
  );

  useEffect(() => {
    if (!zip) return;

    setForm((prev) => ({
      ...prev,
      zip,
    }));

    if (cleanZip(zip).length === 8) {
      fetchAddressByZip(zip);
    }
  }, [zip, fetchAddressByZip]);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    let newValue = value;

    if (name === 'zip') {
      newValue = formatZip(value);
      setZip(newValue);
      setZipSuccess('');

      if (cleanZip(newValue).length !== 8) {
        clearShipping();
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Informe seu nome completo.';
    } else if (form.name.trim().length < 5) {
      newErrors.name = 'O nome precisa ter pelo menos 5 caracteres.';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Informe seu e-mail.';
    } else if (!validateEmail(form.email.trim())) {
      newErrors.email = 'Informe um e-mail válido.';
    }

    if (!form.address.trim()) {
      newErrors.address = 'Informe seu endereço.';
    } else if (form.address.trim().length < 5) {
      newErrors.address = 'Informe seu endereço corretamente.';
    }

    if (!form.zip.trim()) {
      newErrors.zip = 'Informe seu CEP.';
    } else if (cleanZip(form.zip).length !== 8) {
      newErrors.zip = 'Informe um CEP válido com 8 números.';
    }

    if (!form.city.trim()) {
      newErrors.city = 'A cidade é obrigatória.';
    }

    if (!form.state.trim()) {
      newErrors.state = 'O estado é obrigatório.';
    }

    if (cleanZip(form.zip).length !== 8 || shipping <= 0) {
      newErrors.zip = 'Calcule o frete informando um CEP válido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSimulatePayment = async (event) => {
    event.preventDefault();

    if (cleanZip(form.zip).length === 8 && shipping <= 0) {
      await fetchAddressByZip(form.zip);
    }

    const isValid = validateForm();
    if (!isValid) return;

    try {
      setPaymentLoading(true);
      window.open('https://www.mercadopago.com.br/', '_blank', 'noopener,noreferrer');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <section className="container page-section">
        <div className="empty-state">
          <span className="section-kicker">Checkout</span>
          <h1>Adicione produtos antes de finalizar a compra.</h1>
          <Link to="/loja" className="primary-button">Ir para a loja</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container page-section">
      <div className="page-header center-header">
        <span className="section-kicker">Checkout</span>
        <h1>Um fluxo final elegante ajuda o cliente a confiar e concluir a compra.</h1>
      </div>

      <div className="checkout-banner premium-checkout-banner">
        <img src={checkoutBanner} alt="Checkout Monarch Store" />
        <div className="checkout-banner-overlay">
        </div>
      </div>

      <div className="checkout-layout top-gap">
        <form className="checkout-form premium-checkout-form" noValidate>
          <div className="form-section-head">
            <div>
              <span className="section-kicker">Dados do cliente</span>
              <h2>Informações para entrega</h2>
              <p>Preencha os dados para continuar com segurança e agilidade.</p>
            </div>
            <div className="checkout-step-badge">Etapa 1 de 2</div>
          </div>

          <div className="input-grid two-cols">
            <div className="field-group">
              <label htmlFor="name">Nome completo</label>
              <input
                id="name"
                name="name"
                placeholder="Seu nome completo"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? 'input-invalid' : ''}
              />
              {errors.name && <span className="input-error">{errors.name}</span>}
            </div>

            <div className="field-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? 'input-invalid' : ''}
              />
              {errors.email && <span className="input-error">{errors.email}</span>}
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="address">Endereço</label>
            <input
              id="address"
              name="address"
              placeholder="Rua, avenida ou número"
              value={form.address}
              onChange={handleChange}
              className={errors.address ? 'input-invalid' : ''}
            />
            {errors.address && <span className="input-error">{errors.address}</span>}
          </div>

          <div className="input-grid three-cols">
            <div className="field-group">
              <label htmlFor="city">Cidade</label>
              <input
                id="city"
                name="city"
                placeholder="Cidade"
                value={form.city}
                onChange={handleChange}
                className={errors.city ? 'input-invalid' : ''}
              />
              {errors.city && <span className="input-error">{errors.city}</span>}
            </div>

            <div className="field-group">
              <label htmlFor="state">Estado</label>
              <input
                id="state"
                name="state"
                placeholder="UF"
                value={form.state}
                onChange={handleChange}
                className={errors.state ? 'input-invalid' : ''}
              />
              {errors.state && <span className="input-error">{errors.state}</span>}
            </div>

            <div className="field-group">
              <label htmlFor="zip">CEP</label>
              <input
                id="zip"
                name="zip"
                placeholder="00000-000"
                value={form.zip}
                onChange={handleChange}
                onBlur={() => fetchAddressByZip(form.zip)}
                className={errors.zip ? 'input-invalid' : ''}
                maxLength={9}
              />
              <div className="field-helper-row">
                <a
                  href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                  target="_blank"
                  rel="noreferrer"
                  className="field-helper-link"
                >
                  Não sei meu CEP
                </a>
              </div>
              {errors.zip && <span className="input-error">{errors.zip}</span>}
              {!errors.zip && zipSuccess && (
                <span className="input-success">{zipSuccess}</span>
              )}
            </div>
          </div>

          {hasCalculatedShipping && deliveryEstimate && (
            <div className="delivery-confirm-card">
              <div className="delivery-confirm-top">
                <strong>{deliveryEstimate.service}</strong>
                <span>{formatPrice(shipping)}</span>
              </div>

              <div className="delivery-confirm-grid">
                <div>
                  <small>Entrega estimada</small>
                  <strong>{deliveryEstimate.time}</strong>
                </div>
                <div>
                  <small>CEP confirmado</small>
                  <strong>{form.zip}</strong>
                </div>
                <div>
                  <small>Destino</small>
                  <strong>
                    {form.city || 'Cidade'}{form.state ? ` - ${form.state}` : ''}
                  </strong>
                </div>
              </div>

              <p>{deliveryEstimate.note}</p>
            </div>
          )}

          <div className="payment-box premium-payment-box">
            <div className="payment-box-head">
              <div>
                <span className="section-kicker">Pagamento</span>
                <h3>Finalize com segurança</h3>
              </div>
              <div className="checkout-step-badge">Etapa 2 de 2</div>
            </div>

            <p>
              Estrutura pronta para integração com Mercado Pago, Pix, cartão e checkout transparente.
            </p>

            <div className="payment-methods-preview">
              <span>Pix</span>
              <span>Cartão</span>
              <span>Mercado Pago</span>
              <span>Ambiente protegido</span>
            </div>

            <button
              type="button"
              className="primary-button premium-checkout-button"
              onClick={handleSimulatePayment}
              disabled={zipLoading || paymentLoading || !hasCalculatedShipping}
            >
              {zipLoading || paymentLoading
                ? 'Processando...'
                : hasCalculatedShipping
                ? 'Finalizar compra'
                : 'Calcule o frete para continuar'}
            </button>
          </div>
        </form>

        <aside className="summary-card premium-summary-card">
          <div className="summary-head">
            <div>
              <h3>Resumo do pedido</h3>
              <span>{itemsCount} {itemsCount === 1 ? 'item' : 'itens'} no carrinho</span>
            </div>
          </div>

          <div className="summary-products-mini">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="summary-product premium-summary-product">
                <div>
                  <span>{item.name}</span>
                  <small>
                    {item.size} · {item.quantity} {item.quantity === 1 ? 'unidade' : 'unidades'}
                  </small>
                </div>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <div className="summary-row">
            <span>Entrega</span>
            <strong>
              {hasCalculatedShipping ? formatPrice(shipping) : 'A calcular'}
            </strong>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          {hasCalculatedShipping && deliveryEstimate && (
            <div className="summary-delivery-note">
              <strong>{deliveryEstimate.service}</strong>
              <span>{deliveryEstimate.time}</span>
            </div>
          )}

          <div className="trust-list">
            <div className="trust-item">🔒 Compra segura</div>
            <div className="trust-item">💳 Pagamento protegido</div>
            <div className="trust-item">📦 Entrega com acompanhamento</div>
          </div>

          <Link to="/loja" className="secondary-button full-button">
            Continuar comprando
          </Link>
        </aside>
      </div>
    </section>
  );
}