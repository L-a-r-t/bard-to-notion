import { compress } from "shrink-string"

import { Storage } from "@plasmohq/storage"

import { checkSaveConflict } from "~api/checkSaveConflict"
import { parseSave } from "~api/parseSave"
import { saveChat } from "~api/saveChat"
import type { StoredDatabase } from "~utils/types"
import { reportSave } from "~api/reportSave"

const saveFromContextMenu = async (saveBehavior: "append" | "override") => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  const tabId = tabs[0].id!

  try {
    const res = await chrome.tabs.sendMessage(tabId, "fetchFullChat")
    const { prompts, answers, url, title } = res

    const storage = new Storage()
    const generateHeadings = await storage.get<boolean>("generateHeadings")
    const databases = await storage.get<StoredDatabase[]>("databases")
    const selectedDB = await storage.get<number>("selectedDB")
    const database = databases[selectedDB]

    const { conflictingPageId } = await checkSaveConflict({
      title,
      database
    })
    const req = {
      title,
      prompts: await Promise.all(prompts.map((p) => compress(p))),
      answers: await Promise.all(answers.map((a) => compress(a))),
      url,
      database,
      generateHeadings
    }
    const parsedReq = parseSave(req)
    const saveRes = await saveChat({
      ...parsedReq,
      conflictingPageId,
      generateHeadings,
      saveBehavior
    } as any)

    const isPremium = await storage.get<boolean>("isPremium")
    // we don't wait for a response as we want to give feedback to the user ASAP
    // this failing means more saves for a free user, which is a good thing for them
    reportSave(answers.length, isPremium)

    chrome.tabs.sendMessage(tabId, {
      type: "bard-to-notion_alert",
      body: "Saved successfully to" + database.title + "!"
    })
  } catch (err) {
    console.error(err)
    chrome.tabs.sendMessage(tabId, {
      type: "bard-to-notion_alert",
      body: "Save error: " + err.message
    })
  }
}

export default saveFromContextMenu
