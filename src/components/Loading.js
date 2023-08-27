import styles from './Loading.module.css';

const Loading = () => {
  return (
    <div className={styles.containerLoading}>
        <div className="spinner-border spinner-border-sm text-success" role="status">
            <span className="sr-only"></span>
        </div>
    </div>
  )
}

export default Loading