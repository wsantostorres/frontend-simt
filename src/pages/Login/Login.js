import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

import styles from './Login.module.css';

import { BiSolidShow } from 'react-icons/bi';
import { IoLockClosedSharp } from 'react-icons/io5';

import Loading from '../../components/Loading';

const Login = () => {

  // page title
  document.title = "Login - SIMTIFRN: Sistema de Iniciação ao Mundo do Trabalho do IFRN"

  const { error: authError, loading, login } = useAuth();

  const [registration, setRegistration] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if(authError){
      setError(authError)
    }

  }, [authError])

  const handleSubmit = (e) => {
    e.preventDefault();
    login(registration, password);
    setRegistration("")
    setPassword("")
  }

  if(loading){
    return <Loading />
  }

  // show password
  const togglePassword = (e) => {
    e.preventDefault();
    if(showPassword){
      document.getElementById("password").setAttribute('type', 'password');
      document.getElementById("buttonShowPassword").style.color = "#353535";
      setShowPassword(false)
    }else{
      document.getElementById("password").setAttribute('type', 'text');
      document.getElementById("buttonShowPassword").style.color = "#127822";
      setShowPassword(true)
    }
  }

  // focus and blur password
  const inputfocus = (e) => {
    let div = e.target.parentNode;
    div.style.borderColor = "#127822";
    div.style.outlineColor = "#127822";
  }

  const inputBlur = (e) => {
    let div = e.target.parentNode;
    div.style.borderColor = "#777";
    div.style.outlineColor  = "transparent";
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginArea}>
        <div>
          <h2><span><IoLockClosedSharp /></span> LOGIN</h2>
          <p>Insira suas informações do SUAP</p>
          <hr />
          <form onSubmit={handleSubmit}>
            <div>
                <input type="text" onChange={(e) => setRegistration(e.target.value) } placeholder="Matrícula: " value={registration} required/>
            </div>
            <div className={styles.passwordField}>
                <input type="password" onChange={(e) => setPassword(e.target.value) } placeholder="Senha: " value={password} id="password" onFocus={inputfocus} onBlur={inputBlur} required/>
                <button type="button" onClick={togglePassword} id="buttonShowPassword"><BiSolidShow/></button>
            </div>
            <input type="submit" value="ENTRAR COM O SUAP" />
            {error && (<p className="alert alert-danger p-2 m-0 mt-3 text-center">{error}</p>)}
          </form>
        </div>
      </div>
      <div className={styles.copywritingArea}>
        <div>
          <img src="/logo.svg" alt="logo simtifrn"/>
          <h1>Tenha sua primeira <br /> experiência <span>profissional</span></h1>
          <h4>Dica: Mantenha suas informações <br /> sempre atualizadas</h4>
        </div>
      </div>

    </div>
  )
}

export default Login;