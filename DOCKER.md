# Docker Compose Structure

This project uses a modular Docker Compose structure with component-specific base files to avoid duplication and make components self-contained.

## Structure Overview

- Component-specific base files:
  - `db/docker-compose.base.yml` - Base configurations for database services
  - `backend/docker-compose.base.yml` - Base configurations for backend services
  - `web/docker-compose.base.yml` - Base configurations for web services
- Root docker-compose files:
  - `docker-compose.yml` - Production setup for all components
  - `docker-compose.dev.yml` - Development setup for all components
- Component docker-compose files:
  - Each component has its own production and development configs

## How it Works

1. Each component defines its own base configurations in a component-specific `docker-compose.base.yml`
2. Component-specific configs use Docker Compose's `extends` feature to inherit from their own base services
3. Root docker-compose files use the `extends` feature to inherit from component base services

## Running the Application

### Full Stack

To run all components together:

```bash
# Production
docker-compose up

# Development
docker-compose -f docker-compose.dev.yml up
```

### Individual Components

To run a specific component:

```bash
# Production
cd {component_dir} && docker-compose up

# Development
cd {component_dir} && docker-compose -f docker-compose.dev.yml up
```

## Relationship Between Files

- Root configurations create the network and handle dependencies between components
- Component configurations assume the network exists when used independently

## Benefits of This Component-Specific Structure

1. **Self-Contained Components** - Each component manages its own configuration
2. **Reduced Duplication** - Common settings are defined once per component
3. **Component Autonomy** - Teams can modify their component configurations independently
4. **Flexibility** - Components can be run independently or together
5. **Maintainability** - Changes to component configurations are isolated
6. **Encapsulation** - Configuration details are kept close to the component they affect
