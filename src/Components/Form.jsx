// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import styles from "./Form.module.css";

import Button from "./Button";
import BackButton from "./BackButton";
import GetUrlLocation from "./GetUrlLocation";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";
import CountryLogo from "./CountryLogo";
import { useCities } from "../contexts/CitiesProvider";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const { lat, lng } = GetUrlLocation();
  const [isloadingGeocode, setloadingGeocode] = useState(false);
  const [geocodeerror, setGeocodeerror] = useState(null);
  const [emoji, setemoji] = useState("");
  const { addcity, isloading } = useCities();

  function getCountryLogo(code) {
    return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`;
  }

  async function handlesubmit(e) {
    e.preventDefault();
    if (!cityName || (!lat && !lng)) return;
    const newcity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };
    await addcity(newcity);
    navigate("/app");
  }

  useEffect(() => {
    async function getGeoCode() {
      if (!lat && !lng) return;
      try {
        setloadingGeocode(true);
        setGeocodeerror(null);
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        console.log(data);
        if (!data.countryCode) {
          throw new Error("click somehwere else");
        }
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setemoji(getCountryLogo(data.countryCode));
      } catch (err) {
        setGeocodeerror(err.message);
      } finally {
        setloadingGeocode(false);
      }
    }
    getGeoCode();
  }, [lat, lng]);

  if (isloadingGeocode) return <Spinner />;
  if (geocodeerror)
    return (
      <Message
        message={"That does not seem like a city please clikc somewhere else"}
      />
    );
  if (!lat && !lng)
    return <Message message={"Get started by clicking on the map."} />;
  return (
    <form
      className={`${styles.form} ${isloading ? styles.loading : ""}`}
      onSubmit={handlesubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {/* <span className={styles.flag}>{emoji}</span> */}
        <span className={styles.flag}>
          <CountryLogo emoji={emoji} />
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          onChange={(curdate) => setDate(curdate)}
          selected={date}
          dateFormat={"dd/MM/yyyy"}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary" onClick={(e) => handlesubmit(e)}>
          Add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
