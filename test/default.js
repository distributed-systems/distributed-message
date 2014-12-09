
	
	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, assert 		= require('assert');



	var Message = require('../')



	describe('The Message', function(){
		it('should not throw erros when instantiated', function(){
			new Message();
		});

		it('should accept an uid sender via its constructor', function(){
			new Message({
				sender: 'uid---------d'
			});
		});	

		it('should accept an object sender via its constructor', function(){
			new Message({
				sender: {
				 	  id: 'broker'
					, applicationId: 'tradr'
					, version: '0.1.0'
				}
			});
		});	

		it('should accept an uid receipient via its constructor', function(){
			new Message({
				receipient: 'uid---------d'
			});
		});	

		it('should accept an object receipient via its constructor', function(){
			new Message({
				receipient: {
				 	  id: 'broker'
					, applicationId: 'tradr'
					, version: '0.1.0'
				}
			});
		});	

		

		it('should return an uid sender set via its constructor', function(){
			var message = new Message({
				sender: 'uid---------d'
			});

			assert.equal(JSON.stringify(message.sender), '{"uid":"uid---------d"}');
		});	

		it('should return an object sender set via its constructor', function(){
			var message = new Message({
				sender: {
				 	  id: 'broker'
					, applicationId: 'tradr'
					, version: '0.1.0'
				}
			});

			assert.equal(JSON.stringify(message.sender), '{"id":"broker","applicationId":"tradr","version":"0.1.0"}');
		});	

		

		it('should return an uid sender set via its constructor', function(){
			var message = new Message({
				recipient: 'uid---------d'
			});

			assert.equal(JSON.stringify(message.recipient), '{"uid":"uid---------d"}');
		});	

		it('should return an object sender set via its constructor', function(){
			var message = new Message({
				recipient: {
				 	  id: 'broker'
					, applicationId: 'tradr'
					, version: '0.1.0'
				}
			});

			assert.equal(JSON.stringify(message.recipient), '{"id":"broker","applicationId":"tradr","version":"0.1.0"}');
		});	



		

		it('should accepts an uid sender set via its constructor as valid', function(){
			var message = new Message({
				sender: 'uid---------d'
			});

			assert(message.isValid);
		});	

		it('should accepts an object sender set via its constructor as valid', function(){
			var message = new Message({
				sender: {
				 	  id: 'broker'
					, applicationId: 'tradr'
					, version: '0.1.0'
				}
			});

			assert(message.isValid);
		});	

		

		it('should accepts an uid recipient set via its constructor as valid', function(){
			var message = new Message({
				recipient: 'uid---------d'
			});

			assert(message.isValid);
		});	

		it('should accepts an object recipient set via its constructor as valid', function(){
			var message = new Message({
				recipient: {
				 	  id: 'broker'
					, applicationId: 'tradr'
					, version: '0.1.0'
				}
			});

			assert(message.isValid);
		});	
	});
	