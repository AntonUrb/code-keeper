variable "aws_region" {
  description = "Region"
  type        = string
  default     = "eu-north-1"
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  type        = string
}

variable "env" {
  description = "The environment name (e.g., dev, stage, prod)"
  type        = string
}

variable "az" {
  description = "The first availability zone"
  type        = list(string)
}

variable "eks_name" {
  description = "The name of the EKS cluster"
  type        = string
}

variable "eks_version" {
  description = "The version of the EKS cluster"
  type        = string
}

variable "public_subnets" {
  description = "List of public subnets for the VPC"
  type        = list(string)
}

variable "private_subnets" {
  description = "List of private subnets for the VPC"
  type        = list(string)
}

# variable "private_subnet_ids" {
#   description = "List of private subnet IDs"
#   type        = list(string)
# }