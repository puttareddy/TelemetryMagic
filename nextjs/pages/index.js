import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Navbar } from "../components/navbar";
import opentelemetry from "@opentelemetry/api";
import React, { Component } from "react";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const tracer = opentelemetry.trace
      .getTracer(process.env.NEXT_PUBLIC_OPENTELEMETRY_SERVICE_NAME)
      .startSpan("<next-js>");

    fetch("http://localhost:8081/run_test")
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        tracer.end();
      })
      .catch(e => console.log(e))
  }

  render() {
    return (
      <>
        <Navbar />
        <div className="flex flex-col h-screen">
          <main className="flex-1 overflow-y-auto p-5">
            <Head>
              <title>How to use openTelemetry in Next Js</title>
              <meta
                name="description"
                content="Telus reference to create a trace in Next Js"
              />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <button
              onClick={this.handleSubmit}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Start a trace
            </button>
          </main>
          <footer className="py-5 bg-purple-700 text-center text-white">
            <a
              href="https://github.com/telus/observability-demo"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by <span className={styles.logo}>Agora</span>
            </a>
          </footer>
        </div>
      </>
    );
  }
}
