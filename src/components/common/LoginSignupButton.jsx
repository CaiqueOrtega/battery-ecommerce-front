import { Link } from 'react-router-dom';

function LoginSignupButton({ classNameBtnLogin, classNameBtnSignUp }) {
  return (
    <>
      <Link to="/autenticacao" className={`btn ${classNameBtnLogin}`}>
        Entrar
      </Link>
      <Link to="/autenticacao" className={`btn ${classNameBtnSignUp}`}>
        Cadastrar-se
      </Link>
    </>
  );
}

export default LoginSignupButton;