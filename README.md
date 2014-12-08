# distributed-message

Abstract distributed framework message

Basic message that can be used for developing services of the distributed framework

## installation

npm i distributed-message

## build status

[![Build Status](https://travis-ci.org/eventEmitter/distributed-message.png?branch=master)](https://travis-ci.org/eventEmitter/distributed-message)


## api

This implementation has a very basic API, it gets extended by otehr message types


### Contructor

	var DistributedMessage = require('ditributed-message');

	// create a new message that is ready to be sent
	var message = new DistributedMessage({
		  sender: 'my-custom-uid'
		, recipient: {
			  applicationId : 'joinbox-website'
			, id 			: 'customer'
			, version 		: 0.1.x
		}
	});




### isValid()

checks the message validity (sender && recipient config must be present)

	var validMEssage = message.isValid();





### setSender(config)

Sets the sender config
	
	// set uid
	message.setSender('uid');

	// or set config
	message.setSender({
		  applicationId : 'joinbox-website'
		, id 			: 'customer'
		, version 		: 0.1.x
	})



### getSender(config)

Returns the sender config

	var config = message.getSender();



### setRecipient(config)

Sets the recipient config
	
	// set uid
	message.setRecipient('uid');

	// or set config
	message.setRecipient({
		  applicationId : 'joinbox-website'
		, id 			: 'customer'
		, version 		: 0.1.x
	})



### getRecipient(config)

Returns the recipient config

	var config = message.getRecipient();