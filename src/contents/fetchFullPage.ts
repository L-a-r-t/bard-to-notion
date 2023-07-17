import type { PlasmoContentScript } from "plasmo"

export const config: PlasmoContentScript = {
  matches: ["https://bard.google.com/*"]
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "chatgpt-to-notion_fetchFullChat")
    sendResponse(fetchFullChat())
})

const fetchFullChat = () => {
  const matches = document.querySelectorAll(".conversation-container")
  const chat = Array.from(matches)

  const rawPrompts = chat.filter((el, index) => index % 2 === 0)
  const rawAnswers = chat.filter((el, index) => index % 2 === 1)

  const prompts = rawPrompts.map(
    (el) => el.querySelector(".query-text")?.textContent
  )
  const answers = rawAnswers.map(
    (el) =>
      (
        el.querySelector(".markdown") ??
        el.querySelector(".dark.text-orange-500")
      )?.innerHTML
  )

  const url = window.location.href
  const title = document.querySelector(
    ".conversation.selected > .conversation-title"
  )

  return { prompts, answers, url, title }
}
