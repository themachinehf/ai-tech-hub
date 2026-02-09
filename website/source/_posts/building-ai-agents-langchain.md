---
title: "Building AI Agents with LangChain Agents"
date: 2026-02-07 12:00:00
tags: [AI Agents, LangChain, LLM, Automation]
categories: AI/ML
description: "Learn how to build autonomous AI agents using LangChain that can reason, plan, and execute complex tasks."
keywords: "AI agents, LangChain, autonomous agents, task execution, tool use"
---

# Building AI Agents with LangChain Agents

AI agents represent the next evolution in LLM applications. Unlike simple chatbots, agents can reason about tasks, plan actions, and execute complex workflows using various tools.

## Understanding AI Agents

An AI agent is a system that can:

1. **Perceive** its environment through inputs and tools
2. **Reason** about goals and plan actions
3. **Act** by calling tools and executing tasks
4. **Learn** from feedback and improve over time

LangChain provides a comprehensive framework for building such agents.

## Setting Up Your Environment

```bash
pip install langchain langchain-openai langchain-community SearXNG-API
```

## Building Your First Agent

### Basic Zero-Shot Agent

```python
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import ChatOpenAI
from langchain import hub
from langchain_community.utilities import SerpAPIWrapper

# Initialize the LLM
llm = ChatOpenAI(model="gpt-4", temperature=0)

# Get the prompt template
prompt = hub.pull("hwchase17/openai-functions-agent")

# Define tools for the agent
search = SerpAPIWrapper()

tools = [
    {
        "name": "search",
        "description": "Useful for when you need to answer questions about current events",
        "func": search.run
    }
]

# Create the agent
agent = create_openai_functions_agent(llm, tools, prompt)

# Create the agent executor
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# Use the agent
result = agent_executor.invoke({
    "input": "What is the current stock price of Apple?"
})
```

## Creating Custom Tools

### Building a Custom Tool

```python
from langchain.tools import tool
from datetime import datetime

class DateTimeTools:
    @tool
    def get_current_date(self) -> str:
        """Returns the current date in YYYY-MM-DD format."""
        return datetime.now().strftime("%Y-%m-%d")
    
    @tool
    def get_current_time(self, timezone: str = "UTC") -> str:
        """Returns the current time for a given timezone."""
        from datetime import timezone as tz
        if timezone != "UTC":
            import pytz
            try:
                tz_obj = pytz.timezone(timezone)
                dt = datetime.now(tz_obj)
            except pytz.UnknownTimeZoneError:
                return f"Unknown timezone: {timezone}"
        else:
            dt = datetime.now(tz.utc)
        return dt.strftime("%H:%M:%S %Z")
    
    @tool
    def calculate_days_between(self, start_date: str, end_date: str) -> int:
        """Calculate the number of days between two dates (YYYY-MM-DD format)."""
        try:
            start = datetime.strptime(start_date, "%Y-%m-%d")
            end = datetime.strptime(end_date, "%Y-%m-%d")
            return abs((end - start).days)
        except ValueError:
            return -1
```

### File Operations Tool

```python
import os
from pathlib import Path
from langchain.tools import tool

class FileOperations:
    @tool
    def read_file(self, file_path: str) -> str:
        """Read the contents of a file. Returns the file contents or an error message."""
        try:
            path = Path(file_path)
            if path.exists() and path.is_file():
                return path.read_text()
            return f"File not found: {file_path}"
        except Exception as e:
            return f"Error reading file: {str(e)}"
    
    @tool
    def write_file(self, file_path: str, content: str) -> str:
        """Write content to a file. Creates the file if it doesn't exist."""
        try:
            path = Path(file_path)
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content)
            return f"Successfully wrote to {file_path}"
        except Exception as e:
            return f"Error writing file: {str(e)}"
    
    @tool
    def list_files(self, directory: str = ".") -> str:
        """List files in a directory."""
        try:
            path = Path(directory)
            if path.exists() and path.is_dir():
                files = [f.name for f in path.iterdir()]
                return "\n".join(files) if files else "Directory is empty"
            return f"Directory not found: {directory}"
        except Exception as e:
            return f"Error listing directory: {str(e)}"
```

## Building a Research Agent

```python
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import ChatOpenAI
from langchain import hub
from langchain_community.utilities import SerpAPIWrapper
from langchain_community.tools import DuckDuckGoSearchRun

class ResearchAgent:
    def __init__(self, api_key: str):
        os.environ["OPENAI_API_KEY"] = api_key
        self.llm = ChatOpenAI(model="gpt-4", temperature=0)
        self.setup_agent()
    
    def setup_agent(self):
        # Define tools
        self.search = DuckDuckGoSearchRun()
        self.file_ops = FileOperations()
        
        tools = [
            {
                "name": "duckduckgo-search",
                "description": "Search for information on the web",
                "func": self.search.run
            },
            {
                "name": "read_file",
                "description": "Read a file from disk",
                "func": self.file_ops.read_file
            },
            {
                "name": "write_file",
                "description": "Write content to a file",
                "func": self.file_ops.write_file
            },
            {
                "name": "list_files",
                "description": "List files in a directory",
                "func": self.file_ops.list_files
            }
        ]
        
        # Get prompt and create agent
        prompt = hub.pull("hwchase17/openai-functions-agent")
        self.agent = create_openai_functions_agent(self.llm, tools, prompt)
        self.executor = AgentExecutor(agent=self.agent, tools=tools, verbose=True)
    
    def research_topic(self, topic: str, output_file: str = None) -> dict:
        """Conduct research on a topic and optionally save results."""
        
        task = f"""
        Research the following topic thoroughly: {topic}
        
        Follow these steps:
        1. Search for recent information about this topic
        2. Find at least 3 credible sources
        3. Summarize the key findings
        4. Identify any controversies or differing viewpoints
        5. Provide a comprehensive summary
        """
        
        result = self.executor.invoke({"input": task})
        
        if output_file:
            self.file_ops.write_file(output_file, result["output"])
        
        return result
```

## Building a Task Management Agent

```python
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import ChatOpenAI
from langchain import hub
from langchain.tools import tool
from datetime import datetime
import json

class TaskManager:
    def __init__(self, api_key: str):
        os.environ["OPENAI_API_KEY"] = api_key
        self.llm = ChatOpenAI(model="gpt-4", temperature=0)
        self.tasks_file = "tasks.json"
        self.load_tasks()
        self.setup_agent()
    
    def load_tasks(self):
        """Load tasks from file."""
        try:
            with open(self.tasks_file, 'r') as f:
                self.tasks = json.load(f)
        except FileNotFoundError:
            self.tasks = []
    
    def save_tasks(self):
        """Save tasks to file."""
        with open(self.tasks_file, 'w') as f:
            json.dump(self.tasks, f, indent=2)
    
    @tool
    def add_task(self, title: str, description: str = "", priority: str = "medium", due_date: str = None) -> str:
        """Add a new task to the task list."""
        task = {
            "id": len(self.tasks) + 1,
            "title": title,
            "description": description,
            "priority": priority,
            "due_date": due_date,
            "completed": False,
            "created_at": datetime.now().isoformat()
        }
        self.tasks.append(task)
        self.save_tasks()
        return f"Task added: {title} (ID: {task['id']})"
    
    @tool
    def complete_task(self, task_id: int) -> str:
        """Mark a task as completed."""
        for task in self.tasks:
            if task["id"] == task_id:
                task["completed"] = True
                task["completed_at"] = datetime.now().isoformat()
                self.save_tasks()
                return f"Task completed: {task['title']}"
        return f"Task not found: {task_id}"
    
    @tool
    def list_tasks(self, show_completed: bool = False) -> str:
        """List all tasks."""
        tasks_to_show = [t for t in self.tasks if show_completed or not t["completed"]]
        if not tasks_to_show:
            return "No tasks found."
        
        lines = ["Tasks:"]
        for task in tasks_to_show:
            status = "✓" if task["completed"] else "○"
            due = f" (Due: {task['due_date']})" if task['due_date'] else ""
            lines.append(f"{status} [{task['priority']}] {task['title']}{due}")
        
        return "\n".join(lines)
    
    def setup_agent(self):
        tools = [
            {
                "name": "add_task",
                "description": "Add a new task with title, description, priority, and due date",
                "func": self.add_task
            },
            {
                "name": "complete_task",
                "description": "Mark a task as completed by its ID",
                "func": self.complete_task
            },
            {
                "name": "list_tasks",
                "description": "List all tasks, optionally showing completed ones",
                "func": self.list_tasks
            }
        ]
        
        prompt = hub.pull("hwchase17/openai-functions-agent")
        self.agent = create_openai_functions_agent(self.llm, tools, prompt)
        self.executor = AgentExecutor(agent=self.agent, tools=tools, verbose=True)
    
    def run(self, instruction: str) -> str:
        """Execute a natural language instruction."""
        result = self.executor.invoke({"input": instruction})
        return result["output"]
```

## Advanced Agent Patterns

### Using Conversational Memory

```python
from langchain.memory import ConversationBufferMemory
from langchain.agents import AgentExecutor

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    memory=memory,
    verbose=True
)
```

### Handling Errors Gracefully

```python
from langchain.agents import AgentExecutor

class SafeAgentExecutor:
    def __init__(self, agent, tools, max_retries=3):
        self.agent = agent
        self.tools = tools
        self.max_retries = max_retries
    
    def invoke(self, input_dict, max_iterations=10):
        config = {
            "max_iterations": max_iterations,
            "early_stopping_method": "generate"
        }
        
        try:
            executor = AgentExecutor(
                agent=self.agent,
                tools=self.tools,
                **config
            )
            return executor.invoke(input_dict)
        except Exception as e:
            return {"output": f"Error: {str(e)}", "error": True}
```

## Best Practices for Agent Development

1. **Clear Tool Descriptions**: Write detailed descriptions for each tool
2. **Error Handling**: Implement robust error handling in custom tools
3. **Token Management**: Monitor token usage and implement limits
4. **Safety Controls**: Add safeguards against harmful actions
5. **Memory Management**: Use appropriate memory types for your use case
6. **Testing**: Thoroughly test agent behavior with various inputs
7. **Monitoring**: Log agent actions and outputs for debugging

## Conclusion

Building AI agents with LangChain opens up powerful possibilities for automation and complex task execution. Start with simple agents and gradually add complexity as you understand the patterns and behaviors that emerge.
