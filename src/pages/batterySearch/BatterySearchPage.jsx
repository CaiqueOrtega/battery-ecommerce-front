import React, { useState, useEffect } from "react";
import { Form, Col, Card, Row, ListGroup } from "react-bootstrap";
import { SearchIcon, CaretUpIcon } from "../../assets/icons/IconsSet";
import Fuse from "fuse.js";
import imagemExemploBateria from '../../assets/images/exemploImageRegister.png';


function NavbarSearch({ batteriesActive, navigate }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (query.length === 0) {
            setResults([]);
            setShowResults(false);
            return;
        }

        // Configurações do Fuse.js para buscar na lista de baterias
        const options = {
            keys: ['name'], // Chaves onde a busca será realizada
            threshold: 0.4, // Limiar para a similaridade (0.0 a 1.0)
            distance: 200, // Penalidade para palavras fora de ordem
            ignoreLocation: false, // Não ignorar a localização das palavras
            includeScore: true, // Inclui a pontuação no resultado
            includeMatches: true, // Inclui as correspondências no resultado
        };

        const fuse = new Fuse(batteriesActive, options);
        const result = fuse.search(query);

        const filteredAndSortedBatteries = result.map(item => ({
            ...item.item,
            matches: item.matches
        }));

        setResults(filteredAndSortedBatteries);
        setShowResults(filteredAndSortedBatteries.length > 0);
    }, [query, batteriesActive]);

    const handleChange = (e) => {
        setQuery(e.target.value);
        if (e.target.value.length > 0) {
            setShowResults(true);
        } else {
            setShowResults(false);
        }
    };

    const highlightMatch = (text, matches) => {
        const truncatedText = text.length > 21 ? text.substring(0, 21) + '...' : text;

        if (!matches || matches.length === 0) return truncatedText;

        let highlightedText = "";
        let lastIndex = 0;

        matches.forEach(({ indices }) => {
            indices.forEach(([start, end]) => {
                highlightedText += truncatedText.substring(lastIndex, start);
                highlightedText += `<strong>${truncatedText.substring(start, end + 1)}</strong>`;
                lastIndex = end + 1;
            });
        });

        highlightedText += truncatedText.substring(lastIndex);
        return highlightedText;
    };


    const renderSuggestedBatteries = () => {
        let suggestedBatteries = [...results];

        const options = {
            keys: ['name', 'description'], 
            threshold: 0.4,
        };

        const additionalBatteries = batteriesActive.filter(battery => (
            !suggestedBatteries.find(sb => sb.batteryId === battery.batteryId)
        ));

        const fuse = new Fuse(additionalBatteries, options);
        const additionalResults = fuse.search(query);

        additionalResults.forEach(item => {
            if (suggestedBatteries.length < 3) {
                suggestedBatteries.push({
                    ...item.item,
                    matches: item.matches
                });
            }
        });

        return (
            <>
                <Card.Title className="ps-3 text-muted mb-4 fw-bold">Produtos sugeridos:</Card.Title>
                <RenderSliderBatteries navigate={navigate} batteryResults={suggestedBatteries} />
            </>
        );
    };

    return (
        <Col md={6} className='order-last order-md-0 mt-3 mt-md-0 position-relative'>
            <Form className="position-relative">
                <Form.Control
                    className="py-2 px-3 input-search-size"
                    type="text"
                    placeholder="Pesquise rapidamente a bateria ideal e energize..."
                    value={query}
                    onChange={handleChange}
                    onBlur={() => setShowResults(false)}
                    onFocus={() => { if (results.length > 0) setShowResults(true); }}
                />
                <a type="button" className="position-absolute top-50 end-0 translate-middle-y bg-white border-start ps-2 me-2">
                    <SearchIcon currentColor={"c00d0d"} size={"24"} />
                </a>
            </Form>
            {showResults && (
                <Card className="position-absolute mt-3 shadow border-0 rounded-4" style={{ width: '100%', zIndex: 1000 }}>
                    <div className="position-relative d-flex flex-grow-1 justify-content-end">
                        <span className="position-absolute" style={{
                            top: '-15px',
                            left: '3%'
                        }}>
                            <CaretUpIcon />
                        </span>
                    </div>

                    <Card.Body>
                        <Row className="g-0">
                            <Col className="d-flex col-auto">
                                <div className="w-100">
                                    <Card.Title className="ps-2 text-muted fw-bold">Você quiz dizer:</Card.Title>
                                    {results.map((battery) => (
                                        <ListGroup key={battery.batteryId} variant="flush">
                                            <ListGroup.Item
                                                action
                                                className="text-muted rounded-4 px-2 small"
                                                dangerouslySetInnerHTML={{ __html: highlightMatch(battery.name, battery.matches) }} /> 

                                        </ListGroup>
                                    ))}
                                </div>

                                <div className="vr h-100 ms-2"></div>
                            </Col>

                            <Col xs={1} className="flex-grow-1">
                                {renderSuggestedBatteries()}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}
        </Col>
    );
}

function RenderSliderBatteries({ navigate, batteryResults }) {

    const handleBatteryClick = (batteryData) => {
        navigate('/bateria/detalhes', { state: batteryData });
    };

    return (
        <section className="ps-3 overflow-auto d-flex" style={{ width: '100%', maxWidth: '200em' }}>

            {Object.keys(batteryResults).length !== 0 && batteryResults.map((battery, index) => (
                <div key={battery.batteryId} className={`${index > 0 ? 'ms-2' : ''}`}>
                    <div className="d-flex flex-column" style={{ width: '138px', height: '227px' }}>
                        <div className="d-flex justify-content-center mb-3">
                            <img src={imagemExemploBateria} alt="Exemplo imagem" width={106} height={106} />
                        </div>
                        <div className="d-flex flex-column justify-content-between h-100">
                            <span className="small" style={{ overflowWrap: 'break-word', wordBreak: 'break-word', hyphens: 'auto' }}>
                                {battery.name.length > 35 ? battery.name.substring(0, 35) + '...' : battery.name.
                                    trim()}
                            </span>
                            <p className="fw-bold text-dark" style={{ fontSize: 18 }}>R${battery.value.toFixed(2).replace('.', ',')}</p>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}

export default NavbarSearch;
