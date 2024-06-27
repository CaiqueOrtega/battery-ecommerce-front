import { Image, FormControl, Row, Col, Card, ModalBody, Button } from 'react-bootstrap'
import { LogoPixIcon, CopySuccessIcon, CopyIcon, CaretDownIcon } from '../../../../../assets/icons/IconsSet';
import { useState } from 'react';
import { SuccessAnimation } from '../../../../../components/common/ErrorOrSuccessAnimation';

function RenderPixContent({ resultPayment }) {
    const [showTooltip, setShowToolTip] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(resultPayment?.registros[0].fmp_hash)
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

            <ModalBody className='d-flex flex-column justify-content-center px-4' style={{ marginTop: 140 }}>
                <Row className="d-flex h-100" style={{ maxHeight: '259px' }}>

                    <Col md={6}>
                        <Card className='border-0'>
                            <Card.Header className='border'>
                                <Card.Text className='text-muted small'>
                                    Pedido: <span className='fw-bold' style={{ color: '#58af9b' }}>#{resultPayment.saleCode} </span>
                                    - Status Aguardando Pagamento
                                </Card.Text>
                            </Card.Header>
                            <Card.Body className='p-0 border-0 small text-muted'>
                                <ol className="list-group list-group-numbered h-100 rounded-top-0">
                                    <li className="list-group-item h-100" style={{ textAlign: 'justify', wordBreak: 'break-word', hyphens: 'auto', lang: 'pt' }}>
                                        Abra o aplicativo do seu banco de preferência
                                    </li>
                                    <li className="list-group-item h-100" >
                                        Selecione a opção pagar com Pix
                                    </li>
                                    <li className="list-group-item h-100" style={{ textAlign: 'justify', wordBreak: 'break-word', hyphens: 'auto', lang: 'pt' }}>
                                        Leia o QR code ou copie o código e cole no campo de pagamento
                                    </li>
                                </ol>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Image
                            src={resultPayment?.registros[0].fmp_link_qrcode}
                            className=" p-0"
                            alt="QR Code Pix"
                            thumbnail
                            style={{ minHeight: '100%' }}
                        />
                    </Col>
                </Row>

                <div className='w-100 mt-4'>
                    <Card>
                        <Card.Body>
                            <h6 className="text-muted">Ou copie o código de pagamento</h6>
                            <div className='position-relative'>
                                <FormControl
                                    className='pe-4'
                                    readOnly
                                    value={resultPayment?.registros[0].fmp_hash}
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
                </div>
            </ModalBody>
        </>
    );
};

export default RenderPixContent;