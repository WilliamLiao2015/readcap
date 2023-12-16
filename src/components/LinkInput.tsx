import { useState } from "react"
import { useSetRecoilState } from "recoil"
import { Button, CloseButton, Group, Input } from "@mantine/core"

import { validateUrlString } from "../utils"

import { appStateAtom } from "../App"


export default function LinkInput() {
  const setAppState = useSetRecoilState(appStateAtom)

  const [link, setLink] = useState<string>("")

  return (
    <Group bg="transparent" p={10}>
      <Input value={link} onChange={({ currentTarget }) => setLink(currentTarget.value)} placeholder="Paste a link" radius={5} rightSectionPointerEvents="all" rightSection={
        <CloseButton onClick={() => setLink("")} display={link ? "block" : "none"} />
      } style={{ flex: 1 }} />
      <Button variant="fill" onClick={() => {
        setLink("")
        validateUrlString(link)
        setAppState(previous => ({
          ...previous,
          currentLink: link
        }))
      }}>Add</Button>
    </Group>
  )
}
