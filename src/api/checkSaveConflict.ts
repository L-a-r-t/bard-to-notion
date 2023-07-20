import type {
  PageObjectResponse,
  PartialPageObjectResponse
} from "@notionhq/client/build/src/api-endpoints"
import { Storage } from "@plasmohq/storage"

import getNotion from "~config/notion"
import { generateTag } from "~utils/functions/notion"
import type { StoredDatabase } from "~utils/types"

/**
 * Verifies that there isn't already a page with the same title AND tag in the database
 */
export const checkSaveConflict = async ({
  title,
  database
}: CheckConflictParams) => {
  try {
    if (title === "") throw new Error("Title can't be empty")

    const storage = new Storage()
    const savesLeft = await storage.get<number>("savesLeft")
    const isPremium = await storage.get<boolean>("isPremium")

    if (!isPremium && savesLeft === 0) throw new Error("No saves left today")

    const notion = await getNotion()
    const { propertiesIds, tags, tagPropertyIndex, tagIndex } = database
    const tag = generateTag(tags[tagPropertyIndex], tagIndex)

    const tagType = tags[tagPropertyIndex].type
    const hasOptions = tags[tagPropertyIndex].options.length > 0

    const searchRes = await notion.databases.query({
      database_id: database.id,
      filter:
        tag && hasOptions
          ? {
              and: [
                {
                  property: propertiesIds.title,
                  title: {
                    equals: title
                  }
                },
                tagType === "select"
                  ? {
                      property: tags[tagPropertyIndex].id,
                      select: {
                        equals: tags[tagPropertyIndex].options[tagIndex].name
                      }
                    }
                  : {
                      property: tags[tagPropertyIndex].id,
                      multi_select: {
                        contains: tags[tagPropertyIndex].options[tagIndex].name
                      }
                    }
              ]
            }
          : {
              property: propertiesIds.title,
              title: {
                equals: title
              }
            }
    })

    const conflict = searchRes.results.length > 0

    return {
      conflict,
      conflictingPageId: searchRes.results[0]?.id as string | undefined
    }
  } catch (err) {
    console.error(err)
    throw err
  }
}

type CheckConflictParams = {
  title: string
  database: StoredDatabase
}
