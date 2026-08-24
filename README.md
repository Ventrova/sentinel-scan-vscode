# Sentinel Scan: MCP Config Auditor

Free static security audit for `mcp.json` / `claude_desktop_config.json`, right
in the editor. Every time you save one of these files, the extension runs
[Sentinel Scan](https://github.com/Ventrova/sentinel-scan-cli)'s OWASP-mapped
MCP heuristics against it and surfaces findings as inline diagnostics in the
Problems panel and as red/yellow squiggles in the file.

No network calls, no telemetry, no server round-trip — the scan is a pure,
static analysis of the JSON you already have open.

## What it catches

12+ heuristics mapped to the [OWASP MCP Top 10](https://mcp-top10.owasp.org/),
including:

- Prompt injection hidden in tool descriptions or JSON schema strings
- Hidden/invisible Unicode instructions and homoglyph typosquatting of tool names
- Tool name shadowing / poisoning
- Excessive-agency schemas (free-form `command`/`exec`/`eval` parameters)
- Missing human-in-the-loop confirmation on sensitive tools
- Hardcoded credentials in server env blocks
- Unpinned/unversioned remote package sources
- Overbroad OAuth-style wildcard scopes
- Cross-origin data exfiltration and DoS/resource-exhaustion patterns

Each finding includes the OWASP category, a confidence score, and a concrete
recommendation, matching the output of the [`sentinel-scan mcp`
CLI](https://github.com/Ventrova/sentinel-scan-cli) and its GitHub Action.

## Usage

Just open or save a file named `mcp.json`, `.mcp.json`,
`claude_desktop_config.json`, or `claude-desktop-config.json`. Findings show
up in the Problems panel (`Ctrl+Shift+M` / `Cmd+Shift+M`) and inline in the
editor.

You can also run **Sentinel Scan: Scan Active MCP Manifest** from the command
palette to force a re-scan without saving.

## How it works

This extension vendors the same detection engine used by
[`sentinel-scan-cli`](https://github.com/Ventrova/sentinel-scan-cli) (the
`scanMcpManifest` heuristics) so findings are identical to what you'd get
running the CLI or the GitHub Action — same rule IDs, same severities, same
OWASP mapping. No detection logic is duplicated or reimplemented; this is a
thin editor front-end over the existing engine.

## Privacy

100% local. Your manifest never leaves your machine — there is no network
call anywhere in this extension.

## Feedback / issues

https://github.com/Ventrova/sentinel-scan-vscode/issues
