import illustration from "data-base64:../../assets/illustration.png"

import { useStorage } from "@plasmohq/storage/hook"

import type { PopupEnum, StoredDatabase, ToBeSaved } from "~utils/types"

import IndexPopup from "./IndexPopup"
import SavePopup from "./SavePopup"

import "~styles.css"

import { useEffect } from "react"

import { i18n } from "~utils/functions"

import AboutPopup from "./AboutPopup"
import DatabaseSettingsPopup from "./DatabaseSettings"
import PremiumPopup from "./PremiumPopup"
import SettingsPopup from "./SettingsPopup"
import WrongPagePopup from "./WrongPagePopup"

export default function Wrapper() {
  const [databases] = useStorage<StoredDatabase[]>("databases", [])
  const [popup, setPopup] = useStorage<PopupEnum>("popup", "wrongpage")
  const [token] = useStorage({ key: "token", area: "session" })
  const [workspace_id] = useStorage("workspace_id")

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (!token && !workspace_id)
      timeout = setTimeout(() => {
        chrome.tabs.create({
          url: "https://api.notion.com/v1/oauth/authorize?client_id=1f370183-ed8e-4221-8ed5-70d48e682069&response_type=code&owner=user&redirect_uri=https%3A%2F%2Ftheo-lartigau.notion.site%2FBard-to-Notion-f0dfe63e7dee485e8d2d7aa5a1102388"
        })
      }, 100)
    return () => clearTimeout(timeout)
  }, [token, workspace_id])

  useEffect(() => {
    const handleCurrentTab = async () => {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })
      if (!tabs[0].url?.match(/^(https:\/\/bard.google.com).*/)) {
        if (!popup || popup === "index" || popup === "save")
          await setPopup("wrongpage")
      } else if (popup === "wrongpage") {
        await setPopup("index")
      }
    }
    handleCurrentTab()
  }, [popup])

  const showPopup = async (popup: "settings" | "about" | "index") => {
    await setPopup(popup)
  }

  const popups = {
    index: <IndexPopup />,
    save: <SavePopup />,
    settings: <SettingsPopup />,
    dbsettings: <DatabaseSettingsPopup />,
    about: <AboutPopup />,
    wrongpage: <WrongPagePopup />,
    premium: <PremiumPopup />
  }

  const nav = {
    index: i18n("nav_home"),
    settings: i18n("nav_settings"),
    about: i18n("nav_about")
  }

  if (databases.length == 0) {
    return (
      <div className="flex flex-col p-3 w-64 text-base">
        <img src={illustration} alt="Bard to Notion" />
        <SettingsPopup />
      </div>
    )
  }

  return (
    <div className="flex flex-col p-3 w-64 text-base">
      <img src={illustration} alt="Bard to Notion" />
      {popup !== "wrongpage" && (
        <div className="grid grid-cols-3 mb-1">
          {Object.keys(nav).map((key) => (
            <button
              key={key}
              className={`button-small-outline ${
                popup === key ? "font-bold" : ""
              } border-none w-full`}
              onClick={() => showPopup(key as "settings" | "about" | "index")}>
              {nav[key]}
            </button>
          ))}
        </div>
      )}
      {popups[popup]}
    </div>
  )
}
