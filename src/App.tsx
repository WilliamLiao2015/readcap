import { atom, useRecoilValue } from "recoil"
import { AppShell, Center, Flex, Paper, ScrollArea, Stack } from "@mantine/core"

import LinkSection from "./components/LinkInput"
import Header from "./Header"


export const appStateAtom = atom<IAppState>({
  key: "appState",
  default: {
    isNavbarOpen: false
  }
})


export default function App() {
  const appState = useRecoilValue<IAppState>(appStateAtom)
  const { isNavbarOpen } = appState

  return (
    <AppShell header={{ height: 80 }} navbar={{
      width: { sm: 240, md: 300, lg: 360 },
      breakpoint: "sm",
      collapsed: { mobile: !isNavbarOpen }
    }} padding="md" withBorder={false}>
      <Header />
      <AppShell.Navbar p={0}>
        <Stack gap={0} p={20} h="100%" bg="#EBE3D5">
          <Center h={80}>
            <LinkSection />
          </Center>
          <ScrollArea h="100%"></ScrollArea>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main bg="#F3EEEA">
        <ScrollArea h="calc(100vh - 80px)">
          <Flex justify="center">
            <Paper w={{ sm: 400, md: 600, lg: 800 }} mt={80} p="xl" mih="calc(100vh - 160px)" radius={15} shadow="xl" bg="#EBE3D5" withBorder></Paper>
          </Flex>
        </ScrollArea>
      </AppShell.Main>
    </AppShell>
  )
}
