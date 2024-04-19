import { useContext } from 'react';
import NavbarComponent from '../../components/layout/navbar/Navbar';
import { BatteryContext } from '../../context/BatteryProvider';
import BatteryCard from '../../components/common/BatteryCard';
import { Row, Col} from 'react-bootstrap';
function HomePage() {
  const { batteries } = useContext(BatteryContext);
  return (
    <div >
      <NavbarComponent />

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
    </div>
  );
}

export default HomePage;
