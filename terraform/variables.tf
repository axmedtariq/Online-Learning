variable "prefix" {
  description = "The prefix used for all resources in this example"
  default     = "elearn"
}

variable "location" {
  description = "The Azure location where all resources in this example should be created"
  default     = "East US"
}

variable "resource_group_name" {
  description = "The name of the resource group"
  default     = "elearn-resources"
}

variable "sql_admin_user" {
  description = "The administrator username for the SQL Server"
  default     = "sqladmin"
}

variable "sql_admin_password" {
  description = "The administrator password for the SQL Server"
  default     = "P@ssw0rd123456!"
  sensitive   = true
}
