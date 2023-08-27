import styles from './Error.module.css';

const Error = () => {
  return (
    <div className={styles.errorContainer}>
        <h2>Error 404!</h2>
        <p>Esta página não existe.</p>
    </div>
  )
}

export default Error