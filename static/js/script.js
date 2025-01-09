// Эффекты при наведении на элементы формы
const formElements = document.querySelectorAll('input, select, button');

formElements.forEach(element => {
    element.addEventListener('mouseover', () => {
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'transform 0.3s ease-in-out';
    });

    element.addEventListener('mouseout', () => {
        element.style.transform = 'scale(1)';
    });
});

// Анимация при отправке формы
function submitForm() {
    const homeAge = parseFloat(document.getElementById("homeAge").value);
    const awayAge = parseFloat(document.getElementById("awayAge").value);
    const homePosition = parseFloat(document.getElementById("homePosition").value);
    const awayPosition = parseFloat(document.getElementById("awayPosition").value);
    const matchDate = new Date(document.getElementById("matchDate").value);

    const formData = {
        "Home Team": document.getElementById("homeTeam").value,
        "Away Team": document.getElementById("awayTeam").value,
        "League": document.getElementById("league").value,
        "Away Position": awayPosition,
        "Home Position": homePosition,
        "Home Average Age": homeAge,
        "Away Average Age": awayAge,
        "Day of Week": matchDate.getDay(),  // Sunday = 0, Monday = 1, ...
        "Month": matchDate.getMonth() + 1, // Months are 0-based, so add 1
        "Year": matchDate.getFullYear(),
        "Age Difference": homeAge - awayAge,
        "Position Difference": homePosition - awayPosition,
    };

    // Показать анимацию загрузки
    const resultElement = document.getElementById("result");
    resultElement.textContent = "Loading... Please wait...";
    resultElement.style.color = "#007BFF";
    resultElement.style.fontSize = "1.3em";
    resultElement.style.transition = "font-size 0.3s ease";

    // Выполнение запроса на сервер
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        // Плавное обновление текста с результатом
        resultElement.textContent = "Prediction: " + data.prediction;
        resultElement.style.color = data.prediction === "Home Team Wins" ? "#28a745" : "#dc3545";
        resultElement.style.fontSize = "1.5em";
        resultElement.style.transition = "font-size 0.5s ease, color 0.5s ease";
    })
    .catch(error => {
        console.error('Error:', error);
        resultElement.textContent = "Something went wrong! Please try again.";
        resultElement.style.color = "#dc3545";
    });
}

// Плавное движение фона при прокрутке
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        document.body.style.backgroundPosition = '0 ${scrollTop * 0.3}px';
    } else {
        document.body.style.backgroundPosition = '0 ${scrollTop * 0.3}px';
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Для предотвращения отрицательных значений
});

// Эффект для кнопок при нажатии
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.98)';
        button.style.transition = 'transform 0.1s ease-out';
    });

    button.addEventListener('mouseup', () => {
        button.style.transform = 'scale(1)';
    });
});
// Плавная анимация появления результата
function submitForm() {
    const formData = {
        "Home Team": document.getElementById("homeTeam").value,
        "Away Team": document.getElementById("awayTeam").value,
        "League": document.getElementById("league").value,
        "Away Position": parseInt(document.getElementById("awayPosition").value),
        "Home Position": parseInt(document.getElementById("homePosition").value),
        "Home Average Age": parseFloat(document.getElementById("homeAge").value),
        "Away Average Age": parseFloat(document.getElementById("awayAge").value),
        "Match Date": document.getElementById("matchDate").value
    };

    const result = document.getElementById("result");
    result.textContent = "Calculating...";
    result.style.opacity = "0";

    fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            result.textContent = "Prediction: " + data.prediction;
            result.style.transition = "opacity 1s ease-in-out";
            result.style.opacity = "1";
        });
}
function submitForm() {
    const homeAge = parseFloat(document.getElementById("homeAge").value);
    const awayAge = parseFloat(document.getElementById("awayAge").value);
    const homePosition = parseFloat(document.getElementById("homePosition").value);
    const awayPosition = parseFloat(document.getElementById("awayPosition").value);
    const matchDate = new Date(document.getElementById("matchDate").value);

    const formData = {
        "Home Team": document.getElementById("homeTeam").value,
        "Away Team": document.getElementById("awayTeam").value,
        "League": document.getElementById("league").value,
        "Away Position": awayPosition,
        "Home Position": homePosition,
        "Home Average Age": homeAge,
        "Away Average Age": awayAge,
        "Day of Week": matchDate.getDay(),
        "Month": matchDate.getMonth() + 1,
        "Year": matchDate.getFullYear(),
        "Age Difference": homeAge - awayAge,
        "Position Difference": homePosition - awayPosition,
    };

    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        const resultElement = document.getElementById("result");
        resultElement.textContent = "Prediction: " + data.prediction;

        // Убедитесь, что текст видим
        resultElement.style.display = "block";
        resultElement.style.visibility = "visible";
        resultElement.style.color = "black"; // Убедитесь, что текст контрастный
        
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("result").textContent = "Произошла ошибка при получении предсказания.";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const themeButton = document.getElementById("themeButton");
    const body = document.body;
    const texts = document.querySelectorAll(".text");
    
    // Функция переключения темы
    themeButton.addEventListener("click", () => {
        const isDark = body.classList.toggle("light-theme");

        // Изменяем цвет текста анимации
        texts.forEach(text => {
            if (isDark) {
                text.style.color = "black"; // Светлый текст для темной темы
            } else {
                text.style.color = "white"; // Темный текст для светлой темы
            }
        });
        
        // Сохраняем тему в localStorage
        localStorage.setItem("theme", isDark ? "light" : "dark");
    });

    // Проверяем сохраненную тему при загрузке
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        body.classList.add("light-theme");
        texts.forEach(text => text.style.color = "black");
    } else {
        texts.forEach(text => text.style.color = "white");
    }
});

