---
title: "Introduction to RAG Systems with LangChain"
date: 2026-02-07 12:00:00
tags: [RAG, LangChain, LLM, AI]
categories: AI/ML
description: "Build powerful Retrieval-Augmented Generation systems using LangChain for enhanced AI applications."
keywords: "RAG, LangChain, vector database, embeddings, retrieval"
---

# Introduction to RAG Systems with LangChain

Retrieval-Augmented Generation (RAG) combines the power of retrieval systems with large language models to create more accurate and context-aware AI applications. This guide will walk you through building RAG systems using LangChain.

## What is RAG?

RAG addresses several key challenges with LLMs:

- **Knowledge Cutoff**: LLMs have a knowledge cutoff date and can't access recent information
- **Hallucination**: LLMs can generate plausible but incorrect information
- **Domain Knowledge**: General LLMs lack specialized domain knowledge

RAG solves these by:
1. Retrieving relevant documents from a knowledge base
2. Augmenting the LLM prompt with retrieved context
3. Generating responses grounded in retrieved information

## Setting Up LangChain

```bash
pip install langchain langchain-openai langchain-community pymilvus sentence-transformers
```

## Building a Basic RAG Pipeline

### 1. Document Loading

```python
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_community.document_loaders import DirectoryLoader

# Load individual documents
loader = PyPDFLoader("manual.pdf")
documents = loader.load()

# Load all documents from a directory
loader = DirectoryLoader(
    path="./docs",
    glob="**/*.pdf",
    loader_cls=PyPDFLoader
)
documents = loader.load()
```

### 2. Text Splitting

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Split documents into chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\n\n", "\n", " ", ""]
)

chunks = text_splitter.split_documents(documents)
```

### 3. Creating Embeddings

```python
from langchain_openai import OpenAIEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings

# Using OpenAI embeddings
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Using HuggingFace embeddings (free alternative)
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
```

### 4. Vector Store Setup

```python
from langchain_community.vectorstores import Chroma, Milvus, FAISS

# Using Chroma (localvectorstore = Chroma, file-based)
.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# Using FAISS (local, in-memory)
vectorstore = FAISS.from_documents(
    documents=chunks,
    embedding=embeddings
)

# Using Milvus (production, distributed)
from langchain_community.vectorstores import Milvus
vectorstore = Milvus.from_documents(
    documents=chunks,
    embedding=embeddings,
    connection_args={"host": "localhost", "port": "19530"},
    index_params={"index_type": "IVF_FLAT", "metric_type": "COSINE"}
)
```

### 5. Creating the Retriever

```python
# Basic similarity search retriever
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 4}
)

# MMR (Maximum Marginal Relevance) retriever
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 4,
        "fetch_k": 10,
        "lambda_mult": 0.5
    }
)
```

### 6. Building the RAG Chain

```python
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# Define the prompt template
prompt_template = """Use the following context to answer the question. 
If you don't know the answer, say you don't know.

Context:
{context}

Question: {question}

Answer:"""

PROMPT = PromptTemplate(
    template=prompt_template,
    input_variables=["context", "question"]
)

# Create the LLM
llm = ChatOpenAI(
    model="gpt-4",
    temperature=0,
    max_tokens=1000
)

# Build the RAG chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    chain_type_kwargs={"prompt": PROMPT}
)

# Use the chain
result = qa_chain.invoke({"query": "What is the main topic of the documents?"})
print(result["result"])
```

## Advanced RAG Patterns

### Multi-Query Retrieval

```python
from langchain.retrievers.multi_query import MultiQueryRetriever

multi_query_retriever = MultiQueryRetriever.from_llm(
    retriever=vectorstore.as_retriever(),
    llm=llm
)

# Generate multiple queries and retrieve all results
retrieved_docs = multi_query_retriever.invoke("How to optimize queries?")
```

### Ensemble Retrieval

```python
from langchain.retrievers import EnsembleRetriever

# Combine multiple retrievers
faiss_retriever = faiss_vectorstore.as_retriever(k=4)
chroma_retriever = chroma_vectorstore.as_retriever(k=4)

ensemble_retriever = EnsembleRetriever(
    retrievers=[faiss_retriever, chroma_retriever],
    weights=[0.5, 0.5]
)
```

### Contextual Compression

```python
from langchain.retrievers import ContextualCompressionRetriever
from langchain_openai import OpenAI
from langchain_community.document_compressors import LLMChainExtractor

llm_compressor = OpenAI(temperature=0)

compressor = LLMChainExtractor.from_llm(llm_compressor)

compression_retriever = ContextualCompressionRetriever(
    base_retriever=vectorstore.as_retriever(),
    document_compressor=compressor
)

compressed_docs = compression_retriever.invoke("your query")
```

### Parent Document Retrieval

```python
from langchain.retrievers import ParentDocumentRetriever
from langchain.storage import InMemoryStore

store = InMemoryStore()
child_splitter = RecursiveCharacterTextSplitter(chunk_size=400)
parent_splitter = RecursiveCharacterTextSplitter(chunk_size=2000)

parent_retriever = ParentDocumentRetriever(
    vectorstore=vectorstore,
    docstore=store,
    child_splitter=child_splitter,
    parent_splitter=parent_splitter,
)
```

## Building a Complete RAG Application

```python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader
import os

class RAGSystem:
    def __init__(self, data_dir="./data", persist_dir="./chroma_db"):
        self.data_dir = data_dir
        self.persist_dir = persist_dir
        self.embeddings = OpenAIEmbeddings()
        self.llm = ChatOpenAI(model="gpt-4", temperature=0)
        
    def load_documents(self):
        """Load all documents from the data directory."""
        loader = DirectoryLoader(
            self.data_dir,
            glob="**/*.txt",
            loader_cls=TextLoader
        )
        return loader.load()
    
    def create_vectorstore(self, documents=None):
        """Create or load the vector store."""
        if os.path.exists(os.path.join(self.persist_dir, "chroma-collections.parquet")):
            # Load existing vector store
            self.vectorstore = Chroma(
                persist_directory=self.persist_dir,
                embedding_function=self.embeddings
            )
        else:
            # Create new vector store
            if documents is None:
                documents = self.load_documents()
            
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
            chunks = text_splitter.split_documents(documents)
            
            self.vectorstore = Chroma.from_documents(
                documents=chunks,
                embedding=self.embeddings,
                persist_directory=self.persist_dir
            )
        
        return self.vectorstore
    
    def setup_chain(self):
        """Set up the RAG chain."""
        prompt_template = """Use the following context to answer the question.
        If the answer is not in the context, say "I don't have enough information to answer that question."

        Context:
        {context}

        Question: {question}

        Answer:"""
        
        PROMPT = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )
        
        self.chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vectorstore.as_retriever(),
            chain_type_kwargs={"prompt": PROMPT}
        )
    
    def query(self, question: str) -> str:
        """Query the RAG system."""
        result = self.chain.invoke({"query": question})
        return result["result"]
    
    def query_with_sources(self, question: str) -> dict:
        """Query and return answer with source documents."""
        result = self.chain.invoke({"query": question})
        
        return {
            "answer": result["result"],
            "sources": [doc.metadata for doc in result["source_documents"]]
        }

# Usage
if __name__ == "__main__":
    rag = RAGSystem(data_dir="./knowledge_base")
    rag.create_vectorstore()
    rag.setup_chain()
    
    response = rag.query_with_sources("What are the main features of our product?")
    print(f"Answer: {response['answer']}")
    print(f"Sources: {response['sources']}")
```

## Production Considerations

1. **Indexing Pipeline**: Automate document ingestion with monitoring
2. **Caching**: Cache frequent queries and embeddings
3. **Monitoring**: Track retrieval quality and response relevance
4. **Updates**: Implement periodic knowledge base updates
5. **Security**: Add access controls and audit logging

## Conclusion

RAG systems with LangChain provide a powerful way to build AI applications that can access and reason over large knowledge bases. Start with a basic setup, then iteratively improve retrieval quality and add advanced features as needed.
