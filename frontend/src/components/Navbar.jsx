import { Link } from "react-router-dom";

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#1e293b",
    color: "white",
  },
  logo: {
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default function Navbar() {
  return (
    <div style={styles.nav}>
      <h2 style={styles.logo}>💰 Finance App</h2>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Education</Link>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>

        <a
          href="https://expense1tracker.streamlit.app/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...styles.link,
            background: "#4f46e5",
            padding: "6px 12px",
            borderRadius: "8px",
          }}
        >
          Expense Tracker
        </a>
      </div>
    </div>
  );
}