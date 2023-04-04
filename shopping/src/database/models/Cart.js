const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartSchema = new Schema({
    customerId: String,
    items: [
        {   
          product: {
						_id: { type: String, required: true },
						name: { type: String },
						banner: { type: String },
						price: { type: Number },
					} ,
					unit: { type: Number, required: true }
        }
    ]
},
{
    toJSON: {
        transform(doc, ret){
            delete ret.__v;
        }
    },
    timestamps: true
});

module.exports =  mongoose.model('cart', CartSchema);