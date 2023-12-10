import { AppShell, Burger, Center, Flex, Group, Paper, ScrollArea, Stack, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

import LinkSection from "./components/LinkInput"


export default function App() {
  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell header={{ height: 80 }} navbar={{
      width: { sm: 240, md: 300, lg: 360 },
      breakpoint: "sm",
      collapsed: { mobile: !opened }
    }} padding="md" withBorder={false}>
      <AppShell.Header bg="#B0A695">
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={1} c="white">ReadCap</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p={0}>
        <Stack gap={0} h="100%" bg="#EBE3D5">
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
