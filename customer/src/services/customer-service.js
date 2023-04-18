const { CustomerRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');
const { APIError, BadRequestError, NotFoundError } = require('../utils/error/app-errors')


// All Business logic will be here
class CustomerService {

    constructor(){
        this.repository = new CustomerRepository();
    }

    async SignIn(userInputs){
				const { email, password } = userInputs;
				const existingCustomer = await this.repository.FindCustomer({ email});

				if(!existingCustomer) 
					throw new NotFoundError('User not found with provided email id!');
					
				const validPassword = await ValidatePassword(password, existingCustomer.password, existingCustomer.salt);
							
				if(!validPassword)
					throw new NotFoundError('User or password is not valid!');
					
				const token = await GenerateSignature({ email: existingCustomer.email, _id: existingCustomer._id});
				return FormateData({id: existingCustomer._id, token });
    }

    async SignUp(userInputs){
				const { email, password, phone } = userInputs;

				const user = await this.repository.FindCustomer({ email })

				if (user) throw new NotFoundError('User already exist!');

					// create salt
				let salt = await GenerateSalt();
				
				let userPassword = await GeneratePassword(password, salt);
				
				const existingCustomer = await this.repository.CreateCustomer({ email, password: userPassword, phone, salt});
				
				const token = await GenerateSignature({ email: email, _id: existingCustomer._id});

				return FormateData({id: existingCustomer._id, token });
    }

    async AddNewAddress(_id, userInputs){
			try {
				const { street, postalCode, city,country} = userInputs;
				const addressResult = await this.repository.CreateAddress({ _id, street, postalCode, city,country})
				return FormateData(addressResult); 
			} catch (err) {
				throw new APIError('Data Not found', err)
			}
    }

    async GetProfile(id){
			try {
				const existingCustomer = await this.repository.FindCustomerById({id});
				return FormateData(existingCustomer);
					
			} catch (err) {
				throw new APIError('Data Not found', err)
			}
    }

    async GetShopingDetails(id){
			try {
				const existingCustomer = await this.repository.FindCustomerById({id});
	
				if(!existingCustomer) 
					return FormateData({ msg: 'Error'});
					
				return FormateData(existingCustomer);
			} catch (err) {
				throw new APIError('Data Not found', err)
			}
    }

    async GetWishList(customerId){

        try {
            const wishListItems = await this.repository.Wishlist(customerId);
            return FormateData(wishListItems);
        } catch (err) {
            throw new APIError('Data Not found', err)           
        }
    }

    async AddToWishlist(customerId, product){
        try {
          const wishlistResult = await this.repository.AddWishlistItem(customerId, product);     

          return FormateData(wishlistResult);
        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async ManageCart(customerId, product, qty, isRemove){
        try {
            const cartResult = await this.repository.AddCartItem(customerId, product, qty, isRemove);
            return FormateData(cartResult);
        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async ManageOrder(customerId, order){
        try {
            const orderResult = await this.repository.AddOrderToProfile(customerId, order);
            return FormateData(orderResult);
        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async SubscribeEvents(payload){
			
				payload = JSON.parse(payload)

        const { event, data } =  payload;

        const { userId, product, order, qty } = data;

        switch(event){
            case 'ADD_TO_WISHLIST':
								console.log('Estamos en este evento')
								this.AddToWishlist(userId,product)
							break;
            case 'REMOVE_FROM_WISHLIST':
                this.AddToWishlist(userId,product)
                break;
            case 'ADD_TO_CART':
                this.ManageCart(userId,product, qty, false);
                break;
            case 'REMOVE_FROM_CART':
                this.ManageCart(userId,product,qty, true);
                break;
            case 'CREATE_ORDER':
                this.ManageOrder(userId,order);
                break;
						case 'TEST':
								console.log('WORKING...... subscriber')
								break;
            default:
                break;
        }
 
    }

}

module.exports = CustomerService;