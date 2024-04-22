import NavbarComponent from "../../components/layout/navbar/Navbar";
import { Form, Container, Row, Col } from "react-bootstrap";
import { UserIcon, DolarIcon } from "../../assets/icons/IconsSet";
import FormGroupWithIcon from "../../components/common/FormGroupWithIcon";
import { AuthContext } from "../../context/AuthProvider";
import { useContext } from "react";


function MyAccont() {
    const { isLoggedIn, userData, isContextLoaded } = useContext(AuthContext);



    const formUserContent = () => (
        <Form>
            <Form.Label>Nome completo</Form.Label>
            <FormGroupWithIcon
                icon={<DolarIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                type='text'
                placeholder=''
                value={userData.name}
                mb={'mb-4'}
            />

            <Form.Label>Email</Form.Label>
            <FormGroupWithIcon
                icon={<DolarIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                type='text'
                placeholder=''
                value={userData.email}
                mb={'mb-4'}
            />

            <Form.Label>CPF</Form.Label>
            <FormGroupWithIcon
                icon={<DolarIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                type='text'
                placeholder=''
                value={userData.document}
                mb={'mb-4'}
            />

        </Form>
    )

    return (
        <div className="vh-100 bg-main">
            <NavbarComponent setNavbarContent={false} />

            <Container>
                <Row>
                    <Col md={4}></Col>
                    <Col md={8}>
                    {formUserContent()}
                    </Col>
                </Row>
            </Container>
          


        </div>
    );

}

export default MyAccont;