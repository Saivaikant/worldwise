import { Link, NavLink } from "react-router-dom";
import styles from "../Components/PageNav.module.css";
import Logo from "../Components/Logo";

function PageNav() {
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/login" className={styles.ctaLink}>
            Login{" "}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
