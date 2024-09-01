# Aplicación de Backend (Rails)

## Descripción

Esta aplicación de backend se encuentra implementada con Ruby on Rails, y provee los modelos según el modelo de dominio descrito en el archivo [README.md](../README.md) en la raíz del repositorio en donde se encuentra alojado este código.

Las APIs que provee el código base de esta aplicación están limitadas a los siguientes modelos:

* `Bars`: Implementada en `controllers/api/v1/bars_controller.rb`.
* `Beer`: Implementada en `controllers/api/v1/beers_controller.rb`.
* `Reviews`: Implementada en `controllers/api/v1/reviews_controller.rb`.
* `User`: Implementada en `controllers/api/v1/registrations_controller.rb` y en `controllers/api/v1/sessions_controller.rb`.

Está implementada la autenticación básica con email y contraseña utilizando devise-jwt.

Las rutas de la aplicación están definidas en `config/routes.rb`.

Esta aplicación de backend podrá ser modificada en las futuras entregas de proyecto para incorporar funcionalidad faltante.

## Pruebas

Hay tests disponibles escritos en RSpec para modelos de la aplicación y algunos de los controladores. Los tests están bajo `spec`, en subdirectorios `models` (tests de operaciones de modelos), y `requests` (tests para las APIs).

La ejecución de los tests es con rake de la siguiente manera:

```sh
bundle exec rspec
```

## Requisitos

La aplicación de backend requiere ruby 3.3.4, y rails 7.1. Es recomendable utilizar Ruby Version Manager en Desarrollo.

## Ejecución

Las instrucciones de ejecución de esta aplicación se encuentran en el archivo `README.md` en la raíz del repositorio en donde se encuentra alojado este código.
