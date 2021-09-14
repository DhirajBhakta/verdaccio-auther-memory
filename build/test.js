"use strict";

var _clientDynamodb = require("@aws-sdk/client-dynamodb");

(async () => {
  const client = new _clientDynamodb.DynamoDBClient({
    region: "ap-south-1",
    credentials: {
      sessionToken: "IQoJb3JpZ2luX2VjEPH//////////wEaCmFwLXNvdXRoLTEiRzBFAiEAm1BiExGC7weZQpIxS2AO8HtJJF+EqSnq97V8iu8/Kr8CIECRUrszlL+RSFruz2Bykl0Vo0YKKemJKjVc5WywXikjKpsCCEoQAhoMNDQ4OTAzNzgzOTMzIgwcQsJD26JtpiXUGIQq+AGr0wlNN9s92H7WPl5MFvwOCdMnXt3RDKETghOJp7oH4QSwRBKXFb+NZApsJs/C6LUB5wTf7ghBMuG+psd8duoD1VMh4Kjn0Go99GdRiM3JqsZnI7NrHjB4HCbjRj9DEn41s+/mxrqStxBE35D2XwAKa9c8aZwV6MZnbLbcY2KQuGKmKidPC9wC3uhy+eOJEW49pthEm3mCCIZt1UZm0sq6cSYemQdcZ/z4yLkrli75lwrU2RbEyHzM9feFVOM0qubR8iNyOayVan+F9Fj24ok3+3KxIOpR9Y8u0W0gtpRqfTXirdfxLPa5SeN64XZaz5gfVZIBV4uIMDD5qYOKBjrZAUdfJvfbZAiqfTY4ZpBUhHohGCdHJGb3borDCTmyodI31ifOg9ArbfR7vvLqvuZotT1+m0nTRXZPaMVHG8ubCVbMXP02FwEmqKsMS4fm/2K7JH/dnTvUgLliB9E64+hbMvIFVW8qsn2uyncWGZ/KWSwWVf+XsipL/Kea7JZRu0ZOzQNtI64HLdLK0P1QKkOpqDrth/VU5Mk/EQad3BByMmSBhedFBZtqoyXh37+7kZk/IxAyUJH2aRrlZAGhyCG6woC4B+IVEEGLebKtLQTpVuLbvjzQIKMg+Kc=",
      accessKeyId: "ASIAWRBGAEX64AFMVIJC",
      secretAccessKey: "rgR9eJMn3AsX29qJxqk87FG/jCxMeqwohnZ+0lAr"
    }
  }); // const command = new CreateTableCommand({
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

  const command = new _clientDynamodb.ScanCommand({
    TableName: "setu-verdaccio-logins"
  });

  try {
    var _results$Items;

    const results = await client.send(command);
    (_results$Items = results.Items) === null || _results$Items === void 0 ? void 0 : _results$Items.forEach(console.log);
  } catch (err) {
    console.error(err);
  }
})();
//# sourceMappingURL=test.js.map