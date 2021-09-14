import { DynamoDBClient, ListTablesCommand, CreateTableCommand, PutItemCommand, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb"
(async () => {
  const client = new DynamoDBClient({ 
    region: "ap-south-1", 
    credentials:{
      sessionToken:"",
      accessKeyId:"", 
      secretAccessKey:"" 
    },
  });
  // const command = new CreateTableCommand({
  //   TableName: "setu-verdaccio-login",
  //   AttributeDefinitions: [
  //     {
  //       AttributeName: "username",
  //       AttributeType: "S"
  //     }
  //   ],
  //   KeySchema: [
  //     {
  //       AttributeName: "username",
  //       KeyType: "HASH"
  //     }
  //   ],
  //   ProvisionedThroughput: {
  //     ReadCapacityUnits: 10,
  //     WriteCapacityUnits: 5
  //   }

  // })
  // const command = new PutItemCommand({
  //   TableName: "setu-verdaccio-logins",
  //   Item: {
  //     username: {
  //       S: "someuser"
  //     },
  //     secret: {
  //       S: "somesecretonlysomeuserandsystemknows"
  //     }
  //   }
  // })
  // const command = new GetItemCommand({
  //   TableName: "Login",
  //   Key: {
  //     username: {
  //       S: "someuser23"
  //     }
  //   }
  // })

  const command = new ScanCommand({
      TableName:"setu-verdaccio-logins"
  })

  try {
    const results = await client.send(command);
    results.Items?.forEach(console.log)
  } catch (err) {
    console.error(err);
  }
})();