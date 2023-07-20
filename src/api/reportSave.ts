import { Storage } from "@plasmohq/storage"

export const reportSave = async (answers: number, isPremium: boolean) => {
  try {
    const storage = new Storage()
    const workspace_id = await storage.get("workspace_id")
    const user_id = await storage.get("user_id")

    const response = await fetch("https://bard-to-notion.onrender.com/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        workspace_id,
        user_id,
        answers,
        isPremium
      })
    })
    const res = await response.json()

    const { savesLeft } = res
    storage.set("savesLeft", savesLeft)

    return res
  } catch (err) {
    console.error(err)
  }
}
