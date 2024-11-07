output "cluster_name" {
  value = "${aws_eks_cluster.eks.name}"
  depends_on = [ aws_eks_cluster.eks ]
}

