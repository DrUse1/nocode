import { parseCookies, separateFileExtension } from "$/lib/utils";
import { test, expect, describe } from "bun:test";

describe("separate file extension", () => {
  test("file.txt", () => {
    expect(separateFileExtension("file.txt")).toEqual(["file", ".txt"]);
  });
  test("file.test.txt", () => {
    expect(separateFileExtension("file.test.txt")).toEqual([
      "file.test",
      ".txt",
    ]);
  });
  test("filetxt", () => {
    expect(separateFileExtension("filetxt")).toEqual([]);
  });
  test("filetxt.", () => {
    expect(separateFileExtension("filetxt")).toEqual([]);
  });
});

describe("parse cookies", () => {
  test("", () => {
    expect(parseCookies("")).toEqual({});
  });
  test("session=123", () => {
    expect(parseCookies("session=123")).toEqual({ session: "123" });
  });
  test("session=123; user=hello", () => {
    expect(parseCookies("session=123; user=hello")).toEqual({
      session: "123",
      user: "hello",
    });
  });
  test("session=123; user=hello", () => {
    expect(parseCookies("session=123; user=hello")).toEqual({
      session: "123",
      user: "hello",
    });
  });
});
