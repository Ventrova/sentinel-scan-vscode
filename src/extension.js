'use strict';

const vscode = require('vscode');
const { scanMcpManifest, mcpSarifLineForTool } = require('../vendor/sentinel-scan.js');

// Filenames this extension treats as MCP tool manifests / MCP client
// configs. Matched case-insensitively against the basename so
// `mcp.json`, `MCP.JSON`, `.mcp.json`, `claude_desktop_config.json` etc.
// are all picked up regardless of how the host names its config file.
const TARGET_BASENAMES = new Set([
  'mcp.json',
  '.mcp.json',
  'claude_desktop_config.json',
  'claude-desktop-config.json',
]);

const SEVERITY_MAP = {
  HIGH: vscode.DiagnosticSeverity.Error,
  MEDIUM: vscode.DiagnosticSeverity.Warning,
  LOW: vscode.DiagnosticSeverity.Information,
};

const SOURCE = 'Sentinel Scan';

function isTargetDocument(document) {
  if (document.languageId !== 'json' && document.languageId !== 'jsonc') return false;
  const basename = document.uri.path.split('/').pop().toLowerCase();
  return TARGET_BASENAMES.has(basename);
}

function findingToDiagnostic(finding, rawText) {
  const line1based = mcpSarifLineForTool(rawText, finding.tool) || 1;
  const line = Math.max(0, line1based - 1);
  const lineText = rawText.split('\n')[line] || '';
  const startCol = lineText.length - lineText.trimStart().length;
  const range = new vscode.Range(line, startCol, line, lineText.length);

  const owaspTag = finding.owasp_mcp_category || finding.owasp_category;
  const message = `[${finding.heuristic}] ${finding.evidence} (${owaspTag}). ${finding.recommendation}`;

  const diagnostic = new vscode.Diagnostic(range, message, SEVERITY_MAP[finding.severity] || vscode.DiagnosticSeverity.Warning);
  diagnostic.source = SOURCE;
  diagnostic.code = finding.heuristic;
  return diagnostic;
}

function scanDocument(document, diagnosticCollection, outputChannel) {
  if (!isTargetDocument(document)) return;

  const rawText = document.getText();
  if (!rawText.trim()) {
    diagnosticCollection.delete(document.uri);
    return;
  }

  let manifest;
  try {
    manifest = JSON.parse(rawText);
  } catch (err) {
    // Invalid JSON: leave syntax errors to the built-in JSON language
    // service, just clear any stale findings from before the edit.
    diagnosticCollection.delete(document.uri);
    return;
  }

  let out;
  try {
    out = scanMcpManifest(manifest);
  } catch (err) {
    outputChannel.appendLine(`sentinel-scan: scan failed for ${document.uri.fsPath}: ${err && err.message}`);
    return;
  }

  const diagnostics = out.results.map((f) => findingToDiagnostic(f, rawText));
  diagnosticCollection.set(document.uri, diagnostics);

  if (out.results.length > 0) {
    outputChannel.appendLine(
      `sentinel-scan: ${document.uri.fsPath} — ${out.results.length} finding(s) ` +
        `(${JSON.stringify(out.summary.findings_by_severity)})`
    );
  }
}

function activate(context) {
  const diagnosticCollection = vscode.languages.createDiagnosticCollection('sentinel-scan');
  const outputChannel = vscode.window.createOutputChannel('Sentinel Scan');
  context.subscriptions.push(diagnosticCollection, outputChannel);

  const rescan = (document) => scanDocument(document, diagnosticCollection, outputChannel);

  // Scan on open and on save (not on every keystroke - static heuristics
  // over a full manifest are cheap, but re-scanning a partially-typed JSON
  // document on every change would just thrash on parse errors).
  context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(rescan));
  context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(rescan));
  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((document) => diagnosticCollection.delete(document.uri))
  );

  vscode.workspace.textDocuments.forEach(rescan);

  context.subscriptions.push(
    vscode.commands.registerCommand('sentinel-scan.scanActiveFile', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage('Sentinel Scan: no active editor.');
        return;
      }
      if (!isTargetDocument(editor.document)) {
        vscode.window.showInformationMessage(
          'Sentinel Scan: this file is not a recognized MCP manifest (mcp.json, claude_desktop_config.json).'
        );
        return;
      }
      rescan(editor.document);
      vscode.window.showInformationMessage('Sentinel Scan: scan complete, see Problems panel.');
    })
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
