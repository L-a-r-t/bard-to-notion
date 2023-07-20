import type { PlasmoContentScript } from "plasmo"

import { Storage } from "@plasmohq/storage"

export const config: PlasmoContentScript = {
  matches: [
    "https://theo-lartigau.notion.site/Bard-to-Notion-f0dfe63e7dee485e8d2d7aa5a1102388*"
  ]
}

export const auth = async () => {
  const code = new URLSearchParams(window.location.search).get("code")
  if (!code) return
  await chrome.runtime.sendMessage({
    type: "bard-to-notion_generateToken",
    body: { code }
  })
}

auth()
