# output "private_subnet_ids" {
#   description = "The IDs of the private subnets"
#   value       = aws_subnet.private[*].id
# }

output "public_subnet_ids" {
  description = "The IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  value = "${aws_subnet.private[*].id}"
  depends_on = [ aws_subnet.private ]
}

output "vpcID" {
  description = "ID of the VPC"
  value = aws_vpc.main.id
}