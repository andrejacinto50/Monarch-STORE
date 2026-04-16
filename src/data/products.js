import shirt from '../assets/preto.png';
import jacket from '../assets/noiteurbana.png';
import watch from '../assets/pacessorios.png';
import bag from '../assets/pacessorios.png';

export const products = [
  {
    id: 'camiseta-essential-black',
    slug: 'camiseta-essential-black',
    name: 'Camiseta Essential Black',
    category: 'Roupas',
    price: 129.9,
    oldPrice: 169.9,
    image: shirt,
    description: 'Camiseta premium de algodão com acabamento refinado e caimento moderno.',
    sizes: ['P', 'M', 'G', 'GG'],
    badge: 'Mais vendida',
  },
  {
    id: 'jaqueta-urban-night',
    slug: 'jaqueta-urban-night',
    name: 'Jaqueta Urban Night',
    category: 'Roupas',
    price: 349.9,
    oldPrice: 419.9,
    image: jacket,
    description: 'Peça de destaque com presença premium para uma proposta urbana sofisticada.',
    sizes: ['M', 'G', 'GG'],
    badge: 'Novo',
  },
  {
    id: 'relogio-monarch-steel',
    slug: 'relogio-monarch-steel',
    name: 'Relógio Monarch Steel',
    category: 'Acessórios',
    price: 289.9,
    oldPrice: 359.9,
    image: watch,
    description: 'Design marcante com acabamento metálico escuro para elevar qualquer composição.',
    sizes: ['Único'],
    badge: 'Premium',
  },
  {
    id: 'bolsa-messenger-eclipse',
    slug: 'bolsa-messenger-eclipse',
    name: 'Bolsa Messenger Eclipse',
    category: 'Acessórios',
    price: 239.9,
    oldPrice: 299.9,
    image: bag,
    description: 'Funcionalidade, elegância e praticidade para quem busca presença em todos os detalhes.',
    sizes: ['Único'],
    badge: 'Destaque',
  },
];

export const benefits = [
  'Frete simulado para todo o Brasil',
  'Checkout elegante e pronto para conversão',
  'Visual premium para valorizar a marca',
  'Atendimento estratégico via WhatsApp',
];
