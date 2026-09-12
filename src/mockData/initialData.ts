import {
  User,
  Assessment,
  Hackathon,
  Team,
  TeamInvitation,
  Activity,
  PartnerCollege,
  RecruitmentRequirement,
  CandidateShortlistRecord,
  RecruiterActivityRecord
} from '../types';

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'python-core',
    skillName: 'Python',
    category: 'Backend',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    questionCount: 10,
    icon: 'Terminal',
    description: 'Evaluate proficiency in Python fundamentals, list comprehensions, decorators, generators, memory management, and OOP.',
    syllabus: [
      'Data structures, mutability, and slicing',
      'List & dictionary comprehensions',
      'Decorators and *args/**kwargs unpacking',
      'Generators and iterators',
      'Global Interpreter Lock & Memory Management'
    ],
    passingScore: 70,
    questions: [
      {
        id: 'py-1',
        question: 'What will be the output of the following list comprehension snippet?',
        codeSnippet: `data = [1, 2, 3, 4, 5]
res = [x * 2 for x in data if x % 2 == 0]
print(res)`,
        codeLanguage: 'python',
        options: ['[2, 4, 6, 8, 10]', '[4, 8]', '[2, 6, 10]', '[4, 16]'],
        correctAnswer: 1,
        explanation: 'Only even numbers from data (2 and 4) are selected and multiplied by 2, yielding [4, 8].',
        category: 'Data Structures'
      },
      {
        id: 'py-2',
        question: 'What is the primary difference between a generator function and a standard return function in Python?',
        options: [
          'Generators use yield and generate values lazily on-the-fly, consuming O(1) memory',
          'Generators execute faster because they compile directly to C extensions',
          'Generators cannot accept arguments or be iterated using a for-loop',
          'Generators can only yield integer values'
        ],
        correctAnswer: 0,
        explanation: 'Generators yield items one by one on demand rather than allocating the entire sequence in memory at once.',
        category: 'Generators & Iterators'
      },
      {
        id: 'py-3',
        question: 'What is the output of this dictionary mutation snippet?',
        codeSnippet: `def add_item(k, v, d={}):
    d[k] = v
    return d

print(add_item('a', 1))
print(add_item('b', 2))`,
        codeLanguage: 'python',
        options: [
          "{'a': 1} then {'b': 2}",
          "{'a': 1} then {'a': 1, 'b': 2}",
          "SyntaxError: mutable default argument",
          "{'a': 1, 'b': 2} for both"
        ],
        correctAnswer: 1,
        explanation: 'Default arguments in Python are evaluated once at function definition time. Mutating the default dictionary persists across subsequent calls.',
        category: 'Language Quirks'
      },
      {
        id: 'py-4',
        question: 'Which of the following creates a deep copy of a nested object hierarchy in Python?',
        options: [
          'obj.copy()',
          'copy.copy(obj)',
          'copy.deepcopy(obj)',
          'list(obj)'
        ],
        correctAnswer: 2,
        explanation: 'copy.deepcopy() recursively clones nested compound objects so modifications do not leak into the original structure.',
        category: 'Memory Management'
      },
      {
        id: 'py-5',
        question: 'What does the `@functools.wraps` decorator do when writing custom decorators?',
        options: [
          'It accelerates the wrapped function execution via JIT compilation',
          'It preserves the original function metadata such as __name__, __doc__, and annotations',
          'It ensures the function can only be executed in a multi-threaded context',
          'It automatically catches and logs all unhandled exceptions'
        ],
        correctAnswer: 1,
        explanation: '@functools.wraps copies the docstring, function name, and signature attributes from the original function onto the wrapper function.',
        category: 'Decorators'
      },
      {
        id: 'py-6',
        question: 'What is the time complexity of checking membership `x in s` if `s` is a standard Python `set` versus a `list`?',
        options: [
          'O(1) average for set, O(n) for list',
          'O(n) for set, O(1) for list',
          'O(log n) for set, O(n) for list',
          'O(1) for both'
        ],
        correctAnswer: 0,
        explanation: 'Sets are implemented as hash tables in Python, giving O(1) average lookup complexity compared to O(n) linear scans for lists.',
        category: 'Algorithms'
      },
      {
        id: 'py-7',
        question: 'What will this Python slicing expression produce?',
        codeSnippet: `text = "RecruitCred"
print(text[::-2])`,
        codeLanguage: 'python',
        options: ['drCtcrR', 'derCtcrR', 'drCtceR', 'deCrcR'],
        correctAnswer: 0,
        explanation: 'The slice [::-2] reverses the string and steps backward every 2 characters: "d", "r", "C", "t", "c", "r", "R".',
        category: 'Strings & Slicing'
      },
      {
        id: 'py-8',
        question: 'In Python, what is the Global Interpreter Lock (GIL)?',
        options: [
          'A security mechanism preventing untrusted scripts from accessing the file system',
          'A mutex that allows only one native thread to execute Python bytecodes at a time in CPython',
          'A lock that prevents concurrent write access to SQLite databases',
          'A compiler optimization that merges global variables into registers'
        ],
        correctAnswer: 1,
        explanation: 'The GIL in CPython is a mutex that prevents multiple native threads from executing Python bytecodes simultaneously to protect internal reference counting.',
        category: 'Concurrency'
      },
      {
        id: 'py-9',
        question: 'What is the output of the following lambda and map expression?',
        codeSnippet: `nums = [1, 2, 3, 4]
res = list(map(lambda x: x ** 2, filter(lambda x: x > 2, nums)))
print(res)`,
        codeLanguage: 'python',
        options: ['[9, 16]', '[1, 4, 9, 16]', '[3, 4]', '[4, 9, 16]'],
        correctAnswer: 0,
        explanation: 'filter extracts numbers > 2 (3 and 4), then map squares each number, resulting in [9, 16].',
        category: 'Functional Programming'
      },
      {
        id: 'py-10',
        question: 'What is the purpose of `__slots__` in Python class definitions?',
        options: [
          'To restrict instance attributes to a fixed set and significantly reduce per-instance RAM overhead',
          'To define abstract method signatures',
          'To automatically serialize classes to JSON',
          'To enable multi-inheritance overrides'
        ],
        correctAnswer: 0,
        explanation: '__slots__ prevents the default per-instance __dict__ creation, reducing memory footprint for millions of objects.',
        category: 'OOP & Internals'
      }
    ]
  },
  {
    id: 'cpp-core',
    skillName: 'C++',
    category: 'Systems',
    difficulty: 'Advanced',
    durationMinutes: 15,
    questionCount: 10,
    icon: 'Cpu',
    description: 'Assess pointers, memory allocation, RAII, templates, smart pointers (unique_ptr/shared_ptr), virtual functions, and move semantics.',
    syllabus: [
      'Pointers, References & Memory Layout',
      'RAII & Smart Pointers (unique_ptr, shared_ptr)',
      'Move semantics & rvalue references (std::move)',
      'Virtual functions and VTABLE lookup',
      'Templates and STL Containers'
    ],
    passingScore: 70,
    questions: [
      {
        id: 'cpp-1',
        question: 'What is the output of the following pointer arithmetic snippet in C++?',
        codeSnippet: `int arr[] = {10, 20, 30, 40, 50};
int* p = arr + 2;
cout << *(p + 1) << " " << p[-1];`,
        codeLanguage: 'cpp',
        options: ['40 20', '30 20', '40 10', '50 30'],
        correctAnswer: 0,
        explanation: 'p points to arr[2] (30). *(p + 1) is arr[3] (40), and p[-1] is arr[1] (20).',
        category: 'Pointers'
      },
      {
        id: 'cpp-2',
        question: 'What is the primary difference between `std::unique_ptr` and `std::shared_ptr`?',
        options: [
          'unique_ptr represents exclusive ownership (non-copyable, only movable); shared_ptr uses reference counting for shared ownership',
          'unique_ptr allocates memory on the stack; shared_ptr allocates on the heap',
          'unique_ptr cannot be used with custom deleters',
          'shared_ptr is always thread-safe for both reading and writing without mutexes'
        ],
        correctAnswer: 0,
        explanation: 'std::unique_ptr enforces exclusive single ownership with zero reference counting overhead, whereas std::shared_ptr maintains an atomic reference count.',
        category: 'Smart Pointers'
      },
      {
        id: 'cpp-3',
        question: 'What does `std::move(x)` actually do at runtime?',
        options: [
          'Physically moves the memory bits of x to another memory address',
          'Unconditionally casts x to an rvalue reference (T&&) to enable move semantics',
          'Deletes the object x immediately',
          'Allocates a new heap buffer'
        ],
        correctAnswer: 1,
        explanation: 'std::move does not move anything at runtime; it performs a static_cast to an rvalue reference (T&&) to allow move constructors to match.',
        category: 'Move Semantics'
      },
      {
        id: 'cpp-4',
        question: 'What happens if a base class does NOT have a virtual destructor when deleting via a base pointer?',
        options: [
          'Undefined behavior; derived class destructor will not be called, resulting in resource leaks',
          'Compilation error at compile time',
          'Derived destructor executes first automatically',
          'The program throws a std::bad_alloc exception'
        ],
        correctAnswer: 0,
        explanation: 'Without a virtual destructor in the base class, deleting a derived object through a base pointer causes undefined behavior and fails to invoke derived destructors.',
        category: 'Polymorphism & OOP'
      },
      {
        id: 'cpp-5',
        question: 'What is RAII (Resource Acquisition Is Initialization) in C++?',
        options: [
          'A pattern where resource lifecycle is tied to object lifetime (acquired in constructor, released in destructor)',
          'A compiler flag that enables automatic garbage collection',
          'A build tool for linking dynamic libraries',
          'An algorithm for fast binary search'
        ],
        correctAnswer: 0,
        explanation: 'RAII guarantees that resources (memory, file handles, mutex locks) are deterministically released when objects go out of scope.',
        category: 'RAII & Memory'
      },
      {
        id: 'cpp-6',
        question: 'What is the output of this vector capacity snippet?',
        codeSnippet: `vector<int> v = {1, 2, 3};
v.reserve(10);
cout << v.size() << " " << v.capacity();`,
        codeLanguage: 'cpp',
        options: ['3 10', '10 10', '3 3', '0 10'],
        correctAnswer: 0,
        explanation: 'reserve(10) allocates internal capacity for at least 10 elements without changing the current logical size of 3.',
        category: 'STL Containers'
      },
      {
        id: 'cpp-7',
        question: 'What is the time complexity of searching an element in `std::map` versus `std::unordered_map`?',
        options: [
          'O(log N) for std::map (Red-Black Tree), O(1) average for std::unordered_map (Hash Table)',
          'O(1) for std::map, O(log N) for std::unordered_map',
          'O(N) for both',
          'O(1) for both'
        ],
        correctAnswer: 0,
        explanation: 'std::map is an ordered balanced binary search tree (O(log N)), whereas std::unordered_map is a bucket-based hash table (O(1) average).',
        category: 'STL & Complexity'
      },
      {
        id: 'cpp-8',
        question: 'What does the `constexpr` keyword specify when applied to a function in C++11/14/17?',
        options: [
          'The function can be evaluated at compile-time if its arguments are constant expressions',
          'The function cannot use pointers',
          'The function must execute on GPU cores',
          'The function is private to the translation unit'
        ],
        correctAnswer: 0,
        explanation: 'constexpr functions indicate that the computation can be fully evaluated during compilation when given constant expression inputs.',
        category: 'Modern C++'
      },
      {
        id: 'cpp-9',
        question: 'What is the output of this lambda capture snippet?',
        codeSnippet: `int x = 5;
auto f = [x]() mutable { return ++x; };
f();
cout << x << " " << f();`,
        codeLanguage: 'cpp',
        options: ['5 7', '6 7', '5 6', '7 7'],
        correctAnswer: 0,
        explanation: 'x is captured by value. The mutable lambda increments its internal copy. The original outer x remains 5. Second call returns 7.',
        category: 'Lambdas'
      },
      {
        id: 'cpp-10',
        question: 'What is a Pure Virtual Function in C++?',
        options: [
          'A virtual function assigned = 0 that makes the class abstract and forces derived classes to implement it',
          'A function that cannot modify any global state',
          'A static member function that runs in O(1) time',
          'A function written in inline assembly'
        ],
        correctAnswer: 0,
        explanation: 'A pure virtual function (`virtual void f() = 0;`) cannot be instantiated directly, defining an abstract interface contract.',
        category: 'OOP'
      }
    ]
  },
  {
    id: 'javascript-core',
    skillName: 'JavaScript',
    category: 'Frontend',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    questionCount: 10,
    icon: 'FileCode2',
    description: 'Assess event loop mechanics, closures, prototypical inheritance, Promises/async-await, hoisting, scope, and modern ES6+ features.',
    syllabus: [
      'Event loop & microtask vs macrotask execution order',
      'Closures and lexical scoping',
      'Prototypes & prototypical inheritance chain',
      'Promises, async/await, and error handling',
      'Equality comparisons (== vs ===, Object.is)'
    ],
    passingScore: 70,
    questions: [
      {
        id: 'js-1',
        question: 'In what exact order will the console log messages appear?',
        codeSnippet: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
        codeLanguage: 'javascript',
        options: ['1, 4, 3, 2', '1, 2, 3, 4', '1, 4, 2, 3', '1, 3, 4, 2'],
        correctAnswer: 0,
        explanation: 'Synchronous execution (1, 4) runs first. Then microtasks queue (Promise then -> 3) executes before macrotasks (setTimeout -> 2).',
        category: 'Event Loop'
      },
      {
        id: 'js-2',
        question: 'What is the output of the following closure snippet?',
        codeSnippet: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 10);
}`,
        codeLanguage: 'javascript',
        options: ['3, 3, 3', '0, 1, 2', 'undefined, undefined, undefined', '0, 0, 0'],
        correctAnswer: 0,
        explanation: 'var is function-scoped. When setTimeout callbacks execute after the loop finishes, all closures reference the same shared variable i with value 3.',
        category: 'Closures & Scope'
      },
      {
        id: 'js-3',
        question: 'What will `typeof NaN` evaluate to in JavaScript?',
        options: ['"number"', '"NaN"', '"undefined"', '"object"'],
        correctAnswer: 0,
        explanation: 'In JavaScript (IEEE 754 floating point standard), NaN represents a special numeric value indicating "Not a Number", so its typeof is "number".',
        category: 'Types'
      },
      {
        id: 'js-4',
        question: 'What is the result of `[] + []` and `[] + {}` in JavaScript?',
        options: [
          '"" and "[object Object]"',
          '[] and {}',
          'undefined and NaN',
          'TypeError'
        ],
        correctAnswer: 0,
        explanation: '[] coerces to empty string ""; {} coerces to string "[object Object]". Thus "" + "" = "" and "" + "[object Object]" = "[object Object]".',
        category: 'Type Coercion'
      },
      {
        id: 'js-5',
        question: 'What does `Promise.allSettled()` do compared to `Promise.all()`?',
        options: [
          'Promise.allSettled waits for all promises to either resolve or reject and returns an array of status descriptors without short-circuiting on rejection',
          'Promise.allSettled executes promises in sequential synchronous order',
          'Promise.allSettled aborts all pending network calls immediately',
          'There is no difference'
        ],
        correctAnswer: 0,
        explanation: 'Unlike Promise.all which rejects immediately on the first failure, Promise.allSettled waits for every promise to settle.',
        category: 'Promises & Async'
      },
      {
        id: 'js-6',
        question: 'What will `Object.freeze(obj)` prevent on an object?',
        options: [
          'Prevents adding new properties, removing existing properties, or modifying values of existing properties (shallow)',
          'Recursively freezes all deeply nested child objects',
          'Converts all object values to immutable BigInts',
          'Encrypts object keys in memory'
        ],
        correctAnswer: 0,
        explanation: 'Object.freeze performs a shallow freeze preventing property addition, deletion, and reassignment.',
        category: 'Objects'
      },
      {
        id: 'js-7',
        question: 'What is the value of `this` in an arrow function?',
        options: [
          'Lexically bound from the enclosing execution context where the arrow function was defined',
          'Always points to window or globalThis',
          'Bound to the object that invoked the function',
          'Always undefined in strict mode'
        ],
        correctAnswer: 0,
        explanation: 'Arrow functions do not have their own this binding; they inherit this lexically from parent scope.',
        category: 'Functions & This'
      },
      {
        id: 'js-8',
        question: 'What will `[10, 5, 20, 1].sort()` return by default in JavaScript?',
        options: ['[1, 10, 20, 5]', '[1, 5, 10, 20]', '[20, 10, 5, 1]', '[10, 5, 20, 1]'],
        correctAnswer: 0,
        explanation: 'By default, Array.prototype.sort() converts elements to strings and compares UTF-16 code units: "1" < "10" < "20" < "5".',
        category: 'Arrays'
      },
      {
        id: 'js-9',
        question: 'What is the purpose of WeakMap in JavaScript?',
        options: [
          'A map where keys must be objects and are held weakly, allowing garbage collection when no other references exist',
          'A map that allows duplicate keys',
          'A map with maximum size of 10 items',
          'A persistent storage API'
        ],
        correctAnswer: 0,
        explanation: 'WeakMap keys are held weakly, preventing memory leaks when associating metadata with DOM nodes or objects.',
        category: 'Data Structures'
      },
      {
        id: 'js-10',
        question: 'What does the Nullish Coalescing operator (`??`) check for?',
        options: [
          'Checks only for null and undefined (not other falsy values like 0, false, or "")',
          'Checks for all falsy values (0, "", false, null, undefined)',
          'Checks if a variable is an array',
          'Checks for NaN values'
        ],
        correctAnswer: 0,
        explanation: '?? returns right-hand operand only when left is strictly null or undefined, preserving valid values like 0 or false.',
        category: 'Operators'
      }
    ]
  },
  {
    id: 'react-core',
    skillName: 'React',
    category: 'Frontend',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    questionCount: 10,
    icon: 'Atom',
    description: 'Test your understanding of React 18 concurrency, custom hooks, reconciliation algorithm, useEffect dependency arrays, and state optimization.',
    syllabus: [
      'Hook rules and custom hooks',
      'useEffect vs useLayoutEffect lifecycle',
      'React.memo, useMemo, and useCallback',
      'Virtual DOM & Fiber Reconciliation',
      'Context API performance considerations'
    ],
    passingScore: 70,
    questions: [
      {
        id: 'react-1',
        question: 'Why does passing an inline object to a context provider without `useMemo` trigger unexpected re-renders in consumer components?',
        options: [
          'React Context requires all values to be immutable strings',
          'A new object reference is created on every render, failing shallow equality checks (Object.is)',
          'Context cannot handle nested objects without Redux middleware',
          'React garbage collects context values immediately after render'
        ],
        correctAnswer: 1,
        explanation: 'When provider value is `{ user, theme }` directly in JSX, a fresh reference is created each render, causing all subscribed consumers to re-render.',
        category: 'Context & Performance'
      },
      {
        id: 'react-2',
        question: 'What will happen with the following `useEffect` hook?',
        codeSnippet: `const [count, setCount] = useState(0);

useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(id);
}, []);`,
        codeLanguage: 'javascript',
        options: [
          'Count increments reliably by 1 every second indefinitely',
          'Count gets stuck at 1 because count is captured in the closure with value 0',
          'Causes an infinite re-render loop crashing the browser',
          'Throws a TypeError at runtime'
        ],
        correctAnswer: 1,
        explanation: 'With an empty dependency array `[]`, the interval callback closes over the initial `count = 0`. Each second it sets count to 0 + 1 = 1.',
        category: 'Hooks & Closures'
      },
      {
        id: 'react-3',
        question: 'What is the primary role of the `key` prop in dynamic lists in React?',
        options: [
          'Provides accessibility labels for screen readers',
          'Enables React Fiber to identify which items have changed, been added, or removed across renders',
          'Binds CSS styling rules to individual list elements',
          'Enables two-way data binding for input elements'
        ],
        correctAnswer: 1,
        explanation: 'Keys give elements a stable identity across renders, allowing React to minimize DOM mutations and maintain local state correctly.',
        category: 'Reconciliation'
      },
      {
        id: 'react-4',
        question: 'When should `useLayoutEffect` be preferred over standard `useEffect`?',
        options: [
          'For all network requests and async data fetching',
          'When reading layout dimensions and synchronously mutating the DOM before the browser paints to prevent visual flickers',
          'When subscribing to WebSocket channels',
          'When writing unit tests with Jest'
        ],
        correctAnswer: 1,
        explanation: 'useLayoutEffect fires synchronously after all DOM mutations but before the browser paints, avoiding visual layout jump/flicker.',
        category: 'Hooks'
      },
      {
        id: 'react-5',
        question: 'What does React 18 `useTransition` hook allow developers to do?',
        options: [
          'Animate CSS transitions without external libraries',
          'Mark non-urgent state updates as interruptible transitions to keep the UI responsive during heavy renders',
          'Transition users between multi-page URL routes synchronously',
          'Automatically convert class components to functional components'
        ],
        correctAnswer: 1,
        explanation: 'useTransition marks state updates as non-urgent transitions so urgent interactions like typing stay snappy and responsive.',
        category: 'React 18 Concurrency'
      },
      {
        id: 'react-6',
        question: 'What is the return value of `React.useCallback(fn, deps)`?',
        options: [
          'The computed result of calling fn',
          'A memoized version of the callback function that only changes if dependencies change',
          'A Promise that resolves when fn finishes execution',
          'A cancellation token for async tasks'
        ],
        correctAnswer: 1,
        explanation: 'useCallback returns a memoized function instance, preventing unnecessary child re-renders when passed as callbacks to memoized children.',
        category: 'Optimization'
      },
      {
        id: 'react-7',
        question: 'In React Fiber architecture, what does "work-in-progress" tree represent?',
        options: [
          'The HTML string sent from SSR',
          'The alternate fiber tree being constructed concurrently before committing to the screen',
          'A backup tree saved in LocalStorage',
          'The browser native DOM element collection'
        ],
        correctAnswer: 1,
        explanation: 'React Fiber uses a double-buffering technique where the work-in-progress tree is prepared and can be paused/aborted before swapping with the current tree.',
        category: 'Fiber Internals'
      },
      {
        id: 'react-8',
        question: 'How does React Batching work in React 18 by default?',
        options: [
          'Only updates inside React synthetic event handlers are batched',
          'Automatic batching applies everywhere, including inside Promises, setTimeout, and native event handlers',
          'Batching has been deprecated in favor of Signals',
          'Batching must be manually triggered via ReactDOM.unstable_batchedUpdates'
        ],
        correctAnswer: 1,
        explanation: 'React 18 introduces automatic batching for all state updates regardless of where they originate (fetch, setTimeout, event handlers).',
        category: 'React 18'
      },
      {
        id: 'react-9',
        question: 'What will happen when updating state using functional form `setCount(prev => prev + 1)` multiple times in the same handler?',
        options: [
          'Each update receives the guaranteed latest state value, correctly incrementing by the number of calls',
          'Only the last call executes',
          'Throws an infinite loop error',
          'State resets to 0'
        ],
        correctAnswer: 0,
        explanation: 'Functional updater receives the pending state from the queue, allowing sequential updates to stack reliably.',
        category: 'State Management'
      },
      {
        id: 'react-10',
        question: 'What is the purpose of React Error Boundaries?',
        options: [
          'Catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI',
          'Catch network 404 errors from fetch requests automatically',
          'Format syntax errors during Webpack compilation',
          'Validate PropTypes at runtime'
        ],
        correctAnswer: 0,
        explanation: 'Error boundaries catch rendering phase errors in descendant components, preventing the whole app from unmounting.',
        category: 'Error Handling'
      }
    ]
  },
  {
    id: 'sql-core',
    skillName: 'SQL',
    category: 'Backend',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    questionCount: 10,
    icon: 'Server',
    description: 'Evaluate SQL queries, Joins (INNER, LEFT, FULL, CROSS), Subqueries, Indexing (B-Tree vs Hash), Transactions (ACID), and Window Functions.',
    syllabus: [
      'Complex JOIN operations & NULL handling',
      'Window functions (ROW_NUMBER, RANK, DENSE_RANK)',
      'Indexes, B-Trees, and query optimization',
      'ACID transaction isolation levels',
      'Aggregations & HAVING vs WHERE clause'
    ],
    passingScore: 70,
    questions: [
      {
        id: 'sql-1',
        question: 'What is the difference between `WHERE` and `HAVING` clauses in SQL?',
        options: [
          'WHERE filters individual rows before grouping/aggregation; HAVING filters grouped summary rows after GROUP BY is applied',
          'HAVING is only used in MySQL; WHERE is used in PostgreSQL',
          'WHERE can filter aggregate functions like COUNT(), HAVING cannot',
          'There is no functional difference'
        ],
        correctAnswer: 0,
        explanation: 'WHERE filters pre-aggregated rows; HAVING filters results produced by aggregate functions after GROUP BY.',
        category: 'Filtering & Aggregation'
      },
      {
        id: 'sql-2',
        question: 'What will this SQL JOIN query return if Table A has 5 rows and Table B has 4 rows with NO matching keys on an `INNER JOIN`?',
        codeSnippet: `SELECT * FROM A INNER JOIN B ON A.id = B.id;`,
        codeLanguage: 'sql',
        options: ['0 rows', '5 rows', '20 rows (Cartesian product)', '4 rows with NULLs'],
        correctAnswer: 0,
        explanation: 'INNER JOIN only returns rows where the join condition evaluates to TRUE. If zero keys match, 0 rows are returned.',
        category: 'Joins'
      },
      {
        id: 'sql-3',
        question: 'What is the difference between `UNION` and `UNION ALL`?',
        options: [
          'UNION removes duplicate rows between result sets (performing a distinct sort); UNION ALL concatenates all rows including duplicates',
          'UNION ALL removes duplicates; UNION keeps duplicates',
          'UNION only works on tables with numeric columns',
          'UNION ALL creates a temporary database table'
        ],
        correctAnswer: 0,
        explanation: 'UNION performs deduplication sorting overhead; UNION ALL retains all rows faster without deduplication.',
        category: 'Set Operations'
      },
      {
        id: 'sql-4',
        question: 'In ACID properties of relational databases, what does "Isolation" ensure?',
        options: [
          'Concurrent transactions execute without interfering with one another, as if executing sequentially',
          'Transactions are written to isolated hard drives',
          'Database cannot be accessed from outside localhost',
          'Table schema changes are prevented'
        ],
        correctAnswer: 0,
        explanation: 'Isolation ensures concurrent transaction executions do not produce dirty reads, non-repeatable reads, or phantom reads based on isolation levels.',
        category: 'ACID & Transactions'
      },
      {
        id: 'sql-5',
        question: 'What will the window function `DENSE_RANK() OVER (ORDER BY score DESC)` produce for scores [100, 90, 90, 80]?',
        options: ['1, 2, 2, 3', '1, 2, 2, 4', '1, 2, 3, 4', '1, 1, 2, 3'],
        correctAnswer: 0,
        explanation: 'DENSE_RANK does not skip ranking ranks after ties (1, 2, 2, 3). Standard RANK() would produce (1, 2, 2, 4).',
        category: 'Window Functions'
      },
      {
        id: 'sql-6',
        question: 'Why might a database query planner choose a sequential scan over a B-Tree Index scan?',
        options: [
          'When the query selects a large percentage (e.g. >30-40%) of total table rows, making random I/O of index lookups slower than sequential disk reads',
          'When the table has more than 10 columns',
          'When the database is running on SSD',
          'When using PostgreSQL instead of MySQL'
        ],
        correctAnswer: 0,
        explanation: 'If a large fraction of the table is needed, sequentially reading disk pages is more efficient than jumping randomly via index pointers.',
        category: 'Indexing & Performance'
      },
      {
        id: 'sql-7',
        question: 'What does `COALESCE(val1, val2, val3)` return in SQL?',
        options: [
          'The first non-NULL expression from the argument list',
          'The average of all non-null values',
          'A concatenated string of all values',
          'Boolean TRUE if all values are equal'
        ],
        correctAnswer: 0,
        explanation: 'COALESCE evaluates arguments in sequence and returns the first value that is not NULL.',
        category: 'Functions'
      },
      {
        id: 'sql-8',
        question: 'What will happen with `DELETE FROM users;` versus `TRUNCATE TABLE users;`?',
        options: [
          'DELETE scans and deletes rows row-by-row logging each delete in transaction logs; TRUNCATE deallocates data pages rapidly and resets auto-increment IDs',
          'DELETE drops the table schema entirely; TRUNCATE does not',
          'TRUNCATE allows WHERE filters; DELETE does not',
          'They execute with identical performance'
        ],
        correctAnswer: 0,
        explanation: 'TRUNCATE is a DDL operation that drops storage pages instantly, whereas DELETE is a DML operation that records undo logs for every row.',
        category: 'DDL vs DML'
      },
      {
        id: 'sql-9',
        question: 'What is a "Foreign Key" constraint in relational database design?',
        options: [
          'A key that enforces referential integrity by ensuring the value in a child table matches a primary key in a parent table',
          'An encrypted API token for external databases',
          'A key imported from another country server',
          'A non-indexed secondary key'
        ],
        correctAnswer: 0,
        explanation: 'Foreign keys maintain referential integrity between tables, preventing orphaned records.',
        category: 'Schema Design'
      },
      {
        id: 'sql-10',
        question: 'What is the result of `SELECT COUNT(NULL);` versus `SELECT COUNT(*);` on a table with 5 rows?',
        options: ['0 and 5', '5 and 5', 'NULL and 5', 'Error'],
        correctAnswer: 0,
        explanation: 'COUNT(expression) ignores NULL values (returning 0), while COUNT(*) counts total physical rows regardless of NULLs (returning 5).',
        category: 'NULL Handling'
      }
    ]
  },
  {
    id: 'git-core',
    skillName: 'Git',
    category: 'Cloud & DevOps',
    difficulty: 'Beginner',
    durationMinutes: 12,
    questionCount: 10,
    icon: 'GitBranch',
    description: 'Assess version control workflows, branching, rebase vs merge, cherry-pick, resolving merge conflicts, git reset/revert, reflog, and bisect.',
    syllabus: [
      'Git commit, branching, and detached HEAD',
      'Git merge vs Git rebase workflows',
      'Git reset (soft, mixed, hard) vs Git revert',
      'Git reflog and recovering lost commits',
      'Git cherry-pick, stash, and bisect debugging'
    ],
    passingScore: 70,
    questions: [
      {
        id: 'git-1',
        question: 'What is the primary difference between `git merge` and `git rebase`?',
        options: [
          'Merge creates a new merge commit combining two branch histories; Rebase reapplies commits on top of the base branch creating a linear history',
          'Rebase deletes previous commit history permanently',
          'Merge only works on remote repositories',
          'Rebase cannot be used with branches'
        ],
        correctAnswer: 0,
        explanation: 'Merge preserves exact chronological branching with a merge commit; rebase rewrites commit hashes to maintain a clean linear commit graph.',
        category: 'Branching & History'
      },
      {
        id: 'git-2',
        question: 'What is the difference between `git reset --soft HEAD~1` and `git reset --hard HEAD~1`?',
        options: [
          '--soft undoes the last commit but keeps all changes staged in index; --hard discards both the commit and all uncommitted working directory changes',
          '--soft deletes files permanently; --hard keeps them',
          '--soft only works on master branch',
          'There is no difference'
        ],
        correctAnswer: 0,
        explanation: '--soft moves HEAD back while keeping changes in the staging area; --hard overwrites both index and working tree destroying changes.',
        category: 'Undoing Changes'
      },
      {
        id: 'git-3',
        question: 'How does `git revert <commit-hash>` differ from `git reset`?',
        options: [
          'git revert creates a brand new commit that inversely applies the changes of the target commit, making it safe for public shared branches',
          'git revert modifies past commit hashes',
          'git revert requires force push',
          'git revert deletes the remote repository'
        ],
        correctAnswer: 0,
        explanation: 'git revert is non-destructive for collaborative branches because it appends a forward-moving inverse commit without rewriting history.',
        category: 'Safety & Collaboration'
      },
      {
        id: 'git-4',
        question: 'What is a "Detached HEAD" state in Git?',
        options: [
          'HEAD points directly to a specific commit hash rather than a named branch reference',
          'A fatal Git error requiring repository re-cloning',
          'The repository has no remote origin configured',
          'A commit with no commit message'
        ],
        correctAnswer: 0,
        explanation: 'Detached HEAD means you are checking out a commit directly. Any new commits will be orphaned unless attached to a branch.',
        category: 'HEAD & Refs'
      },
      {
        id: 'git-5',
        question: 'What is the purpose of `git reflog`?',
        options: [
          'A local log recording every update to HEAD (commits, checkouts, rebase steps), enabling recovery of deleted commits or branches',
          'A remote server audit log for team leaders',
          'A tool to compress Git packfiles',
          'A command to reformat commit messages'
        ],
        correctAnswer: 0,
        explanation: 'Reflog tracks all movements of HEAD locally, acting as a safety net to restore accidentally dropped commits or aborted rebases.',
        category: 'Recovery'
      },
      {
        id: 'git-6',
        question: 'What does `git cherry-pick <commit-hash>` do?',
        options: [
          'Applies the exact changes introduced by a specific existing commit from another branch onto the current working branch',
          'Deletes a commit from history',
          'Selects the best performing commit via benchmarks',
          'Merges all commits with the word "fix"'
        ],
        correctAnswer: 0,
        explanation: 'Cherry-pick extracts a single commit diff from another branch and commits it to current HEAD.',
        category: 'Workflows'
      },
      {
        id: 'git-7',
        question: 'What is the command `git bisect` used for?',
        options: [
          'Performs a binary search across commit history to rapidly identify which commit introduced a bug or regression',
          'Splits a repository into two smaller submodules',
          'Divides a commit into two equal parts',
          'Analyzes code churn by developer'
        ],
        correctAnswer: 0,
        explanation: 'git bisect uses binary search between a known good and bad commit to automate finding the commit that introduced a bug.',
        category: 'Debugging'
      },
      {
        id: 'git-8',
        question: 'What will `git stash pop` do?',
        options: [
          'Restores the most recently stashed changes to working directory and removes them from the stash list',
          'Deletes all stashed entries without applying',
          'Pushes changes to remote origin',
          'Creates a new Git tag'
        ],
        correctAnswer: 0,
        explanation: 'git stash pop applies the top stash (stash@{0}) and drops it from the stash stack.',
        category: 'Stashing'
      },
      {
        id: 'git-9',
        question: 'What is the purpose of a `.gitignore` file?',
        options: [
          'Specifies untracked file patterns (e.g. node_modules, .env, build artifacts) that Git should intentionally ignore from commits',
          'Hides git commit author names',
          'Disables git hooks',
          'Deletes untracked files automatically'
        ],
        correctAnswer: 0,
        explanation: '.gitignore prevents temporary build files, credentials, and dependencies from being staged into version control.',
        category: 'Configuration'
      },
      {
        id: 'git-10',
        question: 'What does `git pull --rebase` do?',
        options: [
          'Fetches latest commits from remote tracking branch and rebases local unpushed commits on top instead of creating an unnecessary merge commit',
          'Forces overwrite of local files with remote files',
          'Deletes remote tracking branches',
          'Resets the repository to initial commit'
        ],
        correctAnswer: 0,
        explanation: 'git pull --rebase keeps a clean, linear local history by fetching and then rebasing local commits on top of origin.',
        category: 'Remote Workflows'
      }
    ]
  },
  {
    id: 'html-css-core',
    skillName: 'HTML/CSS',
    category: 'Frontend',
    difficulty: 'Beginner',
    durationMinutes: 12,
    questionCount: 10,
    icon: 'Palette',
    description: 'Evaluate semantic HTML5 elements, CSS Box Model, Flexbox, CSS Grid, Specificity hierarchy, responsive media queries, and accessibility.',
    syllabus: [
      'Semantic HTML5 structure & accessibility tags',
      'CSS Box Model (content, padding, border, margin)',
      'Flexbox vs CSS Grid layout systems',
      'CSS Specificity rules & cascade hierarchy',
      'Responsive design & clamp()/minmax() functions'
    ],
    passingScore: 70,
    questions: [
      {
        id: 'html-1',
        question: 'What is the correct CSS Specificity calculation for selector `div.container ul li.active a:hover`?',
        options: [
          '0, 0, 2, 4 (2 class/pseudo-class + 4 elements)',
          '0, 1, 0, 0',
          '0, 0, 0, 6',
          '1, 0, 0, 0'
        ],
        correctAnswer: 0,
        explanation: 'Classes/pseudo-classes (.container, .active, :hover) count as 3x10 (0,0,3,4) or (2 class + 1 pseudo-class = 3) and elements (div, ul, li, a) count as 4.',
        category: 'CSS Specificity'
      },
      {
        id: 'html-2',
        question: 'What does `box-sizing: border-box;` do to an element?',
        options: [
          'Includes padding and border within the specified width and height of the element, preventing layout overflow',
          'Adds a default 1px border around all elements',
          'Forces all child elements to be inline-block',
          'Renders 3D borders'
        ],
        correctAnswer: 0,
        explanation: 'border-box ensures that width = content + padding + border, making responsive layout sizing predictable.',
        category: 'Box Model'
      },
      {
        id: 'html-3',
        question: 'What is the difference between `display: none;` and `visibility: hidden;` in CSS?',
        options: [
          'display: none removes the element entirely from document flow; visibility: hidden hides the element while preserving its physical layout space',
          'visibility: hidden removes element from DOM tree',
          'display: none only works on images',
          'There is no visual difference'
        ],
        correctAnswer: 0,
        explanation: 'display:none collapses the space entirely; visibility:hidden hides content visually while preserving width and height in the flow.',
        category: 'Display & Layout'
      },
      {
        id: 'html-4',
        question: 'In Flexbox, which property aligns items along the cross axis (perpendicular to main axis)?',
        options: ['align-items', 'justify-content', 'flex-direction', 'flex-grow'],
        correctAnswer: 0,
        explanation: 'justify-content aligns along the main axis; align-items aligns along the cross axis.',
        category: 'Flexbox'
      },
      {
        id: 'html-5',
        question: 'What does the CSS Grid `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));` create?',
        options: [
          'A fully responsive responsive grid that automatically wraps columns into rows without requiring media queries',
          'A fixed 3-column table layout',
          'A grid with maximum width of 250px',
          'A single full-width column'
        ],
        correctAnswer: 0,
        explanation: 'auto-fit + minmax creates an intrinsic responsive grid that automatically calculates column counts based on container width.',
        category: 'CSS Grid'
      },
      {
        id: 'html-6',
        question: 'Why should semantic HTML5 tags (e.g. `<main>`, `<nav>`, `<article>`, `<header>`) be preferred over generic `<div>` tags?',
        options: [
          'Improves accessibility for screen readers, strengthens SEO hierarchy, and clarifies document structure',
          'Semantic tags compile faster in V8 engine',
          'Semantic tags automatically add CSS animations',
          'Browsers reject HTML files without semantic tags'
        ],
        correctAnswer: 0,
        explanation: 'Semantic elements provide meaningful structural landmarks for assistive technologies and search engine parsers.',
        category: 'Semantic HTML'
      },
      {
        id: 'html-7',
        question: 'What does the CSS `clamp(1rem, 2.5vw, 2rem)` function do for font-size?',
        options: [
          'Sets a fluid responsive font size that scales with viewport width (2.5vw) while constrained between minimum 1rem and maximum 2rem',
          'Limits text character length to 2rem',
          'Truncates overflowing text with ellipsis',
          'Sets fixed 2rem size on desktop'
        ],
        correctAnswer: 0,
        explanation: 'clamp(min, preferred, max) delivers fluid responsive typography without sudden media query breakpoints.',
        category: 'Modern CSS'
      },
      {
        id: 'html-8',
        question: 'What is the role of the `alt` attribute on an `<img>` tag?',
        options: [
          'Provides accessible alternative text description for screen readers and displays when the image fails to load',
          'Sets the image resolution in DPI',
          'Defines the hover tooltip popup text only',
          'Compresses image file size'
        ],
        correctAnswer: 0,
        explanation: 'alt text is critical for WCAG compliance for vision-impaired users and fallback rendering.',
        category: 'Accessibility'
      },
      {
        id: 'html-9',
        question: 'What is the difference between `rem` and `em` units in CSS?',
        options: [
          'rem is relative to the root (`<html>`) font-size; em is relative to the immediate parent element’s font-size',
          'em is relative to root, rem is relative to parent',
          'rem only works for margins, em only works for fonts',
          'There is no functional difference'
        ],
        correctAnswer: 0,
        explanation: 'rem (Root EM) avoids compounding multiplier issues by always referencing the root html font-size.',
        category: 'Units'
      },
      {
        id: 'html-10',
        question: 'What does the CSS `z-index` property require to take effect on an element?',
        options: [
          'The element must have a positioned context (e.g. relative, absolute, fixed, sticky) or be a flex/grid child',
          'The element must have display: block',
          'The element must have opacity: 0.5',
          'The element must be an SVG'
        ],
        correctAnswer: 0,
        explanation: 'z-index only applies to positioned elements (anything other than static) or children of flex/grid containers.',
        category: 'Stacking Context'
      }
    ]
  },
  {
    id: 'cad-core',
    skillName: 'CAD Fundamentals',
    category: 'Systems',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    questionCount: 10,
    icon: 'Cpu',
    description: 'Assess parametric 3D solid modeling, orthographic projection views, geometric dimensioning & tolerancing (GD&T), assembly constraints, and section views.',
    syllabus: [
      'Parametric sketching & geometric constraints',
      'Extrude, Revolve, Sweep & Loft features',
      'Assembly mates and degrees of freedom',
      'Geometric Dimensioning & Tolerancing (GD&T)',
      'Orthographic & isometric view generation'
    ],
    passingScore: 70,
    questions: [
      {
        id: 'cad-1',
        question: 'In 3D CAD parametric modeling, what is the fundamental difference between a "fully defined" sketch and an "under defined" sketch?',
        options: [
          'A fully defined sketch has all geometric constraints and dimensions specified so geometry cannot move unexpectedly; an under defined sketch has remaining degrees of freedom',
          'A fully defined sketch is already extruded into a solid',
          'An under defined sketch cannot be saved to disk',
          'Under defined sketches have zero lines'
        ],
        correctAnswer: 0,
        explanation: 'Fully defined sketches eliminate ambiguity, ensuring downstream model updates do not warp geometry.',
        category: 'Parametric Sketching'
      },
      {
        id: 'cad-2',
        question: 'What does the GD&T symbol for "True Position" (circle with crosshairs) specify?',
        options: [
          'The exact permissible cylindrical or planar zone of variation for the center, axis, or center plane of a feature from its theoretical exact location',
          'The surface roughness in micrometers',
          'The material density of the component',
          'The welding joint specification'
        ],
        correctAnswer: 0,
        explanation: 'True position defines the allowable deviation of a feature axis or center from its basic dimensioned location.',
        category: 'GD&T'
      },
      {
        id: 'cad-3',
        question: 'Which CAD feature command generates a solid by blending multiple planar profiles along a guide trajectory curve?',
        options: ['Loft feature', 'Extrude feature', 'Fillet feature', 'Mirror feature'],
        correctAnswer: 0,
        explanation: 'Loft transitions smooth organic geometry across varying cross-sectional profiles and guide rails.',
        category: '3D Features'
      },
      {
        id: 'cad-4',
        question: 'In CAD assembly modeling, what degree of freedom does a "Concentric" mate between two cylindrical faces restrict?',
        options: [
          'Aligns the central axes of both cylinders (restricting 2 translational and 2 rotational DOFs, leaving axial translation and rotation)',
          'Locks all 6 degrees of freedom completely',
          'Prevents part rotation only',
          'Sets fixed distance between end faces'
        ],
        correctAnswer: 0,
        explanation: 'Concentric mates make axes collinear while permitting linear sliding along and spinning around the axis.',
        category: 'Assemblies'
      },
      {
        id: 'cad-5',
        question: 'What is the purpose of a "Draft Angle" on an injection-molded mechanical part design in CAD?',
        options: [
          'To taper vertical faces (typically 1°-3°) so the molded component easily releases from the tooling mold without friction damage',
          'To increase aerodynamic drag',
          'To make the component waterproof',
          'To calculate thermal conductivity'
        ],
        correctAnswer: 0,
        explanation: 'Draft allows clean ejection of molded plastic parts without surface galling.',
        category: 'Manufacturing DFM'
      },
      {
        id: 'cad-6',
        question: 'What does the "Fillet" feature accomplish on a sharp interior structural corner in CAD?',
        options: [
          'Rounds the corner, reducing mechanical stress concentration factors and improving fatigue life',
          'Sharpens the edge for cutting',
          'Deletes the face entirely',
          'Adds a hollow cavity'
        ],
        correctAnswer: 0,
        explanation: 'Interior fillets distribute load lines smoothly, mitigating peak stress concentrations.',
        category: 'Stress & Geometry'
      },
      {
        id: 'cad-7',
        question: 'What is a "Section View" in standard engineering drawing projection?',
        options: [
          'A cross-sectional view revealing internal cavity geometry and material wall thicknesses by imagining a cutting plane through the object',
          'A perspective photo rendering',
          'A top-down view of the entire factory floor',
          'A 3D exploded view'
        ],
        correctAnswer: 0,
        explanation: 'Section views reveal internal blind holes, ribs, and core features hidden from exterior views.',
        category: 'Engineering Drawings'
      },
      {
        id: 'cad-8',
        question: 'What does "BOM" stand for in CAD mechanical assembly drawings?',
        options: [
          'Bill of Materials (itemized schedule of part numbers, quantities, descriptions, and materials)',
          'Binary Object Model',
          'Boundary of Manufacturing',
          'Bilinear Orthographic Map'
        ],
        correctAnswer: 0,
        explanation: 'Bill of Materials provides complete procurement and assembly parts lists.',
        category: 'Documentation'
      },
      {
        id: 'cad-9',
        question: 'Which file format is an ISO standard vendor-neutral format widely used to exchange 3D CAD boundary representation solid models?',
        options: ['STEP (.stp / .step)', '.txt', '.mp4', '.json'],
        correctAnswer: 0,
        explanation: 'STEP (Standard for the Exchange of Product model data) preserves exact analytical surfaces across CAD software.',
        category: 'Interoperability'
      },
      {
        id: 'cad-10',
        question: 'In parametric CAD, what does "Design Intent" mean?',
        options: [
          'How the 3D model geometry should adapt and react predictably when dimensions and parameters are modified',
          'The marketing slogan of the manufacturer',
          'The color scheme used in CAD rendering',
          'The patent registration date'
        ],
        correctAnswer: 0,
        explanation: 'Design intent ensures geometric relationships (symmetry, tangency, concentricity) remain intact upon dimension edits.',
        category: 'CAD Methodology'
      }
    ]
  },
  {
    id: 'problem-solving-core',
    skillName: 'Problem Solving',
    category: 'Systems',
    difficulty: 'Advanced',
    durationMinutes: 15,
    questionCount: 10,
    icon: 'FileCode2',
    description: 'Assess algorithmic complexity (Big-O), two pointers, sliding window, hash maps, binary search trees, graph traversal (BFS/DFS), and dynamic programming.',
    syllabus: [
      'Big-O Time & Space Complexity Analysis',
      'Two pointers & Sliding Window techniques',
      'Binary Search on sorted and monotonic functions',
      'Tree traversals & Graph algorithms (BFS, DFS, Dijkstra)',
      'Dynamic Programming state transitions and memoization'
    ],
    passingScore: 70,
    questions: [
      {
        id: 'ps-1',
        question: 'What is the optimal average time complexity to find if a pair of integers in a sorted array sums to target value T?',
        options: [
          'O(N) using two-pointer technique from both ends',
          'O(N^2) using nested loops',
          'O(N log N) using divide and conquer',
          'O(1) constant time'
        ],
        correctAnswer: 0,
        explanation: 'Two pointers at head and tail converge in linear O(N) time with O(1) auxiliary space.',
        category: 'Two Pointers'
      },
      {
        id: 'ps-2',
        question: 'What is the maximum number of comparisons required to search an element in a balanced Binary Search Tree containing 1,024 elements?',
        options: ['10 comparisons (log2(1024) = 10)', '1,024 comparisons', '512 comparisons', '100 comparisons'],
        correctAnswer: 0,
        explanation: 'In balanced BST, maximum search depth equals the tree height: log2(1024) = 10.',
        category: 'Binary Trees'
      },
      {
        id: 'ps-3',
        question: 'In Dynamic Programming, what are the two essential characteristics a problem must possess to be solvable via DP?',
        options: [
          'Optimal substructure and overlapping subproblems',
          'Greedy choice property and sorting capability',
          'Linear memory and recursion depth < 100',
          'Deterministic finite state machine'
        ],
        correctAnswer: 0,
        explanation: 'Optimal substructure allows global solutions from sub-solutions; overlapping subproblems allows memoization caching.',
        category: 'Dynamic Programming'
      },
      {
        id: 'ps-4',
        question: 'Which data structure is optimal for finding the shortest path in an unweighted graph with V vertices and E edges?',
        options: [
          'Breadth-First Search (BFS) using a Queue in O(V + E) time',
          'Depth-First Search (DFS) using a Stack',
          'Bellman-Ford Algorithm in O(V*E)',
          'Binary Search in O(log V)'
        ],
        correctAnswer: 0,
        explanation: 'BFS explores nodes level-by-level, guaranteeing the shortest hop distance in unweighted graphs in O(V + E).',
        category: 'Graph Algorithms'
      },
      {
        id: 'ps-5',
        question: 'What data structure is used to implement a Least Recently Used (LRU) Cache in O(1) get and O(1) put time complexity?',
        options: [
          'Hash Map combined with a Doubly Linked List',
          'Single array with bubble sort',
          'Binary Min-Heap',
          'Circular Queue only'
        ],
        correctAnswer: 0,
        explanation: 'Hash Map gives O(1) key lookups; Doubly Linked List allows O(1) node relocation and eviction.',
        category: 'Data Structures'
      },
      {
        id: 'ps-6',
        question: 'What is the time complexity of building a Min-Heap from an unsorted array of N elements using bottom-up heapify?',
        options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(log N)'],
        correctAnswer: 0,
        explanation: 'Bottom-up heapify mathematical summation converges to linear O(N) time.',
        category: 'Heaps'
      },
      {
        id: 'ps-7',
        question: 'What does Dijkstra’s algorithm use to pick the next minimum distance vertex?',
        options: [
          'A Priority Queue (Min-Heap) in O((V + E) log V) time',
          'A FIFO Queue',
          'A LIFO Stack',
          'Random sampling'
        ],
        correctAnswer: 0,
        explanation: 'Dijkstra leverages a priority queue to greedily extract the lowest accumulated distance node.',
        category: 'Greedy & Graphs'
      },
      {
        id: 'ps-8',
        question: 'How do you detect a cycle in a singly linked list in O(N) time and O(1) space?',
        options: [
          'Floyd’s Cycle-Finding Algorithm (Fast & Slow pointers)',
          'Hash Set storing all visited node pointers',
          'Reversing the linked list twice',
          'Counting total nodes with a global counter'
        ],
        correctAnswer: 0,
        explanation: 'Slow pointer moves 1 step, Fast moves 2. If a cycle exists, they must meet within the loop using O(1) space.',
        category: 'Linked Lists'
      },
      {
        id: 'ps-9',
        question: 'What is the amortized time complexity of inserting N elements into a dynamic array (like std::vector or ArrayList)?',
        options: ['O(1) amortized per insertion, O(N) total', 'O(N) per insertion', 'O(log N) per insertion', 'O(N^2)'],
        correctAnswer: 0,
        explanation: 'Geometric geometric array resizing (doubling capacity) distributes reallocation cost so each insert is O(1) amortized.',
        category: 'Amortized Analysis'
      },
      {
        id: 'ps-10',
        question: 'In bit manipulation, what does the expression `n & (n - 1)` do?',
        options: [
          'Clears the lowest set (rightmost 1) bit of integer n',
          'Multiplies n by 2',
          'Inverts all bits of n',
          'Checks if n is odd'
        ],
        correctAnswer: 0,
        explanation: 'n & (n - 1) resets the lowest significant 1-bit, frequently used to count set bits in Brian Kernighan’s algorithm.',
        category: 'Bit Manipulation'
      }
    ]
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-rahul',
    name: 'Rahul Sharma',
    username: 'rahulsharma',
    role: 'Full-Stack Developer',
    accountType: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    bio: 'Passionate full-stack developer building scalable web applications. Eager to join an ambitious hackathon team for the upcoming AI challenge.',
    education: 'B.Tech in Computer Engineering, Thapar Institute of Engineering & Technology',
    college: 'Thapar Institute of Engineering & Technology',
    branch: 'Computer Engineering (COE)',
    gradYear: '2026',
    cgpa: '8.7',
    location: 'Patiala, India',
    experienceLevel: 'Student',
    placementStatus: 'Available for Placement',
    githubUsername: 'rahulsharma-dev',
    leetcodeUsername: 'rahul_codes',
    hackathonsCount: 2,
    teamsCount: 1,
    overallScore: 89,
    skills: [
      {
        id: 'sk-1',
        name: 'Python',
        category: 'Backend',
        status: 'verified',
        score: 92,
        level: 'Expert',
        verifiedAt: '2026-03-08',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'python-core',
        verificationId: 'RC-V92-PYT-4819',
        proofSources: [
          {
            id: 'ps-1',
            type: 'github',
            title: 'fastapi-microservices-demo',
            url: 'https://github.com/rahulsharma-dev/fastapi-microservices-demo',
            details: '14 commits • Async database handlers with SQLAlchemy',
            metric: '18 stars',
            connectedAt: '2026-03-01',
            isVerifiedDemo: true
          }
        ]
      },
      {
        id: 'sk-2',
        name: 'React',
        category: 'Frontend',
        status: 'verified',
        score: 86,
        level: 'Advanced',
        verifiedAt: '2026-03-06',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'react-core',
        verificationId: 'RC-V86-RCT-9482',
        proofSources: [
          {
            id: 'ps-2',
            type: 'github',
            title: 'ecommerce-state-manager',
            url: 'https://github.com/rahulsharma-dev/ecommerce-state-manager',
            details: 'Production React 18 frontend with optimistic updates',
            metric: '32 stars • 8 forks',
            connectedAt: '2026-02-28',
            isVerifiedDemo: true
          }
        ]
      },
      {
        id: 'sk-3',
        name: 'C++',
        category: 'Systems',
        status: 'claimed',
        level: 'Intermediate',
        proofSources: []
      },
      {
        id: 'sk-4',
        name: 'JavaScript',
        category: 'Frontend',
        status: 'verified',
        score: 90,
        level: 'Expert',
        verifiedAt: '2026-02-24',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'javascript-core',
        verificationId: 'RC-V90-JSC-1102',
        proofSources: []
      }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'TaskFlow AI',
        description: 'Collaborative task planner with automated priority suggestions powered by LLMs.',
        tags: ['React', 'Node.js', 'TailwindCSS', 'OpenAI'],
        githubUrl: 'https://github.com/rahulsharma-dev/taskflow-ai',
        liveUrl: 'https://taskflow-ai-demo.dev',
        verifiedSkills: ['React', 'Python'],
        stars: 48
      },
      {
        id: 'proj-2',
        title: 'DevMetrics CLI',
        description: 'Command-line tool that analyzes Git repositories for code churn, bus factor, and test coverage.',
        tags: ['Python', 'Click', 'GitPython'],
        githubUrl: 'https://github.com/rahulsharma-dev/devmetrics-cli',
        verifiedSkills: ['Python'],
        stars: 29
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'Meta Advanced React Specialization',
        issuer: 'Meta / Coursera',
        issueDate: 'Jan 2026',
        credentialId: 'META-77291-SP',
        verificationUrl: 'https://coursera.org/verify/meta-react',
        isVerified: true
      }
    ]
  },
  {
    id: 'user-priya',
    name: 'Priya Mehta',
    username: 'priyamehta_ai',
    role: 'Machine Learning Engineer',
    accountType: 'student',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    bio: 'Kaggle Master & AI researcher specializing in multimodal models, RAG pipelines, fine-tuning LLMs, and PyTorch optimization. Seeking hackathon squads needing deep ML expertise.',
    education: 'B.Tech in Computer Science & Engineering, Thapar Institute of Engineering & Technology',
    college: 'Thapar Institute of Engineering & Technology',
    branch: 'Computer Science & Engineering (CSE)',
    gradYear: '2026',
    cgpa: '9.4',
    location: 'Patiala, India',
    experienceLevel: 'Student',
    placementStatus: 'Available for Placement',
    githubUsername: 'priya-ai-labs',
    kaggleUsername: 'priya_kaggle_master',
    hackathonsCount: 4,
    teamsCount: 2,
    overallScore: 96,
    isPro: true,
    proSubscription: {
      id: 'sub_priya_pro_2026',
      userId: 'user-priya',
      plan: 'recruitcred_pro_monthly',
      status: 'active',
      amount: 10,
      currency: 'INR',
      provider: 'razorpay',
      providerOrderId: 'order_rc_demo_priya',
      providerPaymentId: 'pay_rc_demo_priya_8849',
      startedAt: '1 Mar 2026',
      expiresAt: '1 Apr 2026',
      nextBillingDate: '1 Apr 2026',
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-01T00:00:00.000Z'
    },
    skills: [
      {
        id: 'sk-p1',
        name: 'Python',
        category: 'Backend',
        status: 'verified',
        score: 96,
        level: 'Expert',
        verifiedAt: '2026-03-02',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'python-core',
        verificationId: 'RC-V96-PYT-7718',
        proofSources: [
          {
            id: 'ps-p1',
            type: 'kaggle',
            title: 'Kaggle Grandmaster Tier (NLP & CV)',
            metric: 'Top 0.5% Global Rank • 4 Gold Medals',
            connectedAt: '2026-02-15',
            isVerifiedDemo: true
          },
          {
            id: 'ps-p2',
            type: 'github',
            title: 'multimodal-rag-pipeline',
            url: 'https://github.com/priya-ai-labs/multimodal-rag-pipeline',
            details: 'High-speed embeddings retrieval engine with FAISS and PyTorch',
            metric: '44 stars • 18 forks',
            connectedAt: '2026-02-28',
            isVerifiedDemo: true
          }
        ]
      },
      {
        id: 'sk-p2',
        name: 'SQL',
        category: 'Backend',
        status: 'verified',
        score: 88,
        level: 'Advanced',
        verifiedAt: '2026-02-20',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'sql-core',
        verificationId: 'RC-V88-SQL-3391',
        proofSources: []
      },
      {
        id: 'sk-p3',
        name: 'Git',
        category: 'Cloud & DevOps',
        status: 'verified',
        score: 92,
        level: 'Expert',
        verifiedAt: '2026-02-14',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'git-core',
        verificationId: 'RC-V92-GIT-4402',
        proofSources: []
      }
    ],
    projects: [
      {
        id: 'proj-p1',
        title: 'MedVision Multimodal Diagnosis AI',
        description: 'Deep neural network analyzing chest X-rays paired with EHR clinical transcripts, generating instant triage explanations.',
        tags: ['Python', 'PyTorch', 'FastAPI', 'HuggingFace'],
        githubUrl: 'https://github.com/priya-ai-labs/medvision-ai',
        verifiedSkills: ['Python', 'SQL'],
        stars: 76
      },
      {
        id: 'proj-p2',
        title: 'EdgeLLM Quantizer',
        description: 'Model compression framework pruning 7B parameter models for sub-50ms inference on consumer GPUs.',
        tags: ['Python', 'CUDA', 'Docker'],
        githubUrl: 'https://github.com/priya-ai-labs/edgellm-quantizer',
        verifiedSkills: ['Python'],
        stars: 38
      }
    ],
    certifications: [
      {
        id: 'cert-p1',
        name: 'Deep Learning Specialization',
        issuer: 'DeepLearning.AI',
        issueDate: 'Jan 2026',
        isVerified: true
      }
    ]
  },
  {
    id: 'user-ananya',
    name: 'Ananya Singh',
    username: 'ananya_design',
    role: 'Lead UI/UX Designer',
    accountType: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    bio: 'Bridging user psychology, glassmorphic aesthetics, design systems, and frontend fidelity. 2x Hackathon Best UI Design Winner.',
    education: 'B.Tech in Electronics & Communication, Thapar Institute of Engineering & Technology',
    college: 'Thapar Institute of Engineering & Technology',
    branch: 'Electronics & Communication (ECE)',
    gradYear: '2026',
    cgpa: '8.9',
    location: 'Patiala, India',
    experienceLevel: 'Student',
    placementStatus: 'Available for Placement',
    githubUsername: 'ananya-ui',
    hackathonsCount: 4,
    teamsCount: 2,
    overallScore: 93,
    skills: [
      {
        id: 'sk-an1',
        name: 'HTML/CSS',
        category: 'Frontend',
        status: 'verified',
        score: 94,
        level: 'Expert',
        verifiedAt: '2026-02-24',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'html-css-core',
        verificationId: 'RC-V94-HTM-8802',
        proofSources: [
          {
            id: 'ps-an1',
            type: 'github',
            title: 'aurora-design-tokens',
            url: 'https://github.com/ananya-ui/aurora-design-tokens',
            metric: '82 stars • 24 components',
            connectedAt: '2026-02-18',
            isVerifiedDemo: true
          }
        ]
      },
      {
        id: 'sk-an2',
        name: 'React',
        category: 'Frontend',
        status: 'verified',
        score: 88,
        level: 'Advanced',
        verifiedAt: '2026-02-26',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'react-core',
        verificationId: 'RC-V88-RCT-1940',
        proofSources: []
      },
      {
        id: 'sk-an3',
        name: 'JavaScript',
        category: 'Frontend',
        status: 'verified',
        score: 86,
        level: 'Advanced',
        verifiedAt: '2026-02-22',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'javascript-core',
        verificationId: 'RC-V86-JSC-5520',
        proofSources: []
      }
    ],
    projects: [
      {
        id: 'proj-an1',
        title: 'SaaS Pulse Analytics UI Kit',
        description: 'Comprehensive design system and animated dashboard UI with dark mode, high accessibility, and dynamic widgets.',
        tags: ['Figma', 'HTML/CSS', 'React', 'TailwindCSS'],
        githubUrl: 'https://github.com/ananya-ui/pulse-analytics-ui',
        verifiedSkills: ['HTML/CSS', 'React'],
        stars: 64
      }
    ],
    certifications: []
  },
  {
    id: 'user-kavita',
    name: 'Kavita Desai',
    username: 'kavita_cloud',
    role: 'DevOps & Cloud Architect',
    accountType: 'student',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    bio: 'Kubernetes specialist, Terraform builder, and CI/CD automation nerd. Ensuring hackathon squads deploy reliable, production-grade cloud infra under pressure.',
    education: 'B.Tech Computer Science, IIT Bombay',
    college: 'Indian Institute of Technology Bombay',
    branch: 'Computer Science',
    gradYear: '2025',
    cgpa: '9.1',
    location: 'Mumbai, India',
    experienceLevel: 'Senior',
    placementStatus: 'Actively Interviewing',
    githubUsername: 'kavita-devops',
    hackathonsCount: 5,
    teamsCount: 3,
    overallScore: 95,
    skills: [
      {
        id: 'sk-k1',
        name: 'Git',
        category: 'Cloud & DevOps',
        status: 'verified',
        score: 96,
        level: 'Expert',
        verifiedAt: '2026-03-01',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'git-core',
        verificationId: 'RC-V96-GIT-9912',
        proofSources: [
          {
            id: 'ps-k1',
            type: 'github',
            title: 'k8s-gitops-boilerplate',
            url: 'https://github.com/kavita-devops/k8s-gitops-boilerplate',
            metric: '52 stars • 14 releases',
            connectedAt: '2026-02-25',
            isVerifiedDemo: true
          }
        ]
      },
      {
        id: 'sk-k2',
        name: 'Python',
        category: 'Backend',
        status: 'verified',
        score: 88,
        level: 'Advanced',
        verifiedAt: '2026-02-18',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'python-core',
        verificationId: 'RC-V88-PYT-2201',
        proofSources: []
      },
      {
        id: 'sk-k3',
        name: 'SQL',
        category: 'Backend',
        status: 'verified',
        score: 84,
        level: 'Advanced',
        verifiedAt: '2026-02-15',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'sql-core',
        verificationId: 'RC-V84-SQL-1193',
        proofSources: []
      }
    ],
    projects: [
      {
        id: 'proj-k1',
        title: 'AutoDeploy GitHub Action Bot',
        description: 'Zero-config continuous preview deployment agent spinning up ephemeral preview environments on Kubernetes.',
        tags: ['Git', 'Docker', 'Kubernetes', 'Go'],
        githubUrl: 'https://github.com/kavita-devops/autodeploy-bot',
        verifiedSkills: ['Git', 'Python'],
        stars: 91
      }
    ],
    certifications: []
  },
  {
    id: 'user-vikram',
    name: 'Vikramaditya Iyer',
    username: 'vikram_systems',
    role: 'Systems & Hardware/IoT Engineer',
    accountType: 'student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'Low-latency C++ & embedded systems builder. Specializes in real-time sensor telemetry, robotics firmware, and memory-safe systems software.',
    education: 'B.Tech Electrical Engineering, IIT Madras',
    college: 'Indian Institute of Technology Madras',
    branch: 'Electrical Engineering',
    gradYear: '2025',
    cgpa: '8.8',
    location: 'Chennai, India',
    experienceLevel: 'Senior',
    placementStatus: 'Available for Placement',
    githubUsername: 'vikram-embedded',
    leetcodeUsername: 'vikram_cpp_god',
    hackathonsCount: 6,
    teamsCount: 2,
    overallScore: 94,
    skills: [
      {
        id: 'sk-v1',
        name: 'C++',
        category: 'Systems',
        status: 'verified',
        score: 94,
        level: 'Expert',
        verifiedAt: '2026-03-04',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'cpp-core',
        verificationId: 'RC-V94-CPP-8812',
        proofSources: [
          {
            id: 'ps-v1',
            type: 'leetcode',
            title: 'LeetCode Systems & Algorithms Rating: 2240',
            metric: 'Top 1.2% Percentile • 420 Solved',
            connectedAt: '2026-02-28',
            isVerifiedDemo: true
          }
        ]
      },
      {
        id: 'sk-v2',
        name: 'Python',
        category: 'Backend',
        status: 'verified',
        score: 88,
        level: 'Advanced',
        verifiedAt: '2026-02-12',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'python-core',
        verificationId: 'RC-V88-PYT-7721',
        proofSources: []
      },
      {
        id: 'sk-v3',
        name: 'Git',
        category: 'Cloud & DevOps',
        status: 'verified',
        score: 90,
        level: 'Expert',
        verifiedAt: '2026-02-10',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'git-core',
        verificationId: 'RC-V90-GIT-3310',
        proofSources: []
      }
    ],
    projects: [
      {
        id: 'proj-v1',
        title: 'SensorMesh Real-time Telemetry Gateway',
        description: 'Ultra-low latency C++ embedded daemon streaming environmental sensor metrics over MQTT with zero buffer copies.',
        tags: ['C++', 'IoT', 'MQTT', 'Linux'],
        githubUrl: 'https://github.com/vikram-embedded/sensormesh-daemon',
        verifiedSkills: ['C++', 'Python'],
        stars: 58
      }
    ],
    certifications: []
  },
  {
    id: 'user-rohan',
    name: 'Rohan Verma',
    username: 'rohan_recruiter',
    role: 'Technical Hiring Lead',
    accountType: 'recruiter',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'Leading technical hiring and university campus talent acquisition for FinTech Global Consortium. Focused on verified candidate evaluation and merit-based talent discovery.',
    education: 'M.S. Computer Engineering, IIIT Hyderabad',
    college: 'FinTech Global Consortium',
    branch: 'Talent Acquisition',
    location: 'Bengaluru, India',
    experienceLevel: 'Senior',
    email: 'rohan.verma@fintechglobal.com',
    companyName: 'FinTech Global Consortium',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
    designation: 'Campus Recruitment & Tech Lead',
    workEmail: 'rohan.verma@fintechglobal.com',
    companyWebsite: 'https://fintechglobal.com',
    industry: 'FinTech & AI Platforms',
    companyLocation: 'Bengaluru, India',
    companyDescription: 'Leading financial technology consortium engineering high-throughput payment rails and verified cloud platforms.',
    hiringRoles: [
      'Software Engineering Intern (2026)',
      'Backend Systems Developer (Python/SQL)',
      'Frontend Architect (React)',
      'Cloud Infrastructure Associate'
    ],
    hackathonsCount: 0,
    teamsCount: 0,
    overallScore: 95,
    skills: [],
    projects: [],
    certifications: []
  },
  {
    id: 'user-aarav',
    name: 'Aarav Sharma',
    username: 'aarav_ui',
    role: 'Senior Frontend Architect',
    accountType: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    bio: 'Obsessed with 60fps animations, accessible web apps, and design systems. Built frontend systems for 3 winning hackathon teams.',
    education: 'B.S. Software Engineering, BITS Pilani',
    college: 'Birla Institute of Technology and Science, Pilani',
    branch: 'Computer Science',
    gradYear: '2025',
    cgpa: '9.0',
    location: 'Pilani, India',
    experienceLevel: 'Senior',
    placementStatus: 'Available for Placement',
    githubUsername: 'aarav-frontend',
    leetcodeUsername: 'aarav_js',
    hackathonsCount: 5,
    teamsCount: 2,
    overallScore: 94,
    skills: [
      {
        id: 'sk-aarav-1',
        name: 'React',
        category: 'Frontend',
        status: 'verified',
        score: 95,
        level: 'Expert',
        verifiedAt: '2026-02-12',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'react-core',
        verificationId: 'RC-V95-RCT-8821',
        proofSources: [
          {
            id: 'ps-a1',
            type: 'github',
            title: 'react-virtualized-table-pro',
            url: 'https://github.com/aarav-frontend/react-virtualized-table',
            metric: '110 stars • 22 forks',
            connectedAt: '2026-02-08',
            isVerifiedDemo: true
          }
        ]
      },
      {
        id: 'sk-aarav-2',
        name: 'JavaScript',
        category: 'Frontend',
        status: 'verified',
        score: 93,
        level: 'Expert',
        verifiedAt: '2026-02-10',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'javascript-core',
        verificationId: 'RC-V93-JSC-1948',
        proofSources: []
      },
      {
        id: 'sk-aarav-3',
        name: 'HTML/CSS',
        category: 'Frontend',
        status: 'verified',
        score: 91,
        level: 'Expert',
        verifiedAt: '2026-02-05',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'html-css-core',
        verificationId: 'RC-V91-HTM-3829',
        proofSources: []
      }
    ],
    projects: [
      {
        id: 'proj-a1',
        title: 'CanvasFlow Interactive Flowchart Editor',
        description: 'Browser-based node editor and diagramming canvas with real-time multiplayer WebRTC collaboration.',
        tags: ['React', 'JavaScript', 'HTML/CSS', 'WebRTC'],
        githubUrl: 'https://github.com/aarav-frontend/canvasflow',
        verifiedSkills: ['React', 'JavaScript', 'HTML/CSS'],
        stars: 84
      }
    ],
    certifications: []
  },
  {
    id: 'user-neha',
    name: 'Neha Patel',
    username: 'neha_fullstack',
    role: 'Full-Stack Product Engineer',
    accountType: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    bio: 'Generalist builder who thrives at the intersection of business logic, React UI, and Postgres backends. 3x Hackathon finalist.',
    education: 'B.Tech CSE, DTU Delhi',
    college: 'Delhi Technological University',
    branch: 'Software Engineering',
    gradYear: '2026',
    cgpa: '8.6',
    location: 'Delhi, India',
    experienceLevel: 'Mid-Level',
    placementStatus: 'Available for Placement',
    githubUsername: 'neha-builds',
    hackathonsCount: 3,
    teamsCount: 1,
    overallScore: 90,
    skills: [
      {
        id: 'sk-n1',
        name: 'JavaScript',
        category: 'Frontend',
        status: 'verified',
        score: 91,
        level: 'Expert',
        verifiedAt: '2026-02-28',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'javascript-core',
        verificationId: 'RC-V91-JSC-4820',
        proofSources: []
      },
      {
        id: 'sk-n2',
        name: 'React',
        category: 'Frontend',
        status: 'verified',
        score: 89,
        level: 'Advanced',
        verifiedAt: '2026-02-24',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'react-core',
        verificationId: 'RC-V89-RCT-7182',
        proofSources: []
      },
      {
        id: 'sk-n3',
        name: 'SQL',
        category: 'Backend',
        status: 'verified',
        score: 85,
        level: 'Advanced',
        verifiedAt: '2026-02-20',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'sql-core',
        verificationId: 'RC-V85-SQL-3382',
        proofSources: []
      }
    ],
    projects: [
      {
        id: 'proj-n1',
        title: 'InvoiceGenie AI Billing Engine',
        description: 'Automated invoice extraction and reconciliation app powered by OCR and full-stack PostgreSQL storage.',
        tags: ['React', 'JavaScript', 'SQL', 'Node.js'],
        githubUrl: 'https://github.com/neha-builds/invoicegenie',
        verifiedSkills: ['React', 'SQL', 'JavaScript'],
        stars: 35
      }
    ],
    certifications: []
  },
  {
    id: 'user-devraj',
    name: 'Devraj Kapoor',
    username: 'devraj_vision',
    role: 'AI & Computer Vision Specialist',
    accountType: 'student',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
    bio: 'Building real-time perception models, 3D spatial mapping, and OpenCV pipelines. Keen to join ambitious hackathon teams tackling robotics or smart cities.',
    education: 'M.S. Robotics, IIIT Hyderabad',
    college: 'International Institute of Information Technology, Hyderabad',
    branch: 'Computer Science & Engineering',
    gradYear: '2025',
    cgpa: '9.2',
    location: 'Hyderabad, India',
    experienceLevel: 'Senior',
    placementStatus: 'Available for Placement',
    githubUsername: 'devraj-vision',
    hackathonsCount: 4,
    teamsCount: 2,
    overallScore: 92,
    skills: [
      {
        id: 'sk-d1',
        name: 'Python',
        category: 'Backend',
        status: 'verified',
        score: 95,
        level: 'Expert',
        verifiedAt: '2026-03-03',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'python-core',
        verificationId: 'RC-V95-PYT-9921',
        proofSources: []
      },
      {
        id: 'sk-d2',
        name: 'C++',
        category: 'Systems',
        status: 'verified',
        score: 86,
        level: 'Advanced',
        verifiedAt: '2026-02-27',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'cpp-core',
        verificationId: 'RC-V86-CPP-4418',
        proofSources: []
      },
      {
        id: 'sk-d3',
        name: 'Git',
        category: 'Cloud & DevOps',
        status: 'verified',
        score: 89,
        level: 'Advanced',
        verifiedAt: '2026-02-22',
        verificationSource: 'RecruitCred Assessment',
        assessmentId: 'git-core',
        verificationId: 'RC-V89-GIT-5519',
        proofSources: []
      }
    ],
    projects: [
      {
        id: 'proj-d1',
        title: 'OpenSpatial 3D Point Cloud Tracker',
        description: 'Real-time LiDAR point cloud feature tracker written in C++ and Python for autonomous indoor navigation.',
        tags: ['Python', 'C++', 'OpenCV', 'ROS'],
        githubUrl: 'https://github.com/devraj-vision/openspatial-tracker',
        verifiedSkills: ['Python', 'C++'],
        stars: 62
      }
    ],
    certifications: []
  }
];

export const INITIAL_HACKATHONS: Hackathon[] = [
  {
    id: 'hack-ai-innovate',
    title: 'AI Innovation Challenge 2026',
    tagline: 'Build transformative multimodal AI apps solving healthcare, education, or climate problems.',
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    organizer: 'OpenTech Foundation & Google Cloud',
    startDate: 'Mar 25, 2026',
    endDate: 'Mar 27, 2026',
    prizePool: '$50,000',
    participantsCount: 1420,
    teamsCount: 290,
    tags: ['Artificial Intelligence', 'LLMs', 'Computer Vision', 'Web Apps'],
    lookingForRoles: ['Frontend Developer', 'Backend Developer', 'Machine Learning Engineer', 'UI/UX Designer'],
    requiredSkills: ['Python', 'React', 'SQL', 'Git'],
    description: 'A 48-hour global virtual hackathon bringing together the world’s top engineers to build production-ready AI applications.',
    isFeatured: true
  },
  {
    id: 'hack-web3-fintech',
    title: 'NextGen FinTech & Web3 Sprint',
    tagline: 'Architect high-frequency payment networks, fraud detection engines, and decentralized rails.',
    bannerImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200',
    organizer: 'FinTech Global Consortium',
    startDate: 'Apr 10, 2026',
    endDate: 'Apr 12, 2026',
    prizePool: '$35,000',
    participantsCount: 890,
    teamsCount: 180,
    tags: ['FinTech', 'Cryptography', 'C++', 'React', 'SQL'],
    lookingForRoles: ['Backend Developer', 'Frontend Developer', 'Security Researcher'],
    requiredSkills: ['C++', 'JavaScript', 'SQL'],
    description: 'Build safe, compliant, and lightning-fast financial tooling for the next billion users.',
    isFeatured: false
  },
  {
    id: 'hack-climatetech',
    title: 'ClimateTech & IoT Summit',
    tagline: 'Deploy smart energy monitoring, carbon tracking, and sensor telemetry systems.',
    bannerImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=1200',
    organizer: 'GreenEarth Ventures',
    startDate: 'Apr 28, 2026',
    endDate: 'Apr 30, 2026',
    prizePool: '$25,000',
    participantsCount: 610,
    teamsCount: 120,
    tags: ['IoT', 'Data Visualization', 'Python', 'React'],
    lookingForRoles: ['Full-Stack Developer', 'UI/UX Designer', 'Data Scientist'],
    requiredSkills: ['Python', 'React', 'HTML/CSS'],
    description: 'Leverage data intelligence to combat environmental challenges and streamline renewables.',
    isFeatured: false
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-alpha',
    name: 'Team Alpha',
    hackathonId: 'hack-ai-innovate',
    hackathonName: 'AI Innovation Challenge 2026',
    description: 'Building an automated medical diagnosis copilot. Actively recruiting developers with verified Python, React, and SQL backgrounds.',
    leaderId: 'user-rohan',
    maxSize: 4,
    members: [
      {
        userId: 'user-rohan',
        role: 'Backend Architect & Team Lead',
        isLeader: true,
        joinedAt: '2026-03-01',
        verifiedSkills: ['SQL', 'Python']
      },
      {
        userId: 'user-aarav',
        role: 'Frontend Architect',
        isLeader: false,
        joinedAt: '2026-03-02',
        verifiedSkills: ['React', 'JavaScript']
      }
    ],
    openRoles: ['Full-Stack Developer', 'UI/UX Designer', 'Machine Learning Engineer'],
    requiredSkills: ['Python', 'React', 'HTML/CSS', 'SQL', 'Git'],
    challengesSent: [
      {
        id: 'ch-1',
        teamId: 'team-alpha',
        teamName: 'Team Alpha',
        candidateId: 'user-rahul',
        candidateName: 'Rahul Sharma',
        candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        skillName: 'React',
        difficulty: 'Intermediate',
        questionCount: 5,
        timeLimitMinutes: 10,
        status: 'completed',
        score: 91,
        accuracy: 90,
        timeSpentSeconds: 462, // 7:42
        recommendation: 'Strong Candidate',
        sentAt: '2026-03-08 14:30',
        completedAt: '2026-03-08 14:38',
        feedback: 'Demonstrated solid grasp of React 18 concurrency, hook closures, and component lifecycle.',
        answers: {
          'react-1': 1,
          'react-2': 1,
          'react-3': 1,
          'react-4': 1,
          'react-5': 1
        }
      },
      {
        id: 'ch-2',
        teamId: 'team-alpha',
        teamName: 'Team Alpha',
        candidateId: 'user-priya',
        candidateName: 'Priya Mehta',
        candidateAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
        skillName: 'Python',
        difficulty: 'Advanced',
        questionCount: 5,
        timeLimitMinutes: 10,
        status: 'pending',
        sentAt: '2026-03-08 16:00'
      }
    ]
  },
  {
    id: 'team-spark',
    name: 'EcoTrack Squad',
    hackathonId: 'hack-climatetech',
    hackathonName: 'ClimateTech & IoT Summit',
    description: 'Deploying real-time solar inverter telemetry and carbon footprint prediction dashboards. Need hardware, systems, and UI engineers.',
    leaderId: 'user-rahul',
    maxSize: 4,
    members: [
      {
        userId: 'user-rahul',
        role: 'Full-Stack Developer (Team Lead)',
        isLeader: true,
        joinedAt: '2026-03-04',
        verifiedSkills: ['Python', 'React', 'JavaScript']
      },
      {
        userId: 'user-vikram',
        role: 'Systems & Embedded Engineer',
        isLeader: false,
        joinedAt: '2026-03-06',
        verifiedSkills: ['C++', 'Git']
      }
    ],
    openRoles: ['UI/UX Designer', 'Cloud Architect'],
    requiredSkills: ['Python', 'C++', 'React', 'HTML/CSS', 'Git'],
    challengesSent: [
      {
        id: 'ch-3',
        teamId: 'team-spark',
        teamName: 'EcoTrack Squad',
        candidateId: 'user-ananya',
        candidateName: 'Ananya Singh',
        candidateAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
        skillName: 'HTML/CSS',
        difficulty: 'Intermediate',
        questionCount: 5,
        timeLimitMinutes: 10,
        status: 'completed',
        score: 94,
        accuracy: 94,
        timeSpentSeconds: 380, // 6:20
        recommendation: 'Strong Candidate',
        sentAt: '2026-03-07 11:00',
        completedAt: '2026-03-07 11:07',
        feedback: 'Exceptional knowledge of modern CSS Grid, layout hierarchy, and accessibility tokens.',
        answers: {
          'html-1': 0,
          'html-2': 0,
          'html-3': 0,
          'html-4': 0,
          'html-5': 0
        }
      }
    ]
  }
];

export const INITIAL_INVITATIONS: TeamInvitation[] = [
  {
    id: 'inv-1',
    teamId: 'team-alpha',
    teamName: 'Team Alpha',
    hackathonName: 'AI Innovation Challenge 2026',
    inviterName: 'Rohan Verma',
    inviterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    invitedUserId: 'user-rahul',
    roleOffered: 'Full-Stack Developer',
    message: 'Hey Rahul! We saw your verified React score (86%) and want you on Team Alpha for the AI Innovation Challenge!',
    status: 'pending',
    sentAt: '2026-03-08'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    type: 'assessment',
    title: 'Python Assessment Verified',
    description: 'Scored 92% (7/8 correct). Unlocked Verified Badge & Hash RC-V92-PYT.',
    timestamp: '2 hours ago',
    badge: '92%',
    verified: true
  },
  {
    id: 'act-2',
    type: 'assessment',
    title: 'React 18 Assessment Verified',
    description: 'Scored 86%. Level: Advanced.',
    timestamp: '2 days ago',
    badge: '86%',
    verified: true
  },
  {
    id: 'act-3',
    type: 'proof',
    title: 'GitHub Proof Connected',
    description: 'Linked repository "ecommerce-state-manager" (32 stars).',
    timestamp: '3 days ago',
    verified: true
  },
  {
    id: 'act-4',
    type: 'invite',
    title: 'Received Team Invitation',
    description: 'Team Alpha invited you to join "AI Innovation Challenge 2026".',
    timestamp: '4 days ago'
  }
];

export const PARTNER_COLLEGES: PartnerCollege[] = [
  {
    id: 'col-thapar',
    name: 'Thapar Institute of Engineering & Technology',
    shortName: 'TIET Patiala',
    location: 'Patiala, Punjab',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=200',
    totalStudents: 1420,
    verifiedStudents: 980,
    branches: ['Computer Engineering (COE)', 'Computer Science & Engineering (CSE)', 'Electronics & Communication (ECE)', 'Electrical Engineering (EE)']
  },
  {
    id: 'col-iitb',
    name: 'Indian Institute of Technology Bombay',
    shortName: 'IIT Bombay',
    location: 'Mumbai, Maharashtra',
    logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=200',
    totalStudents: 850,
    verifiedStudents: 720,
    branches: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Data Science & AI']
  },
  {
    id: 'col-iitm',
    name: 'Indian Institute of Technology Madras',
    shortName: 'IIT Madras',
    location: 'Chennai, Tamil Nadu',
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=200',
    totalStudents: 920,
    verifiedStudents: 780,
    branches: ['Computer Science', 'Electrical Engineering', 'Robotics & Automation']
  },
  {
    id: 'col-bits',
    name: 'Birla Institute of Technology and Science, Pilani',
    shortName: 'BITS Pilani',
    location: 'Pilani, Rajasthan',
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=200',
    totalStudents: 1100,
    verifiedStudents: 890,
    branches: ['Computer Science', 'Electronics & Instrumentation', 'Information Systems']
  },
  {
    id: 'col-dtu',
    name: 'Delhi Technological University',
    shortName: 'DTU Delhi',
    location: 'Delhi, India',
    logo: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&q=80&w=200',
    totalStudents: 1300,
    verifiedStudents: 850,
    branches: ['Computer Engineering', 'Information Technology', 'Software Engineering']
  },
  {
    id: 'col-iiith',
    name: 'International Institute of Information Technology, Hyderabad',
    shortName: 'IIIT Hyderabad',
    location: 'Hyderabad, Telangana',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=200',
    totalStudents: 650,
    verifiedStudents: 590,
    branches: ['Computer Science & Engineering', 'Computational Linguistics', 'Electronics']
  }
];

export const INITIAL_RECRUITMENT_REQUIREMENTS: RecruitmentRequirement[] = [
  {
    id: 'req-1',
    title: 'Software Engineering Intern (Summer 2026)',
    college: 'Thapar Institute of Engineering & Technology',
    role: 'Software Engineering Intern',
    branches: ['Computer Engineering (COE)', 'Computer Science & Engineering (CSE)', 'Electronics & Communication (ECE)'],
    gradYear: '2026',
    minCgpa: 8.0,
    requiredSkills: ['Python', 'SQL'],
    requiredVerifiedSkills: ['Python'],
    minAssessmentScore: 75,
    status: 'active',
    createdAt: '2026-03-01'
  },
  {
    id: 'req-2',
    title: 'Frontend Systems Associate',
    college: 'Thapar Institute of Engineering & Technology',
    role: 'Frontend Architect / Engineer',
    branches: ['Computer Engineering (COE)', 'Computer Science & Engineering (CSE)'],
    gradYear: '2026',
    minCgpa: 7.5,
    requiredSkills: ['React', 'JavaScript'],
    requiredVerifiedSkills: ['React'],
    minAssessmentScore: 80,
    status: 'active',
    createdAt: '2026-03-05'
  }
];

export const INITIAL_SHORTLISTED_CANDIDATES: CandidateShortlistRecord[] = [
  {
    id: 'sl-1',
    recruiterId: 'user-rohan',
    candidateId: 'user-rahul',
    candidateName: 'Rahul Sharma',
    candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    college: 'Thapar Institute of Engineering & Technology',
    branch: 'Computer Engineering (COE)',
    cgpa: '8.7',
    targetRole: 'Software Engineering Intern (Summer 2026)',
    verifiedSkills: ['Python', 'React', 'JavaScript'],
    assessmentScore: 92,
    status: 'shortlisted',
    dateAdded: '2026-03-08',
    notes: 'Verified Python (92%) and React (86%). Strong GitHub evidence with FastAPI microservices.'
  },
  {
    id: 'sl-2',
    recruiterId: 'user-rohan',
    candidateId: 'user-priya',
    candidateName: 'Priya Mehta',
    candidateAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    college: 'Thapar Institute of Engineering & Technology',
    branch: 'Computer Science & Engineering (CSE)',
    cgpa: '9.4',
    targetRole: 'Software Engineering Intern (Summer 2026)',
    verifiedSkills: ['Python', 'SQL', 'Git'],
    assessmentScore: 96,
    status: 'shortlisted',
    dateAdded: '2026-03-07',
    notes: 'Kaggle Master, 96% verified Python assessment score.'
  }
];

export const INITIAL_RECRUITER_ACTIVITIES: RecruiterActivityRecord[] = [
  {
    id: 'ract-1',
    recruiterId: 'user-rohan',
    type: 'candidate_shortlisted',
    title: 'Candidate Shortlisted',
    description: 'Shortlisted Rahul Sharma for Software Engineering Intern role',
    timestamp: 'Today at 11:30 AM',
    candidateId: 'user-rahul',
    candidateName: 'Rahul Sharma'
  },
  {
    id: 'ract-2',
    recruiterId: 'user-rohan',
    type: 'requirement_created',
    title: 'Recruitment Requirement Created',
    description: 'Created requirement for Software Engineering Intern at Thapar Institute of Engineering & Technology',
    timestamp: 'Yesterday at 4:15 PM'
  },
  {
    id: 'ract-3',
    recruiterId: 'user-rohan',
    type: 'candidate_viewed',
    title: 'Candidate Profile Evaluated',
    description: 'Reviewed verified skills and GitHub proof for Priya Mehta',
    timestamp: '2 days ago',
    candidateId: 'user-priya',
    candidateName: 'Priya Mehta'
  },
  {
    id: 'ract-4',
    recruiterId: 'user-rohan',
    type: 'college_selected',
    title: 'Campus Recruitment Selected',
    description: 'Switched campus drive focus to Thapar Institute of Engineering & Technology',
    timestamp: '3 days ago'
  }
];
