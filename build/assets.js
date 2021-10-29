
  var Module = typeof Module !== 'undefined' ? Module : {};
  
  if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
  }
  Module.expectedDataFileDownloads++;
  (function() {
   var loadPackage = function(metadata) {
  
      var PACKAGE_PATH = '';
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
      } else if (typeof process === 'undefined' && typeof location !== 'undefined') {
        // web worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
      }
      var PACKAGE_NAME = 'build/assets.data';
      var REMOTE_PACKAGE_BASE = 'assets.data';
      if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
        Module['locateFile'] = Module['locateFilePackage'];
        err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
      }
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
    
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];
      var PACKAGE_UUID = metadata['package_uuid'];
    
      function fetchRemotePackage(packageName, packageSize, callback, errback) {
        
        if (typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string') {
          require('fs').readFile(packageName, function(err, contents) {
            if (err) {
              errback(err);
            } else {
              callback(contents.buffer);
            }
          });
          return;
        }
      
        var xhr = new XMLHttpRequest();
        xhr.open('GET', packageName, true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = function(event) {
          var url = packageName;
          var size = packageSize;
          if (event.total) size = event.total;
          if (event.loaded) {
            if (!xhr.addedTotal) {
              xhr.addedTotal = true;
              if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
              Module.dataFileDownloads[url] = {
                loaded: event.loaded,
                total: size
              };
            } else {
              Module.dataFileDownloads[url].loaded = event.loaded;
            }
            var total = 0;
            var loaded = 0;
            var num = 0;
            for (var download in Module.dataFileDownloads) {
            var data = Module.dataFileDownloads[download];
              total += data.total;
              loaded += data.loaded;
              num++;
            }
            total = Math.ceil(total * Module.expectedDataFileDownloads/num);
            if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
          } else if (!Module.dataFileDownloads) {
            if (Module['setStatus']) Module['setStatus']('Downloading data...');
          }
        };
        xhr.onerror = function(event) {
          throw new Error("NetworkError for: " + packageName);
        }
        xhr.onload = function(event) {
          if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            var packageData = xhr.response;
            callback(packageData);
          } else {
            throw new Error(xhr.statusText + " : " + xhr.responseURL);
          }
        };
        xhr.send(null);
      };

      function handleError(error) {
        console.error('package error:', error);
      };
    
        var fetchedCallback = null;
        var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

        if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
          if (fetchedCallback) {
            fetchedCallback(data);
            fetchedCallback = null;
          } else {
            fetched = data;
          }
        }, handleError);
      
    function runWithFS() {
  
      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }
  Module['FS_createPath']("/", "assets", true, true);
Module['FS_createPath']("/assets", "chars", true, true);
Module['FS_createPath']("/assets/chars", "kfm", true, true);
Module['FS_createPath']("/assets", "data", true, true);
Module['FS_createPath']("/assets", "font", true, true);
Module['FS_createPath']("/assets", "stages", true, true);

          /** @constructor */
          function DataRequest(start, end, audio) {
            this.start = start;
            this.end = end;
            this.audio = audio;
          }
          DataRequest.prototype = {
            requests: {},
            open: function(mode, name) {
              this.name = name;
              this.requests[name] = this;
              Module['addRunDependency']('fp ' + this.name);
            },
            send: function() {},
            onload: function() {
              var byteArray = this.byteArray.subarray(this.start, this.end);
              this.finish(byteArray);
            },
            finish: function(byteArray) {
              var that = this;
      
          Module['FS_createPreloadedFile'](this.name, null, byteArray, true, true, function() {
            Module['removeRunDependency']('fp ' + that.name);
          }, function() {
            if (that.audio) {
              Module['removeRunDependency']('fp ' + that.name); // workaround for chromium bug 124926 (still no audio with this, but at least we don't hang)
            } else {
              err('Preloading file ' + that.name + ' failed');
            }
          }, false, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
  
              this.requests[this.name] = null;
            }
          };
      
              var files = metadata['files'];
              for (var i = 0; i < files.length; ++i) {
                new DataRequest(files[i]['start'], files[i]['end'], files[i]['audio'] || 0).open('GET', files[i]['filename']);
              }
      
        
      function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        
          // Reuse the bytearray from the XHR as the source for file reads.
          DataRequest.prototype.byteArray = byteArray;
    
            var files = metadata['files'];
            for (var i = 0; i < files.length; ++i) {
              DataRequest.prototype.requests[files[i].filename].onload();
            }
                Module['removeRunDependency']('datafile_build/assets.data');

      };
      Module['addRunDependency']('datafile_build/assets.data');
    
      if (!Module.preloadResults) Module.preloadResults = {};
    
        Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
        if (fetched) {
          processPackageData(fetched);
          fetched = null;
        } else {
          fetchedCallback = processPackageData;
        }
      
    }
    if (Module['calledRun']) {
      runWithFS();
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
    }
  
   }
   loadPackage({"files": [{"filename": "/assets/chars/kfm/ending.def", "start": 0, "end": 2047}, {"filename": "/assets/chars/kfm/ending.sff", "start": 2047, "end": 51005}, {"filename": "/assets/chars/kfm/intro.def", "start": 51005, "end": 53994}, {"filename": "/assets/chars/kfm/intro.sff", "start": 53994, "end": 144421}, {"filename": "/assets/chars/kfm/kfm.act", "start": 144421, "end": 145189}, {"filename": "/assets/chars/kfm/kfm.air", "start": 145189, "end": 192381}, {"filename": "/assets/chars/kfm/kfm.cmd", "start": 192381, "end": 213520}, {"filename": "/assets/chars/kfm/kfm.cns", "start": 213520, "end": 278544}, {"filename": "/assets/chars/kfm/kfm.def", "start": 278544, "end": 279531}, {"filename": "/assets/chars/kfm/kfm.sff", "start": 279531, "end": 842551}, {"filename": "/assets/chars/kfm/kfm.snd", "start": 842551, "end": 919182}, {"filename": "/assets/chars/kfm/kfm2.act", "start": 919182, "end": 919950}, {"filename": "/assets/chars/kfm/kfm3.act", "start": 919950, "end": 920718}, {"filename": "/assets/chars/kfm/kfm4.act", "start": 920718, "end": 921486}, {"filename": "/assets/chars/kfm/kfm5.act", "start": 921486, "end": 922254}, {"filename": "/assets/chars/kfm/kfm6.act", "start": 922254, "end": 923022}, {"filename": "/assets/chars/kfm/readme.txt", "start": 923022, "end": 928006}, {"filename": "/assets/data/common.snd", "start": 928006, "end": 1000711}, {"filename": "/assets/data/common1.cns", "start": 1000711, "end": 1044074}, {"filename": "/assets/data/fight.def", "start": 1044074, "end": 1061094}, {"filename": "/assets/data/fight.sff", "start": 1061094, "end": 1131219}, {"filename": "/assets/data/fight.snd", "start": 1131219, "end": 1220798}, {"filename": "/assets/data/fightfx.air", "start": 1220798, "end": 1224719}, {"filename": "/assets/data/fightfx.sff", "start": 1224719, "end": 1372934}, {"filename": "/assets/data/mugen.cfg", "start": 1372934, "end": 1389773}, {"filename": "/assets/data/osu.air", "start": 1389773, "end": 1390133}, {"filename": "/assets/data/osu.sff", "start": 1390133, "end": 1409230}, {"filename": "/assets/data/osu.snd", "start": 1409230, "end": 1452380}, {"filename": "/assets/data/select.def", "start": 1452380, "end": 1455979}, {"filename": "/assets/data/system.def", "start": 1455979, "end": 1469362}, {"filename": "/assets/data/system.sff", "start": 1469362, "end": 1600291}, {"filename": "/assets/data/system.snd", "start": 1600291, "end": 1609267}, {"filename": "/assets/font/f4x6.fnt", "start": 1609267, "end": 1612295}, {"filename": "/assets/font/f6x8f.fnt", "start": 1612295, "end": 1616609}, {"filename": "/assets/font/f6x9.fnt", "start": 1616609, "end": 1621019}, {"filename": "/assets/font/f6x9f.fnt", "start": 1621019, "end": 1625326}, {"filename": "/assets/font/fpad.fnt", "start": 1625326, "end": 1626974}, {"filename": "/assets/font/jg.fnt", "start": 1626974, "end": 1634003}, {"filename": "/assets/font/n4x6.fnt", "start": 1634003, "end": 1635332}, {"filename": "/assets/font/name1.fnt", "start": 1635332, "end": 1639191}, {"filename": "/assets/font/num1.fnt", "start": 1639191, "end": 1641668}, {"filename": "/assets/stages/kfm.def", "start": 1641668, "end": 1653047}, {"filename": "/assets/stages/kfm.sff", "start": 1653047, "end": 1882806}, {"filename": "/assets/stages/stage0.def", "start": 1882806, "end": 1892922}, {"filename": "/assets/stages/stage0.sff", "start": 1892922, "end": 1897452}], "remote_package_size": 1897452, "package_uuid": "6c232a8a-983c-484f-8bac-e06faee69f87"});
  
  })();
  