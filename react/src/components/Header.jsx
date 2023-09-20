import React from "react";
import { Container, Navbar } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar bg="dark">
      <Container>
        <Navbar.Brand href="#home" className="light">
          <p className="text-white fs-2 ms-3">React Observability</p>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;
