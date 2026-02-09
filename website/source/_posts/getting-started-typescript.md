---
title: "Getting Started with TypeScript"
date: 2026-02-07 14:00:00
tags: [TypeScript, JavaScript, Programming, Web Development]
categories: Web Development
description: "Learn TypeScript from scratch - understand types, interfaces, generics, and advanced patterns."
keywords: "TypeScript, JavaScript, types, interfaces, generics"
---

# Getting Started with TypeScript

TypeScript has become the industry standard for building scalable JavaScript applications. This comprehensive guide covers everything you need to know.

## Why TypeScript?

TypeScript offers several key advantages:

- **Static Type Checking**: Catch errors at compile time
- **Better IDE Support**: Improved autocomplete and refactoring
- **Safer Refactoring**: Type safety makes changes easier
- **Modern Features**: Access to latest JavaScript features

## Installation and Setup

```bash
# Install TypeScript globally
npm install -g typescript

# Create a new project
mkdir my-typescript-app
cd my-typescript-app
npm init -y
npm install typescript --save-dev

# Initialize TypeScript config
npx tsc --init
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Basic Types

```typescript
// Primitive types
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3, 4, 5];
let names: Array<string> = ["Alice", "Bob", "Charlie"];

// Tuples
let person: [string, number, boolean] = ["John", 30, true];
let coordinates: [number, number] = [10, 20];

// Enums
enum Status {
  Pending = "PENDING",
  Active = "ACTIVE",
  Completed = "COMPLETED",
  Failed = "FAILED"
}

let currentStatus: Status = Status.Active;

// Any, Unknown, Void, Null, Undefined
let anything: any = "could be anything";
let unknownValue: unknown = "not sure yet";
function logMessage(): void {
  console.log("This function returns nothing");
}
let nullValue: null = null;
let undefinedValue: undefined = undefined;
```

## Object Types and Interfaces

```typescript
// Interface
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Optional property
  readonly createdAt: Date; // Read-only property
}

// Type alias
type Point = {
  x: number;
  y: number;
};

// Interface extending
interface Admin extends User {
  permissions: string[];
  role: "admin" | "superadmin";
}

// Class implementing interface
class UserManager implements User {
  id: number;
  name: string;
  email: string;
  readonly createdAt: Date;
  
  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }
  
  greet(): string {
    return `Hello, ${this.name}!`;
  }
}
```

## Function Types

```typescript
// Basic function
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Optional parameters
function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}!`;
}

// Default parameters
function createUser(name: string, role: string = "user"): User {
  return { id: 0, name, email: `${name.toLowerCase()}@example.com`, role };
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

// Function types
type MathOperation = (a: number, b: number) => number;

const calculate = (operation: MathOperation, a: number, b: number): number => {
  return operation(a, b);
};

// Callback types
function processItems<T>(items: T[], callback: (item: T, index: number) => void): void {
  items.forEach(callback);
}
```

## Generics

```typescript
// Generic function
function identity<T>(value: T): T {
  return value;
}

// Generic interface
interface Repository<T, ID> {
  findById(id: ID): T | null;
  findAll(): T[];
  save(entity: T): T;
  delete(id: ID): boolean;
}

// Generic class
class DataStore<T> {
  private items: T[] = [];
  
  add(item: T): void {
    this.items.push(item);
  }
  
  get(index: number): T | undefined {
    return this.items[index];
  }
  
  getAll(): T[] {
    return [...this.items];
  }
  
  filter<U>(predicate: (item: T) => item is U): U[] {
    return this.items.filter(predicate);
  }
}

// Generic constraints
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

interface HasName {
  name: string;
}

function greetEntity<T extends HasName>(entity: T): string {
  return `Hello, ${entity.name}!`;
}
```

## Advanced Types

```typescript
// Union types
type ID = number | string;
type StatusCode = 200 | 400 | 404 | 500;

// Intersection types
type Employee = {
  id: number;
  name: string;
};

type Department = {
  deptName: string;
  budget: number;
};

type EmployeeWithDept = Employee & Department;

// Literal types
type Direction = "north" | "south" | "east" | "west";
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

// Type guards
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function processValue(value: string | number) {
  if (isString(value)) {
    return value.toUpperCase();
  }
  return value * 2;
}

// Mapped types
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Utility types
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Omit<User, "password">;
type UserPreview = Pick<User, "id" | "name">;
type OptionalUser = Partial<User>;
type ImmutableUser = Readonly<User>;
```

## Classes and Modules

```typescript
// Abstract class
abstract class Animal {
  constructor(public name: string) {}
  
  abstract makeSound(): void;
  
  move(): void {
    console.log(`${this.name} is moving`);
  }
}

class Dog extends Animal {
  makeSound(): void {
    console.log("Woof!");
  }
}

// Module exports
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export interface Point {
  x: number;
  y: number;
}

export default class Calculator {
  // Default export
}

// Importing
import Calculator, { add, Point } from "./math";
```

## Decorators

```typescript
// Class decorator
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

// Method decorator
function logMethod(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;
  
  descriptor.value = function (...args: unknown[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Method ${propertyKey} returned:`, result);
    return result;
  };
  
  return descriptor;
}

// Property decorator
function readonly(target: Object, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false,
    configurable: false
  });
}

@sealed
class UserService {
  @readonly
  static VERSION = "1.0";
  
  @logMethod
  getUser(id: number): User {
    return { id, name: "John" };
  }
}
```

## Best Practices

1. **Enable Strict Mode**: Always use `"strict": true`
2. **Avoid any**: Use `unknown` for truly unknown types
3. **Use Interfaces for Objects**: Prefer interfaces over type aliases for objects
4. **Leverage Generics**: Write reusable, type-safe code
5. **Use Utility Types**: Leverage built-in utility types
6. **Document Complex Types**: Add JSDoc comments for complex types
7. **Enable noImplicitAny**: Catch implicit any types

## Conclusion

TypeScript provides a powerful type system that helps build maintainable, scalable JavaScript applications. Start with basic types and gradually explore more advanced features as your projects grow.
