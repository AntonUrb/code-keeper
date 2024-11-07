variable "eks_cluster_name" {
  type = string
}

variable "env" {
  description = "The environment name (e.g., dev, stage, prod)"
  type        = string
}
