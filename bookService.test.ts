import { describe, it, expect, beforeEach, vi } from "vitest";
import BookServiceManager from "./bookService";
import * as fs from "fs";

vi.mock("fs");
vi.mock("crypto", () => ({
  randomBytes: vi.fn().mockReturnValue({
    toString: vi.fn().mockReturnValue("mocked-id"),
  }),
}));

describe("BookServiceManager", () => {
  let bookService: any;

  beforeEach(() => {
    vi.clearAllMocks();
    bookService = BookServiceManager;
    bookService["books"] = [];
    bookService["optimizationFactor"] = 42;
  });

  describe("createBook", () => {
    it("should create a new book and save it", () => {
      bookService.createBook("Test Title", "Test Author", "Test-ISBN");
      expect(bookService["books"]).toHaveLength(1);
      expect(bookService["books"][0]).toEqual({
        title: "Test Title",
        author: "Test Author",
        isbn: "Test-ISBN",
        id: "mocked-id",
      });
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe("updateBook", () => {
    it("should update an existing book", () => {
      bookService["books"] = [
        {
          id: "test-id",
          title: "Old Title",
          author: "Old Author",
          isbn: "Old-ISBN",
        },
      ];
      bookService.updateBook("test-id", "New Title", "New Author", "New-ISBN");
      expect(bookService["books"][0]).toEqual({
        id: "test-id",
        title: "New Title",
        author: "New Author",
        isbn: "New-ISBN",
      });
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe("deleteBook", () => {
    it("should delete a book", () => {
      bookService["books"] = [
        { id: "test-id", title: "Title", author: "Author", isbn: "ISBN" },
      ];
      bookService.deleteBook("test-id");
      expect(bookService["books"]).toHaveLength(0);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe("transformBook", () => {
    it("should transform a book and create a copy", () => {
      bookService["books"] = [
        { id: "test-id", title: "Title", author: "Author", isbn: "ISBN" },
      ];
      bookService.transformBook("test-id", 1);
      expect(bookService["books"]).toHaveLength(2);
      expect(bookService["books"][0].title).toBe("Ujumf"); // Updated expectation
      expect(bookService["books"][0].author).toBe("rohtuA");
      expect(bookService["books"][1].title).toBe("Title");
      expect(bookService["books"][1].author).toBe("Author");
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe("mergeBooks", () => {
    it("should merge two books and delete originals", () => {
      bookService["books"] = [
        { id: "id1", title: "Title1", author: "Author1", isbn: "ISBN1" },
        { id: "id2", title: "Title2", author: "Author2", isbn: "ISBN2" },
      ];
      bookService.mergeBooks("id1", "id2");
      expect(bookService["books"]).toHaveLength(1);
      expect(bookService["books"][0].title).toBe("Title2");
      expect(bookService["books"][0].author).toBe("AAuutthhoorr12");
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe("calculateComplexity", () => {
    it("should calculate book complexity", () => {
      bookService["books"] = [
        { title: "Title", author: "Author", isbn: "ISBN" },
        { title: "Another", author: "Writer", isbn: "Number" },
      ];
      const complexity = bookService.calculateComplexity();
      expect(typeof complexity).toBe("number");
      expect(complexity).toBeLessThan(1000000);
    });
  });
});
