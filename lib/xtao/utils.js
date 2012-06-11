var fs = require('fs'),
    mkdirp = require('mkdirp'),
    os = require('os');


var exports = {
    /**
     * Check if the given direcoty path is empty
     * @param {String} path
     * @param {Function} fn
     */
    emptyDirectory: function(path, fn){
        fs.readdir(path, function(err, files){
            if(err && 'ENOENT' != err.code){ throw err; }
            fn(!files || !files.length);
        });
    },

    mkdir: function(path, fn){
        mkdirp(path, 0755, function(err){
            if(err){ throw err; }
            console.log('   \033[36mcreate\033[0m : ' + path);
            'function' === typeof fn && fn(path);
        });
    },

    write: function(path, str){
        fs.writeFile(path, str);
        console.log('   \x1b[36mcreate\x1b[0m : ' + path);
    },

    read: function(path, charset){
        return fs.readFileSync(path, charset || 'utf-8');
    },

    getEOL: function(){
        var eol = os.platform ? ('win32' === os.platform() ? '\r\n' : '\n') : '\n';
        return function(){ return eol; }
    }(),

    abort: function(str){
        if(str){ console.error(str); }
        console.error('\033[31mAbort!\033[0m');
        process.exit(1);
    },

    isEmptyObject: function(obj){
        for(var name in obj){
            return false;
        }
        return true;
    }
};

module.exports = exports;