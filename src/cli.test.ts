import { describe, expect, it, vi } from "vitest";
import { execFile } from "node:child_process";
import { CliTransport } from "./cli.js";

vi.mock("node:child_process", () => ({
  execFile: vi.fn(),
}));

describe("CliTransport", () => {
  it("should return empty tools list", async () => {
    const transport = new CliTransport();
    const result = await transport.request("tools.list");
    expect(result).toEqual({ tools: [], sessionKey: "cli" });
  });

  it("should throw for unsupported method", async () => {
    const transport = new CliTransport();
    await expect(transport.request("invalid")).rejects.toThrow("Unsupported method");
  });

  it("should throw if message is missing in chat.send", async () => {
    const transport = new CliTransport();
    await expect(transport.request("chat.send", {})).rejects.toThrow("message is required");
  });

  it("should send chat message via CLI", async () => {
    const transport = new CliTransport("custom-bin");
    const mockOutput = {
      result: { payloads: [{ text: "hello from cli" }] },
    };

    vi.mocked(execFile).mockImplementation((bin, args, opts, cb) => {
      (cb as any)(null, JSON.stringify(mockOutput), "");
      return {} as any;
    });

    const result: any = await transport.request("chat.send", {
      message: "hi",
      sessionKey: "sess1",
    });
    expect(result.message.content[0].text).toBe("hello from cli");
    expect(execFile).toHaveBeenCalledWith(
      "custom-bin",
      expect.arrayContaining(["--message", "hi", "--session-id", "sess1"]),
      expect.any(Object),
      expect.any(Function),
    );
  });

  it("should handle CLI error response", async () => {
    const transport = new CliTransport();
    vi.mocked(execFile).mockImplementation((bin, args, opts, cb) => {
      (cb as any)(null, JSON.stringify({ error: "CLI Crashed" }), "");
      return {} as any;
    });

    await expect(transport.request("chat.send", { message: "hi" })).rejects.toThrow(
      "OpenClaw: CLI Crashed",
    );
  });

  it("should handle execFile error", async () => {
    const transport = new CliTransport();
    vi.mocked(execFile).mockImplementation((bin, args, opts, cb) => {
      (cb as any)(new Error("Spawn error"), "", "some stderr");
      return {} as any;
    });

    await expect(transport.request("chat.send", { message: "hi" })).rejects.toThrow("Spawn error");
  });

  it("should handle empty payloads response", async () => {
    const transport = new CliTransport();
    vi.mocked(execFile).mockImplementation((bin, args, opts, cb) => {
      (cb as any)(null, JSON.stringify({ result: { payloads: [] } }), "");
      return {} as any;
    });

    const result: any = await transport.request("chat.send", { message: "hi" });
    expect(result.message.content[0].text).toBe("(no response)");
  });
});
