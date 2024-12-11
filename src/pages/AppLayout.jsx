import Sidebar from "../Components/Sidebar";
import styles from "../pages/AppLayout.module.css";
import Map from "../Components/Map";
import User from "../Components/User";
function Applayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      <User />
    </div>
  );
}

export default Applayout;
