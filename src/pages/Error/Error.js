import styles from './Error.module.css';

const Error = () => {

  document.title = "Error 404!"

  return (
    <div className={styles.errorContainer}>
        <h2>Error 404!</h2>
        <p>Esta página não existe.</p>
    </div>
  )
}

export default Error