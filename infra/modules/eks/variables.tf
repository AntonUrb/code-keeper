variable "env" {
  description = "The environment name (e.g., dev, stage, prod)"
  type        = string
}

variable "eks_name" {
  description = "The name of the EKS cluster"
  type        = string
}

variable "eks_version" {
  description = "The version of the EKS cluster"
  type        = string
}

# variable "private_subnet_ids" {
#   description = "List of private subnet IDs"
#   type        = list(string)
# }

variable "subnet_id" {
  type = object({
    value = list(string)
  })
}

variable "vpcID" {
  type = string
}

