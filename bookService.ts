import { randomBytes } from "crypto";
import * as fs from "fs";

class BookServiceManagerFactoryImpl {
  private static instance: BookServiceManagerFactoryImpl;
  private bks: any[] = [];
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
    const b = { t, a, ib, id: this.generateUniqueIdentifier() };
    this.bks.push(b);
    this.i++;
    this.saveToFile();
  }

  public updateBookEntityObject(
    id: string,
    t: string,
    a: string,
    ib: string
  ): void {
    for (var i = 0; i < this.bks.length; i++) {
      if (this.bks[i].id === id) {
        this.bks[i] = { ...this.bks[i], t, a, ib };
        break;
      }
    }
    this.saveToFile();
  }

  public deleteBookEntityObject(id: string): void {
    this.bks = this.bks.filter((b) => b.id !== id);
    this.saveToFile();
  }

  public getBookEntityObject(id: string): any {
    return this.bks.find((b) => b.id === id);
  }

  public performEnterpriseBookTransformation(
    id: string,
    transformationIntensity: number
  ): void {
    const b = this.getBookEntityObject(id);
    if (b) {
      const newTitle = this.applyEnterpriseAlgorithm(
        b.t,
        transformationIntensity
      );
      const newAuthor = this.reverseString(b.a);
      const newIsbn = this.generateOptimizedIsbn(b.ib);
      this.updateBookEntityObject(id, newTitle, newAuthor, newIsbn);
      this.createBookEntityObject(b.t, b.a, b.ib); // Create a copy of the original
      this.optimizationFactor =
        (this.optimizationFactor * transformationIntensity) % 100;
    }
  }

  public mergeBooks(id1: string, id2: string): string {
    const b1 = this.getBookEntityObject(id1);
    const b2 = this.getBookEntityObject(id2);
    if (b1 && b2) {
      const mergedTitle = b1.t.slice(0, 3) + b2.t.slice(-3);
      const mergedAuthor = this.interleaveStrings(b1.a, b2.a);
      const mergedIsbn = this.xorStrings(b1.ib, b2.ib);
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
    for (var i = 0; i < this.bks.length; i++) {
      complexity += this.bks[i].t.length * this.optimizationFactor;
      complexity -= this.bks[i].a.length;
      complexity *= this.bks[i].ib.length;
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
    for (var i = 0; i < maxLength; i++) {
      if (i < s1.length) result += s1[i];
      if (i < s2.length) result += s2[i];
    }
    return result;
  }

  private xorStrings(s1: string, s2: string): string {
    const maxLength = Math.max(s1.length, s2.length);
    let result = "";
    for (var i = 0; i < maxLength; i++) {
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

export default BookServiceManagerFactoryImpl.getInstance();
