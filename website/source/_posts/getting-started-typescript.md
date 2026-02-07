---
title: "Getting Started with TypeScript"
date: 2026-02-07
categories: [tutorial]
tags: [typescript, javascript, programming]
description: "Learn TypeScript fundamentals to write safer, more maintainable JavaScript"
---

# Getting Started with TypeScript

TypeScript adds static typing to JavaScript, catching errors before runtime. Learn how to leverage TypeScript in your projects.

## Why TypeScript?

### Benefits of Static Typing

- **Error Prevention** - Catch type errors at compile time
- **Better IDE Support** - Autocomplete, refactoring, inline documentation
- **Self-Documenting** - Types serve as documentation
- **Safer Refactoring** - Compiler catches breaking changes
- **Enhanced Readability** - Clearer API contracts

## Getting Started

### Installation

```bash
# Via npm
npm install -g typescript

# In a project
npm install --save-dev typescript

# Initialize configuration
tsc --init
```

### Basic Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Basic Types

### Primitive Types

```typescript
// String
let name: string = "Alice";
let greeting: string = `Hello, ${name}`;

// Number
let age: number = 30;
let price: number = 19.99;

// Boolean
let isActive: boolean = true;
let hasPermission: boolean = false;
```

### Arrays and Objects

```typescript
// Arrays
let numbers: number[] = [1, 2, 3, 4, 5];
let names: Array<string> = ["Alice", "Bob", "Charlie"];

// Objects with type annotations
let user: { name: string; age: number; email?: string } = {
    name: "Alice",
    age: 30
};
```

### Type Aliases and Interfaces

```typescript
// Type alias
type Point = {
    x: number;
    y: number;
};

// Interface
interface User {
    id: number;
    name: string;
    email?: string;
    role: "admin" | "user" | "guest";
}

// Extending interfaces
interface Admin extends User {
    permissions: string[];
}
```

## Functions

### Function Types

```typescript
// Function declaration
function greet(name: string): string {
    return `Hello, ${name}!`;
}

// Arrow function with types
const add = (a: number, b: number): number => a + b;

// Optional and default parameters
function createUser(
    name: string,
    age?: number,
    role: string = "user"
): User {
    return { name, age, role };
}
```

### Generics

```typescript
// Generic function
function firstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

// Usage
const firstNum = firstElement([1, 2, 3]); // number
const firstStr = firstElement(["a", "b"]); // string

// Generic interface
interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}
```

## Best Practices

1. **Enable strict mode** - Start with all strict flags enabled
2. **Avoid any type** - Use `unknown` instead of `any` when unsure
3. **Use interfaces for objects** - Interfaces are more extensible
4. **Export types used externally** - Make types discoverable
5. **Document complex types** - Comments help future maintainers

## Conclusion

TypeScript significantly improves JavaScript development experience. The initial learning curve pays off in reduced bugs and better maintainability.

---
*Happy typing! 📝*
