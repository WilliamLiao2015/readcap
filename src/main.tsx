import React from "react"
import ReactDOM from "react-dom/client"
import { RecoilRoot } from "recoil"
import { MantineProvider } from "@mantine/core"

import App from "./App"

import "@mantine/core/styles.css"
import "./styles.css"


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <MantineProvider theme={{
        breakpoints: {
          sm: "300px",
          md: "800px",
          lg: "1200px"
        }
      }}>
        <App />
      </MantineProvider>
    </RecoilRoot>
  </React.StrictMode>
)
