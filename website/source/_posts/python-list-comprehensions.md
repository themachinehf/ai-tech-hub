---
title: "Python List Comprehensions Explained"
date: 2026-02-07
categories: [tutorial]
tags: [python, programming, basics]
description: "Master Python list comprehensions for cleaner, more Pythonic code"
---

# Python List Comprehensions Explained

List comprehensions are a Pythonic way to create lists. Learn how to write concise, readable code using this powerful feature.

## Basic Syntax

### Traditional Loop

```python
numbers = [1, 2, 3, 4, 5]
squares = []

for n in numbers:
    squares.append(n ** 2)

# Result: [1, 4, 9, 16, 25]
```

### List Comprehension

```python
numbers = [1, 2, 3, 4, 5]
squares = [n ** 2 for n in numbers]

# Result: [1, 4, 9, 16, 25]
```

### Syntax Breakdown

```python
[expression for item in iterable if condition]
# [      n**2      for n in numbers    if n > 2]
#   ↑              ↑              ↑
#  output      input loop      filter
```

## Advanced Examples

### With Conditions

```python
# Filter even numbers
evens = [n for n in range(1, 21) if n % 2 == 0]
# [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

# Transform with condition
results = ["even" if n % 2 == 0 else "odd" for n in range(1, 6)]
# ['odd', 'even', 'odd', 'even', 'odd']
```

### Nested Loops

```python
# Traditional nested loops
matrix = []
for i in range(3):
    row = []
    for j in range(3):
        row.append(i * j)
    matrix.append(row)

# List comprehension
matrix = [[i * j for j in range(3)] for i in range(3)]
# [[0, 0, 0], [0, 1, 2], [0, 2, 4]]
```

### With Functions

```python
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

primes = [n for n in range(1, 51) if is_prime(n)]
# [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
```

## Dictionary and Set Comprehensions

### Dictionary Comprehension

```python
# Create square dictionary
squares_dict = {n: n**2 for n in range(1, 6)}
# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Swap keys and values
original = {'a': 1, 'b': 2, 'c': 3}
swapped = {v: k for k, v in original.items()}
# {1: 'a', 2: 'b', 3: 'c'}
```

### Set Comprehension

```python
# Unique squares
numbers = [1, 2, 2, 3, 3, 3, 4]
unique_squares = {n**2 for n in numbers}
# {1, 4, 9, 16}
```

## When to Use Comprehensions

### Good Use Cases

```python
# Filtering and transforming
[x * 2 for x in data if x > 0]

# Creating mappings
{word: len(word) for word in words}

# Extracting specific data
[user['email'] for user in users if user['active']]
```

### When NOT to Use Comprehensions

```python
# Too complex - use a regular loop
[complex_function(x) for x in data if 
 condition1(x) and condition2(x) and 
 some_other_check(x)]  # ❌ Too long!

# Better:
results = []
for x in data:
    if condition1(x) and condition2(x) and some_other_check(x):
        results.append(complex_function(x))
```

## Generator Expressions

For large datasets, use generators to save memory:

```python
# List comprehension (creates full list)
squares = [x**2 for x in range(1000000)]  # Uses lots of memory

# Generator expression (lazy evaluation)
squares_gen = (x**2 for x in range(1000000))  # Memory efficient

# Use with sum()
total = sum(x**2 for x in range(1000))
```

## Best Practices

1. **Keep it simple** - If it gets too complex, use a loop
2. **Avoid side effects** - List comprehensions should be pure
3. **Use for transformation** - Filter + transform is their strength
4. **Consider readability** - Write for humans first

## Conclusion

List comprehensions are a powerful Python feature. Use them wisely to write clean, Pythonic code.

---
*Happy coding! 🐍*
