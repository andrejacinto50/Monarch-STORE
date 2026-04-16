import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import checkoutBanner from '../assets/checkout-banner.jpg';

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

        setZipSuccess('CEP encontrado e frete calculado com sucesso.');
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

    window.open('https://www.mercadopago.com.br/', '_blank', 'noopener,noreferrer');
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

      <div className="checkout-banner">
        <img src={checkoutBanner} alt="Checkout Monarch Store" />
      </div>

      <div className="checkout-layout top-gap">
        <form className="checkout-form" noValidate>
          <h2>Dados do cliente</h2>

          <div className="input-grid two-cols">
            <div className="field-group">
              <input
                name="name"
                placeholder="Nome completo"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? 'input-invalid' : ''}
              />
              {errors.name && <span className="input-error">{errors.name}</span>}
            </div>

            <div className="field-group">
              <input
                name="email"
                type="email"
                placeholder="E-mail"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? 'input-invalid' : ''}
              />
              {errors.email && <span className="input-error">{errors.email}</span>}
            </div>
          </div>

          <div className="field-group">
            <input
              name="address"
              placeholder="Endereço"
              value={form.address}
              onChange={handleChange}
              className={errors.address ? 'input-invalid' : ''}
            />
            {errors.address && <span className="input-error">{errors.address}</span>}
          </div>

          <div className="input-grid two-cols">
            <div className="field-group">
              <input
                name="city"
                placeholder="Cidade"
                value={form.city}
                onChange={handleChange}
                className={errors.city ? 'input-invalid' : ''}
              />
              {errors.city && <span className="input-error">{errors.city}</span>}
            </div>

            <div className="field-group">
              <input
                name="zip"
                placeholder="CEP"
                value={form.zip}
                onChange={handleChange}
                onBlur={() => fetchAddressByZip(form.zip)}
                className={errors.zip ? 'input-invalid' : ''}
                maxLength={9}
              />
              {errors.zip && <span className="input-error">{errors.zip}</span>}
              {!errors.zip && zipSuccess && (
                <span className="input-success">{zipSuccess}</span>
              )}
            </div>
          </div>

          <div className="field-group">
            <input
              name="state"
              placeholder="Estado"
              value={form.state}
              onChange={handleChange}
              className={errors.state ? 'input-invalid' : ''}
            />
            {errors.state && <span className="input-error">{errors.state}</span>}
          </div>

          <div className="payment-box">
            <h3>Pagamento</h3>
            <p>Estrutura pronta para integração com Mercado Pago, cartão, Pix ou checkout transparente.</p>

            <button
              type="button"
              className="primary-button"
              onClick={handleSimulatePayment}
              disabled={zipLoading}
            >
              {zipLoading ? 'Finalizar Compra...' : 'Simular pagamento'}
            </button>
          </div>
        </form>

        <aside className="summary-card">
          <h3>Resumo do pedido</h3>

          {cartItems.map((item) => (
            <div key={`${item.id}-${item.size}`} className="summary-product">
              <span>{item.name} x {item.quantity}</span>
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </div>
          ))}

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <div className="summary-row">
            <span>Frete</span>
            <strong>
              {cleanZip(form.zip).length === 8 && shipping > 0
                ? formatPrice(shipping)
                : 'A calcular'}
            </strong>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}