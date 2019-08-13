const db = require('./../../db/models/index');
const Settings = db.Setting;
const config = require('../../config');

const corsOptions = {
  origin: (origin, callback) => {
    if (config.allowedOrigin.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin forbidden'));
    };
  }
};

const settingsRouter = function (app) {

  const retrieveSettings = () => {
    return Settings.findAll({
      order: [ ['id', 'ASC']]
    });
  };

  const settingError = {
    error: true
  }

  app.get('/api/settings/tours_open', async (req, res) => {
    let toursOpen = await Settings.findOne({
      where: { name: 'tours open' },
    });
    let toursClosedMessage;
    if(!toursOpen.dataValues.value){
      toursClosedMessage = await Settings.findOne({
        where: { name: 'tours closed message' }
      });
    };
    let payload = { toursOpen, toursClosedMessage };
    res.json(payload);
  });

  app.get('/api/settings', (req, res) => {
    let settings = retrieveSettings();
    settings
      .then((results) => {
        res.json(results)
      })
      .catch((error) => {
        res.json(settingError);
      });
  });

  app.post('/api/settings/update', async (req, res) => {
    let settings = req.body.settings;
    settings.forEach(async (setting) => {
      let id = setting.id;
      delete setting.id;
      delete setting.createdAt;
      delete setting.updatedAt;
      let s = await Settings.findOne({
        where: { id: id }
      });
      s.update(setting)
        .catch((error) => {
          res.json(settingError);
        });
    });
    
  });

};

module.exports = settingsRouter;
