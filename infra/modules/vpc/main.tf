resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
  
  enable_dns_support = true
  enable_dns_hostnames = true

  tags = {
    Name = "VPC-${var.env}"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.env}-igw"
  }
}

# data "aws_subnet" "id" {
#   for_each = toset(var.private_subnets)

#   cidr_block = each.key
# }

# locals {
#   subnet_ids = tomap({
#     for cidr, subnet in data.aws_subnet.id : cidr => subnet.id
#   })
# }

