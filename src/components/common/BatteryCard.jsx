import { Card } from 'react-bootstrap';
import imagemExemploBateria from '../../assets/images/exemploImageRegister.png'

function BatteryCard({ batteryName, batteryDescription, batteryPrice, onClick }) {
    return (
        <Card className='shadow rounded-4 border-0' style={{ width: '14.5em', height: '27.125em' }} onClick={onClick}>
            <div className='p-4 rounded-3' style={{ backgroundColor: '#f8f8f8' }}>
                <Card.Img className="img-fluid" variant="top" src={imagemExemploBateria} height={160} />
            </div>
            <Card.Body className='d-flex flex-column  justify-content-between '>
                <div>
                    <Card.Title as="h6" className='fw-bold '>
                        {batteryDescription ? (batteryName.length > 20 ? batteryName.substring(0, 20) + '...' : batteryName.trim()) : 'Exemplo de nome do produto'}
                    </Card.Title>
                    <Card.Text className='text-muted mb-5 small'>

                        {batteryDescription ? (batteryDescription.length > 50 ? batteryDescription.substring(0, 50) + '...' : batteryDescription.trim()) : 'Exemplo da descrição do produto'}
                    </Card.Text>
                </div>
                <div>
                    <h6 className='fw-bold '>
                        R$ {batteryPrice ? batteryPrice.toString().replace('.', ',') : '00,00'}
                    </h6>
                </div>

            </Card.Body>
        </Card>
    );
}

export default BatteryCard;