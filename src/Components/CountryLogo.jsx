import styles from "./CountryLogo.module.css";
function CountryLogo({ emoji }) {
  return <img src={emoji} className={styles.logo} />;
}

export default CountryLogo;
