const { check } = require('express-validator');
 
exports.signupValidation = [
    check('id', 'Name is requied').not().isEmpty(),
    check('name', 'Please include a valid username'),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('address', 'Please include a valid Email').isEmail().normalizeEmail({ email_remove_dots: true }),
    check('phone_number', 'Please include a valid Phone Number').isLength(12)
]
 
exports.loginValidation = [
     check('name', 'Please include a valid username'),
     check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
 
]