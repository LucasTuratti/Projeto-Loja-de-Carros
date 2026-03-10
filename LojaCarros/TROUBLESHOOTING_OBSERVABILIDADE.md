# Troubleshooting de Observabilidade

Se os serviços não subiram (erro "Connection Refused" ou site fora do ar), siga estes passos para diagnosticar e corrigir.

## 1. Verificar Status dos Containers

Abra o terminal na pasta do projeto e rode:

```powershell
docker-compose ps
```

*   **O que procurar:** Todos os serviços (`grafana`, `prometheus`, `loki`, `promtail`) devem estar com status `Up`.
*   **Se estiverem `Exit` ou `Restarting`:** Significa que houve erro na inicialização.

## 2. Ver Logs de Erro

Se algum container não subiu, veja o log dele para entender o motivo.

**Para ver logs do Prometheus:**
```powershell
docker-compose logs prometheus
```

**Para ver logs do Grafana:**
```powershell
docker-compose logs grafana
```

**Para ver logs do Loki:**
```powershell
docker-compose logs loki
```

## 3. Forçar Recriação do Ambiente

Às vezes, configurações antigas ficam presas. O comando abaixo para tudo, remove containers antigos e sobe tudo do zero:

```powershell
docker-compose down --remove-orphans
docker-compose up -d
```

## 4. Problemas Comuns no Windows

### Erro de Volume (Mounts)
Se você ver erros sobre "mount" ou "path not found" nos logs, pode ser problema de permissão do Docker Desktop.
*   Vá nas configurações do Docker Desktop -> Resources -> File Sharing.
*   Garanta que a pasta do seu projeto (`c:\Users\renat\Downloads\LojaCarros2`) está permitida.

### Porta em Uso
Se o erro for "Bind for 0.0.0.0:3000 failed: port is already allocated", significa que outro programa já está usando a porta 3000.
*   Solução: Mude a porta no `docker-compose.yml` (ex: de `3000:3000` para `3001:3000`) e rode `docker-compose up -d` novamente.

## 5. Teste de Conectividade

Tente acessar diretamente os serviços para ver se respondem:
*   Prometheus: [http://localhost:9090](http://localhost:9090)
*   Loki (Metrics): [http://localhost:3100/ready](http://localhost:3100/ready) (Deve aparecer "ready")
    *   **Atenção:** Se você acessar apenas `http://localhost:3100`, verá um erro "404 page not found". **Isso é normal!** O Loki não tem tela visual, ele é apenas um banco de dados. Use o Grafana para ver os dados dele.
*   Grafana: [http://localhost:3000](http://localhost:3000)
