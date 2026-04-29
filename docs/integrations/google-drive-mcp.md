# Google Drive MCP

Shared Drive integration for Calqo agents and team. OAuth runs once via the
claude.ai connector against `deblock.bart@gmail.com`; any agent with the
Google Drive MCP enabled inherits that connection — no per-agent credentials.

## Folder structure

Lives under My Drive → `Calqo/`:

| Folder            | ID                                          | Owner    |
| ----------------- | ------------------------------------------- | -------- |
| Calqo (root)      | `1qxm4IAnBA7XzuIsjYKzpDIrIEVLLjRMO`         | CTO      |
| Content           | `11zCr7akzCEXKTIS3cq59k2jX4BaoYe_y`         | Luna, Spark — copy, briefs, content calendars |
| Strategy          | `1w_j_wOVpW_lXX_cfwGfxDPhQzc2OLG6z`         | CMO — quarterly plans, OKRs |
| Knowledge Base    | `1LJUgZg8LV4qw42yNPGXAPDgYr_R59KPf`         | Cross-team SOPs, playbooks |

Pre-existing `Backlink Tracking — interesten.be` (`11b9jsAVbVpbqjukwI4i6gpGIO0Hc0SnT`)
lives outside `Calqo/` — left in place to avoid breaking the CAL-160 weekly SOP.
New per-site folders go under `Calqo/` from now on.

## Naming

Prefix every file with the site slug — `airfryertijden — Q2 content plan`,
`interesten.be — Backlink SOP`. Portfolio-wide files: prefix `Calqo —`.

## MCP tools (verified 2026-04-29)

| Tool                | Use case |
| ------------------- | -------- |
| `list_recent_files` | Inbox-style scan of what's new across the portfolio. |
| `search_files`      | Find by `title contains 'foo'` or `fullText contains 'foo'`. `mimeType` filters narrow results. The `parents` field is **not** supported by this MCP wrapper — use title/fullText. |
| `read_file_content` | Pull plain-text from Doc/Sheet/PDF. Formatting (underscores, line spacing) does not survive — don't parse the output as code. |
| `get_file_metadata` | Lightweight check (`parentId`, `mimeType`, `modifiedTime`) without loading content. |
| `create_file`       | Create doc/sheet/folder. `text/plain` auto-converts → Google Doc; `text/csv` → Sheet. Set `parentId` to nest. `content` must be base64. |

## Live guide

Full conventions, patterns and folder IDs are mirrored in the Drive doc
[Calqo — Google Drive Workflow Guide](https://docs.google.com/document/d/1vILVFEtNFCV0_T9p2eGuck26ACvvc8gYEc_sAM2NAdU/edit)
(`1vILVFEtNFCV0_T9p2eGuck26ACvvc8gYEc_sAM2NAdU`, in Knowledge Base).

Source: CAL-219 (parent CAL-207).
