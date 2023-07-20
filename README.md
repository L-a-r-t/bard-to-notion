# Bard to Notion

[Bard to Notion](https://chrome.google.com/webstore/detail/bard-to-notion/ffadhlbjlcekgagbbddhnnjfmlckhimc) brings the cleverness of Bard into your favorite app!

This is an extension for Google Bard that is built upon the source code of my other project [ChatGPT to Notion](https://github.com/L-a-r-t/chatgpt-to-notion). This is still WIP and a first version should be available by monday.

## Overview

For information about the extension itself more than the code behind it, check out [this notion page](https://theo-lartigau.notion.site/Bard-to-Notion-f0dfe63e7dee485e8d2d7aa5a1102388?pvs=4) or the [FAQ](https://theo-lartigau.notion.site/FAQ-214e7413e07e4887aa84339b64c17296?pvs=4). This extension was built using the [Plasmo framework](https://www.plasmo.com/) and Typescript. A simple Express server (hosted on a free Render webservice) that can be found on the "server" branch, it allows the secure long-term storage of Notion's access tokens.

## Usage

On Bard's page, you'll notice a new pin icon under each of its answers. You can use it to save specifically that answer and the related prompt to your Notion database of choice. If you want to save the whole discussion, you can do so from the extension popup.

You may link as many databases with the extension as you need to, and you can then choose which database to save your discussion at saving time. If a page with the same title already exists in the database, you'll have the choice between overriding the existing page or appending to the end of it.

### Websites access

Please refer to the [FAQ](https://theo-lartigau.notion.site/FAQ-214e7413e07e4887aa84339b64c17296?pvs=4) for more info about the websites the extensions needs to access.

## Contribution

Feel free to make suggestions & report issues. You may also use the code inside your own projects, I will be educating myself on licences to pick to most relevant for this project.

## Roadmap

These are the things that I plan to work on at some point. I hope to have the following (ranked by priority) done in the near future:

- [ ] Autosave
- [ ] KaTeX support
