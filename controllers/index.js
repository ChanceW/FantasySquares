const apiController = {
  players: require("./players").players,
  positions: require("./positions").positions,
  rules: require("./rules").rules,
  auth: require("./auth").auth,
  settings: require("./settings").settings,
};
module.exports = apiController;
