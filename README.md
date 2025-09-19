# Поставщик
Пользователи могут зарегистрироаться, создавать посты и писать к ним комментарии. 
## Стэк Технологий
Express+postgres+docker+goose
## Для запуска 
```bash
docker compose up 
```
## Схема базы данных
![Схема базы данных](https://github.com/Artem09076/js-api/blob/main/image/db_schema.svg)

## Эндпоинты
### Аутентификация
#### Регистрация
- **POST** /api/auth/register
- Body: { "username": "user", "email": "user@example.com", "password": "password123" }

#### Логин
- **POST** /api/auth/login
- Body: { "email": "user@example.com", "password": "password123" }

#### Обновление токена
- **POST** /api/auth/refresh
- Body: { "refreshToken": "token" }

#### Выход пользователя
- **POST** /api/auth/logout
- Headers: Authorization: Bearer <token>

### Посты
#### Получить все посты
- **GET** /api/posts
- Query params: ?page=1&limit=10&userId=123

#### Получить конкретный пост
- **GET** /api/posts/:id

#### Создать пост
- **POST** /api/posts
- Headers: Authorization: Bearer <token>
- Body: { "title": "Post Title", "content": "Post content..." }

#### Удалить пост
- **DELETE** /api/posts/:id
- Headers: Authorization: Bearer <token>

#### Получить посты конкретного пользователя
- **GET** /api/users/:userId/posts



### Комментарии
#### Получить комментарии к посту
- **GET** /api/posts/:postId/comments

#### Получить конкретный комментарий
- **GET** /api/comments/:id

#### Создать комментарий
- **POST** /api/posts/:postId/comments
- Headers: Authorization: Bearer <token>
- Body: { "content": "Comment text..." }

#### Удалить комментарий
- **DELETE** /api/comments/:id
- Headers: Authorization: Bearer <token>
