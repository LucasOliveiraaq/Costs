import styles from './Container.module.css';

function Container(props) {
  return (
    <div className={`${styles.container} ${props.customClass ? styles[props.customClass] : ''}`}>
      {props.children}
    </div>
  );
}

export default Container;
