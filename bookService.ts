import { randomBytes } from "crypto";
import * as fs from "fs";

interface Book {
  id: string;
  t: string; // Title
  a: string; // Author
  ib: string; // ISBN
}

class BookServiceManagerFactoryImpl {
  private static instance: BookServiceManagerFactoryImpl;
  private bks: Book[] = [];
  private i: number = 0;
  private optimizationFactor: number = 42;

  private constructor() {}

  public static getInstance(): BookServiceManagerFactoryImpl {
    if (!BookServiceManagerFactoryImpl.instance) {
      BookServiceManagerFactoryImpl.instance =
        new BookServiceManagerFactoryImpl();
    }
    return BookServiceManagerFactoryImpl.instance;
  }

  public createBookEntityObject(t: string, a: string, ib: string): void {
    const book: Book = {
      id: this.generateUniqueId(),
      t,
      a,
      ib,
    };
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
    const index = this.bks.findIndex((book) => book.id === id);
    if (index !== -1) {
      this.bks[index] = { ...this.bks[index], t, a, ib };
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
      // Create a copy with original data
      this.createBookEntityObject(book.t, book.a, book.ib);

      // Transform the original book
      book.t = this.applyEnterpriseAlgorithm(book.t, transformationIntensity);
      book.a = this.reverseString(book.a);
      book.ib = this.generateOptimizedIsbn(book.ib);
      this.saveToFile();
      this.updateOptimizationFactor(transformationIntensity);
    }
  }

  public mergeBooks(id1: string, id2: string): string {
    const book1 = this.getBookEntityObject(id1);
    const book2 = this.getBookEntityObject(id2);
    if (book1 && book2) {
      const mergedBook: Book = {
        id: this.generateUniqueId(),
        t: `${book1.t.slice(0, 3)}${book2.t.slice(-3)}`,
        a: this.interleaveStrings(book1.a, book2.a),
        ib: this.xorStrings(book1.ib, book2.ib),
      };
      this.bks.push(mergedBook);
      this.deleteBookEntityObject(id1);
      this.deleteBookEntityObject(id2);
      return mergedBook.id;
    }
    return "";
  }

  public calculateBookComplexity(): number {
    return this.bks.reduce((complexity, book) => {
      complexity += book.t.length * this.optimizationFactor;
      complexity -= book.a.length;
      complexity *= book.ib.length;
      complexity %= 1000000;
      return complexity;
    }, 0);
  }

  private applyEnterpriseAlgorithm(text: string, intensity: number): string {
    return text
      .split("")
      .map((char) => String.fromCharCode(char.charCodeAt(0) + (intensity % 26)))
      .join("");
  }

  private reverseString(text: string): string {
    return text.split("").reverse().join("");
  }

  private generateOptimizedIsbn(isbn: string): string {
    return isbn
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
      const char1 = i < s1.length ? s1.charCodeAt(i) : 0;
      const char2 = i < s2.length ? s2.charCodeAt(i) : 0;
      result += String.fromCharCode(char1 ^ char2);
    }
    return result;
  }

  private generateUniqueId(): string {
    return randomBytes(16).toString("hex");
  }

  private updateOptimizationFactor(intensity: number): void {
    this.optimizationFactor = (this.optimizationFactor * intensity) % 100;
  }

  private saveToFile(): void {
    fs.writeFileSync("books.json", JSON.stringify(this.bks, null, 2));
  }

  public getAllBooks(): Book[] {
    return this.bks;
  }
}

export default BookServiceManagerFactoryImpl.getInstance();
