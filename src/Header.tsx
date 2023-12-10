import { useSetRecoilState } from "recoil"
import { AppShell, Burger, Group, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

import { appStateAtom } from "./App"


export default function Header() {
  const [opened, { toggle }] = useDisclosure()
  const setAppState = useSetRecoilState<IAppState>(appStateAtom)

  return (
    <AppShell.Header bg="#B0A695">
      <Group h="100%" px="md">
        <Burger opened={opened} onClick={() => {
          setAppState(prev => ({ ...prev, isNavbarOpen: !opened }))
          toggle()
        }} hiddenFrom="sm" size="sm" />
        <Title order={1} c="white">ReadCap</Title>
      </Group>
    </AppShell.Header>
  )
}
