import { Card } from 'react-bootstrap';
import imagemExemploBateria from '../../assets/images/exemploImageRegister.png'

function BatteryCard({ productName, productDescription, productPrice, onClick }) {
    return (
        <Card className='shadow rounded-3 me-2' style={{ maxWidth: '14rem' }} onClick={onClick}>
            <div className='p-3 rounded-3' style={{ background: "#fafafa" }}>
                <Card.Img className="img-fluid" variant="top" src={imagemExemploBateria} height={160} />
            </div>
            <Card.Body>
                <Card.Title as="h6" className='fw-'>{productName.trim() || 'Exemplo do Nome do Produto'}</Card.Title>
                <Card.Text className='text-muted mb-5 small'>
                    {productDescription.trim() || 'Exemplo da descrição do produto'}
                </Card.Text>
                <h5>R$ {productPrice || '00,00'}</h5>
            </Card.Body>
        </Card>
    );
}

export default BatteryCard;