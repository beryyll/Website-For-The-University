from flask import Flask, request, jsonify, render_template
import pandas as pd
import joblib
from datetime import datetime

app = Flask(__name__)

# Загружаем модель, scaler и список колонок
model = joblib.load('random_forest_model.joblib')
scaler = joblib.load('scaler.joblib')
columns = joblib.load('columns.joblib')

@app.route('/')
def home():
    return render_template('index.html')
 

@app.route('/predict', methods=['POST'])
def predict():
    # Получение данных от клиента
    input_data = request.get_json()

    # Преобразование в DataFrame
    input_data = pd.DataFrame([input_data])

    # Обработка даты (Match Date)
    if 'Match Date' in input_data:
        match_date = pd.to_datetime(input_data['Match Date'][0])
        input_data['Day of Week'] = match_date.dayofweek  # Понедельник = 0, Воскресенье = 6
        input_data['Month'] = match_date.month
        input_data['Year'] = match_date.year
        input_data = input_data.drop(columns=['Match Date'])  # Удаляем поле даты после обработки

    # Вычисление Age Difference и Position Difference
    input_data['Age Difference'] = input_data['Home Average Age'] - input_data['Away Average Age']
    input_data['Position Difference'] = input_data['Home Position'] - input_data['Away Position']

    # Убедимся, что все ожидаемые колонки присутствуют
    for col in columns:
        if col not in input_data:
            input_data[col] = 0  # Добавляем пропущенные колонки с нулями

    # Удаляем лишние колонки
    input_data = input_data[columns]

    # Удаляем целевую переменную, если она есть
    if 'Outcome' in input_data:
        input_data = input_data.drop(columns=['Outcome'])

    # Определение числовых признаков
    numeric_features = scaler.feature_names_in_

    # Преобразование числовых данных
    input_data[numeric_features] = scaler.transform(input_data[numeric_features])

    # Предсказание
    prediction = model.predict(input_data)

    # Возврат результата
    result = "Побеждает команда хозяев поля" if prediction[0] == 1 else "Ничья или победа команды на выезде"
    return jsonify({'prediction': result})

if __name__ == "__main__":
    app.run(debug=True)
