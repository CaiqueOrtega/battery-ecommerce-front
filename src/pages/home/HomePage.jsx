import { useState } from 'react';
import BatteryCard from '../../components/common/BatteryCard';
import { Carousel, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CarouselIconRight, CarouselIconLeft } from '../../assets/icons/IconsSet';
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
  const { batteriesActive } = useGlobalDataProvider();
  const navigate = useNavigate();
  const initialCount = Math.min(5, Object.keys(batteriesActive).length);
  const slidesToShow = Math.max(1, initialCount); 
  

  const CustomNextArrow = ({ onClick, style, className }) => (
    <div
      className={className + ' rounded-circle d-flex justify-content-center align-items-center'}
      onClick={onClick}
      style={{ ...style, width: '45px', height: '45px', backgroundColor: '#fff',  zIndex: 1 }}
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


  const settings = {
    dots: true,
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
      },
    ],
    prevArrow: <CustomNextArrow />,
    nextArrow: <CustomPrevArrow />,
    appendDots: (dots) => (
      <ul style={{ display: 'flex', top: '-35px', justifyContent: 'end', height: 'min-content' }}>{dots}</ul>

    ),

  };

  const handleBatteryClick = (batteryData) => {
    navigate('/bateria/detalhes', { state: batteryData });
  };

  return (
    <Container className="slider-container mt-5">
      <Slider {...settings}>
        {batteriesActive.map((battery, index) => (
          <div key={battery.batteryId} className='d-flex '>
            <BatteryCard
              batteryName={battery.name}
              batteryDescription={battery.description}
              batteryPrice={battery.value}
              batteryQuantity={battery.quantity}
              onClick={() => handleBatteryClick(battery)}
            />
          </div>
        ))}
      </Slider>
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
      <Carousel activeIndex={index} onSelect={handleSelect} >
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
