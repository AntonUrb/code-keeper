env             = "prod"
aws_region      = "eu-north-1"
eks_name        = "main-cluster"
eks_version     = "1.30"
az              = ["eu-north-1a", "eu-north-1b"] 
public_subnets  = ["10.0.1.0/24", "10.0.3.0/24"]
private_subnets = ["10.0.2.0/24", "10.0.4.0/24"]
vpc_cidr        = "10.0.0.0/16"