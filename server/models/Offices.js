const mongoose = require('mongoose');
const variables = require("../util/variables");

/**
 * @swagger
 *  components:
 *    schemas:
 *      Office:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          _id:
 *            type: ObjectId
 *            description: Unique identifier automatically added to the user.
 *          name:
 *            type: String
 *            default: ""
 *            description: Name of the user.
 *          email:
 *            type: String
 *            default: ""
 *            description: Email of the user, needs to be unique.
 *          location:
 *            type: String
 *            description: Location name as string.
 *          permissions:
 *            type: Object
 *            description: An object representing the true/false permission values for keys.
 *                         By default contains a permission set for 'admin' set to false.
 *          dateOfConsent:
 *            type: Date
 *            description: The consent date when a user signs the disclosure and consent form.
 *        example:
 *           name: Peter Parker
 *           email: pp_is_stuck@web.com
 *           location: New York
 *           dateOfConsent: "2020-05-13T19:52:51.297Z"
 *           permissions: { "admin": true, "read": true, "write": false }
 */
var OfficesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
   
    default: ""
  },
  address: {
    type: String,
    required: false,
    unique: false,
    index: false,
    default: ""
  },
  officeadmin: {
    type: String,
    required: false,
    default: ""
  }
}, {timestamps: true});

OfficesSchema.pre("save", function (next) {
    var office = this;
    // set admin
    //if(variables.ADMIN_USERS.includes(user.email.toLowerCase())) user.permissions.admin= true;
    next();

});


module.exports = mongoose.model('Offices', OfficesSchema);
