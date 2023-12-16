import { useEffect } from "react"
import { atom, useRecoilState } from "recoil"
import { AppShell } from "@mantine/core"
import { Readability } from "@mozilla/readability"

import { BASE_URL, SERVER_PORT } from "./constants"
import { getAllPages, updatePage } from "./utils"

import Header from "./components/Header"
import Navbar from "./components/Navbar"
import Main from "./components/Main"


export const appStateAtom = atom<IAppState>({
  key: "appStateAtom",
  default: {
    isUpdated: false,
    isNavbarOpen: false,
    currentLink: null,
    currentPage: null,
    pages: []
  }
})


export default function App() {
  const [appState, setAppState] = useRecoilState<IAppState>(appStateAtom)
  const { isUpdated, isNavbarOpen, currentLink, pages } = appState

  useEffect(() => {
    async function fetchPages() {
      const pages = await getAllPages()
      setAppState(previous => ({ ...previous, isUpdated: true, pages }))
    }
    fetchPages()
  }, [])

  useEffect(() => {
    if (!currentLink || pages.map(p => p.link).includes(currentLink)) return
    async function fetchLink() {
      const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/get/links/${encodeURIComponent(currentLink!)}`)
      if (!response.ok) return
      const htmlString = await response.text()
      const doc = new DOMParser().parseFromString(htmlString, "text/html")
      for (const img of doc.querySelectorAll("img")) {
        if (!img.src.startsWith(BASE_URL)) continue
        img.src = img.src.replace(BASE_URL, currentLink!.match(/^(https?:\/\/[^/]+\/)/)![0])
      }
      const article = new Readability(doc).parse()!
      const now = Date.now()
      const page = {
        site: article.siteName,
        lang: article.lang,
        link: currentLink,
        tags: [],
        index: pages.length,
        title: article.title,
        notes: [],
        length: article.length,
        byline: article.byline,
        excerpt: article.excerpt,
        content: article.content,
        createAt: now,
        lastView: now
      } as IPage
      setAppState(previous => ({
        ...previous,
        isUpdated: false,
        currentLink: null,
        currentPage: page,
        pages: [...previous.pages, page]
      }))
      updatePage(page)
    }
    fetchLink()
  }, [currentLink])

  useEffect(() => {
    if (isUpdated) return
    for (const page of pages) updatePage(page)
    setAppState(previous => ({
      ...previous,
      isUpdated: true
    }))
  }, [isUpdated, pages])

  return (
    <AppShell header={{ height: 60 }} navbar={{
      width: 300,
      breakpoint: "lg",
      collapsed: { mobile: !isNavbarOpen }
    }} padding="md" withBorder={false}>
      <Header />
      <Navbar />
      <Main />
    </AppShell>
  )
}
