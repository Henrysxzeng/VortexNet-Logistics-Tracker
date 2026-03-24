# vendor-infra/main.tf

# ==========================================
# 1. 声明我们要使用的云厂商 (AWS)
# ==========================================
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# 配置 AWS 区域 (和我们之前手动操作的保持一致)
provider "aws" {
  region = "us-east-1"
}

# ==========================================
# 2. 自动化：创建一个全新的 DynamoDB 数据库
# ==========================================
resource "aws_dynamodb_table" "vortexnet_tracking" {
  name           = "VortexNet-Telematics-DB" # 数据库表名
  billing_mode   = "PAY_PER_REQUEST"         # 按需计费，极其省钱
  hash_key       = "deviceId"                # 设定主键

  attribute {
    name = "deviceId"
    type = "S"                               # 'S' 代表 String 类型
  }

  # 给这台数据库打上公司的标签
  tags = {
    Environment = "Production"
    Project     = "VortexNet"
  }
}

# ==========================================
# 3. 自动化：创建一个 S3 存储桶 (并保证名字全球唯一)
# ==========================================
# 生成几个随机字符，防止 S3 名字和别人撞车
resource "random_id" "bucket_id" {
  byte_length = 4
}

resource "aws_s3_bucket" "vortexnet_assets" {
  # 桶名将会是 vortexnet-assets-tf-加上一串随机字符
  bucket = "vortexnet-assets-tf-${random_id.bucket_id.hex}" 
  
  tags = {
    Environment = "Production"
  }
}

# ==========================================
# 4. 任务结束后，在屏幕上打印出建好的 S3 名字
# ==========================================
output "new_s3_bucket_name" {
  value = aws_s3_bucket.vortexnet_assets.bucket
}