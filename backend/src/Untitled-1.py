# train_model.py
import torch
import torch.nn as nn
import torch.optim as optim
import joblib

class MinValueNetwork(nn.Module):
    def __init__(self, input_dim):
        super(MinValueNetwork, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, 16),
            nn.ReLU(),
            nn.Linear(16, 8),
            nn.ReLU(),
            nn.Linear(8, input_dim),
            nn.Softmax(dim=1)
        )
    
    def forward(self, x):
        return self.network(x)

def train_and_save_model():
    # Параметры
    input_dim = 5
    model = MinValueNetwork(input_dim)
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    print("Начало обучения нейросети...")
    
    for epoch in range(10000000):
        # Генерируем случайные списки
        data = torch.rand(64, input_dim) * 100
        
        # Целевые значения - индексы минимальных элементов
        targets = torch.argmin(data, dim=1)
        
        # Обучение
        optimizer.zero_grad()
        outputs = model(data)
        loss = nn.CrossEntropyLoss()(outputs, targets)
        loss.backward()
        optimizer.step()
        
        if epoch % 400 == 0:
            print(f'Epoch {epoch}, Loss: {loss.item():.4f}')
    
    # Сохраняем модель
    torch.save(model.state_dict(), 'min_finder_model.pth')
    print("Модель сохранена в файл 'min_finder_model.pth'")
    
    # Сохраняем информацию о размере входа
    model_info = {'input_dim': input_dim}
    joblib.dump(model_info, 'model_info.pkl')
    print("Информация о модели сохранена в 'model_info.pkl'")

if __name__ == "__main__":
    train_and_save_model()