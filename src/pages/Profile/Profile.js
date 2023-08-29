import { Link } from "react-router-dom";

import styles from './Profile.module.css';

import { IoMdArrowRoundBack } from 'react-icons/io'

const handleSubmit = () => {
  
}

const Profile = () => {

  document.title = "Meu Perfil";

  return (
    <div className={styles.profileContainer}>
      <nav>
        <div>
          <Link to="/"><img src="/logo.svg" alt="Home"/></Link>
          <Link className={styles.buttonBackToHome} to="/"><IoMdArrowRoundBack /> <span>Voltar</span></Link>
        </div>
      </nav>
      <form onSubmit={handleSubmit}></form>
    </div>
  )
}

export default Profile