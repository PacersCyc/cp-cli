"use strict";

var _inquirer = _interopRequireDefault(require("inquirer"));

var _chalk = _interopRequireDefault(require("chalk"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _ora = _interopRequireDefault(require("ora"));

var _util = require("util");

var _downloadGitRepo = require("./utils/downloadGitRepo");

var _install = require("./utils/install");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var exist = (0, _util.promisify)(_fs.default.stat);

var init = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (projectName) {
    var projectExist = yield exist(projectName).catch(e => {
      if (e.code !== 'ENOENT') {
        console.log(_chalk.default.redBright.bold(e));
      }
    });

    if (projectExist) {
      console.log(_chalk.default.redBright.bold('The file has exited！'));
      return;
    }

    _inquirer.default.prompt([{
      name: 'descrption',
      message: 'Please enter the project descrption'
    }, {
      name: 'author',
      message: 'Please enter the project author'
    }, {
      type: 'list',
      name: 'language',
      message: 'Please choose the program language',
      choices: ['JavaScript', 'TypeScript']
    }, {
      type: 'list',
      name: 'package',
      message: 'Please choose the package management',
      choices: ['yarn', 'npm']
    }]).then( /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(function* (answer) {
        console.log(answer);
        var loading = (0, _ora.default)('downloading template...');
        loading.start();
        loading.color = 'yellow';
        (0, _downloadGitRepo.download)(projectName, answer.language).then( /*#__PURE__*/_asyncToGenerator(function* () {
          loading.succeed();
          var packageFile = "".concat(projectName, "/package.json");

          if (yield exist(packageFile)) {
            var data = _fs.default.readFileSync(packageFile).toString();

            var json = JSON.parse(data);
            json.name = projectName;
            json.author = answer.author;
            json.descrption = answer.descrption;

            _fs.default.writeFileSync(packageFile, JSON.stringify(json, null, '\t'), 'utf-8');

            console.log(_chalk.default.green('Project initialization finished!' + '\n'));
            console.log(_chalk.default.yellowBright('start install dependencies...'));
            yield (0, _install.install)({
              cwd: _path.default.join(process.cwd(), projectName),
              package: answer.package
            }).then(() => {
              console.log();
              console.log('We suggest that you begin by typing:');
              console.log();
              console.log(_chalk.default.cyan('  cd'), projectName);
              console.log("  ".concat(_chalk.default.cyan("".concat(answer.package, " start"))));
            });
          }
        }), () => {
          loading.fail();
        });
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());
  });

  return function init(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = init;