// Función para calcular el puntaje de Intensidad Digital
export const calculateIntensidadDigitalScore = (categoryAverages) => {
  // Categorías que representan intensidad digital (basadas en las categorías reales de la BD)
  const categories = [
    'Optimización de Procesos',
    'Servicio al Cliente', 
    'Sofisticación',
    'Seguridad de la Información',
    'Propiedad Intelectual'
  ];
  const filteredAverages = categoryAverages.filter(cat => categories.includes(cat.name));
  const total = filteredAverages.reduce((acc, curr) => acc + curr.value, 0);
  return filteredAverages.length > 0 ? total / filteredAverages.length : 0;
};

// Función para calcular el puntaje de Gestión Transformacional
export const calculateGestionTransformacionalScore = (categoryAverages) => {
  // Categorías que representan gestión transformacional (basadas en las categorías reales de la BD)
  const categories = [
    'Relaciones de Mercado y Ecosistema',
    'Colaboración y Sinergias Externas',
    'Influencia en Políticas y Normativa',
    'Adaptabilidad y Respuesta a Mercados Globales',
    'Integración en Cadenas de Valor Internacionales',
    'Sostenibilidad',
    'Bilingüismo',
    'Talento 4.0'
  ];
  const filteredAverages = categoryAverages.filter(cat => categories.includes(cat.name));
  const total = filteredAverages.reduce((acc, curr) => acc + curr.value, 0);
  return filteredAverages.length > 0 ? total / filteredAverages.length : 0;
};

// Flecha derecha del slide
export function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`arrow ${className}`}
      style={{ ...style, display: "flex", width: "40px", height: "40px", justifyContent: "center", alignItems: "center", boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.25)", borderRadius: "50%", marginRight: '-2px', backgroundColor: 'white' }}
      onClick={onClick}
    />
  );
}

// Flecha izquierda del slide
export function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`arrow ${className}`}
      style={{ ...style, display: "flex", width: "40px", height: "40px", justifyContent: "center", alignItems: "center", boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.25)", borderRadius: "50%", marginLeft: '-2px', backgroundColor: 'white' }}
      onClick={onClick}
    />
  );
}

// Configuración del slider
export const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  initialSlide: 0,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};