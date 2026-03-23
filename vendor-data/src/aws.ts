import AWS from 'aws-sdk';
import { AWSRegions } from './types/aws';

AWS.config.update({ region: AWSRegions.US_EAST_1 });

const { DynamoDB } = AWS;
const dynamodb = new DynamoDB();

// 1. 创建表 (Create)
export const dynamodbCreateTable = async (params: AWS.DynamoDB.CreateTableInput) => {
  try {
    const res = await dynamodb.createTable(params).promise();
    console.log(`✅ Table '${params.TableName}' created successfully.`);
    return res;
  } catch (error: any) {
    // 【架构优化】：如果表已经存在，拦截错误，打印提示，但不让程序崩溃
    if (error.code === 'ResourceInUseException') {
      console.log(`⚠️ Table '${params.TableName}' already exists. Skipping creation.`);
      return null;
    }
    console.error('❌ Failed to create table:', error);
    throw error;
  }
};

// 2. 描述/查询表信息 (Describe)
export const dynamodbDescribeTable = async (tableName: string) => {
  try {
    const res = await dynamodb.describeTable({ TableName: tableName }).promise();
    console.log(`ℹ️ Table '${tableName}' info retrieved successfully.`);
    return res;
  } catch (error: any) {
    console.error('❌ Failed to describe table:', error);
    throw error;
  }
};

// 3. 删除表 (Delete)
export const dynamodbDeleteTable = async (tableName: string) => {
  try {
    const res = await dynamodb.deleteTable({ TableName: tableName }).promise();
    console.log(`🗑️ Table '${tableName}' deleted successfully.`);
    return res;
  } catch (error: any) {
    // 【架构优化】：如果表本来就不存在，删除时也不要报错崩溃
    if (error.code === 'ResourceNotFoundException') {
      console.log(`⚠️ Table '${tableName}' not found. Nothing to delete.`);
      return null;
    }
    console.error('❌ Failed to delete table:', error);
    throw error;
  }
};
// 引入 DocumentClient，它可以自动帮我们把普通的 JS/TS 对象转换成 DynamoDB 认识的格式
const docClient = new AWS.DynamoDB.DocumentClient();

// 4. 插入或覆盖一条数据 (Put Item)
export const dynamodbPutVendor = async (tableName: string, vendor: any) => {
  try {
    const params = {
      TableName: tableName,
      Item: vendor,
    };
    await docClient.put(params).promise();
    console.log(`📦 Successfully seeded vendor: ${vendor.name}`);
  } catch (error) {
    console.error(`❌ Failed to seed vendor ${vendor.name}:`, error);
    throw error;
  }
};