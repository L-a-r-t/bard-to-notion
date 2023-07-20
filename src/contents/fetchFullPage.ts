import type { PlasmoContentScript } from "plasmo"

export const config: PlasmoContentScript = {
  matches: ["https://bard.google.com/*"]
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "bard-to-notion_fetchFullChat")
    sendResponse(fetchFullChat())
  else if (message.type === "bard-to-notion_fetchTitle")
    sendResponse(fetchTitle())
})

const fetchFullChat = () => {
  const matches = document.querySelectorAll(".conversation-container")
  const chat = Array.from(matches)

  const prompts = chat.map(
    (el) => el.querySelector(".query-text")?.textContent
  )
  const answers = chat.map(
    (el) =>
      (
        el.querySelector(".response-content > .model-response-text > .markdown") ??
        el.querySelector(".dark.text-orange-500")
      )?.innerHTML
  )

  const url = window.location.href
  let title = document.querySelector(
    ".conversation.selected > .conversation-title"
  )?.textContent ?? "New Conversation"

  title = title.trim()

  return { prompts, answers, url, title }
}

const fetchTitle = () => {
  let title = document.querySelector(
    ".conversation.selected > .conversation-title"
  )?.textContent ?? "New Conversation"

  title = title.trim()
  
  return title
}
