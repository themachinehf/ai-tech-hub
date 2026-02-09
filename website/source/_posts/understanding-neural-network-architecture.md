---
title: "Understanding Neural Network Architecture"
date: 2026-02-07 14:00:00
tags: [Neural Networks, Deep Learning, AI, Architecture]
categories: AI/ML
description: "Deep dive into neural network architectures - from basic perceptrons to transformers and beyond."
keywords: "neural networks, deep learning, architecture, transformers, CNN, RNN"
---

# Understanding Neural Network Architecture

Neural networks form the foundation of modern AI. This guide explores various architectures and their applications.

## From Perceptrons to Deep Learning

### The Perceptron

The perceptron is the simplest neural network unit:

```python
import numpy as np

class Perceptron:
    def __init__(self, learning_rate=0.01, epochs=100):
        self.lr = learning_rate
        self.epochs = epochs
    
    def fit(self, X, y):
        self.weights = np.zeros(X.shape[1])
        self.bias = 0
        
        for _ in range(self.epochs):
            for xi, yi in zip(X, y):
                prediction = self.predict(xi)
                update = self.lr * (yi - prediction)
                self.weights += update * xi
                self.bias += update
    
    def predict(self, X):
        return np.where(np.dot(X, self.weights) + self.bias > 0, 1, -1)
```

### Multi-Layer Perceptrons (MLP)

MLPs add hidden layers between input and output:

```python
class MLP:
    def __init__(self, layer_sizes, activation='relu'):
        self.weights = []
        self.biases = []
        self.activation = activation
        
        for i in range(len(layer_sizes) - 1):
            w = np.random.randn(layer_sizes[i], layer_sizes[i+1]) * 0.01
            b = np.zeros((1, layer_sizes[i+1]))
            self.weights.append(w)
            self.biases.append(b)
    
    def relu(self, x):
        return np.maximum(0, x)
    
    def relu_derivative(self, x):
        return (x > 0).astype(float)
    
    def forward(self, X):
        self.activations = [X]
        for i in range(len(self.weights)):
            z = np.dot(self.activations[-1], self.weights[i]) + self.biases[i]
            if i < len(self.weights) - 1:
                a = self.relu(z)
            else:
                a = z  # No activation on output
            self.activations.append(a)
        return a
```

## Convolutional Neural Networks (CNNs)

CNNs excel at image processing through convolution operations:

```python
import torch
import torch.nn as nn

class CNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        
        # Convolutional layers
        self.conv1 = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2, 2)
        )
        
        self.conv2 = nn.Sequential(
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2, 2)
        )
        
        self.conv3 = nn.Sequential(
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(2, 2)
        )
        
        # Fully connected layers
        self.fc = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(128 * 4 * 4, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, num_classes)
        )
    
    def forward(self, x):
        x = self.conv1(x)
        x = self.conv2(x)
        x = self.conv3(x)
        x = x.view(x.size(0), -1)
        x = self.fc(x)
        return x
```

## Recurrent Neural Networks (RNNs)

RNNs process sequential data with hidden state:

```python
import tensorflow as tf
from tensorflow.keras import layers

class LSTMModel(tf.keras.Model):
    def __init__(self, vocab_size, embedding_dim, rnn_units, num_classes):
        super().__init__()
        
        self.embedding = layers.Embedding(vocab_size, embedding_dim)
        
        self.lstm1 = layers.Bidirectional(
            layers.LSTM(rnn_units, return_sequences=True)
        )
        self.lstm2 = layers.Bidirectional(
            layers.LSTM(rnn_units)
        )
        
        self.dropout = layers.Dropout(0.3)
        self.dense = layers.Dense(rnn_units, activation='relu')
        self.classifier = layers.Dense(num_classes, activation='softmax')
    
    def call(self, inputs, training=False):
        x = self.embedding(inputs)
        x = self.lstm1(x)
        x = self.lstm2(x)
        x = self.dropout(x, training=training)
        x = self.dense(x)
        return self.classifier(x)
```

## Transformer Architecture

Transformers use self-attention for sequence modeling:

```python
import math
import torch
import torch.nn as nn

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
    
    def scaled_dot_product_attention(self, Q, K, V, mask=None):
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        attention = torch.softmax(scores, dim=-1)
        return torch.matmul(attention, V)
    
    def forward(self, query, key, value, mask=None):
        batch_size = query.size(0)
        
        Q = self.W_q(query).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        K = self.W_k(key).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        V = self.W_v(value).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        
        attention = self.scaled_dot_product_attention(Q, K, V, mask)
        attention = attention.transpose(1, 2).contiguous().view(batch_size, -1, self.d_model)
        
        return self.W_o(attention)

class TransformerBlock(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super().__init__()
        self.attention = MultiHeadAttention(d_model, num_heads)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.feed_forward = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model),
            nn.Dropout(dropout)
        )
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x, mask=None):
        attn_output = self.attention(x, x, x, mask)
        x = self.norm1(x + self.dropout(attn_output))
        ff_output = self.feed_forward(x)
        x = self.norm2(x + ff_output)
        return x

class Transformer(nn.Module):
    def __init__(self, vocab_size, d_model, num_heads, num_layers, d_ff, num_classes, dropout=0.1):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.pos_encoding = nn.Parameter(torch.randn(1, 1000, d_model) * 0.01)
        self.layers = nn.ModuleList([
            TransformerBlock(d_model, num_heads, d_ff, dropout) for _ in range(num_layers)
        ])
        self.classifier = nn.Linear(d_model, num_classes)
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x, mask=None):
        x = self.embedding(x) + self.pos_encoding[:, :x.size(1), :]
        x = self.dropout(x)
        for layer in self.layers:
            x = layer(x, mask)
        return self.classifier(x[:, 0, :])  # Use [CLS] token
```

## Choosing the Right Architecture

| Task | Recommended Architecture |
|------|-------------------------|
| Image Classification | CNN (ResNet, EfficientNet) |
| Text Classification | Transformer (BERT, RoBERTa) |
| Time Series | LSTM, Transformer |
| Object Detection | CNN + Detection Head (YOLO) |
| Machine Translation | Transformer (Encoder-Decoder) |
| Image Generation | Diffusion, GAN |
| Audio Processing | CNN + LSTM / Transformer |

## Best Practices

1. **Start Simple**: Begin with basic architectures before trying complex ones
2. **Use Pre-trained Models**: Leverage transfer learning when possible
3. **Monitor Training**: Watch for overfitting and underfitting
4. **Hyperparameter Tuning**: Use proper search strategies
5. **Hardware Considerations**: Match architecture to available resources

## Conclusion

Understanding neural network architectures is crucial for building effective AI systems. Each architecture has strengths for specific tasks, and the field continues to evolve with new innovations.
