import { useRecoilState } from "recoil"
import { AppShell, Flex, Overlay, Paper, ScrollArea, Title, TypographyStylesProvider } from "@mantine/core"
import { useElementSize } from "@mantine/hooks"

import { appStateAtom } from "../App"


export default function Main() {
  const [appState, setAppState] = useRecoilState<IAppState>(appStateAtom)
  const { isNavbarOpen, currentPage } = appState
  const { ref, height } = useElementSize()

  return (
    <AppShell.Main ref={ref} bg="#F3EEEA" px={{ xs: 0 }} pl={{ lg: 300 }} pt={60} pb={0}>
      {isNavbarOpen && <Overlay opacity={0.3} onClick={() => setAppState(previous => ({ ...previous, isNavbarOpen: false }))} zIndex={30} />}
      <ScrollArea h={height}>
        <Flex justify="center">
          <Paper w={{ xs: "100%", md: 600, xl: 800 }} mt={{ xs: 20, md: 50 }} p={20} mih={{ xs: height, md: height - 50 }} radius={15} shadow="xl" bg="#EBE3D5" withBorder>
            <Title order={1} p={20}>{currentPage?.title}</Title>
            <TypographyStylesProvider p={20}>
              {currentPage && <div dangerouslySetInnerHTML={{ __html: currentPage.content }} />}
            </TypographyStylesProvider>
          </Paper>
        </Flex>
      </ScrollArea>
    </AppShell.Main>
  )
}
