import NavbarComponent from '../../components/layout/navbar/Navbar';
import BaterryServices from '../../services/battery/BatteryServices';

function HomePage() {
  const {showBatteries} = BaterryServices()
  return (
    <div >
      <NavbarComponent />
      {showBatteries()}
    </div>
  );
}

export default HomePage;
