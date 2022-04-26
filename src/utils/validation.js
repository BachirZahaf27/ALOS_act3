const Joi = require('joi');

const taskSchema = {
    name: Joi.string().min(3).required(),
    website: Joi.string().uri().required(),
    address: Joi.string().uri().required(),
    base: Joi.string().uri().required(),
};

exports.validateTask = (task) => Joi.validate(task, taskSchema);