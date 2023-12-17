import { useEffect } from "react"
import { useRecoilState } from "recoil"
import { AppShell, ScrollArea, Stack } from "@mantine/core"
import { useListState } from "@mantine/hooks"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"

import { appStateAtom } from "../App"
import LinkInput from "./LinkInput"
import PageItem from "./PageItem"


export default function Navbar() {
  const [appState, setAppState] = useRecoilState<IAppState>(appStateAtom)
  const { pages } = appState
  const [pageList, handlers] = useListState<IPage>(pages)

  useEffect(() => {
    if (pages.length === pageList.length) return
    handlers.setState(pages)
  }, [pages])

  useEffect(() => {
    if (pageList.length !== pageList.length) return
    setAppState(previous => ({
      ...previous,
      isUpdated: false,
      pages: pageList.map((page, index) => ({ ...page, index }))
    }))
  }, [pageList])

  return (
    <AppShell.Navbar p={0} maw={300} zIndex={50}>
      <Stack gap={0} p={10} h="100%" bg="#EBE3D5">
        <LinkInput />
        <ScrollArea h="100%">
          <DragDropContext onDragEnd={({ destination, source }) => {
            handlers.reorder({ from: source.index, to: destination?.index || 0 })
          }}>
            <Droppable droppableId="dnd-pages" direction="vertical">
              {({ innerRef, droppableProps, placeholder }) => (
                <div ref={innerRef} {...droppableProps}>
                  {pageList.map((page, index) => (
                    <Draggable key={page.link} draggableId={page.link} index={index}>
                      {({ innerRef, draggableProps, dragHandleProps }, { isDragging }) => (
                        <div ref={innerRef} {...draggableProps} {...dragHandleProps} style={{
                          ...draggableProps.style,
                          display: "flex",
                          flex: 1,
                          alignItems: "center",
                          paddingLeft: 20,
                          maxWidth: "100%",
                          height: 40,
                          borderRadius: 10,
                          boxShadow: isDragging ? "var(--mantine-shadow-sm)" : "none",
                          backgroundColor: isDragging ? "#F3EEEA" : "transparent",
                          cursor: "grab",
                          userSelect: "none"
                        }}>
                          <PageItem page={page} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ScrollArea>
      </Stack>
    </AppShell.Navbar>
  )
}
