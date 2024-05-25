import { useEffect, useState } from 'react';
import { BsArrowLeft, BsArrowRight } from '../../assets/icons/IconsSet';
import BatteryCard from '../../components/common/BatteryCard';
import { Carousel, Container } from 'react-bootstrap';
import ControlledCarousel from './carousel/Carousel';
import './home.css';
import { useNavigate } from 'react-router-dom';
import { useGlobalDataProvider } from '../../context/GlobalDataProvider';

function HomePage() {
  const { batteriesActive, setFetchBatteryData } = useGlobalDataProvider();
    const [batteriesPerPage, setBatteriesPerPage] = useState(5);
  const navigate = useNavigate();

  const calculateItemsPerPage = () => {
    const totalItems = batteriesActive.length < 15 ? batteriesActive.length : 15;
    return Math.ceil(totalItems / 3) * 3;
  };

  const itemsPerPage = calculateItemsPerPage();


  useEffect(() => {
    const handleResize = () => {
      const newBatteriesPerPage = window.innerWidth <= 420 ? 2 : 5;
      setBatteriesPerPage(newBatteriesPerPage);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const totalCarousels = batteriesActive.length > 0 ? Math.ceil(batteriesActive.length / itemsPerPage) : 1;
  const [activeIndexes, setActiveIndexes] = useState(Array(totalCarousels).fill(0));

  useEffect(() => {

    // Reinitialize activeIndexes when batteriesActive changes
    setActiveIndexes(Array(totalCarousels).fill(0));
  }, [batteriesActive, totalCarousels]);

  const handleBatteryClick = (batteryData) => {
    navigate('/bateria/detalhes', { state: batteryData });
  };

  const handleSelect = (selectedIndex, carouselIndex) => {
    setActiveIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      newIndexes[carouselIndex] = selectedIndex;
      return newIndexes;
    });
  };

  const renderBatteries = () => {
    const carousels = [];

    for (let i = 0; i < totalCarousels; i++) {
      const startIdx = i * itemsPerPage;
      const endIdx = Math.min(startIdx + itemsPerPage, batteriesActive.length);
      const carouselItems = [];

      for (let j = startIdx; j < endIdx; j += batteriesPerPage) {
        const currentPageBatteries = batteriesActive.slice(j, j + batteriesPerPage).map((battery) => (
          <div key={battery.batteryId} className="container-card-battery d-flex justify-content-center">
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
            <div className="d-flex justify-content-center pb-4 pt-0">{currentPageBatteries}</div>
          </Carousel.Item>
        );
      }

      const activeIndex = activeIndexes[i];
      const totalSlides = Math.ceil((endIdx - startIdx) / batteriesPerPage);


      carousels.push(
        <Carousel
          key={i}
          indicators={false}
          interval={null}
          activeIndex={activeIndex}
          onSelect={(selectedIndex) => handleSelect(selectedIndex, i)}
          prevIcon={
            activeIndex > 0 && (
              <div className="position-absolute start-0 bg-light rounded-circle p-2 carousel-circle-button">
                <BsArrowLeft size={55} />
              </div>
            )
          }
          nextIcon={
            activeIndex < totalSlides - 1 && (
              <div className="position-absolute end-0 bg-light rounded-circle p-2 carousel-circle-button">
                <BsArrowRight size={55} />
              </div>
            )
          }
          controls={totalSlides > 1}
          className="carousel-custom position-relative mb-4"
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
      <Container className="mt-4">
        {renderBatteries()}
      </Container>
    </>
  );
}

export default HomePage;
