import { Card } from 'react-bootstrap';
import imagemExemploBateria from '../../assets/images/exemploImageRegister.png'

function BatteryCard({ batteryName, batteryDescription, batteryPrice, onClick }) {
    return (
        <Card className='shadow rounded-4 border-0' style={{ maxWidth: '14rem' }} onClick={onClick}>
            <div className='p-3 rounded-3'>
                <Card.Img className="img-fluid" variant="top" src={imagemExemploBateria} height={160} />
            </div>
            <Card.Body>
                <Card.Title as="h6" className='fw-'>
                    {batteryDescription ? (batteryName.length > 20 ? batteryName.substring(0, 20) + '...' : batteryName.trim()) : 'Exemplo de nome do produto'}
                </Card.Title>
                <Card.Text className='text-muted mb-5 small'>

                    {batteryDescription ? (batteryDescription.length > 50 ? batteryDescription.substring(0, 50) + '...' : batteryDescription.trim()) : 'Exemplo da descrição do produto'}
                </Card.Text>
                <h5>R$ {batteryPrice || '00,00'}</h5>
            </Card.Body>
        </Card>
    );
}

export default BatteryCard;