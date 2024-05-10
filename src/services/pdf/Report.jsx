import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import { PDFViewer, Document, Page, Text, View, Image, PDFDownloadLink, StyleSheet } from '@react-pdf/renderer';
import logo from '../../assets/images/logo-PretoBranco.png';
import { AuthContext } from '../../context/AuthProvider';
import { useContext } from 'react';


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
        justifyContent: 'space-between'
    }
});

// Component, de tabela
const TablePromotion = ({ data }) => (
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
                <View style={styles.tableCol}><Text>{row.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}</Text></View>
            </View>
        ))}
    </View>
);

const TableBattery = ({ data }) => (
    <View style={styles.table}>
        <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>Código</Text></View>
            <View style={styles.tableColHeader}><Text>Nome</Text></View>
            <View style={styles.tableColHeader}><Text>Valor</Text></View>
            <View style={styles.tableColHeader}><Text>Status</Text></View>
        </View>
        {data.map((row, index) => (
            <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}><Text>{row.code}</Text></View>
                <View style={styles.tableCol}><Text>{row.name}</Text></View>
                <View style={styles.tableCol}><Text>{row.value}</Text></View>
                <View style={styles.tableCol}><Text>{row.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}</Text></View>
            </View>
        ))}
    </View>
);

const TableUser = ({ data }) => (
    <View style={styles.table}>
        <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>Código</Text></View>
            <View style={styles.tableColHeader}><Text>Nome</Text></View>
            <View style={styles.tableColHeader}><Text>Valor</Text></View>
            <View style={styles.tableColHeader}><Text>Status</Text></View>
        </View>
        {data.map((row, index) => (
            <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}><Text>{row.code}</Text></View>
                <View style={styles.tableCol}><Text>{row.name}</Text></View>
                <View style={styles.tableCol}><Text>{row.value}</Text></View>
                <View style={styles.tableCol}><Text>{row.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}</Text></View>
            </View>
        ))}
    </View>
);



const MyDocument = ({ data, user, type }) => {
    // Definir o número de itens por página para a primeira e as seguintes
    const ITEMS_PER_PAGE_FIRST = 18;
    const ITEMS_PER_PAGE_NEXT = 35;
    const date = new Date().toLocaleString();

    // Dividir os dados em partes para as páginas
    const chunks = data.reduce((chunks, item, index) => {
        let chunkIndex;
        // Verificar se estamos na primeira página ou não
        if (index < ITEMS_PER_PAGE_FIRST) {
            chunkIndex = 0;
        } else {
            // Se não for a primeira página, calcular o índice da página com base no número de itens por página seguinte
            chunkIndex = ITEMS_PER_PAGE_FIRST + Math.floor((index - ITEMS_PER_PAGE_FIRST) / ITEMS_PER_PAGE_NEXT);
        }

        // Criar uma nova parte se não existir
        if (!chunks[chunkIndex]) {
            chunks[chunkIndex] = [];
        }

        // Adicionar o item à parte correspondente
        chunks[chunkIndex].push(item);

        return chunks;
    }, []);

    return (
        <Document>
            {chunks.map((chunk, pageIndex) => (
                <Page key={pageIndex} size="A4" style={styles.page}>
                    <View style={styles.section}>
                        {/* Cabeçalho (apenas na primeira página) */}
                        {pageIndex === 0 && (
                            <View>
                                <View style={styles.header}>
                                    <View style={styles.columnImage}>
                                        <Image source={logo} style={styles.logo} />
                                    </View>
                                    <View style={styles.columnText}>
                                        <Text>Relatório de Baterias</Text>
                                    </View>
                                </View>
                                {/* Subtítulo do relatório */}
                                <View style={styles.subtitle}>
                                    <Text>
                                        Este relatório oferece uma análise detalhada e abrangente das baterias registradas para fins de comercialização,
                                        proporcionando uma visão minuciosa sobre os produtos atualmente em nosso estoque.
                                        Priorizando a oferta de baterias de excelência em qualidade e desempenho,
                                        seu propósito é fornecer uma compreensão completa dos diversos modelos disponíveis, seus preços,
                                        quantidades em estoque e outras especificações pertinentes.
                                    </Text>
                                </View>
                                {/* Informações do usuário solicitante */}
                                <View style={styles.divisor}>
                                    <Text>Usuário Solicitante</Text>
                                </View>
                                <View style={styles.userInfo}>
                                    <Text><Text style={styles.boldText}>Nome: </Text> {user.name}</Text>
                                    <Text><Text style={styles.boldText}>CPF: </Text> {user.document}</Text>
                                    <Text><Text style={styles.boldText}>Email: </Text> {user.email}</Text>
                                </View>
                            </View>
                        )}
                        {/* Parte da tabela */}
                        {type === 'battery' ? (
                            <TableBattery data={chunk} />
                        ) : type === 'promotion' ? (
                            <TablePromotion data={chunk}/>
                        ) : type === 'user' ? (
                            <TableUser data={chunk}/>
                        ) : null}

                        {/* Rodapé da página */}
                        <View style={styles.pageCounter}>
                            <Text>{date}</Text>
                            <Text render={({ pageNumber, totalPages }) => (
                                `${pageNumber} / ${totalPages}`
                            )} fixed />
                        </View>
                    </View>
                </Page>
            ))}
        </Document>
    );
};







const ReportGenerator = ({ data, userData, type }) => {
    const pdfViewer = (
        <PDFViewer width="100%" height="370em">
            <MyDocument data={data} user={userData} type={type}/>

        </PDFViewer>
    );

    const pdfButtonLink = (
        <PDFDownloadLink className='btn btn-red' document={<MyDocument data={data} user={userData} type={type} />} fileName="relatorio.pdf" style={styles.buttom}>
            {({ blob, url, loading, error }) =>
                loading ? 'Gerando PDF...' : 'Baixar PDF'
            }
        </PDFDownloadLink>
    );

    return { pdfViewer, pdfButtonLink };
};

function ModalPdf({ showsModalPDF, setShowModalPDF, currentItems, type }) {
    const { userData } = useContext(AuthContext);
    const { pdfViewer, pdfButtonLink } = ReportGenerator({ data: currentItems, userData, type });

    return (
        <>
            <Modal size='lg' show={showsModalPDF} onHide={() => setShowModalPDF(false)} backdrop='false' centered>
                <Modal.Header closeButton className='bg-red text-white'>
                    <Modal.Title>
                        Configurar Relatório
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ height: 400 }}>
                    <Row>
                        <Col md={6}>
                            {pdfViewer}
                        </Col>

                        <Col md={6}>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalPDF(false)}>Fechar</Button>
                    {pdfButtonLink}
                </Modal.Footer>
            </Modal>
        </>
    );
}


export default ModalPdf;
