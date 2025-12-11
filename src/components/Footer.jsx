function Footer() {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "10px",
        background: "#f8f9fa",
        marginTop: "20px",
        borderTop: "1px solid #ddd",
      }}
    >
      © {new Date().getFullYear()} RPAE | All Rights Reserved
    </footer>
  );
}

export default Footer;
