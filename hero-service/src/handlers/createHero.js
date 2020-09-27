import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient;

async function createHero(event, context) {
  const {name,photo,bio} = event.body;
    
  const hero = {
    id: uuid(),
    name,
    photo,
    bio,
  };
  try{
    await dynamodb.put({
      TableName: process.env.HEROES_TABLE_NAME,
      Item: hero,
    }).promise();
  } catch(error){
    console.error(error);
    throw new createError.InternalServerError(error);
  }
  

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ hero }),
  };
}

export const handler = commonMiddleware(createHero);