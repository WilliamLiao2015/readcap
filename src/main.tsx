import React from "react"
import ReactDOM from "react-dom/client"
import { MantineProvider } from "@mantine/core"

import App from "./App"

import "@mantine/core/styles.css"
import "./styles.css"


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={{
      breakpoints: {
        sm: "300px",
        md: "800px",
        lg: "1200px"
      }
    }}>
      <App />
    </MantineProvider>
  </React.StrictMode>
)
