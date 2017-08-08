module.exports = require("yargs")
  .usage("$0 [flags]")
  .options({
    "d":{
      alias: "debug",
      boolean: true,
      default: false,
      desc: "Enable debug mode",
      defaultDescription: 'false'
    }
  })
  .help()
  .argv;
