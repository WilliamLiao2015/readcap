import { SERVER_PORT } from "./constants"


export function validateUrlString(url: string) {
  const u = new URL(url)
  // Make sure the URL is http or https
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Invalid URL protocol check failed")
  }
  // Make sure the domain is not localhost
  if (u.hostname === "localhost" || u.hostname === "0.0.0.0") {
    throw new Error("Invalid URL is localhost")
  }
  // Make sure the domain is not a private IP
  if (/^(10|172\.16|192\.168)\..*/.test(u.hostname)) {
    throw new Error("Invalid URL is private ip")
  }
}


export async function getAllPages() {
  const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/get/pages`)
  const pages = await response.json() as IPage[]
  console.log(pages)
  return pages
}


export async function updatePage(page: IPage) {
  await fetch(`http://127.0.0.1:${SERVER_PORT}/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(page)
  })
}


export async function deletePage(page: IPage) {
  await fetch(`http://127.0.0.1:${SERVER_PORT}/delete/pages/${encodeURIComponent(page.link)}`)
}
