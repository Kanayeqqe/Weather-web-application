Интеграция погодного информера в веб приложение.

РПО 2023/2. Огнев Руслан, Зуев Максик.

### Weather Web Application

Веб-приложение для получения текущей погоды и прогноза по выбранному городу.  
Проект реализован с использованием клиент-серверной архитектуры и внешнего API.

---

 Возможности

-  Поиск погоды по названию города  
-  Отображение текущей температуры  
-  Прогноз погоды  
-  История поиска городов  
-  Быстрая загрузка данных через API  

---

Архитектура проекта

Приложение разделено на две части:

🔹 Frontend (Огнев Руслан, Зуев Максим).
- HTML
- CSS
- JavaScript (Vanilla JS)
- Fetch API

 🔹 Backend (Зуев Максим)
- Node.js
- Express
- Axios

  🔹 Внешний сервис
- OpenWeatherMap API

---

### Как работает приложение

1. Пользователь вводит название города  
2. Frontend отправляет запрос на сервер (`/weather` или `/forecast`)  
3. Backend делает запрос к OpenWeather API  
4. Сервер возвращает данные клиенту  
5. Интерфейс обновляется  

---

## 📁 Структура проекта
```
weather-app/
│
├── server.js          # backend (Express сервер)
├── weather.js         # логика frontend
├── weather.html       # интерфейс
├── weather.css        # стили
├── .env               # API ключ
├── package.json
```
## установить зависимости
```
npm install
```

## создать файл env.
```
API_KEY=
PORT=3000
```
## запуск сервера
```
node server.js
```

<img width="696" height="909" alt="image" src="https://github.com/user-attachments/assets/e6d436b4-2e24-44e1-aa9c-b84fbaecdabd" />
<img width="294" height="1253" alt="image" src="https://github.com/user-attachments/assets/aa0daf55-a436-48cd-a5f0-cc47865eaa27" />

