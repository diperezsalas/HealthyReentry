const router = require('express').Router();

const User = require('../../models/User');
const Status = require('../../models/Status');
const Offices = require('../../models/Offices');

const triggerUpdates = require('../../lib/trigger_updates');


/**
 * @swagger
 * path:
 *  /api/status/report:
 *    post:
 *      summary: Submit a new status update for the current user.
 *      tags: [Status]
 *      parameters:
 *        - in: body
 *          name: status
 *          description: Status code to set for all users (use -1 to skip).
 *          schema:
 *            type: integer
 *            enum: [-1, 0, 1, 2]
 *        - in: body
 *          name: user
 *          description: Current active user (autopopulated).
 *          schema:
 *            $ref: '#/components/schemas/User'
 *      produces:
 *       - application/json
 *      responses:
 *        200:
 *          description: Current user's latest status.
 *        500:
 *          description: Server error.
 */
router.post("/report", function (req, res) {

  //First, search for latest status
  Status.find({
      "user": req.user._id
    }).sort({
      date: -1
    }).limit(1)
    .exec(function (err, statuses) {
      if (err) return res.status(500).send(err);

      var latestStatus;
      if (statuses && statuses.length > 0) {
        latestStatus = {
          status: statuses[0].status,
          date: statuses[0].date
        };
      }

      var status = new Status({
        status: req.body.status,
        symptoms: req.body.symptoms,
        user: req.user
      });

      status.save(async function (err, savedStatus) {

        const triggerData = {
          user: req.user,
          statusEnum: status.status
        };

        // no await
        triggerUpdates(triggerData, false, latestStatus);

        if (!err) return res.json(savedStatus);
        else return res.status(500).send(err);
      });
  });

});


/**
 * @swagger
 * path:
 *  /api/status/get-current:
 *    get:
 *      summary: Get the latest status for the current user.
 *      tags: [Status]
 *      produces:
 *       - application/json
 *      responses:
 *        200:
 *          description: Current user's latest status.
 *        500:
 *          description: Server error.
 */
router.get("/get-current", function (req, res) {
  Status.find({
      "user": req.user._id
    }).sort({
      date: -1
    }).limit(1)
    .exec(function (err, statuses) {
      if (statuses == null) res.json(null);
      if (!err) return res.json(statuses[0]);
      else return res.status(500).send(err);
    });

});


router.get("/get-all-offices", async function(req, res) {

  const ret = [];

  let include = {
      "_id": 1,
      "name": 1,
      "address": 1,
      "officeadmin": 1
  }

  const offices = await Offices.find({}, include).exec();

  for (let u of offices) {
      let nu = u.toObject();
      ret.push(nu)
  }

  res.json(ret);

});

router.post("/update-user", async function(req, res) {


  const myArray = await User.updateOne({ "_id": req.body.id }, { $set: { location: req.body.location } }, function(err, updateStatus) {
      if (err) throw err;

      return res.send(updateStatus);
  });


});


module.exports = router;
