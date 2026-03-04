resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
}

# --- Kubernetes Cluster (AKS) ---
resource "azurerm_kubernetes_cluster" "aks" {
  name                = "${var.prefix}-aks"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = "${var.prefix}-dns"

  default_node_pool {
    name       = "default"
    node_count = 2
    vm_size    = "Standard_DS2_v2"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    Environment = "Production"
  }
}

# --- SQL Server & Database ---
resource "azurerm_mssql_server" "sql" {
  name                         = "${var.prefix}-sql-server"
  resource_group_name          = azurerm_resource_group.main.name
  location                     = azurerm_resource_group.main.location
  version                      = "12.0"
  administrator_login          = var.sql_admin_user
  administrator_login_password = var.sql_admin_password
}

resource "azurerm_mssql_database" "db" {
  name           = "Learning"
  server_id      = azurerm_mssql_server.sql.id
  collation      = "SQL_Latin1_General_CP1_CI_AS"
  max_size_gb    = 2
  read_scale     = false
  sku_name       = "S0"
  zone_redundant = false
}

# Allow AKS to connect to SQL (Firewall Rule)
resource "azurerm_mssql_firewall_rule" "aks_access" {
  name             = "AllowAKS"
  server_id        = azurerm_mssql_server.sql.id
  start_ip_address = "0.0.0.0" # Simplification for demo; in prod use specific VNets
  end_ip_address   = "0.0.0.0"
}
