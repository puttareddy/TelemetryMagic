import React, { Component } from "react";
import { BaseOpenTelemetryComponent } from "@opentelemetry/plugin-react-load";
import { Container, Navbar, Button } from "react-bootstrap";
// import opentelemetry from "@opentelemetry/api";
import Header from "./components/Header";
import Footer from "./components/Footer";

class Content extends BaseOpenTelemetryComponent {
  // class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      isLoading: false,
    };
  }

  componentDidMount() {}

  buttonHandler() {
    this.setState({ isLoading: true });
    const randomDelay = Math.random() * 10000;
    fetchAPI().then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
        results: randomDelay + result,
      });
    });
  }

  // buttonHandler(e) {
  //   this.setState({ isLoading: true });
  //   const randomDelay = Math.random() * 10000;
  //   const tracer = opentelemetry.trace
  //     .getTracer("react-client-side")
  //     .startSpan("react-client-side");

  //   fetchAPI().then((result) => {
  //     console.log(result);
  //     tracer.end();
  //     this.setState({
  //       isLoading: false,
  //       results: randomDelay + result,
  //     });
  //   });
  // }

  renderResults() {
    if (this.state.isLoading) {
      return <div> Loading results...</div>;
    }
    if (!this.state.results) {
      return <div>No Results</div>;
    }
    return <div>Request was delayed {this.state.results} ms</div>;
  }

  render() {
    return (
      <>
        <Container className="border g-0 g-md-1 pb-5 vh-100">
          <Header />
          <Button
            className="m-3"
            onClick={() => this.buttonHandler()}
            variant="primary"
            size="lg"
          >
            Make Request
          </Button>
          <div id="results" className="m-3">
            {this.renderResults()}
          </div>
        </Container>
        <Footer />
      </>
    );
  }
}

function fetchAPI() {
  // param is a highlighted word from the user before it clicked the button
  console.log("================= trigger api=========");
  return fetch("http://localhost:8081/run_test");
}

export default Content;
