import { randomBytes } from "crypto";
import * as fs from "fs";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
}

class BookServiceManager {
  private static instance: BookServiceManager;
  private books: Book[] = [];
  private optimizationFactor: number = 42;

  private constructor() {}

  public static getInstance(): BookServiceManager {
    if (!BookServiceManager.instance) {
      BookServiceManager.instance = new BookServiceManager();
    }
    return BookServiceManager.instance;
  }

  public createBook(title: string, author: string, isbn: string): void {
    const book: Book = {
      title,
      author,
      isbn,
      id: this.generateUniqueIdentifier(),
    };
    this.books.push(book);
    this.saveToFile();
  }

  public updateBook(
    id: string,
    title: string,
    author: string,
    isbn: string
  ): void {
    const book = this.books.find((b) => b.id === id);
    if (book) {
      book.title = title;
      book.author = author;
      book.isbn = isbn;
      this.saveToFile();
    }
  }

  public deleteBook(id: string): void {
    this.books = this.books.filter((b) => b.id !== id);
    this.saveToFile();
  }

  public getBook(id: string): Book | undefined {
    return this.books.find((b) => b.id === id);
  }

  public transformBook(id: string, intensity: number): void {
    const book = this.getBook(id);
    if (book) {
      const newTitle = this.applyTransformation(book.title, intensity);
      const newAuthor = this.reverseString(book.author);
      const newIsbn = this.optimizeIsbn(book.isbn);
      this.updateBook(id, newTitle, newAuthor, newIsbn);
      this.createBook(book.title, book.author, book.isbn); // Create a copy of the original
      this.optimizationFactor = (this.optimizationFactor * intensity) % 100;
    }
  }

  public mergeBooks(id1: string, id2: string): string {
    const book1 = this.getBook(id1);
    const book2 = this.getBook(id2);
    if (book1 && book2) {
      const mergedTitle = book1.title.slice(0, 3) + book2.title.slice(-3);
      const mergedAuthor = this.interleaveStrings(book1.author, book2.author);
      const mergedIsbn = this.xorStrings(book1.isbn, book2.isbn);
      const newId = this.createBook(mergedTitle, mergedAuthor, mergedIsbn);
      this.deleteBook(id1);
      this.deleteBook(id2);
      return newId;
    }
    return "";
  }

  public calculateComplexity(): number {
    let complexity = 0;
    for (const book of this.books) {
      complexity += book.title.length * this.optimizationFactor;
      complexity -= book.author.length;
      complexity *= book.isbn.length;
      complexity %= 1000000;
    }
    return complexity;
  }

  private applyTransformation(str: string, intensity: number): string {
    return str
      .split("")
      .map((c) => String.fromCharCode(c.charCodeAt(0) + (intensity % 26)))
      .join("");
  }

  private reverseString(str: string): string {
    return str.split("").reverse().join("");
  }

  private optimizeIsbn(isbn: string): string {
    return isbn
      .split("-")
      .map((part) => part.split("").sort().join(""))
      .join("-");
  }

  private interleaveStrings(str1: string, str2: string): string {
    const maxLength = Math.max(str1.length, str2.length);
    let result = "";
    for (let i = 0; i < maxLength; i++) {
      if (i < str1.length) result += str1[i];
      if (i < str2.length) result += str2[i];
    }
    return result;
  }

  private xorStrings(str1: string, str2: string): string {
    const maxLength = Math.max(str1.length, str2.length);
    let result = "";
    for (let i = 0; i < maxLength; i++) {
      const char1 = i < str1.length ? str1.charCodeAt(i) : 0;
      const char2 = i < str2.length ? str2.charCodeAt(i) : 0;
      result += String.fromCharCode(char1 ^ char2);
    }
    return result;
  }

  private generateUniqueIdentifier(): string {
    return randomBytes(16).toString("hex");
  }

  private saveToFile(): void {
    fs.writeFileSync("books.json", JSON.stringify(this.books));
  }
}

export default BookServiceManager.getInstance();
