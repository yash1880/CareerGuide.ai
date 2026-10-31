const BANK = {
    JavaScript: {
        easy: [
            ['Null type', 'output', 'What is the result of `typeof null` in JavaScript?', '`"object"`', '`"null"`', '`"undefined"`', '`"number"`'],
            ['Const', 'conceptual', 'Which statement is true about `const` in JavaScript?', 'A `const` variable cannot be reassigned', 'A `const` object cannot have its properties changed', '`const` is function-scoped', '`const` is initialized to `undefined` before declaration'],
            ['Work rate', 'aptitude', 'If 5 men or 7 women can complete a job in 10 days, how many days will 10 men and 14 women take?', '2.5 days', '5 days', '10 days', '20 days'],
            ['Function binding', 'conceptual', 'Which method returns a function with `this` bound to a given object?', '`bind()`', '`call()`', '`apply()`', '`attach()`'],
            ['Array reference', 'output', 'What is logged? `const arr = [1, 2, 3]; const copy = arr; copy.push(4); console.log(arr);`', '[1, 2, 3, 4]', '[1, 2, 3]', 'An error', '`undefined`'],
            ['Train speed', 'aptitude', 'A train 180 m long passes a pole in 18 seconds. What is its speed?', '36 km/h', '32 km/h', '40 km/h', '50 km/h'],
            ['Async function', 'conceptual', 'What does calling an `async` function always return?', 'A Promise', 'A callback', '`undefined`', 'A string'],
            ['IIFE', 'conceptual', 'Which expression defines an immediately invoked function expression?', '`(function() {})()`', '`function() {}()`', '`function myFunc() {};`', 'None of these'],
            ['Object reference', 'output', 'What is logged? `const obj = { a: 1, b: 2 }; const copy = obj; copy.a = 99; console.log(obj.a);`', '99', '1', '2', '`undefined`'],
            ['Hoisting', 'output', 'What is logged? `var x = 5; (function() { console.log(x); var x = 10; })();`', '`undefined`', '5', '10', 'A `ReferenceError`'],
            ['Timer closure', 'output', 'What is logged? `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 100);`', '3 3 3', '0 1 2', '0 0 0', 'An error'],
            ['Salary calculation', 'aptitude', 'A person spends one-third of their salary on rent and one-fifth on food, then saves the rest: ₹2,000. What is their salary?', '₹30,000/7 (about ₹4,285.71)', '₹6,000', '₹7,500', '₹9,000'],
            ['Await', 'conceptual', 'Inside a regular function body, where can `await` be used?', 'Inside an `async` function', 'Inside any function without a restriction', 'Only inside a `setTimeout` callback', 'Only in a class constructor'],
            ['Let scope', 'conceptual', 'Variables declared with `let` are:', 'Block-scoped', 'Function-scoped', 'Always globally scoped', 'Hoisted and initialized to `undefined`'],
            ['Even numbers', 'aptitude', 'The average of five consecutive even numbers is 24. What is the largest number?', '28', '26', '30', '32'],
            ['Hoisting', 'conceptual', 'What does hoisting mean in JavaScript?', 'Declarations are processed before code execution within their scope', 'Automatic type conversion', 'Memory allocation optimization', 'Binding every variable to the global scope'],
            ['Class instance', 'conceptual', 'Which keyword is used to create an object from a class?', '`new`', '`create`', '`object`', '`make`'],
            ['Object properties', 'conceptual', 'Which notation can be used to access an object property?', 'Both dot notation and bracket notation', 'Dot notation only', 'Bracket notation only', 'The `::` operator'],
            ['Object structure', 'conceptual', 'In JavaScript, objects are commonly described as collections of:', 'Key-value pairs', 'Values only', 'Arrays only', 'Functions only'],
            ['Template literals', 'conceptual', 'Which symbol is used for JavaScript template literals?', 'Backticks (` `)', 'Single quotes', 'Double quotes (`" "`)', 'Tildes (`~ ~`)'],
            ['Primitive types', 'conceptual', 'How many primitive data types does modern JavaScript have?', '7', '5', '6', '8'],
            ['Class syntax', 'conceptual', 'Which keyword is used to define a class in JavaScript?', '`class`', '`object`', '`define`', '`struct`'],
            ['Family relationship', 'aptitude', 'A man says, “She is the daughter of my grandfather’s only son.” If that son is the man’s father, who is the lady to the man?', 'His sister', 'His cousin', 'His daughter', 'His aunt'],
            ['Age ratio', 'aptitude', 'A and B are in the ratio 3:5. If A is 15 years old, how old is B?', '25 years', '20 years', '30 years', '35 years'],
            ['Car distance ratio', 'aptitude', 'Two cars travel for the same amount of time. Their speeds are in the ratio 3:4. If the first travels 120 km, how far does the second travel?', '160 km', '150 km', '180 km', '200 km'],
            ['Array types', 'conceptual', 'Which statement about JavaScript arrays is correct?', 'They can contain values of different data types', 'They can contain only one data type', 'They are immutable', 'They can contain only objects'],
            ['JavaScript typing', 'conceptual', 'JavaScript is generally described as a:', 'Dynamically typed language', 'Statically typed language', 'Language with no types', 'Language requiring type declarations for every variable'],
            ['Array.isArray', 'output', 'What does `Array.isArray({})` return?', '`false`', '`true`', '`undefined`', '`NaN`'],
            ['Delete operator', 'conceptual', 'What does the `delete` operator primarily remove?', 'An object property', 'A declared variable binding', 'An entire array object', 'A running function'],
            ['Promise concept', 'conceptual', 'What does a Promise represent?', 'A future result that may fulfill or reject', 'A loop', 'A variable declaration', 'A function parameter'],
            ['Ratio division', 'aptitude', 'A and B divide ₹1,200 in the ratio 2:3. How much does A receive?', '₹480', '₹400', '₹500', '₹600'],
            ['Boys and girls ratio', 'aptitude', 'The ratio of boys to girls is 4:5. If there are 36 boys, how many girls are there?', '45', '40', '42', '50']
        ],
        medium: [
            ['For-in iteration', 'conceptual', 'Which statement about `for...in` and `for...of` is correct?', '`for...in` iterates over enumerable keys; `for...of` iterates over values', '`for...in` iterates over array values', '`for...of` iterates over ordinary object keys', 'Both always iterate over array values'],
            ['NaN type', 'output', 'What is `typeof NaN`?', '`"number"`', '`"NaN"`', '`"undefined"`', '`"object"`'],
            ['JSON conversion', 'conceptual', 'Which method converts an object into a JSON string?', '`JSON.stringify()`', '`JSON.parse()`', '`toString()`', '`Object.stringify()`'],
            ['Promise.resolve', 'conceptual', 'What does `Promise.resolve(5)` return?', 'A Promise fulfilled with the value 5', 'The number 5 directly', '`undefined`', 'An error'],
            ['Array slice', 'conceptual', 'Which method returns a new array without modifying the original array?', '`.slice()`', '`.push()`', '`.splice()`', '`.pop()`'],
            ['Age ratio', 'aptitude', 'A and B are currently in the ratio 4:5. After 5 years, their ages will be in the ratio 5:6. How old is A now?', '20 years', '15 years', '25 years', '30 years'],
            ['Currying', 'conceptual', 'What is currying in JavaScript?', 'Transforming a function into nested functions that each take one argument', 'Chaining Promise methods', 'Using arrow functions only', 'Optimizing a loop'],
            ['Event loop output', 'output', 'What is logged? `console.log("A"); setTimeout(() => console.log("B"), 0); console.log("C");`', 'A C B', 'A B C', 'B A C', 'C B A'],
            ['Arrow functions', 'conceptual', 'Which statement is NOT true about arrow functions?', 'They have their own `arguments` object', 'They do not have their own `this` binding', 'They cannot be used as constructors', 'They provide shorter syntax'],
            ['Type coercion', 'output', 'What is the result of `2 + "2" - 2`?', '20', '"22"', '0', '`NaN`'],
            ['Array coercion', 'output', 'What is logged by `console.log([1, 2] + [3, 4])`?', 'The string `"1,23,4"`', 'The array `[1, 2, 3, 4]`', 'The string `"1,2,3,4"`', '`NaN`'],
            ['Falsy values', 'conceptual', 'Which of these values is falsy in JavaScript?', '`0`', 'The string `"false"`', '`[]`', '`{}`'],
            ['Strict equality', 'conceptual', 'Which operator compares both value and type without type coercion?', '`===`', '`==`', '`=`', '`:=`'],
            ['Train speed', 'aptitude', 'A train 180 m long passes a pole in 12 seconds. What is its speed?', '54 km/h', '45 km/h', '15 km/h', '60 km/h'],
            ['Arrow constructors', 'conceptual', 'Which function type cannot be used as a constructor with `new`?', 'An arrow function', 'A function declaration', 'A function expression', 'None of these'],
            ['Function expressions', 'conceptual', 'Which statement best describes function declarations and function expressions?', 'A function declaration is available before its definition; a function expression depends on its assignment', 'Only function expressions are hoisted', 'Both are always callable before assignment', 'Neither can be assigned to a variable'],
            ['Closure uses', 'conceptual', 'Why are closures useful?', 'They can preserve private state and support data encapsulation', 'They make every variable global', 'They automatically retry failed requests', 'They prevent all memory leaks'],
            ['Higher-order examples', 'conceptual', 'Which list contains examples of higher-order array methods?', '`map()`, `forEach()`, and `filter()`', '`push()`, `pop()`, and `slice()`', '`toString()`, `join()`, and `indexOf()`', '`length`, `name`, and `prototype`'],
            ['Promise catch', 'conceptual', 'Which Promise method is commonly used to handle a rejection?', '`.catch()`', '`.then()` only', '`.finally()` only', '`.error()`'],
            ['DOM query', 'conceptual', 'What does `document.querySelectorAll()` return?', 'A NodeList', 'A single element', 'An Array in every browser', 'An HTML string'],
            ['Strict mode', 'conceptual', 'What does `"use strict";` do in JavaScript?', 'Enables strict mode, which prevents some silent errors', 'Automatically converts all types', 'Makes all variables global', 'Disables function declarations'],
            ['NaN checking', 'conceptual', 'Which option lists standard functions that can check for NaN?', '`isNaN()` and `Number.isNaN()`', '`parseNaN()` only', '`Number.parse()` only', '`isNumber()` and `isNaN()`'],
            ['parseInt output', 'output', 'What does `parseInt("10px")` return?', '10', '`NaN`', 'The string `"10"`', '0'],
            ['Array every', 'conceptual', 'Which array method checks whether every element satisfies a condition?', '`.every()`', '`.map()`', '`.filter()`', '`.some()`'],
            ['Default browser action', 'conceptual', 'What is `event.preventDefault()` used for?', 'Preventing the browser’s default action for an event', 'Stopping event bubbling', 'Stopping all JavaScript execution', 'Removing the event listener'],
            ['Integer parsing', 'conceptual', 'Which function converts a string to an integer?', 'Both `parseInt()` and `Number()` can convert an integer-form string', '`parseInt()`', '`parseFloat()`', '`Number()`'],
            ['Block scope', 'conceptual', 'Which declarations are block-scoped?', '`let` and `const`', '`var` only', '`let` only', '`var` and function declarations in every context'],
            ['Two-number ratio', 'aptitude', 'Two numbers are in the ratio 7:11 and their sum is 72. What are the numbers?', '28 and 44', '21 and 51', '18 and 54', '24 and 48'],
            ['String to number', 'conceptual', 'Which choice correctly names functions that can convert a numeric string to a number?', '`parseInt()` parses an integer; `Number()` converts a numeric string', '`parseFloat()` only converts to integers', '`JSON.stringify()` converts strings to numbers', '`toString()` parses a number from text'],
            ['Promise state', 'conceptual', 'Which of these is NOT one of the three states of a Promise?', 'Resolved', 'Pending', 'Fulfilled', 'Rejected'],
            ['Async output', 'output', 'What is logged? `async function foo() { return 10; } foo().then(console.log);`', '10', '`Promise { 10 }`', '`undefined`', 'An error'],
            ['Event loop', 'conceptual', 'What is the event loop responsible for in JavaScript?', 'Scheduling async callbacks when the call stack is available', 'Allocating all memory', 'Compiling JavaScript source', 'Performing file I/O itself'],
            ['Let versus const', 'conceptual', 'What is a key difference between `let` and `const`?', 'A `const` binding cannot be reassigned; a `let` binding can', '`let` is block-scoped but `const` is global', '`const` is function-scoped', '`let` cannot be initialized at declaration']
        ],
        hard: [
            ['Train crossing', 'aptitude', 'Two trains 120 m and 180 m long travel in opposite directions at 48 km/h and 42 km/h. How long do they take to cross each other?', '12 seconds', '18 seconds', '20 seconds', '25 seconds'],
            ['Platform crossing', 'aptitude', 'A 200 m train crosses a 300 m platform in 50 seconds. What is its speed?', '36 km/h', '72 km/h', '54 km/h', '90 km/h'],
            ['Age ratio', 'aptitude', 'A and B are currently in the ratio 3:5. After 10 years, their ages will be in the ratio 2:3. What are their present ages?', '30 and 50 years', '15 and 25 years', '20 and 30 years', '10 and 15 years'],
            ['BigInt type', 'output', 'What is logged by `console.log(typeof 123n)`?', '`"bigint"`', '`"number"`', '`"int"`', 'An error'],
            ['Number conversion', 'output', 'What does `Number("abc")` return?', '`NaN`', '0', '`undefined`', 'An error'],
            ['Class constructor', 'conceptual', 'Which method inside a class is called automatically when a new object is created?', '`constructor()`', '`init()`', '`start()`', '`begin()`'],
            ['Class inheritance', 'conceptual', 'Which keyword creates a child class from a parent class?', '`extends`', '`inherits`', '`super`', '`prototype`'],
            ['Parent constructor', 'conceptual', 'Which keyword calls a parent class constructor from inside a child class?', '`super()`', '`parent()`', '`this()`', '`base()`'],
            ['Function return', 'conceptual', 'What is the default return value of a JavaScript function with no `return` statement?', '`undefined`', '`0`', '`null`', '`false`'],
            ['Higher-order functions', 'conceptual', 'What is a higher-order function?', 'A function that takes another function as an argument or returns a function', 'A function that always returns a number', 'A recursive function only', 'A function that can only be an arrow function'],
            ['Closures', 'conceptual', 'What is a closure?', 'A function bundled with access to its lexical environment', 'A block of code that always runs immediately', 'A function without a return statement', 'A global variable'],
            ['Null and undefined', 'conceptual', 'What is the difference between `null` and `undefined`?', '`null` is an explicitly assigned absence of a value; `undefined` commonly means a value was not assigned', 'They are identical in every way', '`undefined` is an object and `null` is a primitive', '`null` means a variable was never declared'],
            ['Division by zero', 'output', 'What is the result of `10 / 0` in JavaScript?', '`Infinity`', '100', '0', '`NaN`'],
            ['Class meaning', 'conceptual', 'In JavaScript, a class is best described as a:', 'Template for creating objects', 'Primitive data type', 'Built-in array', 'Promise state'],
            ['Interval timer', 'conceptual', 'Which function repeatedly runs a callback at a fixed interval until it is cleared?', '`setInterval()`', '`setTimeout()`', '`delay()`', '`repeat()`'],
            ['Primitive data types', 'conceptual', 'Which choice is not a primitive data type in JavaScript?', 'Object', 'String', 'Number', 'Boolean'],
            ['Falsy boolean', 'output', 'What is the result of `Boolean("")`?', '`false`', '`true`', 'An empty string', '`undefined`']
        ]
    },
    Python: {
        easy: [
            ['Data types', 'conceptual', 'Name Python’s main built-in collection types and describe one use for each.', 'list for ordered mutable sequences, tuple for fixed sequences, dict for key-value lookup, set for unique membership.'],
            ['Mutability', 'conceptual', 'Which is mutable: a list or tuple? What does that mean for a function receiving one?', 'Lists are mutable and can be changed in place; tuples are immutable containers. A function can mutate a passed list unless it copies it.'],
            ['Functions', 'practical', 'Write a function that returns the larger of two numbers without using `max`.', 'Compare the two values and return the larger; mention behavior for equal values if relevant.'],
            ['Strings', 'practical', 'How do you safely check whether a string contains another string in Python?', 'Use `substring in text`; it returns a boolean and is case-sensitive unless normalized first.'],
            ['Dictionaries', 'practical', 'How can you read a possibly missing key from a dictionary without raising `KeyError`?', 'Use `dict.get(key, default)` or test membership before indexing.'],
            ['Loops', 'conceptual', 'What is the difference between `break` and `continue` in a loop?', '`break` exits the nearest loop; `continue` skips to the next iteration.'],
            ['Exceptions', 'practical', 'Show how to catch a `ValueError` while converting user input to an integer.', 'Wrap `int(value)` in `try` and catch `ValueError`; give a useful fallback or message.'],
            ['Comprehensions', 'practical', 'Create a list of squares for even numbers from 0 through 9 using a comprehension.', '`[n * n for n in range(10) if n % 2 == 0]`.'],
            ['Files', 'practical', 'Why is `with open(...) as file` preferred for reading a file?', 'A context manager closes the file reliably, including when an exception occurs.'],
            ['Modules', 'conceptual', 'What does `if __name__ == "__main__":` allow a Python file to do?', 'It runs the guarded block when executed directly, not when imported as a module.'],
            ['Parameters', 'conceptual', 'What is the difference between a positional argument and a keyword argument?', 'Positional arguments bind by order; keyword arguments bind by parameter name and improve clarity.'],
            ['Slicing', 'practical', 'What does `items[1:4]` return, and is index 4 included?', 'A new slice containing indices 1, 2, and 3; the stop index is excluded.'],
            ['Membership', 'practical', 'How do `in` and `not in` work for a list and for a dictionary?', 'For lists they search values; for dictionaries they test keys.'],
            ['None', 'debugging', 'Why should you write `value is None` rather than `value == None`?', '`None` is a singleton, so identity comparison is the intended precise check and avoids overloaded equality.'],
            ['Classes', 'conceptual', 'What is `self` in an instance method?', '`self` is the conventional explicit reference to the instance passed as the first method argument.']
        ],
        medium: [
            ['Mutable defaults', 'debugging', 'Why is `def add(item, items=[]): ...` dangerous across calls, and how do you fix it?', 'Default objects are created once at function definition; use `None` and create a fresh list inside.'],
            ['Generators', 'conceptual', 'How does a generator differ from returning a list, and when is it useful?', 'It yields values lazily and maintains state between yields; useful for large or streaming data.'],
            ['Decorators', 'practical', 'Explain what a decorator does and how `functools.wraps` helps.', 'A decorator wraps/replaces a callable to add behavior; `wraps` preserves metadata such as name and docstring.'],
            ['Comprehensions', 'scenario', 'When would a generator expression be preferable to a list comprehension?', 'When consuming a large sequence once and lazy iteration reduces memory; list comprehension is useful when materialization or repeated access is needed.'],
            ['Exceptions', 'debugging', 'Why should broad `except Exception` blocks be avoided when a specific error can be caught?', 'They can hide programming bugs and unexpected failures; catch expected exceptions and surface or log others.'],
            ['Equality and identity', 'conceptual', 'Contrast `==` and `is`, and give a case where identity matters.', '`==` tests value equality; `is` tests whether references are the same object, appropriate for singleton checks such as `is None`.'],
            ['Copying', 'practical', 'Explain a shallow copy versus a deep copy for a list containing nested lists.', 'A shallow copy creates a new outer list but shares nested lists; deep copy recursively copies supported members.'],
            ['Context managers', 'practical', 'What methods define a basic class-based context manager and what do they control?', '`__enter__` acquires/returns a resource; `__exit__` performs cleanup and may control exception suppression.'],
            ['Sorting', 'practical', 'How do you sort records by age and then by name without changing the original list?', 'Use `sorted(records, key=lambda r: (r["age"], r["name"]))`; sorted returns a new list.'],
            ['Hashability', 'conceptual', 'Why can a tuple be a dictionary key only under certain conditions?', 'A key must be hashable and stable; a tuple is hashable only if all its elements are hashable.'],
            ['Async', 'scenario', 'What does `asyncio.gather` do, and why does it not make CPU-bound Python code parallel by itself?', 'It awaits multiple coroutines concurrently; a single event loop does not parallelize CPU-bound synchronous work.'],
            ['Type hints', 'conceptual', 'Do Python type hints enforce types at runtime by default? What benefit do they provide?', 'No; they support readability, IDEs, and static type checkers, but normal Python does not enforce them automatically.'],
            ['Inheritance', 'scenario', 'When might composition be preferable to inheritance in Python?', 'When behavior can be assembled from collaborators and an is-a relationship is weak; composition reduces tight coupling and fragile hierarchies.'],
            ['Iteration', 'practical', 'What protocol does a `for` loop use, and what signals that iteration is finished?', 'It obtains an iterator with `iter`, calls `next`, and `StopIteration` signals completion.'],
            ['Logging', 'scenario', 'Why use the `logging` module instead of `print` in a reusable application?', 'Logging supports levels, formatting, handlers, filtering and centralized configuration without changing application logic.']
        ],
        hard: [
            ['Descriptors', 'conceptual', 'Explain the descriptor protocol and how data descriptors differ from non-data descriptors in attribute lookup.', 'Descriptors implement `__get__` and optionally `__set__`/`__delete__`; data descriptors take precedence over instance dictionary entries, non-data descriptors do not.'],
            ['MRO', 'scenario', 'How does Python resolve methods in diamond inheritance, and how should cooperative methods use `super()`?', 'C3 linearization defines a consistent MRO; cooperative methods call `super()` once and accept compatible signatures so every class participates.'],
            ['Async cancellation', 'debugging', 'What should an asyncio coroutine do when it receives `CancelledError`, and why is swallowing it risky?', 'Perform cleanup in `finally` and generally re-raise cancellation; swallowing it can break structured cancellation and leave tasks running.'],
            ['Generators', 'practical', 'How do `yield from` and `send()` support delegation between generators?', '`yield from` delegates iteration and forwards send/throw/close behavior to a subgenerator; `send` resumes a generator with a value.'],
            ['Concurrency', 'scenario', 'Choose between threads, multiprocessing, and asyncio for blocking I/O, CPU-heavy work, and many socket connections.', 'Threads suit blocking I/O, processes parallelize CPU-bound work, asyncio handles many cooperative I/O tasks; account for overhead and library behavior.'],
            ['GIL', 'conceptual', 'What does the CPython GIL imply for CPU-bound threads, and what does it not imply about thread safety?', 'The GIL limits simultaneous Python bytecode execution in common CPython builds, but does not make compound operations or shared state automatically safe.'],
            ['Metaclasses', 'scenario', 'What problem does a metaclass solve, and why should it not be the default way to customize classes?', 'A metaclass customizes class creation; it can centralize framework rules but adds complexity better handled by decorators, class hooks, or composition when possible.'],
            ['Memory references', 'debugging', 'A cache holds objects indefinitely. Explain reference counting/cyclic GC in CPython and how to bound the cache.', 'Reference counts free acyclic objects when unreachable; cyclic GC handles reference cycles. GC cannot reclaim objects still referenced, so use eviction, TTL, or weak references where suitable.'],
            ['Import system', 'debugging', 'How can circular imports cause partially initialized module errors, and what are two design-level fixes?', 'A module is inserted before execution finishes, so the other module can observe missing names; extract shared code or invert dependencies/use local imports cautiously.'],
            ['Exception chaining', 'practical', 'When should you use `raise NewError(...) from error`?', 'When translating a low-level failure into a domain-specific error while preserving the original cause for debugging.'],
            ['Dataclasses', 'scenario', 'Why is a mutable default such as a list problematic in a dataclass, and how should it be declared?', 'It would be shared or rejected as an unsafe default; use `field(default_factory=list)` to create one list per instance.'],
            ['Typing variance', 'conceptual', 'Why is `list[Dog]` not safely substitutable for `list[Animal]` in a mutable API?', 'Lists are invariant because a caller could append a non-Dog Animal; read-only abstractions such as `Sequence` can support covariance.'],
            ['Transactions', 'scenario', 'Design a context manager for a database transaction that commits on success and rolls back on exception.', 'Begin/acquire in enter; commit in exit if no exception, otherwise rollback; ensure cleanup and do not suppress the original exception unintentionally.'],
            ['Performance', 'scenario', 'A Python endpoint spends time in nested loops over two large collections. How do you diagnose and improve it without guessing?', 'Profile first; identify repeated linear lookup and build a set/dict index where semantics allow, reducing O(n*m) toward O(n+m).'],
            ['Serialization', 'security', 'Why is unpickling data from an untrusted source unsafe, and what safer alternative could fit simple data exchange?', 'Pickle can execute attacker-controlled code during reconstruction; use validated JSON or another non-executable format for simple data.']
        ]
    },
    Java: {
        easy: [
            ['Primitive types', 'conceptual', 'Name Java’s eight primitive types.', 'byte, short, int, long, float, double, char, and boolean.'],
            ['Strings', 'conceptual', 'Why is `String` immutable in Java, and what does concatenation produce?', 'Strings cannot be changed after creation; concatenation creates a new String value (though compilers may optimize expressions).'],
            ['Equality', 'debugging', 'How do `==` and `.equals()` usually differ when comparing String values?', '`==` compares reference identity for objects; `.equals()` compares contents when correctly implemented.'],
            ['Control flow', 'practical', 'Write a loop that calculates the sum of integers from 1 through n.', 'Initialize a sum, iterate inclusively from 1 to n, add each value; consider n <= 0 and integer overflow.'],
            ['Arrays', 'practical', 'How do you get an array’s length, and what happens when indexing outside its bounds?', 'Use `array.length`; invalid indices throw `ArrayIndexOutOfBoundsException`.'],
            ['Methods', 'conceptual', 'What is a method parameter, and how does Java pass arguments?', 'A parameter is a local input variable; Java passes values, including a copy of an object reference for object arguments.'],
            ['Access modifiers', 'conceptual', 'What is the basic visibility difference between `private` and `public`?', '`private` restricts access to the declaring top-level class context; `public` permits access wherever the type is accessible.'],
            ['Collections', 'practical', 'When would you use an `ArrayList` rather than an array?', 'Use ArrayList for a resizable collection and rich collection operations; arrays have fixed length and can be more direct for fixed-size data.'],
            ['Exceptions', 'practical', 'What is the purpose of a `try-catch` block?', 'It handles an exception thrown in the try block and allows recovery or reporting instead of uncontrolled termination.'],
            ['Loops', 'conceptual', 'What is the difference between a `while` loop and a `do-while` loop?', '`while` checks before the body and may run zero times; `do-while` checks afterward and runs at least once.'],
            ['Classes', 'conceptual', 'What are a class and an object?', 'A class defines a type/state and behavior; an object is an instance with its own state.'],
            ['Static', 'conceptual', 'What does `static` mean for a field or method?', 'It belongs to the class rather than an instance; static methods cannot directly access instance members without an object.'],
            ['Packages', 'conceptual', 'Why do Java programs use packages?', 'Packages organize related types, prevent naming collisions, and participate in access control.'],
            ['Null', 'debugging', 'What happens when an instance method is called through a null reference?', 'A `NullPointerException` is thrown at the attempted dereference.'],
            ['Input', 'practical', 'How can `Scanner` read an integer from standard input?', 'Create a `Scanner` over `System.in` and call `nextInt`; production code should handle invalid input and close owned resources appropriately.']
        ],
        medium: [
            ['Overloading and overriding', 'conceptual', 'Contrast method overloading with method overriding.', 'Overloading uses the same name with different parameter lists and is selected at compile time; overriding replaces inherited instance behavior and dispatches dynamically.'],
            ['Interfaces', 'scenario', 'When would you use an interface instead of a concrete class as a method parameter?', 'Use an interface to depend on an abstraction, accept multiple implementations, and make testing or substitution easier.'],
            ['HashMap', 'conceptual', 'What contract must `equals` and `hashCode` satisfy for objects used as HashMap keys?', 'Equal objects must have equal hash codes; keys should not mutate fields used by equality/hash while stored.'],
            ['Generics', 'practical', 'Why use `List<String>` instead of a raw `List`?', 'Generics provide compile-time type checking, avoid casts, and express intended element types.'],
            ['Exceptions', 'debugging', 'When should a method declare a checked exception, and when is catching and ignoring it a bug?', 'Checked exceptions are part of the API contract when callers can reasonably recover; ignoring loses failure information and can leave invalid state.'],
            ['Streams', 'practical', 'Given a list of integers, describe a stream pipeline that selects positives, squares them, and collects a list.', 'Use `stream().filter(n -> n > 0).map(n -> n * n).toList()` or collect to a list; consider overflow and Java version.'],
            ['Immutability', 'scenario', 'How would you design an immutable class containing a mutable `Date` field?', 'Make fields final, avoid setters, defensively copy Date on input and output, and ensure no mutable internals escape.'],
            ['Concurrency', 'conceptual', 'What does `synchronized` protect, and what does it not guarantee about program design?', 'It provides mutual exclusion and visibility around a monitor; it does not eliminate deadlocks or make unrelated operations atomic.'],
            ['Optional', 'scenario', 'What problem does `Optional` address, and why is it usually not a replacement for every nullable field or method parameter?', 'It explicitly models a possibly absent return value; overuse as fields/parameters can complicate serialization and APIs.'],
            ['Collections', 'practical', 'Compare `ArrayList` and `LinkedList` for indexed access and appending.', 'ArrayList gives O(1) indexed access and amortized O(1) append; LinkedList indexing is O(n), while insertion requires a known node and carries allocation overhead.'],
            ['Inheritance', 'scenario', 'Explain why composition can be safer than subclassing a concrete class.', 'Composition avoids inheriting unwanted behavior and fragile base-class coupling while allowing explicit delegation.'],
            ['Resource cleanup', 'practical', 'What does try-with-resources guarantee for an AutoCloseable resource?', 'It closes resources when leaving the block, including exceptional exits, and handles suppressed close exceptions.'],
            ['Enums', 'scenario', 'Why might an enum with behavior be better than scattering string constants and conditionals?', 'Enums provide a closed type-safe set and can associate behavior/data with each constant, reducing invalid values and branching.'],
            ['JVM memory', 'conceptual', 'At a high level, distinguish stack frames from heap objects.', 'Each thread has call frames/local variables on its stack; objects and arrays are generally allocated on the shared heap and reclaimed by GC.'],
            ['Testing', 'scenario', 'How would you unit-test a service that depends on an external payment gateway?', 'Depend on an interface, inject a fake/mock gateway, test success/failure paths, and reserve real integration behavior for integration tests.']
        ],
        hard: [
            ['Memory model', 'conceptual', 'What does the Java Memory Model’s happens-before relation guarantee, and how can a data race arise?', 'Happens-before guarantees visibility/order for actions; unsynchronized conflicting accesses with a write can form a data race and expose stale/inconsistent state.'],
            ['Volatile', 'debugging', 'Why does `volatile int count; count++` not make increments thread-safe?', 'Volatile provides visibility/order for individual reads/writes but increment is a read-modify-write sequence; use AtomicInteger or locking.'],
            ['Deadlocks', 'scenario', 'Two threads acquire locks A and B in opposite orders. Explain the deadlock condition and a robust prevention strategy.', 'Circular wait can deadlock; impose a global lock order, reduce nested locks, or use timed/try locks with careful recovery.'],
            ['Generics variance', 'practical', 'Explain PECS for Java generics and design a method that copies from a producer list into a consumer list.', 'Producer Extends, Consumer Super: `copy(List<? extends T> src, List<? super T> dst)`; read T from source and write T to destination.'],
            ['Type erasure', 'conceptual', 'What is type erasure, and name two consequences for Java generics.', 'Generic type parameters are mostly erased at runtime; cannot instantiate `new T()` or overload methods only by generic type arguments, and runtime checks use bounds/raw classes.'],
            ['Class loading', 'scenario', 'Describe class initialization order for static fields/blocks and instance fields/constructors in an inheritance chain.', 'Superclass initialization precedes subclass initialization; static initialization once per class, then object construction initializes superclass instance state before subclass state/constructor.'],
            ['HashMap internals', 'scenario', 'How do hash collisions affect HashMap lookup, and why are mutable keys dangerous?', 'Colliding keys share bins and need equality checks/treeification when needed; changing a key’s hash/equality after insertion can make it unreachable by lookup.'],
            ['CompletableFuture', 'practical', 'How do `thenApply`, `thenCompose`, and `exceptionally` differ?', '`thenApply` maps a value, `thenCompose` flattens an async stage, and `exceptionally` recovers from failure.'],
            ['GC reachability', 'debugging', 'A cache causes heap growth even though garbage collection runs. Explain why and how to diagnose it.', 'Live references remain reachable; inspect heap dumps/retention paths, then bound or expire caches and release listeners/references.'],
            ['Safe publication', 'scenario', 'What is safe publication of an immutable object, and name synchronization mechanisms that provide it?', 'Ensure other threads see fully initialized state via final-field guarantees and/or volatile, synchronized, static initialization, or concurrent utilities.'],
            ['Transactions', 'scenario', 'A method updates two accounts and can fail between updates. How do you maintain invariants under concurrent transfers?', 'Use a transaction/lock strategy, acquire locks consistently, validate before mutation, and ensure atomic commit/rollback.'],
            ['Reflection', 'scenario', 'What are the maintenance and security costs of using reflection to bypass encapsulation?', 'It weakens compile-time guarantees, complicates refactoring, may violate module/security boundaries, and should be narrowly scoped and validated.'],
            ['Thread pools', 'design', 'How would you size and protect a thread pool for a service receiving bursts of blocking work?', 'Choose a bounded queue and pool based on workload/latency; define rejection/backpressure, timeouts, metrics, and avoid unbounded thread/queue growth.'],
            ['Equality', 'debugging', 'Why must an overridden `equals` be reflexive, symmetric, transitive, and consistent, and what can break if symmetry fails?', 'Collections rely on the contract; asymmetry can make contains/remove results depend on lookup direction and violate set/map behavior.'],
            ['Lock-free structures', 'conceptual', 'What is the ABA problem in compare-and-set algorithms and how can a design mitigate it?', 'A value changes A→B→A so CAS sees the same value but misses intervening change; stamped/versioned references or hazard/epoch schemes can help.']
        ]
    },
    'C++': {
        easy: [
            ['Types', 'conceptual', 'What is the difference between a signed and unsigned integer type?', 'Signed types represent negative and nonnegative values; unsigned types represent nonnegative values over a different range. Mixed comparisons need care.'],
            ['References', 'conceptual', 'What is a reference in C++, and how does it differ from a pointer at a basic level?', 'A reference is an alias that must be initialized and normally cannot be reseated; a pointer stores an address and can be null/reassigned.'],
            ['Functions', 'practical', 'Write a function that returns the larger of two integers.', 'Compare and return one argument; mention equality and avoid unnecessary copying for larger objects.'],
            ['Arrays', 'debugging', 'What risk comes from accessing an element beyond a built-in array’s bounds?', 'It is undefined behavior; use bounds-aware containers such as `std::array` or `std::vector` and validate indexes.'],
            ['Strings', 'practical', 'How do you concatenate two `std::string` values?', 'Use `+` or `+=`; avoid confusing C strings and lifetime issues.'],
            ['Loops', 'conceptual', 'What is the difference between `break` and `continue`?', '`break` exits the nearest loop; `continue` starts its next iteration.'],
            ['Const', 'conceptual', 'What does `const int* p` mean?', '`p` points to an int that cannot be modified through p; p itself can be reassigned.'],
            ['Vectors', 'practical', 'How can you append an integer to a `std::vector<int>`?', 'Use `push_back(value)` or `emplace_back`; the vector may reallocate and invalidate references/iterators.'],
            ['Headers', 'conceptual', 'Why should a header usually have include guards or `#pragma once`?', 'To prevent repeated inclusion from causing duplicate declarations/definitions; include guards are standard and portable.'],
            ['Classes', 'conceptual', 'What are a class’s public and private members?', 'Public members form accessible interface; private members are accessible to the class and its friends.'],
            ['Compilation', 'conceptual', 'What are the broad stages from C++ source code to a running executable?', 'Preprocessing, compilation, assembly, linking, and loading/execution.'],
            ['Pointers', 'debugging', 'What is a null pointer and what happens if it is dereferenced?', 'It points to no object; dereferencing it is undefined behavior.'],
            ['Functions', 'conceptual', 'What is function overloading?', 'Several functions share a name with different parameter lists; overload resolution selects one at compile time.'],
            ['Namespaces', 'conceptual', 'Why use a namespace?', 'It groups names and avoids collisions; qualify names or use scoped lookup.'],
            ['Input', 'practical', 'How can `std::cin` read an integer and detect invalid input?', 'Use `if (std::cin >> value)` and handle stream failure/clear invalid input as needed.']
        ],
        medium: [
            ['RAII', 'conceptual', 'Explain RAII and why it helps manage resources when exceptions occur.', 'Tie resource acquisition/release to object lifetime; destructors run during stack unwinding, releasing owned resources.'],
            ['Move semantics', 'practical', 'What does `std::move` do, and does it itself move data?', '`std::move` casts to an rvalue reference enabling move overload selection; the selected operation performs the move.'],
            ['Smart pointers', 'scenario', 'Choose between `unique_ptr` and `shared_ptr` for a uniquely owned file resource.', '`unique_ptr` expresses exclusive ownership and deterministic cleanup; shared_ptr is for genuine shared lifetime and adds reference-counting overhead.'],
            ['Iterators', 'debugging', 'Why can `push_back` on a vector invalidate iterators and references?', 'Reallocation may move storage; reserve capacity or avoid using iterators/references across mutations that can invalidate them.'],
            ['Const correctness', 'practical', 'What does a trailing `const` on a member function promise?', 'It will not modify the object’s observable non-mutable state through `this`, allowing calls on const objects.'],
            ['Templates', 'conceptual', 'When is a function template instantiated, and what kind of error is SFINAE intended to prevent?', 'Templates instantiate when required for a concrete use; SFINAE removes invalid candidates from overload resolution rather than making the entire program ill-formed.'],
            ['Copy semantics', 'debugging', 'A class owns a raw heap pointer and is copied by default. What bug can result and what design fixes it?', 'Shallow copying can double-delete/use-after-free; use Rule of Zero with standard ownership types or implement correct deep copy/move operations.'],
            ['Exceptions', 'conceptual', 'Why should a destructor generally not throw during stack unwinding?', 'A second exception while another is active calls terminate; destructors should be noexcept and handle cleanup failures safely.'],
            ['Algorithms', 'practical', 'How do you remove all even integers from a vector safely with the erase-remove idiom?', 'Use `v.erase(std::remove_if(v.begin(), v.end(), pred), v.end())`; include the proper algorithm header.'],
            ['Virtual functions', 'conceptual', 'Why should a polymorphic base class often have a virtual destructor?', 'Deleting a derived object through a base pointer must run the derived destructor; otherwise behavior is undefined and resources may leak.'],
            ['References', 'scenario', 'When should a function accept `const T&` rather than `T` or `T&`?', 'Use const reference for read-only potentially expensive objects; value for cheap/owned copies or move-friendly sinks; non-const ref for mutation.'],
            ['Lambda capture', 'debugging', 'What lifetime bug can occur when a lambda captures a local variable by reference and outlives the function?', 'The reference dangles after the local is destroyed; capture by value or ensure the referenced object outlives the callable.'],
            ['Maps', 'scenario', 'Compare `std::map` and `std::unordered_map` for ordering and typical lookup.', 'map is ordered with O(log n) operations; unordered_map has average O(1) lookup but no ordering and worst-case linear behavior.'],
            ['Undefined behavior', 'conceptual', 'What does undefined behavior mean, and why is it not safe to rely on one compiler’s observed output?', 'The C++ standard imposes no requirements; optimizers may exploit assumptions, so observed behavior is not portable or guaranteed.'],
            ['Mutex', 'practical', 'How does `std::lock_guard` help protect a critical section?', 'It locks on construction and unlocks on destruction, including exceptional exits, preventing forgotten unlocks.']
        ],
        hard: [
            ['Memory model', 'conceptual', 'What is a data race in C++, and what does the standard say about a program that has one?', 'Conflicting unsynchronized accesses in different threads with at least one write form a data race; behavior is undefined.'],
            ['Atomics', 'practical', 'Why does relaxed atomic ordering guarantee atomicity but not publish unrelated data?', 'Relaxed operations are indivisible for that atomic but create no synchronizes-with ordering for other memory; use release/acquire or stronger ordering for publication.'],
            ['Perfect forwarding', 'coding', 'Explain how a forwarding-reference template preserves lvalue/rvalue category, and why `std::forward<T>` is conditional.', 'Template deduction makes T encode value category; `std::forward<T>` casts back to the deduced category, unlike unconditional move.'],
            ['Lifetime', 'debugging', 'A `std::string_view` is returned from a function that created a local string. Explain the bug and a safe alternative.', 'The view is non-owning and dangles when the local string dies; return an owning string or view storage with a longer guaranteed lifetime.'],
            ['Exception safety', 'scenario', 'Define the basic, strong, and no-throw exception guarantees and give an example of the strong guarantee.', 'Basic leaves valid state, strong gives no observable change on failure, no-throw never propagates; copy-and-swap can provide strong guarantee.'],
            ['Templates and concepts', 'design', 'How can C++ concepts improve a generic algorithm’s interface and diagnostics compared with unconstrained templates?', 'Concepts state compile-time requirements, constrain overloads, and produce clearer errors while documenting valid operations.'],
            ['Multiple inheritance', 'scenario', 'How does virtual inheritance address duplicate base subobjects in a diamond, and what complexity does it add?', 'A virtual base is shared by most-derived object; construction responsibility and layout become more complex.'],
            ['Allocator-aware containers', 'scenario', 'Why can swapping two allocator-aware containers be more complicated than swapping their pointers?', 'Allocator propagation/equality rules affect whether storage can be transferred safely; allocator traits determine swap/move behavior.'],
            ['Concurrency', 'debugging', 'Two threads update a shared object under different mutexes depending on the code path. Why is this not safe, and how can you repair it?', 'The same state is not consistently protected, enabling races; use one invariant-preserving lock or a correct atomic protocol with documented ownership.'],
            ['Object slicing', 'debugging', 'What is object slicing, and how do you preserve dynamic polymorphism when storing objects in a collection?', 'Copying derived by value into a base object discards derived state; store owning/non-owning pointers or references to base with virtual behavior.'],
            ['Coroutine lifetime', 'scenario', 'What lifetime hazards arise when a coroutine suspends while holding references to stack locals?', 'The coroutine frame/lifetimes must preserve referenced objects; dangling references can result if owners die. Use owned values or explicit lifetime management.'],
            ['Strict aliasing', 'conceptual', 'What is the strict-aliasing rule, and how should bytes be safely reinterpreted in modern C++?', 'Access through unrelated glvalue types can be undefined; use `std::bit_cast` for same-size trivially copyable values or `memcpy`/byte views as appropriate.'],
            ['Cache invalidation', 'scenario', 'An object stores a pointer into its own vector and is then moved. What invariant can break and how would you redesign it?', 'The pointer may refer to old storage; store indexes/offsets, recompute pointers, or define move operations that restore invariants.'],
            ['Lock-free ABA', 'conceptual', 'Explain the ABA problem in a compare-exchange loop and one mitigation.', 'A location changes A→B→A, so CAS misses the intermediate mutation; tagged/version counters or safe reclamation schemes mitigate it.'],
            ['Performance', 'scenario', 'How would you determine whether a C++ optimization improved performance without introducing a correctness regression?', 'Use representative benchmarks/profiling, control environment, compare distributions, run correctness and sanitizer tests, and inspect generated behavior if needed.']
        ]
    },
    PHP: {
        easy: [
            ['Variables', 'conceptual', 'How are PHP variables written, and what does it mean that PHP is dynamically typed?', 'Variables use `$`; values have types at runtime and variables can hold different types, though declarations/type checks can constrain APIs.'],
            ['Arrays', 'practical', 'How do you create an indexed array and append a value?', 'Use `$items = [1, 2]` and `$items[] = 3`; PHP arrays also support associative keys.'],
            ['Strict comparison', 'debugging', 'How do `==` and `===` differ in PHP?', '`==` compares after type juggling; `===` requires same type and value. Prefer strict comparison when appropriate.'],
            ['Functions', 'practical', 'Write a function that returns the larger of two integers.', 'Compare and return a parameter, with a defined behavior for equal values.'],
            ['Null', 'conceptual', 'What is `null`, and how can you check explicitly for it?', 'It represents absence of a value; use `=== null` or `is_null`.'],
            ['Associative arrays', 'practical', 'How do you read a possibly absent `email` key from an array safely?', 'Use `isset` when null counts as absent, or `array_key_exists` when a present null value must be distinguished.'],
            ['Loops', 'conceptual', 'What is the difference between `break` and `continue`?', '`break` exits a loop; `continue` skips the rest of the current iteration.'],
            ['Strings', 'practical', 'How do single-quoted and double-quoted PHP strings differ?', 'Double-quoted strings interpolate variables and support more escapes; single-quoted strings mostly preserve contents literally.'],
            ['Exceptions', 'practical', 'How does a `try-catch` block handle an exception?', 'Code runs in try; matching thrown Throwable types can be caught; finally can run cleanup.'],
            ['Include', 'conceptual', 'What is the difference between `include` and `require` when a file is missing?', '`include` emits a warning and continues; `require` produces a fatal error/throws an Error in modern PHP.'],
            ['Foreach', 'practical', 'How do you iterate over keys and values in an associative array?', 'Use `foreach ($items as $key => $value)`.'],
            ['Constants', 'conceptual', 'How do you define a named constant, and can it be reassigned?', 'Use `const` or `define`; a defined constant cannot be reassigned.'],
            ['Type declarations', 'conceptual', 'What benefit does a return type declaration provide?', 'It documents and enforces the returned type according to PHP typing/coercion rules, catching API misuse.'],
            ['Superglobals', 'security', 'Why should `$_GET` and `$_POST` values be validated before use?', 'They are untrusted external input; validate expected shape/size and contextually escape output or use parameterized queries.'],
            ['Classes', 'conceptual', 'What are a class and an object in PHP?', 'A class defines properties and methods; an object is an instance of the class.']
        ],
        medium: [
            ['References', 'conceptual', 'What is the difference between assigning an array normally and assigning it by reference with `&`?', 'Normal PHP array assignment uses value semantics with copy-on-write; reference assignment aliases the same variable/storage behavior.'],
            ['Type juggling', 'debugging', 'Why can loose comparisons produce surprising results, and how should security-sensitive checks be written?', 'Implicit coercion can treat different types as equal; validate types and use strict comparisons such as `===`.'],
            ['Namespaces', 'practical', 'What problem do namespaces solve, and how can a class from another namespace be imported?', 'They prevent naming collisions and organize code; use a fully qualified name or `use Vendor\\Package\\ClassName`.'],
            ['Composer', 'conceptual', 'What roles do `composer.json` and Composer’s autoloader play?', '`composer.json` declares dependencies/autoload rules; generated autoloading loads classes without manual includes.'],
            ['PDO', 'security', 'How should user-provided values be included in a PDO SQL query?', 'Use prepared statements with bound parameters; do not concatenate untrusted values into SQL.'],
            ['Password hashing', 'security', 'How should passwords be stored and later verified in PHP?', 'Hash with `password_hash` and verify with `password_verify`; never store plaintext or reversible encryption.'],
            ['Sessions', 'security', 'Why regenerate a session ID after login?', 'It mitigates session fixation by replacing a possibly attacker-known identifier after authentication.'],
            ['Exceptions', 'scenario', 'When should an application catch an exception and when should it allow it to propagate?', 'Catch where recovery, translation, or cleanup is meaningful; otherwise propagate to centralized error handling without exposing internals.'],
            ['Generators', 'practical', 'What does `yield` do and how can a generator reduce memory use?', 'It produces values lazily as an iterable rather than materializing the entire collection.'],
            ['Traits', 'scenario', 'What are traits useful for, and why should they not replace thoughtful object design?', 'Traits reuse method implementations across classes without inheritance; overuse can hide dependencies and create conflicts.'],
            ['Visibility', 'conceptual', 'Compare `public`, `protected`, and `private` members.', 'Public is generally accessible; protected is accessible in class/subclasses; private is limited to the declaring class.'],
            ['Strict types', 'conceptual', 'What does `declare(strict_types=1)` affect, and where must it appear?', 'It affects scalar type coercion for calls made from that file; it must be at the beginning after the opening tag (and declare statements).'],
            ['Null coalescing', 'debugging', 'How does `??` differ from `?:` when a value is zero or an empty string?', '`??` falls back only for unset/null; `?:` uses truthiness and falls back for zero/empty string too.'],
            ['Array filtering', 'practical', 'How would you keep only positive numbers from an array while retaining keys?', 'Use `array_filter($values, fn($value) => $value > 0)`; it preserves keys unless reindexed with `array_values`.'],
            ['Output escaping', 'security', 'How should user-provided text be rendered into an HTML text context?', 'Escape using `htmlspecialchars` with quotes and UTF-8 (e.g., ENT_QUOTES | ENT_SUBSTITUTE); escaping must match the output context.']
        ],
        hard: [
            ['Copy-on-write', 'conceptual', 'Explain PHP array copy-on-write and how references change its behavior.', 'Assignments initially share underlying array storage until mutation triggers copying; references introduce aliasing and can alter separation behavior.'],
            ['Dependency injection', 'design', 'Design a service that sends email without coupling business logic to one SMTP provider.', 'Depend on an interface injected through constructor; provide provider implementations and test with a fake.'],
            ['Transactions', 'scenario', 'A bank transfer updates two rows. How do you ensure either both updates commit or neither does?', 'Use a database transaction, check affected rows/errors, commit only when both succeed, otherwise roll back.'],
            ['Race conditions', 'security', 'A web endpoint checks a coupon is unused, then marks it used in a separate query. How can concurrent requests exploit this and how do you fix it?', 'Both requests can pass the check before either writes; use a transaction with locking/unique constraints or one atomic conditional update.'],
            ['Serialization', 'security', 'Why is `unserialize` on untrusted input dangerous, and what safer format can be used?', 'It can instantiate objects and trigger magic methods/object injection; use validated JSON or another non-object-instantiating format.'],
            ['Generators', 'practical', 'How would you stream a very large CSV without loading the entire file into memory?', 'Read line-by-line with a file handle/generator and yield parsed rows; close the resource reliably.'],
            ['OPcache', 'operations', 'What does OPcache improve, and what deployment issue can arise when cached bytecode is stale?', 'It caches compiled PHP bytecode to avoid repeated parsing; deployments need proper invalidation/restart settings to avoid stale code.'],
            ['Autoloading', 'debugging', 'How can a namespace/class filename mismatch cause Composer PSR-4 autoload failures?', 'PSR-4 maps namespace prefixes to paths and case-sensitive class names/files; correct mapping and directory/case conventions fix resolution.'],
            ['Immutability', 'design', 'How would you make a value object immutable in PHP while preserving validation?', 'Use readonly properties/class where available, validate constructor inputs, avoid mutators, and expose only immutable values/copies.'],
            ['PHP-FPM', 'operations', 'A PHP-FPM pool is saturated under slow external API calls. Explain the symptoms and two mitigations.', 'Workers are occupied causing queueing/timeouts; set timeouts, use async/background queues, tune pool capacity, and reduce external call latency.'],
            ['SQL injection', 'security', 'A query uses a prepared statement for values but interpolates a user-selected column name. Is it safe? Explain.', 'Values are parameterizable, identifiers generally are not; map user choices to a strict server-side allowlist before adding an identifier.'],
            ['Session security', 'security', 'Name key cookie/session protections for an authenticated PHP app and what each helps prevent.', 'Secure requires HTTPS, HttpOnly blocks JS access, SameSite mitigates cross-site requests; rotate IDs and protect state-changing routes with CSRF controls.'],
            ['Error handling', 'design', 'How can a PHP application log internal exceptions while returning safe messages to users?', 'Centralize exception handling, log diagnostic details server-side with correlation IDs, return generic messages, and never expose traces/secrets.'],
            ['Memory leaks', 'debugging', 'A long-running PHP worker’s memory grows while processing jobs. How do you investigate and mitigate it?', 'Profile heap/object retention, release references/large buffers, bound caches, close resources, and recycle workers as a safeguard rather than hiding leaks.'],
            ['API idempotency', 'scenario', 'A payment request may be retried after a timeout. Design an idempotency strategy in a PHP service.', 'Accept a client idempotency key, enforce a unique scoped record transactionally, persist outcome, and return the same result for retries.']
        ]
    }
};

export const SUPPORTED_LANGUAGES = Object.freeze(Object.keys(BANK));
export const DIFFICULTIES = Object.freeze(['easy', 'medium', 'hard']);

const DISTRACTOR_STOP_WORDS = new Set(
    'a about after all also an and any are as at be because before between both but by can compare could describe did difference do does each either else explain for from give had has have he her here how i if in into is it its just may me might more most much must my name neither no nor not of on one only or other our out over she should show so some than that the their them then there these they this those through to too under until up us very was we were what when where which while who why will with would write you your example'.split(' ')
);

function getDistractorTerms(text) {
    return new Set(
        text.replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/[-.]/g, ' ')
            .toLowerCase()
            .match(/[a-z][a-z0-9+#]{2,}/g)
            ?.map((term) => term === 'scoped' ? 'scope' : term)
            .filter((term) => !DISTRACTOR_STOP_WORDS.has(term)) || []
    );
}

function rankDistractor(candidate, targetTerms, termWeights, topic) {
    const candidateTerms = getDistractorTerms(
        `${candidate.topic} ${candidate.kind} ${candidate.question} ${candidate.answer}`
    );
    let sharedWeight = 0;
    for (const term of candidateTerms) {
        if (targetTerms.has(term)) sharedWeight += termWeights.get(term) || 0;
    }
    const targetWeight = [...targetTerms].reduce((sum, term) => sum + (termWeights.get(term) || 0), 0);
    const candidateWeight = [...candidateTerms].reduce((sum, term) => sum + (termWeights.get(term) || 0), 0);
    const similarity = sharedWeight / Math.sqrt(Math.max(targetWeight * candidateWeight, 1));
    return similarity + (candidate.topic === topic ? 0.35 : 0);
}

export function getQuestionSet(language, difficulty, random = Math.random) {
    const questionPool = BANK[language]?.[difficulty];
    if (!questionPool || questionPool.length < 15) {
        throw new RangeError('Question bank must contain at least 15 questions for this language and difficulty.');
    }
    const questionSet = questionPool.slice();
    if (questionSet.length > 15) {
        for (let index = questionSet.length - 1; index > 0; index -= 1) {
            const swapIndex = Math.floor(random() * (index + 1));
            [questionSet[index], questionSet[swapIndex]] = [questionSet[swapIndex], questionSet[index]];
        }
    }
    questionSet.length = 15;

    const languageQuestions = Object.values(BANK[language]).flat();
    const distractorPool = languageQuestions.map(([topic, kind, question, answer]) => ({
        topic,
        kind,
        question,
        answer
    }));
    const termFrequency = new Map();
    for (const candidate of distractorPool) {
        const terms = getDistractorTerms(`${candidate.topic} ${candidate.kind} ${candidate.question} ${candidate.answer}`);
        for (const term of terms) termFrequency.set(term, (termFrequency.get(term) || 0) + 1);
    }
    const termWeights = new Map([...termFrequency.entries()].map(([term, frequency]) => [
        term,
        Math.log(1 + distractorPool.length / frequency)
    ]));

    return questionSet.map(([topic, kind, question, referenceAnswer, ...explicitDistractors], questionIndex) => {
        if (explicitDistractors.length !== 0 && explicitDistractors.length !== 3) {
            throw new Error(`Could not build four distinct options for ${language} ${difficulty} question ${questionIndex + 1}.`);
        }
        let distractors = explicitDistractors;
        if (distractors.length === 0) {
            const targetTerms = getDistractorTerms(`${topic} ${kind} ${question} ${referenceAnswer}`);
            const candidates = distractorPool
                .filter((candidate) => candidate.question !== question && candidate.answer !== referenceAnswer)
                .map((candidate, index) => ({
                    ...candidate,
                    score: rankDistractor(candidate, targetTerms, termWeights, topic),
                    index
                }))
                .sort((left, right) => right.score - left.score || left.index - right.index);
            distractors = [];
            for (const candidate of candidates) {
                if (!distractors.includes(candidate.answer)) distractors.push(candidate.answer);
                if (distractors.length === 3) break;
            }
        }
        const options = [referenceAnswer, ...distractors];
        if (options.length !== 4 || new Set(options).size !== 4) {
            throw new Error(`Could not build four distinct options for ${language} ${difficulty} question ${questionIndex + 1}.`);
        }
        const correctOption = (questionIndex * 3 + DIFFICULTIES.indexOf(difficulty) * 7) % options.length;
        [options[0], options[correctOption]] = [options[correctOption], options[0]];

        return { topic, kind, question, referenceAnswer, options, correctOption };
    });
}

export function validateQuestionBank() {
    let validatedQuestionCount = 0;
    for (const language of SUPPORTED_LANGUAGES) {
        const allQuestions = Object.values(BANK[language]).flat();
        const allQuestionTexts = allQuestions.map(([, , question]) => question);
        if (new Set(allQuestionTexts).size !== allQuestionTexts.length) {
            const duplicates = [...new Set(allQuestionTexts.filter((question, index) =>
                allQuestionTexts.indexOf(question) !== index
            ))];
            throw new Error(`Duplicate ${language} questions in the manual interview bank: ${duplicates.join(' | ')}`);
        }
        for (const difficulty of DIFFICULTIES) {
            const questionPool = BANK[language][difficulty];
            validatedQuestionCount += questionPool.length;
            if (questionPool.length < 15 ||
                new Set(questionPool.map(([, , question]) => question)).size !== questionPool.length) {
                throw new Error(`Invalid or duplicate ${language} ${difficulty} questions in the manual interview bank.`);
            }
            for (const entry of questionPool) {
                const [topic, kind, question, referenceAnswer, ...distractors] = entry;
                if (!topic.trim() || !kind.trim() || !question.trim() || !referenceAnswer.trim() ||
                    (distractors.length !== 0 && distractors.length !== 3) ||
                    (distractors.length === 3 &&
                        new Set([referenceAnswer, ...distractors]).size !== 4)) {
                    throw new Error(`Invalid question or multiple-choice answers for ${language} ${difficulty}.`);
                }
            }
            const questions = getQuestionSet(language, difficulty);
            if (questions.some(({ options, correctOption, referenceAnswer }) =>
                options.length !== 4 ||
                new Set(options).size !== 4 ||
                options[correctOption] !== referenceAnswer
            )) throw new Error(`Could not build a valid MCQ set for ${language} ${difficulty}.`);
        }
    }
    return validatedQuestionCount;
}
