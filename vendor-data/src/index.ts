import { dynamodbCreateTable, dynamodbDescribeTable, dynamodbPutVendor } from './aws';
// 导入我们刚刚写好的国际化种子数据
import { seedVendors } from './data/vendors';

const init = async () => {
  const TABLE_NAME = 'vendors';

  const tableParams: AWS.DynamoDB.CreateTableInput = {
    TableName: TABLE_NAME,
    KeySchema: [{ AttributeName: 'deviceId', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'deviceId', AttributeType: 'S' }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1, 
      WriteCapacityUnits: 1,
    },
  };

  console.log('🚀 正在启动数据库初始化与播种流程...');

  try {
    // 1. 确保表已经创建
    await dynamodbCreateTable(tableParams);
    await dynamodbDescribeTable(TABLE_NAME);

    // 2. 遍历我们的种子数据，一辆一辆地录入数据库
    console.log('🌱 开始向数据库写入初始卡车数据...');
    for (const vendor of seedVendors) {
      await dynamodbPutVendor(TABLE_NAME, vendor);
    }

    console.log('✨ 数据库初始化与数据播种全部完成！');
  } catch (error) {
    console.error('❌ 流程意外中止:', error);
  }
};

init();