"use strict";

var _commander = _interopRequireDefault(require("commander"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var program = new _commander.default.Command();
program.command('init <projectName>').description('create and init a project by cp-cli').action(source => {
  console.log(source);

  require('./init')(...process.argv.slice(3));
});
program.version(require('../package.json').version, '-v --version');
program.parse(process.argv);