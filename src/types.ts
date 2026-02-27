export interface GatewayTransport {
  request<T = Record<string, unknown>>(
    method: string,
    params?: unknown,
    opts?: { expectFinal?: boolean; },
  ): Promise<T>;
}

export interface ToolLike {
  name: string;
  description?: string;
  parameters?: {
    properties?: Record<string, Record<string, unknown>>;
    required?: string[];
    [key: string]: unknown;
  };
  execute(
    toolCallId: string,
    args: Record<string, unknown>,
  ): Promise<{ content: Array<{ type: string; text?: string; }>; }>;
}

export type McpToolDef = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

export type McpCallResult = {
  content: Array<{ type: "text"; text: string; }>;
  isError?: boolean;
};

export type McpBridgeOptions = {
  transport: GatewayTransport;
  serverInfo: { name: string; version: string; };
  defaultSessionKey?: string;
  verbose?: boolean;
};

export interface McpBridge {
  listTools(): McpToolDef[];
  loadGatewayTools(): Promise<void>;
  callTool(name: string, args: Record<string, unknown>): Promise<McpCallResult>;
  serve(): Promise<void>;
}
