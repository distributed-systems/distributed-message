!function() {

    var   Class         = require('ee-class')
        , EventEmitter  = require('ee-event-emitter')
        , type          = require('ee-types')
        , log           = require('ee-log')
        , uuid          = require('node-uuid');




    module.exports = new Class({
        inherits: EventEmitter

        // mark as message
        , isDistributedMessage: {
            get: function() { return true;}
        }


        // is this a multipart message, are there more parts to come?
        , isMultipartMessage: {
            get: function() { return this._isMultipartMessage;}
        }

        // does this message require a response from apper?
        // if yes, it needs to retained at each gateway so 
        // the response can be passed to it.
        // this message is the request, not the response part.
        // if the response is multipart it shopuld flag itself 
        // as that so the gateway doesn't loose context.
        , hasResponse: {
            get: function() {return this._hasResponse;}
        }



        // bsic message routing error status codes
        , SERVICE_TEMPORARILY_UNAVAILABLE   : 'service_temporarily_unavailable'
        , SERVICE_VERSION_UNAVAILABLE       : 'service_version_unavailable'
        , SERVICE_UNAVAILABLE               : 'service_unavailable'
        , APPLICATION_UNAVAILABLE           : 'application_unavailable'
        , INVALID_RECIPIENT                 : 'invalid_recipient'



        // multipart flag
        , _isMultipartMessage: false

        // callback messag etype
        , _hasResponse: false




        // the messages target
        , _recipient: null


        // the messages source
        , _sender: null

        
        // optional headers
        , _headers: null


        // optional message content
        , _content: null


        // mark as object of type ee-log loggable
        , _ee_serializable: true




        // getter / setter for the sender property
        , sender: {
              get: function() {return this.getSender();}
            , set: function(data) {return this.setSender(data);}
        }

        // getter / setter for the recipient property
        , recipient: {
              get: function() {return this.getRecipient();}
            , set: function(data) {return this.setRecipient(data);}
        }


        // getter & setter for thee haders
        , headers: {
              get: function() {return this._headers}
            , set: function(headers) {
                if (type.object(headers)) this._headers = headers;
                else throw new Error('Headers must be type of object, «'+type(headers)+'» given!');
            }
        }

        // getter & setter for thee haders
        , content: {
              get: function() {return this._content}
            , set: function(content) {
                this._content = content;
            }
        }



        /**
         * class cinstructor
         */
        , init: function(options) {
            // need to declare default objects here to
            // prevent cross instance sharing
            Class.define(this, '_headers', Class({}).Writable());
            Class.define(this, '_sender', Class({}).Writable());
            Class.define(this, '_recipient', Class({}).Writable());

            // set readonly uuid
            Class.define(this, 'messageId', Class(uuid.v4()).Enumerable());

            if (options) {
                // the constructor accepts senders & receivers
                if (options.sender) this.setSender(options.sender);
                if (options.recipient) this.setRecipient(options.recipient);

                // copy headers
                if (type.object(options.headers)) this._headers = options.headers;

                // set content
                if (!type.undefined(options.content)) this.content = options.content;
            }
        }
        



        /**
         * used to handle routing problemsm returns an error
         * to the sender service.
         *
         * @param <String> reason
         */
        , notRoutable: function(code, reason) {
            // TODO: remove the log line below, add logger to the router component
            log.warn('Unroutable message: '+code+' -> '+reason, this);
        }





        /**
         * returns if the message has an uid recipient
         */
        , hasUidRecipient: function() {
            return this._recipient && this._recipient.uid;
        }

        /**
         * returns if the message has a named recipient
         */
        , hasNamedRecipient: function() {
            return this._recipient && this._recipient.name;
        }


        /**
         * returns if the message has an uid sender
         */
        , hasUidSender: function() {
            return this._recipient && this._recipient.uid;
        }

        /**
         * returns if the message has a named sender
         */
        , hasNamedSender: function() {
            return this._recipient && this._recipient.name;
        }

        /**
         * returns the uid of the recipient object
         */
        , getUidRecipient: function() {
            return this._recipient ? this._recipient.uid : null;
        }
        

        /**
         * returns the uid of the recipient object
         */
        , getUidSender: function() {
            return this._sender ? this._sender.uid : null;
        }





        /**
         * check the message validity
         */
        , isValid: function() {
            return this._isValidTarget(this._sender) && this._isValidTarget(this._recipient);
        }


        /**
         * check recipient / sender for validity
         */
        , _isValidTarget: function(target) {
            if (type.string(target.uid)) return true;
            else if (type.string(target.id) && type.string(target.applicationId) && type.string(target.version)) return true;
            else return false;
        }




        /**
         * set content
         *
         * @param <Mixed> content
         *
         * @returns <DistributedMessage> this
         */
        , setContent: function(content) {
            this.content = content;
            return this;
        }


        /**
         * set headers
         *
         * @param <Mixed> headers
         *
         * @returns <DistributedMessage> this
         */
        , setHeaders: function(headers) {
            this.headers = headers;
            return this;
        }


        /**
         * set one headers
         *
         * @param <String> name
         * @param <String> value
         *
         * @returns <DistributedMessage> this
         */
        , setHeader: function(name, value) {
            this.headers[name] = value;
            return this;
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
                if (type.string(config.uid) && config.uid.length > 10) {
                     this._sender.uid = config.uid;
                }
                else {
                    if (!type.string(config.applicationId)) throw new Error('missing the application id in the sender object!');
                    if (!type.string(config.name)) throw new Error('missing the name in the sender object!');
                    if (!type.string(config.version)) throw new Error('missing the version in the sender object!');

                    this._sender.name           = config.name;
                    this._sender.applicationId  = config.applicationId;
                    this._sender.version        = config.version;
                }
            }
            else throw new Error('Sender id must be an uid or a sender config object!');
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
                if (type.string(config.uid) && config.uid.length > 10) {
                    this._recipient.uid = config.uid;
                }
                else {
                      // config object
                    if (!type.string(config.applicationId)) throw new Error('missing the application id in the recipient object!');
                    if (!type.string(config.name)) throw new Error('missing the name in the recipient object!');
                    if (!type.string(config.version)) throw new Error('missing the version in the recipient object!');

                    this._recipient.name              = config.name;
                    this._recipient.applicationId   = config.applicationId;
                    this._recipient.version         = config.version;
                }              
            }
            else throw new Error('Recipient id must be an uid or a recipient config object!');
        }


        /**
         * returns the sender object
         */
        , getRecipient: function() {
            return this._recipient;
        }


        /**
         * returns a clean json representation of this object
         *
         * @returns <Object> object representation
         */
        , toJSON: function() {
            return {
                  messageId : this.messageId
                , sender    : this.sender
                , recipient : this.recipient
                , headers   : this.headers
                , content   : this.content
            };
        }
    });
}();
