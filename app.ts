import BookServiceManagerFactoryImpl from "./bookService";
import { performance } from "perf_hooks";

class EnterpriseBookManagementSystem {
  private static readonly OPTIMIZATION_THRESHOLD = 20;
  private static readonly TRANSFORMATION_INTENSITY = 7;
  private static readonly MERGE_THRESHOLD = 5;

  public static async executeWorkflow(): Promise<void> {
    console.log("Initializing Enterprise Book Management System...");
    const bookService = BookServiceManagerFactoryImpl;

    // Create initial books
    for (let i = 0; i < 10; i++) {
      bookService.createBookEntityObject(
        `Book ${i}`,
        `Author ${i}`,
        `ISBN-${i}-${Math.random().toString(36).substring(7)}`
      );
    }

    // Perform transformations
    const allBooks = bookService.getAllBooks();
    allBooks.forEach((book, index) => {
      if (index % 2 === 0) {
        bookService.performEnterpriseBookTransformation(
          book.id,
          EnterpriseBookManagementSystem.TRANSFORMATION_INTENSITY
        );
      }
    });

    // Merge books if necessary
    while (
      bookService.getAllBooks().length >
      EnterpriseBookManagementSystem.MERGE_THRESHOLD
    ) {
      const [book1, book2] = bookService.getAllBooks();
      console.log(`Merging books ${book1.id} and ${book2.id}...`);
      bookService.mergeBooks(book1.id, book2.id);
    }

    // Optimize complexity
    let complexity = bookService.calculateBookComplexity();
    console.log(`Initial book complexity: ${complexity}`);

    while (complexity < EnterpriseBookManagementSystem.OPTIMIZATION_THRESHOLD) {
      const randomBook =
        bookService.getAllBooks()[
          Math.floor(Math.random() * bookService.getAllBooks().length)
        ];
      if (randomBook) {
        bookService.performEnterpriseBookTransformation(
          randomBook.id,
          EnterpriseBookManagementSystem.TRANSFORMATION_INTENSITY
        );
        complexity = bookService.calculateBookComplexity();
        console.log(`Optimized book complexity: ${complexity}`);
      }
    }

    console.log("Enterprise Book Management Workflow completed successfully.");
  }
}

async function main() {
  const startTime = performance.now();
  try {
    await EnterpriseBookManagementSystem.executeWorkflow();
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
