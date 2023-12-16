import { useSetRecoilState } from "recoil"
import { Group, Popover, Text } from "@mantine/core"
import { useContextMenu } from "mantine-contextmenu"
import { IconBook, IconTrash } from "@tabler/icons-react"

import { deletePage } from "../utils"

import { appStateAtom } from "../App"


interface ILinkItemProps {
  page: IPage
}


export default function PageItem({ page }: ILinkItemProps) {
  const setAppState = useSetRecoilState(appStateAtom)
  const { showContextMenu } = useContextMenu()

  return (
    <Popover width={300} shadow="md" withArrow>
      <Popover.Target>
        <Group w="100%" h="100%" onDoubleClick={() => setAppState(previous => ({ ...previous, isNavbarOpen: false, currentPage: page }))} onContextMenu={showContextMenu([
          {
            key: "view",
            icon: <IconBook />,
            title: "View",
            onClick: () => setAppState(previous => ({ ...previous, isNavbarOpen: false, currentPage: page }))
          },
          {
            key: "delete",
            icon: <IconTrash />,
            title: "Delete",
            onClick: async () => {
              setAppState(previous => ({
                ...previous,
                isUpdated: false,
                currentPage: null,
                pages: previous.pages.filter(p => p.link !== page.link)
              }))
              await deletePage(page)
            }
          }
        ])}>
          <Text maw={240} fw="bold" truncate="end">{page.title}</Text>
        </Group>
      </Popover.Target>
      <Popover.Dropdown>
        <Group>
          <Text>{page.excerpt}</Text>
        </Group>
      </Popover.Dropdown>
    </Popover>
  )
}
