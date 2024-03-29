import { Link } from 'react-router-dom';

function LoginSignupButton({ classNameBtnLogin, classNameBtnSignUp }) {
  return (
    <>
      <Link to="/entrar" className={`btn ${classNameBtnLogin}`}>
        Entrar
      </Link>
      <Link to="/cadastrar" className={`btn ${classNameBtnSignUp}`}>
        Cadastrar-se
      </Link>
    </>
  );
}

export default LoginSignupButton;