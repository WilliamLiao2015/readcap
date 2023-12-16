import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RecoilRoot } from "recoil"
import { MantineProvider } from "@mantine/core"
import { ContextMenuProvider } from "mantine-contextmenu"

import App from "./App"

import "@mantine/core/styles.css"
import "mantine-contextmenu/styles.css"

import "./styles.css"


createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <RecoilRoot>
      <MantineProvider theme={{
        breakpoints: {
          xs: "0px",
          sm: "300px",
          md: "600px",
          lg: "900px",
          xl: "1500px"
        }
      }}>
        <ContextMenuProvider>
          <App />
        </ContextMenuProvider>
      </MantineProvider>
    </RecoilRoot>
  </StrictMode>
)
