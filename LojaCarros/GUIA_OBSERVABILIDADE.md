# Guia de Observabilidade - Loja de Carros

Este guia explica como foi implementada a observabilidade no projeto usando a stack **PLG** (Prometheus, Loki, Grafana) + cAdvisor.

## 1. O que foi instalado?

*   **Grafana (Porta 3000):** O painel visual onde você verá seus gráficos e logs.
*   **Prometheus (Porta 9090):** Coleta métricas de performance.
*   **Loki (Porta 3100):** Sistema de agregação de logs. **Nota:** Ele não tem interface visual, se acessar pelo navegador dará erro 404. Isso é normal.
*   **Promtail:** Agente que lê os logs dos containers Docker e envia para o Loki.

*(Nota: O cAdvisor foi removido para garantir compatibilidade com Windows)*

## 2. Estrutura de Arquivos Criada

Foi criada uma pasta `monitoring` na raiz do projeto para manter tudo organizado:

```
LojaCarros/
├── monitoring/
│   ├── grafana/
│   │   └── provisioning/
│   │       └── datasources/
│   │           └── datasources.yml  # Conecta Grafana ao Prometheus e Loki automaticamente
│   ├── loki/
│   │   └── loki-config.yaml         # Configuração do banco de logs
│   ├── prometheus/
│   │   └── prometheus.yml           # Define quem o Prometheus deve monitorar
│   └── promtail/
│       └── promtail-config.yaml     # Configura a leitura dos logs do Docker
└── docker-compose.yml               # Atualizado com os novos serviços
```

## 3. Como Rodar

Como eu já criei todos os arquivos de configuração e atualizei o `docker-compose.yml`, você só precisa reiniciar seu ambiente.

1.  Abra o terminal na pasta `LojaCarros`.
2.  Execute o comando para recriar os containers:

```bash
docker-compose up -d --remove-orphans
```

*O `--remove-orphans` garante que serviços antigos sejam limpos.*

## 4. Como Acessar e Usar

### Acessando o Grafana
1.  Abra seu navegador em: [http://localhost:3000](http://localhost:3000)
2.  **Login:** `admin`
3.  **Senha:** `admin` (será solicitado para mudar a senha no primeiro acesso, pode pular se quiser).

### Vendo os Logs (Loki)
1.  No menu lateral esquerdo, vá em **Explore** (ícone de bússola).
2.  No topo, certifique-se de que a fonte de dados **Loki** está selecionada.
3.  No campo de query, você pode filtrar logs por container. Exemplo para ver logs do PHP:
    ```
    {container="/lojacarros-php-1"}
    ```
    *Dica: Clique no botão "Label browser" para ver os containers disponíveis.*

### Vendo Métricas (Prometheus)
1.  Ainda no **Explore**, mude a fonte de dados para **Prometheus**.
2.  Tente uma métrica simples, como uso de memória:
    ```
    container_memory_usage_bytes
    ```
3.  Clique em "Run query".

## 5. Manutenção

*   **Adicionar novos serviços:** O Promtail está configurado para ler logs de *todos* os containers automaticamente. Se você adicionar um novo serviço no `docker-compose.yml`, os logs dele aparecerão no Loki automaticamente.
*   **Persistência:** Os dados do Grafana não estão persistidos em volume neste setup simples para facilitar o reset, mas as configurações de conexão (datasources) são recarregadas sempre que o container sobe.

---
**Pronto!** Agora você tem monitoramento profissional de logs e métricas rodando no seu projeto local.
