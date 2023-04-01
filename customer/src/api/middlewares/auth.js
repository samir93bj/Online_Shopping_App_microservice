const { ValidateSignature } = require('../../utils');
const { AuthorizeError } = require('../../utils/error/app-errors')

module.exports = async (req,res,next) => {
	try {
		const isAuthorized = await ValidateSignature(req);

		if(!isAuthorized){
				throw new AuthorizeError('Token is not authorized')
		}
	} catch (err) { 
		next(err)
	}

	next()
}