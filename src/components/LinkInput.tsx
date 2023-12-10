import { Button, CloseButton, Group, Input } from "@mantine/core"
import { useState } from "react"


export default function LinkSection() {
  const [link, setLink] = useState<string>("")

  return (
    <Group bg="transparent">
      <Input value={link} onChange={({ currentTarget }) => setLink(currentTarget.value)} placeholder="Paste a link" radius={5} rightSectionPointerEvents="all" rightSection={
        <CloseButton onClick={() => setLink("")} display={link ? "block" : "none"} />
      } />
      <Button variant="fill">Add</Button>
    </Group>
  )
}
