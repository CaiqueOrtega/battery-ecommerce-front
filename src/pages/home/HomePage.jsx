import { useState } from 'react';
import BatteryCard from '../../components/common/BatteryCard';
import { Carousel, Container, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CarouselIconRight, CarouselIconLeft, BatteryIcon } from '../../assets/icons/IconsSet';
import { useGlobalDataProvider } from '../../context/GlobalDataProvider';
import exampleCarousel1 from '../../assets/images/carousel-images-examples-1.jpg';
import exampleCarousel2 from '../../assets/images/carousel-images-examples-2.jpg';
import exampleCarousel3 from '../../assets/images/carousel-images-examples-3.jpg';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './home.css';


function HomePage() {
  return (
    <>
      <ControlledCarouseImages />
      <RenderSliderBatteries />

    </>
  );
}

function RenderSliderBatteries() {
  const { batteriesActive, batteriesActiveIsLoaded } = useGlobalDataProvider();
  const navigate = useNavigate();
  const initialCount = Math.min(5, Object.keys(batteriesActive).length);
  const slidesToShow = Math.max(1, initialCount);


  const CustomNextArrow = ({ onClick, style, className }) => (
    <div
      className={className + ' rounded-circle d-flex justify-content-center align-items-center'}
      onClick={onClick}
      style={{ ...style, width: '45px', height: '45px', backgroundColor: '#fff', zIndex: 1 }}
    >
      < CarouselIconLeft size={35} />
    </div>
  );

  const CustomPrevArrow = ({ onClick, style, className }) => (
    <div
      className={className + ' rounded-circle d-flex justify-content-center align-items-center'}
      onClick={onClick}
      style={{ ...style, width: '45px', height: '45px', backgroundColor: '#fff' }}
    >
      <CarouselIconRight size={35} />
    </div>
  );

  console.log(slidesToShow)

  const settings = {
    dots: false,
    infinite: false,
    speed: 800,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToShow,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false
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
      },
    ],
    prevArrow: <CustomNextArrow />,
    nextArrow: <CustomPrevArrow />,
  };

  const handleBatteryClick = (batteryData) => {
    navigate('/bateria/detalhes', { state: batteryData });
  };


  return (
    <Container className="slider-container mt-5">
      {batteriesActive.length ?
        <Slider {...settings}>
          {Object.keys(batteriesActive).length !== 0 && batteriesActive.map((battery, index) => (
            <div key={battery.batteryId} className='justify-content-center d-flex' >
              <BatteryCard
                batteryName={battery.name}
                batteryDescription={battery.description}
                batteryPrice={battery.value}
                batteryQuantity={battery.quantity}
                onPlaceholder={true}
                sizeWidth={'14.5em'}
                sizeHeight={'27.125em'}
                onClick={() => handleBatteryClick(battery)}
              />
            </div>
          ))}
        </Slider>
        : (
          !batteriesActiveIsLoaded ? (
            <div className='h-100 d-flex flex-grow-1 align-items-center justify-content-center'>
              <Spinner animation="border" role="status" style={{ color: '#c00d0d' }}>
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center py-5">
              <BatteryIcon size={'80px'} />
              <span className="mt-2">Ainda não existem baterias disponíveis para compra!</span>
              <span className="text-muted small">Aguarde até que alguma bateria seja adicionada</span>
            </div>
          )
        )}
    </Container>
  );

}



function ControlledCarouseImages() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Container fluid className='carousel-container-home position-relative overflow-hidden z-1'>
      <Carousel activeIndex={index} onSelect={handleSelect} interval={3000} >
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={exampleCarousel1}
            alt="First slide"
            style={{ height: 'auto' }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={exampleCarousel2}
            alt="Second slide"
            style={{ height: 'auto' }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={exampleCarousel3}
            alt="Third slide"
            style={{ height: 'auto' }}
          />
        </Carousel.Item>
      </Carousel>
      <div className='gradient position-absolute'></div>
    </Container>
  );
}

export default HomePage;
