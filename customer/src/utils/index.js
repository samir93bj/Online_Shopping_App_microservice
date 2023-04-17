const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BadRequestError } = require("../utils/error/app-errors")
const amqplib = require('amqplib');
const { MESSAGE_BROKER_URL, EXCHANGE_NAME, SHOPPING_BINDING_KEY, PRODUCT_BINDING_KEY } = require('../config');

const { APP_SECRET } = require("../config");

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "1h" });
  } catch (error) {
    throw new BadRequestError('Token is not valid');
  }
};

module.exports.ValidateSignature = async (req) => {
    const signature = req.get("Authorization");

		if (!signature)
			return false

    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;

    return true;
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};


/********************************* MESSAGE BROKER ************************************/

/* Create a channel*/
module.exports.CreateChannel = async () => {
	try {
		const connection = await amqplib.connect(MESSAGE_BROKER_URL);
		const channel = await connection.createChannel();
	
		await channel.assertExchange(EXCHANGE_NAME, 'direct', false);
	
		return channel;	
	} catch (error) {
		throw error
	}
};

/* publish messages */
module.exports.PublishMessage = async (channel, binding_key, message) => {
	try {
		await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
	} catch (error) { 
		throw error
	}
};

/* subscribe message */
module.exports.SubscriberMessage = async (channel, service, binding_key) => {
	try {
		const appQueue = await channel.assertQueue(EXCHANGE_NAME);

		channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);
		
		channel.consume(appQueue.queue, data => {
			console.log('Recived Data');
			console.log(data.content.toString());
			channel.ask(data);
		});

	} catch (error) {
		throw error
	}
};