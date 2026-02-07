---
title: "Building AI Agents with LangChain"
date: 2026-02-07
categories: [tutorial]
tags: [ai, langchain, agents, llm]
description: "Learn how to build intelligent AI agents using LangChain framework"
---

# Building AI Agents with LangChain

AI agents can take actions based on LLM reasoning. Learn how to build autonomous agents using LangChain.

## What are AI Agents?

AI agents are systems that:
- **Reason** about goals and plans
- **Take actions** using tools
- **Observe results** and adjust approach
- **Persist state** across interactions

### Agent vs. Simple LLM

```
Simple LLM: Input → Output (one-shot)

Agent: Input → Think → Plan → Execute Tool → Observe → Refine → Output
```

## Setting Up LangChain Agents

### Installation

```bash
pip install langchain langchain-openai langchain-community
```

### Basic Agent Implementation

```python
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import ChatOpenAI
from langchain.tools import Tool
from langchain import hub

# Define tools
def calculate(expression: str) -> str:
    """Evaluate a mathematical expression."""
    try:
        return str(eval(expression))
    except:
        return "Error evaluating expression"

def get_weather(city: str) -> str:
    """Get weather for a city."""
    # In real app, call weather API
    return f"Weather in {city}: Sunny, 25°C"

tools = [
    Tool(
        name="calculator",
        func=calculate,
        description="Useful for mathematical calculations"
    ),
    Tool(
        name="weather",
        func=get_weather,
        description="Get current weather for a city"
    )
]

# Create agent
llm = ChatOpenAI(model="gpt-4")
prompt = hub.pull("hwchase17/openai-functions-agent")

agent = create_openai_functions_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# Run agent
result = agent_executor.invoke({
    "input": "What's the weather in Tokyo and calculate 25 * 4 + 10?"
})
print(result["output"])
```

## Building a Research Agent

```python
from langchain_community.tools import DuckDuckGoSearchRun

# Search tool for research
search = DuckDuckGoSearchRun()

research_tools = [
    Tool(
        name="search",
        func=search.run,
        description="Search the web for information"
    )
]

# Create research agent
research_agent = create_openai_functions_agent(llm, research_tools, prompt)
research_executor = AgentExecutor(agent=research_agent, tools=research_tools)

# Research task
result = research_executor.invoke({
    "input": "Research the latest developments in quantum computing 2024"
})
```

## Memory for Agents

Add memory to enable contextual conversations:

```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(memory_key="chat_history")

agent_with_memory = create_openai_functions_agent(llm, tools, prompt)
agent_executor = AgentExecutor(
    agent=agent_with_memory,
    tools=tools,
    memory=memory,
    verbose=True
)

# Multi-turn conversation
agent_executor.invoke({"input": "Calculate 10 * 5"})
agent_executor.invoke({"input": "What was the result of my last calculation?"})
```

## Tool Categories

| Tool Type | Examples | Use Case |
|-----------|----------|----------|
| **Search** | DuckDuckGo, Google | Web research |
| **Calculator** | Python eval, Wolfram | Math operations |
| **API** | REST calls | External services |
| **Database** | SQL, Vector stores | Data retrieval |
| **File** | Read/Write files | Local operations |

## Best Practices

1. **Clear tool descriptions** - Help agent understand when to use each tool
2. **Error handling** - Tools should return meaningful errors
3. **Limit tool access** - Security: only give necessary tools
4. **Use appropriate models** - GPT-4 for complex reasoning, GPT-3.5 for simpler tasks
5. **Add memory** - Enable context for multi-turn interactions

## Advanced: Custom Tools

```python
from langchain.tools import tool
from typing import List

class DatabaseTools:
    @tool("search_products")
    def search_products(query: str) -> List[dict]:
        """Search product database by name or category."""
        # Implementation here
        return [{"id": 1, "name": "Product 1", "price": 29.99}]
    
    @tool("get_order_status")
    def get_order_status(order_id: str) -> dict:
        """Get status of an order by order ID."""
        # Implementation here
        return {"order_id": order_id, "status": "shipped"}

db_tools = DatabaseTools()
tools = [db_tools.search_products, db_tools.get_order_status]
```

## Conclusion

Building agents with LangChain opens possibilities for autonomous AI systems. Start with simple agents and add complexity as needed.

---
*Happy building! 🤖*
