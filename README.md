# QR Sales

Aplicación web para la gestión de ventas mediante códigos QR.

QR Sales permite administrar artículos, registrar ventas utilizando la cámara del dispositivo, consultar el historial de ventas y continuar operando incluso sin conexión a Internet gracias al almacenamiento local y la sincronización automática de información.

---

## Características

- Dashboard con indicadores de ventas.
- Gestión de artículos.
- Registro de ventas mediante escáner QR.
- Carrito de compras.
- Historial de ventas.
- Generación de códigos QR.
- Registro opcional de ubicación GPS.
- Funcionamiento Offline.
- Sincronización automática de ventas pendientes.
- Progressive Web App (PWA).
- Diseño responsivo.

---

# Ambiente de pruebas

Se encuentra disponible una versión desplegada para facilitar la evaluación del proyecto.

## Aplicación

🌐 https://qr-sales.vercel.app/

## Infraestructura

| Componente | Tecnología |
|------------|------------|
| Frontend | Next.js 15 |
| Backend | Next.js API Routes |
| Hosting | Vercel |
| Base de datos | PostgreSQL (Neon) |
| ORM | Prisma ORM |
| Almacenamiento Offline | IndexedDB |
| Sincronización | Automática |

La aplicación se encuentra desplegada en **Vercel**, utilizando **Neon** como proveedor de la base de datos PostgreSQL.

> **Nota:** Debido a las limitaciones del plan gratuito de Neon, la primera solicitud después de un período de inactividad puede tardar algunos segundos mientras la base de datos vuelve a activarse.

---

## Tecnologías utilizadas

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- html5-qrcode
- Sonner

### Backend

- Next.js API Routes
- Prisma ORM

### Base de datos

- PostgreSQL (Neon)

### Almacenamiento local

- IndexedDB

---

## Funcionalidades

### Dashboard

Visualización de información resumida:

- Ventas realizadas
- Total vendido
- Artículos vendidos
- Promedio por venta
- Productos más vendidos
- Últimas ventas

---

### Gestión de artículos

Permite:

- Registrar artículos
- Buscar artículos
- Eliminar artículos
- Generar códigos QR

---

### Registro de ventas

Cada venta incluye:

- Escaneo mediante código QR.
- Selección de cantidad.
- Carrito de compras.
- Confirmación antes de registrar la venta.
- Registro opcional de ubicación GPS.

---

### Historial

Cada venta permite visualizar:

- Fecha de la venta.
- Productos vendidos.
- Total de la venta.
- Estado de la ubicación GPS.
- Detalle completo de la venta.
- Acceso directo a Google Maps cuando existe ubicación registrada.

---

### Funcionamiento Offline

Cuando no existe conexión a Internet:

- Las ventas se almacenan localmente en IndexedDB.
- La aplicación continúa funcionando normalmente.
- Las ventas pendientes se sincronizan automáticamente al recuperar la conexión.

---

### Progressive Web App

La aplicación puede instalarse como una aplicación nativa.

Incluye:

- Manifest.
- Service Worker.
- Instalación desde el navegador.
- Soporte Offline.

---

## Arquitectura

El proyecto está organizado utilizando una arquitectura basada en funcionalidades (**Feature-Based Architecture**) y Prisma ORM como capa de acceso a datos.

```text
app/
│
├── (app)
├── api/
└── layout.tsx

features/
│
├── articles/
├── dashboard/
└── sales/

shared/
│
├── components/
├── constants/
├── hooks/
├── lib/
├── providers/
├── services/
└── types/

prisma/
│
├── schema.prisma
└── migrations/

components/
└── ui/
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` utilizando como referencia:

```env
DATABASE_URL="..."

NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

### 4. Ejecutar migraciones

```bash
npx prisma migrate deploy
```

o durante el desarrollo

```bash
npx prisma migrate dev
```

---

### 5. Ejecutar la aplicación

```bash
npm run dev
```

---

### 6. Compilar para producción

```bash
npm run build
```

---

### 7. Ejecutar producción

```bash
npm start
```

---

## Variables de entorno

```env
DATABASE_URL="postgresql://..."

NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Decisiones técnicas

Durante el desarrollo se priorizaron los siguientes principios:

- Arquitectura modular basada en Features.
- Componentes reutilizables.
- Separación entre lógica de negocio y presentación.
- Tipado completo mediante TypeScript.
- Acceso a datos mediante Prisma ORM.
- Interfaz consistente utilizando Tailwind CSS y shadcn/ui.
- Experiencia Offline First mediante IndexedDB.
- Sincronización automática de ventas pendientes.
- Diseño adaptable para escritorio y dispositivos móviles.
- Despliegue en la nube mediante Vercel y Neon.

---

## Funcionalidades destacadas

- Dashboard con indicadores en tiempo real.
- Escaneo de productos mediante cámara.
- Registro de ventas con confirmación.
- Gestión completa de artículos.
- Generación de códigos QR.
- Historial de ventas.
- Visualización de ubicación GPS.
- Apertura de coordenadas en Google Maps.
- Sincronización automática al recuperar la conexión.
- Instalación como Progressive Web App (PWA).

---

## Productos de prueba

Para facilitar la evaluación del sistema se incluyen algunos códigos de ejemplo.

| Código | Producto |
|---------|----------|
| 1001 | Coca Cola Original 350cc |
| 1003 | Sprite 350cc |
| 3001 | Arroz Grado 1 1kg |
| 7001 | Mouse Inalámbrico |
| 7003 | Audífonos Bluetooth |

Estos códigos pueden utilizarse para generar QR y realizar pruebas de registro de ventas.

---

## Cómo probar

1. Acceder a la aplicación.
2. Crear un artículo o utilizar uno de los productos de prueba.
3. Generar un código QR.
4. Ir a **Nueva venta**.
5. Escanear el código QR.
6. Agregar productos al carrito.
7. Registrar la venta.
8. Consultar el Historial de ventas.
9. Desconectar Internet para probar el modo Offline.
10. Reconectar Internet y verificar la sincronización automática.

---

## Posibles mejoras

- Edición de artículos.
- Eliminación lógica de registros.
- Exportación de ventas.
- Dashboard con gráficos estadísticos.
- Gestión de usuarios y permisos.
- Reportes en PDF.
- Filtros avanzados para el historial.
- Pruebas unitarias y de integración.
- Internacionalización (i18n).