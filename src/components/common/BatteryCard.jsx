import React from 'react';
import { Card, Placeholder } from 'react-bootstrap';
import imagemExemploBateria from '../../assets/images/exemploImageRegister.png';

function BatteryCard({ batteryName, batteryDescription, batteryPrice, onClick, onPlaceholder, sizeWidth, sizeHeight, border}) {
    return (
        <>
            <Card className={`shadow-sm rounded-4 ${border ? 'border' : 'border-0'} mb-3`} style={{ width: `${sizeWidth}`, height: `${sizeHeight}` }} onClick={onClick}>
                <div className='p-4 rounded-top-3' style={{ backgroundColor: '#f8f8f8' }}>
                    <Card.Img className="img-fluid" variant="top" src={imagemExemploBateria} height={160} />
                </div>
                <Card.Body className='d-flex flex-column justify-content-between'>
                    <div>
                        {!batteryName && onPlaceholder? (
                            <Placeholder as={Card.Title} animation="glow">
                                <Placeholder xs={12} />
                            </Placeholder>
                        ) : (
                            <Card.Title as="h6" className='fw-bold '>
                                {batteryName.length > 20 ? batteryName.substring(0, 20) + '...' : batteryName.trim() || 'Nome Exemplo de Bateria'}
                            </Card.Title>
                        )}
                        {!batteryDescription && onPlaceholder? (
                            <Placeholder as={Card.Text} animation="glow">
                                <Placeholder xs={12} />
                            </Placeholder>
                        ) : (
                            <Card.Text className='text-muted small'>
                                {batteryDescription.length > 50 ? batteryDescription.substring(0, 50) + '...' : batteryDescription.trim() || 'Descrição Exemplo de Bateria'}
                            </Card.Text>
                        )}
                    </div>

                    <div>
                        {!batteryDescription && onPlaceholder ? (
                            <Placeholder as={Card.Title} animation="glow">
                                <Placeholder xs={6} />
                            </Placeholder>
                        ) : (
                            <h6 className='fw-bold '>
                                R$ {batteryPrice.toString().replace('.', ',') || '000,00'}
                            </h6>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </>
    );
}

export default BatteryCard;
