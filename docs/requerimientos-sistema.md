# ElderCare - Documento de Requerimientos del Sistema

## Información General

**Proyecto:** ElderCare - Sistema de Gestión Geriátrica  
**Versión:** 1.0  
**Fecha:** Mayo 2025  
**Descripción:** Sistema integral para la gestión y cuidado de adultos mayores

---

## Requerimientos de Usuario

**RU3.1:** El personal del establecimiento autorizado podrá ingresar al sistema sus credenciales y, una vez dentro, registrar manualmente su horario de entrada y salida.

**RU3.10:** La Jefa de Operaciones podrá ingresar las compras realizadas en el sistema.

**RU3.11:** La Jefa de Operaciones podrá visualizar un informe semanal sobre el consumo de medicamentos y el presentismo de los empleados.

---

## Requerimientos de Software Funcionales

*(De todos los requerimientos funcionales presentes en el escenario se han eliminado para este informe aquellos que no tienen estrecha relación con las funciones que cumple la encargada de administración Cecilia Perez)*

### Autenticación y Control de Acceso

**RF3.1.1:** El sistema desplegará un menú para ingresar el usuario y la contraseña.

**RF3.1.2:** El sistema notificará si el usuario no existe.

**RF3.1.3:** El sistema notificará si la contraseña es incorrecta.

**RF3.1.4:** El sistema desplegará los datos del usuario cargados.

**RF3.1.5:** El sistema notificará si hubo un error al ingresar al sistema.

**RF3.1.6:** El sistema desplegará un menú donde el personal podrá ingresar su hora de entrada y salida diariamente.

### Gestión de Usuarios

**RF3.7.1:** El sistema desplegará un menú con las opciones para los registros de usuarios.

**RF3.7.2:** El sistema permitirá hacer ABM de usuarios con sus respectivos perfiles para determinadas áreas.

### Gestión de Medicamentos

**RF3.5.4:** El sistema permitirá eliminar algún medicamento para algún residente.

**RF3.8.1:** El sistema desplegará una lista con todos los medicamentos actuales en el inventario.

**RF3.8.2:** El sistema permitirá a la jefa de enfermería cargar un medicamento nuevo.

**RF3.8.3:** El sistema mostrará la cantidad disponible de cada medicamento.

**RF3.8.4:** El sistema notificará cuando el nivel de stock de un medicamento sea inferior a 10 unidades empaquetadas.

**RF3.8.6:** El sistema permitirá buscar medicamentos específicos por nombre o categoría.

**RF3.8.7:** El sistema permitirá acceder a detalles adicionales de cada medicamento, como la fecha de vencimiento y la ubicación en el almacén.

**RF3.8.8:** El sistema permitirá modificar la existencia de un medicamento.

**RF3.8.9:** El sistema permitirá exportar la información del stock a un formato imprimible o descargable (por ejemplo, PDF o Excel).

**RF3.9.1:** El sistema desplegará un menú donde las enfermeras podrán visualizar el stock actual de los medicamentos en tiempo real.

### Gestión de Compras

**RF3.10.1:** El sistema permitirá a la Jefa de Operaciones ingresar los detalles de las compras realizadas, incluyendo proveedor, fecha, y monto.

**RF3.10.2:** El sistema validará los datos ingresados antes de enviarlos a Tango Gestión, asegurando que toda la información requerida esté completa y correcta.

**RF3.10.3:** El sistema enviará automáticamente los datos de las compras y las facturas generadas a Tango Gestión para su procesamiento y registro.

**RF3.10.4:** El sistema recibirá la factura generada por Tango Gestión y la almacenará, notificando a la Jefa de Operaciones que la factura ha sido procesada y está disponible para revisión.

### Sistema de Informes

**RF3.11.1:** El sistema generará automáticamente un informe semanal que incluirá el consumo de medicamentos y el presentismo de los empleados.

**RF3.11.2:** El sistema permitirá a la Jefa de Operaciones acceder y visualizar el informe semanal directamente desde su panel de usuario.

**RF3.11.3:** El sistema enviará una notificación automática a la Jefa de Operaciones cuando el informe semanal esté disponible para su revisión.

---

## Estado de Implementación

### ✅ Implementados
- **Autenticación completa:** RF3.1.1, RF3.1.2, RF3.1.3, RF3.1.4, RF3.1.5, RF3.1.6
- **Gestión de usuarios:** RF3.7.1, RF3.7.2
- **Inventario de medicamentos:** RF3.8.1, RF3.8.3, RF3.8.4, RF3.8.6, RF3.9.1

### 🚧 En Desarrollo
- **Módulo de compras:** RF3.10.1

### ⏳ Planificados
- **Gestión avanzada de medicamentos:** RF3.5.4, RF3.8.2, RF3.8.7, RF3.8.8, RF3.8.9
- **Integración con Tango Gestión:** RF3.10.2, RF3.10.3, RF3.10.4
- **Sistema de informes automáticos:** RF3.11.1, RF3.11.2, RF3.11.3

---

## Arquitectura Técnica

### Tecnologías
- **Frontend:** Next.js 15.2.4 + React 19 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Estado:** React Hooks + LocalStorage
- **Build:** Turbopack

### Estructura del Proyecto
```
sistema-empleados/
├── app/                    # Páginas de la aplicación
│   ├── login/             # Autenticación
│   ├── empleados/         # Gestión de empleados
│   ├── registro-asistencia/ # Control de horarios
│   ├── menu-medicamentos/ # Gestión de medicamentos
│   └── menu-principal/    # Dashboard principal
├── components/            # Componentes reutilizables
├── src/                  # Lógica de negocio
└── data/                 # Datos de prueba
```

---

## Roles de Usuario

### Supervisor
- Acceso completo al sistema
- Gestión de empleados y usuarios
- Reportes y estadísticas
- Configuración del sistema

### Enfermero/a
- Gestión de medicamentos
- Control de inventario
- Registro de asistencia

### Médico/a
- Consulta de medicamentos
- Visualización de reportes
- Registro de asistencia

### Cuidador/a
- Registro básico de asistencia
- Consulta de información personal

---

## Información de Acceso

**URL del Sistema:** http://localhost:3000  
**Credenciales de Prueba:**
- Usuario: test@example.com
- Contraseña: password
- Rol: Supervisor

---

*Documento de Requerimientos v1.0 - ElderCare Sistema de Gestión Geriátrica* 