import "../styles/globals.css";
import setupOpenTelemetry from "./utils/opentelemetry";
function MyApp({ Component, pageProps }) {
  setupOpenTelemetry(process.env.NEXT_PUBLIC_OPENTELEMETRY_SERVICE_NAME);
  return <Component {...pageProps} />;
}

export default MyApp;
