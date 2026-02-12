# Estructuras de Carpetas

```bash
/src
 ├── app/                    # Rutas de Next.js 
 │    ├── layout.tsx
 │    ├── page.tsx
 │    └── ...
 │
 ├── presentation/           # Capa de Presentación 
 │    ├── components/        # Componentes de UI 
 │    ├── actions/           # Servers Actions
 │    └── wrapper/            # Wrapper Envio de datos a otro componentes
 │
 ├── domain/                 # Capa de Dominio
 │    ├── usecases/          # Casos de uso
 │    ├── entities/          # Entidades 
 │    ├── dtos/              # Data Transfer Objects 
 │    └── repositories/      # Interfaces de acceso a datos (contratos)
 │
 ├── infrastructure/         # Capa de Infraestructura (implementaciones reales)
 │    ├── datasource/        # Llamadas HTTP (fetch)
 │    ├── repositories/      # Implementación de interfaces del dominio
 │    ├── models/            # Modelos
 │    ├── mappers/           # Mapeadores
 │
 ├── state/                  # Zustand
      ├── stores/            # Definición de stores 
      └── middlewares/       # Middlewares de Zustand
```

Flujo para todo tipo de GET

dominio (entidad(1.1) ➝ repositorio(1.2) ➝ caso de uso(1.3)) : final de dominio pasas al 2.
infrastructure(datasource(2.1) ➝ models(2.2) ➝ mappers(2.3) ➝ repositories(2.4)) : final de infrastructure pasas al 3.
presentation (action(3.1) ➝ types(3.2) ➝components(3.3) ➝ pages(3.4)) : Final de presetation pasas 4
App () aqui solo renderizas las paginas de que se crearon en la capa de presentation
