import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ApolloProvider from "./ApolloProvider";
import { BrowserRouter as Router } from "react-router-dom";
import 'antd/dist/antd.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ApolloProvider />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
