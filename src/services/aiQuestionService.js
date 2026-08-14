// RookX Gemini AI Question-Generation Service
// Supports context-aware question generation, 10-tier difficulty progression,
// normalized fingerprint duplicate prevention, and tiered fallback handling.

export const LEVEL_DIFFICULTY_TIERS = {
  1: { level: 1, name: 'BASIC', label: 'Level 1 — BASIC', description: 'Absolute beginner-friendly definitions, syntax, terminology, and simple recognition. No tricky questions.' },
  2: { level: 2, name: 'BASIC+', label: 'Level 2 — BASIC+', description: 'Beginner-friendly understanding and simple application. Slightly step up from Level 1.' },
  3: { level: 3, name: 'FOUNDATION', label: 'Level 3 — FOUNDATION', description: 'Understanding plus simple practical application. Small scenarios and straightforward problem solving.' },
  4: { level: 4, name: 'INTERMEDIATE', label: 'Level 4 — INTERMEDIATE', description: 'Applying concepts in moderately realistic situations rather than recalling definitions.' },
  5: { level: 5, name: 'INTERMEDIATE+', label: 'Level 5 — INTERMEDIATE+', description: 'Combining related concepts, multi-step reasoning, and distractors testing common misunderstandings.' },
  6: { level: 6, name: 'ADVANCED FOUNDATION', label: 'Level 6 — ADVANCED FOUNDATION', description: 'Complex scenarios, multi-step reasoning, practical situational application.' },
  7: { level: 7, name: 'ADVANCED', label: 'Level 7 — ADVANCED', description: 'Difficult problem-solving and real-world scenarios combining multiple concepts.' },
  8: { level: 8, name: 'ADVANCED+', label: 'Level 8 — ADVANCED+', description: 'Complex scenarios, deeper understanding, strong technical reasoning without definition questions.' },
  9: { level: 9, name: 'EXPERT', label: 'Level 9 — EXPERT', description: 'Challenging, practical, multi-concept questions testing deep technical trade-offs.' },
  10: { level: 10, name: 'CAPSTONE', label: 'Level 10 — CAPSTONE', description: 'Realistic complex workplace scenarios and multi-step production engineering decision-making.' }
};

export function getLevelDifficultyTier(levelNum) {
  const norm = Math.max(1, Math.min(10, parseInt(levelNum, 10) || 1));
  return LEVEL_DIFFICULTY_TIERS[norm] || LEVEL_DIFFICULTY_TIERS[1];
}

// Multi-Tier Curated Fallback Question Sets (used if Gemini API is unavailable or offline)
const FALLBACK_QUESTIONS = {
  python: [
    // Level 1-2 (Basic / Basic+)
    {
      id: 'fb_py_l1_1',
      question: 'Which built-in Python function displays formatted output to the standard console screen?',
      codeSnippet: '# Print hello world to screen',
      options: [
        { id: 'A', text: 'print()', isCorrect: true },
        { id: 'B', text: 'echo()', isCorrect: false },
        { id: 'C', text: 'console.log()', isCorrect: false },
        { id: 'D', text: 'write()', isCorrect: false }
      ],
      explanation: 'The print() function outputs the specified message to the console screen.',
      topic: 'Python Core',
      minLevel: 1,
      maxLevel: 2
    },
    {
      id: 'fb_py_l1_2',
      question: 'What data type is automatically assigned to the result of checking x = (5 > 3) in Python?',
      codeSnippet: 'x = (5 > 3)\nprint(type(x))',
      options: [
        { id: 'A', text: 'int', isCorrect: false },
        { id: 'B', text: 'bool', isCorrect: true },
        { id: 'C', text: 'str', isCorrect: false },
        { id: 'D', text: 'float', isCorrect: false }
      ],
      explanation: 'Comparison operations evaluate to Boolean values (True or False), which have the type bool.',
      topic: 'Data Types',
      minLevel: 1,
      maxLevel: 2
    },
    {
      id: 'fb_py_l1_3',
      question: 'Which operator is used to calculate the remainder of division in Python?',
      codeSnippet: 'result = 10 % 3',
      options: [
        { id: 'A', text: '/', isCorrect: false },
        { id: 'B', text: '//', isCorrect: false },
        { id: 'C', text: '%', isCorrect: true },
        { id: 'D', text: '**', isCorrect: false }
      ],
      explanation: 'The modulo operator % returns the integer remainder of division (10 % 3 = 1).',
      topic: 'Operators',
      minLevel: 1,
      maxLevel: 2
    },
    {
      id: 'fb_py_l1_4',
      question: 'How do you create a single-line comment in Python?',
      codeSnippet: '# This is a line',
      options: [
        { id: 'A', text: '// Comment', isCorrect: false },
        { id: 'B', text: '<!-- Comment -->', isCorrect: false },
        { id: 'C', text: '# Comment', isCorrect: true },
        { id: 'D', text: '/* Comment */', isCorrect: false }
      ],
      explanation: 'Python uses the hash character # to indicate single-line comments.',
      topic: 'Python Syntax',
      minLevel: 1,
      maxLevel: 2
    },
    {
      id: 'fb_py_l1_5',
      question: 'What is the index of the first element in a Python list `nums = [10, 20, 30]`?',
      codeSnippet: 'nums = [10, 20, 30]',
      options: [
        { id: 'A', text: '0', isCorrect: true },
        { id: 'B', text: '1', isCorrect: false },
        { id: 'C', text: '-1', isCorrect: false },
        { id: 'D', text: 'first', isCorrect: false }
      ],
      explanation: 'Python lists use zero-based indexing, so the first element is at index 0.',
      topic: 'Lists',
      minLevel: 1,
      maxLevel: 2
    },

    // Level 3-4 (Foundation / Intermediate)
    {
      id: 'fb_py_l3_1',
      question: 'What will be printed by this loop using range(2, 6, 2)?',
      codeSnippet: 'for i in range(2, 6, 2):\n    print(i, end=" ")',
      options: [
        { id: 'A', text: '2 3 4 5', isCorrect: false },
        { id: 'B', text: '2 4', isCorrect: true },
        { id: 'C', text: '2 4 6', isCorrect: false },
        { id: 'D', text: '4 6', isCorrect: false }
      ],
      explanation: 'range(start, stop, step) starts at 2, steps by 2, and stops before reaching 6, producing 2 and 4.',
      topic: 'Control Flow',
      minLevel: 3,
      maxLevel: 4
    },
    {
      id: 'fb_py_l3_2',
      question: 'What does dict.get(key, default) return if the key does not exist in the dictionary?',
      codeSnippet: 'user = {"name": "Alex"}\nrole = user.get("role", "Guest")',
      options: [
        { id: 'A', text: 'Raises KeyError', isCorrect: false },
        { id: 'B', text: 'None', isCorrect: false },
        { id: 'C', text: '"Guest"', isCorrect: true },
        { id: 'D', text: '"Alex"', isCorrect: false }
      ],
      explanation: 'dict.get(key, default) safely returns the default value ("Guest") without raising a KeyError.',
      topic: 'Dictionaries',
      minLevel: 3,
      maxLevel: 4
    },
    {
      id: 'fb_py_l3_3',
      question: 'What is the result of applying a list comprehension `[x * 2 for x in nums if x % 2 == 0]` on `[1, 2, 3, 4]`?',
      codeSnippet: 'nums = [1, 2, 3, 4]\nres = [x * 2 for x in nums if x % 2 == 0]',
      options: [
        { id: 'A', text: '[4, 8]', isCorrect: true },
        { id: 'B', text: '[2, 4, 6, 8]', isCorrect: false },
        { id: 'C', text: '[2, 4]', isCorrect: false },
        { id: 'D', text: '[1, 3]', isCorrect: false }
      ],
      explanation: 'The filter retains even numbers [2, 4], and multiplying each by 2 yields [4, 8].',
      topic: 'List Comprehensions',
      minLevel: 3,
      maxLevel: 4
    },
    {
      id: 'fb_py_l3_4',
      question: 'What parameter must be defined as the first argument in a Python instance method inside a class?',
      codeSnippet: 'class User:\n    def greet(_____):\n        print("Hello")',
      options: [
        { id: 'A', text: 'this', isCorrect: false },
        { id: 'B', text: 'self', isCorrect: true },
        { id: 'C', text: 'cls', isCorrect: false },
        { id: 'D', text: 'super', isCorrect: false }
      ],
      explanation: '`self` represents the instance of the class and must be passed as the first parameter to instance methods.',
      topic: 'OOP Concepts',
      minLevel: 3,
      maxLevel: 4
    },
    {
      id: 'fb_py_l3_5',
      question: 'Which method adds an element to the end of an existing Python list?',
      codeSnippet: 'items = [1, 2]\nitems._____(3)',
      options: [
        { id: 'A', text: 'push()', isCorrect: false },
        { id: 'B', text: 'add()', isCorrect: false },
        { id: 'C', text: 'append()', isCorrect: true },
        { id: 'D', text: 'insert_end()', isCorrect: false }
      ],
      explanation: 'append() modifies the list in place by adding the given item to the end.',
      topic: 'List Methods',
      minLevel: 3,
      maxLevel: 4
    },

    // Level 5-6 (Intermediate+ / Advanced Foundation)
    {
      id: 'fb_py_l5_1',
      question: 'In Python, how does a generator function differ from a standard function?',
      codeSnippet: 'def generate_numbers():\n    for i in range(3):\n        yield i',
      options: [
        { id: 'A', text: 'It uses `yield` to return a lazy iterator without storing all values in memory', isCorrect: true },
        { id: 'B', text: 'It executes in parallel on multiple CPU cores automatically', isCorrect: false },
        { id: 'C', text: 'It cannot accept arguments or return strings', isCorrect: false },
        { id: 'D', text: 'It compiles directly to C code', isCorrect: false }
      ],
      explanation: 'Generators yield items one by one lazily, saving memory compared to building complete lists in RAM.',
      topic: 'Generators & Iterators',
      minLevel: 5,
      maxLevel: 6
    },
    {
      id: 'fb_py_l5_2',
      question: 'What exception is raised when trying to convert a non-numeric string `"abc"` to an integer with `int("abc")`?',
      codeSnippet: 'val = int("abc")',
      options: [
        { id: 'A', text: 'TypeError', isCorrect: false },
        { id: 'B', text: 'ValueError', isCorrect: true },
        { id: 'C', text: 'KeyError', isCorrect: false },
        { id: 'D', text: 'AttributeError', isCorrect: false }
      ],
      explanation: 'ValueError is raised when an operation or function receives an argument that has the right type but an inappropriate value.',
      topic: 'Exception Handling',
      minLevel: 5,
      maxLevel: 6
    },
    {
      id: 'fb_py_l5_3',
      question: 'Which built-in Python module is used to work with regular expressions?',
      codeSnippet: 'import _____ \nmatch = re.search(r"\\d+", "order 123")',
      options: [
        { id: 'A', text: 'regex', isCorrect: false },
        { id: 'B', text: 're', isCorrect: true },
        { id: 'C', text: 'string', isCorrect: false },
        { id: 'D', text: 'parser', isCorrect: false }
      ],
      explanation: 'The standard library module `re` provides regular expression matching operations.',
      topic: 'Modules & RegEx',
      minLevel: 5,
      maxLevel: 6
    },
    {
      id: 'fb_py_l5_4',
      question: 'What is the purpose of the `@staticmethod` decorator in Python?',
      codeSnippet: 'class MathUtils:\n    @staticmethod\n    def add(a, b):\n        return a + b',
      options: [
        { id: 'A', text: 'It prevents the method from being overridden by subclasses', isCorrect: false },
        { id: 'B', text: 'It defines a method that does not take an implicit `self` or `cls` argument', isCorrect: true },
        { id: 'C', text: 'It converts the return value into a static constant', isCorrect: false },
        { id: 'D', text: 'It speeds up execution by multithreading', isCorrect: false }
      ],
      explanation: 'Static methods belong to the class and do not require instance (self) or class (cls) references.',
      topic: 'Decorators & OOP',
      minLevel: 5,
      maxLevel: 6
    },
    {
      id: 'fb_py_l5_5',
      question: 'What is the output of `list(map(lambda x: x * 2, [1, 2, 3]))`?',
      codeSnippet: 'res = list(map(lambda x: x * 2, [1, 2, 3]))',
      options: [
        { id: 'A', text: '[2, 4, 6]', isCorrect: true },
        { id: 'B', text: '[1, 2, 3, 1, 2, 3]', isCorrect: false },
        { id: 'C', text: '[2, 2, 2]', isCorrect: false },
        { id: 'D', text: '[1, 4, 9]', isCorrect: false }
      ],
      explanation: 'map applies the lambda function (doubling each element) to each item in the list.',
      topic: 'Functional Python',
      minLevel: 5,
      maxLevel: 6
    },

    // Level 7-10 (Advanced / Capstone)
    {
      id: 'fb_py_l7_1',
      question: 'In Python, how does the GIL (Global Interpreter Lock) impact multithreading for CPU-bound tasks?',
      codeSnippet: '# Threading vs Multiprocessing in Python CPython',
      options: [
        { id: 'A', text: 'It prevents multiple threads from executing Python bytecode simultaneously in CPython', isCorrect: true },
        { id: 'B', text: 'It speeds up CPU-intensive loops automatically by utilizing hyperthreading', isCorrect: false },
        { id: 'C', text: 'It restricts async/await coroutines from making network requests', isCorrect: false },
        { id: 'D', text: 'It allocates separate memory heaps for each thread automatically', isCorrect: false }
      ],
      explanation: 'The GIL ensures only one thread executes Python bytecode at a time, making multiprocessing necessary for true multi-core CPU parallelism.',
      topic: 'Concurrency & CPython Internals',
      minLevel: 7,
      maxLevel: 10
    },
    {
      id: 'fb_py_l7_2',
      question: 'When implementing a context manager using `__enter__` and `__exit__`, what parameter in `__exit__` handles exceptions raised within the `with` block?',
      codeSnippet: 'class DatabaseConn:\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        # Return True to suppress exception',
      options: [
        { id: 'A', text: 'Returning `True` from `__exit__` suppresses the raised exception', isCorrect: true },
        { id: 'B', text: 'Returning `False` suppresses the exception', isCorrect: false },
        { id: 'C', text: '`__exit__` cannot inspect exception type', isCorrect: false },
        { id: 'D', text: '`__exit__` is called only if no exception occurred', isCorrect: false }
      ],
      explanation: 'If `__exit__` returns `True`, Python suppresses the exception that occurred inside the `with` block.',
      topic: 'Context Managers',
      minLevel: 7,
      maxLevel: 10
    },
    {
      id: 'fb_py_l7_3',
      question: 'What is the primary architectural advantage of using `__slots__` in a high-instance Python class?',
      codeSnippet: 'class Point:\n    __slots__ = ("x", "y")\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y',
      options: [
        { id: 'A', text: 'It prevents instances from creating a dynamic `__dict__`, significantly reducing memory usage', isCorrect: true },
        { id: 'B', text: 'It makes all instance attributes private and read-only automatically', isCorrect: false },
        { id: 'C', text: 'It enables static type checking at runtime', isCorrect: false },
        { id: 'D', text: 'It serializes class objects directly to JSON format', isCorrect: false }
      ],
      explanation: 'By setting `__slots__`, Python allocates a fixed array for attributes instead of a dynamic dict, saving substantial memory when creating millions of objects.',
      topic: 'Advanced OOP & Memory Optimization',
      minLevel: 7,
      maxLevel: 10
    },
    {
      id: 'fb_py_l7_4',
      question: 'In Python asyncio, what happens if an unhandled exception occurs inside a task spawned via `asyncio.create_task()`?',
      codeSnippet: 'task = asyncio.create_task(background_job())',
      options: [
        { id: 'A', text: 'The exception is caught when the task is awaited or result() is called; otherwise a warning is logged on GC', isCorrect: true },
        { id: 'B', text: 'The main event loop crashes immediately upon exception throw', isCorrect: false },
        { id: 'C', text: 'The task automatically retries 3 times before failing silently', isCorrect: false },
        { id: 'D', text: 'Asyncio converts the exception into a syntax warning', isCorrect: false }
      ],
      explanation: 'Exceptions in background tasks are stored in the task object and raised when awaited. If unawaited, a warning is logged when GC reclaims the task.',
      topic: 'Asyncio Architecture',
      minLevel: 7,
      maxLevel: 10
    },
    {
      id: 'fb_py_l7_5',
      question: 'You are designing a high-throughput microservice backend in Python that must process 5,000 I/O-bound REST HTTP requests/sec. What concurrency paradigm should you select?',
      codeSnippet: '# Microservice architecture selection',
      options: [
        { id: 'A', text: 'Asynchronous event-loop (asyncio / FastAPI / Uvicorn)', isCorrect: true },
        { id: 'B', text: 'Synchronous single-threaded script with time.sleep()', isCorrect: false },
        { id: 'C', text: 'Multiprocessing with 5,000 OS worker processes', isCorrect: false },
        { id: 'D', text: 'Subprocess invocations for each HTTP payload', isCorrect: false }
      ],
      explanation: 'Asynchronous event loops excel at handling massive I/O concurrency without the overhead of thousands of OS processes or threads.',
      topic: 'Capstone System Architecture',
      minLevel: 7,
      maxLevel: 10
    }
  ],

  java: [
    // Level 1-2 (Basic)
    {
      id: 'fb_jv_l1_1',
      question: 'In Java, which keyword specifies the entry point method executed by the JVM?',
      codeSnippet: 'public static void _____(String[] args) { }',
      options: [
        { id: 'A', text: 'main', isCorrect: true },
        { id: 'B', text: 'start', isCorrect: false },
        { id: 'C', text: 'run', isCorrect: false },
        { id: 'D', text: 'init', isCorrect: false }
      ],
      explanation: 'The JVM looks for `public static void main(String[] args)` to start program execution.',
      topic: 'Java Syntax',
      minLevel: 1,
      maxLevel: 2
    },
    {
      id: 'fb_jv_l1_2',
      question: 'Which primitive data type in Java stores a 64-bit integer value?',
      codeSnippet: '_____ population = 8000000000L;',
      options: [
        { id: 'A', text: 'int', isCorrect: false },
        { id: 'B', text: 'long', isCorrect: true },
        { id: 'C', text: 'short', isCorrect: false },
        { id: 'D', text: 'byte', isCorrect: false }
      ],
      explanation: '`long` is a 64-bit signed primitive integer type in Java.',
      topic: 'Primitive Types',
      minLevel: 1,
      maxLevel: 2
    },
    {
      id: 'fb_jv_l1_3',
      question: 'Which keyword is used to declare a constant variable in Java whose value cannot be reassigned?',
      codeSnippet: '_____ double PI = 3.14159;',
      options: [
        { id: 'A', text: 'const', isCorrect: false },
        { id: 'B', text: 'static', isCorrect: false },
        { id: 'C', text: 'final', isCorrect: true },
        { id: 'D', text: 'val', isCorrect: false }
      ],
      explanation: 'The `final` keyword prevents a variable value from being reassigned after initialization.',
      topic: 'Keywords',
      minLevel: 1,
      maxLevel: 2
    },
    {
      id: 'fb_jv_l1_4',
      question: 'How do you create an instance of a class named `Student` in Java?',
      codeSnippet: 'Student s = _____ Student();',
      options: [
        { id: 'A', text: 'new', isCorrect: true },
        { id: 'B', text: 'create', isCorrect: false },
        { id: 'C', text: 'alloc', isCorrect: false },
        { id: 'D', text: 'make', isCorrect: false }
      ],
      explanation: 'The `new` operator instantiates a class by allocating memory for a new object.',
      topic: 'Objects & Classes',
      minLevel: 1,
      maxLevel: 2
    },
    {
      id: 'fb_jv_l1_5',
      question: 'Which Java class is commonly used to read input from the console standard input stream?',
      codeSnippet: '_____ scanner = new _____(System.in);',
      options: [
        { id: 'A', text: 'ConsoleReader', isCorrect: false },
        { id: 'B', text: 'Scanner', isCorrect: true },
        { id: 'C', text: 'InputParser', isCorrect: false },
        { id: 'D', text: 'StreamReader', isCorrect: false }
      ],
      explanation: '`java.util.Scanner` parses primitive types and strings using regular expressions from standard input.',
      topic: 'Java I/O',
      minLevel: 1,
      maxLevel: 2
    },

    // Level 3-6 (Foundation / Intermediate)
    {
      id: 'fb_jv_l3_1',
      question: 'In Java, which keyword in a subclass invokes a constructor defined in its direct superclass?',
      codeSnippet: 'class Employee extends Person {\n  public Employee() { _____(); }\n}',
      options: [
        { id: 'A', text: 'this', isCorrect: false },
        { id: 'B', text: 'super', isCorrect: true },
        { id: 'C', text: 'parent', isCorrect: false },
        { id: 'D', text: 'base', isCorrect: false }
      ],
      explanation: '`super()` calls the constructor of the immediate parent superclass.',
      topic: 'Java OOP',
      minLevel: 3,
      maxLevel: 6
    },
    {
      id: 'fb_jv_l3_2',
      question: 'Which interface in the Java Collections Framework provides an ordered collection that allows duplicate elements?',
      codeSnippet: 'List<String> items = new ArrayList<>();',
      options: [
        { id: 'A', text: 'Set', isCorrect: false },
        { id: 'B', text: 'List', isCorrect: true },
        { id: 'C', text: 'Map', isCorrect: false },
        { id: 'D', text: 'Queue', isCorrect: false }
      ],
      explanation: '`java.util.List` maintains positional insertion order and permits duplicates.',
      topic: 'Java Collections',
      minLevel: 3,
      maxLevel: 6
    },
    {
      id: 'fb_jv_l3_3',
      question: 'What access modifier makes a Java class member accessible ONLY within its defining class?',
      codeSnippet: 'class User {\n  _____ String password;\n}',
      options: [
        { id: 'A', text: 'public', isCorrect: false },
        { id: 'B', text: 'protected', isCorrect: false },
        { id: 'C', text: 'private', isCorrect: true },
        { id: 'D', text: 'package-private', isCorrect: false }
      ],
      explanation: '`private` scope restricts member visibility strictly to the declaring class.',
      topic: 'Encapsulation',
      minLevel: 3,
      maxLevel: 6
    },
    {
      id: 'fb_jv_l3_4',
      question: 'What happens when an unchecked exception like `NullPointerException` occurs and is not caught by a try-catch block?',
      codeSnippet: 'String s = null;\ns.length(); // Throws NPE',
      options: [
        { id: 'A', text: 'The executing thread terminates and prints a stack trace to stderr', isCorrect: true },
        { id: 'B', text: 'Java automatically assigns empty string to s', isCorrect: false },
        { id: 'C', text: 'The program ignores the line and continues execution', isCorrect: false },
        { id: 'D', text: 'The code fails to compile at build time', isCorrect: false }
      ],
      explanation: 'Uncaught runtime exceptions abort thread execution and display the call stack trace.',
      topic: 'Exceptions',
      minLevel: 3,
      maxLevel: 6
    },
    {
      id: 'fb_jv_l3_5',
      question: 'Which collection class should be used when key-value lookups are required in Java?',
      codeSnippet: 'Map<Integer, String> userMap = new HashMap<>();',
      options: [
        { id: 'A', text: 'ArrayList', isCorrect: false },
        { id: 'B', text: 'HashSet', isCorrect: false },
        { id: 'C', text: 'HashMap', isCorrect: true },
        { id: 'D', text: 'LinkedList', isCorrect: false }
      ],
      explanation: 'HashMap stores data in key-value pairs and provides O(1) average time complexity for basic operations.',
      topic: 'Map Data Structure',
      minLevel: 3,
      maxLevel: 6
    },

    // Level 7-10 (Advanced / Capstone)
    {
      id: 'fb_jv_l7_1',
      question: 'In Java memory management, where are local variables and object reference variables stored during method execution?',
      codeSnippet: '// Memory allocation: Stack vs Heap',
      options: [
        { id: 'A', text: 'Local reference variables are stored on the Stack; actual object instances reside on the Heap', isCorrect: true },
        { id: 'B', text: 'All object instances and local variables reside strictly on the Stack', isCorrect: false },
        { id: 'C', text: 'All memory is allocated in the Metaspace segment', isCorrect: false },
        { id: 'D', text: 'Primitive types are stored on Heap; objects on Stack', isCorrect: false }
      ],
      explanation: 'Method execution frames and reference pointers live on thread call Stacks, while actual instantiated objects reside on the shared JVM Heap.',
      topic: 'JVM Memory Architecture',
      minLevel: 7,
      maxLevel: 10
    },
    {
      id: 'fb_jv_l7_2',
      question: 'In Concurrent Java programming, what guarantee does the `volatile` keyword provide for a shared class field?',
      codeSnippet: 'private volatile boolean flag = true;',
      options: [
        { id: 'A', text: 'It guarantees memory visibility across threads by reading/writing directly to main memory', isCorrect: true },
        { id: 'B', text: 'It makes compound operations like `i++` atomic automatically', isCorrect: false },
        { id: 'C', text: 'It acquires a mutual exclusion lock on the object', isCorrect: false },
        { id: 'D', text: 'It prevents the class from being garbage collected', isCorrect: false }
      ],
      explanation: '`volatile` ensures updates to a field are immediately visible to all other threads, but does not provide mutual exclusion or atomic compound operations.',
      topic: 'Java Concurrency',
      minLevel: 7,
      maxLevel: 10
    },
    {
      id: 'fb_jv_l7_3',
      question: 'When implementing a custom Java enterprise service, why is `java.util.concurrent.ExecutorService` preferred over manually creating `new Thread()` instances?',
      codeSnippet: 'ExecutorService pool = Executors.newFixedThreadPool(10);',
      options: [
        { id: 'A', text: 'It reuses worker threads from a pool, preventing thread creation overhead and system resource exhaustion', isCorrect: true },
        { id: 'B', text: 'It compiles bytecode directly into native assembly at runtime', isCorrect: false },
        { id: 'C', text: 'It bypasses Java Garbage Collection completely', isCorrect: false },
        { id: 'D', text: 'It disables multi-core CPU scheduling', isCorrect: false }
      ],
      explanation: 'Thread pools manage and reuse threads efficiently, reducing overhead and preventing out-of-memory errors caused by spawning unmanaged threads.',
      topic: 'Thread Management',
      minLevel: 7,
      maxLevel: 10
    },
    {
      id: 'fb_jv_l7_4',
      question: 'In Java 8+, what is the difference between `map()` and `flatMap()` operations on Stream abstractions?',
      codeSnippet: 'List<List<String>> nested = ...;',
      options: [
        { id: 'A', text: '`map()` transforms 1 element to 1 element; `flatMap()` flattens nested streams into a single un-nested stream', isCorrect: true },
        { id: 'B', text: '`map()` runs asynchronously; `flatMap()` runs sequentially', isCorrect: false },
        { id: 'C', text: '`flatMap()` is used only for numeric primitives', isCorrect: false },
        { id: 'D', text: 'They are completely identical synonyms', isCorrect: false }
      ],
      explanation: '`flatMap` takes each element, transforms it to a Stream, and merges all streams into one consolidated Stream.',
      topic: 'Java Functional Streams',
      minLevel: 7,
      maxLevel: 10
    },
    {
      id: 'fb_jv_l7_5',
      question: 'You are architecting a mission-critical Java banking backend that processes financial transactions. How should you prevent race conditions when updating account balances?',
      codeSnippet: '// Financial ledger concurrency architecture',
      options: [
        { id: 'A', text: 'Use atomic data structures (`AtomicLong`) or synchronized locks / database row locking', isCorrect: true },
        { id: 'B', text: 'Use standard primitive `double` without synchronization', isCorrect: false },
        { id: 'C', text: 'Rely on JVM garbage collector thread pauses', isCorrect: false },
        { id: 'D', text: 'Use plain HashMap for ledger storage', isCorrect: false }
      ],
      explanation: 'Atomic updates, explicit locking, or database transactions ensure thread safety and prevent race conditions in financial ledger updates.',
      topic: 'Capstone System Architecture',
      minLevel: 7,
      maxLevel: 10
    }
  ],

  dsa: [
    // Level 1-2 (Basic)
    {
      id: 'fb_dsa_l1_1',
      question: 'What is the Big-O time complexity of accessing an element in an array by its index `arr[3]`?',
      codeSnippet: 'int val = arr[3];',
      options: [
        { id: 'A', text: 'O(1) Constant Time', isCorrect: true },
        { id: 'B', text: 'O(N) Linear Time', isCorrect: false },
        { id: 'C', text: 'O(log N) Logarithmic', isCorrect: false },
        { id: 'D', text: 'O(N^2) Quadratic', isCorrect: false }
      ],
      explanation: 'Array elements are stored in contiguous memory cells, allowing direct index access in O(1) constant time.',
      topic: 'Arrays',
      minLevel: 1,
      maxLevel: 2
    },
    {
      id: 'fb_dsa_l1_2',
      question: 'Which Data Structure operates on a Last-In, First-Out (LIFO) order?',
      codeSnippet: 'push(10), push(20), pop() -> returns 20',
      options: [
        { id: 'A', text: 'Queue', isCorrect: false },
        { id: 'B', text: 'Stack', isCorrect: true },
        { id: 'C', text: 'Linked List', isCorrect: false },
        { id: 'D', text: 'Binary Tree', isCorrect: false }
      ],
      explanation: 'A Stack processes elements in LIFO order (last inserted item is popped first).',
      topic: 'Stacks',
      minLevel: 1,
      maxLevel: 2
    },
    {
      id: 'fb_dsa_l1_3',
      question: 'Which Data Structure operates on a First-In, First-Out (FIFO) principle?',
      codeSnippet: 'enqueue(A), enqueue(B), dequeue() -> returns A',
      options: [
        { id: 'A', text: 'Queue', isCorrect: true },
        { id: 'B', text: 'Stack', isCorrect: false },
        { id: 'C', text: 'Hash Map', isCorrect: false },
        { id: 'D', text: 'Max Heap', isCorrect: false }
      ],
      explanation: 'A Queue processes items in FIFO order (first item added is processed first).',
      topic: 'Queues',
      minLevel: 1,
      maxLevel: 2
    },
    {
      id: 'fb_dsa_l1_4',
      question: 'What requirement must a dataset satisfy before performing Binary Search on it?',
      codeSnippet: 'def binary_search(arr, target): ...',
      options: [
        { id: 'A', text: 'The array must be sorted in ascending or descending order', isCorrect: true },
        { id: 'B', text: 'The array must contain only positive integers', isCorrect: false },
        { id: 'C', text: 'The array size must be an even number', isCorrect: false },
        { id: 'D', text: 'The array must be implemented as a Linked List', isCorrect: false }
      ],
      explanation: 'Binary Search requires a sorted array to divide the search space in half at each step.',
      topic: 'Searching',
      minLevel: 1,
      maxLevel: 2
    },
    {
      id: 'fb_dsa_l1_5',
      question: 'What is a node in a Singly Linked List comprised of?',
      codeSnippet: 'class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None',
      options: [
        { id: 'A', text: 'A data value and a pointer/reference to the next node', isCorrect: true },
        { id: 'B', text: 'Two data values and no pointers', isCorrect: false },
        { id: 'C', text: 'An index number and an array reference', isCorrect: false },
        { id: 'D', text: 'A key and a hash code', isCorrect: false }
      ],
      explanation: 'Nodes in a singly linked list store payload data and a pointer to the subsequent node.',
      topic: 'Linked Lists',
      minLevel: 1,
      maxLevel: 2
    },

    // Level 3-6 (Foundation / Intermediate)
    {
      id: 'fb_dsa_l3_1',
      question: 'Given an array `nums = [2, 7, 11, 15]` and `target = 9`, what technique yields O(N) time complexity to find the two sum indices?',
      codeSnippet: 'nums = [2, 7, 11, 15], target = 9',
      options: [
        { id: 'A', text: 'Hash Map (storing value -> index mapping)', isCorrect: true },
        { id: 'B', text: 'Nested loops checking all pairs O(N^2)', isCorrect: false },
        { id: 'C', text: 'Triple nested loops O(N^3)', isCorrect: false },
        { id: 'D', text: 'Linear Search with recursive stack', isCorrect: false }
      ],
      explanation: 'A Hash Map checks if `target - num` exists in O(1) time per element, achieving total O(N) time.',
      topic: 'Hash Maps & Algorithms',
      minLevel: 3,
      maxLevel: 6
    },
    {
      id: 'fb_dsa_l3_2',
      question: 'Which data structure is optimal to verify balanced bracket strings like `"()[]{}"` in O(N) linear time?',
      codeSnippet: 's = "()[]{}"',
      options: [
        { id: 'A', text: 'Stack', isCorrect: true },
        { id: 'B', text: 'Queue', isCorrect: false },
        { id: 'C', text: 'Binary Search Tree', isCorrect: false },
        { id: 'D', text: 'Priority Queue', isCorrect: false }
      ],
      explanation: 'A Stack pushes open brackets and pops to match closing brackets in LIFO order.',
      topic: 'Stack Applications',
      minLevel: 3,
      maxLevel: 6
    },
    {
      id: 'fb_dsa_l3_3',
      question: 'What is the average time complexity of Binary Search on a sorted array of size N?',
      codeSnippet: 'binary_search(sorted_arr, target)',
      options: [
        { id: 'A', text: 'O(log N)', isCorrect: true },
        { id: 'B', text: 'O(N)', isCorrect: false },
        { id: 'C', text: 'O(N log N)', isCorrect: false },
        { id: 'D', text: 'O(1)', isCorrect: false }
      ],
      explanation: 'Binary search repeatedly halves the search space, giving logarithmic O(log N) time complexity.',
      topic: 'Algorithm Analysis',
      minLevel: 3,
      maxLevel: 6
    },
    {
      id: 'fb_dsa_l3_4',
      question: 'In a Binary Search Tree (BST), what property holds true for every node N?',
      codeSnippet: '// Binary Search Tree Invariant',
      options: [
        { id: 'A', text: 'Left subtree values are smaller than N; right subtree values are greater than N', isCorrect: true },
        { id: 'B', text: 'Parent node value is always smaller than both child nodes', isCorrect: false },
        { id: 'C', text: 'All leaf nodes are at the exact same depth level', isCorrect: false },
        { id: 'D', text: 'Nodes are stored in sequential contiguous memory array cells', isCorrect: false }
      ],
      explanation: 'In a BST, all keys in the left child subtree are less than the node key, and all keys in the right child subtree are greater.',
      topic: 'Trees',
      minLevel: 3,
      maxLevel: 6
    },
    {
      id: 'fb_dsa_l3_5',
      question: 'What algorithm sorting technique divides the array into two halves, recursively sorts them, and merges the sorted halves?',
      codeSnippet: 'def sort(arr):\n    # Divide into left & right halves\n    # Merge sorted halves',
      options: [
        { id: 'A', text: 'Merge Sort', isCorrect: true },
        { id: 'B', text: 'Bubble Sort', isCorrect: false },
        { id: 'C', text: 'Selection Sort', isCorrect: false },
        { id: 'D', text: 'Insertion Sort', isCorrect: false }
      ],
      explanation: 'Merge Sort is a Divide and Conquer algorithm that guarantees O(N log N) time complexity in all cases.',
      topic: 'Sorting Algorithms',
      minLevel: 3,
      maxLevel: 6
    },

    // Level 7-10 (Advanced / Capstone)
    {
      id: 'fb_dsa_l7_1',
      question: 'What traversal algorithm visits nodes level-by-level in a Graph or Binary Tree using a Queue data structure?',
      codeSnippet: 'def traverse(root):\n    q = collections.deque([root])',
      options: [
        { id: 'A', text: 'Breadth-First Search (BFS)', isCorrect: true },
        { id: 'B', text: 'Depth-First Search (DFS)', isCorrect: false },
        { id: 'C', text: 'In-Order Traversal', isCorrect: false },
        { id: 'D', text: 'Post-Order Traversal', isCorrect: false }
      ],
      explanation: 'BFS explores graph/tree vertices level-by-level using a FIFO Queue, optimal for finding shortest paths in unweighted graphs.',
      topic: 'Graph Algorithms',
      minLevel: 7,
      maxLevel: 10
    },
    {
      id: 'fb_dsa_l7_2',
      question: 'In Dynamic Programming, what problem property allows overlapping subproblem solutions to be memoized and reused?',
      codeSnippet: 'memo = {}\ndef fib(n): ...',
      options: [
        { id: 'A', text: 'Optimal Substructure & Overlapping Subproblems', isCorrect: true },
        { id: 'B', text: 'Greedy Choice Property', isCorrect: false },
        { id: 'C', text: 'Linear Separability', isCorrect: false },
        { id: 'D', text: 'Deterministic Finite Automata', isCorrect: false }
      ],
      explanation: 'DP applies when a problem has optimal substructure (solution built from optimal sub-solutions) and overlapping subproblems.',
      topic: 'Dynamic Programming',
      minLevel: 7,
      maxLevel: 10
    },
    {
      id: 'fb_dsa_l7_3',
      question: 'Which shortest path algorithm computes single-source shortest paths in a graph with non-negative edge weights using a Min-Heap?',
      codeSnippet: '// Graph algorithm with priority queue',
      options: [
        { id: 'A', text: 'Dijkstra\'s Algorithm', isCorrect: true },
        { id: 'B', text: 'Bellman-Ford Algorithm', isCorrect: false },
        { id: 'C', text: 'Floyd-Warshall Algorithm', isCorrect: false },
        { id: 'D', text: 'Kruskal\'s MST Algorithm', isCorrect: false }
      ],
      explanation: 'Dijkstra\'s algorithm uses a Priority Queue (Min-Heap) to find single-source shortest paths in O((V + E) log V) time.',
      topic: 'Advanced Graph Algorithms',
      minLevel: 7,
      maxLevel: 10
    },
    {
      id: 'fb_dsa_l7_4',
      question: 'What is the worst-case space complexity of Depth-First Search (DFS) on a tree of height H?',
      codeSnippet: 'def dfs(node):\n    # Recursive call stack',
      options: [
        { id: 'A', text: 'O(H) proportional to tree height', isCorrect: true },
        { id: 'B', text: 'O(N^2) quadratic space', isCorrect: false },
        { id: 'C', text: 'O(1) constant space', isCorrect: false },
        { id: 'D', text: 'O(N log N)', isCorrect: false }
      ],
      explanation: 'DFS uses recursion call stack space proportional to the maximum height H of the tree/path.',
      topic: 'Algorithm Space Analysis',
      minLevel: 7,
      maxLevel: 10
    },
    {
      id: 'fb_dsa_l7_5',
      question: 'You are building a high-performance in-memory cache system with LRU (Least Recently Used) eviction policy. Which data structures combination achieves O(1) get and O(1) put operations?',
      codeSnippet: '// LRU Cache Architecture Design',
      options: [
        { id: 'A', text: 'Hash Map + Doubly Linked List', isCorrect: true },
        { id: 'B', text: 'Array + Binary Search Tree', isCorrect: false },
        { id: 'C', text: 'Stack + Queue', isCorrect: false },
        { id: 'D', text: 'Single Linked List + Heap', isCorrect: false }
      ],
      explanation: 'A Hash Map provides O(1) key lookup to nodes, while a Doubly Linked List allows O(1) node removal and re-insertion at head.',
      topic: 'Capstone System Architecture',
      minLevel: 7,
      maxLevel: 10
    }
  ],

  sql: [
    // Level 1-2 (Basic)
    {
      id: 'fb_sql_l1_1',
      question: 'Which SQL keyword is used to retrieve data records from a database table?',
      codeSnippet: '_____ name, email FROM users;',
      options: [
        { id: 'A', text: 'SELECT', isCorrect: true },
        { id: 'B', text: 'GET', isCorrect: false },
        { id: 'C', text: 'FETCH', isCorrect: false },
        { id: 'D', text: 'QUERY', isCorrect: false }
      ],
      explanation: 'SELECT extracts rows and columns from one or more database tables.',
      topic: 'SQL Basics',
      minLevel: 1,
      maxLevel: 2
    },
    {
      id: 'fb_sql_l1_2',
      question: 'Which SQL clause filters records that satisfy a specified conditional criteria?',
      codeSnippet: 'SELECT * FROM students _____ gpa >= 3.5;',
      options: [
        { id: 'A', text: 'WHERE', isCorrect: true },
        { id: 'B', text: 'GROUP BY', isCorrect: false },
        { id: 'C', text: 'ORDER BY', isCorrect: false },
        { id: 'D', text: 'HAVING', isCorrect: false }
      ],
      explanation: 'WHERE filters individual records before any grouping or aggregation occurs.',
      topic: 'Filtering',
      minLevel: 1,
      maxLevel: 2
    },
    {
      id: 'fb_sql_l1_3',
      question: 'Which clause sorts the result set in ascending or descending order?',
      codeSnippet: 'SELECT * FROM products _____ price DESC;',
      options: [
        { id: 'A', text: 'ORDER BY', isCorrect: true },
        { id: 'B', text: 'SORT BY', isCorrect: false },
        { id: 'C', text: 'GROUP BY', isCorrect: false },
        { id: 'D', text: 'ARRANGE BY', isCorrect: false }
      ],
      explanation: 'ORDER BY sorts returned records by one or more specified columns.',
      topic: 'Sorting',
      minLevel: 1,
      maxLevel: 2
    },
    {
      id: 'fb_sql_l1_4',
      question: 'Which SQL keyword is used to add new rows of data into a table?',
      codeSnippet: '_____ INTO users (name, age) VALUES ("Alice", 24);',
      options: [
        { id: 'A', text: 'INSERT', isCorrect: true },
        { id: 'B', text: 'ADD', isCorrect: false },
        { id: 'C', text: 'PUT', isCorrect: false },
        { id: 'D', text: 'APPEND', isCorrect: false }
      ],
      explanation: 'INSERT INTO inserts new records into a relational table.',
      topic: 'Data Manipulation',
      minLevel: 1,
      maxLevel: 2
    },
    {
      id: 'fb_sql_l1_5',
      question: 'Which aggregate function counts the total number of rows returned by a query?',
      codeSnippet: 'SELECT ____(*) FROM orders;',
      options: [
        { id: 'A', text: 'COUNT', isCorrect: true },
        { id: 'B', text: 'SUM', isCorrect: false },
        { id: 'C', text: 'TOTAL', isCorrect: false },
        { id: 'D', text: 'NUMBER', isCorrect: false }
      ],
      explanation: 'COUNT() returns the total count of matching records.',
      topic: 'Aggregate Functions',
      minLevel: 1,
      maxLevel: 2
    },

    // Level 3-6 (Foundation / Intermediate)
    {
      id: 'fb_sql_l3_1',
      question: 'Which type of SQL JOIN returns only records that have matching values in both tables?',
      codeSnippet: 'SELECT * FROM users u _____ JOIN orders o ON u.id = o.user_id;',
      options: [
        { id: 'A', text: 'INNER JOIN', isCorrect: true },
        { id: 'B', text: 'LEFT JOIN', isCorrect: false },
        { id: 'C', text: 'RIGHT JOIN', isCorrect: false },
        { id: 'D', text: 'FULL OUTER JOIN', isCorrect: false }
      ],
      explanation: 'INNER JOIN selects records that have matching keys in both joined tables.',
      topic: 'Joins',
      minLevel: 3,
      maxLevel: 6
    },
    {
      id: 'fb_sql_l3_2',
      question: 'What SQL clause is used to filter aggregated group results produced by a `GROUP BY` clause?',
      codeSnippet: 'SELECT dept, COUNT(*) FROM emp GROUP BY dept _____ COUNT(*) > 5;',
      options: [
        { id: 'A', text: 'HAVING', isCorrect: true },
        { id: 'B', text: 'WHERE', isCorrect: false },
        { id: 'C', text: 'FILTER', isCorrect: false },
        { id: 'D', text: 'LIMIT', isCorrect: false }
      ],
      explanation: 'HAVING filters aggregate groups, whereas WHERE filters individual rows prior to grouping.',
      topic: 'Aggregation & Filtering',
      minLevel: 3,
      maxLevel: 6
    },
    {
      id: 'fb_sql_l3_3',
      question: 'Which SQL statement modifies existing records in a database table?',
      codeSnippet: '_____ users SET status = "active" WHERE status = "pending";',
      options: [
        { id: 'A', text: 'UPDATE', isCorrect: true },
        { id: 'B', text: 'MODIFY', isCorrect: false },
        { id: 'C', text: 'CHANGE', isCorrect: false },
        { id: 'D', text: 'ALTER', isCorrect: false }
      ],
      explanation: 'UPDATE modifies data in existing table rows matching the WHERE criteria.',
      topic: 'Data Updates',
      minLevel: 3,
      maxLevel: 6
    },
    {
      id: 'fb_sql_l3_4',
      question: 'What database object speeds up data retrieval operations on specified table columns?',
      codeSnippet: 'CREATE _____ idx_user_email ON users(email);',
      options: [
        { id: 'A', text: 'INDEX', isCorrect: true },
        { id: 'B', text: 'VIEW', isCorrect: false },
        { id: 'C', text: 'TRIGGER', isCorrect: false },
        { id: 'D', text: 'PROCEDURE', isCorrect: false }
      ],
      explanation: 'Database Indexes build B-Tree or Hash data structures to optimize lookup performance.',
      topic: 'Database Optimization',
      minLevel: 3,
      maxLevel: 6
    },
    {
      id: 'fb_sql_l3_5',
      question: 'What is the outcome of a LEFT JOIN between Table A (10 rows) and Table B if 4 rows match?',
      codeSnippet: 'SELECT * FROM TableA A LEFT JOIN TableB B ON A.id = B.a_id;',
      options: [
        { id: 'A', text: 'At least 10 rows (all Table A rows kept, with NULLs for non-matching B rows)', isCorrect: true },
        { id: 'B', text: 'Exactly 4 rows', isCorrect: false },
        { id: 'C', text: 'Exactly 14 rows', isCorrect: false },
        { id: 'D', text: '0 rows', isCorrect: false }
      ],
      explanation: 'LEFT JOIN keeps all rows from the left table regardless of whether a match exists in the right table.',
      topic: 'Outer Joins',
      minLevel: 3,
      maxLevel: 6
    },

    // Level 7-10 (Advanced / Capstone)
    {
      id: 'fb_sql_l7_1',
      question: 'What window function computes a row rank within an ordered partition without gaps in ranking sequence?',
      codeSnippet: 'SELECT name, score, _____() OVER (PARTITION BY dept ORDER BY score DESC) FROM sales;',
      options: [
        { id: 'A', text: 'DENSE_RANK()', isCorrect: true },
        { id: 'B', text: 'RANK()', isCorrect: false },
        { id: 'C', text: 'ROW_NUMBER()', isCorrect: false },
        { id: 'D', text: 'NTILE()', isCorrect: false }
      ],
      explanation: 'DENSE_RANK() assigns consecutive rank numbers without skipping values when ties occur.',
      topic: 'Window Functions',
      minLevel: 7,
      maxLevel: 10
    },
    {
      id: 'fb_sql_l7_2',
      question: 'In SQL transaction management, what ACID property guarantees that all operations in a transaction complete successfully or all are rolled back?',
      codeSnippet: 'BEGIN TRANSACTION;\n  UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n  UPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;',
      options: [
        { id: 'A', text: 'Atomicity (All or Nothing)', isCorrect: true },
        { id: 'B', text: 'Consistency', isCorrect: false },
        { id: 'C', text: 'Isolation', isCorrect: false },
        { id: 'D', text: 'Durability', isCorrect: false }
      ],
      explanation: 'Atomicity ensures that a transaction is treated as a single indivisible unit of work.',
      topic: 'Transactions & ACID',
      minLevel: 7,
      maxLevel: 10
    },
    {
      id: 'fb_sql_l7_3',
      question: 'What SQL construct defined with `WITH cte_name AS (...)` creates a temporary named result set within a query execution scope?',
      codeSnippet: 'WITH MonthlySummary AS (\n  SELECT month, SUM(amount) as total FROM sales GROUP BY month\n)\nSELECT * FROM MonthlySummary;',
      options: [
        { id: 'A', text: 'Common Table Expression (CTE)', isCorrect: true },
        { id: 'B', text: 'Stored Procedure', isCorrect: false },
        { id: 'C', text: 'Materialized View', isCorrect: false },
        { id: 'D', text: 'Database Trigger', isCorrect: false }
      ],
      explanation: 'A CTE (Common Table Expression) defines a temporary result set for modular, readable complex queries.',
      topic: 'Advanced SQL CTEs',
      minLevel: 7,
      maxLevel: 10
    },
    {
      id: 'fb_sql_l7_4',
      question: 'What isolation level prevents non-repeatable reads and dirty reads but may allow phantom reads in ANSI SQL standard?',
      codeSnippet: 'SET TRANSACTION ISOLATION LEVEL _____;',
      options: [
        { id: 'A', text: 'REPEATABLE READ', isCorrect: true },
        { id: 'B', text: 'READ UNCOMMITTED', isCorrect: false },
        { id: 'C', text: 'READ COMMITTED', isCorrect: false },
        { id: 'D', text: 'SERIALIZABLE', isCorrect: false }
      ],
      explanation: 'REPEATABLE READ prevents reading uncommitted changes and guarantees consistent data reads within the transaction.',
      topic: 'Transaction Isolation Levels',
      minLevel: 7,
      maxLevel: 10
    },
    {
      id: 'fb_sql_l7_5',
      question: 'You are optimizing an enterprise analytics query analyzing 500 Million transaction rows that takes 45 seconds due to full table scans. Which strategy provides maximum query acceleration?',
      codeSnippet: '// Big Data Analytics Query Optimization',
      options: [
        { id: 'A', text: 'Apply table partitioning (by date/region) and clustered indexing on filter columns', isCorrect: true },
        { id: 'B', text: 'Convert all VARCHAR columns to TEXT data types', isCorrect: false },
        { id: 'C', text: 'Remove all primary key constraints', isCorrect: false },
        { id: 'D', text: 'Replace SELECT columns with SELECT *', isCorrect: false }
      ],
      explanation: 'Table partitioning eliminates unnecessary partition scans (partition pruning), and clustered indexes avoid full table scans.',
      topic: 'Capstone System Architecture',
      minLevel: 7,
      maxLevel: 10
    }
  ],

  aptitude: [
    // General Aptitude / Logic across levels
    {
      id: 'fb_apt_l1_1',
      question: 'What is the next term in the arithmetic sequence: 4, 8, 12, 16, ___?',
      codeSnippet: 'Sequence: +4 progression',
      options: [
        { id: 'A', text: '20', isCorrect: true },
        { id: 'B', text: '24', isCorrect: false },
        { id: 'C', text: '18', isCorrect: false },
        { id: 'D', text: '22', isCorrect: false }
      ],
      explanation: 'The sequence increases by 4 in each step. 16 + 4 = 20.',
      topic: 'Numerical Reasoning',
      minLevel: 1,
      maxLevel: 3
    },
    {
      id: 'fb_apt_l1_2',
      question: 'A product costs $80 after a 20% discount. What was its original price?',
      codeSnippet: 'Price * (1 - 0.20) = $80',
      options: [
        { id: 'A', text: '$100', isCorrect: true },
        { id: 'B', text: '$96', isCorrect: false },
        { id: 'C', text: '$110', isCorrect: false },
        { id: 'D', text: '$105', isCorrect: false }
      ],
      explanation: '80% of Original = 80 => Original = 80 / 0.8 = $100.',
      topic: 'Quantitative Aptitude',
      minLevel: 1,
      maxLevel: 3
    },
    {
      id: 'fb_apt_l1_3',
      question: 'If 6 workers complete a task in 12 days, how many days will 8 workers take working at the same pace?',
      codeSnippet: '6 * 12 = 8 * Days',
      options: [
        { id: 'A', text: '9 days', isCorrect: true },
        { id: 'B', text: '10 days', isCorrect: false },
        { id: 'C', text: '8 days', isCorrect: false },
        { id: 'D', text: '12 days', isCorrect: false }
      ],
      explanation: 'Total work = 6 * 12 = 72 worker-days. Days for 8 workers = 72 / 8 = 9 days.',
      topic: 'Work & Time',
      minLevel: 1,
      maxLevel: 3
    },
    {
      id: 'fb_apt_l1_4',
      question: 'What is the average of numbers 15, 25, 35, and 45?',
      codeSnippet: '(15 + 25 + 35 + 45) / 4',
      options: [
        { id: 'A', text: '30', isCorrect: true },
        { id: 'B', text: '28', isCorrect: false },
        { id: 'C', text: '32', isCorrect: false },
        { id: 'D', text: '35', isCorrect: false }
      ],
      explanation: 'Sum = 120. Average = 120 / 4 = 30.',
      topic: 'Averages',
      minLevel: 1,
      maxLevel: 3
    },
    {
      id: 'fb_apt_l1_5',
      question: 'In a code language, if "CAT" is coded as 3120, how is "DOG" coded?',
      codeSnippet: 'C=3, A=1, T=20',
      options: [
        { id: 'A', text: '4157', isCorrect: true },
        { id: 'B', text: '4158', isCorrect: false },
        { id: 'C', text: '4147', isCorrect: false },
        { id: 'D', text: '3157', isCorrect: false }
      ],
      explanation: 'Each letter is mapped to its alphabet position: D=4, O=15, G=7 -> 4157.',
      topic: 'Logical Coding',
      minLevel: 1,
      maxLevel: 3
    },

    // Higher levels for aptitude
    {
      id: 'fb_apt_l4_1',
      question: 'A train 150m long moving at 54 km/h crosses a platform in 20 seconds. What is the length of the platform?',
      codeSnippet: 'Speed = 54 * (5/18) = 15 m/s\nDistance = 15 * 20 = 300m',
      options: [
        { id: 'A', text: '150 meters', isCorrect: true },
        { id: 'B', text: '200 meters', isCorrect: false },
        { id: 'C', text: '100 meters', isCorrect: false },
        { id: 'D', text: '180 meters', isCorrect: false }
      ],
      explanation: 'Speed = 15 m/s. Total distance = 15 * 20 = 300m. Platform length = 300 - 150 = 150m.',
      topic: 'Speed & Distance',
      minLevel: 4,
      maxLevel: 10
    },
    {
      id: 'fb_apt_l4_2',
      question: 'What is the probability of rolling a sum of 7 with two fair 6-sided dice?',
      codeSnippet: 'Pairs totaling 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1)',
      options: [
        { id: 'A', text: '6/36 = 1/6', isCorrect: true },
        { id: 'B', text: '1/12', isCorrect: false },
        { id: 'C', text: '1/4', isCorrect: false },
        { id: 'D', text: '5/36', isCorrect: false }
      ],
      explanation: 'There are 6 favorable outcomes out of 36 total possibilities, yielding 6/36 = 1/6.',
      topic: 'Probability',
      minLevel: 4,
      maxLevel: 10
    },
    {
      id: 'fb_apt_l4_3',
      question: 'In how many different ways can the letters of the word "LEADER" be arranged?',
      codeSnippet: 'Letters: L, E, A, D, E, R (Total 6, E repeated 2 times)',
      options: [
        { id: 'A', text: '360', isCorrect: true },
        { id: 'B', text: '720', isCorrect: false },
        { id: 'C', text: '180', isCorrect: false },
        { id: 'D', text: '540', isCorrect: false }
      ],
      explanation: 'Total arrangements = 6! / 2! = 720 / 2 = 360.',
      topic: 'Permutations & Combinations',
      minLevel: 4,
      maxLevel: 10
    },
    {
      id: 'fb_apt_l4_4',
      question: 'A sum of money doubles itself in 5 years at simple interest. What is the annual interest rate?',
      codeSnippet: 'SI = Principal -> P * R * 5 / 100 = P',
      options: [
        { id: 'A', text: '20%', isCorrect: true },
        { id: 'B', text: '15%', isCorrect: false },
        { id: 'C', text: '10%', isCorrect: false },
        { id: 'D', text: '25%', isCorrect: false }
      ],
      explanation: 'SI = P. So P * R * 5 / 100 = P => R = 100 / 5 = 20%.',
      topic: 'Simple Interest',
      minLevel: 4,
      maxLevel: 10
    },
    {
      id: 'fb_apt_l4_5',
      question: 'If A is B\'s sister, C is B\'s mother, D is C\'s father, and E is D\'s mother, how is A related to D?',
      codeSnippet: 'Family Tree Logic',
      options: [
        { id: 'A', text: 'Granddaughter', isCorrect: true },
        { id: 'B', text: 'Daughter', isCorrect: false },
        { id: 'C', text: 'Grandmother', isCorrect: false },
        { id: 'D', text: 'Niece', isCorrect: false }
      ],
      explanation: 'C is A\'s mother. D is C\'s father. Therefore, D is A\'s grandfather, making A his granddaughter.',
      topic: 'Blood Relations',
      minLevel: 4,
      maxLevel: 10
    }
  ]
};

// Helper: Read configured Gemini API Key from localStorage or environment
function getGeminiApiKey() {
  return localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
}

// Helper: Fingerprint history management for preventing duplicate questions
const HISTORY_KEY = 'rookx_question_history';

export function getQuestionHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

export function saveQuestionToHistory(fingerprint) {
  if (!fingerprint) return;
  try {
    const history = getQuestionHistory();
    if (!history.includes(fingerprint)) {
      history.push(fingerprint);
      // Keep recent 200 fingerprints
      if (history.length > 200) history.shift();
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  } catch (e) {
    // Ignore storage errors
  }
}

/**
 * Enhanced normalized fingerprinting to catch exact & reworded duplicate questions
 */
export function generateFingerprint(questionText) {
  if (!questionText) return '';
  return questionText
    .toLowerCase()
    .trim()
    .replace(/\b(what|which|how|is|are|the|a|an|in|of|for|to|with|following|output|does|keyword|used|using|use|code|snippet|statement|function|method|builtin|built-in|display|displays|show|shows|print|printing|formatted|value|result)\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 60);
}

// Extract JSON array or object from raw Gemini text output
function extractJsonFromText(rawText) {
  if (!rawText) return null;
  
  try {
    return JSON.parse(rawText);
  } catch (e) {
    const match = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (err) {
        // continue
      }
    }

    const bracketMatch = rawText.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (bracketMatch && bracketMatch[1]) {
      try {
        return JSON.parse(bracketMatch[1]);
      } catch (err) {
        return null;
      }
    }
  }
  return null;
}

/**
 * Fallback question retriever tailored by level & category
 */
export function getFallbackQuestions(category = 'python', count = 5, quizLevel = 1) {
  const catKey = (category || 'python').toLowerCase();
  
  // Find matching pool or fallback to python/dsa
  let pool = FALLBACK_QUESTIONS[catKey];
  if (!pool || pool.length === 0) {
    if (catKey.includes('java')) pool = FALLBACK_QUESTIONS['java'];
    else if (catKey.includes('sql') || catKey.includes('data')) pool = FALLBACK_QUESTIONS['sql'];
    else if (catKey.includes('dsa') || catKey.includes('algo')) pool = FALLBACK_QUESTIONS['dsa'];
    else if (catKey.includes('apt') || catKey.includes('math') || catKey.includes('logic')) pool = FALLBACK_QUESTIONS['aptitude'];
    else pool = FALLBACK_QUESTIONS['python'];
  }

  const normLevel = Math.max(1, Math.min(10, parseInt(quizLevel, 10) || 1));
  const history = getQuestionHistory();

  // Primary filter by level appropriateness
  let candidates = pool.filter(q => {
    const minL = q.minLevel || 1;
    const maxL = q.maxLevel || 10;
    return normLevel >= minL && normLevel <= maxL;
  });

  // If level specific candidates are fewer than requested, expand to entire pool
  if (candidates.length < count) {
    candidates = [...pool];
  }

  // Shuffle candidates
  const shuffled = [...candidates].sort(() => 0.5 - Math.random());

  // Filter out recent history where possible while building batch of `count`
  const selectedBatch = [];
  const selectedFps = new Set();

  for (const q of shuffled) {
    const fp = generateFingerprint(q.question);
    if (selectedFps.has(fp)) continue; // avoid duplicates within batch

    selectedBatch.push({
      ...q,
      id: q.id || `fb_${catKey}_lvl${normLevel}_${selectedBatch.length + 1}`
    });
    selectedFps.add(fp);
    saveQuestionToHistory(fp);

    if (selectedBatch.length >= count) break;
  }

  // If still under count, fill remaining from shuffled ignoring history
  if (selectedBatch.length < count) {
    for (const q of shuffled) {
      if (selectedBatch.some(b => b.question === q.question)) continue;
      selectedBatch.push({
        ...q,
        id: `fb_${catKey}_lvl${normLevel}_${selectedBatch.length + 1}`
      });
      if (selectedBatch.length >= count) break;
    }
  }

  return selectedBatch.slice(0, count);
}

/**
 * Generate Context-Aware Multiple Choice Questions using Gemini AI
 * @param {Object} params
 * @param {string} params.category - e.g. 'dsa', 'python', 'java', 'js', 'sql', 'aptitude'
 * @param {string} params.career - e.g. 'Software Engineer', 'Data Scientist'
 * @param {string} params.roadmapWeek - e.g. 'Week 1', 'Week 2'
 * @param {number} params.quizLevel - 1 through 10
 * @param {Array<string>} params.weeklyTasks - Topics covered this week
 * @param {number} params.count - Number of questions to generate (default 5)
 */
export async function generateAIQuestions({
  category = 'python',
  career = 'Software Engineer',
  roadmapWeek = 'Level 1',
  quizLevel = 1,
  weeklyTasks = [],
  count = 5
}) {
  const apiKey = getGeminiApiKey();
  const normLevel = Math.max(1, Math.min(10, parseInt(quizLevel, 10) || 1));
  const tierInfo = getLevelDifficultyTier(normLevel);

  // If no API key configured, return fallbacks gracefully
  if (!apiKey) {
    return getFallbackQuestions(category, count, normLevel);
  }

  const tasksText = weeklyTasks.length > 0 ? weeklyTasks.join(', ') : 'core concepts';
  const history = getQuestionHistory();

  const prompt = `You are an expert technical interviewer for the RookX career platform.
Generate exactly ${count} distinct multiple choice questions for a student pursuing a career as a "${career}".

CONTEXT & PROGRESSIVE DIFFICULTY:
- Career Pathway: ${career}
- Skill / Category: ${category}
- Roadmap Stage: ${roadmapWeek}
- Quiz Level: Level ${normLevel} of 10
- Target Difficulty Tier: ${tierInfo.label} (${tierInfo.name})
- Tier Focus: ${tierInfo.description}
- Target Topics: ${tasksText}

STRICT DIFFICULTY & PROGRESSION RULES:
1. Level 1 must be strictly BASIC (syntax recognition, fundamental definitions, beginner friendly).
2. Level 10 must be strictly CAPSTONE (complex real-world workplace scenarios, architectural trade-offs, multi-step engineering logic).
3. Do NOT make Level 1 difficult or Level 10 simple definitions. Make the question style match ${tierInfo.label}.
4. All ${count} questions MUST be 100% unique from each other and test DIFFERENT concepts/situations within the target skill.
5. Do NOT repeat questions testing the exact same concepts.

JSON OUTPUT SCHEMA (Return ONLY a valid minified JSON array of question objects, no markdown outside JSON):
[
  {
    "id": "q_gen_1",
    "question": "Question text here",
    "codeSnippet": "optional short code snippet if relevant, or empty string",
    "options": [
      { "id": "A", "text": "Option A text", "isCorrect": true },
      { "id": "B", "text": "Option B text", "isCorrect": false },
      { "id": "C", "text": "Option C text", "isCorrect": false },
      { "id": "D", "text": "Option D text", "isCorrect": false }
    ],
    "explanation": "Clear step-by-step solution explanation",
    "topic": "${category}",
    "difficulty": "${tierInfo.label}"
  }
]
- Exactly ONE option per question must have "isCorrect": true.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 3072 }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API call returned non-200 status, using fallback questions.');
      return getFallbackQuestions(category, count, normLevel);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = extractJsonFromText(rawText);

    if (Array.isArray(parsed) && parsed.length > 0) {
      const selectedBatch = [];
      const batchFps = new Set();

      for (const q of parsed) {
        if (!q.question || !Array.isArray(q.options) || q.options.length < 2) continue;

        const fp = generateFingerprint(q.question);
        
        // Skip if duplicate within batch or in history
        if (batchFps.has(fp) || history.includes(fp)) {
          continue;
        }

        batchFps.add(fp);
        saveQuestionToHistory(fp);
        selectedBatch.push({
          ...q,
          id: q.id || `q_lvl${normLevel}_${selectedBatch.length + 1}`
        });

        if (selectedBatch.length >= count) break;
      }

      // If we got enough unique AI questions, return them!
      if (selectedBatch.length >= count) {
        return selectedBatch.slice(0, count);
      }

      // If AI generated fewer than `count` unique questions, complement with fallback questions
      const fallbacksNeeded = count - selectedBatch.length;
      const extraFallbacks = getFallbackQuestions(category, fallbacksNeeded, normLevel);
      
      const combined = [...selectedBatch];
      for (const fb of extraFallbacks) {
        const fp = generateFingerprint(fb.question);
        if (!combined.some(c => generateFingerprint(c.question) === fp)) {
          combined.push(fb);
        }
        if (combined.length >= count) break;
      }

      return combined.slice(0, count);
    }
  } catch (err) {
    console.warn('Error calling Gemini API for question generation:', err);
  }

  // Fallback return if AI generation failed or returned invalid data
  return getFallbackQuestions(category, count, normLevel);
}

