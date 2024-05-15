import { useContext, useEffect, useState } from 'react';
import NavbarComponent from '../../components/layout/navbar/Navbar';
import { BatteryContext } from '../../context/BatteryProvider';
import { BsArrowLeft, BsArrowRight } from '../../assets/icons/IconsSet';
import BatteryCard from '../../components/common/BatteryCard';
import { Carousel, Container, Card } from 'react-bootstrap';
import ControlledCarousel from './carousel/Carousel';
import './home.css';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const { batteriesActive, setGetBatteryActive } = useContext(BatteryContext);
  const [batteriesPerPage, setBatteriesPerPage] = useState(5);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    document.title = "Página Inicial";
    setGetBatteryActive(prevState => !prevState);
  }, []);


  const handleBatteryClick = (batteryData) => {
    navigate('/bateria', { state: batteryData });
  };

  const renderBatteries = () => {
    const carousels = [];
    let currentPageBatteries = [];
    let carouselIndex = 0;

    for (let i = 0; i < batteriesActive.length; i += batteriesPerPage * 3) {
      const carouselItems = [];

      for (let j = i; j < i + batteriesPerPage * 3 && j < batteriesActive.length; j += batteriesPerPage) {
        currentPageBatteries = batteriesActive.slice(j, j + batteriesPerPage).map(battery => (
          <div key={battery.batteryId} className="d-flex justify-content-center p-3 m-0">
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
          <Carousel.Item key={j}>
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
          prevIcon={<BsArrowLeft /> }
          nextIcon={<BsArrowRight />}
          controls={batteriesActive.length >= 6 ? true : false} 
        >
          {carouselItems}
        </Carousel>
      );
    }

    return carousels;
  };

  return (
    <>
      <NavbarComponent setNavbarContent={true} />
      <ControlledCarousel />

      <Container className='mt-4'>

          {renderBatteries()}
    </Container >
    </>
  );
}

export default HomePage;
