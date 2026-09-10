import { describe, expect, it } from "@jest/globals";

import type { ThreadEvent } from "../src/index";

describe("ThreadEvent", () => {
  it("exposes retry metadata on stream errors", () => {
    const event: ThreadEvent = {
      type: "error",
      message: "connection failed",
      codexErrorInfo: {
        httpConnectionFailed: {
          httpStatusCode: 503,
        },
      },
      willRetry: true,
    };

    expect(event.codexErrorInfo).toEqual({
      httpConnectionFailed: {
        httpStatusCode: 503,
      },
    });
    expect(event.willRetry).toBe(true);
  });

  it("exposes terminal metadata on failed turns", () => {
    const event: ThreadEvent = {
      type: "turn.failed",
      error: {
        message: "unauthorized",
        codexErrorInfo: "unauthorized",
        willRetry: false,
      },
    };

    expect(event.error.codexErrorInfo).toBe("unauthorized");
    expect(event.error.willRetry).toBe(false);
  });
});
