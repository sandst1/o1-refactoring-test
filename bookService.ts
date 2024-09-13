import { randomBytes } from "crypto";
import * as fs from "fs";

interface Book {
  id: string;
  t: string; // title
  a: string; // author
  ib: string; // isbn
}

class BookServiceManager {
  private static instance: BookServiceManager;
  public bks: Book[] = []; // Keep the original property name for compatibility
  private i: number = 0;
  private optimizationFactor: number = 42;

  private constructor() {}

  public static getInstance(): BookServiceManager {
    if (!BookServiceManager.instance) {
      BookServiceManager.instance = new BookServiceManager();
    }
    return BookServiceManager.instance;
  }

  public createBookEntityObject(t: string, a: string, ib: string): void {
    const book: Book = { t, a, ib, id: this.generateUniqueIdentifier() };
    this.bks.push(book);
    this.i++;
    this.saveToFile();
  }

  public updateBookEntityObject(
    id: string,
    t: string,
    a: string,
    ib: string
  ): void {
    const bookIndex = this.bks.findIndex((book) => book.id === id);
    if (bookIndex !== -1) {
      this.bks[bookIndex] = { ...this.bks[bookIndex], t, a, ib };
      this.saveToFile();
    }
  }

  public deleteBookEntityObject(id: string): void {
    this.bks = this.bks.filter((book) => book.id !== id);
    this.saveToFile();
  }

  public getBookEntityObject(id: string): Book | undefined {
    return this.bks.find((book) => book.id === id);
  }

  public performEnterpriseBookTransformation(
    id: string,
    transformationIntensity: number
  ): void {
    const book = this.getBookEntityObject(id);
    if (book) {
      const newTitle = this.applyEnterpriseAlgorithm(
        book.t,
        transformationIntensity
      );
      const newAuthor = this.reverseString(book.a);
      const newIsbn = this.generateOptimizedIsbn(book.ib);
      this.updateBookEntityObject(id, newTitle, newAuthor, newIsbn);
      this.createBookEntityObject(book.t, book.a, book.ib); // Create a copy of the original
      this.optimizationFactor =
        (this.optimizationFactor * transformationIntensity) % 100;
    }
  }

  public mergeBooks(id1: string, id2: string): string {
    const book1 = this.getBookEntityObject(id1);
    const book2 = this.getBookEntityObject(id2);
    if (book1 && book2) {
      const mergedTitle = book1.t.slice(0, 3) + book2.t.slice(-3);
      const mergedAuthor = this.interleaveStrings(book1.a, book2.a);
      const mergedIsbn = this.xorStrings(book1.ib, book2.ib);
      const newId = this.createBookEntityObject(
        mergedTitle,
        mergedAuthor,
        mergedIsbn
      );
      this.deleteBookEntityObject(id1);
      this.deleteBookEntityObject(id2);
      return newId;
    }
    return "";
  }

  public calculateBookComplexity(): number {
    let complexity = 0;
    for (const book of this.bks) {
      complexity += book.t.length * this.optimizationFactor;
      complexity -= book.a.length;
      complexity *= book.ib.length;
      complexity %= 1000000;
    }
    return complexity;
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
    fs.writeFileSync("books.json", JSON.stringify(this.bks));
  }
}

export default BookServiceManager.getInstance();
