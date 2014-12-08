!function() {

	var   Class 		= require('ee-class')
		, EventEmitter 	= require('ee-event-emitter')
		, type 			= require('ee-types')
		, log 			= require('ee-log');




	module.exports = new Class({
		inherits: EventEmitter


		// the messages target
		, _recipient: {
			  uid 			: null
			, applicationId	: null
			, id 			: null
			, version 		: null
		}


		// the messages source
		, _sender: {
			  uid 			: null
			, applicationId	: null
			, id 			: null
			, version 		: null
		}




		// getter / setter for the sender property
		, sender: {
			  get: this.returnSender
			, set: this.setSender
		}

		// getter / setter for the recipient property
		, recipient: {
			  get: this.returnRecipient
			, set: this.setRecipient
		}



		/**
		 * class cinstructor
		 */
		, init: function(options) {
			if (options.sender) this.setSender(options.sender);
			if (options.recipient) this.setSender(options.recipient);
		}




		/**
		 * check the message validity
		 */
		, isValid: function() {
			return this._isValid(this._sender) && this._isValid(this._recipient);
		}


		/**
		 * check recipient / sender for validity
		 */
		, _isValid: function(target) {
			if (type.string(target.uid)) return true;
			else if (type.string(target.id) && type.string(target.applicationId) && type.string(target.version)) return true;
			else return false;
		}




		/**
		 * set the sender
		 *
		 * @param <Mixed> string sender id or object sender config
		 */
		, setSender: function(config) {
			if (type.string(config)) {
				// uid
				if (config.length > 10) this._sender.uid = config;
				else throw new Error('The sender uid must have a length of at least 11 characters!');
			}
			else if (type.object(config)) {
				// config object
				if (!type.string(config.applicationId)) throw new Error('missing the application id in the sender object!');
				if (!type.string(config.id)) throw new Error('missing the id in the sender object!');
				if (!type.string(config.version)) throw new Error('missing the version in the sender object!');

				this._sender.id  			= config.id;
				this._sender.applicationId  = config.applicationId;
				this._sender.version 		= config.version;
			}
			else throw new Error('Sender id mus tbe  an uid or a sender config object!');
		}


		/**
		 * returns the sender object
		 */
		, getSender: function() {
			return this._sender;
		}


		/**
		 * set the sender
		 *
		 * @param <Mixed> string recipient id or object recipient config
		 */
		, setRecipient: function(config) {
			if (type.string(config)) {
				// uid
				if (config.length > 10) this._recipient.uid = config;
				else throw new Error('The recipient uid must have a length of at least 11 characters!');
			}
			else if (type.object(config)) {
				// config object
				if (!type.string(config.applicationId)) throw new Error('missing the application id in the recipient object!');
				if (!type.string(config.id)) throw new Error('missing the id in the recipient object!');
				if (!type.string(config.version)) throw new Error('missing the version in the recipient object!');

				this._recipient.id  			= config.id;
				this._recipient.applicationId  = config.applicationId;
				this._recipient.version 		= config.version;
			}
			else throw new Error('Sender id mus tbe  an uid or a recipient config object!');
		}


		/**
		 * returns the sender object
		 */
		, getRecipient: function() {
			return this._recipient;
		}
	});
}();
