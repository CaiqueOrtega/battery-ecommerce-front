import { ModalBody, Card, Row, Col, Button, FormControl, CardHeader } from 'react-bootstrap';
import { CopyIcon, PaymentTicketIcon, CaretDownIcon, CopySuccessIcon } from '../../../../../assets/icons/IconsSet';
import { useState } from 'react';
import { SuccessAnimation } from '../../../../../components/common/ErrorOrSuccessAnimation';

function TicketContent({ resultPayment }) {
    const [showTooltip, setShowToolTip] = useState(false);
    const [copied, setCopied] = useState(false);

    const currentDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(currentDate.getDate() + 3);

    const formattedDueDate = dueDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const handleCopy = () => {
        navigator.clipboard.writeText(resultPayment?.registros[0].fmb_linha_digitavel)
            .then(() => {
                setCopied(true);

                setTimeout(() => {
                    setCopied(false);
                }, 3000);
            })
            .catch(() => {
                setCopied(false);
                console.error('Falha ao copiar o texto');
            });
    };

    return (
        <>
            <div className="position-absolute d-flex flex-column w-100 align-items-center border-bottom py-3 " style={{ backgroundColor: '#fcfcfc' }} >
                <SuccessAnimation />
                <h5 className='mt-2 ' style={{ color: '#58af9b' }}>Seu pedido foi realizado com sucesso</h5>
            </div>

            <ModalBody className='px-4' style={{ marginTop: 140 }}>
                <Row className='py-0'>
                    <Col xs={12}>
                        <Card className='mb-3 d-flex'>
                            <Card.Header>
                                <Card.Text className='text-muted'>
                                    Pedido: <span className='fw-bold' style={{ color: '#58af9b' }}>#1234 </span>
                                    - Status Aguardando Pagamento
                                </Card.Text>
                            </Card.Header>
                            <Card.Body>
                                <div className='d-flex'>
                                    <div className='pe-2 d-flex align-items-center'>
                                        <div className="rounded-circle  bg-body-secondary text-dark-emphasis d-flex justify-content-center align-items-center border" style={{ width: '30px', height: '30px' }}>
                                            <span style={{ fontSize: '1.2rem' }}>1</span>
                                        </div>
                                    </div>
                                    <span className='lh-sm text-muted d-flex align-items-center'>
                                        Abra o aplicativo do seu banco de preferência
                                    </span>
                                </div>
                                <div className='mt-2 d-flex'>
                                    <div className='pe-2 d-flex align-items-center'>
                                        <div className="rounded-circle  bg-body-secondary text-dark-emphasis d-flex justify-content-center align-items-center border" style={{ width: '30px', height: '30px' }}>
                                            <span style={{ fontSize: '1.2rem' }}>2</span>
                                        </div>
                                    </div>
                                    <span className='lh-sm text-muted d-flex align-items-center'>
                                        Selecione a opção "Ler código de barras"
                                    </span>
                                </div>
                                <div className='d-flex mt-2'>
                                    <div className='pe-2 d-flex align-items-center'>
                                        <div className="rounded-circle  bg-body-secondary text-dark-emphasis d-flex justify-content-center align-items-center border" style={{ width: '30px', height: '30px' }}>
                                            <span style={{ fontSize: '1.2rem' }}>3</span>
                                        </div>
                                    </div>
                                    <span className='lh-sm text-muted d-flex align-items-center'>
                                        Escaneie o código de barras ou copie o código e cole no campo de pagamento
                                    </span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xs={12}>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col className='col-auto'>
                                        <PaymentTicketIcon />
                                    </Col>
                                    <Col>
                                        <h6 className="mb-0">Pagamento via Boleto Bancário</h6>
                                        <span className="text-muted small">Data de vencimento({formattedDueDate})</span>
                                    </Col>
                                    <Col className='col-auto d-flex align-items-center'>
                                        <Button variant="sm float-end btn-green" onClick={() => window.location.href = resultPayment.registros[0].fmb_link_url}>Baixar Boleto</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xs={12}>

                        <Card className='mt-4'>
                            <Card.Body>
                                <h6 className="text-muted">Ou copie o código de pagamento</h6>
                                <div className='position-relative'>
                                    <FormControl
                                        className='pe-4'
                                        readOnly
                                        value={resultPayment?.registros[0].fmb_linha_digitavel}
                                    />

                                    <div className='position-absolute bg-white top-50 end-0 translate-middle-y d-flex justify-content-center px-2 me-1'>
                                        {showTooltip && (
                                            <div
                                                className='z-1 position-absolute text-white d-flex align-items-center small shadow-sm rounded-3 py-2 px-3 '
                                                style={{ width: 320, top: '-170%', left: '-620%', backgroundColor: '#333333' }}>
                                                Copiar para área de transferência
                                                <div className='position-absolute top-50 end-0'>
                                                    <CaretDownIcon currentColor={'#333333'} />
                                                </div>
                                            </div>
                                        )}
                                        <a type='button' className='ms-1 z-3 link-green'
                                            onMouseOver={() => setShowToolTip(true)}
                                            onMouseLeave={() => setShowToolTip(false)}
                                            onClick={() => handleCopy()}>{copied ? <CopySuccessIcon /> : <CopyIcon />}</a>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </ModalBody>
        </>
    );
}

export default TicketContent;
