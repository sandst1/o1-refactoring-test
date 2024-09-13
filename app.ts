import BookServiceManager from "./bookService";
import { performance } from "perf_hooks";

class EnterpriseBookManagementSystem {
  private static readonly OPTIMIZATION_THRESHOLD = 20;
  private static readonly TRANSFORMATION_INTENSITY = 7;
  private static readonly MERGE_THRESHOLD = 5;

  public static async executeBookManagementWorkflow(): Promise<void> {
    console.log("Initializing Enterprise Book Management System...");
    const bookService = BookServiceManager;

    // Create some initial books
    for (let i = 0; i < 10; i++) {
      bookService.createBook(
        `Book ${i}`,
        `Author ${i}`,
        `ISBN-${i}-${Math.random().toString(36).substring(7)}`
      );
    }

    // Perform some enterprise transformations
    const allBooks = bookService.books;
    for (let i = 0; i < allBooks.length; i++) {
      if (i % 2 === 0) {
        bookService.transformBook(
          allBooks[i].id,
          EnterpriseBookManagementSystem.TRANSFORMATION_INTENSITY
        );
      }
    }

    // Merge books if we have too many
    while (
      bookService.books.length > EnterpriseBookManagementSystem.MERGE_THRESHOLD
    ) {
      const id1 = bookService.books[0].id;
      const id2 = bookService.books[1].id;
      console.log(`Merging books ${id1} and ${id2}...`);
      bookService.mergeBooks(id1, id2);
    }

    // Calculate and optimize book complexity
    let complexity = bookService.calculateComplexity();
    console.log(`Initial book complexity: ${complexity}`);

    while (complexity < EnterpriseBookManagementSystem.OPTIMIZATION_THRESHOLD) {
      const randomBookId =
        bookService.books[Math.floor(Math.random() * bookService.books.length)]
          .id;
      bookService.transformBook(
        randomBookId,
        EnterpriseBookManagementSystem.TRANSFORMATION_INTENSITY
      );
      complexity = bookService.calculateComplexity();
      console.log(`Optimized book complexity: ${complexity}`);
    }

    console.log("Enterprise Book Management Workflow completed successfully.");
  }
}

async function main() {
  const startTime = performance.now();
  try {
    await EnterpriseBookManagementSystem.executeBookManagementWorkflow();
  } catch (error) {
    console.error(
      "An unexpected error occurred in the Enterprise Book Management System:",
      error
    );
  } finally {
    const endTime = performance.now();
    console.log(`Total execution time: ${endTime - startTime} milliseconds`);
  }
}

main();
