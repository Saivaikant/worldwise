import { Outlet } from "react-router-dom";
import styles from "./CityList.module.css";
import Cityitem from "./Cityitem";
import Message from "./Message";
import Spinner from "./Spinner";
import { useContext } from "react";
import { useCities } from "../contexts/CitiesProvider";
function CityList() {
  const { cities, isloading } = useCities();
  if (isloading) return <Spinner />;
  else if (!cities.length)
    return <Message message={"Get started by adding some of the cities"} />;
  else
    return (
      <>
        <Outlet />
        <ul className={styles.cityList}>
          {cities.map((city) => (
            <Cityitem city={city} key={city.id} />
          ))}
        </ul>
      </>
    );
}

export default CityList;
