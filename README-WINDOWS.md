# Instrucciones para Windows

## Problema
Si encuentras el error `exec /usr/local/bin/docker-entrypoint.sh: no such file or directory`, usa la configuración específica para Windows.

## Solución
Ejecuta el siguiente comando:

```bash
docker-compose -f docker-compose.windows.yml up --build
```

## Para desarrollo
```bash
# Primera vez
docker-compose -f docker-compose.windows.yml up --build

# Siguientes veces
docker-compose -f docker-compose.windows.yml up
```

## Para detener
```bash
docker-compose -f docker-compose.windows.yml down
```
