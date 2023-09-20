import React from "react";
import { Link } from "react-router-dom";
import { BaseOpenTelemetryComponent } from "@opentelemetry/plugin-react-load";

import { Container, Navbar, Button } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";

class Home extends BaseOpenTelemetryComponent {
  render() {
    return (
      <>
        <Container className="border g-0 g-md-1 pb-5 vh-100">
          <Header />
          <h3 className="header p-3">
            Press the button below to get the Observability!
          </h3>
          <div className="m-3">
            <Link to="/test">
              <Button variant="primary" size="lg">
                Start Tracing
              </Button>
            </Link>
          </div>
        </Container>
        <Footer />
      </>
    );
  }
}

export default Home;
