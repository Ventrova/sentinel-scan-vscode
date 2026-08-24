# Changelog

All notable changes to the "Sentinel Scan: MCP Config Auditor" extension are
documented in this file.

## [0.1.0] - 2026-08-24

Initial release.

- Scans `mcp.json`, `.mcp.json`, `claude_desktop_config.json`, and
  `claude-desktop-config.json` on open/save and surfaces findings as inline
  diagnostics in the editor and the Problems panel.
- Adds the **Sentinel Scan: Scan Active MCP Manifest** command for on-demand
  re-scans.
- Vendors the same `scanMcpManifest` detection engine used by
  `sentinel-scan-cli`, covering 12+ OWASP MCP Top 10-mapped heuristics:
  prompt injection in tool descriptions, hidden/invisible Unicode and
  homoglyph typosquatting, tool name shadowing, excessive-agency schemas,
  missing human-in-the-loop confirmation, hardcoded credentials, unpinned
  remote sources, overbroad OAuth scopes, and cross-origin/DoS patterns.
- 100% local: no network calls, no telemetry.
