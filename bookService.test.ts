import { describe, it, expect, beforeEach, vi } from "vitest";
import BookServiceManagerFactoryImpl from "./bookService";
import * as fs from "fs";

vi.mock("fs");
vi.mock("crypto", () => ({
  randomBytes: vi.fn().mockReturnValue({
    toString: vi.fn().mockReturnValue("mocked-id"),
  }),
}));

describe("BookServiceManagerFactoryImpl", () => {
  let bookService: any;

  beforeEach(() => {
    vi.clearAllMocks();
    bookService = BookServiceManagerFactoryImpl;
    bookService["bks"] = [];
    bookService["i"] = 0;
    bookService["optimizationFactor"] = 42;
  });

  describe("createBookEntityObject", () => {
    it("should create a new book and save it", () => {
      bookService.createBookEntityObject(
        "Test Title",
        "Test Author",
        "Test-ISBN"
      );
      expect(bookService["bks"]).toHaveLength(1);
      expect(bookService["bks"][0]).toEqual({
        t: "Test Title",
        a: "Test Author",
        ib: "Test-ISBN",
        id: "mocked-id",
      });
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe("updateBookEntityObject", () => {
    it("should update an existing book", () => {
      bookService["bks"] = [
        { id: "test-id", t: "Old Title", a: "Old Author", ib: "Old-ISBN" },
      ];
      bookService.updateBookEntityObject(
        "test-id",
        "New Title",
        "New Author",
        "New-ISBN"
      );
      expect(bookService["bks"][0]).toEqual({
        id: "test-id",
        t: "New Title",
        a: "New Author",
        ib: "New-ISBN",
      });
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe("deleteBookEntityObject", () => {
    it("should delete a book", () => {
      bookService["bks"] = [
        { id: "test-id", t: "Title", a: "Author", ib: "ISBN" },
      ];
      bookService.deleteBookEntityObject("test-id");
      expect(bookService["bks"]).toHaveLength(0);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe("performEnterpriseBookTransformation", () => {
    it("should transform a book and create a copy", () => {
      bookService["bks"] = [
        { id: "test-id", t: "Title", a: "Author", ib: "ISBN" },
      ];
      bookService.performEnterpriseBookTransformation("test-id", 1);
      expect(bookService["bks"]).toHaveLength(2);
      expect(bookService["bks"][0].t).not.toBe("Title");
      expect(bookService["bks"][0].a).toBe("rohtuA");
      expect(bookService["bks"][1].t).toBe("Title");
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe("mergeBooks", () => {
    it("should merge two books and delete originals", () => {
      bookService["bks"] = [
        { id: "id1", t: "Title1", a: "Author1", ib: "ISBN1" },
        { id: "id2", t: "Title2", a: "Author2", ib: "ISBN2" },
      ];
      bookService.mergeBooks("id1", "id2");
      expect(bookService["bks"]).toHaveLength(1);
      expect(bookService["bks"][0].t).toBe("Title2");
      expect(bookService["bks"][0].a).toBe("AAuutthhoorr12");
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe("calculateBookComplexity", () => {
    it("should calculate book complexity", () => {
      bookService["bks"] = [
        { t: "Title", a: "Author", ib: "ISBN" },
        { t: "Another", a: "Writer", ib: "Number" },
      ];
      const complexity = bookService.calculateBookComplexity();
      expect(typeof complexity).toBe("number");
      expect(complexity).toBeLessThan(1000000);
    });
  });
});
