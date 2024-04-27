import { useContext, useEffect } from 'react';
import NavbarComponent from '../../components/layout/navbar/Navbar';
import { BatteryContext } from '../../context/BatteryProvider';
import BatteryCard from '../../components/common/BatteryCard';
import { Row, Col } from 'react-bootstrap';
import { RotatingLines } from 'react-loader-spinner';

function HomePage() {
  const { batteries, setShouldLoadBatteryData } = useContext(BatteryContext);

  useEffect(() => {
    if (!Object.keys(batteries).length) {
      console.log('teste')
      setShouldLoadBatteryData(true);
    }
  }, []);


  const renderBatteries = () => (
    <div className="ms-5">
      <Row xs={1} md={3} >
        {batteries.map(battery => (
          <Col key={battery.batteryId} className="d-flex justify-content-center mb-5">
            <BatteryCard
              batteryName={battery.name}
              batteryDescription={battery.description}
              batteryPrice={battery.value}
              batteryQuantity={battery.quantity}
            />
          </Col>
        ))}
      </Row>
    </div>
  )

  return (
    <div >
      <NavbarComponent setNavbarContent={true} />

      {renderBatteries()}
    </div>
  );
}


export default HomePage;
