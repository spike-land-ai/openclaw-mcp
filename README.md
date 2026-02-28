# @spike-land-ai/openclaw-mcp

Standalone MCP bridge for OpenClaw gateway. This server provides tools to interact with OpenClaw, making it accessible through the Model Context Protocol.

## Features

- Model Context Protocol (MCP) interface for OpenClaw.
- Efficient communication with the OpenClaw gateway.
- Ready-to-use CLI and worker components.

## Installation

```bash
yarn install
```

## Build

```bash
yarn build
```

## Usage

### Development

```bash
yarn dev
```

### Start Server

```bash
yarn start
```

## Integration

To use this with an MCP client (like Claude Desktop), add it to your configuration:

```json
{
  "mcpServers": {
    "openclaw": {
      "command": "node",
      "args": ["/path/to/packages/openclaw-mcp/dist/cli.js"]
    }
  }
}
```
