# use_model.py
import torch
import torch.nn as nn
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

def load_model():
    """Загружает обученную модель"""
    model_info = joblib.load('ai_files/model_info.pkl')
    input_dim = model_info['input_dim']

    model = MinValueNetwork(input_dim)
    model.load_state_dict(torch.load('ai_files/min_finder_model.pth'))
    model.eval()

    return model, input_dim

def find_min_index(model, number_list):

    input_tensor = torch.tensor([number_list], dtype=torch.float32)

    with torch.no_grad():
        probabilities = model(input_tensor)
        predicted_index = torch.argmax(probabilities).item()

    return predicted_index


try:
    model, input_dim = load_model()
except FileNotFoundError:
    print("Ошибка: Сначала обучите модель, запустив train_model.py")
    exit()


def f(l):
    predicted_idx = find_min_index(model, l)
    return predicted_idx

# Основная логика - только вывод предсказаний
if __name__ == "__main__":
    # Тестовые примеры
    test_lists = [
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 5]
    ]

    print("hello", input_dim)

    for test_list in test_lists:
        if len(test_list) == input_dim or True:
            predicted_idx = find_min_index(model, test_list)
            print(predicted_idx)
