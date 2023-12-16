import { useRecoilState } from "recoil"
import { AppShell, Burger, Group, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"

import { appStateAtom } from "../App"


export default function Header() {
  const matched = useMediaQuery("(max-width: 300px)")
  const [appState, setAppState] = useRecoilState<IAppState>(appStateAtom)
  const { isNavbarOpen } = appState

  return (
    <AppShell.Header bg="#776D5B" zIndex={100}>
      <Group h="100%" px="md">
        <Burger opened={isNavbarOpen} onClick={() => setAppState(prev => ({ ...prev, isNavbarOpen: !isNavbarOpen }))} hiddenFrom="lg" size="md" color="white" />
        <Title order={1} c="white" hidden={matched}>ReadBase</Title>
      </Group>
    </AppShell.Header>
  )
}
