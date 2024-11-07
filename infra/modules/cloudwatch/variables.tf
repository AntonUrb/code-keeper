# variable "dashboard_name" {
#   description = "The name of the CloudWatch Dashboard"
#   type        = string
# }
# variable "widgets" {
#   description = "A list of widgets to be included in the CloudWatch Dashboard"
#   type = list(object({
#     type       = string
#     width      = number
#     height     = number
#     properties = any
#   }))
# }