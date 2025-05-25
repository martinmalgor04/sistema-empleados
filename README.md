# 🏥 ElderCare - Sistema de Gestión Geriátrica

![ElderCare Logo](public/logo-eldercare-full.png)

## 🎯 Descripción

**ElderCare** es un sistema integral de gestión para centros geriátricos desarrollado con Next.js 15 y React 19. Automatiza y optimiza los procesos de cuidado de adultos mayores, desde la gestión del personal hasta el control de medicamentos y suministros.

## ✨ Características Principales

- 🔐 **Sistema de autenticación** con roles diferenciados
- 👥 **Gestión completa de empleados** con CRUD y búsqueda avanzada
- ⏰ **Control de asistencia** con validaciones y reportes
- 💊 **Gestión de medicamentos** con inventario y alertas de stock
- 🛒 **Sistema de compras** con categorización y reportes
- 📱 **Diseño responsive** para móvil, tablet y desktop
- 🎨 **Theme switcher** (claro/oscuro)
- 🔧 **Sidebar colapsible** para optimización de espacio

## 🚀 Demo y Acceso

- **URL Local:** http://localhost:3000
- **Credenciales de prueba:**
  - Email: `test@example.com`
  - Contraseña: `password`
  - Rol: Supervisor (acceso completo)

## 🛠️ Tecnologías

- **Frontend:** Next.js 15.2.4 + React 19 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Icons:** Lucide React
- **State Management:** React Hooks + LocalStorage
- **Build Tool:** Turbopack

## 📁 Estructura del Proyecto

```
sistema-empleados/
├── 📚 docs/                   # Documentación completa
│   ├── requerimientos-sistema.md
│   ├── resumen-ejecutivo.md
│   └── manual-usuario.md
├── 🎯 app/                    # App Router de Next.js
│   ├── empleados/            # Gestión de empleados
│   ├── login/                # Autenticación
│   ├── menu-medicamentos/    # Gestión de medicamentos
│   ├── menu-principal/       # Dashboard principal
│   └── registro-asistencia/  # Control de asistencia
├── 🧩 components/            # Componentes reutilizables
│   ├── ui/                  # Componentes básicos (shadcn/ui)
│   └── layout/              # Componentes de layout
├── 🔧 src/                   # Lógica de negocio
│   ├── types/               # Definiciones TypeScript
│   ├── utils/               # Utilidades y helpers
│   ├── constants/           # Constantes del sistema
│   ├── services/            # Servicios de API simulada
│   └── components/          # Componentes de dominio
└── 📊 data/                  # Datos JSON para desarrollo
```

## 📚 Documentación

### 📋 [Requerimientos del Sistema](docs/requerimientos-sistema.md)
Documento técnico completo con:
- 👥 User Stories detalladas
- ⚙️ Requerimientos funcionales y no funcionales
- 🏗️ Arquitectura del sistema
- 📈 Métricas y KPIs
- 🚀 Roadmap futuro

### 📊 [Resumen Ejecutivo](docs/resumen-ejecutivo.md)
Visión general para stakeholders:
- 🎯 Objetivos y beneficios del sistema
- 📊 Módulos y funcionalidades principales
- 👥 Roles y permisos
- 💰 ROI y métricas de negocio

### 📖 [Manual de Usuario](docs/manual-usuario.md)
Guía práctica de uso:
- 🚀 Inicio rápido
- 👥 Guías específicas por rol
- ❗ Resolución de problemas
- 💡 Tips y mejores prácticas

## 🏃‍♂️ Inicio Rápido

### Prerrequisitos
- Node.js 18+ 
- pnpm (recomendado) o npm

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/martin-malgor/sistema-empleados.git
cd sistema-empleados

# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev
```

### Acceso al Sistema
1. Abre http://localhost:3000
2. Usa las credenciales: `test@example.com` / `password`
3. Explora las funcionalidades según tu rol

## 👥 Roles del Sistema

| Rol | Permisos | Estado |
|-----|----------|--------|
| 🔰 **Supervisor** | Acceso completo al sistema | ✅ Implementado |
| 🩺 **Enfermero** | Medicamentos + Asistencia | ✅ Implementado |
| 👨‍⚕️ **Médico** | Consulta + Asistencia personal | ✅ Implementado |
| 👨‍🦳 **Cuidadora** | Asistencia personal básica | ✅ Implementado |

## 🎯 Funcionalidades Principales

### ✅ Implementadas
- 🔐 Autenticación con roles
- 👥 CRUD completo de empleados
- ⏰ Registro y control de asistencia
- 💊 Gestión de inventario de medicamentos
- 📊 Dashboard con estadísticas
- 🎨 Interfaz responsive con themes

### 🚧 En Desarrollo
- 🛒 Módulo completo de compras
- 📋 Gestión de residentes
- 📊 Reportes avanzados
- 🔔 Notificaciones automáticas

### ⏳ Planificadas
- 🏥 Historiales médicos
- 🤖 IA para predicciones
- 📱 PWA (Progressive Web App)
- 🔗 Integración con sistemas externos

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
pnpm test

# Verificar tipos TypeScript
pnpm type-check

# Verificar linting
pnpm lint
```

## 🚀 Despliegue

```bash
# Build para producción
pnpm build

# Ejecutar en producción
pnpm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 📞 Contacto

**Martin Malgor**
- Email: martinmalgor@example.com
- GitHub: [@martin-malgor](https://github.com/martin-malgor)
- Proyecto: [ElderCare](https://github.com/martin-malgor/sistema-empleados)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el framework
- [shadcn/ui](https://ui.shadcn.com/) por los componentes
- [Tailwind CSS](https://tailwindcss.com/) por el styling
- [Lucide](https://lucide.dev/) por los iconos

---

⭐ Si este proyecto te ayuda, ¡dale una estrella en GitHub!

*Sistema desarrollado para optimizar la gestión de centros geriátricos* 