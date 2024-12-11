import styles from "./CountryItem.module.css";
import CountryLogo from "./CountryLogo";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      {/* <span>{country.emoji}</span> */}
      <CountryLogo emoji={country.emoji} />
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
