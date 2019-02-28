var username = "grayda" // Change this to match your GitHub username
var architectures = ["armv6l", "armv7l", "armv64", "x86", "x64"] // Architecture install scripts we want to generate
var reponame = "node-installscripts" // Set this to your repo's name (e.g. node-pi-zero or node-installscripts)

var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require("fs")
var async = require("async")
var semverSort = require("semver-sort")
var http = require('http')
var GetNodeVersions = require("get-node-versions").GetNodeVersions

gulp.task('generate', function(done) {
  var validVersions = []
  var template = fs.readFileSync("./templates/install-node-template.txt", "utf8")
  var readmeTemplate = fs.readFileSync("./templates/readme-template.txt", "utf8")
  var latestTemplate = fs.readFileSync("./templates/install-node-latest.txt", "utf8")
  gutil.log("Requesting all node versions..")
  GetNodeVersions.parse(["all"]).then(function(versions) {
    gutil.log(gutil.colors.blue("Found " + versions.length + " versions"))
    architectures.forEach(function(architecture) {
      fs.writeFileSync("README-" + architecture + ".md", readmeTemplate)
      if(!fs.existsSync(architecture)) {
        fs.mkdirSync(architecture)
      }
      async.map(versions, function(version, next) {
        options = {
          method: 'HEAD',
          host: "nodejs.org",
          port: 80,
          path: '/dist/v' + version + "/node-v" + version + "-linux-" + architecture + ".tar.gz"
        }

        var req = http.request(options, function(r, err) {
          if (r.statusCode == "200") {
            gutil.log(gutil.colors.green("v" + version + " has an " + architecture + " build. Writing install script.."))
            validVersions.push(version)
            next(null, version)
          } else {
            gutil.log(gutil.colors.red("v" + version + " has no " + architecture + " build. Skipping.."))
            next(null, null)
          }
        });

        req.on('error', function() {
            gutil.log(gutil.colors.red("Error trying to get v" + version + " (" + architecture + ")"))
            req.end()
        })
        if(typeof req != 'undefined') { req.end() }
      }, function() {
        if(typeof req != 'undefined') { req.end() }
        fs.appendFileSync("README-" + architecture + ".md", ["\n", "## Node for " + architecture, "", ""].join("\n"))
        fs.writeFileSync("./" + architecture + "/install-node-latest.sh", latestTemplate.replace(/@@ARCH@@/g, architecture).replace(/@@MIRROR@@/g, GetNodeVersions.NODEJS_MIRROR))
        semverSort.desc(validVersions).forEach(function(version) {
          gutil.log("Writing " + version + " (" + architecture + ") to file")
          fs.writeFileSync("./" + architecture + "/install-node-v" + version + ".sh", template.replace(/@@VERSION@@/g, version).replace(/@@ARCH@@/g, architecture).replace(/@@MIRROR@@/g, GetNodeVersions.NODEJS_MIRROR))
          fs.appendFileSync("README-" + architecture + ".md", ["### " + architecture + ": v" + version, "", "```sh", "wget https://raw.githubusercontent.com/" + username + "/" + reponame + "/master/" + architecture + "/install-node-v" + version + ".sh -O /tmp/install-node-v" + version + ".sh && source /tmp/install-node-v" + version + ".sh", "```", "", ""].join("\n"))
        })
        gutil.log(gutil.colors.cyan("Wrote " + validVersions.length + " versions"))
        done()
      })
    })
  })

})
