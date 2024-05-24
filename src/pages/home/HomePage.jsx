import { useEffect, useState } from 'react';
import { BsArrowLeft, BsArrowRight } from '../../assets/icons/IconsSet';
import BatteryCard from '../../components/common/BatteryCard';
import { Carousel, Container, Row, Col } from 'react-bootstrap';
import ControlledCarousel from './carousel/Carousel';
import './home.css';
import { useNavigate } from 'react-router-dom';
import { useGlobalDataProvider } from '../../context/GlobalDataProvider';

function HomePage() {
  const { batteriesActive, setFetchBatteryData } = useGlobalDataProvider();
  const [batteriesPerPage, setBatteriesPerPage] = useState(5);
  const navigate = useNavigate();



  const handleBatteryClick = (batteryData) => {
    navigate('/bateria/detalhes', { state: batteryData });
  };

  const renderBatteries = () => {
    const carousels = [];
    let currentPageBatteries = [];
    let carouselIndex = 0;

    for (let i = 0; i < batteriesActive.length; i += batteriesPerPage * 3) {
      const carouselItems = [];

      for (let j = i; j < i + batteriesPerPage * 3 && j < batteriesActive.length; j += batteriesPerPage) {
        currentPageBatteries = batteriesActive.slice(j, j + batteriesPerPage).map((battery, index)  => (
          <div key={battery.batteryId} className={`${index === 4 ? '' : 'container-card-battery'} d-flex justify-content-center`}>
            <BatteryCard
              batteryName={battery.name}
              batteryDescription={battery.description}
              batteryPrice={battery.value}
              batteryQuantity={battery.quantity}
              onClick={() => handleBatteryClick(battery)}
            />
          </div>
        ));

        carouselItems.push(
            <Carousel.Item key={j} className="carousel-item-custom">
              <div className='d-flex justify-content-center '>
                {currentPageBatteries}
              </div>
            </Carousel.Item>
        );

        currentPageBatteries = [];
      }

      carousels.push(
        <Carousel
          key={carouselIndex++}
          indicators={false}
          interval={null}
          prevIcon={<BsArrowLeft />}
          nextIcon={<BsArrowRight />}
          controls={batteriesActive.length >= 6 ? true : false}
          className="carousel-custom"
        >
          {carouselItems}
        </Carousel>
      );
    }

    return carousels;
  };

  return (
    <>
      <ControlledCarousel />
      <Container className="container-home mt-4">
        {renderBatteries()}
      </Container>
    </>
  );
}

export default HomePage;
