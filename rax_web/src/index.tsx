import * as ReactDOM from "react-dom/client";
import App from "./app";

const container = document.getElementById("root") as Element;
const root = ReactDOM.createRoot(container);
root.render(<App />);
