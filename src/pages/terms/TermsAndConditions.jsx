import { Card, Container } from "react-bootstrap";
import { useEffect } from "react";
import './terms.css'

export default function TermsAndConditions() {
    useEffect(() => {
        document.title = "Termos e Condições";
      }, []);
      
    return (
        <>
            <Container className="container-terms py-md-5">
                <Card className="card-terms rounded-4 text-muted">
                    <Card.Header>
                        <Card.Title>
                            <h1 className="text-xl fw-bold text-center p-2 text-dark">Termos e Condições</h1>
                        </Card.Title>
                    </Card.Header>
                    <Card.Body className="p-md-5 ">
                        <div className="mx-md-5 mx-2" style={{ textAlign: "justify" }}>
                            <p>Última modificação: 21 de maio, 2024</p>
                            <p className="fw-bold text-dark">Resumo dos termos e condições</p>
                            <p>
                                A.O.BA | Alavarse Ortega BaseTech é apenas um nome artístico da dupla desenvolvedora,
                                este projeto foi inicialmente desenhado como um trabalho para finalização do curso de
                                Análise e Desenvolvimento de Sistemas e pode conter erros.
                            </p>
                            <p>
                                Para operar na plataforma, todos os usuários devem aceitar os termos e condições, ficando subentendido
                                que ao realizar o seu cadastro, o mesmo concordou com os termos.
                            </p>
                            <p>
                                Cada usuário é responsável pelos seus dados cadastrais e se compromete a mantê-los atualizados. Além disso
                                cada usuário é responsável pelo uso e proteção da sua senha.
                            </p>
                            <p>
                                Com autorização da Baterias Júpiter, a MacDavis Motos se encarrega como parceira, revendedora e distribuidora
                                ficando responsável pela garantia da venda e entrega dos produtos comercializados.
                            </p>
                            <p className="fw-bold text-dark">1 - Termos e Condições</p>
                            <p>
                                Os usuários sem pendências poderão cancelar suas contas.
                            </p>
                            <p>
                                Os usuários menores de 16 anos só poderão utilizar o site com a supervisão de um responsável legal, ficando sobre
                                ele a responsabilidade pelo menor e todas as suas ações.
                            </p>
                            <p>
                                O usuário é responsável por cadastrar dados verdadeiros e mantê-los atualizados. E cada conta é única e pessoal,
                                não podendo ser transferida ou qualquer coisa do tipo.
                            </p>
                            <p>
                                O usuário poderá ter sua conta suspendida sem avisos prévios e sem direito a indenização
                                caso ocorra a quebra de algum termo.
                            </p>
                            <p className="fw-bold text-dark">2 - Privacidade dos Dados</p>
                            <p>
                                A MacDavis Motos faz o uso responsável dos dados, protegendo a privacidade do usuário, e tomando as
                                medidas necessárias para manter essa privacidade. Conforme a LGPD (Lei Geral de Proteção de Dados
                                Nº 13.709, de 14 de Agosto de 2018).
                            </p>
                            <p className="fw-bold text-dark">3 - Jurisdição e Lei Aplicável</p>
                            <p>
                                Conforme o Marco Civil da Internet (Lei Nº 12.965,de 23 de Abril de 2024), o site preza pela constituição
                                brasileira e quais quebras das leis estabelecidas na mesma, terão medidas tomadas.
                            </p>
                            <p className="fw-bold text-dark">4 - Comunicação</p>
                            <p>
                                A MacDavis Motos, ou desenvolvedores do site poderão entrar em contato através do email atualmente cadastrado
                                por quaisquer motivos que se façam necessários.
                            </p>
                            <p>
                                A comunicação para com a empresa deverá ser feita unicamente pelos canais oficiais de comunicação
                                disponibilizados, sendo eles: Pelo aplicativo WhatsApp no número: (44) 99925-1012 ou então pelo email:
                                macdavismotos418@gmail.com
                            </p>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}