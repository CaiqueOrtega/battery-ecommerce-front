import { Image, ProgressBar, InputGroup, FormControl, Row, Col, Card, ModalBody, Button } from 'react-bootstrap'
import { LogoPixIcon } from '../../../../../assets/icons/IconsSet';
import { useState, useEffect } from 'react';

function RenderPixContent({ resultPayment }) {
    const [timeLeft, setTimeLeft] = useState(2400);
    const [progress, setProgress] = useState(100);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const intervalId = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [timeLeft]);

    useEffect(() => {
        setProgress((timeLeft / 600) * 100);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(resultPayment?.registros[0].fmp_hash)
            .then(() => setCopied(true))
            .catch(() => setCopied(false));
    };

    return (
        <>
            <Row className="g-0" style={{ boxShadow: '0 4px 4px -2px rgba(0, 0, 0, 0.2)' }}>
                <Col xs={12} className="py-5 position-relative d-flex justify-content-center align-items-center">
                    <div className="position-absolute">
                        <LogoPixIcon size={'80px'} />
                    </div>
                </Col>

                <Col xs={12} className="d-flex flex-column align-items-center">
                    <span className="text-muted mb-4 fw-bold">Tempo Restante {formatTime(timeLeft)}</span>

                    <div className="d-flex align-items-center w-50">
                        <ProgressBar now={progress} style={{ flex: 1, height: 7 }} />
                    </div>
                </Col>
            </Row>

            <ModalBody>
                    <Row className="d-flex h-100 px-3 py-5">
                        <Col md={6}>
                            <ol className="list-group list-group-numbered h-100">
                                <li className="list-group-item h-100">Abra o aplicativo do seu banco de preferência</li>
                                <li className="list-group-item h-100">Selecione a opção pagar com Pix</li>
                                <li className="list-group-item h-100">Leia o QR code ou copie o código e cole no campo de pagamento</li>
                            </ol>
                        </Col>
                        <Col md={6}>
                            <Image
                                src={resultPayment?.registros[0].fmp_link_qrcode}
                                className="img-fluid p-0"
                                alt="QR Code Pix"
                                thumbnail
                                height={100}
                            />
                        </Col>

                        <Col xs={12} className='mt-4'>
                            <Card >
                                <Card.Body>
                                    <h6 className="text-muted">Ou copie o código de pagamento</h6>
                                    <InputGroup>
                                        <FormControl
                                            readOnly
                                            value={resultPayment?.registros[0].fmp_hash}
                                        />
                                        <Button variant="outline-secondary" onClick={() => handleCopy()}>
                                            {copied ? 'Copiado!' : 'Copiar'}
                                        </Button>
                                    </InputGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
            </ModalBody>
        </>
    );
};

export default RenderPixContent;