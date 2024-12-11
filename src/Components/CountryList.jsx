import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCities } from "../contexts/CitiesProvider";

function CountryList() {
  const { cities, isloading } = useCities();
  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);

  console.log(countries);

  if (isloading) return <Spinner />;
  else if (!cities.length)
    return <Message message={"Get started by adding some of the countries"} />;
  else
    return (
      <ul className={styles.countryList}>
        {countries.map((country, i) => (
          <CountryItem country={country} key={i} />
        ))}
      </ul>
    );
}

export default CountryList;
