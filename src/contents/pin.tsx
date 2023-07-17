import type {
  PlasmoContentScript,
  PlasmoGetInlineAnchorList,
  PlasmoRender
} from "plasmo"
import { createRoot } from "react-dom/client"
import { compress } from "shrink-string"

import { useStorage } from "@plasmohq/storage/hook"

import PinIcon from "~common/pin"

import "~styles.css"

import { useCallback, useEffect, useState } from "react"

import LogoIcon from "~common/logo"
import { getChatConfig, i18n } from "~utils/functions"
import type { AutosaveStatus, PopupEnum } from "~utils/types"

export const config: PlasmoContentScript = {
  matches: ["https://bard.google.com/*"]
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () =>
  document.querySelectorAll(".logo-gutter > .logo")

export const render: PlasmoRender = async ({
  anchor, // the observed anchor, OR document.body.
  createRootContainer // This creates the default root container
}) => {
  // @ts-ignore
  const rootContainer = await createRootContainer(anchor)

  const root = createRoot(rootContainer)
  // Will investigate if there is a better way to do this because this is terrible
  const parent =
    anchor?.element?.parentElement?.parentElement?.parentElement?.parentElement
      ?.parentElement?.parentElement
  parent?.classList.add("pin")
  root.render(
    <>
      <Content
        // @ts-ignore
        parent={parent}
      />
    </>
  )
}

const Content = ({ parent }: Props) => {
  const [toBeSaved, setToBeSaved] = useStorage("toBeSaved")
  const [showPopup, setShowPopup] = useStorage<PopupEnum | false>(
    "showPopup",
    false
  )
  const [authenticated] = useStorage("authenticated", false)
  const [isPremium] = useStorage("isPremium", false)
  const [activeTrial] = useStorage("activeTrial", false)
  const [chatID] = useStorage("chatID", "")
  const [status] = useStorage<AutosaveStatus>("autosaveStatus", "generating")

  const [autosaveEnabled, setAutosave] = useState(false)
  const [isLastMessage, setIsLastMessage] = useState(false)

  useEffect(() => {
    if (!(isPremium || activeTrial) || !chatID) return
    const checkAutosave = async () => {
      const config = await getChatConfig(chatID)
      if (!config) return
      setAutosave(config.enabled)
    }
    checkAutosave()

    setIsLastMessage(
      (() => {
        const pins = document.querySelectorAll(".pin")
        const lastPin = pins[pins.length - 1]
        if (!lastPin) return false
        // Unelegant way to get the node of an element
        const parentNode = parent.firstChild?.parentNode
        if (!parentNode) return false
        return (
          lastPin.firstChild?.parentNode?.isSameNode(
            parent.firstChild?.parentNode
          ) ?? false
        )
      })()
    )
  }, [chatID, status])

  const LastMessageIcon = useCallback(() => {
    switch (status) {
      case "disabled":
        return <LogoIcon />
      case "generating":
        return <LogoIcon loading />
      case "saving":
        return <LogoIcon loading />
      case "error":
        return <LogoIcon error />
      case "saved":
        return <LogoIcon />
    }
  }, [chatID, status])

  const handleClick = async () => {
    if (!authenticated) {
      alert(i18n("errConnect"))
      return
    }
    const answer = await compress(
      // @ts-ignore
      (
        parent.querySelector(".markdown") ??
        parent.querySelector(".dark.text-orange-500")
      ).innerHTML
    )
    const prompt = await compress(
      // @ts-ignore
      parent.previousElementSibling.querySelector(".whitespace-pre-wrap")
        .textContent
    )
    const title = document.querySelector(
      ".conversation.selected > .conversation-title"
    )
    const url = window.location.href

    await setToBeSaved({
      answer,
      prompt,
      title,
      url
    })

    await setShowPopup("save")
  }

  if (autosaveEnabled)
    return (
      <button
        className="pin"
        onClick={
          isLastMessage && status === "error"
            ? () => setShowPopup("error")
            : status === "saved"
            ? handleClick
            : undefined
        }
        style={{
          display: "flex",
          justifyContent: "center",
          background: "transparent",
          border: "none",
          marginTop: 10,
          width: 30,
          cursor: status !== "generating" ? "pointer" : "default"
        }}>
        {isLastMessage ? <LastMessageIcon /> : <LogoIcon />}
      </button>
    )

  return (
    <button
      onClick={handleClick}
      className="text-gray-800 dark:text-gray-100 pin"
      style={{
        background: "transparent",
        border: "none",
        marginTop: 10,
        padding: 4,
        borderRadius: 4,
        width: 30,
        cursor: "pointer"
      }}>
      <PinIcon />
    </button>
  )
}

export default Content

type Props = {
  parent: Element
}
