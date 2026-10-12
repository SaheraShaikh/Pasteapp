import assert from "node:assert/strict";
import { test } from "node:test";
import {
  encodePaste,
  decodePaste,
  createShareUrl,
} from "../src/utils/sharing.js";

test("shared snapshots preserve Unicode, line breaks, and literal markup", () => {
  const paste = {
    title: "नमस्ते 🌿",
    content: "你好\n<script>alert(1)</script>\n📝",
  };
  assert.deepEqual(decodePaste(encodePaste(paste)), paste);
});
test("share links preserve a deployment subfolder and exclude local record IDs", () => {
  const paste = {
    _id: "private-local-id",
    title: "Note",
    content: "A snapshot",
  };
  const url = new URL(
    createShareUrl(paste, "https://example.com/Pasteapp/#/pastes/local-id"),
  );
  assert.equal(url.pathname, "/Pasteapp/");
  const data = new URLSearchParams(url.hash.split("?")[1]).get("data");
  assert.deepEqual(decodePaste(data), {
    title: paste.title,
    content: paste.content,
  });
});
test("invalid, malformed, and oversized links are rejected", () => {
  for (const data of [
    "",
    "bad!",
    encodePaste({ title: 2, content: "text" }),
    encodePaste({ title: "Note", content: " " }),
    "x".repeat(16001),
  ])
    assert.throws(() => decodePaste(data));
});
test("large text falls back instead of producing an unusable share link", () => {
  assert.equal(
    createShareUrl(
      { title: "Large", content: "x".repeat(20000) },
      "https://example.com",
    ),
    null,
  );
});
test("existing local data survives editing and deletion can be undone", async () => {
  const original = {
    _id: "old",
    title: "Original",
    content: "Existing content",
    createdAt: "2025-01-01T00:00:00.000Z",
  };
  globalThis.localStorage = { getItem: () => JSON.stringify([original]) };
  const {
    default: reducer,
    updateToPastes,
    removeFromPastes,
    addToPastes,
  } = await import("../src/redux/pasteSlice.js");
  let state = reducer(undefined, { type: "init" });
  assert.equal(state.pastes.length, 1);
  state = reducer(state, updateToPastes({ _id: "old", title: "Edited" }));
  assert.equal(state.pastes[0].createdAt, original.createdAt);
  assert.equal(state.pastes[0].content, original.content);
  const removed = state.pastes[0];
  state = reducer(state, removeFromPastes("old"));
  assert.equal(state.pastes.length, 0);
  state = reducer(state, addToPastes(removed));
  assert.equal(state.pastes[0].title, "Edited");
});
