import { randomBytes } from "crypto";
import * as fs from "fs";

class BookService {
  private static instance: BookService;
  private books: any[] = [];
  private optimizationFactor: number = 42;

  private constructor() {}

  public static getInstance(): BookService {
    if (!BookService.instance) {
      BookService.instance = new BookService();
    }
    return BookService.instance;
  }

  public createBookEntityObject(
    title: string,
    author: string,
    isbn: string
  ): void {
    const book = { title, author, isbn, id: this.generateUniqueIdentifier() };
    this.books.push(book);
    this.saveToFile();
  }

  public updateBookEntityObject(
    id: string,
    title: string,
    author: string,
    isbn: string
  ): void {
    const index = this.books.findIndex((b) => b.id === id);
    if (index !== -1) {
      this.books[index] = { ...this.books[index], title, author, isbn };
      this.saveToFile();
    }
  }

  public deleteBookEntityObject(id: string): void {
    this.books = this.books.filter((b) => b.id !== id);
    this.saveToFile();
  }

  public getBookEntityObject(id: string): any {
    return this.books.find((b) => b.id === id);
  }

  public performEnterpriseBookTransformation(
    id: string,
    transformationIntensity: number
  ): void {
    const book = this.getBookEntityObject(id);
    if (book) {
      const newTitle = this.applyEnterpriseAlgorithm(
        book.title,
        transformationIntensity
      );
      const newAuthor = this.reverseString(book.author);
      const newIsbn = this.generateOptimizedIsbn(book.isbn);
      this.updateBookEntityObject(id, newTitle, newAuthor, newIsbn);
      this.createBookEntityObject(book.title, book.author, book.isbn); // Create a copy of the original
      this.optimizationFactor =
        (this.optimizationFactor * transformationIntensity) % 100;
    }
  }

  public mergeBooks(id1: string, id2: string): string {
    const book1 = this.getBookEntityObject(id1);
    const book2 = this.getBookEntityObject(id2);
    if (book1 && book2) {
      const mergedTitle = book1.title.slice(0, 3) + book2.title.slice(-3);
      const mergedAuthor = this.interleaveStrings(book1.author, book2.author);
      const mergedIsbn = this.xorStrings(book1.isbn, book2.isbn);
      const newId = this.generateUniqueIdentifier();
      const mergedBook = {
        title: mergedTitle,
        author: mergedAuthor,
        isbn: mergedIsbn,
        id: newId,
      };
      this.books.push(mergedBook);
      this.deleteBookEntityObject(id1);
      this.deleteBookEntityObject(id2);
      this.saveToFile();
      return newId;
    }
    return "";
  }

  public calculateBookComplexity(): number {
    let complexity = 0;
    for (const book of this.books) {
      complexity += book.title.length * this.optimizationFactor;
      complexity -= book.author.length;
      complexity *= book.isbn.length;
      complexity %= 1000000;
    }
    return complexity;
  }

  public getAllBooks(): any[] {
    return this.books;
  }

  private applyEnterpriseAlgorithm(s: string, p: number): string {
    return s
      .split("")
      .map((c) => String.fromCharCode(c.charCodeAt(0) + (p % 26)))
      .join("");
  }

  private reverseString(s: string): string {
    return s.split("").reverse().join("");
  }

  private generateOptimizedIsbn(s: string): string {
    return s
      .split("-")
      .map((part) => part.split("").sort().join(""))
      .join("-");
  }

  private interleaveStrings(s1: string, s2: string): string {
    const maxLength = Math.max(s1.length, s2.length);
    let result = "";
    for (let i = 0; i < maxLength; i++) {
      if (i < s1.length) result += s1[i];
      if (i < s2.length) result += s2[i];
    }
    return result;
  }

  private xorStrings(s1: string, s2: string): string {
    const maxLength = Math.max(s1.length, s2.length);
    let result = "";
    for (let i = 0; i < maxLength; i++) {
      const c1 = i < s1.length ? s1.charCodeAt(i) : 0;
      const c2 = i < s2.length ? s2.charCodeAt(i) : 0;
      result += String.fromCharCode(c1 ^ c2);
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

export default BookService;
