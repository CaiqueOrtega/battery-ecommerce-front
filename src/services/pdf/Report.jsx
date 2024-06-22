import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Row, Col, Button, Card, FormSelect, FormLabel } from 'react-bootstrap';
import { PDFViewer, Document, Page, Text, View, Image, PDFDownloadLink, StyleSheet } from '@react-pdf/renderer';
import logo from '../../assets/images/logo-PretoBranco.png';
import { AuthContext } from '../../context/AuthProvider';
import { useContext } from 'react';
import UserService from '../users/UsersServices';
import BatteryServices from '../battery/BatteryServices';
import PromotionService from '../promotion/PromotionService';
import SaleServices from '../sale/SaleServices';


// Estilo para o PDF
const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    table: {
        display: "table",
        width: "100%",
        border: 0.8,
        borderRight: 0,
        borderBottom: 0,
        marginTop: 30,
    },
    tableRow: {
        flexDirection: "row"
    },
    tableColHeader: {
        flex: 1,
        minWidth: 100,
        borderStyle: "solid",
        borderWidth: 1,
        border: 0,
        borderRight: 0.8,
        borderBottom: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12,
        fontWeight: 'ultrabold',
        padding: 2
    },
    tableCol: {
        flex: 1,
        minWidth: 100,
        borderStyle: "solid",
        borderWidth: 1,
        border: 0,
        borderRight: 0.8,
        borderBottom: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12,
        padding: 2
    },
    header: {
        width: "100%",
        border: 1,
        height: '60px',
        marginBottom: 30,
        flexDirection: 'row',
    },
    logo: {
        width: 100,
    },
    columnImage: {
        borderRight: 1,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    columnText: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'ultrabold'
    },
    subtitle: {
        fontSize: 12,
        marginBottom: 30,
        textAlign: 'justify'
    },
    divisor: {
        borderTop: 1,
        borderBottom: 1,
        margin: 5,
        padding: 15,
        fontSize: 18,
        alignItems: 'center'
    },
    userInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row-reverse',
        borderBottom: 1,
        padding: 10,
        fontSize: 12
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 2
    },
    pageCounter: {
        position: "absolute",
        bottom: 20,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 10
    },
    noContentText: {
        textAlign: 'center',
        marginTop: 10
    }
});

// Component, de tabela
const TablePromotion = ({ data }) => (
    data.length === 0 ? <Text>Sem dados disponíveis</Text> : (
        <View style={styles.table}>
            <View style={styles.tableRow}>
                <View style={styles.tableColHeader}><Text>Código</Text></View>
                <View style={styles.tableColHeader}><Text>Porcentagem</Text></View>
                <View style={styles.tableColHeader}><Text>Data Início</Text></View>
                <View style={styles.tableColHeader}><Text>Data Validade</Text></View>
                <View style={styles.tableColHeader}><Text>Status</Text></View>
            </View>
            {data.map((row, index) => (
                <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCol}><Text>{row.code}</Text></View>
                    <View style={styles.tableCol}><Text>{row.percentage}</Text></View>
                    <View style={styles.tableCol}><Text>{row.startDate}</Text></View>
                    <View style={styles.tableCol}><Text>{row.expirationDate}</Text></View>
                    <View style={styles.tableCol}><Text>{row.status === 'ACTIVE' ? 'Ativo'
                        : row.status === 'INACTIVE' ? 'Inativo'
                            : row.status === 'EXPIRED' ? 'Vencido'
                                : null}</Text></View>
                </View>
            ))}
        </View>
    )
);

const TableBattery = ({ data }) => (
    data.length === 0 ? <Text>Sem dados disponíveis</Text> : (
        <View style={styles.table}>
            <View style={styles.tableRow}>
                <View style={styles.tableColHeader}><Text>Código</Text></View>
                <View style={styles.tableColHeader}><Text>Nome</Text></View>
                <View style={styles.tableColHeader}><Text>Valor</Text></View>
                <View style={styles.tableColHeader}><Text>Quantidade</Text></View>
                <View style={styles.tableColHeader}><Text>Status</Text></View>
            </View>
            {data.map((row, index) => (
                <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCol}><Text>{row.code}</Text></View>
                    <View style={styles.tableCol}><Text>{row.name}</Text></View>
                    <View style={styles.tableCol}><Text>{row.value}</Text></View>
                    <View style={styles.tableCol}><Text>{row.quantity}</Text></View>
                    <View style={styles.tableCol}><Text>{row.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}</Text></View>
                </View>
            ))}
        </View>
    )
);

const TableUser = ({ data }) => (
    data.length === 0 ? <Text>Sem dados disponíveis</Text> : (
        <View style={styles.table}>
            <View style={styles.tableRow}>
                <View style={styles.tableColHeader}><Text>Nome</Text></View>
                <View style={styles.tableColHeader}><Text>Email</Text></View>
                <View style={styles.tableColHeader}><Text>Cargo</Text></View>
                <View style={styles.tableColHeader}><Text>Status</Text></View>
            </View>
            {data.map((row, index) => (
                <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCol}><Text>{row.name}</Text></View>
                    <View style={styles.tableCol}><Text>{row.email}</Text></View>
                    <View style={styles.tableCol}><Text>{row.role === 'ADMIN' ? 'Administrador' : 'Usuário'}</Text></View>
                    <View style={styles.tableCol}><Text>{row.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}</Text></View>
                </View>
            ))}
        </View>
    )
);

const TableSale = ({ data }) => (
    data.length === 0 ? <Text>Sem dados disponíveis</Text> : (
        <View style={styles.table}>
            <View style={styles.tableRow}>
                <View style={styles.tableColHeader}><Text>Código</Text></View>
                <View style={styles.tableColHeader}><Text>Cliente</Text></View>
                <View style={styles.tableColHeader}><Text>Data</Text></View>
                <View style={styles.tableColHeader}><Text>Pagamento</Text></View>
                <View style={styles.tableColHeader}><Text>Valor</Text></View>
                <View style={styles.tableColHeader}><Text>Situação</Text></View>
            </View>
            {data.map((row, index) => (
                <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCol}><Text>{row.code}</Text></View>
                    <View style={styles.tableCol}><Text>{row.user.name}</Text></View>
                    <View style={styles.tableCol}><Text>{row.creationDate}</Text></View>
                    <View style={styles.tableCol}><Text>{row.payment.description}</Text></View>
                    <View style={styles.tableCol}><Text>{row.value}</Text></View>
                    <View style={styles.tableCol}><Text>{row.payment.status}</Text></View>
                </View>
            ))}
        </View>
    )
);

const MyDocument = ({ data, user, type, filter }) => {

    const ITEMS_PER_PAGE_FIRST = 15;
    const ITEMS_PER_PAGE_NEXT = 35;
    const date = new Date().toLocaleString();

    const chunks = data?.reduce((chunks, item, index) => {
        let chunkIndex;
        if (index < ITEMS_PER_PAGE_FIRST) {
            chunkIndex = 0;
        } else {
            chunkIndex = ITEMS_PER_PAGE_FIRST + Math.floor((index - ITEMS_PER_PAGE_FIRST) / ITEMS_PER_PAGE_NEXT);
        }
        if (!chunks[chunkIndex]) {
            chunks[chunkIndex] = [];
        }
        chunks[chunkIndex].push(item);
        return chunks;
    }, []);

    const batterySubtitle = "Este relatório oferece uma análise detalhada e abrangente das baterias registradas para fins de comercialização, \
    proporcionando uma visão minuciosa sobre os produtos atualmente em nosso estoque. \
    Priorizando a oferta de baterias de excelência em qualidade e desempenho, \
    seu propósito é fornecer uma compreensão completa dos diversos modelos disponíveis, seus preços, \
    quantidades em estoque e outras especificações pertinentes."

    const promotionSubtitle = "Este relatório oferece uma análise detalhada e abrangente das promoções cadastradas.\
    Priorizando a apresentação de promoções de alta qualidade e valor agregado,\
    seu propósito é fornecer uma compreensão completa das diversas ofertas disponíveis, \
    seus descontos, períodos de validade, e outras informações relevantes."

    const userSubtitle = "Este relatório oferece uma análise detalhada e abrangente dos usuários cadastrados em nossa plataforma, \
    proporcionando uma visão minuciosa sobre os perfis ativos. Priorizando a identificação de usuários de destaque e seu comportamento na plataforma, \
    seu propósito é fornecer uma compreensão completa dos diversos tipos de usuários."

    const saleSubtitle = "Este relatório oferece uma análise detalhada e abrangente das vendas registradas, \
    proporcionando uma visão minuciosa sobre as transações comerciais realizadas. \
    Priorizando a oferta de dados precisos e insights valiosos, \
    seu propósito é fornecer uma compreensão completa dos valores de venda, \
    datas de validade e outras informações pertinentes para auxiliar na tomada de decisões estratégicas.";

    return (
        <Document>
            {chunks?.length > 0 ? (
                chunks?.map((chunk, pageIndex) => (
                    <Page key={pageIndex} size="A4" style={styles.page}>
                        <View style={styles.section}>
                            {pageIndex === 0 && (
                                <View>
                                    <View style={styles.header}>
                                        <View style={styles.columnImage}>
                                            <Image src={logo} style={styles.logo} />
                                        </View>
                                        <View style={styles.columnText}>
                                            {type === 'battery' ? (
                                                <Text>Relatório de Baterias</Text>
                                            ) : type === 'promotion' ? (
                                                <Text>Relatório de Promoções</Text>
                                            ) : type === 'user' ? (
                                                <Text>Relatório de Usuários</Text>
                                            ) : type === 'sale' ? (
                                                <Text>Relatório de Vendas</Text>
                                            ) : null}
                                        </View>
                                    </View>
                                    <View style={styles.subtitle}>
                                        {type === 'battery' ? (
                                            <Text>{batterySubtitle}</Text>
                                        ) : type === 'promotion' ? (
                                            <Text>{promotionSubtitle}</Text>
                                        ) : type === 'user' ? (
                                            <Text>{userSubtitle}</Text>
                                        ) : type === 'sale' ? (
                                            <Text>{saleSubtitle}</Text>
                                        ) : null}
                                    </View>
                                    <View style={styles.divisor}>
                                        <Text>Usuário Solicitante</Text>
                                    </View>
                                    <View style={styles.userInfo}>
                                        <View>
                                            {filter ? (
                                                <Text><Text style={styles.boldText}>Filtro selecionado: </Text>{filter}</Text>
                                            ) : null}
                                        </View>

                                        <View>
                                            <Text><Text style={styles.boldText}>Nome: </Text> {user.name}</Text>
                                            <Text><Text style={styles.boldText}>CPF: </Text> {user.document}</Text>
                                            <Text><Text style={styles.boldText}>Email: </Text> {user.email}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                            {type === 'battery' ? (
                                <TableBattery data={chunk} />
                            ) : type === 'promotion' ? (
                                <TablePromotion data={chunk} />
                            ) : type === 'user' ? (
                                <TableUser data={chunk} />
                            ) : type === 'sale' ? (
                                <TableSale data={chunk} />
                            ) : null}
                            <View style={styles.pageCounter}>
                                <Text>{date}</Text>
                                <Text render={({ pageNumber, totalPages }) => (
                                    `${pageNumber} / ${totalPages}`
                                )} fixed />
                            </View>
                        </View>
                    </Page>
                ))
            ) : (
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <View style={styles.header}>
                            <View style={styles.columnImage}>
                                <Image src={logo} style={styles.logo} />
                            </View>
                            <View style={styles.columnText}>
                                {type === 'battery' ? (
                                    <Text>Relatório de Baterias</Text>
                                ) : type === 'promotion' ? (
                                    <Text>Relatório de Promoções</Text>
                                ) : type === 'user' ? (
                                    <Text>Relatório de Usuários</Text>
                                ) : type === 'sale' ? (
                                    <Text>Relatório de Vendas</Text>
                                ) : null}
                            </View>
                        </View>
                        <View style={styles.subtitle}>
                            {type === 'battery' ? (
                                <Text>{batterySubtitle}</Text>
                            ) : type === 'promotion' ? (
                                <Text>{promotionSubtitle}</Text>
                            ) : type === 'user' ? (
                                <Text>{userSubtitle}</Text>
                            ) : type === 'sale' ? (
                                <Text>{saleSubtitle}</Text>
                            ) : null}
                        </View>
                        <View style={styles.divisor}>
                            <Text>Usuário Solicitante</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <View>
                                {filter ? (
                                    <Text><Text style={styles.boldText}>Filtro selecionado: </Text>{filter}</Text>
                                ) : null}
                            </View>

                            <View>
                                <Text><Text style={styles.boldText}>Nome: </Text> {user.name}</Text>
                                <Text><Text style={styles.boldText}>CPF: </Text> {user.document}</Text>
                                <Text><Text style={styles.boldText}>Email: </Text> {user.email}</Text>
                            </View>
                        </View>
                        <Text style={styles.noContentText}>Sem dados disponíveis</Text>
                        <View style={styles.pageCounter}>
                            <Text>{date}</Text>
                            <Text render={({ pageNumber, totalPages }) => (
                                `${pageNumber} / ${totalPages}`
                            )} fixed />
                        </View>
                    </View>
                </Page>
            )}
        </Document>
    );
};




const ReportGenerator = () => {
    const pdfViewer = (data, userData, type, filter) => {
        return (
            <PDFViewer width="100%" height="360em">
                <MyDocument data={data} user={userData} type={type} filter={filter} />
            </PDFViewer>
        )
    };

    const pdfButtonLink = (data, userData, type, filter) => {
        return (
            <PDFDownloadLink className='btn btn-red' document={<MyDocument data={data} user={userData} type={type} filter={filter} />} fileName="relatorio.pdf" style={styles.button}>
                {({ blob, url, loading, error }) =>
                    loading ? 'Gerando PDF...' : 'Baixar PDF'
                }
            </PDFDownloadLink>
        );
    }

    return { pdfViewer, pdfButtonLink };
};

function ModalPdf({ showsModalPDF, setShowModalPDF, currentItems, type }) {
    const { userData } = useContext(AuthContext);
    const [selectedFilter, setSelectedFilter] = useState('Sem filtros');

    const [report, setReport] = useState(
        type === 'user' ? 'user-clear' :
            type === 'battery' ? 'battery-clear' :
                type === 'promotion' ? 'promotion-clear' :
                    type === 'sale' ? 'sale-clear' : ''
    );

    const [data, setData] = useState([]);
    const { pdfViewer, pdfButtonLink } = ReportGenerator();
    const [showModalPdfSwitch, setShowModalPdfSwitch] = useState(false);
    const inputRef = useRef(null);
    const [shouldDataUpdate, setShouldDataUpdate] = useState(false)

    const handleShowModalPdfSwitchChange = useCallback(() => {
        setShowModalPdfSwitch(prevState => !prevState);
        inputRef.current.checked = !showModalPdfSwitch;
    }, [showModalPdfSwitch]);

    const { getUserReportData } = UserService();
    const { getBatteryReportData } = BatteryServices()
    const { getPromotionReportData } = PromotionService()
    const { getSaleReporData } = SaleServices()

    async function handleReportChange() {
        if (shouldDataUpdate != null) {
            switch (type) {
                case 'user':
                    const userResponse = await getUserReportData(report);
                    setData(userResponse);
                    setShouldDataUpdate(false)
                    break;
                case 'battery':
                    const batteryResponse = await getBatteryReportData(report)
                    setData(batteryResponse)
                    setShouldDataUpdate(false)
                    break;
                case 'promotion':
                    const promotionResponse = await getPromotionReportData(report)
                    setData(promotionResponse)
                    setShouldDataUpdate(false)
                    break;
                case 'sale':
                    const saleResponse = await getSaleReporData(report)
                    setData(saleResponse)
                    setShouldDataUpdate(false)
                    break;
                default:
                    setData([])
                    break;
            }
        }
    }


    useEffect(() => {
        setData(currentItems);
        handleReportChange()
    }, [currentItems, shouldDataUpdate]);


    const optionsByType = {
        user: [
            { label: 'Sem filtros', value: 'user-clear' },
            { label: 'Ativo', value: 'user-active', group: 'Status' },
            { label: 'Inativo', value: 'user-inactive', group: 'Status' },
            { label: 'Usuário', value: 'user-user', group: 'Cargo' },
            { label: 'Administrador', value: 'user-admin', group: 'Cargo' }
        ],
        battery: [
            { label: 'Sem filtros', value: 'battery-clear' },
            { label: 'Ativo', value: 'battery-active', group: 'Status' },
            { label: 'Inativo', value: 'battery-inactive', group: 'Status' },
            { label: '0 R$ - 100 R$', value: 'battery-value-100', group: 'Preço' },
            { label: '100 R$ - 250 R$', value: 'battery-value-250', group: 'Preço' },
            { label: '250 R$ - 500 R$', value: 'battery-value-500', group: 'Preço' },
            { label: 'Acima de 500 R$', value: 'battery-value-over-500', group: 'Preço' },
            { label: '0 - 100 Unidades', value: 'battery-quantity-100', group: 'Quantidade' },
            { label: '100 - 250 Unidades', value: 'battery-quantity-250', group: 'Quantidade' },
            { label: '250 - 500 Unidades', value: 'battery-quantity-500', group: 'Quantidade' },
            { label: 'Acima de 500 Unidades', value: 'battery-quantity-over-500', group: 'Quantidade' }
        ],
        promotion: [
            { label: 'Sem filtros', value: 'promotion-clear' },
            { label: 'Ativo', value: 'promotion-active', group: 'Status' },
            { label: 'Inativo', value: 'promotion-inactive', group: 'Status' },
            { label: 'Vencido', value: 'promotion-expired', group: 'Status' },
            { label: 'Próximo mês', value: 'promotion-validity-1', group: 'Vencimento' },
            { label: 'Próximos 3 meses', value: 'promotion-validity-3', group: 'Vencimento' },
            { label: 'Próximos 6 meses', value: 'promotion-validity-6', group: 'Vencimento' },
            { label: 'Acima de 6 meses', value: 'promotion-validity-over-6', group: 'Vencimento' },
            { label: '0 - 15%', value: 'promotion-percentage-15', group: 'Porcentagem de Desconto' },
            { label: '15 - 30%', value: 'promotion-percentage-30', group: 'Porcentagem de Desconto' },
            { label: '30 - 50%', value: 'promotion-percentage-50', group: 'Porcentagem de Desconto' },
            { label: 'Acima de 50%', value: 'promotion-percentage-over-50', group: 'Porcentagem de Desconto' }
        ],
        sale: [
            { label: 'Sem filtros', value: 'sale-clear' },
            { label: '0 R$ - 250 R$', value: 'sale-value-250', group: 'Preço' },
            { label: '250 R$ - 500 R$', value: 'sale-value-500', group: 'Preço' },
            { label: '500 R$ - 1000 R$', value: 'sale-value-1000', group: 'Preço' },
            { label: 'Acima de 1000 R$', value: 'sale-value-over-1000', group: 'Preço' },
            { label: 'Próximo mês', value: 'sale-validity-1', group: 'Vencimento' },
            { label: 'Próximos 3 meses', value: 'sale-validity-3', group: 'Vencimento' },
            { label: 'Próximos 6 meses', value: 'sale-validity-6', group: 'Vencimento' },
            { label: 'Acima de 6 meses', value: 'sale-validity-over-6', group: 'Vencimento' }
        ]
    };

    return (
        <>
            <Modal show={showsModalPDF} onHide={() => setShowModalPDF(false)} backdrop='false' centered>
                <Modal.Header className='bg-red text-white'>
                    <Modal.Title>Configurar Relatório</Modal.Title>
                    <button className='btn-close btn-close-white' onClick={() => setShowModalPDF(false)} />
                </Modal.Header>
                <Modal.Body >
                    <Row className='h-100 d-flex flex-column '>
                        <Col>
                            <Card className='shadow-sm'>
                                <Card.Body className='d-flex justify-content-between '>
                                    <span className='fw-bold text-muted'>
                                        Configurações do PDF
                                    </span>
                                    <div className="form-check form-switch ">
                                        <input
                                            className="form-check-input small"
                                            type="checkbox"
                                            role="switch"
                                            id="flexSwitchCheckChecked"
                                            checked={showModalPdfSwitch}
                                            onChange={handleShowModalPdfSwitchChange}
                                            ref={inputRef}
                                        />
                                        <label className="form-check-label small text-muted" htmlFor="flexSwitchCheckChecked">Pré-visualização</label>
                                    </div>
                                </Card.Body>
                            </Card>

                            <FormLabel className='w-100 mt-4'>
                                Filtros
                                <FormSelect
                                    className=" py-2 mt-1"
                                    aria-label={`Filtragem ${type === 'user' ? 'Usuários' : type === 'battery' ? 'Baterias' : type === 'promotion' ? 'Promoções' : type === 'sale' ? 'Vendas' : ''}`}
                                    onChange={(e) => {
                                        setSelectedFilter(e.target.options[e.target.selectedIndex].text);
                                        setReport(e.target.value);
                                        handleReportChange();
                                        setShouldDataUpdate(true);
                                    }}
                                >
                                    {optionsByType[type].map((option, index) => (
                                        <React.Fragment key={index}>
                                            {index === 0 || option.group !== optionsByType[type][index - 1].group ? (
                                                <optgroup label={option.group}></optgroup>
                                            ) : null}
                                            <option value={option.value}>{option.label}</option>
                                        </React.Fragment>
                                    ))}
                                </FormSelect>
                            </FormLabel>
                        </Col>

                        <Col className={`mt-3 ${!showModalPdfSwitch ? 'd-none' : ''}`}>
                            {showModalPdfSwitch ? pdfViewer(data, userData, type, selectedFilter) : null}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalPDF(false)}>Fechar</Button>

                    {pdfButtonLink(data, userData, type, selectedFilter)}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalPdf;