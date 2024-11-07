module "vpc" {
  source = "./modules/vpc"

  vpc_cidr        = var.vpc_cidr
  env             = var.env
  az              = var.az
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
  eks_name        = var.eks_name
  eks_version     = var.eks_version
}

module "eks" {
  source = "./modules/eks"

  eks_name    = var.eks_name
  eks_version = var.eks_version
  env         = var.env

  subnet_id = {
    value = module.vpc.private_subnet_ids # Accessing the output from the VPC module
  }

  vpcID = module.vpc.vpcID
}

module "iam" {
  source = "./modules/iam"

  eks_cluster_name = module.eks.cluster_name
  env              = var.env
}

# module "cloudwatch" {
#   source         = "../modules/cloudwatch"
#   dashboard_name = "MainDashboard-${var.env}"
#   widgets = [
#     {
#       type   = "metric",
#       width  = 24,
#       height = 6,
#       properties = {
#         region = "${var.aws_region}",
#         metrics = [
#           ["AWS/EC2", "CPUUtilization", "InstanceId", "<YOUR_INSTANCE_ID>"]
#         ],
#         period  = 300,
#         stat    = "Average",
#         title   = "EC2 Instance CPU Utilization",
#         view    = "timeSeries",
#         stacked = false,
#         annotations = {
#           horizontal = []
#         }
#       }
#     },
#     {
#       type   = "metric",
#       width  = 24,
#       height = 6,
#       properties = {
#         region = "${var.aws_region}",
#         metrics = [
#           ["AWS/ELB", "RequestCount", "LoadBalancer", "<YOUR_LOAD_BALANCER_NAME>"]
#         ],
#         period  = 300,
#         stat    = "Sum",
#         title   = "ELB Request Count",
#         view    = "timeSeries",
#         stacked = false,
#         annotations = {
#           horizontal = []
#         }
#       }
#     }
#   ]
# }

terraform {
  backend "s3" {
    bucket         = "karl-code-keeper"
    key            = "workspace/terraform.tfstate"
    region         = "eu-north-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}

