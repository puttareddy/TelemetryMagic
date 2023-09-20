import React from "react";
import { Container, Navbar } from "react-bootstrap";

const Footer = () => {
  return (
    <Container className="border-bottom border-start border-end g-0 g-md-1">
      <Navbar className="text-muted">
        <Container>
          <p className="text-secondary ms-3">
            Copyright &copy; {new Date().getFullYear()}; All Rights Reserved.
          </p>
        </Container>
      </Navbar>
    </Container>
  );
};

export default Footer;
