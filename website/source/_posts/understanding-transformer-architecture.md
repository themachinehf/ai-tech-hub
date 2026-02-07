---
title: "Understanding Transformer Architecture"
date: 2026-02-07
categories: [tutorial]
tags: [ai, machine-learning, transformer, nlp]
description: "Deep dive into the Transformer architecture that powers modern AI"
---

# Understanding Transformer Architecture

The Transformer architecture revolutionized NLP and beyond. Learn how it works and why it changed everything.

## The Attention Mechanism

At the heart of Transformers is the attention mechanism, allowing models to weigh the importance of different words.

### Self-Attention Formula

```
Attention(Q, K, V) = softmax(QK^T / √d_k) × V
```

Where:
- Q (Query) - What we're looking for
- K (Key) - What we're comparing against
- V (Value) - The actual information
- d_k - Dimension of keys (for scaling)

## Architecture Overview

```
Input Embeddings → Positional Encoding → Encoder Stack → Decoder Stack → Output
                   ↓                    ↓              ↓
              Multi-Head            Multi-Head        Masked Multi-Head
               Attention             Attention           Attention
                   ↓                    ↓                    ↓
              Add & Norm           Add & Norm          Add & Norm
                   ↓                    ↓                    ↓
              Feed Forward         Feed Forward        Feed Forward
                   ↓                    ↓                    ↓
              Add & Norm           Add & Norm          Add & Norm
```

## Implementation in PyTorch

```python
import torch
import torch.nn as nn
import math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
    
    def forward(self, query, key, value, mask=None):
        batch_size = query.size(0)
        
        # Linear projections
        Q = self.W_q(query).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        K = self.W_k(key).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        V = self.W_v(value).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        
        # Scaled dot-product attention
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        
        attention = torch.softmax(scores, dim=-1)
        output = torch.matmul(attention, V)
        
        # Concatenate heads
        output = output.transpose(1, 2).contiguous().view(batch_size, -1, self.d_model)
        return self.W_o(output)
```

## Key Components

1. **Positional Encoding** - Adds position information since Transformers have no recurrence
2. **Multi-Head Attention** - Multiple attention heads for different relationships
3. **Feed-Forward Networks** - Two linear transformations with ReLU
4. **Layer Normalization** - Stabilizes training
5. **Residual Connections** - Helps with gradient flow

## Variants and Applications

- **BERT** - Encoder-only, great for understanding tasks
- **GPT** - Decoder-only, excellent for generation
- **T5** - Encoder-decoder, handles various tasks
- **Vision Transformer (ViT)** - Applying Transformers to images

## Conclusion

Understanding Transformers is essential for modern AI development. They form the foundation of most state-of-the-art models.

---
*Happy learning! 🧠*
