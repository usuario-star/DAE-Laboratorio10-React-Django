# TECSUP - Desarrollo de Aplicaciones Empresariales
## Laboratorio N° 10: Componentes y Eventos

Proyecto desarrollado que integra una API REST construida en **Django** con un cliente web interactivo en **ReactJS** utilizando la librería de componentes **Material-UI (MUI)**.

### Estructura del Proyecto
- `backend/`: Servicio Web en Django con ORM, base de datos SQLite y soporte para CORS (`/api/producto/`).
- `lab10/`: Aplicación frontend en ReactJS con Material-UI, gestión de ciclo de vida (`componentDidMount`), renderizado condicional y formulario interactivo con eventos (`handleChange`, `handleSubmit`) para inserción mediante HTTP POST.

### Instrucciones de Ejecución

#### 1. Backend (Django)
```bash
cd backend
python manage.py migrate
python manage.py runserver
```
Servicio disponible en: `http://localhost:8000/api/producto/`

#### 2. Frontend (React)
En otra terminal:
```bash
cd lab10
npm install
npm start
```
Aplicación disponible en: `http://localhost:3000/`
