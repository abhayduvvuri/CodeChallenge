import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient;

async function getHero(event, context) {
  let hero;
  const { id } = event.pathParameters;

  try{
      const result = await dynamodb.get({
        TableName: process.env.HEROES_TABLE_NAME,
        Key: { id }
      }).promise();
      hero = result.Item;

    
  }catch (error){
      console.error(error);
  }

  if (!hero){
      throw new createError.NotFound('Not found');
  }
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ hero }),
  };
}

export const handler = commonMiddleware(getHero);