import {
  Assessment,
  AssessmentAttempt,
  AssessmentAssignment,
  VerificationAppointment,
  SkillProgressionRoadmap
} from '../types';

export interface RecommendedAssessment {
  assessmentId: string;
  reason: string;
  targetRole: string;
  companyInterest?: string;
  priority: 'High' | 'Medium';
}

// -------------------------------------------------------------
// QUESTION POOLS & PARAMETERIZED QUESTIONS FOR RANDOMIZATION
// -------------------------------------------------------------

export const PYTHON_QUESTION_POOL = [
  {
    id: 'py-q1',
    category: 'Data Structures',
    question: 'What is the time complexity of searching for a key in an average Python dictionary (hash table)?',
    codeSnippet: 'user_lookup = {user["id"]: user for user in database_users}\nresult = user_lookup.get("usr_8829")',
    codeLanguage: 'python',
    options: ['O(1) average time complexity', 'O(log n) logarithmic time', 'O(n) linear scan time', 'O(n²) quadratic time'],
    correctAnswer: 0,
    explanation: 'Python dictionaries are implemented as resizable hash tables with open addressing and quadratic probing, providing O(1) average time complexity for key lookups and insertions.'
  },
  {
    id: 'py-q2',
    category: 'Memory & Mutability',
    question: 'What will be the output of the following function when executed twice with default parameters?',
    codeSnippet: 'def append_item(item, target_list=[]):\n    target_list.append(item)\n    return target_list\n\nprint(append_item("A"))\nprint(append_item("B"))',
    codeLanguage: 'python',
    options: ["['A'] then ['B']", "['A'] then ['A', 'B']", "['A', 'B'] then ['A', 'B']", "TypeError: default argument is mutable"],
    correctAnswer: 1,
    explanation: 'Default argument expressions in Python are evaluated once when the function definition is executed, so the same mutable list object is reused across consecutive function calls.'
  },
  {
    id: 'py-q3',
    category: 'Generators & Memory',
    question: 'How do generator expressions in Python optimize memory consumption for massive data streams?',
    codeSnippet: 'def stream_records(data_source):\n    for record in data_source:\n        if record.is_valid:\n            yield record.process()',
    codeLanguage: 'python',
    options: [
      'They pre-allocate an array in C-level memory buffers',
      'They yield items lazily on-demand using the iterator protocol without storing the entire sequence in RAM',
      'They compile the bytecode into a multi-threaded daemon thread',
      'They compress the sequence using gzip in cache memory'
    ],
    correctAnswer: 1,
    explanation: 'Generators maintain internal state between yield statements, computing values on-the-fly and requiring O(1) auxiliary memory regardless of dataset size.'
  },
  {
    id: 'py-q4',
    category: 'Concurrency',
    question: 'What role does the Global Interpreter Lock (GIL) play in CPython execution?',
    codeSnippet: 'import threading\n\ndef cpu_bound_task():\n    count = 0\n    for _ in range(10_000_000): count += 1',
    codeLanguage: 'python',
    options: [
      'It prevents multiple threads from accessing disk I/O concurrently',
      'It synchronizes memory garbage collection by serializing native thread execution of Python bytecodes',
      'It restricts Python programs to running on a single operating system user account',
      'It automatically compiles Python scripts into C extensions during runtime'
    ],
    correctAnswer: 1,
    explanation: 'The GIL is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes simultaneously within a single CPython process.'
  },
  {
    id: 'py-q5',
    category: 'Decorators & Closures',
    question: 'What does the `@functools.wraps` decorator preserve when creating custom function wrappers?',
    codeSnippet: 'import functools\n\ndef audit_log(fn):\n    @functools.wraps(fn)\n    def wrapper(*args, **kwargs):\n        return fn(*args, **kwargs)\n    return wrapper',
    codeLanguage: 'python',
    options: [
      'Memory address of the enclosing module',
      'Original function metadata including __name__, __doc__, and __annotations__',
      'Thread affinity and processor core allocation',
      'Local variable garbage collection frequency'
    ],
    correctAnswer: 1,
    explanation: '`functools.wraps` copies original function attributes (like name, docstring, module, and annotations) onto the wrapper function, preventing introspection loss.'
  },
  {
    id: 'py-q6',
    category: 'Object-Oriented Programming',
    question: 'How does Python resolve method lookup order in multiple inheritance hierarchies?',
    codeSnippet: 'class A: pass\nclass B(A): pass\nclass C(A): pass\nclass D(B, C): pass\n# Method Resolution Order (MRO)',
    codeLanguage: 'python',
    options: [
      'Depth-First Search (DFS) from right to left',
      'C3 Linearization Algorithm',
      'Arbitrary hash order of declared base classes',
      'Breadth-First Search (BFS) with strict duplicate elimination'
    ],
    correctAnswer: 1,
    explanation: 'Python uses the C3 Linearization algorithm to construct a monotonic Method Resolution Order (MRO) preserving local precedence order.'
  },
  {
    id: 'py-q7',
    category: 'Context Managers',
    question: 'Which special dunder methods must a class implement to support the `with` statement?',
    codeSnippet: 'class DatabaseConnection:\n    def __enter__(self):\n        return self.connect()\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        self.close()',
    codeLanguage: 'python',
    options: [
      '__init__ and __del__',
      '__open__ and __close__',
      '__enter__ and __exit__',
      '__start__ and __stop__'
    ],
    correctAnswer: 2,
    explanation: 'Context managers in Python require `__enter__()` for resource acquisition and `__exit__()` for deterministic teardown and exception handling.'
  },
  {
    id: 'py-q8',
    category: 'Asyncio & Coroutines',
    question: 'What happens when you call an `async def` function in Python without the `await` keyword?',
    codeSnippet: 'async def fetch_user_data(user_id: str):\n    return {"id": user_id, "status": "active"}\n\nresult = fetch_user_data("usr_102")',
    codeLanguage: 'python',
    options: [
      'It executes synchronously and returns the dictionary immediately',
      'It returns a coroutine object without executing the body until awaited or scheduled on the event loop',
      'It raises a SyntaxError during runtime execution',
      'It starts a background thread automatically'
    ],
    correctAnswer: 1,
    explanation: 'Invoking an async function constructs a coroutine object. It must be awaited or scheduled onto an asyncio event loop to execute.'
  }
];

export const CAD_QUESTION_POOL = [
  {
    id: 'cad-q1',
    category: 'Geometric Dimensioning & Tolerancing (GD&T)',
    question: 'What does the Maximum Material Condition (MMC) modifier symbol Ⓜ signify on a feature control frame?',
    codeSnippet: '[ ⌖ | ⌀ 0.05 Ⓜ | A | B | C ]',
    codeLanguage: 'gdt',
    options: [
      'The tolerance applies when the feature contains the maximum amount of material within its size limits (e.g. smallest hole or largest pin)',
      'The component must be manufactured using maximum allowable machine feed velocity',
      'The material grade must be heat-treated to maximum tensile yield strength',
      'The dimensional boundary allows zero datum reference shift under all temperatures'
    ],
    correctAnswer: 0,
    explanation: 'MMC defines the condition where a feature of size contains the maximum amount of material within its stated limits (e.g., minimum hole diameter or maximum pin diameter), providing bonus tolerance as the feature departs from MMC.'
  },
  {
    id: 'cad-q2',
    category: 'Parametric 3D Modeling',
    question: 'In parametric solid modeling, what is the fundamental difference between a Fully Constrained sketch and an Under-Constrained sketch?',
    codeSnippet: 'Sketch Status: [ Fully Defined / 0 Degrees of Freedom Remaining ]',
    codeLanguage: 'cad',
    options: [
      'Fully constrained sketches have all geometric entities locked by dimensional and geometric constraints with 0 degrees of freedom, preventing accidental feature shift',
      'Under-constrained sketches automatically generate CNC toolpaths faster',
      'Fully constrained sketches cannot be extruded into 3D solid bodies',
      'Under-constrained sketches consume less GPU video memory in assembly view'
    ],
    correctAnswer: 0,
    explanation: 'A fully constrained sketch has all dimensions, collinearities, tangents, and coincident points defined relative to origin/datums, ensuring design intent and parametric predictability upon dimension changes.'
  },
  {
    id: 'cad-q3',
    category: 'Manufacturing & Draft Angles',
    question: 'Why is draft angle essential when designing injection molded or die-cast mechanical components?',
    codeSnippet: 'Feature: Extrude-Thin / Draft: 1.5° outward relative to parting line',
    codeLanguage: 'cad',
    options: [
      'To allow the solidified part to eject smoothly from the mold cavity without surface scuffing or mechanical sticking',
      'To increase the thermal conductivity of the finished polymer part',
      'To reduce the electrical resistance of the mold tooling steel',
      'To eliminate the need for fillet radii along structural ribs'
    ],
    correctAnswer: 0,
    explanation: 'Draft angles create a taper along mold pull directions, reducing friction and suction during ejection so that parts release cleanly without cosmetic drag marks or structural warping.'
  },
  {
    id: 'cad-q4',
    category: 'Finite Element Analysis (FEA)',
    question: 'When performing static structural FEA on a mechanical bracket, what does the Von Mises stress criterion evaluate for ductile materials?',
    codeSnippet: 'Yield Strength: 250 MPa | Max Von Mises: 165 MPa | Safety Factor: 1.51',
    codeLanguage: 'fea',
    options: [
      'Whether distortion energy exceeds the shear yield criterion of the ductile material under multiaxial stress states',
      'The maximum hydrostatic fluid pressure inside hollow cavities',
      'The aerodynamic laminar boundary layer separation point',
      'The electromagnetic eddy current dissipation in conductive joints'
    ],
    correctAnswer: 0,
    explanation: 'Von Mises yield criterion posits that yielding begins when the second deviatoric stress invariant reaches a critical value, making it the industry standard for evaluating ductile metal structural integrity under complex loading.'
  },
  {
    id: 'cad-q5',
    category: 'Assembly Mates & Kinematics',
    question: 'Which assembly constraint type removes 5 degrees of freedom between two cylindrical pins inserted into matching holes?',
    codeSnippet: 'Mate Type: Coincident axis + Coincident planar face',
    codeLanguage: 'cad',
    options: [
      'Concentric mate (2 DOF) + Coincident mate on perpendicular faces (3 DOF), leaving 1 rotational DOF along the cylinder axis',
      'Tangent mate with floating offset',
      'Parallel mate with symmetrical reference plane',
      'Fixed anchor lock to world coordinate frame'
    ],
    correctAnswer: 0,
    explanation: 'A concentric mate removes 4 degrees of freedom (2 translation, 2 rotation), and a planar coincident mate on perpendicular faces removes 1 translation, leaving only 1 rotational degree of freedom.'
  }
];

export const REACT_QUESTION_POOL = [
  {
    id: 'react-q1',
    category: 'Hooks & Rendering',
    question: 'What is the primary benefit of wrapping an expensive computational function in `useMemo`?',
    codeSnippet: 'const sortedCandidates = useMemo(() => {\n  return dataset.filter(c => c.isVerified).sort((a, b) => b.score - a.score);\n}, [dataset]);',
    codeLanguage: 'tsx',
    options: [
      'It prevents recalculation on every re-render unless dependency references change',
      'It converts synchronous computations into parallel web-worker background threads',
      'It automatically uploads computation results to cloud cache storage',
      'It prevents child components from unmounting'
    ],
    correctAnswer: 0,
    explanation: '`useMemo` caches the calculated result between renders, re-executing only when one of its specified dependencies undergoes reference or value mutation.'
  },
  {
    id: 'react-q2',
    category: 'State & Concurrency',
    question: 'How does React 18 `useTransition` help maintain responsive user interfaces during heavy state updates?',
    codeSnippet: 'const [isPending, startTransition] = useTransition();\nstartTransition(() => {\n  setFilterQuery(inputVal);\n});',
    codeLanguage: 'tsx',
    options: [
      'It marks state updates as non-urgent transitions, keeping browser input typing responsive while preparing the new render in the background',
      'It accelerates CSS hardware animation framerates to 120 FPS',
      'It bypasses the React Virtual DOM diffing engine entirely',
      'It caches HTTP GET requests in IndexedDB'
    ],
    correctAnswer: 0,
    explanation: '`startTransition` marks the state update as interruptible, allowing urgent updates (like typing or clicks) to take precedence over heavy rendering updates.'
  },
  {
    id: 'react-q3',
    category: 'Effect Dependencies',
    question: 'Why must cleanup functions returned by `useEffect` be idempotent and self-contained?',
    codeSnippet: 'useEffect(() => {\n  const handler = (e) => setCoords({ x: e.clientX, y: e.clientY });\n  window.addEventListener("mousemove", handler);\n  return () => window.removeEventListener("mousemove", handler);\n}, []);',
    codeLanguage: 'tsx',
    options: [
      'Because React StrictMode mounts, unmounts, and re-mounts effects in development to verify teardown logic and avoid memory leaks',
      'Because browser garbage collectors refuse to free global event listeners without explicit DOM destruction',
      'Because async promises cannot execute inside React hooks',
      'Because cleanup functions trigger automatic component re-renders'
    ],
    correctAnswer: 0,
    explanation: 'In React 18+ and StrictMode, effects run multiple times to verify clean resource teardown. Cleaning up prevents dangling event listeners, memory leaks, and race conditions.'
  }
];

export const PROBLEM_SOLVING_QUESTION_POOL = [
  {
    id: 'ps-q1',
    category: 'Algorithmic Optimization',
    question: 'Given an unsorted array of N integers, what is the most time-efficient algorithm to find if two numbers sum to a target integer K?',
    codeSnippet: 'def two_sum_lookup(nums: list[int], target: int) -> bool:\n    seen = set()\n    for num in nums:\n        if target - num in seen: return True\n        seen.add(num)\n    return False',
    codeLanguage: 'python',
    options: [
      'O(N) time and O(N) space using a hash set lookup',
      'O(N²) brute force nested iteration with O(1) space',
      'O(N log N) sorting followed by binary search with O(1) space',
      'O(2^N) recursive backtracking'
    ],
    correctAnswer: 0,
    explanation: 'Single-pass hash set lookup checks if the complement `target - num` already exists in O(1) average time per element, achieving optimal O(N) total time complexity.'
  },
  {
    id: 'ps-q2',
    category: 'Dynamic Programming',
    question: 'What core property distinguishes problems suitable for Dynamic Programming from standard Divide and Conquer?',
    codeSnippet: 'DP Table: memo[i][w] = max(memo[i-1][w], memo[i-1][w-wt[i]] + val[i])',
    codeLanguage: 'pseudocode',
    options: [
      'Overlapping subproblems and optimal substructure where subproblem solutions can be memoized or tabulated',
      'Requirements for randomized monte-carlo tree sampling',
      'Problems with strictly disjoint independent subproblems',
      'Algorithms that require GPU CUDA tensor cores'
    ],
    correctAnswer: 0,
    explanation: 'Dynamic Programming applies when a problem has optimal substructure and overlapping subproblems, allowing prior subproblem solutions to be stored and reused rather than recomputed repeatedly.'
  }
];

export const C_PROGRAMMING_QUESTION_POOL = [
  {
    id: 'c-q1',
    category: 'Pointers & Memory',
    question: 'What is the result of dereferencing a dangling pointer in C after `free(ptr)` has been called?',
    codeSnippet: 'int *ptr = (int *)malloc(sizeof(int));\n*ptr = 42;\nfree(ptr);\nprintf("%d\\n", *ptr); // What happens here?',
    codeLanguage: 'c',
    options: [
      'Undefined Behavior: The memory may be overwritten, cause a segmentation fault, or return stale garbage values',
      'The compiler automatically re-allocates 4 bytes of heap memory',
      'The program safely prints 0',
      'A compile-time syntax error is raised'
    ],
    correctAnswer: 0,
    explanation: 'Accessing memory after calling `free()` constitutes Undefined Behavior (UB) according to the ISO C standard, and can lead to security vulnerabilities (Use-After-Free) or segmentation faults.'
  },
  {
    id: 'c-q2',
    category: 'Bitwise Operations & Hardware',
    question: 'Which bitwise operation efficiently checks whether an unsigned integer N is an exact power of two?',
    codeSnippet: 'bool is_power_of_two(unsigned int n) {\n    return (n > 0) && ((n & (n - 1)) == 0);\n}',
    codeLanguage: 'c',
    options: [
      '`(n > 0) && ((n & (n - 1)) == 0)`',
      '`(n ^ (n >> 1)) == 1`',
      '`(n | (n - 1)) == n`',
      '`(~n + 1) == 0`'
    ],
    correctAnswer: 0,
    explanation: 'A power of two in binary has only a single 1 bit (e.g. 1000b = 8). Subtracting 1 flips all bits up to the lowest set bit (0111b = 7). Bitwise AND yields 0.'
  }
];

export const EMBEDDED_QUESTION_POOL = [
  {
    id: 'emb-q1',
    category: 'Interrupt Service Routines (ISR)',
    question: 'Why should dynamic memory allocation (`malloc`) and heavy blocking delays (`delay_ms`) never be used inside an Interrupt Service Routine (ISR)?',
    codeSnippet: 'void IRAM_ATTR gpio_isr_handler(void* arg) {\n    // Critical low-latency execution\n    portBASE_TYPE higher_priority_task_woken = pdFALSE;\n    xSemaphoreGiveFromISR(sensor_ready_sem, &higher_priority_task_woken);\n}',
    codeLanguage: 'c',
    options: [
      'ISRs must execute in deterministic microsecond windows; blocking or non-reentrant calls like malloc cause priority inversion, missed hardware triggers, and system lockups',
      'Microcontroller Flash memory gets erased during heap allocation in ISR mode',
      'ISRs run in unprivileged user mode and lack arithmetic registers',
      'Microcontrollers only support interrupts during battery charging mode'
    ],
    correctAnswer: 0,
    explanation: 'ISRs must execute rapidly and deterministically. Functions like malloc are non-reentrant and nondeterministic; blocking calls stall the processor and cause critical real-time deadline misses.'
  },
  {
    id: 'emb-q2',
    category: 'Communication Protocols',
    question: 'What is a fundamental difference between SPI (Serial Peripheral Interface) and I2C (Inter-Integrated Circuit) protocols?',
    codeSnippet: 'SPI: MOSI, MISO, SCK, CS (Full-Duplex, High Speed)\nI2C: SDA, SCL (Half-Duplex, 2-Wire Open-Drain with Pull-ups)',
    codeLanguage: 'hardware',
    options: [
      'SPI is full-duplex with dedicated chip select lines supporting higher clock frequencies; I2C is 2-wire half-duplex with 7-bit addressing and open-drain pullups',
      'I2C requires 4 physical wires per peripheral slave while SPI uses only 1 wire',
      'SPI can only transmit analog voltages while I2C transmits digital bits',
      'I2C requires fiber optic transceivers for clock recovery'
    ],
    correctAnswer: 0,
    explanation: 'SPI provides high throughput full-duplex communication using separate data in/out lines and chip selects, while I2C provides low pin-count synchronous communication over 2 open-drain lines with software addressing.'
  }
];

// -------------------------------------------------------------
// AVAILABLE & LOCKED ASSESSMENTS
// -------------------------------------------------------------

export const COMPREHENSIVE_ASSESSMENTS: Assessment[] = [
  {
    id: 'py-fundamentals',
    skillName: 'Python Fundamentals',
    category: 'Backend',
    difficulty: 'Intermediate',
    durationMinutes: 35,
    questionCount: 30,
    icon: 'Terminal',
    description: 'Timed technical evaluation of Python language mechanics, data structures, memory model, generator protocols, and OOP principles.',
    syllabus: [
      'Hash Table Mechanics & Dict Complexity',
      'Default Mutable Argument Evaluation',
      'Memory Management & Generator Yield Protocols',
      'Global Interpreter Lock (GIL) Architecture',
      'Decorators & Closure Preservation',
      'C3 Method Resolution Order (MRO)'
    ],
    passingScore: 70,
    questions: PYTHON_QUESTION_POOL,
    level: 'Level 1 — Fundamentals',
    isLocked: false,
    certificateAvailable: true,
    verificationContribution: '+8%',
    proctoringRequired: true,
    questionPoolSize: 200
  },
  {
    id: 'py-advanced',
    skillName: 'Advanced Python',
    category: 'Backend',
    difficulty: 'Advanced',
    durationMinutes: 45,
    questionCount: 35,
    icon: 'Terminal',
    description: 'In-depth assessment covering asyncio concurrency, metaclasses, C-API extensions, memory profiling, and high-throughput microservices.',
    syllabus: [
      'Asyncio Event Loop & Coroutine Scheduling',
      'Metaclasses & Class Construction Hooks',
      'Memory Tracing & Garbage Collection Hooks',
      'High-Throughput Concurrency & Multiprocessing',
      'Custom C Extensions & Cython Profiling'
    ],
    passingScore: 75,
    questions: PYTHON_QUESTION_POOL,
    level: 'Level 2 — Intermediate / Advanced',
    isLocked: false,
    certificateAvailable: true,
    verificationContribution: '+12%',
    proctoringRequired: true,
    prerequisite: {
      assessmentId: 'py-fundamentals',
      requiredScore: 75,
      skillName: 'Python Fundamentals',
      requiredLevelTitle: 'Python Fundamentals ≥ 75%'
    },
    questionPoolSize: 250
  },
  {
    id: 'py-professional',
    skillName: 'Professional Python Architecture',
    category: 'Backend',
    difficulty: 'Advanced',
    durationMinutes: 60,
    questionCount: 40,
    icon: 'Server',
    description: 'Enterprise production-grade system architecture, distributed microservices, zero-downtime deployment pipelines, and security audits.',
    syllabus: [
      'Distributed Systems & RPC Architecture',
      'Database Connection Pooling & Query Optimization',
      'Security Hardening & Token Cryptography',
      'Production Profiling & Fault Tolerant Systems'
    ],
    passingScore: 80,
    questions: PYTHON_QUESTION_POOL,
    level: 'Level 3 — Professional',
    isLocked: true,
    certificateAvailable: true,
    verificationContribution: '+15%',
    proctoringRequired: true,
    prerequisite: {
      assessmentId: 'py-advanced',
      requiredScore: 80,
      skillName: 'Advanced Python',
      requiredLevelTitle: 'Advanced Python ≥ 80%'
    },
    questionPoolSize: 300
  },
  {
    id: 'cad-fundamentals',
    skillName: 'CAD Fundamentals',
    category: 'Systems',
    difficulty: 'Intermediate',
    durationMinutes: 30,
    questionCount: 25,
    icon: 'Cpu',
    description: 'Parametric solid modeling principles, GD&T tolerancing, assembly kinematic mates, draft angles, and injection mold design rules.',
    syllabus: [
      'GD&T Maximum Material Condition (MMC)',
      'Parametric Sketch Constraints & DOF',
      'Draft Angles & Mold Parting Line Design',
      'Von Mises Stress FEA Evaluation Criteria',
      'Assembly Kinematic Constraint Chains'
    ],
    passingScore: 70,
    questions: CAD_QUESTION_POOL,
    level: 'Level 1 — Fundamentals',
    isLocked: false,
    certificateAvailable: true,
    verificationContribution: '+8%',
    proctoringRequired: true,
    questionPoolSize: 180
  },
  {
    id: 'cad-solidworks-adv',
    skillName: 'SolidWorks Advanced & FEA Simulation',
    category: 'Systems',
    difficulty: 'Advanced',
    durationMinutes: 45,
    questionCount: 30,
    icon: 'Cpu',
    description: 'Non-linear finite element structural simulation, sheet metal design, advanced surfacing, and generative manufacturing optimization.',
    syllabus: [
      'Non-Linear Mesh Convergence & Stress Singularities',
      'Sheet Metal K-Factor & Bend Deduction Formulations',
      'Class-A Surface Continuity (G0, G1, G2, G3)',
      'Dynamic Fatigue & Harmonic Vibration Analysis'
    ],
    passingScore: 75,
    questions: CAD_QUESTION_POOL,
    level: 'Level 2 — Intermediate',
    isLocked: true,
    certificateAvailable: true,
    verificationContribution: '+12%',
    proctoringRequired: true,
    prerequisite: {
      assessmentId: 'cad-fundamentals',
      requiredScore: 75,
      skillName: 'CAD Fundamentals',
      requiredLevelTitle: 'CAD Fundamentals ≥ 75%'
    },
    questionPoolSize: 220
  },
  {
    id: 'react-fundamentals',
    skillName: 'React Fundamentals',
    category: 'Frontend',
    difficulty: 'Intermediate',
    durationMinutes: 30,
    questionCount: 25,
    icon: 'Atom',
    description: 'React component lifecycles, hooks mechanics, virtual DOM reconciliation, state management, and rendering performance.',
    syllabus: [
      'useMemo & useCallback Dependency Optimization',
      'React 18 Concurrent Transitions & useTransition',
      'Effect Cleanup & Idempotent Teardowns',
      'Context API vs Atomic State Subscriptions',
      'Virtual DOM Fiber Reconciliation Architecture'
    ],
    passingScore: 70,
    questions: REACT_QUESTION_POOL,
    level: 'Level 1 — Fundamentals',
    isLocked: false,
    certificateAvailable: true,
    verificationContribution: '+8%',
    proctoringRequired: true,
    questionPoolSize: 190
  },
  {
    id: 'ps-fundamentals',
    skillName: 'Problem Solving & Algorithms',
    category: 'Systems',
    difficulty: 'Intermediate',
    durationMinutes: 40,
    questionCount: 30,
    icon: 'FileCode2',
    description: 'Time and space complexity analysis, dynamic programming, graph traversal, and algorithmic optimization strategies.',
    syllabus: [
      'Asymptotic Time & Space Complexity Big-O',
      'Hash Table Single-Pass Inversions',
      'Dynamic Programming Tabulation & Memoization',
      'Binary Search & Two-Pointer Patterns',
      'Graph BFS/DFS & Topological Sorts'
    ],
    passingScore: 70,
    questions: PROBLEM_SOLVING_QUESTION_POOL,
    level: 'Level 1 — Fundamentals',
    isLocked: false,
    certificateAvailable: true,
    verificationContribution: '+8%',
    proctoringRequired: true,
    questionPoolSize: 240
  },
  {
    id: 'c-programming-core',
    skillName: 'C Programming & Memory Systems',
    category: 'Systems',
    difficulty: 'Intermediate',
    durationMinutes: 35,
    questionCount: 25,
    icon: 'Terminal',
    description: 'Direct memory pointer arithmetic, stack vs heap allocation, undefined behavior mitigation, and bitwise hardware manipulation.',
    syllabus: [
      'Pointer Dereferencing & Dangling Pointer Mitigations',
      'Bitwise Power-of-Two Validation Operations',
      'Dynamic Memory Allocation (malloc, realloc, free)',
      'Struct Alignment, Padding, & Endianness',
      'Compiler Optimizations & Volatile Keywords'
    ],
    passingScore: 70,
    questions: C_PROGRAMMING_QUESTION_POOL,
    level: 'Level 1 — Fundamentals',
    isLocked: false,
    certificateAvailable: true,
    verificationContribution: '+8%',
    proctoringRequired: true,
    questionPoolSize: 180
  },
  {
    id: 'embedded-systems-core',
    skillName: 'Embedded C & Microcontrollers',
    category: 'Systems',
    difficulty: 'Intermediate',
    durationMinutes: 35,
    questionCount: 25,
    icon: 'Cpu',
    description: 'Real-time embedded system architecture, interrupt service routines (ISR), SPI/I2C/UART protocols, and FreeRTOS tasks.',
    syllabus: [
      'Deterministic Interrupt Service Routine (ISR) Rules',
      'SPI vs I2C vs UART Hardware Bus Protocols',
      'Timer Counters & PWM Motor Control Logic',
      'FreeRTOS Semaphore Task Synchronization',
      'Low-Power Sleep Modes & Battery Budgets'
    ],
    passingScore: 70,
    questions: EMBEDDED_QUESTION_POOL,
    level: 'Level 1 — Fundamentals',
    isLocked: false,
    certificateAvailable: true,
    verificationContribution: '+8%',
    proctoringRequired: true,
    questionPoolSize: 160
  }
];

// -------------------------------------------------------------
// REALISTIC ASSESSMENT HISTORY DEMO DATA (AS SPECIFIED IN PROMPT)
// -------------------------------------------------------------

export const DEMO_ASSESSMENT_ATTEMPTS: AssessmentAttempt[] = [
  {
    id: 'att-py-fund-01',
    assessmentId: 'py-fundamentals',
    userId: 'user-rahul',
    skillName: 'Python Fundamentals',
    score: 86,
    accuracy: 86,
    timeSpentSeconds: 1420, // 23:40
    totalQuestions: 30,
    correctAnswersCount: 26,
    submittedAt: '2026-09-13T00:30:00Z',
    level: 'Advanced',
    answers: {
      'py-q1': 0,
      'py-q2': 1,
      'py-q3': 1,
      'py-q4': 1,
      'py-q5': 1,
      'py-q6': 1,
      'py-q7': 2,
      'py-q8': 1
    },
    passed: true,
    attemptNumber: 1,
    verificationContribution: '+8%',
    integrityStatus: 'Normal'
  },
  {
    id: 'att-c-prog-01',
    assessmentId: 'c-programming-core',
    userId: 'user-rahul',
    skillName: 'C Programming',
    score: 82,
    accuracy: 82,
    timeSpentSeconds: 1310,
    totalQuestions: 25,
    correctAnswersCount: 21,
    submittedAt: '2026-09-11T16:20:00Z',
    level: 'Advanced',
    answers: {
      'c-q1': 0,
      'c-q2': 0
    },
    passed: true,
    attemptNumber: 1,
    verificationContribution: '+8%',
    integrityStatus: 'Normal'
  },
  {
    id: 'att-cad-fund-01',
    assessmentId: 'cad-fundamentals',
    userId: 'user-rahul',
    skillName: 'CAD Fundamentals',
    score: 81,
    accuracy: 81,
    timeSpentSeconds: 1180, // 19:40
    totalQuestions: 25,
    correctAnswersCount: 20,
    submittedAt: '2026-09-10T14:45:00Z',
    level: 'Advanced',
    answers: {
      'cad-q1': 0,
      'cad-q2': 0,
      'cad-q3': 0,
      'cad-q4': 0,
      'cad-q5': 0
    },
    passed: true,
    attemptNumber: 1,
    verificationContribution: '+8%',
    integrityStatus: 'Normal'
  },
  {
    id: 'att-react-fund-01',
    assessmentId: 'react-fundamentals',
    userId: 'user-rahul',
    skillName: 'React Fundamentals',
    score: 72,
    accuracy: 72,
    timeSpentSeconds: 1250,
    totalQuestions: 25,
    correctAnswersCount: 18,
    submittedAt: '2026-09-08T11:15:00Z',
    level: 'Intermediate',
    answers: {
      'react-q1': 0,
      'react-q2': 0,
      'react-q3': 0
    },
    passed: true,
    attemptNumber: 1,
    verificationContribution: '+8%',
    integrityStatus: 'Normal'
  },
  {
    id: 'att-ps-fund-01',
    assessmentId: 'ps-fundamentals',
    userId: 'user-rahul',
    skillName: 'Problem Solving',
    score: 64,
    accuracy: 64,
    timeSpentSeconds: 1450,
    totalQuestions: 30,
    correctAnswersCount: 19,
    submittedAt: '2026-09-05T09:20:00Z',
    level: 'Beginner',
    answers: {
      'ps-q1': 0,
      'ps-q2': 1 // incorrect
    },
    passed: false,
    attemptNumber: 1,
    verificationContribution: '+0%',
    integrityStatus: 'Normal'
  }
];

// -------------------------------------------------------------
// MY ASSIGNMENTS (ASSIGNED, IN PROGRESS, COMPLETED, EXPIRED)
// -------------------------------------------------------------

export const DEMO_ASSIGNMENTS: AssessmentAssignment[] = [
  {
    id: 'asg-01',
    title: 'High-Throughput Microservice Architecture Task',
    company: 'AutoWorks Mobility Systems',
    skill: 'Python / FastAPI',
    assignedDate: '10 Sep 2026',
    dueDate: '16 Sep 2026',
    durationMinutes: 90,
    status: 'Assigned',
    reviewer: 'Lead Systems Architect — AutoWorks Engineering',
    instructions: 'Implement an asynchronous telemetry processing pipeline with Redis pub/sub queue backpressure and idempotency keys.',
    assessmentId: 'py-advanced'
  },
  {
    id: 'asg-02',
    title: 'Parametric Chassis Bracket & FEA Stress Report',
    company: 'DemoTech Advanced Robotics',
    skill: 'CAD & SolidWorks',
    assignedDate: '08 Sep 2026',
    dueDate: '15 Sep 2026',
    durationMinutes: 120,
    status: 'In Progress',
    reviewer: 'Senior Mechanical Lead — DemoTech',
    instructions: 'Model a lightweight 6061-T6 aluminum mounting bracket sustaining 2.5 kN dynamic vibration loads with a safety factor ≥ 1.8.'
  },
  {
    id: 'asg-03',
    title: 'State Architecture & Concurrent UI Flow',
    company: 'DataCore Cloud Labs',
    skill: 'React / TypeScript',
    assignedDate: '01 Sep 2026',
    dueDate: '06 Sep 2026',
    durationMinutes: 75,
    status: 'Completed',
    score: 92,
    reviewer: 'Frontend Staff Engineer — DataCore',
    instructions: 'Build a high-performance virtualized real-time log inspector with search debounce and WebSocket subscription recovery.'
  },
  {
    id: 'asg-04',
    title: 'Legacy C++ Pointer Migration Benchmark',
    company: 'Apex Embedded Networks',
    skill: 'C++ Systems',
    assignedDate: '15 Aug 2026',
    dueDate: '22 Aug 2026',
    durationMinutes: 60,
    status: 'Expired',
    instructions: 'Convert raw pointer allocations in memory pool to smart pointers with zero regression in cache hit rate.'
  }
];

// -------------------------------------------------------------
// VERIFICATION HISTORY & SCHEDULED APPOINTMENTS
// -------------------------------------------------------------

export const DEMO_VERIFICATION_APPOINTMENTS: VerificationAppointment[] = [
  {
    id: 'ver-app-01',
    title: 'Live Technical Architecture Review',
    date: '15 Sep 2026',
    time: '14:30 IST (30 mins)',
    verificationType: 'Live Technical Review',
    status: 'Scheduled',
    evaluator: 'Dr. Alok Verma — Senior Industry Evaluator',
    followUpRequired: 'Prepare architecture diagram of FastAPI microservices demo and repository walkthrough.'
  },
  {
    id: 'ver-app-02',
    title: 'Python Microservices Code Walkthrough',
    date: '12 Sep 2026',
    time: '11:00 IST',
    verificationType: 'Code Walkthrough',
    status: 'Completed',
    evaluator: 'Priya Sundaram — Staff Verification Engineer',
    result: 'Verified with High Distinction. Candidate demonstrated complete mastery over asynchronous SQLAlchemy and JWT token hashing.',
    followUpRequired: 'None — Verified badge issued.'
  },
  {
    id: 'ver-app-03',
    title: 'CAD Tolerancing & Mold Draft Verification',
    date: '09 Sep 2026',
    time: '16:00 IST',
    verificationType: 'Practical Task Assessment',
    status: 'Completed',
    evaluator: 'Vikram Mehta — Principal Mechanical Consultant',
    result: 'Verified. Candidate explained GD&T datum reference chains and mold ejection tapers clearly.',
    followUpRequired: 'None'
  },
  {
    id: 'ver-app-04',
    title: 'Algorithms & Dynamic Programming Review',
    date: '05 Sep 2026',
    time: '17:30 IST',
    verificationType: 'AI Attention Verification',
    status: 'Additional Verification Required',
    evaluator: 'Automated Integrity Engine & Lead Reviewer',
    result: 'Inconclusive attention signals during recursion phase. Scheduled 15-min live coding walkthrough.',
    followUpRequired: 'Attend 15-min live practical session to validate problem solving methodology.'
  }
];

// -------------------------------------------------------------
// SKILL PROGRESSION ROADMAPS (PROFESSIONAL 4-TIER MODEL)
// -------------------------------------------------------------

export const SKILL_PROGRESSION_ROADMAPS: SkillProgressionRoadmap[] = [
  {
    skillName: 'Python',
    category: 'Backend',
    currentLevelTitle: 'Level 2 — Intermediate',
    overallVerificationProgress: 82,
    nextRecommendedAction: 'Take Advanced Python Assessment to unlock Level 3 (Professional Verified).',
    verificationBreakdown: {
      evidenceScore: 88, // GitHub fastAPI microservices + commit analysis
      assessmentScore: 86, // Python Fundamentals Assessment
      projectScore: 80, // Verified project demonstration
      description: 'Progress calculated transparently: 35% Assessment + 35% Static Code Proof + 30% Project Demonstration.'
    },
    levels: [
      {
        levelNumber: 1,
        levelTitle: 'Level 1 — Fundamentals',
        status: 'Passed',
        minScoreToUnlockNext: 70,
        userScore: 86,
        assessmentId: 'py-fundamentals',
        verificationBadge: 'Assessed',
        verificationContribution: '+8%'
      },
      {
        levelNumber: 2,
        levelTitle: 'Level 2 — Intermediate',
        status: 'Available',
        minScoreToUnlockNext: 75,
        assessmentId: 'py-advanced',
        verificationBadge: 'Verified',
        verificationContribution: '+12%',
        prerequisiteDescription: 'Requires Python Fundamentals ≥ 70% (Satisfied: 86%)'
      },
      {
        levelNumber: 3,
        levelTitle: 'Level 3 — Advanced',
        status: 'Locked',
        minScoreToUnlockNext: 80,
        assessmentId: 'py-professional',
        verificationBadge: 'Advanced Verified',
        verificationContribution: '+15%',
        prerequisiteDescription: 'Complete Advanced Python with ≥ 80% to unlock.'
      },
      {
        levelNumber: 4,
        levelTitle: 'Level 4 — Professional',
        status: 'Locked',
        minScoreToUnlockNext: 85,
        verificationBadge: 'Master Verified',
        verificationContribution: '+20%',
        prerequisiteDescription: 'Requires Level 3 completion and virtual technical verification review.'
      }
    ]
  },
  {
    skillName: 'React',
    category: 'Frontend',
    currentLevelTitle: 'Level 1 — Fundamentals',
    overallVerificationProgress: 76,
    nextRecommendedAction: 'Pass React Advanced Hooks & State Architecture to advance to Level 2.',
    verificationBreakdown: {
      evidenceScore: 82,
      assessmentScore: 72,
      projectScore: 75,
      description: 'Progress based on verified GitHub component architecture and 72% on React Fundamentals.'
    },
    levels: [
      {
        levelNumber: 1,
        levelTitle: 'Level 1 — Fundamentals',
        status: 'Passed',
        minScoreToUnlockNext: 70,
        userScore: 72,
        assessmentId: 'react-fundamentals',
        verificationBadge: 'Assessed',
        verificationContribution: '+8%'
      },
      {
        levelNumber: 2,
        levelTitle: 'Level 2 — Intermediate',
        status: 'Available',
        minScoreToUnlockNext: 75,
        verificationBadge: 'Verified',
        verificationContribution: '+12%',
        prerequisiteDescription: 'Requires React Fundamentals ≥ 70% (Satisfied: 72%)'
      },
      {
        levelNumber: 3,
        levelTitle: 'Level 3 — Advanced',
        status: 'Locked',
        minScoreToUnlockNext: 80,
        verificationBadge: 'Advanced Verified',
        verificationContribution: '+15%',
        prerequisiteDescription: 'Complete Level 2 with ≥ 75% score.'
      },
      {
        levelNumber: 4,
        levelTitle: 'Level 4 — Professional',
        status: 'Locked',
        minScoreToUnlockNext: 85,
        verificationBadge: 'Master Verified',
        verificationContribution: '+20%',
        prerequisiteDescription: 'Production architecture review and end-to-end performance audit.'
      }
    ]
  },
  {
    skillName: 'CAD & 3D Modeling',
    category: 'Systems',
    currentLevelTitle: 'Level 1 — Fundamentals',
    overallVerificationProgress: 78,
    nextRecommendedAction: 'Take SolidWorks Advanced & FEA Simulation to unlock Level 2.',
    verificationBreakdown: {
      evidenceScore: 75,
      assessmentScore: 81,
      projectScore: 80,
      description: 'Progress based on 81% CAD Fundamentals score and linked mechanical assembly proof.'
    },
    levels: [
      {
        levelNumber: 1,
        levelTitle: 'Level 1 — Fundamentals',
        status: 'Passed',
        minScoreToUnlockNext: 70,
        userScore: 81,
        assessmentId: 'cad-fundamentals',
        verificationBadge: 'Assessed',
        verificationContribution: '+8%'
      },
      {
        levelNumber: 2,
        levelTitle: 'Level 2 — Intermediate',
        status: 'Available',
        minScoreToUnlockNext: 75,
        assessmentId: 'cad-solidworks-adv',
        verificationBadge: 'Verified',
        verificationContribution: '+12%',
        prerequisiteDescription: 'Requires CAD Fundamentals ≥ 70% (Satisfied: 81%)'
      },
      {
        levelNumber: 3,
        levelTitle: 'Level 3 — Advanced',
        status: 'Locked',
        minScoreToUnlockNext: 80,
        verificationBadge: 'Advanced Verified',
        verificationContribution: '+15%',
        prerequisiteDescription: 'Requires FEA simulation validation and complex surfacing review.'
      },
      {
        levelNumber: 4,
        levelTitle: 'Level 4 — Professional',
        status: 'Locked',
        minScoreToUnlockNext: 85,
        verificationBadge: 'Master Verified',
        verificationContribution: '+20%',
        prerequisiteDescription: 'Requires real-world tooling and CNC fabrication portfolio verification.'
      }
    ]
  },
  {
    skillName: 'Problem Solving',
    category: 'Systems',
    currentLevelTitle: 'Level 1 — Preparation in Progress',
    overallVerificationProgress: 45,
    nextRecommendedAction: 'Retake Problem Solving & Algorithms Assessment after reviewing Dynamic Programming.',
    verificationBreakdown: {
      evidenceScore: 60,
      assessmentScore: 64, // Needs 70%
      projectScore: 40,
      description: 'Score 64% in initial attempt. Retake after reviewing algorithmic subproblem memoization.'
    },
    levels: [
      {
        levelNumber: 1,
        levelTitle: 'Level 1 — Fundamentals',
        status: 'Available',
        minScoreToUnlockNext: 70,
        userScore: 64,
        assessmentId: 'ps-fundamentals',
        verificationBadge: 'Assessed',
        verificationContribution: '+8%',
        prerequisiteDescription: 'Current score: 64%. Minimum required: 70%.'
      },
      {
        levelNumber: 2,
        levelTitle: 'Level 2 — Intermediate',
        status: 'Locked',
        minScoreToUnlockNext: 75,
        verificationBadge: 'Verified',
        verificationContribution: '+12%',
        prerequisiteDescription: 'Complete Level 1 Fundamentals with ≥ 70% score.'
      },
      {
        levelNumber: 3,
        levelTitle: 'Level 3 — Advanced',
        status: 'Locked',
        minScoreToUnlockNext: 80,
        verificationBadge: 'Advanced Verified',
        verificationContribution: '+15%',
        prerequisiteDescription: 'Complete Level 2 Intermediate algorithms.'
      },
      {
        levelNumber: 4,
        levelTitle: 'Level 4 — Professional',
        status: 'Locked',
        minScoreToUnlockNext: 85,
        verificationBadge: 'Master Verified',
        verificationContribution: '+20%',
        prerequisiteDescription: 'Complete competitive programming benchmarks.'
      }
    ]
  }
];

// -------------------------------------------------------------
// RECOMMENDED ASSESSMENTS ENGINE DATA
// -------------------------------------------------------------

export const RECOMMENDED_ASSESSMENTS: RecommendedAssessment[] = [
  {
    assessmentId: 'py-advanced',
    targetRole: 'Senior Backend Engineer / Cloud Systems',
    companyInterest: 'AutoWorks Mobility & DataCore Cloud Labs',
    reason: 'Several active backend roles require Level 2 Python verification with AsyncIO & microservice depth.',
    priority: 'High'
  },
  {
    assessmentId: 'cad-solidworks-adv',
    targetRole: 'Mechanical Design Engineer',
    companyInterest: 'DemoTech Advanced Robotics',
    reason: 'DemoTech requires verified SolidWorks FEA and GD&T credentials for rapid hardware prototyping roles.',
    priority: 'High'
  },
  {
    assessmentId: 'ps-fundamentals',
    targetRole: 'Core Software Developer',
    reason: 'Retaking Problem Solving to achieve ≥ 70% will boost your overall profile credibility score by +6%.',
    priority: 'Medium'
  }
];
