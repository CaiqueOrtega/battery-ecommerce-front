import { useEffect, useState } from 'react';
import NavbarComponent from '../../components/layout/navbar/Navbar';
import { BsArrowLeft, BsArrowRight } from '../../assets/icons/IconsSet';
import BatteryCard from '../../components/common/BatteryCard';
import { Carousel, Container, Row, Col } from 'react-bootstrap';
import ControlledCarousel from './carousel/Carousel';
import './home.css';
import { useNavigate } from 'react-router-dom';
import Footer from './footer/Footer';
import { useGlobalData } from '../../context/GlobalDataProvider'; 

function HomePage() {
  const { batteriesActive, setFetchBatteryData }  = useGlobalData();
  const [batteriesPerPage, setBatteriesPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Página Inicial";
    setFetchBatteryData(prevState => !prevState);
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
          prevIcon={<BsArrowLeft />}
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
    <Row className="flex-column justify-content-between g-0" style={{ minHeight: '100vh' }}>
      <Col xs={12} className="p-0">
        <NavbarComponent setNavbarContent={true} />
      </Col>

      <Col xs={12} className="p-0 flex-grow-1 d-flex flex-column">
        <ControlledCarousel />
        <Container className="mt-4">
          {renderBatteries()}
        </Container>
      </Col>

      <Col xs={12} className="p-0">
        <Footer />
      </Col>
    </Row>
  );
}

export default HomePage;
