# Sentinel Scan: MCP Config Auditor

[![Version](https://img.shields.io/visual-studio-marketplace/v/ventrova.sentinel-scan-mcp)](https://marketplace.visualstudio.com/items?itemName=ventrova.sentinel-scan-mcp)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/ventrova.sentinel-scan-mcp)](https://marketplace.visualstudio.com/items?itemName=ventrova.sentinel-scan-mcp)
[![License](https://img.shields.io/github/license/Ventrova/sentinel-scan-vscode)](LICENSE)

Free static security audit for `mcp.json` / `claude_desktop_config.json`, right
in the editor. Every time you save one of these files, the extension runs
[Sentinel Scan](https://github.com/Ventrova/sentinel-scan-cli)'s OWASP-mapped
MCP heuristics against it and surfaces findings as inline diagnostics in the
Problems panel and as red/yellow squiggles in the file.

No network calls, no telemetry, no server round-trip: the scan is a pure,
static analysis of the JSON you already have open.

![Sentinel Scan findings for a malicious mcp.json shown inline and in the Problems panel](demo/sentinel-scan-vscode-demo.png)

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
running the CLI or the GitHub Action: same rule IDs, same severities, same
OWASP mapping. No detection logic is duplicated or reimplemented; this is a
thin editor front-end over the existing engine.

## Privacy

100% local. Your manifest never leaves your machine: there is no network
call anywhere in this extension.

## Also available

- [`sentinel-scan-cli`](https://github.com/Ventrova/sentinel-scan-cli) - same
  engine as a standalone CLI and GitHub Action, for CI pipelines.
- [Authorized LLM red-team audit](https://ventrova.dev/audit) - a human-led
  audit of your live app, for teams that need to go past static heuristics.
- [See a real teardown](https://ventrova.dev/teardown) - a walkthrough of an
  AI support bot leaking a secret it was told to keep.

## Feedback / issues

https://github.com/Ventrova/sentinel-scan-vscode/issues
