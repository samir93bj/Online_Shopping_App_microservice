const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const amqplib = require('amqplib');

const { APP_SECRET, MESSAGE_BROKER_URL, EXCHANGE_NAME, CUSTOMER_BINDING_KEY } = require("../config");

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
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
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
		console.log(MESSAGE_BROKER_URL)
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
		console.log('Message has been published'+ message);
		await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
	} catch (error) { 
		throw error
	}
};

/* subscribe message */
module.exports.SubscriberMessage = async (channel, service) => {
	try {
		const appQueue = await channel.assertQueue(EXCHANGE_NAME);

		channel.bindQueue(appQueue.queue, EXCHANGE_NAME, CUSTOMER_BINDING_KEY);
		
		channel.consume(appQueue.queue, data => {
			console.log('Recived Data');
			console.log(data.content.toString());
			channel.ask(data);
		});

	} catch (error) {
		throw error
	}
};