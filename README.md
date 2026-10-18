# Yakuri — Frontend

Aplicación web en Angular que presenta el prototipo *Yakuri*: un escáner de impacto
hídrico para productos de limpieza y cuidado personal, con una auditoría ética en
vivo y la base científica de ingredientes que sustenta cada puntaje.

**Aplicación en producción:** https://yakuri-frontend.vercel.app/presentacion
**Backend asociado:** https://github.com/anespiju02/yakuri-backend
**Documentación de la API consumida:** https://yakuri-backend.onrender.com/docs

## Qué incluye

| Ruta | Página | Qué muestra |
|---|---|---|
| `/presentacion` | Presentación | Resumen del proyecto, su arquitectura y su marco ético — punto de entrada para quien ve el proyecto por primera vez |
| `/escaner` | Escáner A-E | Analiza el texto (o una foto) de una etiqueta y muestra el índice de impacto hídrico, su explicación y alternativas sugeridas |
| `/auditoria-etica` | Auditoría ética | Ejecuta en vivo la prueba de sustitución de marca (regla 6.3): mismas fórmulas, distintas marcas y precios inyectados, verificando que el resultado no cambie |
| `/base-cientifica` | Base científica | Explora el catálogo de ingredientes con su fuente, justificación y estado (verificado / evidencia insuficiente) |

La barra superior indica en todo momento si la aplicación está conectada al backend
real (`API FastAPI Conectada`) o si está operando en modo de respaldo local
(`Modo Local / Simulación`) porque el backend no respondió — útil porque el backend
corre en un plan gratuito con arranque en frío (cold start).

## Arquitectura

```
src/app/
├── core/
│   ├── api/yakuri-backend/     # Cliente TypeScript autogenerado desde el OpenAPI del backend
│   ├── services/
│   │   ├── yakuri-api.service.ts            # Fachada sobre el cliente autogenerado
│   │   └── local-ethics-fallback.service.ts  # Simulación local cuando el backend no responde
│   └── models/                  # Tipos de dominio (Ingredient, ProductScanResult, ...)
├── features/
│   ├── presentation/   # Página de presentación del proyecto
│   ├── scanner/        # Escáner de etiquetas
│   ├── ethics-audit/   # Auditoría de sustitución de marca
│   └── ingredients-db/ # Explorador de la base científica
└── shared/components/
    └── score-badge/    # Insignia visual del grado A-E (verde → rojo)
```

Construido con **Angular standalone components** y **signals** (sin NgModules, sin
RxJS para el estado de UI salvo en las llamadas HTTP), estilos con **Tailwind CSS**, y
un cliente HTTP generado automáticamente desde la especificación OpenAPI del backend
(`openapi-generator`, configurado en `openapitools.json`) — así que cualquier cambio
en el contrato del backend se refleja regenerando el cliente, no editándolo a mano.

## Resiliencia: modo de respaldo local

Si el backend no responde (dormido por inactividad, caído, o sin conexión), cada
página cae automáticamente a `LocalEthicsFallbackService`, que simula la misma lógica
de matching y puntaje con un catálogo reducido de ingredientes, para que la demo
nunca se vea "rota" frente a un jurado o evaluador. Este catálogo local es una copia
parcial, mantenida a mano, de la base de datos real del backend — por diseño no
intenta ser una réplica completa, solo cubrir los ejemplos de demostración.

## Estado actual (honesto, no aspiracional)

Esta interfaz es funcional y cubre los cuatro flujos principales del prototipo. Las
mejoras pendientes — documentadas en detalle en `yakuri_frontend_mejoras.md`, incluido
junto a este README — son principalmente de consistencia y transparencia:

- Mantener sincronizado el catálogo de respaldo local con la base de datos real del
  backend (ya se detectó y corrigió una primera divergencia).
- Mostrar de forma más visible, en cada página, cuándo un resultado proviene del modo
  de simulación local en vez del backend real (hoy solo se indica en la barra superior).
- Eliminar código no utilizado y reducir la duplicación de los datos de prueba de la
  auditoría ética entre el backend y el frontend.

## Cómo correrlo localmente

```bash
npm install
ng serve
```

Por defecto apunta al backend desplegado en Render. Para apuntar a un backend local,
ajustar la URL base en `core/api/yakuri-backend/variables.ts` o la configuración de
entorno correspondiente.

Para regenerar el cliente de la API tras un cambio en el backend:

```bash
npm run generate-api   # o el script equivalente definido en package.json / openapitools.json
```

Para correr las pruebas unitarias:

```bash
ng test
```

## Despliegue

Desplegado en [Vercel](https://vercel.com) como aplicación Angular (SSR/SSG según
`app.config.server.ts`). La URL pública estable es la indicada arriba; los enlaces de
vista previa (`*-<hash>-<org>.vercel.app`) pueden requerir inicio de sesión en Vercel
y no deben citarse como el enlace público del proyecto.

## Contexto académico

Proyecto desarrollado para el curso de Procesamiento del Lenguaje Natural de la
Maestría en Inteligencia Artificial, Universidad Continental (Perú), por
Angel Freedd Espinoza Julcarima.
