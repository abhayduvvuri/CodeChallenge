import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient;

async function getHeroes(event, context) {
  let heroes;

  try{
    const result = await dynamodb.scan({
        TableName: process.env.HEROES_TABLE_NAME}).promise();
        heroes = result.Items;
  }catch (error){
      console.error(error);
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ heroes }),
  };
}

export const handler = commonMiddleware(getHeroes);


