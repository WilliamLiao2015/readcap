interface IDatabaseItem {
  _id: string
  _rev: string
  type: string
}


interface IPage {
  site: string
  lang: string
  link: string
  tags: string[]
  index: number
  title: string
  notes: string[]
  length: number
  byline: string
  excerpt: string
  content: string
  createAt: number // Unix timestamp
  lastView: number // Unix timestamp
}


interface IAppState {
  isUpdated: boolean
  isNavbarOpen: boolean
  currentLink: string | null
  currentPage: IPage | null
  pages: IPage[]
}
